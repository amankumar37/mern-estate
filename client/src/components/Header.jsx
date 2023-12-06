import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'


export default function Header() {
  const {currentUser} = useSelector((state)=>state.user);
  const [searchTerm , setsearchTerm] = useState('');
  const navigate  = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');
    if(searchTermFormUrl){
      setsearchTerm(searchTermFormUrl);
    }
  },[location.search]);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

          <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>

           <span className='text-slate-500'>Aman</span>
           <span className='text-slate-700'>Estate</span>

           </h1>
          </Link>

          <form onSubmit={handleSubmit} className='bg-slate-100 shadow-md p-2 rounded-lg flex items-center'>
            <input value={searchTerm} onChange={(e)=>setsearchTerm(e.target.value)} type = 'text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
            <button>

            <FaSearch />
            </button>
          </form>

          <ul className='flex gap-4 text-slate-600'>
           <Link to='/'> <li className='hidden sm:inline hover:underline cursor-pointer'>Home</li> </Link> 
           <Link to='/about'>  <li className='hidden sm:inline hover:underline cursor-pointer'>About</li> </Link>

           <Link to='/profile'>  
              {
                currentUser?(<img src={currentUser.avatar} alt ="profile" className='w-8 h-8 rounded-full object-cover' />) :  (<li className='sm:inline hover:underline cursor-pointer'>SignIn</li>)
              }
              </Link>
          </ul>
          
      </div>
    </header>
  )
}
