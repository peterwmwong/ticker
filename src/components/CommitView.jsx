import './CommitView.css';
import loadHighlight from '../helpers/loaders/loadHighlight';

const MOCK_PATCH =
`:100644 100644 63183d5... 0000000... M	src/components/App.jsx
:100644 100644 77090fa... 0000000... M	src/helpers/loaders/loadFirebase.js

diff --git a/src/components/App.jsx b/src/components/App.jsx
index 63183d5..2875fc4 100644
--- a/src/components/App.jsx
+++ b/src/components/App.jsx
@@ -3,14 +3,16 @@ import AppDrawer      from './AppDrawer.jsx';
 import Toolbar        from './Toolbar.jsx';
 import UserView       from './UserView.jsx';
 import RepoView       from './RepoView.jsx';
+import CommitView     from './CommitView.jsx';
 import getCurrentUser from '../helpers/getCurrentUser';

 const App = (props, state, actions)=>
   <body className='App fit fullbleed'>
     <Toolbar title={state.data} onRequestDrawer={actions.enableDrawer} />
-    {   state.view === 'user'  ? <UserView user={state.data} />
+    {/*   state.view === 'user'  ? <UserView user={state.data} />
       : state.view === 'repo'  ? <RepoView repo={state.data} />
-      : null }
+      : null */}
+    <CommitView user={state.data} />
     <AppDrawer
       user={state.currentUser}
       enabled={state.drawerEnabled}
@@ -32,7 +34,7 @@ App.state = {
       if(repo)       return viewRepo(\`\${owner}/\${repo}\`);
       else if(owner) return viewUser(owner);
     }
-    return {...state, view: 'waiting'};
+    return {...state, view: 'waiting', overlayView: 'commit'};
   },
   viewUser:  (props, state, actions, user)=>({...state, view: 'user', data: user}),
   viewRepo:  (props, state, actions, repo)=>({...state, view: 'repo', data: repo}),
diff --git a/src/helpers/loaders/loadFirebase.js b/src/helpers/loaders/loadFirebase.js
index 77090fa..bb1473e 100644
--- a/src/helpers/loaders/loadFirebase.js
+++ b/src/helpers/loaders/loadFirebase.js
@@ -33,7 +33,7 @@ export default ()=>{
   }
   else{
     window.requestAnimationFrame(()=>{
-      let s = document.createElement('script');
+      const s = document.createElement('script');
       s.src = \`http://\${(location.host || 'localhost')}/components/firebase/firebase.js\`;
       document.body.appendChild(s);
     });`;


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
