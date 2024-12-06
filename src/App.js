import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import NavigationBar from './components/NavigationBar';
import AppRoutes from './Routes';

const App = () => {
    return (
        <BrowserRouter>
            <div>
                <NavigationBar />
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
};

export default App;
