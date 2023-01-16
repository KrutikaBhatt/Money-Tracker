from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from money_tracker_backend import views
from knox import views as knox_views

router = routers.DefaultRouter()
router.register('users', views.AllUsersView, 'AllUsers')
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('get-details/',views.UserDetailAPI.as_view()),
    path('register/',views.RegisterUserAPIView.as_view()),
    path('login/',views.LoginAPI.as_view()),
    path('logout/',knox_views.LogoutView.as_view()),
    path('logoutall/', knox_views.LogoutAllView.as_view()),

    # User Dashboard Routes
    path('myfriends/<int:pk>/',views.FriendsOfUser.as_view()),
    path('transactions/',views.Transactions.as_view()),
    path('dashboard/<int:pk>',views.Dashboard.as_view()),
    path('group/',views.GroupAPI.as_view())
]
