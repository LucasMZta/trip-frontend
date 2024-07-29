import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./pages/trip-details";
import { ErrorPage } from "./pages/error-page";
import { TripConfirmParticipant } from "./pages/trip-details/confirm-participant";
import dotenv from 'dotenv';


const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateTripPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/trips/:tripId",
    element: <TripDetailsPage />,
  },
  {
    path: "/participants/:participantId/confirm",
    element: <TripConfirmParticipant />
  }
]);

export const App = () => {
  dotenv.config();
  return <RouterProvider router={router} />

}
