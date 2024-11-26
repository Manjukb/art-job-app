import * as React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import AuthService from "../services/auth.service";
import { useNavigate } from 'react-router-dom';

const styles = {
    border: '0.0625rem solid #9c9c9c',
    borderRadius: '0.25rem',
  };
  
  const buttonStyles = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
  };

const Canvas = ({ jobId }) => {
  const canvasRef = React.useRef(null);  // Use useRef to avoid re-renders
  const [savedDrawing, setSavedDrawing] = React.useState(null);
  const [job, setJob] = React.useState(null);
  const navigate = useNavigate();  // Hook to navigate to different routes

  // Fetch saved drawing data when the component mounts
  React.useEffect(() => {
    const fetchSavedDrawing = async () => {
      try {
        const response = await AuthService.getOneJob(jobId);
        console.log(response.job.drawingData, 'response****************')
        setJob(response.job)
        if (response) {
          setSavedDrawing(response.job.drawingData);
        }
      } catch (error) {
        console.error('Error fetching saved drawing:', error);
      }
    };

    fetchSavedDrawing();
  }, [jobId]);  // Only run when jobId changes

  // This effect is triggered when savedDrawing data is available
  React.useEffect(() => {
    if (canvasRef.current && savedDrawing) {
        console.log(canvasRef.current, 'canvasRef.current()(')
      canvasRef.current.loadPaths(savedDrawing);  // Load the saved drawing into the canvas
    }
  }, [savedDrawing]); // Only run when savedDrawing data changes

  // Save drawing data to the backend when the user finishes drawing
  const saveDrawing = async () => {
    if (!canvasRef.current) return;
    console.log(canvasRef, 'canvasRef*********')
    const drawingData = await canvasRef.current.exportPaths();  // This exports the paths as an array 

    console.log('Exported drawing data:', drawingData);

    try {
      const response = await AuthService.savedrawing(jobId, drawingData);
      if (response.status === 200) {
        console.log('Drawing saved successfully');
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
    }
  };
  const closeJob = async () => {
    const response = await AuthService.closeJob(jobId);
    navigate('/paintjob')
  };

  return (
    <div>
      <h3>Paint Your Drawing</h3>
      <ReactSketchCanvas
        ref={canvasRef}  // Assign ref using useRef
        style={styles}
        width="600"
        height="400"
        strokeWidth={4}
        strokeColor="red"
        onStroke={(data) => console.log('Drawing in progress', data)} // Log drawing data
      />
      {/* Buttons Container */}
      {job?.status !== 'closed' &&  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button style={buttonStyles} onClick={saveDrawing}>Save Drawing</button>
        <button style={buttonStyles} onClick={closeJob}>Close Job</button>
      </div>}
     
    </div>
  );
};

export default Canvas;
