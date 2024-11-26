import React, { useState, useEffect } from "react";

// Mocked UserService and EventBus for demonstration purposes.
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";

const Jobs = () => {
  // State for managing job data and form visibility
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ name: "", description: "",  });
  const [isFormVisible, setFormVisible] = useState(false);

  const getjobs = async()=>{
   const data = await AuthService.listJob();
   console.log(data, 'data')
   setJobs(data.jobs);

  }
  // Mock fetch jobs function (you should replace it with an API call in real use)
  useEffect(() => {
    // Simulating fetching jobs from an API
    getjobs()
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  // Handle form submission (simulating API call)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Simulate adding a new job to the jobs array
    const newJobData = { ...newJob, id: jobs.length + 1 };
    AuthService.createJob(newJob)
    setJobs([...jobs, newJobData]);

    // Clear form fields
    setNewJob({ title: "", description: "", salary: "" });

    // Close the form
    getjobs()
    setFormVisible(false);
  };

  // Toggle the form visibility
  const toggleFormVisibility = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h1>Job Listings</h1>
      </header>

      {/* Button to toggle job creation form */}
      <button className="btn btn-primary" onClick={toggleFormVisibility}>
        {isFormVisible ? "Cancel" : "Create Job"}
      </button>

      {/* Job creation form */}
      {isFormVisible && (
        <form onSubmit={handleFormSubmit} className="mt-3">
          <div className="form-group">
            <label htmlFor="name">Job Title</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={newJob.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Job Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={newJob.description}
              onChange={handleInputChange}
              required
            />
          </div> 
          <button type="submit" className="btn btn-success mt-3">
            Save Job
          </button>
        </form>
      )}

      {/* Jobs table */}
      <table className="table mt-5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Job Title</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job._id}</td>
              <td>{job.name}</td>
              <td>{job.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jobs;
