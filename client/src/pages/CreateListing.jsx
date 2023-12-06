import React, { useState } from "react";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState({});
  const {currentUser} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef:currentUser._id,
  });

  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,setError] = useState(null);


  

  const storeImages = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImages(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2mb per image max)");
        });
    } else if (formData.imageUrls.length == 0) {
      setImageUploadError("You have not selected any image");
    } else {
      setImageUploadError("Maximum 6 images allowed per listing");
    }
  };

  const handleImageDelete = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e)=>{
            e.preventDefault();
            if(formData.imageUrls.length<1) return setError('You must upload at least one image!');
            if(+formData.regularPrice<= +formData.discountPrice) return setError('Discount price must be less than regular price');
            setLoading(true);
            axios.post('/api/listing/create',formData)
            .then((res)=>{
              setLoading(false);console.log(res);
              navigate(`/listing/${res.data._id}`)
            })
            .catch((err)=>{
                setError(err.response.data.message);
                setLoading(false);
            })
  }

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            className="p-3 text-xl rounded-lg border focus:outline-none"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            type="text"
            id="description"
            className="p-3 text-xl rounded-lg border focus:outline-none"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            id="address"
            className="p-3 text-xl rounded-lg border focus:outline-none"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <div className="flex gap-4 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                checked={formData.type === "sale"}
                onChange={handleChange}
                className="w-5"
              />{" "}
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                checked={formData.type == "rent"}
                onChange={handleChange}
                className="w-5"
              />{" "}
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking}
                onChange={handleChange}
                className="w-5"
              />{" "}
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished}
                onChange={handleChange}
                className="w-5"
              />{" "}
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer}
                onChange={handleChange}
                className="w-5"
              />{" "}
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                className="p-3 border-gray-300 rounded-lg"
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="1"
                max="10"
                required
                className="p-3 border-gray-300 rounded-lg"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={handleChange}
                required
                className="p-3 border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">{formData.type === 'sale'?"in ₹":"₹ / month"}</span>
              </div>
            </div>
            {
                formData.offer &&

                <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                required
                className="p-3 border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">{formData.type === 'sale'?"in ₹":"₹ / month"}</span>
              </div>
            </div>
            }
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="">
            <span className="font-bold">Images:</span>
            <span>The first image will be the cover(max 6 pictures)</span>
          </div>
          <div className="flex gap-4 ">
            <input
              onChange={(e) => {
                setFiles(e.target.files);
              }}
              type="file"
              multiple
              id="images"
              className="border border-gray-300 p-3 rounded-lg w-full"
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="p-3 text-green-700 border-green-700 border rounded-lg hover:shadow-xl"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError && imageUploadError}</p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center border p-3"
              >
                <img
                  src={url}
                  alt="Listed Imaged"
                  className="w-20 h-20 rounded-lg object-contain"
                />
                <p
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="text-red-700 cursor-pointer hover:opacity-75"
                >
                  Delete
                </p>
              </div>
            ))}
          <button className="p-3 text-white bg-slate-700 w-full uppercase hover:opacity-95 rounded-lg">
           <p>{loading?"Creating...":"Create Listing"}</p>
          </button> 
          <p className="text-red-600">{error && error}</p>
        </div>
      </form>
    </main>
  );
}
