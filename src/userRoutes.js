import { useEffect, useState } from 'react';
import { supabase } from 'pages/supabaseClient';
import routes from 'routes';

export default function useUserRoutes() {
  const [userRoutes, setUserRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userEmailWithQuotes = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUserRoutes = async () => {
      try {
        setIsLoading(true);
        let filteredRoutes = [];
        const userEmail = userEmailWithQuotes && userEmailWithQuotes.substring(1, userEmailWithQuotes.length - 1);

        if (userEmail) {
          const { data, error } = await supabase
            .from('theatreOwners')
            .select('userRole')
            .eq('email', userEmail);

          if (error) {
            console.error(error);
            setIsLoading(false);
            return;
          }

          const userRole = data[0]?.userRole || 'user';

          filteredRoutes = routes.filter(route => {
            if (userRole === 'superAdmin') {
              return ![
                '/authentication/sign-in',
                '/authentication/sign-up',
                '/theatre',
                '/bookings',
                '/view-tickets',
                '/events',
                '/theatres/single-theatre/add-screen/:id',
                '/theatres/single-theatre/edit-screen/:screenId',
                '/theatres/single-theatre/single-screen/add-showTime/:screenId',
                '/theatres/single-theatre/single-screen/edit-showTime/:showTimeId',
                '/theatres/single-theatre/single-screen/add-zone/:screenId',
                '/theatres/single-theatre/single-screen/single-zone/edit-zone/:id',
                '/bookings/book-seats/:showId/:screenId',
                '/bookings/book-seats/get-tickets',
                '/events/add-event',
                '/events/edit-event/:id',
                '/events/add-mainEvent',
                '/events/edit-mainEvent/:id',
                '/events',
                '/shows',
              ].includes(route.route);

            } else if (userRole === 'admin') {
              return ![
                '/authentication/sign-in',
                '/authentication/sign-up',
                '/users',
                '/customers',
                '/theatres',
                '/theatreMasterData',
                '/facilities',
                '/movies',
                '/movieMasterData',
                '/languages',
                '/genre',
                '/censor-types',
                '/soundsystem',
                '/projection-type',
                '/cast',
                '/crew',
                '/bookingsAdmin',
                '/facilities/add-facilities',
                '/movies/add-movie',
                '/languages/add-languages',
                '/cast/add-cast',
                '/crew/add-crew',
                '/genre/add-genre',
                '/censor-types/add-censor-types',
                '/languages/edit-languages/:id',
                '/cast/edit-cast/:id',
                '/movies/edit-movie/:id',
                '/crew/edit-crew/:id',
                '/soundsystem/add-soundsystem',
                '/projection-type/add-projection-type',
                '/tables/add-owner',
                '/tables/manage-owner',
                '/theatres/add-theatre',
                '/theatres/edit-theatre/:id',
                '/facilities/edit-facilities/:id',
                '/genre/edit-genre/:id',
                '/censor-types/edit-censor-types/:id',
                '/soundsystem/edit-soundsystem/:id',
                '/projection-type/edit-projection-type/:id',
                '/bookingsAdmin',
                '/facilities',
              ].includes(route.route);
            }
            return route.route === '/dashboard';
          });

        } else {
          filteredRoutes = routes.filter(route => {
            return route.route === '/authentication/sign-in' || route.route === '/register/:eventId';
          });
        }
        setUserRoutes(filteredRoutes);
      } catch (error) {
        console.error('Error fetching user routes:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoutes();
  }, [userEmailWithQuotes]);

  return { userRoutes, isLoading };
}

