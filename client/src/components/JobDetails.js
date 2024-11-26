import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import { useNavigate, useParams } from "react-router-dom";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "./utils"; // Utility to convert stroke to SVG path
import PaintComponent from "./PaintComponent";
// import "./styles.css"; // Assuming you have custom styles

const options = {
  size: 32,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 0,
    easing: (t) => t,
    cap: true,
  },
  end: {
    taper: 100,
    easing: (t) => t,
    cap: true,
  },
};

const JobDetails = () => {
  const { jobId } = useParams();  // Extract jobId from the URL using useParams

  const [points, setPoints] = useState([]); // Track points for drawing
  const [jobs, setJobs] = useState([]); // State to hold jobs data
  const [myjobs, setMyJobs] = useState([]); // State to hold user's jobs data
  const [jobStarting, setJobStarting] = useState(false); // Track if job is starting
  const [loadingJob, setLoadingJob] = useState(null); // Track which job is loading
  const [newJob, setNewJob] = useState({ name: "", description: "" }); // Job form state
  const [isFormVisible, setFormVisible] = useState(false); // Toggle form visibility
  const navigate = useNavigate(); // Navigation hook
  const [isSaved, setIsSaved] = useState(false);

  // Function to handle pointer down event (start drawing)
  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setPoints([[e.pageX, e.pageY, e.pressure]]);
  }

  // Function to handle pointer move event (draw as pointer moves)
  function handlePointerMove(e) {
    if (e.buttons !== 1) return; // Only draw when the left mouse button is pressed
    setPoints([...points, [e.pageX, e.pageY, e.pressure]]);
  }

  // Fetch jobs function (mocked - replace with real API calls)
  const getJobs = async () => {
    const data = await AuthService.listUnassignedJob();
    setJobs(data.jobs);
  };

  // Fetch user's jobs function (mocked - replace with real API calls)
  const getMyJobs = async () => {
    const userdata = AuthService.getCurrentUser();
    const data = await AuthService.listMyJobs(userdata.user._id);
    setMyJobs(data.jobs);
  };

  // Effect to fetch jobs when component mounts
  useEffect(() => {
    getJobs();
    getMyJobs();
  }, []);

  // Function to start a job and navigate to its page
  const startJob = async (jobId) => {
    console.log(`Starting job with ID: ${jobId}`);
    setLoadingJob(jobId); // Set the loading state for the job
    const userdata = AuthService.getCurrentUser();
    const data = await AuthService.startJob(jobId, userdata.user._id);
    console.log(data, "data*************");
    navigate(`/job/${data.job._id}`); // Navigate to job details page
    setLoadingJob(null); // Reset loading state once the job is done
  };

  // Generate the SVG path data for drawing
  const handleSave = () => {
    setIsSaved(true);
    // Optionally, navigate after saving the drawing (e.g., to the job details page)
  };
  return (
    <div className="container">
      <header className="jumbotron">
        <h1>Job Details</h1>
      </header>
      <PaintComponent jobId={jobId} onSave={handleSave} />
    </div>
  );
};

export default JobDetails;
