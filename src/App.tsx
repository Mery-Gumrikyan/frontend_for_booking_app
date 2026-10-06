import { Route, Routes, Navigate } from "react-router";

import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Profile from "./pages/Profile/Profile";
import TravelerPage from "./pages/TravelerPage/TravelerPage";
import AgentPage from "./pages/AgentPage/AgentPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/traveler" element={<TravelerPage />}></Route>
          <Route path="/profile/agent" element={<AgentPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
