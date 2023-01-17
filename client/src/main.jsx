import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit'

import themeReducer from "./reducers/themeSlice"

import App from './App'
import './index.css'
import './colors.css'

const store = configureStore({ 
  reducer: {
    theme: themeReducer,
  } 
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ReduxProvider store={store}>
        <App /> 
      </ReduxProvider>
    </Router>
  </React.StrictMode>,
)
