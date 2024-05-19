
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '400px'
};


const MapComponent = ({ lat, lng }) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  const center = { lat: latitude, lng: longitude };

  if (isNaN(latitude) || isNaN(longitude)) {
    console.error('Invalid latitude or longitude');
    return <div>Invalid location data</div>;
  }
  const apiK = process.env.REACT_APP_GOOGLE_PLACES_API_KEY
  if (!apiK) {
    console.error('Google Maps API key is missing');
    return <div>Google Maps API key is missing</div>;
  }
  return ( 
    <LoadScript googleMapsApiKey={apiK}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        <Marker position={center} />
      </GoogleMap>
      
    </LoadScript>
  );
}

export default MapComponent;
