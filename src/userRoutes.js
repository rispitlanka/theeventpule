import { useEffect, useState } from 'react';
import { supabase } from 'pages/supabaseClient';
import routes from 'routes';

export default function useUserRoutes() {
  const [userRoutes, setUserRoutes] = useState([]);
  let userEmailWithQuotes = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUserRoutes = async () => {
      try {
        let filteredRoutes = [];
        const userEmail = userEmailWithQuotes && userEmailWithQuotes.substring(1, userEmailWithQuotes.length - 1);
        if (userEmail) {
          const { data, error } = await supabase.from('theatreOwners').select('userRole').eq('email', userEmail);
          const { userRole } = data[0];
          if (error) {
            console.log(error)
          };
          filteredRoutes = routes && routes.filter(route => {
            if (userRole === 'superAdmin') {
              return (
                route.route !== '/authentication/sign-in' &&
                route.route !== '/authentication/sign-up' &&
                route.route !== '/theatre' &&
                route.route !== '/bookings' &&
                route.route !== '/view-tickets' &&
                route.route !== '/events' &&
                route.route !== '/theatres/single-theatre/add-screen/:id' &&
                route.route !== '/theatres/single-theatre/edit-screen/:screenId' &&
                route.route !== '/theatres/single-theatre/single-screen/add-showTime/:screenId' &&
                route.route !== '/theatres/single-theatre/single-screen/edit-showTime/:showTimeId' &&
                route.route !== '/theatres/single-theatre/single-screen/add-zone/:screenId' &&
                route.route !== '/theatres/single-theatre/single-screen/single-zone/edit-zone/:id' &&
                route.route !== '/bookings/book-seats/:showId/:screenId' &&
                route.route !== '/bookings/book-seats/get-tickets' &&
                route.route !== '/events/add-event' &&
                route.route !== '/events/edit-event/:id' &&
                route.route !== '/events/add-mainEvent' &&
                route.route !== '/events/edit-mainEvent/:id' &&
                route.route !== '/events' &&
                route.route !== '/shows'
              );
            };
            if (userRole === 'admin') {
              return (
                route.route !== '/authentication/sign-in' &&
                route.route !== '/authentication/sign-up' &&
                route.route !== '/users' &&
                route.route !== '/customers' &&
                route.route !== '/theatres' &&
                route.route !== '/theatreMasterData' &&
                route.route !== '/facilities' &&
                route.route !== '/movies' &&
                route.route !== '/movieMasterData' &&
                route.route !== '/languages' &&
                route.route !== '/genre' &&
                route.route !== '/censor-types' &&
                route.route !== '/soundsystem' &&
                route.route !== '/projection-type' &&
                route.route !== '/cast' &&
                route.route !== '/crew' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/facilities/add-facilities' &&
                route.route !== '/movies/add-movie' &&
                route.route !== '/languages/add-languages' &&
                route.route !== '/cast/add-cast' &&
                route.route !== '/crew/add-crew"' &&
                route.route !== '/genre/add-genre' &&
                route.route !== '/censor-types/add-censor-types' &&
                route.route !== '/languages/edit-languages/:id' &&
                route.route !== '/cast/edit-cast/:id' &&
                route.route !== '/movies/edit-movie/:id' &&
                route.route !== '/crew/edit-crew/:id' &&
                route.route !== '/soundsystem/add-soundsystem' &&
                route.route !== '/projection-type/add-projection-type"' &&
                route.route !== '/tables/add-owner' &&
                route.route !== '/tables/manage-owner' &&
                route.route !== '/theatres/add-theatre' &&
                route.route !== '/theatres/edit-theatre/:id' &&
                route.route !== '/facilities/edit-facilities/:id' &&
                route.route !== '/genre/edit-genre/:id' &&
                route.route !== '/censor-types/edit-censor-types/:id"' &&
                route.route !== '/soundsystem/edit-soundsystem/:id' &&
                route.route !== '/projection-type/edit-projection-type/:id' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&
                route.route !== '/bookingsAdmin' &&

                route.route !== '/facilities'
              );
            }
            return route.route === '/dashboard';
          });
          setUserRoutes(filteredRoutes);
        }
        else if (!userEmail) {
          filteredRoutes = routes && routes.filter(route => {
            return route.route === '/authentication/sign-in' || route.route === "/register/:eventId";
          });
          setUserRoutes(filteredRoutes);
        }
      } catch (error) {
        console.error('Error fetching user routes:', error.message);
      }

    };

    fetchUserRoutes();
  }, [userEmailWithQuotes]);

  return userRoutes;
}
