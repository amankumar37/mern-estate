import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure,signInSuccess,signInStart } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
export default function SignIn() {

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {loading, error} = useSelector((state)=> state.user);
  
  const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value,
      });
  }; 
  
  const handleSubmit = async (e)=>{
     e.preventDefault();
     dispatch(signInStart());

     axios.post('/api/auth/signin',formData)
     .then((res)=>{
      dispatch(signInSuccess(res.data));
      navigate('/');
     }).catch((err)=>{
       dispatch(signInFailure(err.response.data.message));
       return ;
     })


    

  }

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-center font-bold text-3xl my-7'>Sign In</h1>
     
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>  
      <input type="email" placeholder='Email' id='email' className='border p-3 rounded-lg ' onChange={handleChange} />
       <input type="password" placeholder='Password' id='password' className='border p-3 rounded-lg ' onChange={handleChange} />
        <button className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>{loading? 'Loading...' : 'Sign In'}</button>
      <OAuth />
      </form>    

      <div className=''>
           <p>Don't have an account? <Link to='/sign-up'><span className='text-blue-400 font-bold'> Sign Up</span> </Link> </p> 
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
