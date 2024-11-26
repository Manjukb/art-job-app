import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from "react-datepicker"; // For date selection
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthService from "../services/auth.service";

// Register necessary components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  // Register PointElement for Line chart
  LineElement,   // Register LineElement for Line chart
  Title,
  Tooltip,
  Legend
);

const MetricComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [artJobs, setArtJobs] = useState([]);
  const [employeeProduction, setEmployeeProduction] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the data when the selected date changes
    fetchMetricsData(selectedDate);
  }, [selectedDate]);

  const fetchMetricsData = async (date) => {
    setLoading(true);
    try {
      // Replace the below URL with your API endpoint that provides the data
      const response = await AuthService.getMetricData(date);

      console.log("Fetched Data:", response); // Log the fetched data for debugging

      if (response) {
        setArtJobs(response.artJobs); // Array of job counts created on the selected date
        setEmployeeProduction(response.employeeProduction); // Array of { employeeName, jobsCompleted }
      } else {
        console.error("No data found or empty response.");
      }
    } catch (error) {
      console.error("Error fetching metrics data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Data preparation for charts
  const artJobsData = {
    labels: [selectedDate.toDateString()], // Single date label
    datasets: [
      {
        label: 'Number of Art Jobs Created',
        data: [artJobs.length], // Number of jobs created on the selected date
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const employeeData = {
    labels: employeeProduction.map(item => item.employeeName), // Names of employees
    datasets: [
      {
        label: 'Jobs Completed by Employees',
        data: employeeProduction.map(item => item.jobsCompleted),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h2>Metrics for {selectedDate.toDateString()}</h2>

      <div className="mb-3">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
        />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h4>Employee Job Production</h4>
            <Bar 
              data={employeeData} 
              options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Employee Production' } }
              }} 
            />
          </div>
          <div className="mb-4">
            <h4>Art Jobs Created on {selectedDate.toDateString()}</h4>

            <Line 
              data={artJobsData} 
              options={{
                responsive: true,
                plugins: { title: { display: true, text: 'Art Jobs Created' } }
              }} 
            />
          </div>

        
        </>
      )}
    </div>
  );
};

export default MetricComponent;
