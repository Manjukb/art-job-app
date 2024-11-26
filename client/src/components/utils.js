// utils.js

// Function to convert a stroke (array of points) into an SVG path string
export function getSvgPathFromStroke(stroke) {
    return stroke
      .map(([x, y]) => `${x},${y}`)
      .join(' '); // Convert array of points to a string like 'x1,y1 x2,y2 x3,y3'
  }
  