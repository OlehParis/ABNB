
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '400px'
};
const apiK = process.env.REACT_APP_GOOGLE_PLACES_API_KEY

const MapComponent = ({ lat, lng }) => {
  const center = {
    lat: Number(lat),
    lng: Number(lng)
  };

  
  return (
    <LoadScript googleMapsApiKey={apiK}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
      >
        {/* <Marker position={{center}} /> */}
      </GoogleMap>
      
    </LoadScript>
  );
}

export default MapComponent;
