import React, { useState, useEffect} from 'react';
import "./index.css";
import MainLogo from '../components/sidebar/MainLogo';
import UserItem from '../components/sidebar/UserItem';
import SideBarItems from '../components/sidebar/SideBarItems';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import { useHistory } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';

function SideBar () {
    const user = JSON.parse(localStorage.getItem('user-info')).user;
    const history = useHistory();
    const [friends,setFriends] = useState(null);
    const [addfriend,setaddFriend] = useState(false);
    const[friendadd,setfriendadd] = useState();
    const[users,setUsers] = useState();

    function logout(){
        localStorage.clear();
        history.push('/login');
    }
    useEffect(() => {
        const getData = async () => {
          try {
            let get_request = 'http://127.0.0.1:8000/myfriends/'+user.id+'/';
            const response = await axios.get(get_request)
            const allusers = await axios.get('http://127.0.0.1:8000/api/users/');
            setUsers(allusers.data);
            setFriends(response.data);
          } catch (err) {
            setUsers(null);
            setFriends(null);
          } 
        };
        getData();
    }, []);

    async function createNewFriend(){
      let result= await fetch( `http://127.0.0.1:8000/myfriends/${user.id}/`,{
      method:'POST',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify({"id":friendadd})
      });
      result = await result.json();
      window.location.reload();
    }
    
    return (
        <div className='sidebar-main'>
            <MainLogo/>
            <div className='sidebar-item'>
            <UserItem name={`${user.first_name}`} lastName={user.last_name} email={user.email} icon={<PersonOutlineIcon style={{color:'white',fontSize:"30px"}} />}/>
            <div className='sidebar-items'>
            <div className='sidebar-grp' ><span>My Friends</span><AddIcon onClick={()=>{setaddFriend(!addfriend)}} style={{cursor:'pointer'}}/></div>
            
            {addfriend?(<div style={{display:'flex',justifyContent:'center',textAlign:'initial'}}>
              <FormControl style={{width:'90%',height:'70%',marginTop:'8px'}}>
              <InputLabel>Add Friend</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={friendadd}
                autoWidth
                label="Add Friend"
                onChange={(e)=>{setfriendadd(e.target.value)}}
                
              >
              {users?.map((name) => (
                <MenuItem
                  key={name.id}
                  value={name.id}
                >
                  {name.first_name} {name.last_name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <div style={{textAlign:'center',backgroundColor:'rgb(150 139 176)',borderRadius:'0.5vw',padding:'8px',margin:'10px',cursor:'pointer',marginTop:'13px'}}  onClick={()=>{createNewFriend()}} >
              <AddIcon style={{color:'white',marginTop:'auto'}}/>
            </div>
            </div>):(<></>)}
            <div className='groupss'>
            {friends?.map(post=>{
                return(    
                    <SideBarItems name={post.friend} id={post.id} key={post.id} icon={<PeopleOutlineIcon />}/>
                )
            })}
            </div>
            </div>
            
            </div>
            <div className='logout' onClick={logout}>
                <LogoutIcon style={{fontSize:'19px'}}/>
                <p>Logout</p>
            </div>
        </div>
    );
}

export default SideBar;