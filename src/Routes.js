import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import AppDemo from './pages/AppDemo';
import Offers from './pages/Offers';
import AddOrEditComponent from './pages/AddOrEditOffer';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/demo" element={<AppDemo />} />
            <Route path="/offers/create" element={<AddOrEditComponent mode="add" />} />
            <Route path="/offers/edit/:id" element={<AddOrEditComponent mode="edit" />} />
        </Routes>
    );
};

export default AppRoutes;
