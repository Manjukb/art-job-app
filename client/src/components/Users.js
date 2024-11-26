import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

const Users = () => {
  const [admin, setIsAdmin] = useState(false);
  const [users, setUser] = useState([]);

  const setUsers = async () => {
    const usersList = await AuthService.userList();
    console.log(usersList, "usersList");
    setUser(usersList);
  };
  useEffect(() => {
    setIsAdmin(AuthService.isAdmin());
    setUsers();
  }, []);

  const handleApprove = async(id)=>{
    await AuthService.approveUser(id);
  }
  return (
    <div className="container">
       <header className="jumbotron">
        <h1>Job Listings</h1>
      </header>
        {admin && (
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Approval</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                return (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                    <td>{user.approval ? "Approved" : "Pending"}</td>
                    <td>{!user.approval && <button id={user._id} onClick={()=>{handleApprove(user._id)}} type="button" class="btn btn-primary">Approve</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default Users;
