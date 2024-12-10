import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import FormControl from '../components/FormControl';
import AddorEditOffer from './AddOrEditOffer';
import Loader from '../components/Loader';
import TableComponent from '../components/TableComponent';
import { ApiOffer } from '../API/ApiOffer';
import '../App.css';

const Offers = () => {
  const [OfferData, setOfferData] = useState([]);
  const [searchText, setsearchText] = useState('');
  const [FilterStatus, setFilterStatus] = useState('all');
  const [Loading, setLoading] = useState(true);
  const [errorMessage, seterrorMessage] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [total, settotal] = useState({
    impressions: 0,
    conversions: 0,
    revenue: 0,
    conversionRate: '0.00',
  });
  const [previewOffer, setPreviewOffer] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isCreatingOffer = location.pathname.includes('/offers/create');
  const editingOfferId = location.pathname.includes('/offers/edit/')
    ? location.pathname.split('/offers/edit/')[1]
    : null;

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    const filtered = OfferData.filter((item) => {
      const matchesStatus =
        FilterStatus === 'all'
          ? true
          : FilterStatus === 'enabled'
          ? item.isEnabled
          : !item.isEnabled;

      return matchesStatus;
    });

    setFilteredData(filtered);
  }, [OfferData, FilterStatus]);

  useEffect(() => {
    const calculatedtotal = filteredData.reduce(
      (acc, item) => ({
        impressions: acc.impressions + (item.impressions || 0),
        conversions: acc.conversions + (item.conversions || 0),
        revenue: acc.revenue + (item.revenue || 0),
      }),
      { impressions: 0, conversions: 0, revenue: 0 }
    );

    const totalConversionRate =
      calculatedtotal.impressions > 0
        ? ((calculatedtotal.conversions / calculatedtotal.impressions) * 100).toFixed(2)
        : '0.00';

    settotal({
      ...calculatedtotal,
      conversionRate: totalConversionRate,
    });
  }, [filteredData]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await ApiOffer.getAllOffers();
      setOfferData(data);
      seterrorMessage(null);
    } catch (err) {
      seterrorMessage(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(async (searchValue) => {
      try {
        setLoading(true);
        const searchResults = !searchValue
          ? await ApiOffer.getAllOffers()
          : await ApiOffer.searchOffers(searchValue);
        setOfferData(searchResults);
        seterrorMessage(null);
      } catch (err) {
        console.error(err);
        seterrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = (value) => {
    const trimmedValue = value?.trim() || '';
    setsearchText(trimmedValue.toLowerCase());
    debouncedSearch(trimmedValue.toLowerCase());
  };

  const handleToggle = async (id) => {
    try {
      setLoading(true);
      const offer = OfferData.find((item) => item.id === id);
      const updatedOffer = await ApiOffer.updateOffer(id, { ...offer, isEnabled: !offer.isEnabled });
      setOfferData((prevData) =>
        prevData.map((item) => (item.id === id ? updatedOffer : item))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilterStatus(value);
  };

  const handleAddOffer = async (offerData) => {
    try {
      setLoading(true);
      if (editingOfferId) {
        const updatedOffer = await ApiOffer.updateOffer(editingOfferId, offerData);
        setOfferData((prevData) =>
          prevData.map((item) => (item.id === editingOfferId ? updatedOffer : item))
        );
      } else {
        const createdOffer = await ApiOffer.createOffer(offerData);
        setOfferData((prevData) => [...prevData, createdOffer]); // Append the new offer directly
      }
      navigate('/offers');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer) => {
    navigate(`/offers/edit/${offer.id}`);
  };

  const handleCreate = () => {
    navigate('/offers/create');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        setLoading(true);
        await ApiOffer.deleteOffer(id);
        setOfferData((prevData) => prevData.filter((item) => item.id !== id));
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/offers');
  };

  const handlePreview = (offer) => {
    setPreviewOffer(offer);
  };

  return (
    <div className="main-container">
      {!editingOfferId && !isCreatingOffer && (
        <div className="form-controls">
          <div className="form-controls-left">
            <FormControl
              onSearchChange={handleSearch}
              value={searchText}
              onFilterChange={handleFilterChange}
              currentFilter={FilterStatus}
            />
          </div>
          <button
            className="create-button"
            onClick={handleCreate}
          >
            Create New Offer
          </button>
        </div>
      )}

      <Loader Loading={Loading}>
        {errorMessage ? (
          <div className="error-msg">{errorMessage}</div>
        ) : (
          <>
            {(editingOfferId || isCreatingOffer) ? (
              <AddorEditOffer
                onSubmit={handleAddOffer}
                onCancel={handleCancel}
                editData={OfferData.find((offer) => offer.id === editingOfferId)}
              />
            ) : (
              <>
                <TableComponent
                  data={filteredData}
                  total={total}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
                {previewOffer && (
                  <div className="offer-preview">
                    <h3>Offer Preview</h3>
                    <p><strong>ID:</strong> {previewOffer.id}</p>
                    <p><strong>Name:</strong> {previewOffer.name}</p>
                    <p><strong>Status:</strong> {previewOffer.isEnabled ? 'Enabled' : 'Disabled'}</p>
                    <p><strong>Impressions:</strong> {previewOffer.impressions}</p>
                    <p><strong>Conversions:</strong> {previewOffer.conversions}</p>
                    <p><strong>Revenue:</strong> ${previewOffer.revenue.toFixed(2)}</p>
                    <p><strong>Conversion Rate:</strong> {previewOffer.conversionRate}%</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Loader>
    </div>
  );
};


export default Offers;
