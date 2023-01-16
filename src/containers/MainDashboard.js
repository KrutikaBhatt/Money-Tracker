import React,{useState,useEffect} from 'react'
import "./index.css"
import TextField from '@mui/material/TextField';
import TopContainer from '../components/dashboard/TopContainer';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';

export default function MainDashboard() {
  const user = JSON.parse(localStorage.getItem('user-info')).user;
  const [groups,setGroups] = useState();
  const[users,setUsers] = useState();
  const [personName, setPersonName] = useState([]);
  const currUser = JSON.parse(localStorage.getItem('user-info')).user
  

  useEffect(() => {
    async function fetchData() {
     let Allgroups= await fetch(`http://127.0.0.1:8000/dashboard/${currUser.id}`,{
      method:'GET',
      headers:{
          "Content-Type":"application/json",
          "Accept":"application/json",
      },});

      let get_request = 'http://127.0.0.1:8000/myfriends/'+user.id+'/';
      const response = await axios.get(get_request)
      setUsers(response.data);
      Allgroups = await Allgroups.json();
      setGroups(Allgroups);
      console.log(Allgroups);
    }
    fetchData();
  },[]);
  
  const handleCheckedPaidBy = (event) => {
    setChecked(event.target.checked);
  };

  const handleChange = (event) => {
    setPersonName(
      typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,
    );
  };

  const handleSelectPaidByChange = (event) => {
    setPaidBy(event.target.value);
  };
  const [open, setOpen] = useState(false);
  const [grpName,setGrpName] = useState();
  const [grpDesc,setGrpDesc] = useState();
  const [grpBudget,setGrpBudget] = useState();
  const [checked, setChecked] = useState(true);
  const [paid_by, setPaidBy] = useState();

  const grpUser = [];

  
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
  async function creategroup(){
    setOpen(false);
    //credentials
    for(var i=0;i<personName.length;i++){
      grpUser.push(personName[i])
    }
    console.log(grpUser)
    let paid_by_field = 0;
    if(checked){
      paid_by_field = user.id;
    }
    else{
      paid_by_field = paid_by
    }
    let item = {
      "name":grpName,
      "description":grpDesc,
      "amount":parseInt(grpBudget),
      "members":grpUser,
      "current_user":user.id,
      "added_by":user.id,
      "paid_by":paid_by_field
    }
    
    try{
      let result= await fetch('http://127.0.0.1:8000/transactions/',{
      method:'POST',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify(item)
      });
      result = await result.json();
      console.log(result);
    }
    catch(e){
    console.log(e);
    }
    window.location.reload();
  }
  return (
    <div className='maindashboard-main'>
        <div className='top-container'>
            <TextField label="Search" className='searchbar'/>
            <div className='top-object' onClick={()=>{setOpen(true)}}>
                <p className='top-text'>Add Transaction</p>
            </div>
        </div>
        <TopContainer/>
        <Modal
        open={open}
        onClose={()=>{setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p>Add Transaction
          </p>
          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',gap:'10px'}}>
          <TextField label="Name" onChange={(e)=>{setGrpName(e.target.value)}}/>
          <TextField label="Description" onChange={(e)=>{setGrpDesc(e.target.value)}} style={{width:'100%'}}/>
          <TextField label="Amount" onChange={(e)=>{setGrpBudget(e.target.value)}}/>

          <FormGroup>
            <FormControlLabel control={<Checkbox checked={checked} onChange={handleCheckedPaidBy}/>} label="Paid by me" />
          </FormGroup>

          {!checked?(<>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Paid By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={paid_by}
                label="Paid By"
                onChange={handleSelectPaidByChange}
              >
                {users?.map((name) => (
                  <MenuItem key={name.id} value={name.id}>{name.friend}</MenuItem>))}
              </Select>
            </FormControl>
          </>):(<></>)}
          <FormControl style={{width:'100%'}}>
          <InputLabel>Members</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
           
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput placeholder='Members' />}
            style={{width:'100%'}}
          >
          
          {users?.map((name) => (
            <MenuItem key={name.id} value={name.id}>{name.friend}</MenuItem>
          ))}
        </Select>
        </FormControl>
          </div>
          <div style={{textAlign:'center',backgroundColor:'#674fa3',borderRadius:'0.5vw',padding:'2px',marginTop:'10px',cursor:'pointer'}}  onClick={()=>{creategroup()}}>
            <p style={{color:'white'}}>Create Transaction</p>
            </div>
        </Box>
      </Modal>
    </div>
  )
}
