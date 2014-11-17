import StatefulPolymer from '../helpers/StatefulPolymer';
import appState from '../states/appState';

StatefulPolymer('ticker-source-github-user', {
  state:appState,
  onHeaderTransform(e){
    var d = e.detail;
    var m = d.height - d.condensedHeight;
    var scale = Math.max(0.75, (m - d.y) / (m / 0.25)  + 0.75);
    this.$.titleText.style.transform = this.$.titleText.style.webkitTransform =
        'scale(' + scale + ') translateZ(0)';
  }
})
