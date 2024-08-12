// src/components/utils/Loader.js
import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './Login.scss';

const Loader = ({ message = "", ...props }) => (
  <div className="loader-container" {...props}>
    <p className="loader-message">{message}</p>
    <div className="loader-spinner">
      <ProgressSpinner />
    </div>
  </div>
);

export default Loader;