import React from 'react'
import "./index.css"

export default function FilledBox({text,isPaid}) {
  return (
    <>
    {isPaid?(<>
      <div className='filledbox-green'>
        <p className='box-text'>{text}</p>
    </div>
    </>):(<>
      <div className='filledbox'>
        <p className='box-text'>{text}</p>
      </div>
    </>)}
    </>
  )
}