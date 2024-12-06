import React from 'react';

const Loader = ({ Loading, children }) => {
  if (!Loading) {
    return children;
  }

  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-spinner"></div>
        <p>Loading</p>
      </div>
    </div>
  );
};

export default Loader;
