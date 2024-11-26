import React from "react";
import AuthService from "../services/auth.service";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
if(!currentUser) return null
  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{currentUser.user.email}</strong> Profile
        </h3>
      </header>
      <p>
        <strong>Id:</strong> {currentUser.user._id}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.user.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
    </div>
  );
};

export default Profile;
