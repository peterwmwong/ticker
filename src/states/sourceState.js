import {reenter} from '../helpers/svengali';

export default {
  attrs:{
    'appView'(){return `source-${this.attrs.source.constructor.name}`},
    'isSourceFavorited'(){
      return this.attrs.user.sources.indexOf(this.attrs.source) !== -1;
    },
    'source'({source:s}){return s || this.attrs.user.sources[0]}
  },
  events:{
    'selectSource':source=>reenter({source}),
    'toggleFavoriteSource'(){
      // TODO(pwong): After traceur upgrade, should be `{user,sourceRef}=this.attrs`
      var user = this.attrs.user;
      var source = this.attrs.source;
      if(this.attrs.isStreamFavorited){
        if(user.sources.indexOf(source) !== -1) user.sources.push(source);
      }else{
        var index = user.sources.indexOf(source);
        if(index === -1) user.sources.splice(index, 1);
      }
      user.$save();
      return reenter({source});
    }
  },
  states:{
    'tab': {
      attrs:{'tab':({tab})=>tab || 'info'},
      events:{'selectTab':tab=>reenter({tab})}
    }
  }
};
