import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    const [owner , setOwner] = useState(null);
    const [message,setMessage] = useState("");
    

    useEffect(()=>{
    
         axios.get(`/api/listing/getOwner/${listing.userRef}`)
         .then((res)=>{
             setOwner(res.data);
         })
         .catch((err)=>{
                console.log(err);
         })
         
    },[])
  return (
    <div>
            {
                owner && <div className='p-5 flex flex-col gap-4'>
                    <p>Contact <span className='font-semibold'>{owner.username}</span> for this property.</p>
                       <textarea onChange={(e)=>setMessage(e.target.value)} className='rounded-lg w-full p-3' placeholder='Enter your message here...' />
                        <Link to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95 text-center ' >
                            Send Message
                        </Link>
                     </div>
            }
    </div>
  )
}
