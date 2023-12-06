import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createListing, deleteListing, getUserListings,getListing, updateListing, getOwner, searchListings } from '../controllers/listing.controller.js';


const router = express.Router();


router.post('/create',verifyUser,createListing);
router.get('/listings/:id',verifyUser,getUserListings)
router.delete('/delete/:id',verifyUser,deleteListing);
router.get('/getListing/:id',getListing);
router.post('/update/:id',verifyUser,updateListing);
router.get('/getOwner/:id',verifyUser,getOwner);
router.get('/get',searchListings);
export default router;