(()=>{

const displayNameForRelease = release => release.name || release.tag_name;
const branchFromRef         = ref     => ref.replace(/.*\//, '');
const iconForIssue          = event   => `github:issue-${event.payload.action}`;

const iconForIssueOrPR = event=>
  `github:${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;

const titleForIssueOrPR = ({payload})=>
  payload.pull_request ? payload.pull_request.title : payload.issue.title;

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
      let proto = tmpl.ctor.prototype;
      proto.iconForIssueOrPR      = iconForIssueOrPR;
      proto.titleForIssueOrPR     = titleForIssueOrPR;
      proto.iconForIssue          = iconForIssue;
      proto.branchFromRef         = branchFromRef;
      proto.displayNameForRelease = displayNameForRelease;

      _tmplCache[tmpl.id] = tmpl;
      tmpl = tmpl.nextElementSibling;
    }
    _tmplCache.isReady = true;
  }
});

})();
