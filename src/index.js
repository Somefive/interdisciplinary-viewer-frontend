import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios'
// axios.defaults.baseURL = 'http://interdisciplinary.somefive.com/api';
axios.defaults.baseURL = 'http://58.87.102.145:5000/';
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
