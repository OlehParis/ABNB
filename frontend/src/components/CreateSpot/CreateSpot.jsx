import { useState } from 'react';
import './CreateSpot.css'
const CreateSpot = () => {
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    name: '',
    pricePerNight: '',
    description: '',
    title: '',
    basePrice: '',
    imageUrls: [],
    // latitude: '',
    // longitude: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(formData);
  };

  return (
    <div className="create-spot-form">
      <h2>Create a new Spot</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="country">Country:</label>
        <input type="text"  placeholder='Country' id="country" name="country" value={formData.country} onChange={handleChange} />

        <label htmlFor="address">Street Address:</label>
        <input type="text" placeholder='Address' id="address" name="address" value={formData.address} onChange={handleChange} />

        <label htmlFor="city">City:</label>
        <input type="text" placeholder='City' id="city" name="city" value={formData.city} onChange={handleChange} />

        <label htmlFor="state">State:</label>
        <input type="text"  placeholder='STATE' id="state" name="state" value={formData.state} onChange={handleChange} />

        <label htmlFor="description">Describe your place to guests:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

        <label htmlFor="title">Create a title for your spot:</label>
        <input type="text"  placeholder='Name of your spot' id="title" name="title" value={formData.title} onChange={handleChange} />


      

        <label htmlFor="pricePerNight">Competitive pricing can help your listing stand out and rank higher in search results</label>
        <input type="number"  placeholder='Price per night (USD)' id="pricePerNight" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} />



        <label htmlFor="imageUrls">Submit a link to at least one photo to publish your spot.</label>
        <input type="text" id="imageUrls" name="imageUrls" value={formData.imageUrls} onChange={handleChange} />

        {/* <label htmlFor="latitude">Latitude Longitude:</label>
        <input type="text" id="latitude" name="latitude" value={formData.latitude} onChange={handleChange} />

        <label htmlFor="longitude">Latitude Longitude:</label>
        <input type="text" id="longitude" name="longitude" value={formData.longitude} onChange={handleChange} /> */}

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;
