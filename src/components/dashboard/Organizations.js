import React,{useEffect,useState} from 'react'
import Events from './Events'
import "./index.css"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

export default function Organizations({user_detail, name,id,fun,group_detail}) {
  const [editModal, seteditModal] = useState(false);
  const[split, setSplit]=useState(false);

  const[users,setUsers] = useState();
  const curruser = JSON.parse(localStorage.getItem("user-info")).user
  // Edit fields
  const [editName,seteditName] = useState();
  const [editAmount,seteditAmount] = useState();
  const [editpaidby, seteditpaidby] = useState();
  const [editDesc, seteditDesc] = useState();
  const [editmembers, seteditmembers] = useState();
  const [addnewmembers, setaddnewmembers] = useState([]);
  const [editdeleteMembers, seteditdeleteMembers] = useState([]);
  const [editgroupId, seteditgroupId] = useState();
  const [edittransactionId, settransactionId] = useState();

  useEffect( () => {
    async function fetchData() {
      let get_request = 'http://127.0.0.1:8000/myfriends/'+curruser.id+'/';
      const response = await axios.get(get_request)
      setUsers(response.data);
    }
    fetchData();
  },[]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    boxShadow: 24,
    p: 4,
  };
  async function deleteTransaction(group_id){
    try{
      let result= await fetch('http://127.0.0.1:8000/transactions/',{
      method:'DELETE',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify({"group_id":group_id})
      });
      result = await result.json();
      window.location.reload();
    }catch(e){
      console.log(e)
    }
  }

  async function EditTransaction(group){
    try{
      let result= await fetch('http://127.0.0.1:8000/group/',{
      method:'POST',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify({"user_id":curruser.id,"group_id":group.group_id})
      });
      result = await result.json();
      result = result.data[0]

      seteditName(result.group);
      seteditAmount(result.total_amount);
      seteditpaidby(result.paid_by[0].id);
      seteditDesc(result.description[0]);
      seteditmembers(result.members);
      seteditgroupId(group.group_id);
      settransactionId(group.transaction_id);
      seteditModal(true);
      
      console.log("Edit Transaction clicked ",group.group_id)
    }catch(e){
      console.log(e)
    }
  }

  const handleSelectPaidByChange = (event) => {
    seteditpaidby(event.target.value);
  };

  function DeleteMembers(id){
    let send_data = []
    let temp_members = editmembers
    let temp_delete_members = []
    temp_delete_members = temp_delete_members.push(id)
    seteditdeleteMembers(temp_delete_members)
    for (let item of temp_members){
      if(item.member_id != id){
        send_data.push(item);
      }
    }

    seteditmembers(send_data);
  }
  async function makeEditRequest(){
    let post_data = {
      "group_id":editgroupId,
      "transaction_id":edittransactionId,
      "name":editName,
      "description":editDesc,
      "paid_by":editpaidby,
      "added_by":curruser.id,
      "amount":editAmount,
      "delete_users":editdeleteMembers
    }
    
    let result= await fetch('http://127.0.0.1:8000/transactions/',{
      method:'PATCH',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify(post_data)
      });
      result = await result.json();
      window.location.reload();
  }
  return (
    <>
    {split ?
    <></>
    :
    <>
    {/* EDIT Transaction model */}
    <Modal
        open={editModal}
        onClose={()=>{seteditModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <p>Edit Transaction</p>
          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',gap:'10px'}}>
          <TextField label="Name" defaultValue={editName} onChange={(e)=>{seteditName(e.target.value)}}/>
          <TextField label="Description" defaultValue={editDesc} onChange={(e)=>{seteditDesc(e.target.value)}} style={{width:'100%'}}/>
          <TextField label="Amount" defaultValue={editAmount} onChange={(e)=>{seteditAmount(e.target.value)}}/>
          
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Paid By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue={editpaidby}
              value={editpaidby}
              label="Paid By"
              onChange={handleSelectPaidByChange}
            >
              {users?.map((name) => (
                <MenuItem key={name.id} value={name.id}>{name.friend}</MenuItem>))}
            </Select>
          </FormControl>

          <p style={{display:'block',margin:'0',padding:'0'}}><p style={{display:'flex',fontSize:'18px'}}><span>Members</span><AddIcon style={{marginLeft:'2px'}}/></p>
          
          {editmembers?.map((name) => (
            <>
            <p style={{display:'flex',margin:'0',padding:'0',marginLeft:'10px',marginTop:'5px'}} key={name.member_id}><span>{name.friend}</span><ClearIcon style={{marginLeft:'2px', cursor:'pointer'}} onClick={()=>DeleteMembers(name.member_id)}/></p>
            </>
          ))}
          </p>
          
          </div>
          <div style={{textAlign:'center',backgroundColor:'#674fa3',borderRadius:'0.5vw',padding:'2px',marginTop:'10px',cursor:'pointer'}}  onClick={()=>{makeEditRequest()}} >
            <p style={{color:'white'}}>Edit Transaction</p>
            </div>
        </Box>
      </Modal>
      {/* Edit transaction ends here */}
    <div className='org-main'>
        <div className='org-heading'>
            <p className='org-name'>{name}</p>
            <div className='org-icons'>
                <div><p>₹{group_detail.total_amount}</p></div>  
                <div onClick={()=>{EditTransaction(group_detail)}} style={{cursor:'pointer'}}><EditIcon style={{fontSize:"20px"}} /></div>
                <div onClick={()=>{deleteTransaction(group_detail.group_id)}} style={{cursor:'pointer'}}  ><DeleteOutlineIcon style={{fontSize:"20px"}} /></div>
            </div>
        </div>
        <div className='description-block'>
          <p><span style={{fontWeight:'bold'}}>Description :</span>  {group_detail.description}</p>
          <p><span style={{fontWeight:'bold'}}>Added by :</span>  {group_detail.added_by[0]}</p>
          <p><span style={{fontWeight:'bold'}}>Paid by :</span>  {group_detail.paid_by[0]}</p>
        </div>
        {
          group_detail.members?.map(post=>{
            
            return(
                <>
                 <Events name={post.friend} key={post.member_id} isPaid={post.paid} amt={post.money_owed} current_username={user_detail.username} current_id= {user_detail.id}/>
                 
                </>
            )
          }
          )
        }
    </div>
    </>
}
</>
  )
}
