import { ProgressSpinner } from 'primereact/progressspinner';
import React from 'react';

const ReviewContracts = () => {
    return (
      <div className="work-in-progress-container">
        <ProgressSpinner className="pi-spin" />
        <div className="progress-message">
          We are currently working on this component. Please check back soon!
        </div>
      </div>
    );
  }
  
export default ReviewContracts;
  