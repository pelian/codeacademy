import React from 'react';
import ReactDOM from 'react-dom';
import Jammming from './components/App/Jammming';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Jammming />, document.getElementById('root'));
registerServiceWorker();
