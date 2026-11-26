import { Route, Routes, Navigate } from "react-router";

import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import ProtectedRoute from "./routes/ProtectedRoute/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import TravelerPage from "./pages/TravelerPage/TravelerPage";
import AgentPage from "./pages/AgentPage/AgentPage";
import GetUser from "./routes/GetUser/GetUser";
import GuestRouter from "./routes/GuestRoute/GuestRoute";
import { UserRole } from "./type";

function App() {
  return (
    <Routes>
      <Route element={<GuestRouter />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
      </Route>

      <Route element={<GetUser />}>
        <Route path="/profile" element={<Profile />} />
        <Route element={<ProtectedRoute allowedRoles={[UserRole.Traveler]} />}>
          <Route path="/profile/traveler" element={<TravelerPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={[UserRole.Agent]} />}>
          <Route path="/profile/agent" element={<AgentPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
