import React from 'react';
import './loadinganimation.css'; 

function LoadingAnimation({ progressPercent }) {
  return (
    <div className="loading-animation-wrapper">
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

export default LoadingAnimation;
