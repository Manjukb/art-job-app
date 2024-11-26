import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MONGODB_URI } from "../config.js"; // Assuming you've set the MongoDB URI in the config
import { faker } from '@faker-js/faker';  // Update this import line
import PaintingJob from "../models/paintingJob.js"; 


const generateRandomPaintingJob = async () => {
  // Fetch a random user to assign the job to

  // Generate random data for the PaintingJob schema
  const paintingJobData = {
    name: faker.company.name(),  // Random job name
    description: faker.lorem.paragraph(),  // Random description
    clientRequirements: faker.lorem.sentence(),  // Random client requirement
    status: 'open',
    approval: false,  // Random approval status
    drawingData: {},  // Empty drawing data
  };

  return paintingJobData;
};

const insertRandomPaintingJobs = async (numJobs = 10) => {
  try {
    // Check if any jobs already exist in the collection
      // If no jobs exist, insert random jobs
      for (let i = 0; i < numJobs; i++) {
        const paintingJob = await generateRandomPaintingJob();
        const newPaintingJob = new PaintingJob(paintingJob);
        await newPaintingJob.save();  // Save the job to the database
        console.log(`Inserted job ${i + 1}`);
      }
      console.log(`Successfully inserted ${numJobs} random painting jobs.`);
    
  } catch (error) {
    console.error('Error inserting random painting jobs:', error);
  }
};
export const connectToMongoDB = async () => {
  try {
    console.log(MONGODB_URI, 'MONGODB_URI');
    const db = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected to", db.connection.db.databaseName);

    // Access the raw MongoDB Db object using mongoose.connection.db
    const userExists = await db.connection.db.collection('users').findOne({ email: 'admin' });
    console.log("MongoDB connected to userExists", userExists);

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);  // Hash the password
      await db.connection.db.collection('users').insertOne({
        email: 'admin',
        password: hashedPassword,
        roles: [
          'admin'
        ]
      });

      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
    await insertRandomPaintingJobs(20);  // Insert 20 random painting jobs if none exist

  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB was disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
