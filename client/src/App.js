import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import Jobs from "./components/Jobs";
import Users from "./components/Users";
import PaintJobs from "./components/PaintJobs";
import JobDetails from "./components/JobDetails";
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import MetricComponent from "./components/Metric";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.user.roles.includes("user"));
      setShowAdminBoard(user.user.roles.includes("admin"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">Home</Link>
        <div className="navbar-nav mr-auto">
          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/paintjob"} className="nav-link">Paint Job</Link>
            </li>
          )}

          {showAdminBoard && (
            <>
              <li className="nav-item">
                <Link to={"/jobs"} className="nav-link">Jobs</Link>
              </li>
              <li className="nav-item">
                <Link to={"/users"} className="nav-link">Users</Link>
              </li>
              <li className="nav-item">
                <Link to={"/metric"} className="nav-link">Metrics</Link>
              </li>
            </>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">{currentUser.username}</Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>LogOut</a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">Sign Up</Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/home"} element={<Profile />} />
          <Route exact path={"/users"} element={<PrivateRoute element={<Users />} allowedRoles={['admin']} />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/jobs" element={<PrivateRoute element={<Jobs />} allowedRoles={['admin']} />} />
          <Route exact path="/metric" element={<PrivateRoute element={<MetricComponent />} allowedRoles={['admin']} />} />
          <Route path="/job/:jobId" element={<PrivateRoute element={<JobDetails />} allowedRoles={['user']} />} />
          <Route exact path="/paintjob" element={<PrivateRoute element={<PaintJobs />} allowedRoles={['user']} />} />
          
          {/* Admin, Moderator, and User Routes */}
          <Route path="/user" element={<PrivateRoute element={<BoardUser />} allowedRoles={['user']} />} />
          <Route path="/mod" element={<PrivateRoute element={<BoardModerator />} allowedRoles={['moderator', 'admin']} />} />
          <Route path="/admin" element={<PrivateRoute element={<BoardAdmin />} allowedRoles={['admin']} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
