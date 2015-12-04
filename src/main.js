import * as xvdom from 'xvdom/src/index.js';
import App from './components/App.jsx';
window.xvdom = xvdom;
document.body = xvdom.renderInstance(<App />);
