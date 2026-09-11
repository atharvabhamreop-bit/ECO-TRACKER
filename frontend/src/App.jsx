import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Activities from "./pages/Activities";

function App() {
  const [ecoPoints, setEcoPoints] = useState(0);
  const [completedActivities, setCompletedActivities] = useState([]);

  return (
    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              ecoPoints={ecoPoints}
              completedActivities={completedActivities}
            />
          }
        />

        {/* Activities */}
        <Route
          path="/activities"
          element={
            <Activities
              ecoPoints={ecoPoints}
              setEcoPoints={setEcoPoints}
              completedActivities={completedActivities}
              setCompletedActivities={setCompletedActivities}
            />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <Profile
              ecoPoints={ecoPoints}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;