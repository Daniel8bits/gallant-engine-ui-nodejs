import React from 'react';
import ReactDOM from 'react-dom/client';

import {Provider} from 'react-redux'
import RootStore from '@store/Root.store'

import RazorEngineInterface from './RazorEngineInterface';

import 'simplebar-react/dist/simplebar.min.css';
import '@style/main.scss'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={RootStore}>
      <RazorEngineInterface />
    </Provider>
  </React.StrictMode>
);
