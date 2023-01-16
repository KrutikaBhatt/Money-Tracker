from django.http import HttpResponse
from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import viewsets,permissions,authentication,status, generics
from .serializers import CurrentUserSerializer,RegisterSerializer,FriendSerializer,TransactionSerializer,MembershipSerializer,LoginUserSerializer, GroupSerializer
from .models import Friend, Group, Membership, Transaction
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from knox.models import AuthToken
from django.core.serializers import serialize
import json

# Create your views here.
# APIView allow us to define functions that match standard HTTP methods like GET, POST, PUT, PATCH, etc.
# Viewsets allow us to define functions that match to common API object actions like : LIST, CREATE, RETRIEVE, UPDATE, etc.

class AllUsersView(viewsets.ModelViewSet):
    serializer_class = CurrentUserSerializer
    queryset = User.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]

class UserDetailAPI(APIView):
  authentication_classes = (authentication.TokenAuthentication,)
  permission_classes = (permissions.AllowAny,)
  def get(self,request,*args,**kwargs):
    body = json.loads(request.body)
    user = User.objects.get(id=body['id'])
    serializer = CurrentUserSerializer(user)
    return Response(serializer.data)

#Class based view to register user
class RegisterUserAPIView(generics.CreateAPIView):
  permission_classes = (permissions.AllowAny,)
  serializer_class = RegisterSerializer
  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
        "user": CurrentUserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)[1]
    })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer
    def post(self, request, *args, **kwargs):
      serializer = self.get_serializer(data=request.data)
      serializer.is_valid(raise_exception=True)
      user = serializer.validated_data
      return Response({
          "user": CurrentUserSerializer(user, context=self.get_serializer_context()).data,
          "token": AuthToken.objects.create(user)[1]
      })

# API to get all the friends of the user
class FriendsOfUser(generics.GenericAPIView):
  serializer_class = FriendSerializer
  queryset = Friend.objects.all()

  def get(self,request,*args,**kwargs):
    current_user_id = kwargs['pk']
    user = User.objects.get(id=current_user_id)
    friends = user.friend1.all()
    send_data = []
    # querydata = FriendSerializer(friends,many=True)
    for friend in friends:
      send_data.append({
        "id":friend.friend2.id,
        "friend":friend.friend2.username,
        "money_owes":friend.money_owed
      })
 
    return Response(send_data)

  def post(self,request,*args,**kwargs):
    current_user_id = kwargs['pk']
    friend_detail = json.loads(request.body)

    user = User.objects.get(id=current_user_id)
    friend = User.objects.get(id=friend_detail['id'])

    obj = Friend(friend1=user,friend2=friend)
    obj.save()

    return Response({"status":"successfull","message":"Friend created successfully"})

class Transactions(generics.GenericAPIView):
  permission_classes = (permissions.AllowAny,)
  serializer_class = TransactionSerializer

  def get(self, request, *args, **kwargs):
    all_transactions = Transaction.objects.all()
    querydata = TransactionSerializer(all_transactions,many=True)
    return Response(querydata.data)

  def post(self, request, *args, **kwargs):
    transaction_details = json.loads(request.body)
    group = Group(mygroup=transaction_details['name'], no_transactions=1)
    group.save()

    paid_by = User.objects.get(id=transaction_details['paid_by']) 
    added_by = User.objects.get(id=transaction_details['added_by']) 
    transactions = Transaction(group = group,amount=transaction_details['amount'],paid_by=paid_by,added_by=added_by,description=transaction_details['description'])
    transactions.save()

    total_members = len(transaction_details['members'])+1
    split = transaction_details['amount']/total_members

    membership_for_user = Membership(friend=paid_by,group=group,money_owed=split,paid=True)
    membership_for_user.save()

    for member in transaction_details['members']:
      friend = User.objects.get(id=member)
      member_obj = Membership(friend=friend,group=group,money_owed=split)
      member_obj.save()
    
    return Response({"success":"true","message":"Transaction created successfully"})

  def patch(self, request, *args, **kwargs):
    print(request.body)
    body = json.loads(request.body)
    update_grp = Group.objects.get(id = body['group_id'])
    update_trans = Transaction.objects.get(id = body['transaction_id'])

    update_grp.mygroup = body['name']
    # update_trans.amount = body['amount']
    update_trans.description = body['description']

    added_by = User.objects.get(id = body['added_by'])
    paid_by = User.objects.get(id = body['paid_by'])
    update_trans.added_by = added_by
    update_trans.paid_by = paid_by

    update_trans.save()
    update_grp.save()
    return Response({"message":"update successfull"})

  def delete(self, request, *args, **kwargs):
    try:
      body = json.loads(request.body)
      group_id = body['group_id']
      group = Group.objects.get(id = group_id)
      if group == None:
        return Response({"status": "fail", "message": f"Group with Id: {group_id} not found"}, status=status.HTTP_404_NOT_FOUND)

      group.delete()
      return Response({"status":"success","message":"Transacion deleted successfully"})
    except Exception as e:
      return Response({"status": "fail", "message": f"Group with Id: {group_id} not found"}, status=status.HTTP_404_NOT_FOUND)


class Dashboard(generics.GenericAPIView):
  permission_classes = (permissions.AllowAny,)
  def get(self, request, *args, **kwargs):
    current_user_id = kwargs['pk']
    send_data = []
    memberships = Membership.objects.filter(friend=current_user_id)
    print(memberships)
    for membership in memberships:
      card = {}
      card['group'] = membership.group.mygroup
      card['group_id'] = membership.group.id
      card['money_owed'] = membership.money_owed
      card['paid'] = membership.paid

      transaction = Transaction.objects.filter(group=membership.group.id)
      card['total_amount'] = transaction[0].amount
      card['added_by'] = transaction[0].added_by.username,
      card['paid_by'] = transaction[0].paid_by.username,
      card['description'] = transaction[0].description,
      card['date'] = transaction[0].date,
      card['transaction_id'] = transaction[0].id
      
      members_in_group = Membership.objects.filter(group=membership.group.id)
      members_list = []
      for member_in_group in members_in_group:
        members_list.append({
          "member_id" : member_in_group.id,
          "friend" : member_in_group.friend.username,
          "money_owed":member_in_group.money_owed,
          "paid":member_in_group.paid
        })
      card['members'] = members_list
      send_data.append(card)
    
    return Response({"data":send_data})

    # Pay the money
  def post(self, request, *args, **kwargs):
    details = json.loads(request.body)
    membership_id = details['member_id']

    update_membership = Membership.objects.get(id=membership_id)
    update_membership.paid = True
    update_membership.save()

    return Response({"message":"Amount Paid successfully"})

class GroupAPI(generics.GenericAPIView):
  permission_classes = (permissions.AllowAny,)
  serializer_class = GroupSerializer

  def post(self, request, *args, **kwargs):
    req_body = json.loads(request.body)
    current_user_id = req_body['user_id']
    req_groupid = req_body['group_id']
    send_data = []
    memberships = Membership.objects.filter(friend=current_user_id)
    print(memberships)
    for membership in memberships:
      card = {}
      if(membership.group.id==req_groupid):
        card['group'] = membership.group.mygroup
        card['group_id'] = membership.group.id
        card['money_owed'] = membership.money_owed
        card['paid'] = membership.paid

        transaction = Transaction.objects.filter(group=membership.group.id)
        card['total_amount'] = transaction[0].amount
        card['added_by'] = transaction[0].added_by.username,
        card['paid_by'] = {"username":transaction[0].paid_by.username,"id":transaction[0].paid_by.id},
        card['description'] = transaction[0].description,
        card['date'] = transaction[0].date,
        card['transaction_id'] = transaction[0].id
        
        members_in_group = Membership.objects.filter(group=membership.group.id)
        members_list = []
        for member_in_group in members_in_group:
          members_list.append({
            "member_id" : member_in_group.id,
            "friend" : member_in_group.friend.username,
            "money_owed":member_in_group.money_owed,
            "paid":member_in_group.paid
          })
        card['members'] = members_list
        send_data.append(card)
    
    return Response({"data":send_data})


class FilterAPI(generics.GenericAPIView):
  permission_classes = (permissions.AllowAny,)
  def get(self, request, *args, **kwargs):
    body = json.loads(request.body)
    start_date = body['start_date']
    end_date = body['end_date']

    filtered_transactions = Transaction.objects.filter(
        timestamp__range=[start_date, end_date]
    )

    querydata = TransactionSerializer(filtered_transactions,many=True)
    return Response(querydata)