import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	// <React.StrictMode>
	<BrowserRouter basename={'noname_digital_crm_test/'}>
		<App />
	</BrowserRouter>
	// </React.StrictMode>
);
