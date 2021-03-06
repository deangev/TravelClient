import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore } from "redux";
import reducer from './redux/reducer';
import { Provider } from 'react-redux';
import 'leaflet/dist/leaflet.css'
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);