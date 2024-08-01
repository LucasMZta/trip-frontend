import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateTripPage } from "./pages/create-trip";
import { TripDetailsPage } from "./pages/trip-details";
import { ErrorPage } from "./pages/error-page";
import { TripConfirmParticipant } from "./pages/trip-details/confirm-participant";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TripDetailsPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/trips/:tripId",
    element: <CreateTripPage />,
  },
  {
    path: "/participants/:participantId/confirm",
    element: <TripConfirmParticipant />
  }
]);

export const App = () => {
  return <RouterProvider router={router} />

}
