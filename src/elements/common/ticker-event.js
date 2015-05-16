(()=>{

const createDeleteAction  = event=> `${event.type === 'CreateEvent' ? 'created' : 'deleted'} a ${event.payload.ref_type}`;
const createDeleteIcon    = event=> `github:git-branch`;
const createDeleteSubject = ({payload:{ref, ref_type}, repo}) => ref_type === 'branch' ? ref : repo.name;

const pushAction          = event=> `pushed ${event.payload.commits.length} commits to`;
const pushSubject         = event=> event.payload.ref.replace(/.*\//, '');

const releaseSubject      = ({payload:{release}})=> release.name || release.tag_name;

const issuePRIcon         = event=> `github:${event.payload.pull_request ? 'git-pull-request' : 'issue-opened'}`;
const issuePRSubject      = ({payload})=> payload.pull_request ? payload.pull_request.title : payload.issue.title;

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

      proto.createDeleteAction  = createDeleteAction;
      proto.createDeleteIcon    = createDeleteIcon;
      proto.createDeleteSubject = createDeleteSubject;

      proto.pushAction          = pushAction;
      proto.pushSubject         = pushSubject;

      proto.releaseSubject      = releaseSubject;

      proto.issuePRIcon         = issuePRIcon;
      proto.issuePRSubject      = issuePRSubject;

      tmpl.id.split(',').forEach(id=>_tmplCache[id] = tmpl);
      tmpl = tmpl.nextElementSibling;
    }
    _tmplCache.isReady = true;
  }
});

})();
