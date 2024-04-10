import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import SpotCard from './components/Spots/Spots';
import { fetchSpots } from './store/spots';
import Navigation from './components/Navigation/Navigation';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';

function App() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.data);

  const [isLoaded, setIsLoaded] = useState(false);
  

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(fetchSpots()); // Fetch spot data when component mounts
  }, [dispatch]);

  const Layout = () => (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    
    
    </>
  );

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element:   <SpotCard spot= {spots} /> 
        },
        {
          path: "spots/:spotId",
          element:  <SpotDetails spot = {spots} />
        },{
          path: "spots/new",
          element:  <CreateSpot spot = {spots}/>
        },
      ]
    }
  ]);
 
  return (
    <RouterProvider router={router} />
  );
}

export default App;
