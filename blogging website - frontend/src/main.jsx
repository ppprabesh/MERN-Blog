import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from "axios";
//axios is used to connect backend with frontend. 
axios.defaults.baseURL = import.meta.env.VITE_SERVER_DOMAIN;
axios.defaults.withCredentials= true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)