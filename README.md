# Application README

This application is a full-stack solution with the following components:

- **Client** (Frontend): A React-based user interface.
- **Server** (Backend): An Express API that handles business logic and data management.
- **MongoDB** (Database): Stores user and job data.

### **Prerequisites**

- Docker and Docker Compose to run the application with all services.
- If you don't use Docker, you'll need to run each service separately (MongoDB, backend server, and frontend client).

### **Quick Start Guide**

#### **Option 1: Using Docker Compose (Recommended)**

1. **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2. **Install Docker**: If you don’t have Docker installed, you can follow the installation guide for your operating system from the official [Docker website](https://www.docker.com/get-started).

3. **Start the services** using Docker Compose:

    In the project directory, where the `docker-compose.yml` file is located, run the following command:

    ```bash
    docker-compose up --build
    ```

    This will:
    - Build and start the **frontend** (React), **backend** (Express), and **MongoDB** services.
    - If it’s the first time running, an **admin** user with the username `admin` and password `admin` will be created in the database.
    - A few sample jobs will also be inserted automatically to start with.

4. **Access the Application**:

    Once the services are up and running, you can access the application at:

    ```bash
    http://localhost:3000
    ```

    This will bring you to the React application running on port 3000.

#### **Option 2: Running Services Individually (Without Docker)**

If you don’t want to use Docker, you’ll need to run the **MongoDB**, **Backend Server**, and **Frontend Client** separately.

1. **Running MongoDB**:
   
   - Install MongoDB on your machine from [here](https://www.mongodb.com/try/download/community).
   - Start MongoDB service:
   
     ```bash
     mongod --port 27017
     ```

2. **Running Backend Server**:
   
   - Install dependencies:
   
     ```bash
     cd server
     npm install
     ```
   
   - Start the backend server:
   
     ```bash
     npm start
     ```

   This will start the Express API on `http://localhost:5000`.

3. **Running Frontend Client**:

   - Install dependencies:
   
     ```bash
     cd client
     npm install
     ```

   - Start the frontend client:

     ```bash
     npm start
     ```

   This will start the React application on `http://localhost:3000`.

---

### **Application Workflow**

- **Admin Account**: 
  - Username: `admin`
  - Password: `admin`
  - The admin account is created automatically if it doesn't exist during the application startup.

- **Creating Employees**:
  - Admin users can sign up new employees by clicking **Sign Up** on the homepage.
  - Admin approval is required for employees to log in. Once the admin approves, the employee can log in with their email and password.

- **Login**:
  - Employees log in after the admin approval by providing their registered email and password.
  - The **admin** can log in using the credentials `admin/admin`.

- **Creating Jobs**:
  - Admin users can create new jobs through the interface.
  - Each job can be assigned to employees.

- **Employee Job Management**:
  - Employees can pick up any unassigned job.
  - Employees can also save their progress on jobs and continue later.

- **Metrics Dashboard**:
  - Admin users can view metrics related to job completion and employee production.

---

### **Features**

- **Admin Features**:
  - Create and assign jobs.
  - View employee metrics (jobs completed).
  - Approve employee accounts for login.
  - Login with the `admin` credentials (`admin/admin`).

- **Employee Features**:
  - Sign up and wait for admin approval.
  - Pick up unassigned jobs.
  - Save progress on jobs.

### **Technologies Used**

- **Frontend**:
  - React
  - React Router for navigation
  - Datepicker for selecting dates
  
- **Backend**:
  - Node.js
  - Express.js
  - Mongoose for MongoDB integration
  - Bcrypt for password hashing
  
- **Database**:
  - MongoDB for data storage

### **Folder Structure**

- `/client`: React-based frontend code.
- `/server`: Express-based backend API.
- `/docker-compose.yml`: Docker Compose configuration file for multi-container setup.
 
---

### **Troubleshooting**

- **MongoDB not connecting**:
  - Make sure MongoDB is running locally if you're not using Docker.
  - Check MongoDB logs to confirm it's up and running on `localhost:27017`.
  
- **Can't log in**:
  - Ensure that the admin has approved the employee account before login.
  - Verify that the login credentials are correct (use `admin/admin` for admin).

---
 