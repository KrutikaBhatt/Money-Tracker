import React from 'react'
import "./index.css"



export default function UserItem({name,icon,lastName,email}) {
  return (
    <div className='UserItem-main'>
        {icon}
        <div>
        <h4 className="white sidebaritem-text name">{name} {lastName}</h4>
        <p className="white email">{email}</p>
        </div>
    </div>
  )
}
