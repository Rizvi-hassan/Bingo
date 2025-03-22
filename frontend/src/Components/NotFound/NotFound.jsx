import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'3rem', height:'100vh', flexDirection:'column'}}>
    <h1>404! Not Found</h1>
    <button className='btn' onClick={()=>{navigate('/')}}>Home</button>
    </div>
  )
}

export default NotFound