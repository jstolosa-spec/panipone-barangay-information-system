import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DirectoryPage } from '@/pages/DirectoryPage'
import { ServicesPage } from '@/pages/ServicesPage'
import { AnnouncementsPage } from '@/pages/AnnouncementsPage'
import { AppLayout } from '@/components/layout/AppLayout'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <AppLayout><DashboardPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/directory",
    element: <AppLayout><DirectoryPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/services",
    element: <AppLayout><ServicesPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/announcements",
    element: <AppLayout><AnnouncementsPage /></AppLayout>,
    errorElement: <RouteErrorBoundary />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)