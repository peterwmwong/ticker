export var IdentityAttr = {
  coerce:    v=>v,
  serialize: v=>v
};

export var StringAttr = {
  coerce: v=>v ? ''+v : v,
  serialize: s=>s
};

export var NumberAttr = {
  coerce: v=>
    (typeof v === 'string') ? parseFloat(v, 10)
      : (typeof v === 'number') ? v
        : null,
  serialize: v=>v
};

export var BooleanAttr = {
  coerce: v=>!!v,
  serialize: v=>v
};

export var DateAttr = {
  coerce(v){
    if(!v || v instanceof Date) return v;
    if(typeof v === 'number') return new Date(v);
    if(typeof v != 'string')
      throw `DateAttr#coerce: don't know how to convert '${v}' to a Date`
    var parts = v.match(/^(\d\d\d\d)-(\d\d)-(\d\d)$/);
    if(!parts)
      throw `DateAttr#coerce: don't know how to parse '${v}' to a Date`;
    return new Date(parseInt(parts[1], 10), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10));
  },
  serialize(date){
    if(!date) return null;
    var y =  date.getFullYear().toString();
    var m = (date.getMonth() + 1).toString();
    var d =  date.getDate().toString();
    m = (m.length === 1) ? '0'+m : m;
    d = (d.length === 1) ? '0'+d : d;
    return `${y}-${m}-${d}`;
  }
};

var noTZRe = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?$/;

export var DateTimeAttr = {
  coerce(v){
    if(!v || v instanceof Date) return v;
    if(typeof v === 'number') return new Date(v);
    if(typeof v !== 'string')
      throw `DateTimeAttr#coerce: don't know how to convert '${v}' to a Date`;
    // ensure that the string gets parsed as a UTC time and not a local time
    if(v.match(noTZRe)) v += 'Z';
    var t = Date.parse(v);
    if(!t)
      throw `DateTimeAttr#coerce: don't know how to parse '${v}' to a Date`;
    return new Date(t);
  },
  serialize: v=>v && v.toJSON()
};
