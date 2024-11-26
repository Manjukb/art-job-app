import mongoose from "mongoose";

const paintingJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      default: 'No description provided',  // Default description if not provided
    },
    artStyle: {
      type: String,
      required: false,
      default: 'Abstract',  // Default art style if not provided
    },
    medium: {
      type: String,
      required: false,
      default: 'Oil paint',  // Default medium if not provided
    },
    clientRequirements: {
      type: String,
      required: false,
      default: 'No specific client requirements',  // Default client requirements if not provided
    },
    startTime: {
      type: Date,
      required: false,
      default: Date.now,  // Default to the current date/time
    },
    endTime: {
      type: Date,
      required: false,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to one week from the current date
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the artist working on the job
      required: false,
    },
    budget: {
      type: Number,
      required: false,
      default: 500,  // Default budget if not provided
    },
    status: {
      type: String,
      enum: ["open", "in progress",  "closed"],
      default: "open",  // Default status is "open"
    },
    approval: {
      type: Boolean,
      default: false, // Default approval status to false
    },
    drawingData: {
      type: mongoose.Schema.Types.Mixed, // Accepts any type of data
      default: {}, // Default to an empty object if no data is provided
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("PaintingJob", paintingJobSchema);
