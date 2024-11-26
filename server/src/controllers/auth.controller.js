import createError from "http-errors";
import PaintingJob from "../models/paintingJob.js"; 
import User from "../models/User.js";
import { client } from "../helpers/init_redis.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../helpers/jwt_helpers.js";
import moment from 'moment';  // Optional, for easier date manipulation

export const signup = async (req, res) => {
  const { email, password } = req.body;

  // check if user already exists
  
  const user = await User.findOne({ email });
  if (user) throw new createError.Conflict(`${email} already exists`);

  const newUser = new User({ email, password, roles:['user'] });
  const savedUser = await newUser.save();

  const accessToken = await signAccessToken(savedUser.id);
  const refreshToken = await signRefreshToken(savedUser.id);

  res.json({ accessToken, refreshToken });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  // check if user is not registered
  const user = await User.findOne({ email });
  if (!user) throw new createError.NotFound(`${email} is not register`);
  if (!user.roles.includes('admin') && !user.approval) throw new createError.NotFound(`User not approved `);

  // const isValidPassword = await user.comparePassword(password);
  // if (!isValidPassword) throw new createError.Unauthorized("Invalid password");

  const accessToken = await signAccessToken(user.id);
  const refreshToken = await signRefreshToken(user.id);

  res.json({ accessToken, refreshToken, user });
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new createError.BadRequest("Invalid refresh token");

  const userId = await verifyRefreshToken(refreshToken);

  const accessToken = await signAccessToken(userId);
  const newRefreshToken = await signRefreshToken(userId);

  res.send({ accessToken, refreshToken: newRefreshToken });
};
export const approve = async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findOne({ _id: id});
  user.approval = true
  user.save()
  res.send(true);
};

export const createJob = async (req, res, next) => {
  try {
    // Destructure fields from the request body
    const {
      name,
      description,
      artStyle,
      medium,
      clientRequirements,
      startTime,
      endTime,
      assignedTo,
      budget,
      status,
      approval,
      data
    } = req.body;

    // Create a new job using the data provided in the request body
    const newJob = new PaintingJob({
      name,
      description,
      artStyle,
      medium,
      clientRequirements,
      startTime,
      endTime,
      assignedTo,
      budget,
      status,
      approval,
      data
    });

    // Save the job to the database
    const savedJob = await newJob.save();

    // Send success response with the saved job data
    res.status(201).json({
      message: "Job created successfully",
      job: savedJob
    });
  } catch (error) {
    // Handle any errors that occur during job creation
    console.error(error);
    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });
  }
};

export const listJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, unassigned, userId } = req.query;  // Get query parameters (page, limit, status)
console.log(req.query, 'req.query*************')
    // Build the query to filter by status (if provided)
    const query = {};
    if (status) {
      query.status = status;
    }
    if (unassigned) {
      query.assignedTo = { $exists: false }; // Filter jobs where 'assignedTo' does not exist or is null
    }
    if (userId) {
      query.assignedTo = userId; // Filter jobs where 'assignedTo' does not exist or is null
    }

    // Fetch jobs with pagination and filtering
    const jobs = await PaintingJob.find(query)
      .skip((page - 1) * limit)  // Skip jobs based on page number
      .limit(limit)  // Limit the number of results
      .sort({ createdAt: -1 });  // Sort by creation date in descending order

    // Get the total number of jobs for pagination purposes
    const totalJobs = await PaintingJob.countDocuments(query);

    // Send response with pagination info
    res.status(200).json({
      message: "Jobs fetched successfully",
      jobs: jobs,
      totalJobs: totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

export const listJob = async (req, res, next) => {
  try {
    const { jobId } = req.params; // Job ID passed in the URL

    // Find the job by its ID
    const job = await PaintingJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Send the job details in the response
    res.status(200).json({
      message: "Job fetched successfully",
      job: job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching job",
      error: error.message
    });
  }
};
 
export const listMetrics = async (req, res, next) => {
  try {
    // Extract startDate and endDate from query parameters
    const { startDate, endDate } = req.query;

    // Validate that startDate and endDate are valid dates
    if (startDate && !moment(startDate, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({ message: 'Invalid startDate format' });
    }
    if (endDate && !moment(endDate, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({ message: 'Invalid endDate format' });
    }

    // Create filter object for createdAt date range
    const dateFilter = {};
    if (startDate) {
      dateFilter.createdAt = { $gte: new Date(startDate) };
    }
    if (endDate) {
      dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(endDate) };
    }

    // Fetch the art jobs (id and createdAt only) within the date range
    const artJobs = await PaintingJob.find(dateFilter, 'createdAt')  // Fetching createdAt field
      .sort({ createdAt: 1 })  // Sorting jobs by createdAt in ascending order
      .lean();  // Using lean() for better performance

    // Format art jobs with job ID and createdAt timestamp
    const formattedArtJobs = artJobs.map((job, index) => ({
      id: index + 1,  // Assuming job IDs start from 1
      ...job,
    }));

    // Fetch employee production data (group by assignedTo, count jobs completed within date range)
    const employeeProduction = await PaintingJob.aggregate([
      {
        $match: {
          status: 'closed',  // Filter only completed jobs
          ...(startDate && { createdAt: { $gte: new Date(startDate) } }),  // Filter by startDate if provided
          ...(endDate && { createdAt: { $lte: new Date(endDate) } })  // Filter by endDate if provided
        }
      },
      {
        $group: {
          _id: '$assignedTo',  // Group by employee (assignedTo)
          jobsCompleted: { $sum: 1 },  // Count how many jobs the employee completed
        }
      },
      {
        $lookup: {
          from: 'users',  // Join with the 'users' collection to get employee details
          localField: '_id',  // Match the assignedTo field with _id in users collection
          foreignField: '_id',
          as: 'employee',  // Alias the result as 'employee'
        }
      },
      {
        $unwind: '$employee'  // Unwind the array to flatten the result
      },
      {
        $project: {
          employeeName: { $concat: '$employee.email' },  // Concatenate first and last name
          jobsCompleted: 1  // Include the count of completed jobs
        }
      }
    ]);

    // Format employee production data as required
    const formattedEmployeeProduction = employeeProduction.map(emp => ({
      employeeName: emp.employeeName,
      jobsCompleted: emp.jobsCompleted,
    }));

    // Send the response with the formatted data
    res.status(200).json({
      message: "Metrics fetched successfully",
      artJobs: formattedArtJobs,
      employeeProduction: formattedEmployeeProduction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching metrics",
      error: error.message
    });
  }
};


export const savedrawing = async (req, res, next) => {
  try {
    const { jobId } = req.body; // Job ID passed in the body
    const { drawingData } = req.body; // Drawing data passed in the body (can be base64, JSON, etc.)

    if (!jobId || !drawingData) {
      return res.status(400).json({ message: "Job ID and drawing data are required" });
    }

    // Find the job by ID
    const job = await PaintingJob.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Save the drawing data to the job
    job.drawingData = drawingData; // Assuming `drawingData` is a field in your PaintingJob model
    await job.save();

    // Send success response
    res.status(200).json({
      message: "Drawing data saved successfully",
      job: job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error saving drawing data",
      error: error.message
    });
  }
};

// Assign a job to a user
export const startJob = async (req, res, next) => {
  try {
    const { jobId, userId } = req.body;  // Get jobId and userId from the request body
    
    // Check if both jobId and userId are provided
    if (!jobId || !userId) {
      return res.status(400).json({
        message: "Job ID and User ID are required"
      });
    }

    // Check if the job exists
    const job = await PaintingJob.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Assign the job to the user
    job.assignedTo = userId;
    job.status = 'in progress';
    job.startTime = new Date();
    await job.save();  // Save the updated job document

    // Send success response
    res.status(200).json({
      message: "Job assigned successfully",
      job: job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to assign job",
      error: error.message
    });
  }
};
// Assign a job to a user
export const closeJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;  // Get jobId and userId from the request body
    // Check if the job exists
    const job = await PaintingJob.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }
    // Assign the job to the user
    job.status = 'closed';
    job.endTime = new Date();
    await job.save();  // Save the updated job document

    // Send success response
    res.status(200).json({
      message: "Job assigned successfully",
      job: job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to closeJob",
      error: error.message
    });
  }
};


export const logout = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return next(new createError.BadRequest());

  const userId = await verifyRefreshToken(refreshToken);

  const result = await client.del(userId);
  console.log(result);

  return res.sendStatus(204);
};

export const profile = async (req, res, next) => {
  const user = await User.findById(req.userId).select("-password");
  return res.json(user);
};


export const userList = async (req, res, next) => {
  const user = await User.find({email:{$ne:'admin'}}).select("-password");
  return res.json(user);
};
