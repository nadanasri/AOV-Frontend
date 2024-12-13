import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiOffer } from '../API/ApiOffer';
import Loader from '../components/Loader';

const AddorEditOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [Loading, setLoading] = useState(false);
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
    impressions: '',
    conversions: '',
    revenue: '',
    isEnabled: true
  });

  useEffect(() => {
    if (id) {
      getOfferDetails();
    }
  }, [id]);

  const getOfferDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiOffer.getAllOffers();
      const offerData = response.find(offer => offer.id === id);
      
      if (offerData) {
        setOfferInputData(prevData => ({
          ...prevData,
          ...offerData,
          minimumCartValue: offerData.minimumCartValue?.toString() || '',
          discountPercentage: offerData.discountPercentage?.toString() || '',
          impressions: offerData.impressions?.toString() || '',
          conversions: offerData.conversions?.toString() || '',
          revenue: offerData.revenue?.toString() || '',
          runUntilPaused: Boolean(offerData.runUntilPaused),
          isEnabled: Boolean(offerData.isEnabled)
        }));
      }
    } catch (err) {
      console.error('Error fetching offer:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOfferField = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferInputData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveOfferData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const conversionRate = OfferInputData.impressions > 0 
        ? (Number(OfferInputData.conversions) / Number(OfferInputData.impressions)) * 100 
        : 0;

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

      if (id) {
        await ApiOffer.updateOffer(id, offerData);
      } else {
        await ApiOffer.createOffer(offerData);
      }
      navigate('/offers');
    } catch (err) {
      console.error('Error submitting offer:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOfferEdit = () => {
    navigate('/offers');
  };

  return (
    <Loader Loading={Loading}>
      <form onSubmit={saveOfferData} className="form-container">
        <div className='left-form'>
          <div className="form-input">
            <label htmlFor="id">Offer ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={OfferInputData.id}
              onChange={updateOfferField}
              placeholder="Enter offer ID"
              disabled={id ? true : false}
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="offerName">Offer Name (Internal Use Only)</label>
            <input
              type="text"
              id="offerName"
              name="offerName"
              value={OfferInputData.offerName}
              onChange={updateOfferField}
              placeholder="e.g. New Offer"
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="discountCode">Offer Discount Code (Must Be Unique)</label>
            <input
              type="text"
              id="discountCode"
              name="discountCode"
              value={OfferInputData.discountCode}
              onChange={updateOfferField}
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
              onChange={updateOfferField}
              placeholder="$"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="discountPercentage">Set Offer Discount</label>
            <input
              type="number"
              id="discountPercentage"
              name="discountPercentage"
              value={OfferInputData.discountPercentage}
              onChange={updateOfferField}
              placeholder="%"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-input">
            <label htmlFor="productId">Choose Your Offer Product</label>
            <select
              id="productId"
              name="productId"
              value={OfferInputData.productId}
              onChange={updateOfferField}
              required
            >
              <option value="">Select a product</option>
              <option value="product1">Product 1</option>
              <option value="product2">Product 2</option>
            </select>
          </div>

          <div className="form-input">
            <label htmlFor="productVariantId">Choose Your Offer Product Variant</label>
            <select
              id="productVariantId"
              name="productVariantId"
              value={OfferInputData.productVariantId}
              onChange={updateOfferField}
              required
            >
              <option value="">Select a variant</option>
              <option value="variant1">Variant 1</option>
              <option value="variant2">Variant 2</option>
            </select>
          </div>

          <div className="form-input">
            <label htmlFor="backgroundColor">Background Color</label>
            <input
              type="text"
              id="backgroundColor"
              name="backgroundColor"
              value={OfferInputData.backgroundColor}
              onChange={updateOfferField}
              placeholder="FFFFFF"
              pattern="^[0-9A-Fa-f]{6}$"
              required
              style={{
                backgroundColor: OfferInputData.backgroundColor?.length === 6 ? `#${OfferInputData.backgroundColor}` : '#FFFFFF',
                color: OfferInputData.backgroundColor?.length === 6 ? '#000000' : 'inherit'
              }}
            />
          </div>

          <div className="form-input">
            <label htmlFor="fontColor">Font Color</label>
            <input
              type="text"
              id="fontColor"
              name="fontColor"
              value={OfferInputData.fontColor}
              onChange={updateOfferField}
              placeholder="000000"
              pattern="^[0-9A-Fa-f]{6}$"
              required
              style={{
                backgroundColor: OfferInputData.fontColor?.length === 6 ? `#${OfferInputData.fontColor}` : '#FFFFFF',
                color: OfferInputData.fontColor?.length === 6 ? '#FFFFFF' : 'inherit'
              }}
            />
          </div>

          <div className="form-input">
            <label htmlFor="buttonColor">Button Color</label>
            <input
              type="text"
              id="buttonColor"
              name="buttonColor"
              value={OfferInputData.buttonColor}
              onChange={updateOfferField}
              placeholder="4997E0"
              pattern="^[0-9A-Fa-f]{6}$"
              required
              style={{
                backgroundColor: OfferInputData.buttonColor?.length === 6 ? `#${OfferInputData.buttonColor}` : '#FFFFFF',
                color: OfferInputData.buttonColor?.length === 6 ? '#FFFFFF' : 'inherit'
              }}
            />
          </div>

          <div className="form-input">
            <label htmlFor="buttonFontColor">Button Font Color</label>
            <input
              type="text"
              id="buttonFontColor"
              name="buttonFontColor"
              value={OfferInputData.buttonFontColor}
              onChange={updateOfferField}
              placeholder="FFFFFF"
              pattern="^[0-9A-Fa-f]{6}$"
              required
              style={{
                backgroundColor: OfferInputData.buttonFontColor?.length === 6 ? `#${OfferInputData.buttonFontColor}` : '#FFFFFF',
                color: OfferInputData.buttonFontColor?.length === 6 ? '#000000' : 'inherit'
              }}
            />
          </div>
          <div className="form-input">
          <label htmlFor="buttonHoverColor">Button Hover Color</label>
          <input
            type="text"
            id="buttonHoverColor"
            name="buttonHoverColor"
            value={OfferInputData.buttonHoverColor}
            onChange={updateOfferField}
            placeholder="FFFFFF"
            pattern="^[0-9A-Fa-f]{6}$"
            style={{
              backgroundColor: OfferInputData.buttonHoverColor?.length === 6 ? `#${OfferInputData.buttonHoverColor}` : '#FFFFFF',
              color: OfferInputData.buttonHoverColor?.length === 6 ? '#000000' : 'inherit'
            }}
          />
        </div>

        <div className="form-input">
          <label htmlFor="buttonHoverFontColor">Button Hover Font Color</label>
          <input
            type="text"
            id="buttonHoverFontColor"
            name="buttonHoverFontColor"
            value={OfferInputData.buttonHoverFontColor}
            onChange={updateOfferField}
            placeholder="000000"
            pattern="^[0-9A-Fa-f]{6}$"
            style={{
              backgroundColor: OfferInputData.buttonHoverFontColor?.length === 6 ? `#${OfferInputData.buttonHoverFontColor}` : '#FFFFFF',
              color: OfferInputData.buttonHoverFontColor?.length === 6 ? '#FFFFFF' : 'inherit'
            }}
          />
        </div>

        <div className="form-input">
          <label htmlFor="impressions">Impressions:</label>
          <input
            type="number"
            id="impressions"
            name="impressions"
            value={OfferInputData.impressions}
            onChange={updateOfferField}
            disabled
            min="0"
            placeholder="Enter impressions"
          />
        </div>

        <div className="form-input">
          <label htmlFor="conversions">Conversions:</label>
          <input
            type="number"
            id="conversions"
            name="conversions"
            value={OfferInputData.conversions}
            onChange={updateOfferField}
            disabled
            min="0"
            placeholder="Enter conversions"
          />
        </div>

        <div className="form-input">
          <label htmlFor="revenue">Revenue:</label>
          <input
            type="number"
            id="revenue"
            name="revenue"
            value={OfferInputData.revenue}
            onChange={updateOfferField}
            disabled
            min="0"
            placeholder="Enter revenue"
          />
        </div>
          <div className="form-input">
            <label htmlFor="expirationDate">Expiration Date:</label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={OfferInputData.expirationDate}
              onChange={updateOfferField}
              min={new Date().toISOString().split('T')[0]}
              required={!OfferInputData.runUntilPaused}
            />
          </div>

          <div className="form-input checkbox-group">
            <label htmlFor="runUntilPaused">
              <input
                type="checkbox"
                id="runUntilPaused"
                name="runUntilPaused"
                checked={OfferInputData.runUntilPaused}
                onChange={updateOfferField}
              />
              Run Until Paused
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={cancelOfferEdit}>
              Back
            </button>
            <button type="submit" className="submit-button">
              {id ? 'Update Offer' : 'Create Offer'}
            </button>
          </div>
        </div>

        <div className='right-form'>
          <div className="offer-preview">
            <h3>Offer Preview</h3>
            <div 
              className="offer-card"
              style={{
                backgroundColor: `#${OfferInputData.backgroundColor}`,
                color: `#${OfferInputData.fontColor}`
              }}
            >
              <img src="product-image.jpg" alt="Product" className="product-image"/>
              <div className="offer-details">
                <h4>{OfferInputData.offerName || 'Offer Name'}</h4>
                <p className="discount">{OfferInputData.discountPercentage}% Discount</p>
                <p className="pricing">
                  <span className="original-price">$19.95</span>
                  <span className="discounted-price">
                    ${(19.95 * (1 - Number(OfferInputData.discountPercentage) / 100)).toFixed(2)}
                  </span>
                </p>
              </div>
              <button 
                className="add-button"
                style={{
                  backgroundColor: `#${OfferInputData.buttonColor}`,
                  color: `#${OfferInputData.buttonFontColor}`
                }}
              >
                Add it now!
              </button>
            </div>
          </div>
        </div>
      </form>
    </Loader>
  );
};

export default AddorEditOffer;
