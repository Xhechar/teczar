import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PageLoader } from "./components/PageLoader";
import AdminDashboard from "./pages/admin/AdminDashboard";
import {
  AdminServices,
  AdminCategories,
  AdminOrders,
  AdminPayments,
  AdminReviews,
  AdminAdverts,
  AdminServiceRequests,
  AdminJobs,
  AdminJobApplications,
} from "./pages/admin/AdminPages";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import { ToastProvider } from "./components/Toast";
import AdminSlider from "./pages/admin/AdminSlider";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { AuthProvider } from "./context/AuthContext";
import { GuestGuard, CustomerGuard, AdminGuard } from "./guards/guards";
import { AdminTeamMembers } from "./pages/admin/AdminTeamMembers";

const HomePage = lazy(() => import("./pages/HomePage"));
const ExplorePage = lazy(() => import("./pages/ExplorePage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const MeetTeamPage = lazy(() => import("./pages/MeetTeamPage"));

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/customer/OrdersPage"));
const CartPage = lazy(() => import("./pages/customer/CartPage"));
const BookingsPage = lazy(() => import("./pages/customer/BookingsPage"));
const SettingsPage = lazy(() => import("./pages/customer/SettingsPage"));

// ─── App ─────────────────────────────────────────────────────────
const App: React.FC = () => (
  <ToastProvider>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Fully public — no auth required ── */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/meet-team" element={<MeetTeamPage />} />

            <Route
              path="/login"
              element={
                <GuestGuard>
                  <LoginPage />
                </GuestGuard>
              }
            />
            <Route
              path="/register"
              element={
                <GuestGuard>
                  <RegisterPage />
                </GuestGuard>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestGuard>
                  <ForgotPasswordPage />
                </GuestGuard>
              }
            />

            <Route
              path="/profile"
              element={
                <CustomerGuard>
                  <ProfilePage />
                </CustomerGuard>
              }
            />
            <Route
              path="/orders"
              element={
                <CustomerGuard>
                  <OrdersPage />
                </CustomerGuard>
              }
            />
            <Route
              path="/cart"
              element={
                <CustomerGuard>
                  <CartPage />
                </CustomerGuard>
              }
            />
            <Route
              path="/bookings"
              element={
                <CustomerGuard>
                  <BookingsPage />
                </CustomerGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <CustomerGuard>
                  <SettingsPage />
                </CustomerGuard>
              }
            />

            {/*
                ── Admin-protected routes ──
                AdminGuard:
                  • Not logged in    → /login?redirect=<current path>
                  • Role ≠ Admin     → 403 Unauthorised screen
                  • Role = Admin     → renders the page
              */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminGuard>
                  <AdminUsers />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminGuard>
                  <AdminProducts />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/slider"
              element={
                <AdminGuard>
                  <AdminSlider />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminGuard>
                  <AdminServices />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminGuard>
                  <AdminCategories />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminGuard>
                  <AdminOrders />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminGuard>
                  <AdminPayments />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/reviews"
              element={
                <AdminGuard>
                  <AdminReviews />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/adverts"
              element={
                <AdminGuard>
                  <AdminAdverts />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/service-requests"
              element={
                <AdminGuard>
                  <AdminServiceRequests />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminGuard>
                  <AdminJobs />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/team-members"
              element={
                <AdminGuard>
                  <AdminTeamMembers />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminGuard>
                  <AdminJobApplications />
                </AdminGuard>
              }
            />

            {/* ── Catch-all ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </ToastProvider>
);

export default App;
