import React from 'react';


const TableComponent = ({ data, total, onToggle, onEdit, onDelete }) => {
  return (
    <table className="offer-table">
      <thead>
        <tr>
          <th></th>
          <th>Offer</th>
          <th>Impressions</th>
          <th>Conversions</th>
          <th>Revenue</th>
          <th>Conversion Rate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.isEnabled}
                  onChange={() => onToggle(item.id)}
                />
                <span className="slider round"></span>
              </label>
            </td>
            <td>{item.discountCode}</td>
            <td>{item.impressions}</td>
            <td>{item.conversions}</td>
            <td>$ {Number(item.revenue)?.toFixed(2)}</td>
            <td>{Number(item.conversionRate)?.toFixed(2)} %</td>
            <td>
              <button 
                className="edit-button"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => onDelete(item.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
        <tr className="total">
          <td></td>
          <td>Total</td>
          <td>{total.impressions}</td>
          <td>{total.conversions}</td>
          <td>${Number(total.revenue).toFixed(2)}</td>
          <td>{Number(total.conversionRate)}%</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableComponent;
