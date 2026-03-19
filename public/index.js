// public/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the import according to your App component path

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Make sure you have a root div in your index.html
);