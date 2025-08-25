import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/user/HomePage";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import BookList from "./components/user/BookList";
import BookDetail from "./components/user/BookDetail";
import Favorites from "./components/user/Favorites";
import Communities from "./components/user/Communities";
import CommunityDetail from "./components/user/CommunityDetail";
import Profile from "./components/user/Profile";
import BookManager from "./components/admin/BookManager";
import CommunityManager from "./components/admin/CommunityManager";
import GenreManager from "./components/admin/GenreManager";
import SalesPage from "./components/admin/SalesPage";
import OrdersList from "./components/admin/OrdersList";
import { ProtectedRoute } from "../services/ProtectedRoute";
import NotAuthorized from "./components/user/NotAuthorized";
import CartPage from "./components/user/CartPage";
import MyOrders from "./components/user/MyOrders";
import DetailOrder from "./components/admin/DetailOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Quyền User */}
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities"
          element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/communities/:id"
          element={
            <ProtectedRoute>
              <CommunityDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Quyền Admin */}
        <Route
          path="/admin/manage-book"
          element={
            <ProtectedRoute requiredRole={false}>
              <BookManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-community"
          element={
            <ProtectedRoute requiredRole={false}>
              <CommunityManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-genre"
          element={
            <ProtectedRoute requiredRole={false}>
              <GenreManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute requiredRole={false}>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requiredRole={false}>
              <OrdersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/detail-order/:id"
          element={
            <ProtectedRoute requiredRole={false}>
              <DetailOrder />
            </ProtectedRoute>
          }
        />

        <Route path="/not-authorized" element={<NotAuthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
