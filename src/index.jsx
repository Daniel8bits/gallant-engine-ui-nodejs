import React from 'react';
import ReactDOM from 'react-dom/client';

import GallantEngineInterface from './GallantEngineInterface';

import 'simplebar-react/dist/simplebar.min.css';
import '@style/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GallantEngineInterface />
  </React.StrictMode>
);
