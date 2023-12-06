import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import axios from "axios";
import {
  updateUserFailure,
  updateUserSuccess,
  udpateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [listing, setListing] = useState([]);
  const [listingError, setListingError] = useState(false);
  //firebase storage
  // allow read, write: if
  //     request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setUpdateSuccess(false);

    setFormData({ ...formData, [e.target.id]: e.target.value });
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    setUpdateSuccess(false);
    dispatch(udpateUserStart());
    e.preventDefault();
    axios
      .post(`/api/user/update/${currentUser._id}`, formData)
      .then((res) => {
        dispatch(updateUserSuccess(res.data));
        setUpdateSuccess(true);
        return;
      })
      .catch((err) => {
        console.log(err);
        dispatch(updateUserFailure(err.response.data.message));
        return;
      });
  };

  const handleDelete = async () => {
    dispatch(deleteUserStart());
    axios
      .delete(`/api/user/delete/${currentUser._id}`)
      .then((res) => {
        dispatch(deleteUserSuccess(res.data));
      })
      .catch((err) => {
        dispatch(deleteUserFailure(err.response.data.message));
      });
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    axios
      .get("/api/auth/signout")
      .then((res) => {
        dispatch(signOutUserSuccess(res.data));
      })
      .catch((err) => {
        signOutUserFailure(err.response.data.message);
      });
  };

  const handleShowListing = async () => {
    axios
      .get(`/api/listing/listings/${currentUser._id}`)
      .then((res) => {
        setListing(res.data);
        console.log(listing);
      })
      .catch((err) => {
        setListingError(true);
      });
  };

  const handleListingDelete = async(listingId) => {
    axios
      .delete(`api/listing/delete/${listingId}`)
      .then((res) => {
        if (res.status == 200) {
          setListing((prev) =>
            prev.filter((listing) => listing._id != listingId)
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };



  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="my-7 text-3xl font-bold text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar ? formData.avatar : currentUser.avatar}
          alt="profile"
          className="h-32 w-32 rounded-full cursor-pointer object-cover self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error in uploading image</span> ? (
              filePerc > 0 && filePerc < 100
            ) : (
              <span className="text-slate-700">
                {`Uploading image ${filePerc}%`}
              </span>
            )
          ) : filePerc === 100 ? (
            <span className="text-green-600">
              {`Image uploaded successfully !`}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white text-2xl disabled:opacity-80 hover:opacity-95 rounded-lg p-3 uppercase"
        >
          {loading ? "loading..." : "update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-blue-700 text-2xl p-3 text-center text-white rounded-lg hover:opacity-95 "
        >
          CREATE LISTING
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {updateSuccess && (
        <p className="text-green-500 mt-5">User updated successfully!</p>
      )}

      <button className="text-blue-700 w-full" onClick={handleShowListing}>
        Show Listings
      </button>
      {listingError && <p className="text-red-700">Error in showing listing</p>}

      <div className="flex flex-col gap-3 my-3 ">
        {" "}
        {listing.length > 0 ? (
          listing.map((details, index) => (
            <div className="flex border justify-between p-3 items-center  hover:scale-110 hover:ease-in-out">
              <Link to={`/listing/${details._id}`}>
        
                <img src={details.imageUrls[0]} className="w-10 h-10" />
              </Link>

              <Link to={`/listing/${details._id}`}>
            
                <p className="font-bold">{details.name}</p>
              </Link>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleListingDelete(details._id)}
                  className="text-red-700" 
                >
                  Delete
                </button>
                <Link to={`/update-listing/${details._id}`}>
                <button
                  type="button"
                  className="text-blue-700"
                >
                  Edit
                </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h1></h1>
        )}
      </div>
    </div>
  );
}
