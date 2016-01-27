import xvdom from 'xvdom';
import App   from './components/App.jsx';
window.xvdom = xvdom;
document.body = xvdom.render(<App />);
