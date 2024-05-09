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
                route.route !== '/theatres'
                && route.route !== '/shows'
              );
            };
            if (userRole === 'admin') {
              return (
                route.route !== '/authentication/sign-in' &&
                route.route !== '/authentication/sign-up' &&
                route.route !== '/users'
              );
            }
            return route.route === '/dashboard';
          });
          setUserRoutes(filteredRoutes);
        }
        else if (!userEmail) {
          filteredRoutes = routes && routes.filter(route => {
            return route.route === '/authentication/sign-in';
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
