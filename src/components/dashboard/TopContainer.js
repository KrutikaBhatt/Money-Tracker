import React,{useState,useEffect} from 'react'
import "./index.css"
import Organization from "./Organizations"

export default function TopContainer() {
  let user = JSON.parse(localStorage.getItem('user-info')).user;
  
  const[group,setGroup] = useState([]);
  useEffect( () => {
    async function fetchData() {
      let groups= await fetch(`http://127.0.0.1:8000/dashboard/${user.id}`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
            "Accept":"application/json",
        },});
        groups = await groups.json();
        setGroup(groups.data);
    }
    fetchData()
  },[]);
  
  return (
    <div className='organizations'>
      {
        group?.map(post=>{
          return(
            <>
              <Organization user_detail={user} name={post.group} id={post.group_id} group_detail={post}/>
            </>
          )
        })
      }
    </div>
  )
}
