import React from 'react'
import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth'
import { app } from '../firebase.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async ()=>{
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup (auth,provider);

            axios.post('/api/auth/google',{
                name:result.user.displayName,
                email:result.user.email,
                photoUrl:result.user.photoURL,
            }).then((res)=>{
                dispatch(signInSuccess(res.data));
                navigate('/');
                
            })
        }catch(err){
            console.log('Error in authentication with google' , err);
            dispatch(signInFailure(err.response.data.message));
        }
    }


  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase'>Continue with google</button>
  )
}
