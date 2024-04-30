/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import AddOwner from "pages/addOwner";
import AddScreen from "pages/addScreen";
import AddFacilities from "pages/addFacilities";
import ManageOwner from "pages/manageOwner";
import EditScreen from "pages/editScreen";
import Facilities from "pages/facilities";
import Languages from "pages/languages";

import Theatres from "pages/theatres";
import AddTheatre from "pages/addTheatre";
import EditTheatre from "pages/editTheatre";
// @mui icons
import Icon from "@mui/material/Icon";
import { Movie } from "@mui/icons-material";
import Movies from "pages/movies";
import AddMovies from "pages/addMovies";
import AddLanguages from "pages/addLanguages";
import EditFacilities from "pages/editFacilities";
import Genre from "pages/genre";
import AddGenre from "pages/addGenre";
import EditGenre from "pages/editGenre";
import AddSoundSystem from "pages/addSoundSystemType";
import SoundSystem from "pages/soundSystemType";
import EditSoundSystem from "pages/editSoundSystemType";
import ProjectionType from "pages/projectionType";
import AddProjectionType from "pages/addProjectionType";
import EditLanguage from "pages/editLanguages";
import EditProjectionType from "pages/editProjectionType";
import CastList from "pages/castList";
import AddCastList from "pages/addCastList";
import EditCastList from "pages/editCastList";
import AddCrewList from "pages/addCrewList";
import CrewList from "pages/crewList";
import EditCrewList from "pages/editCrewList";
import EditMovies from "pages/editMovies";
import ViewMovie from "pages/viewMovie";
import CensorTypes from "pages/censorTypes";
import AddCensorType from "pages/addCensorType";
import EditCensorType from "pages/editCensorType";


const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Theatres",
    key: "theatres",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/theatres",
    component: <Theatres />,
  },

  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Facilities",
    key: "facilities",
    icon: <Icon fontSize="small">door_sliding</Icon>,
    route: "/facilities",
    component: <Facilities />,
  },
  {
    type: "collapse",
    name: "Movies",
    key: "movies",
    icon: <Icon fontSize="small">movie</Icon>,
    route: "/movies",
    component: <Movies />,
  },
  {
    type: "collapse",
    name: "Languages",
    key: "languages",
    icon: <Icon fontSize="small">translate</Icon>,
    route: "/languages",
    component: <Languages />,
  },
  {
    type: "collapse",
    name: "Genres",
    key: "genre",
    icon: <Icon fontSize="small">dehaze</Icon>,
    route: "/genre",
    component: <Genre />,
  },
  {
    type: "collapse",
    name: "Censor Types",
    key: "censor-types",
    icon: <Icon fontSize="small">dehaze</Icon>,
    route: "/censor-types",
    component: <CensorTypes />,
  },
  {
    type: "collapse",
    name: "Sound System",
    key: "soundsystem",
    icon: <Icon fontSize="small">speaker</Icon>,
    route: "/soundsystem",
    component: <SoundSystem />,
  },
  {
    type: "collapse",
    name: "Projection Types",
    key: "projection-type",
    icon: <Icon fontSize="small">view_in_ar</Icon>,
    route: "/projection-type",
    component: <ProjectionType />,
  },
  {
    type: "collapse",
    name: "Cast",
    key: "cast",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/cast",
    component: <CastList />,
  },
  {
    type: "collapse",
    name: "Crew",
    key: "crew",
    icon: <Icon fontSize="small">handyman</Icon>,
    route: "/crew",
    component: <CrewList />,
  },
  {
    route: "/facilities/add-facilities",
    component: <AddFacilities />,
  },
  {
    route: "/movies/add-movie",
    component: <AddMovies />,
  },
  {
    route: "/languages/add-languages",
    component: <AddLanguages />,
  },
  {
    route: "/cast/add-cast",
    component: <AddCastList />,
  },
  {
    route: "/crew/add-crew",
    component: <AddCrewList />,
  },
  {
    route: "/genre/add-genre",
    component: <AddGenre />,
  },
  {
    route: "/censor-types/add-censor-types",
    component: <AddCensorType />,
  },
  {
    route: "/languages/edit-languages/:id",
    component: <EditLanguage />,
  },
  {
    route: "/cast/edit-cast/:id",
    component: <EditCastList />,
  },
  {
    route: "/movies/edit-movie/:id",
    component: <EditMovies />,
  },
  {
    route: "/movies/view-movie/:id",
    component: <ViewMovie />,
  },
  {
    route: "/crew/edit-crew/:id",
    component: <EditCrewList />,
  },
  {
    route: "/soundsystem/add-soundsystem",
    component: <AddSoundSystem />,
  },
  {
    route: "/projection-type/add-projection-type",
    component: <AddProjectionType />,
  },
  {
    route: "/tables/add-owner",
    component: <AddOwner />,
  },
  {
    route: "/tables/add-screen",
    component: <AddScreen />,
  },
  {
    route: "/tables/manage-owner",
    component: <ManageOwner />,
  },
  {
    route: "/tables/edit-screen",
    component: <EditScreen />,
  },
  {
    route: "/theatres/add-theatre",
    component: <AddTheatre />,
  },
  {
    route: "/theatres/edit-theatre/:id",
    component: <EditTheatre />,
  },
  {
    route: "/facilities/edit-facilities/:id",
    component: <EditFacilities />,
  },
  {
    route: "/genre/edit-genre/:id",
    component: <EditGenre />,
  },
  {
    route: "/censor-types/edit-censor-types/:id",
    component: <EditCensorType />,
  },
  {
    route: "/soundsystem/edit-soundsystem/:id",
    component: <EditSoundSystem />,
  },
  {
    route: "/projection-type/edit-projection-type/:id",
    component: <EditProjectionType />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
];

export default routes;
