import './CommitView.css';
import loadHighlight from '../helpers/loaders/loadHighlight';

const MOCK_PATCH = '';
const CommitView = (props, state)=>
  <pre className='CommitView l-margin-t2 l-padding-h4' innerHTML={state.patch}></pre>;

CommitView.state = {
  onInit: (props, state, {highlightPatch})=>{
    if(window.hljs) return highlightPatch();

    // Don't block initial rendering
    window.requestAnimationFrame(()=>{
      loadHighlight().then(highlightPatch);
    });

    // 1) Wait for highlightjs (abort after 5 second of trying)
    // 2) set innerHTML
    return {patch:''}
  },
  highlightPatch: (props, state, {loadEvents})=>({
    patch: hljs.highlight('diff', MOCK_PATCH).value
  })
};

export default CommitView;
