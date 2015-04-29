(()=>{

function displayNameForRelease(release){
  return `${release.name ? release.name : ' '}${release.tag_name || ''}`;
}

function branchFromRef(ref){
  return ref.replace(/.*\//, '');
}

function iconForIssue(event){
  return `github:issue-${event.payload.action}`;
}

function iconForIssueOrPR(event){
  return `github:${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;
}

function titleForIssueOrPR({payload}){
  return payload.pull_request ? payload.pull_request.title : payload.issue.title;
}

Polymer({
  is: 'ticker-event',
  hostAttributes:{
    class: 'Card relative block'
  },
  properties:{
    event:{
      type:Object,
      observer:'_eventChanged'
    }
  },
  _tmplCache:{},

  _eventChanged(event){
    if(!event){ return; }
    this._ensureTemplateCache();

    const tmpl = this._tmplCache[event.type];
    if(tmpl){
      this.appendChild(tmpl.stamp({event}).root);
    }
  },

  _ensureTemplateCache(){
    if(!this._tmplCache.isReady){
      this._populateTmplCache();
    }
  },

  _populateTmplCache(){
    const _tmplCache = this._tmplCache;
    let tmpl = Polymer.DomModule.import('ticker-event-templates').firstElementChild;
    while(tmpl){
      tmpl.ctor.prototype.iconForIssueOrPR      = iconForIssueOrPR;
      tmpl.ctor.prototype.titleForIssueOrPR     = titleForIssueOrPR;
      tmpl.ctor.prototype.iconForIssue          = iconForIssue;
      tmpl.ctor.prototype.branchFromRef         = branchFromRef;
      tmpl.ctor.prototype.displayNameForRelease = displayNameForRelease;
      _tmplCache[tmpl.id] = tmpl;
      tmpl = tmpl.nextElementSibling;
    }
    _tmplCache.isReady = true;
  }
});

})();
