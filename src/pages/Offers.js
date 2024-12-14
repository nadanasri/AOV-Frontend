import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import FormControl from '../components/FormControl';
import Loader from '../components/Loader';
import TableComponent from '../components/TableComponent';
import { ApiOffer } from '../API/ApiOffer';

const Offers = () => {
  const navigate = useNavigate();
  
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
    conversionRate: '0.00'
  });

  useEffect(() => {
    retrieveOffers();
  }, []);

  useEffect(() => {
    const filtered = OfferData.filter(item => {
      const matchesStatus = 
        FilterStatus === 'all' ? true :
        FilterStatus === 'enabled' ? item.isEnabled :
        !item.isEnabled;

      return matchesStatus;
    });

    setFilteredData(filtered);
  }, [OfferData, FilterStatus]);

  useEffect(() => {
    const calculatedtotal = filteredData.reduce((acc, item) => ({
      impressions: acc.impressions + (item.impressions || 0),
      conversions: acc.conversions + (item.conversions || 0),
      revenue: acc.revenue + (item.revenue || 0)
    }), { impressions: 0, conversions: 0, revenue: 0 });

    const totalConversionRate = calculatedtotal.impressions > 0 
      ? ((calculatedtotal.conversions / calculatedtotal.impressions) * 100).toFixed(2)
      : '0.00';

    settotal({
      ...calculatedtotal,
      conversionRate: totalConversionRate
    });
  }, [filteredData]);

  const retrieveOffers = async () => {
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

  const debouncedOfferSearch = debounce(async (searchValue) => {
    try {
      setLoading(true);
      const trimmedSearch = searchValue.toLowerCase();
      
      // If search is empty, just get all offers
      if (!trimmedSearch) {
        const allOffers = await ApiOffer.getAllOffers();
        setOfferData(allOffers);
        return;
      }
  
      // Get all offers and filter them properly
      const allOffers = await ApiOffer.getAllOffers();
      const searchResults = allOffers.filter(offer => {
        const offerName = (offer.offerName || '').toLowerCase();
        const discountCode = (offer.discountCode || '').toLowerCase();
        const id = (offer.id || '').toLowerCase();
        
        // Check if any field contains the search value
        return offerName.includes(trimmedSearch) ||
               discountCode.includes(trimmedSearch) ||
               id.includes(trimmedSearch);
      });
      
      setOfferData(searchResults);
      seterrorMessage(null);
    } catch (err) {
      console.error(err);
      seterrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, 500);
 
  const searchOffers = (value) => {
    const trimmedValue = (value || '').trim();
    setsearchText(trimmedValue);
    debouncedOfferSearch(trimmedValue);
  };
  const toggleOfferStatus = async (id) => {
    try {
      setLoading(true);
      const offer = OfferData.find(item => item.id === id);
      const updatedOffer = await ApiOffer.updateOffer(id, { ...offer, isEnabled: !offer.isEnabled });
      setOfferData(prevData =>
        prevData.map(item =>
          item.id === id ? updatedOffer : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterByStatus = (value) => {
    setFilterStatus(value);
  };

  const routeToEditOffer = (offer) => {
    navigate(`/offers/edit/${offer.id}`);
  };

  const deleteOffer = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        setLoading(true);
        await ApiOffer.deleteOffer(id);
        setOfferData(prevData => prevData.filter(item => item.id !== id));
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="main-container">
      <div className='form-controls'>
        <div className="form-controls-left">
          <FormControl 
            onSearchChange={searchOffers} 
            value={searchText}
            onFilterChange={filterByStatus}
            currentFilter={FilterStatus}
          />
        </div>
        <button 
          className="create-button"
          onClick={() => navigate('/offers/add')}
        >
          Create New Offer
        </button>
      </div>

      <Loader Loading={Loading}>
        {errorMessage ? (
          <div className="error-msg">{errorMessage}</div>
        ) : (
          <TableComponent 
            data={filteredData}
            total={total}
            onToggle={toggleOfferStatus}
            onEdit={routeToEditOffer}
            onDelete={deleteOffer}
          />
        )}
      </Loader>
    </div>
  );
};

export default Offers;
