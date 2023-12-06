import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
 import { FaBath, FaBed, FaBeer, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


SwiperCore.use([Navigation]);
export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [contact,setContact] = useState(false);
    const {currentUser} = useSelector((state)=>state.user);
    const params = useParams();
    useEffect(()=>{
        setLoading(true);
        axios.get(`/api/listing/getListing/${params.listingId}`)
        .then((res)=>{
                setListing(res.data);
                setLoading(false);
        })
        .catch((err)=>{
            setError(err.response.data.message);
            setLoading(false);
        })

    },[])
  return (
    <main>
            {loading && <p className='text-center text-2xl my-7'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

            {
                listing && !loading && !error && (<div>
                    <div className="">
                    <Swiper navigation >
                        {
                            listing.imageUrls.map(
                                (url) => (
                                <SwiperSlide key = {url}>
                                    <div className="h-[550px]" style = {{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}></div>
                                </SwiperSlide>
                                )
                            )
                        }
                    </Swiper>
                    </div>


                    <div className="p-20">
                <h1 className='text-3xl font-bold'>{ listing.name} - ₹ {listing.regularPrice} { listing.type==='rent' && "/ month"} </h1>

                <div className="my-8">
                   <div className="flex gap-4 items-center"> <FaMapMarkerAlt className='text-red-500'/> { listing.address} </div>
                   <div className='flex gap-4'>
                     <p className='bg-blue-400 text-red-50 rounded-md max-w-[200px] font-semibold p-2 text-center'>{listing.type==='rent'? "For Rent" : "For Sale"}</p>
                     <p className='bg-red-400 text-red-50 rounded-md max-w-[200px] font-semibold p-2 text-center'>₹ {+listing.regularPrice - +listing.discountPrice} Discount</p>
                   </div>
                    <span className='font-semibold'>Description - </span>
                    { listing.description}

                </div>
                <ul className='flex gap-6 text-blue-500 text-xl flex-wrap'>
                    <li className='flex items-center gap-2 font-bold'>
                        <FaBed />
                       {listing.bedrooms} {listing.bedrooms>1? "Beds": "Bed"}
                     </li>
                     <li className='flex items-center gap-2 font-bold'>
                        <FaBath />
                       {listing.bathrooms} {listing.bathrooms>1? "Baths": "Bath"}
                     </li>
                     <li className='flex items-center gap-2 font-bold'>
                        <FaParking />
                        {listing.parking? "Parking": "No Parking"}
                     </li>
                     <li className='flex items-center gap-2 font-bold'>
                        <FaChair />
                        {listing.furnished? "Furnished": "Not Furnished"}
                     </li>
                </ul>
                        {
                        currentUser && !contact && currentUser._id !==listing.userRef &&
            <button type='button'onClick={()=>setContact(true)} className='bg-slate-700 rounded-lg p-3 text-white my-7 w-full uppercase hover:opacity-95'>Contact landlord</button>
   

                         }

                         {
                            contact&& <Contact listing= {listing} />
                         }
            </div>
                
                </div>)
            }
            
    </main>
  )
}
