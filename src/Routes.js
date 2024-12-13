import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import AppDemo from './pages/AppDemo';
import Offers from './pages/Offers';
import AddorEditOffer from './pages/AddOrEditOffer';


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/" element={<Dashboard />} />  
            <Route path="/demo" element={<AppDemo />} />
            <Route path="/offers/add" element={<AddorEditOffer />} />
            <Route path="/offers/edit/:id" element={<AddorEditOffer />} />
            <Route path="/offers" element={<Offers />} />
   
        </Routes>
    );
};
export default AppRoutes;