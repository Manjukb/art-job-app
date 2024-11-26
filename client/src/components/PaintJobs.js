import React, { useState, useEffect } from "react";

// Mocked UserService and EventBus for demonstration purposes.
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const PaintJobs = () => {
  // State for managing job data and form visibility
  const [jobs, setJobs] = useState([]);
  const [myjobs, setMyJobs] = useState([]);
  const [loadingJob, setLoadingJob] = useState(null); // Track which job is loading
  const navigate = useNavigate();  // Hook to navigate to different routes

  const getjobs = async()=>{
   const data = await AuthService.listUnassignedJob();
   console.log(data, 'data')
   setJobs(data.jobs);

  }
  const getMyjobs = async()=>{
  const userdata = AuthService.getCurrentUser()

   const data = await AuthService.listMyJobs(userdata.user._id);
   console.log(data, 'data')
   setMyJobs(data.jobs);

  }
  // Mock fetch jobs function (you should replace it with an API call in real use)
  useEffect(() => {
    // Simulating fetching jobs from an API
    getjobs()
    getMyjobs()
  }, []);

  
  const startJob = async(jobId) => {
    // Replace with your actual logic for starting the job
    console.log(`Starting job with ID: ${jobId}`);
    setLoadingJob(jobId); // Set the loading state for the job
  const userdata = AuthService.getCurrentUser()
   const data = await AuthService.startJob(jobId, userdata.user._id);
   navigate(`/job/${data.job._id}`); // Change this to the route of your job page
   setLoadingJob(null); // Reset loading state once the job is done
    // Example: Make an API call to start the job
  };
  const viewjob = async(jobId) => {
   navigate(`/job/${jobId}`);  
  };
  return (
    <div className="container">
      <header className="jumbotron">
        <h1>Available jobs</h1>
      </header>

      {/* Jobs table */}
      <table className="table mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Job Title</th>
            <th>Description</th>
            <th>Action</th> {/* New column for action */}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job._id}</td>
              <td>{job.name}</td>
              <td>{job.description}</td>
              <td>
              <button
                className="btn btn-primary"
                onClick={() => startJob(job._id)}
                disabled={loadingJob === job._id} // Disable button if job is loading
              >
                {loadingJob === job._id ? (
                  <span>Loading...</span> // Show "Loading..." when the job is being processed
                ) : (
                  <span>Start Job</span> // Show "Start Job" otherwise
                )}
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
      <header className="jumbotron">
        <h1>My jobs</h1>
      </header>

      {/* Jobs table */}
      <table className="table mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Job Title</th>
            <th>Description</th>
            <th>Action</th> {/* New column for action */}
          </tr>
        </thead>
        <tbody>
          {myjobs.map((job) => (
            <tr key={job.id}>
              <td>{job._id}</td>
              <td>{job.name}</td>
              <td>{job.description}</td>
              <td>
              <button
                className="btn btn-primary"
                onClick={() => viewjob(job._id)}
                disabled={loadingJob === job._id} // Disable button if job is loading
              >
                {loadingJob === job._id ? (
                  <span>Loading...</span> // Show "Loading..." when the job is being processed
                ) : (
                  <span>View job</span> // Show "Start Job" otherwise
                )}
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaintJobs;
