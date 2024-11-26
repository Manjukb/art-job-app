import axios from "axios";

const API_URL = "http://localhost:9001/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      email:username,
      password,
    })
    .then((response) => {
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};
const userList = () => {
  return axios
    .get(API_URL + "list")
    .then((response) => {
      return response.data;
    });
};
const getMetricData = () => {
  // startDate, endDate
  return axios
    .get(API_URL + "listmetric")
    .then((response) => {
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const approveUser = (id) => {
  return axios.post(API_URL + "approve", {
    id:id,
  }).then((response) => {
    return response.data;
  });
};


const createJob = (job) => {
  return axios.post(API_URL + "createjob",  job).then((response) => {
    return response.data;
  });
};
const startJob = (jobId, userId) => {
  return axios.post(API_URL + "startjob",  {
    jobId: jobId, 
    userId: userId
  }).then((response) => {
    return response.data;
  });
};
const closeJob = (jobId) => {
  return axios.post(API_URL + "closeJob",  {
    jobId: jobId
  }).then((response) => {
    return response.data;
  });
};
const listJob = (id) => {
  return axios.get(API_URL + "listjob").then((response) => {
    return response.data;
  });
};
const listUnassignedJob = (id) => {
 
  return axios.get(API_URL + "listjob?unassigned=true").then((response) => {
    return response.data;
  });
};
const listMyJobs = (userId) => {
 
  return axios.get(API_URL + `listjob?userId=${userId}`).then((response) => {
    return response.data;
  });
};
const getOneJob = (jobId) => {
 
  return axios.get(API_URL + `job/${jobId}`).then((response) => {
    return response.data;
  });
};
const savedrawing = (jobId,drawingData ) => {
 
  return axios.post(API_URL + "savedrawing",  {
    jobId: jobId, 
    drawingData: drawingData
  }).then((response) => {
    return response.data;
  });
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const isAdmin = () => {
  const user = getCurrentUser();
  console.log(user, 'user********')
  if (user && user.user.roles.includes("admin")) {
    return true;  // User is an admin and is approved
  }
  return false;  // User is either not an admin or not approved
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  isAdmin,
  userList,
  approveUser,
  listJob,
  createJob,
  listUnassignedJob,
  startJob,
  listMyJobs,
  savedrawing,
  getOneJob,
  closeJob,
  getMetricData
}

export default AuthService;
