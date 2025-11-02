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
    path: 'dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OwnerDashboardPage /> },
      { path: 'my-boardinghouse', element: <MyBoardinghousePage /> },
      { path: 'add-new', element: <AddNewPage /> },
      { path: 'edit-listing/:id', element: <AddNewPage /> },
      { path: 'settings', element: <AccountSettingsPage /> },
      // Redirect base dashboard to the main view
      { path: '', element: <Navigate to="my-boardinghouse" replace /> }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BoardingHouseProvider>
      <RouterProvider router={router} />
    </BoardingHouseProvider>
  </StrictMode>,
);
