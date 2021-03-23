import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
//import reducers from './components/GraphicalView/reducers';
import reducers from './reducers';

async function init() {
  const store = createStore(reducers);

  ReactDOM.render(
    
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

init();

serviceWorker.unregister();
