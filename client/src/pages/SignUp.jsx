import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import OAuth from '../components/OAuth';
export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value,
      });
  }; 
  
  const handleSubmit = async (e)=>{
     e.preventDefault();
     setLoading(true);
     setError(null);

     axios.post('/api/auth/signup',formData)
     .then((res)=>{
      console.log(res);
      navigate('/sign-in');
     }).catch((err)=>{
        setError(err.response.data.message);
     })

     setLoading(false);

    

  }

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-center font-bold text-3xl my-7'>Sign Up</h1>
     
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>  
      <input type="text" placeholder='Username' id='username' className='border p-3 rounded-lg ' onChange={handleChange} />
      <input type="email" placeholder='Email' id='email' className='border p-3 rounded-lg ' onChange={handleChange} />
       <input type="password" placeholder='Password' id='password' className='border p-3 rounded-lg ' onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>{loading? 'Loading...' : 'Sign Up'}</button>
        <OAuth />
      </form>    

      <div className=''>
           <p>Have an account? <Link to='/sign-in'><span className='text-blue-400 font-bold'> Sign In</span> </Link> </p> 
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
