import React from 'react';

const FormControl = ({ onFilterChange, currentFilter, onSearchChange, searchValue }) => {
  return (
    <div className="form-controls">
      <div className="form-controls-left">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="filter-section">
          <select 
            className="filter-dropdown"
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="enabled">Enabled</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FormControl;
