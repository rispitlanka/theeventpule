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

// @mui icons
// import Icon from "@mui/material/Icon";
import { Icon } from '@iconify/react';

// import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import AddOwner from "pages/addOwner";
import AddScreen from "pages/addScreen";
import ManageOwner from "pages/manageOwner";
import EditScreen from "pages/editScreen";
import Facilities from "pages/facilities";
import Languages from "pages/languages";
import Theatres from "pages/theatres";
import AddTheatre from "pages/addTheatre";
import EditTheatre from "pages/editTheatre";
import SingleTheatre from "pages/singleTheatre";
import SingleScreen from "pages/singleScreen";
import AddZone from "pages/addZone";
import SingleZone from "pages/singleZone";
import AddShowTime from "pages/addShowTime";
import EditShowTime from "pages/editShowTime";
import AddShows from "pages/addShows";
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
import AddFacilities from "pages/addFacilities";
import SuperAdmin from "pages/superAdmin";
import TheatreOwners from "pages/theatreOwners";
import AddTheatreOwner from "pages/addTheatreOwner";
import EditTheatreOwner from "pages/editTheatreOwner";
import TheatreOwner from "pages/theatreOwner";
import Bookings from "pages/bookings";
import BookSeats from "components/TicketBooking/bookSeats";
import GetTickets from "components/TicketBooking/getTickets";
import ViewTickets from "pages/viewTickets";
import ViewEventTickets from "pages/viewEventTickets";
import Events from "pages/events";
import AddEvent from "pages/addEvent";
import EditEvent from "pages/editEvent";
import SingleEvent from "pages/singleEvent";
import ViewForm from "pages/viewForm";
import RegisterEvent from "pages/registerEvent";
import ViewEventRegistrations from "pages/viewEventRegistrations";
import AddMainEvent from "pages/addMainEvent";
import EditMainEvent from "pages/editMainEvent";
import EditZone from "pages/editZone";
import Customers from "pages/customers";
import BookingsAdmin from "pages/bookingsAdmin";
import Promotions from "pages/promotions";
import FeedBacks from "pages/feedBack";
import HelpAndSupport from "pages/helpAndSupport";
import Reports from "pages/reports";
import Settings from "pages/settings";
import EventsAdmin from "pages/eventsAdmin";
import EventOrganizers from "pages/eventOrganizers";
import AddEventOrganizer from "pages/addEventOrganizer";
import EventOrganizer from "pages/eventOrganizer";
import EditEventOrganizer from "pages/editEventOrganizer";
import EventOrganizations from "pages/eventOrganizations";
import AddEventOrganization from "pages/addEventOrganization";
import SingleEventOrganization from "pages/singleEventOrganization";
import EditEventOrganization from "pages/editEventOrganization";
import Venues from "pages/venues";
import AddVenue from "pages/addVenue";
import SingleVenue from "pages/singleVenue";
import EditVenue from "pages/editVenue";
import EventBookings from "pages/eventBookings";
import AddEventZone from "pages/addEventZone";
import SingleEventZone from "pages/singleEventZone";
import SeatBookings from "components/EventBooking/seatBookings";
import GetEventTicket from "components/EventBooking/getEventTicket";
import SingleTicketView from "components/TicketBooking/singleTicketView";

const routes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon icon="fluent-mdl2:signin" />,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon icon="material-symbols:account-circle" />,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon icon="material-symbols:dashboard" />,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Theatres",
    key: "theatres",
    icon: <Icon icon="mdi:theater" />,
    route: "/theatres",
    component: <Theatres />,
  },
  {
    type: "collapse",
    name: "Organizations",
    key: "eventOrganizations",
    icon: <Icon icon="octicon:organization-16" />,
    route: "/eventOrganizations",
    component: <EventOrganizations />,
  },
  {
    type: "collapse",
    name: "Organization",
    key: "eventOrganization",
    icon: <Icon icon="octicon:organization-16" />,
    route: "/eventOrganization",
    component: <SingleEventOrganization />,
  },
  {
    type: "collapse",
    name: "Venues",
    key: "venues",
    icon: <Icon icon="maki:town-hall" />,
    route: "/venues",
    component: <Venues />,
  },
  {
    type: "collapse",
    name: "Events",
    key: "eventsAdmin",
    icon: <Icon icon="fluent-emoji-high-contrast:party-popper" />,
    route: "/eventsAdmin",
    component: <EventsAdmin />,
  },
  {
    type: "collapse",
    name: "Users",
    key: "users",
    icon: <Icon icon="gridicons:multiple-users" />,
    route: "/allUsers",
    collapse: [
      {
        type: "collapse",
        name: "Admin",
        key: "admin",
        icon: <Icon icon="wpf:administrator" />,
        route: "allUsers/admin",
        component: <SuperAdmin />,
      },
      {
        type: "collapse",
        name: "Theatre Owners",
        key: "theatreOwners",
        icon: <Icon icon="solar:users-group-two-rounded-bold-duotone" />,
        route: "/allUsers/theatreOwners",
        component: <TheatreOwners />,
      },
      {
        type: "collapse",
        name: "Event Organizers",
        key: "eventOrganizers",
        icon: <Icon icon="solar:users-group-two-rounded-bold-duotone" />,
        route: "/allUsers/eventOrganizers",
        component: <EventOrganizers />,
      },
      {
        type: "collapse",
        name: "Customers",
        key: "customers",
        icon: <Icon icon="la:users" />,
        route: "/customers",
        component: <Customers />,
      },
    ]
  },
  {
    type: "collapse",
    name: "Theatre",
    key: "theatre",
    icon: <Icon icon="mdi:theater" />,
    route: "/theatre",
    component: <SingleTheatre />,
  },
  {
    type: "collapse",
    name: "Events",
    key: "events",
    icon: <Icon icon="fluent-emoji-high-contrast:party-popper" />,
    route: "/events",
    component: <Events />,
  },
  {
    type: "collapse",
    name: "Movies",
    key: "movies",
    icon: <Icon icon="fluent:movies-and-tv-16-filled" />,
    route: "/movies",
    component: <Movies />,
  },
  {
    type: "collapse",
    name: "Movies Master Data",
    key: "movieMasterData",
    route: "/movieMasterData",
    icon: <Icon icon="ic:baseline-local-movies" />,
    collapse: [
      {
        type: "collapse",
        name: "Genre",
        key: "genre",
        icon: <Icon icon="mdi:film-star" />,
        route: "/genre",
        component: <Genre />,
      },
      {
        type: "collapse",
        name: "Censor Types",
        key: "movieMacensor-typesterData",
        icon: <Icon icon="ph:certificate-fill" />,
        route: "/censor-types",
        component: <CensorTypes />,
      },
      {
        type: "collapse",
        name: "Sound System",
        key: "soundsystem",
        icon: <Icon icon="icon-park-solid:sound" />,
        route: "/soundsystem",
        component: <SoundSystem />,
      },
      {
        type: "collapse",
        name: "Projection Type",
        key: "projection-type",
        icon: <Icon icon="mage:box-3d-scan-fill" />,
        route: "/projection-type",
        component: <ProjectionType />,
      },
      {
        type: "collapse",
        name: "Cast",
        key: "cast",
        icon: <Icon icon="fluent:people-star-16-filled" />,
        route: "/cast",
        component: <CastList />,
      },
      {
        type: "collapse",
        name: "Crew",
        key: "crew",
        icon: <Icon icon="fa6-solid:people-group" />,
        route: "/crew",
        component: <CrewList />,
      },
      // {
      //   type: "collapse",
      //   name: "Languages",
      //   key: "languages",
      //   icon: <Icon fontSize="small">translate</Icon>,
      //   route: "/languages",
      //   component: <Languages />,
      // },
    ],
  },
  {
    type: "collapse",
    name: "Theatre Master Data",
    key: "theatreMasterData",
    route: "/theatreMasterData",
    icon: <Icon icon="game-icons:theater" />,
    collapse: [
      {
        type: "collapse",
        name: "Sound System",
        key: "soundsystem",
        icon: <Icon icon="icon-park-solid:sound" />,
        route: "/soundsystem",
        component: <SoundSystem />,
      },
      {
        type: "collapse",
        name: "Facilities",
        key: "facilities",
        icon: <Icon icon="gis:search-feature" />,
        route: "/facilities",
        component: <Facilities />,
      },
      {
        type: "collapse",
        name: "Projection Type",
        key: "projection-type",
        icon: <Icon icon="mage:box-3d-scan-fill" />,
        route: "/projection-type",
        component: <ProjectionType />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Shows",
    key: "shows",
    icon: <Icon icon="material-symbols:slideshow" />,
    route: "/shows",
    component: <AddShows />,
  },
  {
    type: "collapse",
    name: "Bookings",
    key: "bookings",
    icon: <Icon icon="teenyicons:appointments-solid" />,
    route: "/bookings",
    component: <Bookings />,
  },
  {
    type: "collapse",
    name: "Bookings",
    key: "bookingsAdmin",
    icon: <Icon icon="teenyicons:appointments-solid" />,
    route: "/bookingsAdmin",
    component: <BookingsAdmin />,
  },
  {
    type: "collapse",
    name: "Bookings",
    key: "eventBookings",
    icon: <Icon icon="teenyicons:appointments-solid" />,
    route: "/eventBookings",
    component: <EventBookings />,
  },
  {
    type: "collapse",
    name: "View Tickets",
    key: "viewTickets",
    icon: <Icon icon="f7:tickets-fill" />,
    route: "/view-tickets",
    component: <ViewTickets />,
  },
  {
    type: "collapse",
    name: "View Tickets",
    key: "viewEventTickets",
    icon: <Icon icon="f7:tickets-fill" />,
    route: "/view-eventTickets",
    component: <ViewEventTickets />,
  },
  {
    type: "collapse",
    name: "Promotions",
    key: "promotions",
    icon: <Icon icon="material-symbols:campaign" />,
    route: "/promotions",
    component: <Promotions />,
  },
  {
    type: "collapse",
    name: "Settings",
    key: "settings",
    icon: <Icon icon="material-symbols:settings" />,
    route: "/settings",
    component: <Settings />,
  },
  {
    type: "collapse",
    name: "Feedbacks",
    key: "feedbacks",
    icon: <Icon icon="material-symbols:reviews" />,
    route: "/feedbacks",
    component: <FeedBacks />,
  },
  {
    type: "collapse",
    name: "Help And Support",
    key: "helpAndSupport",
    icon: <Icon icon="material-symbols:help" />,
    route: "/helpAndSupport",
    component: <HelpAndSupport />,
  },
  {
    type: "collapse",
    name: "Reports",
    key: "reports",
    icon: <Icon icon="icon-park-solid:table-report" />,
    route: "/reports",
    component: <Reports />,
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
    route: "/tables/manage-owner",
    component: <ManageOwner />,
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
    route: "/theatres/single-theatre/:id",
    component: <SingleTheatre />,
  },
  {
    route: "/eventOrganizations/single-eventOrganization/:id",
    component: <SingleEventOrganization />,
  },
  {
    route: "/eventOrganizations/add-eventOrganization",
    component: <AddEventOrganization />,
  },
  {
    route: "/eventOrganizations/edit-eventOrganization/:id",
    component: <EditEventOrganization />,
  },
  {
    route: "/venues/add-venue",
    component: <AddVenue />,
  },
  {
    route: "/venues/single-venue/:id",
    component: <SingleVenue />,
  },
  {
    route: "/venues/edit-venue/:id",
    component: <EditVenue />,
  },
  {
    route: "/theatres/single-theatre/add-screen/:id",
    component: <AddScreen />,
  },
  {
    route: "/theatres/single-theatre/single-screen/:screenId",
    component: <SingleScreen />,
  },
  {
    route: "/theatres/single-theatre/edit-screen/:screenId",
    component: <EditScreen />,
  },
  {
    route: "/theatres/single-theatre/single-screen/add-showTime/:screenId",
    component: <AddShowTime />,
  },
  {
    route: "/theatres/single-theatre/single-screen/edit-showTime/:showTimeId",
    component: <EditShowTime />,
  },
  {
    route: "/theatres/single-theatre/single-screen/add-zone/:screenId",
    component: <AddZone />,
  },
  {
    route: "/theatres/single-theatre/single-screen/single-zone/:id",
    component: <SingleZone />,
  },
  {
    route: "/theatres/single-theatre/single-screen/single-zone/edit-zone/:id",
    component: <EditZone />,
  },
  {
    route: "/venues/single-venue/add-zone/:venueId",
    component: <AddEventZone />,
  },
  {
    route: "/venues/single-venue/single-zone/:id",
    component: <SingleEventZone />,
  },
  {
    route: "/allUsers/add-theatreOwner",
    component: <AddTheatreOwner />,
  },
  {
    route: "/allUsers/edit-theatreOwner/:id",
    component: <EditTheatreOwner />,
  },
  {
    route: "/allUsers/theatreOwner/:id",
    component: <TheatreOwner />,
  },
  {
    route: "/allUsers/add-eventOrganizer",
    component: <AddEventOrganizer />,
  },
  {
    route: "/allUsers/eventOrganizer/:id",
    component: <EventOrganizer />,
  },
  {
    route: "/allUsers/edit-eventOrganizer/:id",
    component: <EditEventOrganizer />,
  },
  {
    route: "/bookings/book-seats/:showId/:screenId",
    component: <BookSeats />,
  },
  {
    route: "/eventBookings/book-seats/:eventId/:venueId",
    component: <SeatBookings />,
  },
  {
    route: "/bookings/book-seats/get-tickets",
    component: <GetTickets />,
  },
  {
    route: "/eventBookings/book-seats/get-tickets",
    component: <GetEventTicket />,
  },
  {
    route: "/viewTickets/single-ticket/:ticketId",
    component: <SingleTicketView />,
  },
  {
    route: "/events/add-event",
    component: <AddEvent />,
  },
  {
    route: "/events/edit-event/:id",
    component: <EditEvent />,
  },
  {
    route: "/events/single-event/:id",
    component: <SingleEvent />,
  },
  {
    route: "/events/single-event/:id/view-form",
    component: <ViewForm />,
  },
  {
    route: "/register/:eventId",
    component: <RegisterEvent />,
  },
  {
    route: "/events/single-event/:id/view-registrations",
    component: <ViewEventRegistrations />,
  },
  {
    route: "/events/add-mainEvent",
    component: <AddMainEvent />,
  },
  {
    route: "/events/edit-mainEvent/:id",
    component: <EditMainEvent />,
  },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
];

export default routes;