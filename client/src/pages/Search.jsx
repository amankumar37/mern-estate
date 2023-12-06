import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchBarData, setSearchBarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })
    const [showMore, setShowMore] = useState(false);
    console.log(listings);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl  ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSearchBarData({
                searchTerm:searchTermFromUrl || '',
                type:typeFromUrl || 'all',
                parking: parkingFromUrl==='true'?true:false,
                furnished: furnishedFromUrl === 'true'? true:false,
                offer: offerFromUrl === 'true' ? true:false,
                sort : sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            })
        }

        const fetchListings = async()=>{
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length>8){
                setShowMore(true);
            }
            setListings(data);
            setLoading(false);
        }
        fetchListings();
    },[location.search])




    

    const handleChange = (e)=>{
          if(e.target.id === 'rent' || e.target.id === 'sale' || e.target.id === 'all'){
            setSearchBarData({...searchBarData,type:e.target.id});
          }
          else if(e.target.id === 'searchTerm'){
           setSearchBarData({...searchBarData, searchTerm:e.target.value});
          }

          else if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
             setSearchBarData({...searchBarData,[e.target.id]:e.target.checked || e.target.checked ==='true' ? true : false});
          }

          else if(e.target.id === 'sort_order'){
             const sort = e.target.value.split('_')[0] || 'created_at';

             const order = e.target.value.split('_')[1] || 'desc';

             setSearchBarData({...searchBarData, sort, order});
          }

          
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm',searchBarData.searchTerm);
        urlParams.set('type',searchBarData.type);
        urlParams.set('parking',searchBarData.parking);
        urlParams.set('furnished',searchBarData.furnished);
        urlParams.set('offer',searchBarData.offer);
        urlParams.set('sort',searchBarData.sort);
        urlParams.set('order',searchBarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    console.log(searchBarData);

    const onShowMoreClick = async ()=>{
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();

        if(data.length<9){
            setShowMore(false);
        }
        setListings([...listings,...data]);
    }

  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border b-2 md:border-r-2 md:min-h-screen">

            <form onSubmit={handleSubmit} className='flex flex-col gap-8' >
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap'>Search Term:</label>
                    <input type ="text" id = 'searchTerm' placeholder='Search...' onChange={handleChange} value={searchBarData.searchTerm} className='border rounded-lg p-3 w-full' />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <label>Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'all' onChange={handleChange} checked={searchBarData.type==='all'}  className='w-5' />
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'rent' className='w-5' onChange={handleChange} checked={searchBarData.type==='rent'} />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'sale' className='w-5' onChange={handleChange} checked={searchBarData.type==='sale'} />
                        <span> Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'offer' onChange={handleChange} checked={searchBarData.offer} className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>



               

                <div className="flex gap-2 flex-wrap items-center">
                    <label>Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'parking' onChange={handleChange} checked={searchBarData.parking} className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id = 'furnished' onChange={handleChange} checked={searchBarData.furnished} className='w-5' />
                        <span>Furnished</span>
                    </div>
                    
                </div>

                <div className="flex items-center gap-2">
                    <label>Sort:</label>
                    <select id='sort_order' 
                    onChange={handleChange}
                    defaultValue={'created_at_desc'} className='border rounded-lg p-3 bg-white'>
                    <option value='regularPrice_desc'>Price high to low</option>
                    <option value='regularPrice_asc'>Price low to high</option>
                    <option value = 'createdAt_desc'>Latest</option>
                    <option value = 'createdAt_asc'>Oldest</option>
                    </select>
                </div>

                <button className='bg-slate-700 rounded-lg p-3 text-white hover:opacity-95'>Search</button>
                
            </form>
        </div> 

        <div className="flex-1">
            <h1 className='text-slate-600 text-3xl font-bold border-b p-3 mt-5'>Search Results</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No listing found!</p>
                )}
                {loading && (
                    <p className='text-xl text-slate-700 text-center w-full' >Loading...</p>
                )}

                {!loading && listings && listings.map((listing)=> <ListingItem key={listing._id} listing={listing} />)}
                {showMore && (
                    <button onClick={()=>{onShowMoreClick();
                    }}
                    className='text-blue-700 hover:underline p-7 text-center'
                    >Show More</button>
                )}
            </div>
        </div>
    </div>
  )
}
