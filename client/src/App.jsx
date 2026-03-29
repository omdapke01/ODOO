import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppShell from "./layouts/AppShell";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import UsersPage from "./pages/UsersPage";
import RulesPage from "./pages/RulesPage";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="rules" element={<RulesPage />} />
      </Route>
    </Routes>
  );
}
