import './boot';
import 'xvdom';
import App from './components/App.jsx';

document.body = xvdom.renderInstance(<App />);
