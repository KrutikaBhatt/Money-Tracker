import React,{useEffect,useState} from 'react'
import "./index.css"
import FilledBox from './FilledBox'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCardIcon from '@mui/icons-material/AddCard';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function Events({name,key,isPaid,amt,current_username,current_id}) {
  const [modal,setModal] = useState(false);

  async function payTheSplit(){
    let result= await fetch(`http://127.0.0.1:8000/dashboard/${current_id}`,{
      method:'POST',
      headers:{
          "Content-Type":"application/json",
      },
      body:JSON.stringify({"member_id":key})
      });
      result = await result.json();
      window.location.reload();
  }

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
  return (
    <>
    <Modal
        open={modal}
        onClose={()=>{setModal(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
      <h3>Pay ₹{amt}?</h3>
      <div style={{display:'flex',width:'100%',justifyContent:'space-evenly'}}>
        <div style={{textAlign:'center',backgroundColor:'#674fa3',borderRadius:'0.5vw',padding:'10px',width:'22%',marginTop:'10px',cursor:'pointer'}}>
            <p style={{color:'white'}}>Confirm</p>
        </div>

        <div style={{textAlign:'center',border:'1px solid #674fa3',borderRadius:'0.5vw',padding:'10px',width:'22%',marginTop:'10px',cursor:'pointer'}}>
          <p style={{color:'#674fa3'}}>Cancel</p>
        </div>
      </div>
      
      </Box>
    </Modal>
    <div className='event-main'>
        <div className='event-content'>
        <div className='event-icons'>
          <p className='event-head'>{name}</p>
            <FilledBox isPaid={isPaid} text={`₹${amt}`}/>
        </div>
        </div>
        {name==current_username && !isPaid?(<><AddCardIcon style={{cursor:'pointer'}} onClick={()=>{setModal(true)}}/></>):(<><ArrowForwardIosIcon/></>)}
    </div>
    </>
  )
}
