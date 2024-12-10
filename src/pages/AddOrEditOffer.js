import React, { useState, useEffect } from 'react';

const AddorEditOffer = ({ onSubmit, onCancel, editData = null }) => {
  const [OfferInputData, setOfferInputData] = useState({
    id: '',
    offerName: '',
    discountCode: '',
    minimumCartValue: '',
    discountPercentage: '',
    productId: '',
    productVariantId: '',
    backgroundColor: 'FFFFFF',
    fontColor: '000000',
    buttonColor: '4997E0',
    buttonFontColor: 'FFFFFF',
    buttonHoverColor: 'FFFFFF',
    buttonHoverFontColor: '000000',
    expirationDate: '',
    runUntilPaused: false,
    impressions: '100',
    conversions: '90',
    revenue: '1000',
    isEnabled: true
  });

  useEffect(() => {
    if (editData) {
      setOfferInputData(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferInputData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate conversion rate
    const conversionRate = OfferInputData.impressions > 0 
      ? (Number(OfferInputData.conversions) / Number(OfferInputData.impressions)) * 100 
      : 0;

    // Create offer object
    const offerData = {
      id: OfferInputData.id.toUpperCase(),
      offerName: OfferInputData.offerName,
      discountCode: OfferInputData.discountCode.toUpperCase(),
      minimumCartValue: Number(OfferInputData.minimumCartValue),
      discountPercentage: Number(OfferInputData.discountPercentage),
      productId: OfferInputData.productId,
      productVariantId: OfferInputData.productVariantId,
      backgroundColor: OfferInputData.backgroundColor,
      fontColor: OfferInputData.fontColor,
      buttonColor: OfferInputData.buttonColor,
      buttonFontColor: OfferInputData.buttonFontColor,
      buttonHoverColor: OfferInputData.buttonHoverColor,
      buttonHoverFontColor: OfferInputData.buttonHoverFontColor,
      expirationDate: OfferInputData.expirationDate,
      runUntilPaused: OfferInputData.runUntilPaused,
      impressions: Number(OfferInputData.impressions),
      conversions: Number(OfferInputData.conversions),
      revenue: Number(OfferInputData.revenue),
      conversionRate: conversionRate,
      isEnabled: OfferInputData.isEnabled
    };

    onSubmit(offerData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="left-form">
        <div className="form-input">
          <label htmlFor="id">Offer ID:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={OfferInputData.id}
            onChange={handleChange}
            placeholder="Enter offer ID"
            disabled={editData}
          />
        </div>

        <div className="form-input">
          <label htmlFor="offerName">Offer Name (Internal Use Only)</label>
          <input
            type="text"
            id="offerName"
            name="offerName"
            value={OfferInputData.offerName}
            onChange={handleChange}
            placeholder="e.g. New Offer"
          />
        </div>

        <div className="form-input">
          <label htmlFor="discountCode">Offer Discount Code (Must Be Unique)</label>
          <input
            type="text"
            id="discountCode"
            name="discountCode"
            value={OfferInputData.discountCode}
            onChange={handleChange}
            required
            placeholder="e.g. OFFER2020"
          />
        </div>

        <div className="form-input">
          <label htmlFor="minimumCartValue">Minimum Cart Value (to Trigger Offer)</label>
          <input
            type="number"
            id="minimumCartValue"
            name="minimumCartValue"
            value={OfferInputData.minimumCartValue}
            onChange={handleChange}
            placeholder="$"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-input">
          <label htmlFor="discountPercentage">Set Offer Discount</label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={OfferInputData.discountPercentage}
            onChange={handleChange}
            placeholder="%"
            min="0"
            max="100"
          />
        </div>

        <div className="form-input">
          <label htmlFor="productId">Choose Your Offer Product</label>
          <select
            id="productId"
            name="productId"
            value={OfferInputData.productId}
            onChange={handleChange}
          >
            <option value="">Select a product</option>
            {/* Add your product options here */}
          </select>
        </div>

        <div className="form-input">
          <label htmlFor="productVariantId">Choose Your Offer Product Variant</label>
          <select
            id="productVariantId"
            name="productVariantId"
            value={OfferInputData.productVariantId}
            onChange={handleChange}
          >
            <option value="">Select a variant</option>
            {/* Add your variant options here */}
          </select>
        </div>

        {/* Color Inputs */}
        {['backgroundColor', 'fontColor', 'buttonColor', 'buttonFontColor', 'buttonHoverColor', 'buttonHoverFontColor'].map((field) => (
          <div className="form-input" key={field}>
            <label htmlFor={field}>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</label>
            <input
              type="text"
              id={field}
              name={field}
              value={OfferInputData[field]}
              onChange={handleChange}
              placeholder="FFFFFF"
              pattern="^[0-9A-Fa-f]{6}$"
              style={{
                backgroundColor: OfferInputData[field]?.length === 6 ? `#${OfferInputData[field]}` : '#FFFFFF',
                color: OfferInputData[field]?.length === 6 ? '#000000' : 'inherit'
              }}
            />
          </div>
        ))}

        <div className="form-input">
          <label htmlFor="expirationDate">Choose Expiration Date</label>
          <input
            type="date"
            id="expirationDate"
            name="expirationDate"
            value={OfferInputData.expirationDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-input checkbox-group">
          <label htmlFor="runUntilPaused">
            <input
              type="checkbox"
              id="runUntilPaused"
              name="runUntilPaused"
              checked={OfferInputData.runUntilPaused}
              onChange={handleChange}
            />
            Run Until Paused
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Back
          </button>
          <button type="submit" className="submit-button">
            {editData ? 'Update' : 'Create Offer'}
          </button>
        </div>
      </div>

      {/* Offer Preview Section */}
      <div className="right-form">
        <div className="offer-preview">
          <h3>Offer Preview</h3>
          <div className="offer-card">
            <img src="product-image.jpg" alt="Product Image" className="product-image" />
            <div className="offer-details">
              <h4>{OfferInputData.offerName}</h4>
              <p className="discount">{OfferInputData.discountPercentage}% Discount</p>
              <p className="pricing">
                <span className="original-price">${OfferInputData.minimumCartValue}</span>
                <span className="discounted-price">${(OfferInputData.minimumCartValue - (OfferInputData.minimumCartValue * OfferInputData.discountPercentage / 100)).toFixed(2)}</span>
              </p>
            </div>
            <button className="add-button" style={{ backgroundColor: `#${OfferInputData.buttonColor}`, color: `#${OfferInputData.buttonFontColor}` }}>Add it now!</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddorEditOffer;
