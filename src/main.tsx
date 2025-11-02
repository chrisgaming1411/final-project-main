import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

import HomePage from './pages/Home.tsx';
import AboutPage from './pages/About.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import AuthLayout from './layouts/AuthLayout.tsx';
import DashboardLayout from './layouts/DashboardLayout.tsx';
import MyBoardinghousePage from './pages/owner/MyBoardinghouse.tsx';
import OwnerDashboardPage from './pages/owner/Dashboard.tsx';
import AddNewPage from './pages/owner/AddNew.tsx';
import AccountSettingsPage from './pages/owner/AccountSettings.tsx';
import FindBoardinghousePage from './pages/FindBoardinghouse.tsx';
import BoardingHouseDetailsPage from './pages/BoardingHouseDetails.tsx';
import { BoardingHouseProvider } from './contexts/BoardingHouseContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import SeekerDashboardLayout from './layouts/SeekerDashboardLayout.tsx';
import SeekerDashboardPage from './pages/seeker/Dashboard.tsx';
import SeekerFavoritesPage from './pages/seeker/Favorites.tsx';
import { FavoritesProvider } from './contexts/FavoritesContext.tsx';
import SeekerAccountSettingsPage from './pages/seeker/AccountSettings.tsx';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'find',
        element: <FindBoardinghousePage />,
      },
      {
        path: 'listing/:id',
        element: <BoardingHouseDetailsPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['owner']} />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="my-boardinghouse" replace /> },
          { path: 'my-boardinghouse', element: <MyBoardinghousePage /> },
          { path: 'add-new', element: <AddNewPage /> },
          { path: 'edit-listing/:id', element: <AddNewPage /> },
          { path: 'settings', element: <AccountSettingsPage /> },
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute allowedRoles={['seeker']} />,
    children: [
      {
        path: 'seeker-dashboard',
        element: <SeekerDashboardLayout />,
        children: [
          { index: true, element: <SeekerDashboardPage /> },
          { path: 'find', element: <FindBoardinghousePage /> },
          { path: 'favorites', element: <SeekerFavoritesPage /> },
          { path: 'settings', element: <SeekerAccountSettingsPage /> },
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BoardingHouseProvider>
        <FavoritesProvider>
          <RouterProvider router={router} />
        </FavoritesProvider>
      </BoardingHouseProvider>
    </AuthProvider>
  </StrictMode>,
);
