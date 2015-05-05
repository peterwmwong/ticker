(()=>{

const createDeleteSubject = ({payload:{ref, ref_type}, repo})=>
  ref_type === 'branch' ? ref : repo.name;

const displayNameForRelease = release => release.name || release.tag_name;
const branchFromRef         = ref     => ref.replace(/.*\//, '');
const iconForIssue          = event   => `github:issue-${event.payload.action}`;

const iconForBranchOrRepo = event=>`github:git-branch`;

const iconForIssueOrPR = event=>
  `github:${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;

const titleForIssueOrPR = ({payload})=>
  payload.pull_request ? payload.pull_request.title : payload.issue.title;

Polymer({
  is: 'ticker-event',
  properties:{
    event:{
      type:Object,
      observer:'_eventChanged'
    }
  },
  _stamped:false,
  _tmplCache:{},

  created(){
    this.className = 'Card relative block';
  },

  _emptyContent(){
    // Skip over .Card-title
    let child = this.firstElementChild.nextSibling;
    let nextChild;
    while(child){
      nextChild = child.nextSibling;
      child.parentNode.removeChild(child);
      child = nextChild;
    }
  },

  _eventChanged(event){
    this.className = 'Card relative block Card--yolo--' + this.event.type;
    if(!event){ return; }
    this._ensureTemplateCache();

    if(this._stamped){
      this._emptyContent();
    }

    const tmpl = this._tmplCache[event.type];
    if(tmpl){
      this.appendChild(tmpl.stamp({event}).root);
      this._stamped = true;
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
      proto.createDeleteSubject   = createDeleteSubject;
      proto.iconForBranchOrRepo   = iconForBranchOrRepo;
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
