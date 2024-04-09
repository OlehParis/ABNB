import { useState } from 'react';
import './CreateSpot.css';
import { csrfFetch } from '../../store/csrf';

const CreateSpot = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    name: '',
    price: '',
    description: '',
    title: '',
    imageUrls: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    // Description validation
    if (formData.description.length < 30) {
      newErrors.description = "Description must be at least 30 characters long.";
    }
    if(formData.country.length < 1){
      newErrors.country = "Country is required"
    }
    if(formData.address.length < 1){
      newErrors.address = "Address is required"
    }
    if(formData.city.length < 1){
      newErrors.city = "City is required"
    }
    if(formData.state.length < 1){
      newErrors.state = "State is required"
    }
    if(formData.name.length < 1){
      newErrors.name = "State is required"
    }
    if(formData.price < 1){
      newErrors.price = "Price is required"
    }
    return newErrors;
  };
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await csrfFetch('api/spots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create spot');
        } else (
          console.log("YEAY!")
        )

        // If successful, you might want to clear the form or redirect the user
      } catch (error) {
        console.error('Error creating spot:', error.message);
      }
    }
  };

  return (
    <div className="create-spot-form">
      <h2>Create a new Spot</h2>
      <h4>Where's your place located?</h4>
      <p>Guests will only get your exact address once they booked a
reservation.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="country">Country:</label>
        <input type="text" placeholder='Country' id="country" name="country" value={formData.country} onChange={handleChange} />
        {errors.country && <div className="error">{errors.country}</div>}

        <label htmlFor="address">Street Address:</label>
        <input type="text" placeholder='Address' id="address" name="address" value={formData.address} onChange={handleChange} />
        {errors.address && <div className="error">{errors.address}</div>}
        <label htmlFor="city">City:</label>
        <input type="text" placeholder='City' id="city" name="city" value={formData.city} onChange={handleChange} />
        {errors.city && <div className="error">{errors.city}</div>}

        <label htmlFor="state">State:</label>
        <input type="text" placeholder='STATE' id="state" name="state" value={formData.state} onChange={handleChange} />
        {errors.state && <div className="error">{errors.state}</div>}
        <h4>Describe your place to guests</h4>

        <label htmlFor="description">Describe your place to guests:</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <div className="error">{errors.description}</div>}

        <label htmlFor="title">Create a title for your spot:</label>
        <input type="text" placeholder='Name of your spot' id="title" name="title" value={formData.title} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}

        <label htmlFor="price">Competitive pricing can help your listing stand out and rank higher in search results</label>
        <input type="number" placeholder='Price per night (USD)' id="price" name="price" value={formData.price} onChange={handleChange} />
        {errors.price && <div className="error">{errors.price}</div>}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpot;





////////
// import { useState } from 'react';
// import './CreateSpot.css'
// const CreateSpot = () => {
//   // const [errors, setErrors] = useState({});
//   const [formData, setFormData] = useState({
//     address: '',
//     city: '',
//     state: '',
//     country: '',
//     name: '',
//     price: '',
//     description: '',
//     title: '',
//     imageUrls: [],
//     // latitude: '',
//     // longitude: ''
//   });
 
//     // const [dragging, setDragging] = useState(false);
  
//     // const getCsrfTokenFromCookies = () => {
      
//     //   const cookies = document.cookie.split(';');
//     //   for (let cookie of cookies) {
      
//     //     const [name, value] = cookie.trim().split('=');
        
//     //     if (name == 'XSRF-TOKEN') {
//     //       return value;
          
//     //     }
//     //   }
//     //   return null;
//     // };
    
    
//     const handleChange = (e) => {
//       const { name, value } = e.target;
//       setFormData({ ...formData, [name]: value });
//     };
  
//     const handleSubmit = async (e) => {
//       e.preventDefault();
  

      
//       try {
//         // const csrfToken = getCsrfTokenFromCookies();
//         const response = await fetch('/spots', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             // 'XSRF-TOKEN': csrfToken, 
//           },
//           body: JSON.stringify(formData),
//         });
  
//         if (!response.ok) {
//           throw new Error('Failed to create spot');
//         }

//       } catch (error) {
//         // Handle errors, e.g., show an error message to the user
//         console.error('Error creating spot:', error.message);
//       }
//     };
  
//   // const handleDragStart = (event) => {
//   //   event.dataTransfer.setData("text/plain", event.target.id);
//   //   setDragging(true);
//   // };

//   // const handleDragOver = (event) => {
//   //   event.preventDefault();
//   // };

//   // const handleDrop = (event) => {
//   //   event.preventDefault();
//   //   const id = event.dataTransfer.getData("text");
//   //   const draggableElement = document.getElementById(id);
//   //   const dropzone = event.target;
//   //   dropzone.appendChild(draggableElement);
//   //   setDragging(false);
//   // };

//   return (
//     <div className="create-spot-form">
//       <h2>Create a new Spot</h2>
//       <form onSubmit={handleSubmit}>

//         <label htmlFor="country">Country:</label>
//         <input type="text"  placeholder='Country' id="country" name="country" value={formData.country}  required onChange={handleChange} />
// {/* 
//         <div
//           id="dropzone"
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//           style={{ width: '100%', minHeight: '100px', border: '1px dashed #ccc', marginBottom: '10px' }}
//         >
//           Drag Image Here
//         </div>
//         <input type="text" id="imageUrls" name="imageUrls" value={formData.imageUrls} onChange={handleChange} /> */}
//         <label htmlFor="address">Street Address:</label>
//         <input type="text" placeholder='Address' id="address" name="address" value={formData.address} onChange={handleChange} />

//         <label htmlFor="city">City:</label>
//         <input type="text" placeholder='City' id="city" name="city" value={formData.city} onChange={handleChange} />

//         <label htmlFor="state">State:</label>
//         <input type="text"  placeholder='STATE' id="state" name="state" value={formData.state} onChange={handleChange} />

//         <label htmlFor="description">Describe your place to guests:</label>
//         <textarea id="description" name="description" value={formData.description} onChange={handleChange} />

//         <label htmlFor="title">Create a title for your spot:</label>
//         <input type="text"  placeholder='Name of your spot' id="title" name="title" value={formData.title} onChange={handleChange} />

//         <label htmlFor="pricePerNight">Competitive pricing can help your listing stand out and rank higher in search results</label>
//         <input type="number"  placeholder='Price per night (USD)' id="price" name="price" value={formData.price} onChange={handleChange} />

//         {/* <label htmlFor="imageUrls">Submit a link to at least one photo to publish your spot.</label>
//         <input type="text" id="imageUrls" name="imageUrls" value={formData.imageUrls} onChange={handleChange} /> */}

//         <button type="submit">Create Spot</button>
//       </form>
   
//       {/* {dragging && <p>Dragging...</p>} */}
//     </div>
//   );
// };

// export default CreateSpot;
