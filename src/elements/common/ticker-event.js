Polymer({
  is: 'ticker-event',
  // behaviors: [
  //   Polymer.Templatizer
  // ],
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
      let stamped = tmpl.stamp();
      stamped.event = event;
      this.appendChild(stamped.root);
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
      _tmplCache[tmpl.id] = tmpl;
      tmpl = tmpl.nextElementSibling;
    }
    _tmplCache.isReady = true;
  }
});
