import Model from 'helpers/model/Model';

describe('services/model/Model', ()=>{
  var resolve, reject;
  function mapperCallback(){
    return new Promise((resolveFn, rejectFn)=>{
      resolve = resolveFn;
      reject = rejectFn;
    });
  }

  var TestMapper = {
    query:  ()=> Promise.resolve(),
    get:    ()=> Promise.resolve(),
    create: ()=> Promise.resolve(),
    update: ()=> Promise.resolve(),
    delete: ()=> Promise.resolve()
  };

  var BasicModel, Author, Post, Tag;
  beforeEach(()=>{
    BasicModel = class BasicModel extends Model{};
    BasicModel.create($=>{
      $.attr('str', 'string');
      $.attr('num', 'number');
      $.attr('bool', 'boolean');
      $.attr('date', 'date');
      $.mapper = TestMapper;
    });

    Author = class Author extends Model{};
    Author.create($=>{
      $.attr('first', 'string');
      $.attr('last', 'string');
      $.hasMany('posts', 'Post', {inverse:'author'});
      $.mapper = TestMapper;
    });

    Post = class Post extends Model{};
    Post.create($=>{
      $.attr('title', 'string');
      $.attr('body', 'string');
      $.hasOne('author', 'Author', {inverse:'posts', owner:true});
      $.hasMany('tags', 'Tag', {inverse:'posts', owner:true});
      $.mapper = TestMapper;
    });

    Tag = class Tag extends Model{};
    Tag.create($=>{
      $.attr('name', 'string');
      $.hasMany('posts', 'Post', {inverse:'tags'});
      $.mapper = TestMapper;
    });
  });

  afterEach(()=>Model.reset());

  describe('Error handling', ()=>{
    describe('Mapper errors', ()=>{
      function rejectingMapperFun(){return new Promise((_, reject)=>reject())};
      function failAndCall(done){
        return ()=>{
          expect(false).toBe(true);
          done();
        }
      };
      var TestModel;

      beforeEach(()=>{
        TestModel = class TestModel extends Model{}
        TestModel.create($=>{
          $.mapper = {
            get:    rejectingMapperFun,
            create: rejectingMapperFun,
            query:  rejectingMapperFun,
            update: rejectingMapperFun,
            delete: rejectingMapperFun
          }
        });
      });

      it('get errors', (done)=>{
        TestModel.get(1).$promise.then(failAndCall(done), done);
      });

      it('query errors', (done)=>{
        TestModel.query().$promise.then(failAndCall(done), done);
      });

      it('create errors', (done)=>{
        new TestModel().$save().$promise.then(failAndCall(done), done);
      });

      it('delete errors', (done)=>{
        var model = TestModel.load({id:1});
        model.$delete().$promise.then(failAndCall(done), done);
      });
    });
  })

  describe('.className', ()=>{
    it('should return the name of the constructor function', ()=>{
      expect(BasicModel.className()).toBe('BasicModel');
    });
  });
  describe('.registerAttr', ()=>{
    it('should throw an exception when an attribute with the given name already exists', ()=>{
      expect(()=>Model.registerAttr('string', {}))
        .toThrow("Model.registerAttr: an attribute type with the name 'string' has already been defined");
    });
  });
  describe('.empty', ()=>{
    it('should return an instance of the class with $sourceState set to EMPTY and the given id', ()=>{
      var m = BasicModel.empty(127);
      expect(m.id).toBe(127);
      expect(m.$sourceState).toBe(Model.EMPTY);
      expect(m.$isBusy).toBe(false);
    });
  });
  describe('.attr', ()=>{
    var m;
    beforeEach(()=>m = new BasicModel());

    describe('of type "string"', ()=>{
      it('should not transform the string value', ()=>{
        m.str = 'regular string';
        expect(m.str).toBe('regular string');
      });
      it('should allow setting null', ()=>{
        m.str = 'a';
        expect(m.str).toBe('a');
        m.str = null;
        expect(m.str).toBe(null);
      });
      it('should convert non-string, non-null values to a string', ()=>{
        var o = {
          toString:()=>'frobnob'
        };
        m.str = 9;
        expect(m.str).toBe('9');
        m.str = o;
        expect(m.str).toBe('frobnob');
      });
    });

    describe('of type "number"', ()=>{
      it('should not transform number values', ()=>{
        m.num = 9;
        expect(m.num).toBe(9);
        m.num = 9.12;
        expect(m.num).toBe(9.12);
      });
      it('should allow setting null', ()=>{
        m.num = 8;
        expect(m.num).toBe(8);
        m.num = null;
        expect(m.num).toBe(null);
      });
      it('should convert string values using parseFloat', ()=>{
        m.num = '1234';
        expect(m.num).toBe(1234);
        m.num = '88.88';
        expect(m.num).toBe(88.88);
      });
    });
    describe('of type "boolean"', ()=>{
      it('should convert values to booleans', ()=>{
        m.bool = true;
        expect(m.bool).toBe(true);
        m.bool = false;
        expect(m.bool).toBe(false);
        m.bool = 9;
        expect(m.bool).toBe(true);
        m.bool = 0;
        expect(m.bool).toBe(false);
        m.bool = 'true';
        expect(m.bool).toBe(true);
        m.bool = null;
        expect(m.bool).toBe(false);
      });
    });
    describe("of type 'date'", ()=>{
      it('should convert valid ISO 8601 strings to Date objects', ()=>{
        m.date = '2012-10-03';
        expect(m.date).toEqual(new Date(2012, 9, 3));
        m.date = '1998-01-05';
        expect(m.date).toEqual(new Date(1998, 0, 5));
      });
      it('should return the same Date object between multiple getter calls', ()=>{
        m.date = new Date();
        expect(m.date).toBe(m.date);
      });
      it('should throw an exception when given a string that is not ISO 8601 formatted', ()=>{
        expect(()=>m.date = 'Oct 1, 2012').toThrow("DateAttr#coerce: don't know how to parse 'Oct 1, 2012' to a Date");
        expect(()=>m.date = '2012-10-1').toThrow("DateAttr#coerce: don't know how to parse '2012-10-1' to a Date");
        expect(()=>m.date = '2012/10/01').toThrow("DateAttr#coerce: don't know how to parse '2012/10/01' to a Date");
      });
      it('should set the raw attribute to a ISO 8601 string', ()=>{
        m.date = new Date(2012, 4, 18);
        expect(m.$attrs().date).toBe('2012-05-18');
      });
      it('should convert numbers to a Date', ()=>{
        var s = new Date(2012, 6, 4).valueOf();
        m.date = s;
        expect(m.date).toEqual(new Date(2012, 6, 4));
      });
      it('should allow setting null', ()=>{
        expect(()=>m.date = null).not.toThrow();
        expect(m.date).toBeNull();
      });
    });
    describe("of type 'datetime'", ()=>{
      class TimeModel extends Model{}
      TimeModel.create($=>{
        $.attr('time', 'datetime');
      });
      beforeEach(()=>m = new TimeModel());

      it('should convert valid ISO 8601 strings to a Date object in the local timezone', ()=>{
        m.time = "2013-03-29T09:49:30Z";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0)));
        m.time = "2013-03-29T09:49:30";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0)));
        m.time = "2013-03-29T09:49:30.000";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0)));
        m.time = "2013-03-29T09:49:30-05:00";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0) + (5 * 60 * 60 * 1000)));
        m.time = "2013-03-29T09:49:30-06:00";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0) + (6 * 60 * 60 * 1000)));
        m.time = "2013-03-29T09:49:30+02:00";
        expect(m.time).toEqual(new Date(Date.UTC(2013, 2, 29, 9, 49, 30, 0) - (2 * 60 * 60 * 1000)));
      });
      it('should return the same Date object between multiple getter calls', ()=>{
        m.time = new Date();
        expect(m.time).toBe(m.time);
      });
      it('should throw an exception if given a string that can not be parsed by Date.parse', ()=>{
        expect(()=>m.time = 'asdfasdfasdf').toThrow("DateTimeAttr#coerce: don't know how to parse 'asdfasdfasdf' to a Date");
      });
      it('should set the raw attribute to a ISO 8601 string', ()=>{
        var d = new Date(2012, 4, 18, 8, 22, 11);
        m.time = d;
        expect(m.$attrs().time).toBe(d.toJSON());
      });
      it('should convert numbers to a Date', ()=>{
        var d = new Date(2012, 6, 4, 12, 18, 21);
        m.time = d.valueOf();
        expect(m.time).toEqual(d);
      });
      it('should allow setting null', ()=>{
        expect(()=>m.time = null).not.toThrow();
        expect(m.time).toBeNull();
      });
    });
  });
  describe('.prop', ()=>{
    class PropModel extends Model{}
    PropModel.create($=>{
      $.prop('getOnly', ()=>'getOnly return');
      $.prop('getAndSet', {
        get: ()=>"" + this._foobar + " return",
        set: (value)=>{this._foobar = value;}
      });

      $.prop('notEnumerable', {
        enumerable: false,
        get: ()=>'not enumerable return'
      });

      $.prop('configurable', {
        configurable: true,
        get: ()=>'configurable return'
      });
    });
    var m;
    beforeEach(()=>m = new PropModel());

    it('returns a property defined with a function only', ()=>{
      expect(m.getOnly).toBe('getOnly return');
    });
    it('allows get and set to be defined', ()=>{
      m.getAndSet = 'a value';
      expect(m.getAndSet).toBe('a value return');
    });
    describe('defaults', ()=>{
      it('should be enumerable by default', ()=>{
        var enumerableProps = [];
        for(var prop in m)
          enumerableProps.push(prop);

        expect(enumerableProps).toContain('getOnly');
        expect(enumerableProps).toContain('getAndSet');
        expect(enumerableProps).not.toContain('notEnumerable');
      });
      it('should not be configurable by default', ()=>{
        expect(()=>delete m.constructor.prototype.getOnly).toThrow();
        expect(delete m.constructor.prototype.configurable).toBe(true);
      });
    });
  });
  describe('.attrs', ()=>{
    it('should return an object mapping all defined attr names to their type and converter', ()=>{
      var attrs = BasicModel.attrs();
      expect(Object.keys(attrs).sort()).toEqual(['bool', 'date', 'num', 'str']);
      expect(attrs.bool.type).toBe('boolean');
      expect(typeof attrs.bool.converter.coerce).toBe('function');
      expect(typeof attrs.bool.converter.serialize).toBe('function');
      expect(attrs.date.type).toBe('date');
      expect(attrs.num.type).toBe('number');
      expect(attrs.str.type).toBe('string');
    });
  });
  describe('.hasAttr', ()=>{
    it('should return true if the class has a defined attribute with the given name and false otherwise', ()=>{
      expect(BasicModel.hasAttr('str')).toBe(true);
      expect(BasicModel.hasAttr('bool')).toBe(true);
      expect(BasicModel.hasAttr('blah')).toBe(false);
    });
    it('should return true for "id"', ()=>{
      expect(BasicModel.hasAttr('id')).toBe(true);
    });
  });
  describe('.associations', ()=>{
    it('should return an object whose keys are the defined associations', ()=>{
      expect(Object.keys(Author.associations())).toEqual(['posts']);
      expect(Object.keys(Post.associations()).sort()).toEqual(['author', 'tags']);
      expect(Object.keys(Tag.associations())).toEqual(['posts']);
    });
    it('should return a copy of the actual association descriptors', ()=>{
      var posts = Author.associations().posts;
      expect(posts).not.toBe(Author.__assoc_posts__);
    });
  });
  describe('.hasAssociation', ()=>{
    it('should return true if the class has a defined association with the given name and false otherwise', ()=>{
      expect(Post.hasAssociation('author')).toBe(true);
      expect(Post.hasAssociation('tags')).toBe(true);
      expect(Post.hasAssociation('foobar')).toBe(false);
    });
  });
  describe('.hasName', ()=>{
    it('should return true if the class has a defined attribute or association with the given name and false otherwise', ()=>{
      expect(Post.hasName('title')).toBe(true);
      expect(Post.hasName('author')).toBe(true);
      expect(Post.hasName('foobar')).toBe(false);
    });
  });
  describe('.load', ()=>{
    describe('given attributes containing an id not in the identity map', ()=>{
      it('should return a new model instance with the given attributes', ()=>{
        var m = BasicModel.load({
          id: 126,
          str: 's',
          num: 1
        });
        expect(m instanceof BasicModel).toBe(true);
        expect(m.id).toBe(126);
        expect(m.str).toBe('s');
        expect(m.num).toBe(1);
      });
      it('should not set non-attribute properties', ()=>{
        var m = BasicModel.load({
          id: 126,
          str: 's',
          num: 1,
          blah: 'boo'
        });
        expect('blah' in m).toBe(false);
      });
      it('should add the new model instance to the identity map', ()=>{
        var m = BasicModel.load({
          id: 127,
          str: 's',
          num: 1
        });
        expect(BasicModel.get(127)).toBe(m);
      });
      it('should set the $sourceState to LOADED', ()=>{
        var m = BasicModel.load({
          id: 128,
          str: 's',
          num: 1
        });
        expect(m.$sourceState).toBe(Model.LOADED);
      });
      it('should set isBusy to false', ()=>{
        var m = BasicModel.load({
          id: 128,
          str: 's',
          num: 1
        });
        expect(m.$isBusy).toBe(false);
      });
      it('does not have changes', ()=>{
        var m = BasicModel.load({
          id: 128,
          str: 's',
          num: 1
        });
        expect(m.$hasChanges()).toBe(false);
      });
    });
    describe('given attributes containing an id that is in the identity map', ()=>{
      it('should update and return the object that is already in the identity map', ()=>{
        var m1 = BasicModel.load({
          id: 200,
          str: 's1',
          num: 1
        });
        var m2 = BasicModel.load({
          id: 200,
          str: 's2',
          num: 2
        });
        expect(m2).toBe(m1);
        expect(m2.str).toBe('s2');
        expect(m2.num).toBe(2);
      });
      it('should set the $sourceState to LOADED', ()=>{
        var m = BasicModel.load({
          id: 201,
          str: 's',
          num: 1
        });
        m.str = 'x';
        expect(m.$hasChanges()).toBe(true);
        BasicModel.load({
          id: 201,
          str: 's3',
          bar: 3
        });
        expect(m.$sourceState).toBe(Model.LOADED);
        expect(m.$isBusy).toBe(false);
      });
      describe('when the model in the identity map is empty', ()=>{
        it('should not throw an exception', ()=>{
          var m = BasicModel.empty(19);
          expect(()=>{
            return BasicModel.load({
              id: 19,
              str: 'x',
              num: 2
            });
          }).not.toThrow();
          expect(m.$sourceState).toBe(Model.LOADED);
          expect(m.str).toBe('x');
          expect(m.num).toBe(2);
        });
      });
      it('sets the model to a pristine state', ()=>{
        var m = BasicModel.load({
          id: 201,
          str: 's',
          num: 1
        });
        m.str = 'x';
        expect(m.$hasChanges()).toBe(true);
        BasicModel.load({
          id: 201,
          str: 's3',
          bar: 3
        });
        expect(m.$hasChanges()).toBe(false);
      });
    });
    describe('given attributes that contain a uuid attribute', ()=>{
      it('should treat the uuid attribute as the id', ()=>{
        var m;
        expect(()=>m = BasicModel.load({uuid:"foobar", str:'s', num:1}))
          .not.toThrow();
        expect(m.$sourceState).toBe(Model.LOADED);
        expect(m.str).toBe('s');
        expect(m.num).toBe(1);
      });
    });
    describe('given attributes that do not include an id', ()=>{
      it('should throw an exception', ()=>{
        expect(()=>BasicModel.load({foo:'s', bar: 1}))
          .toThrow("BasicModel.load: an 'id' attribute is required");
      });
    });

    describe('given attributes containing a nested hasOne association', ()=>{
      it('should load the nested model and hook up the association', ()=>{
        var p = Post.load({
          id: 184,
          title: 'the title',
          body: 'the body',
          author: {
            id: 9,
            first: 'Homer',
            last: 'Simpson'
          }
        });
        expect(p.author).toBe(Author.get(9));
        expect(p.author.id).toBe(9);
        expect(p.author.first).toBe('Homer');
        expect(p.author.last).toBe('Simpson');
      });
      it('should not mark the associated model as dirty when it owns the association', ()=>{
        class A extends Model{}
        A.create($=>$.hasOne('b', 'B', {inverse:'a'}));

        class B extends Model{}
        B.create($=>$.hasOne('a', 'A', {inverse:'b', owner:true}));

        var a = A.load({
          id: 1,
          b: {
            id: 9,
            a: 1
          }
        });
        expect(a.b.$sourceState).toBe(Model.LOADED);
        expect(a.b.$hasChanges()).toBe(false);
        expect(a.b.$isBusy).toBe(false);
      });
    });

    describe('given attributes containing an id reference to a hasOne association', ()=>{
      describe('where the id exists in the identity map', ()=>{
        it('should hook up the association', ()=>{
          var a = Author.load({
            id: 10,
            first: 'Bar',
            last: 'Simpson'
          });
          expect(a.posts).toEqual([]);
          var p = Post.load({
            id: 185,
            author: 10
          });
          expect(p.author).toBe(a);
          expect(a.posts).toEqual([p]);
        });
      });
      describe('where the id does not exist in the identity map', ()=>{
        it('should create an empty instance of the associated object and hook up the association', ()=>{
          var p = Post.load({
            id: 185,
            author: 11
          });
          expect(p.author.id).toBe(11);
          expect(p.author.$sourceState).toBe(Model.EMPTY);
          expect(p.author.posts).toEqual([p]);
        });
      });
      describe('where the id is indicated by a <name>Id property', ()=>{
        it('should hook up the association', ()=>{
          var a = Author.load({
            id: 10,
            first: 'Bar',
            last: 'Simpson'
          });
          expect(a.posts).toEqual([]);
          var p = Post.load({
            id: 185,
            authorId: 10
          });
          expect(p.author).toBe(a);
          expect(a.posts).toEqual([p]);
        });
      });
      describe('where the id is indicated by a <name>_id property', ()=>{
        it('should hook up the association', ()=>{
          var a = Author.load({
            id: 10,
            first: 'Bar',
            last: 'Simpson'
          });
          expect(a.posts).toEqual([]);

          var p = Post.load({
            id: 185,
            author_id: 10
          });
          expect(p.author).toBe(a);
          expect(a.posts).toEqual([p]);
        });
      });
    });

    describe('given attributes containing a nested hasMany association', ()=>{
      it('should load all of the nested models and hook up associations', ()=>{
        var p = Post.load({
          id: 127,
          title: 'the title',
          body: 'the body',
          tags: [
            {
              id: 1,
              name: 'tag a'
            }, {
              id: 2,
              name: 'tag b'
            }
          ]
        });
        expect(p.tags[0].id).toBe(1);
        expect(p.tags[0].name).toBe('tag a');
        expect(p.tags[0].posts).toEqual([p]);
        expect(p.tags[1].id).toBe(2);
        expect(p.tags[1].name).toBe('tag b');
        expect(p.tags[1].posts).toEqual([p]);
      });
      it('should remove existing associations that are not present in the given attributes', ()=>{
        var t1 = Tag.load({
          id: 1,
          name: 'tag a'
        });
        var t2 = Tag.load({
          id: 2,
          name: 'tag b'
        });
        var p = Post.load({
          id: 127,
          title: 'the title',
          body: 'the body',
          tags: [1, 2]
        });
        expect(p.tags).toEqual([t1, t2]);
        Post.load({
          id: 127,
          title: 'the title',
          body: 'the body',
          tags: [2]
        });
        expect(p.tags).toEqual([t2]);
      });
      it('should not mark the associated models as dirty when they own the association', ()=>{
        class C extends Model{}
        C.create($=>{
          $.hasMany('ds', 'D', {inverse: 'cs'});
        });

        class D extends Model{}
        D.create($=>{
          $.hasMany('cs', 'C', {inverse:'ds', owner: true});
        });

        var c = C.load({
          id: 1,
          ds: [
            {
              id: 9,
              c: 1
            }, {
              id: 10,
              c: 1
            }
          ]
        });

        expect(c.ds[0].$sourceState).toBe(Model.LOADED);
        expect(c.ds[0].$hasChanges()).toBe(false);
        expect(c.ds[0].$isBusy).toBe(false);
        expect(c.ds[1].$sourceState).toBe(Model.LOADED);
        expect(c.ds[1].$hasChanges()).toBe(false);
        expect(c.ds[1].$isBusy).toBe(false);
      });
      it('should not add a model to the hasMany association more than once', ()=>{
        var p = Post.load({
          id: 127,
          title: 'the title',
          body: 'the body',
          tags: [
            {
              id: 1,
              name: 'tag a'
            }
          ]
        });
        expect(p.tags.map(t=>t.id)).toEqual([1]);

        Post.load({
          id: 127,
          title: 'the title',
          body: 'the body',
          tags: [
            {
              id: 1,
              name: 'tag a'
            }
          ]
        });
        expect(p.tags.map(t=>t.id)).toEqual([1]);
      });
    });
    describe('given attributes containing a list of id references to a hasMany association', ()=>{
      describe('where the ids exist in the identity map', ()=>{
        it('should hook up the associations', ()=>{
          var t1 = Tag.load({
            id: 324,
            name: 'blah'
          });
          var t2 = Tag.load({
            id: 673,
            name: 'stuff'
          });
          expect(t1.posts).toEqual([]);
          expect(t2.posts).toEqual([]);
          var p = Post.load({
            id: 127,
            title: 'the title',
            body: 'the body',
            tags: [324, 673]
          });
          expect(t1.posts).toEqual([p]);
          expect(t2.posts).toEqual([p]);
          expect(p.tags).toEqual([t1, t2]);
        });
      });
      describe('where the id does not exist in the identity map', ()=>{
        it('should create an empty instance of the associated models and hook up the associations', ()=>{
          var p;
          p = Post.load({
            id: 127,
            title: 'the title',
            body: 'the body',
            tags: [32, 44]
          });
          expect(p.tags[0].id).toBe(32);
          expect(p.tags[0].$sourceState).toBe(Model.EMPTY);
          expect(p.tags[0].posts).toEqual([p]);
          expect(p.tags[1].id).toBe(44);
          expect(p.tags[1].$sourceState).toBe(Model.EMPTY);
          expect(p.tags[1].posts).toEqual([p]);
        });
      });
      describe('where the ids are indicated by a <singular name>Ids property', ()=>{
        it('should hook up the associations', ()=>{
          var t1 = Tag.load({
            id: 324,
            name: 'blah'
          });
          var t2 = Tag.load({
            id: 673,
            name: 'stuff'
          });
          expect(t1.posts).toEqual([]);
          expect(t2.posts).toEqual([]);

          var p = Post.load({
            id: 127,
            title: 'the title',
            body: 'the body',
            tagIds: [324, 673]
          });
          expect(t1.posts).toEqual([p]);
          expect(t2.posts).toEqual([p]);
          expect(p.tags).toEqual([t1, t2]);
        });
      });
      describe('where the ids are indicated by a <singular name>_ids property', ()=>{
        it('should hook up the associations', ()=>{
          var p, t1, t2;
          t1 = Tag.load({
            id: 324,
            name: 'blah'
          });
          t2 = Tag.load({
            id: 673,
            name: 'stuff'
          });
          expect(t1.posts).toEqual([]);
          expect(t2.posts).toEqual([]);
          p = Post.load({
            id: 127,
            title: 'the title',
            body: 'the body',
            tag_ids: [324, 673]
          });
          expect(t1.posts).toEqual([p]);
          expect(t2.posts).toEqual([p]);
          expect(p.tags).toEqual([t1, t2]);
        });
      });
    });
    describe('given attributes containing a mixture of nested models and id references', ()=>{
      it('sould create empty instances for the ids and hook up all associations', ()=>{
        var p, t1;
        t1 = Tag.load({
          id: 555,
          name: 'blah'
        });
        p = Post.load({
          id: 721,
          title: 'the title',
          body: 'the body',
          tags: [
            555, {
              id: 666,
              name: 'foo'
            }, 777
          ]
        });
        expect(p.tags[0].id).toBe(555);
        expect(p.tags[0].$sourceState).toBe(Model.LOADED);
        expect(p.tags[0].posts).toEqual([p]);
        expect(p.tags[1].id).toBe(666);
        expect(p.tags[1].$sourceState).toBe(Model.LOADED);
        expect(p.tags[1].posts).toEqual([p]);
        expect(p.tags[2].id).toBe(777);
        expect(p.tags[2].$sourceState).toBe(Model.EMPTY);
        expect(p.tags[2].posts).toEqual([p]);
        expect(p.tags.map(t=>t.id)).toEqual([555, 666, 777]);
      });
    });
  });
  describe('.loadAll', ()=>{
    it('should load an array of objects', ()=>{
      var as;
      as = Author.loadAll([
        {
          id: 1,
          first: 'Homer',
          last: 'Simpson'
        }, {
          id: 2,
          first: 'Bart',
          last: 'Simpson'
        }, {
          id: 3,
          first: 'Ned',
          last: 'Flanders'
        }
      ]);
      expect(as.length).toBe(3);
      expect(as[0].id).toBe(1);
      expect(as[0].first).toBe('Homer');
      expect(as[1].id).toBe(2);
      expect(as[1].first).toBe('Bart');
      expect(as[2].id).toBe(3);
      expect(as[2].first).toBe('Ned');
    });
  });
  describe('.query', ()=>{
    beforeEach(()=>{
      spyOn(BasicModel.mapper, 'query').and.returnValue(Promise.resolve());
    });
    it('should return an empty array', ()=>{
      expect(BasicModel.query()).toEqual([]);
    });
    it('should decorate the returned array with a $class property', ()=>{
      var a = BasicModel.query();
      expect(a.$class).toBe(BasicModel);
    });
    it('should decorate the returned array with a $promise property', ()=>{
      var a = BasicModel.query();
      expect(a.$promise).not.toBeUndefined();
    });
    it('should decorate the returned array with an $isBusy property', ()=>{
      var a = BasicModel.query();
      expect(a.$isBusy).toBe(true);
    });
    it('should decorate the returned array with a $query method', ()=>{
      var a = BasicModel.query();
      expect(typeof a.$query).toBe('function');
    });
    it('should decorate the returned array with a $replace method', ()=>{
      var a;
      a = BasicModel.query();
      expect(typeof a.$replace).toBe('function');
    });
    it('should invoke the query method on the data mapper and pass a deferred object and an array', ()=>{
      var a = BasicModel.query();
      expect(BasicModel.mapper.query.calls.count()).toBe(1);
      expect(BasicModel.mapper.query.calls.mostRecent().args[0]).toBe(a);
    });
    it('should forward any arguments on to the data mapper', ()=>{
      var a = BasicModel.query('foo', 'bar', 'baz');
      expect(BasicModel.mapper.query.calls.count()).toBe(1);
      expect(BasicModel.mapper.query.calls.mostRecent().args).toEqual([a, 'foo', 'bar', 'baz']);
    });
  });
  describe('.buildQuery', ()=>{
    it('should return an empty array', ()=>{
      expect(BasicModel.buildQuery()).toEqual([]);
    });
    it("should not invoke the mapper's query method", ()=>{
      spyOn(BasicModel.mapper, 'query');
      BasicModel.buildQuery();
      expect(BasicModel.mapper.query).not.toHaveBeenCalled();
    });
  });
  describe('.query array', ()=>{
    var a = null;
    beforeEach(done=>{
      BasicModel.mapper = {
        query:mapperCallback
      };
      a = BasicModel.query();
      resolve(a);
      spyOn(BasicModel.mapper, 'query').and.callThrough();
      setTimeout(done);
    });
    describe('#$query', ()=>{
      it('should invoke the query method on the data mapper and pass along the array', ()=>{
        a.$query();
        expect(BasicModel.mapper.query.calls.count()).toBe(1);
        expect(BasicModel.mapper.query.calls.mostRecent().args[0]).toBe(a);
      });
      it('should forward any arguments on to the data mapper', ()=>{
        a.$query(1, 2, 3);
        expect(BasicModel.mapper.query.calls.count()).toBe(1);
        expect(BasicModel.mapper.query.calls.mostRecent().args).toEqual([a, 1, 2, 3]);
      });
      it('should set $isBusy', ()=>{
        expect(a.$isBusy).toBe(false);
        a.$query();
        expect(a.$isBusy).toBe(true);
      });
      it("should not invoke the mapper's query method when the array is busy", ()=>{
        a.$query().$query();
        expect(BasicModel.mapper.query.calls.count()).toBe(1);
      });
      it('should queue the latest call to $query when the array is busy and invoke query on the mapper when the previous query finishes', done=>{
        a.$query({
          foo: 1
        });
        expect(a.$isBusy).toBe(true);
        a.$query({
          foo: 2
        });
        a.$query({
          foo: 3
        });
        expect(BasicModel.mapper.query.calls.count()).toBe(1);
        expect(BasicModel.mapper.query.calls.mostRecent().args).toEqual([
          a, {
            foo: 1
          }
        ]);
        resolve(a);
        setTimeout(()=>{
          expect(BasicModel.mapper.query.calls.count()).toBe(2);
          expect(BasicModel.mapper.query.calls.mostRecent().args).toEqual([
            a, {
              foo: 3
            }
          ]);
          done();
        });
      });
      it('should set $isBusy to false when the mapper resolves the deferred', done=>{
        a.$query();
        expect(a.$isBusy).toBe(true);
        resolve(a);
        setTimeout(()=>{
          expect(a.$isBusy).toBe(false);
          done();
        });
      });
      it('should set $isBusy to false when the mapper rejects the deferred', done=>{
        a.$query();
        expect(a.$isBusy).toBe(true);
        reject('fail');
        setTimeout(()=>{
          expect(a.$isBusy).toBe(false);
          done();
        });
      });
    });
    describe('#$replace', ()=>{
      it('should replace the contents of the array with the given array', ()=>{
        expect(a).toEqual([]);
        expect(a.$replace([4, 5, 6])).toBe(a);
        expect(a).toEqual([4, 5, 6]);
      });
    });
  });
  // TODO(pwong): a) Is this used/needed?
  //              b) Is multiple arguments used/needed?
  //              Potential for perf boost... Or we create a seperate externally
  //              available that provides b) and allow internal to use a faster
  //              single argument version.
  describe('.extend', ()=>{
    it('extends the model with arguments', ()=>{
      var propMixin = {
        prop: ['the property']
      };
      var funcMixin = {
        func:()=>'the function'
      };
      BasicModel.extend(propMixin, funcMixin);
      expect(BasicModel.prop).toBe(propMixin.prop);
      expect(BasicModel.func).toBe(funcMixin.func);
    });
  });
  describe('#constructor', ()=>{
    var m ;
    it('should set the given attribtues', ()=>{
      m = new BasicModel({
        str: 'abc',
        num: 1,
        bool: false
      });
      expect(m.str).toBe('abc');
      expect(m.num).toBe(1);
      expect(m.bool).toBe(false);
    });
    it('should not set non-attribute properties', ()=>{
      m = new BasicModel({
        x: 9
      });
      expect('x' in m).toBe(false);
    });
  });
  describe('#$className', ()=>{
    it("should return the name of the model's constructor", ()=>{
      var m = new BasicModel();
      expect(m.$className()).toBe('BasicModel');
    });
  });
  describe('#id', ()=>{
    it('should throw an exception when setting it when it already has a non-null value', ()=>{
      var m = new BasicModel({
        id: 1
      });
      expect(m.id).toBe(1);
      expect(()=>m.id = 9).toThrow("BasicModel#id (setter): overwriting a model's identity is not allowed: " + m);
    });
  });
  describe('#$attrs', ()=>{
    it('should return an object containing the raw values of all attributes', ()=>{
      var m = new BasicModel({
        str: 'abc',
        num: 1,
        bool: false,
        date: new Date(2013, 9, 26)
      });
      expect(m.$attrs()).toEqual({
        str: 'abc',
        num: 1,
        bool: false,
        date: '2013-10-26'
      });
      m = new BasicModel({
        id: 12,
        str: 'abc',
        num: 1,
        bool: false,
        date: new Date(2013, 9, 26)
      });
      expect(m.$attrs()).toEqual({
        id: 12,
        str: 'abc',
        num: 1,
        bool: false,
        date: '2013-10-26'
      });
    });
    it('should return an empty object when the class has no attributes defined', ()=>{
      class X extends Model{}
      X.create();
      expect((new X()).$attrs()).toEqual({});
    });
  });
  describe('#$load', ()=>{
    it('throws an exception for a new model when given attrs without an id', ()=>{
      var a = new Author();
      expect(()=>{
        a.$load({
          first:'Bart',
          last:'Simpson'});
      }).toThrow("Author#$load: an 'id' attribute is required");
    });
    it("throws an exception when given attrs with an id that is different then the receiver's id", ()=>{
      var a = Author.load({
        id:3,
        first:'Homer',
        last:'Simpson'
      });
      expect(()=>{
        a.$load({
          id:4,
          first:'Bart',
          last:'Simpson'
        });
      }).toThrow("Author#$load: received attributes with id 4 but instance already has id 3");
    });
    it('sets the given id on the receiver and loads the attributes', ()=>{
      var a = new Author();
      a.$load({
        id: 5,
        first: 'Homer',
        last: 'Simpson'
      });
      expect(a.$sourceState).toBe(Model.LOADED);
      expect(a.id).toBe(5);
      expect(a.first).toBe('Homer');
      expect(a.last).toBe('Simpson');
    });
    it('loads the attributes when not given an id', ()=>{
      var a = Author.load({
        id: 3,
        first: 'Homer',
        last: 'Simpson'
      });
      a.$load({
        first: 'Bart',
        last: 'Simpson'
      });
      expect(a.first).toBe('Bart');
    });
  });
  describe('setting attrs', ()=>{
    describe('for a NEW model', ()=>{
      it('should not mark the model as changed', ()=>{
        var m = new BasicModel();
        expect(m.$hasChanges()).toBe(false);
        m.num = 9;
        expect(m.$hasChanges()).toBe(false);
      });
    });
    describe('for a LOADED model', ()=>{
      it('updates hasChanges', ()=>{
        var m = BasicModel.load({
          id: 121
        });
        expect(m.$sourceState).toBe(Model.LOADED);
        expect(m.$hasChanges()).toBe(false);
        m.str = 'hello';
        expect(m.$sourceState).toBe(Model.LOADED);
        expect(m.$hasChanges()).toBe(true);
      });
      it("should create the changes hash containing the changed attribute's previous value", ()=>{
        var m = BasicModel.load({
          id: 123,
          num: 8
        });
        expect(m.changes).toEqual({});
        m.num = 9;
        expect(m.changes).toEqual({num: 8});
      });
      it('should only add the attribute to the changes hash if it has yet to be changed', ()=>{
        var m = BasicModel.load({
          id: 123,
          str: 'a',
          num: 8
        });
        m.str = 'b';
        expect(m.changes).toEqual({
          str: 'a'
        });
        m.str = 'c';
        expect(m.changes).toEqual({
          str: 'a'
        });
        m.num = 9;
        expect(m.changes).toEqual({
          str: 'a',
          num: 8
        });
        m.num = 10;
        expect(m.changes).toEqual({
          str: 'a',
          num: 8
        });
      });
      it('removes change record if the value is the same as the original value', ()=>{
        var m = BasicModel.load({
          id: 123,
          str: 'a',
          num: 8
        });
        m.str = 'a';
        expect(m.changes).toEqual({});
        m.num = 6;
        expect(m.changes).toEqual({
          num: 8
        });
        m.str = 'b';
        expect(m.changes).toEqual({
          num: 8,
          str: 'a'
        });
        m.num = 8;
        expect(m.changes).toEqual({
          str: 'a'
        });
        m.str = 'a';
        expect(m.changes).toEqual({});
      });
    });
  });
  describe('#$undoChanges', ()=>{
    describe('on a NEW model', ()=>{
      it('should do nothing', ()=>{
        var m = new BasicModel({
          str: 'v',
          num: 12
        });
        m.$undoChanges();
        expect(m.$sourceState).toBe(Model.NEW);
        expect(m.str).toBe('v');
        expect(m.num).toBe(12);
      });
    });
    describe('on a clean model', ()=>{
      it('should do nothing', ()=>{
        var m = BasicModel.load({
          id: 5,
          str: 'v',
          num: 12
        });
        m.$undoChanges();
        expect(m.$hasChanges()).toBe(false);
        expect(m.str).toBe('v');
        expect(m.num).toBe(12);
      });
    });
    describe('on a deleted model', ()=>{
      it('should throw an exception', done=>{
        BasicModel.mapper = {
          delete:mapperCallback,
        };
        var m = BasicModel.load({
          id: 5,
          str: 'v',
          num: 12
        });
        m.$delete();
        resolve(m);
        setTimeout(()=>{
          expect(m.$sourceState).toBe(Model.DELETED);
          expect(()=>{
            return m.$undoChanges();
          }).toThrow("BasicModel#$undoChanges: attempted to undo changes on a DELETED model: " + m);
          done();
        });
      });
    });
    describe('on a dirty model', ()=>{
      var m;
      beforeEach(()=>{
        m = BasicModel.load({
          id: 5,
          str: 'v',
          num: 12
        });
        m.str = 'x';
        m.num = 21;
      });
      it('should set all attr values back to their original state', ()=>{
        m.$undoChanges();
        expect(m.str).toBe('v');
        expect(m.num).toBe(12);
      });
      it('does not have changes', ()=>{
        expect(m.$hasChanges()).toBe(true);
        m.$undoChanges();
        expect(m.$hasChanges()).toBe(false);
      });
    });
    describe('on the owner of associations', ()=>{
      it('runs #$undoChanges on associations', ()=>{
        var p = Post.load({
          id: 'post 1',
          author: {
            id: 'author 1',
            first: 'Douglas'
          },
          tags: [
            {
              id: 'tag 1',
              name: 'new'
            }, {
              id: 'tag 2',
              name: 'fancy'
            }
          ]
        });
        p.author.first = 'Doug';
        p.tags[0].name = 'old';
        p.removeTags(p.tags[1]);
        p.addTags(Tag.load({
          id: 'tag 3',
          name: 'cool'
        }));
        p.$undoChanges();
        expect(p.author.first).toBe('Douglas');
        expect(p.tags[0].name).toBe('new');
        expect(p.tags[1].name).toBe('fancy');
      });
    });
  });
  describe('.local', ()=>{
    describe('for an id of a model that is already loaded into the identity map', ()=>{
      it('should return a reference to the already existing object', ()=>{
        var m = BasicModel.load({
          id: 1234,
          str: 'a',
          num: 2
        });
        expect(BasicModel.local(1234)).toBe(m);
      });
    });
    describe('for an id of a model that is not loaded into the identity map', ()=>{
      it('should return an empty instance of the model', ()=>{
        var m = BasicModel.local(4567);
        expect(m.$sourceState).toBe(Model.EMPTY);
      });
      it("does not invoke the mapper's get method", ()=>{
        spyOn(BasicModel.mapper, 'get');
        BasicModel.local(1122);
        expect(BasicModel.mapper.get).not.toHaveBeenCalled();
      });
    });
  });
  describe('.get', ()=>{
    beforeEach(()=>{
      BasicModel.mapper = {
        get:mapperCallback
      };
      spyOn(BasicModel.mapper, 'get').and.callThrough();
    });
    describe('for an id of a model that is already loaded into the identity map', ()=>{
      it('should return a reference to the already existing object', ()=>{
        var m = BasicModel.load({
          id: 1234,
          str: 'a',
          num: 2
        });
        expect(BasicModel.get(1234)).toBe(m);
      });
      it('should invoke the get method on the mapper when the refresh option is true', ()=>{
        var m = BasicModel.load({
          id: 1234,
          str: 'a',
          num: 2
        });
        BasicModel.get(1234, {refresh:true});
        expect(BasicModel.mapper.get.calls.count()).toBe(1);
        expect(BasicModel.mapper.get.calls.mostRecent().args).toEqual([m, {}]);
      });
    });
    it('should pass options to the get method on the mapper', ()=>{
      var m = BasicModel.get(18, {
        another: 'option'
      });
      expect(BasicModel.mapper.get.calls.count()).toBe(1);
      expect(BasicModel.mapper.get.calls.mostRecent().args).toEqual([
        m, {
          another: 'option'
        }
      ]);
    });
    describe('for an id of a model that is not in the identity map', ()=>{
      it('should invoke the get method on the mapper', ()=>{
        var m = BasicModel.get(18);
        expect(BasicModel.mapper.get.calls.count()).toBe(1);
        expect(BasicModel.mapper.get.calls.mostRecent().args).toEqual([m, {}]);
      });
      it('should return an instance of the model with the $sourceState set to EMPTY and isBusy set to true', ()=>{
        var m = BasicModel.get(19);
        expect(m.id).toBe(19);
        expect(m.$sourceState).toBe(Model.EMPTY);
        expect(m.$isBusy).toBe(true);
        expect(m.$hasChanges()).toBe(false);
      });
      it('should set the $promise property', ()=>{
        var m = BasicModel.get(19);
        expect(m.$promise).not.toBeUndefined();
      });
      it('should add the instance to the identity map', ()=>{
        var m = BasicModel.get(20);
        expect(BasicModel.get(20)).toBe(m);
      });
      it('should set $sourceState to LOADED when the mapper resolves the promise', done=>{
        var m = BasicModel.get(134);
        expect(m.$sourceState).toBe(Model.EMPTY);
        resolve(m);
        setTimeout(()=>{
          expect(m.$sourceState).toBe(Model.LOADED);
          done();
        });
      });
      it('should set $isBusy to false when the mapper resolves the promise', done=>{
        var m = BasicModel.get(134);
        expect(m.$isBusy).toBe(true);
        resolve(m);
        setTimeout(()=>{
          expect(m.$isBusy).toBe(false);
          done();
        });
      });
      it('should set $isBusy to false when the mapper rejects the promise', done=>{
        var m = BasicModel.get(134);
        expect(m.$isBusy).toBe(true);
        reject('blah');
        setTimeout(()=>{
          expect(m.$isBusy).toBe(false);
          done();
        });
      });
      it('should change the $sourceState to NOTFOUND when the mapper rejects the promise', done=>{
        var m = BasicModel.get(134);
        expect(m.$sourceState).toBe(Model.EMPTY);
        reject('blah');
        setTimeout(()=>{
          expect(m.$sourceState).toBe(Model.NOTFOUND);
          done();
        });
      });
    });
  });
  describe('#$get', ()=>{
    var m;
    beforeEach(()=>{
      BasicModel.mapper = {
        get:mapperCallback,
        delete:mapperCallback
      };
      spyOn(BasicModel.mapper, 'get').and.callThrough();
      m = BasicModel.load({id:34});
    });
    it("should invoke the mapper's get method", ()=>{
      m.$get();
      expect(BasicModel.mapper.get.calls.count()).toBe(1);
      expect(BasicModel.mapper.get.calls.mostRecent().args).toEqual([m]);
    });
    it("should forward any arguments on to the mapper's get method", ()=>{
      m.$get('foo', 'bar');
      expect(BasicModel.mapper.get.calls.count()).toBe(1);
      expect(BasicModel.mapper.get.calls.mostRecent().args).toEqual([m, 'foo', 'bar']);
    });
    it('should return the receiver', ()=>{
      expect(m.$get()).toBe(m);
    });
    it('should set $isBusy to true', ()=>{
      expect(m.$isBusy).toBe(false);
      m.$get();
      expect(m.$isBusy).toBe(true);
    });
    it('should set $isBusy to false when the mapper resolves the promise', done=>{
      m.$get();
      expect(m.$isBusy).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should set $isBusy to false when the mapper rejects the promise', done=>{
      m.$get();
      expect(m.$isBusy).toBe(true);
      reject('blah');
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should transition an EMPTY model to LOADED when the mapper resolves the promise', done=>{
      m = BasicModel.empty(45);
      m.$get();
      expect(m.$sourceState).toBe(Model.EMPTY);
      expect(m.$isBusy).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.LOADED);
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should transition an EMPTY model to NOTFOUND when the mapper rejects the promise', done=>{
      m = BasicModel.empty(45);
      m.$get();
      expect(m.$sourceState).toBe(Model.EMPTY);
      reject('blah');
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.NOTFOUND);
        done();
      });
    });
    it('should not change the sourceState of a LOADED model when the mapper rejects the promise', done=>{
      m.$get();
      expect(m.$sourceState).toBe(Model.LOADED);
      reject('blah');
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.LOADED);
        done();
      });
    });
    it('should throw an exception when called on a NEW model', ()=>{
      var newModel = new BasicModel();
      expect(()=>newModel.$get())
        .toThrow("BasicModel#$get: cannot get a model in the NEW state: " + newModel);
    });
    it('should throw an exception when called on a BUSY model', ()=>{
      m.$get();
      expect(m.$isBusy).toBe(true);
      expect(()=>m.$get())
        .toThrow("BasicModel#$get: cannot get a model in the LOADED-BUSY state: " + m);
    });
    it('should throw an exception when called on a DELETED model', done=>{
      m.$delete();
      resolve(m);
      setTimeout(()=>{
        expect(()=>m.$get())
          .toThrow("BasicModel#$get: cannot get a model in the DELETED state: " + m);
        done();
      });
    });
  });
  describe('#$save', ()=>{
    beforeEach(()=>{
      BasicModel.mapper = {
        create: mapperCallback,
        update: mapperCallback,
        delete: mapperCallback
      };
      spyOn(BasicModel.mapper, 'create').and.callThrough();
      spyOn(BasicModel.mapper, 'update').and.callThrough();
    });
    it("should invoke the data mapper's create method when the model state is NEW", ()=>{
      var m = new BasicModel({
        id: 1,
        str: 'x',
        num: 9
      });
      expect(m.$sourceState).toBe(Model.NEW);
      m.$save();
      expect(BasicModel.mapper.create).toHaveBeenCalled();
      expect(BasicModel.mapper.update).not.toHaveBeenCalled();
    });
    it("should forward arguments on to the data mapper's create method", ()=>{
      var m = new BasicModel({
        id: 1,
        str: 'x',
        num: 9
      });
      m.$save('foo', 'bar', 'baz');
      expect(BasicModel.mapper.create.calls.count()).toBe(1);
      expect(BasicModel.mapper.create.calls.mostRecent().args).toEqual([m, 'foo', 'bar', 'baz']);
    });
    it('should set the $promise property when the model state is NEW', ()=>{
      var m = new BasicModel({
        id: 1,
        str: 'x',
        num: 9
      });
      expect(m.$promise).toBeUndefined();
      m.$save();
      expect(m.$promise).not.toBeUndefined();
    });
    it("should invoke the data mapper's update method when the model has changes", ()=>{
      var m = BasicModel.load({
        id: 1,
        str: 'x',
        num: 9
      });
      m.str = 'y';
      expect(m.$hasChanges()).toBe(true);
      m.$save();
      expect(BasicModel.mapper.create).not.toHaveBeenCalled();
      expect(BasicModel.mapper.update).toHaveBeenCalled();
    });
    it("should forward arguments on to the data mapper's update method", ()=>{
      var m = BasicModel.load({
        id: 1,
        str: 'x',
        num: 9
      });
      m.str = 'y';
      m.$save('a', 'b', 3);
      expect(BasicModel.mapper.update.calls.count()).toBe(1);
      expect(BasicModel.mapper.update.calls.mostRecent().args).toEqual([m, 'a', 'b', 3]);
    });
    it('should set the $promise property when the model has changes', ()=>{
      var m = BasicModel.load({
        id: 1,
        str: 'x',
        num: 9
      });
      m.str = 'y';
      expect(m.$promise).toBeUndefined();
      m.$save();
      expect(m.$promise).not.toBeUndefined();
    });
    it('should throw an exception for a model that is BUSY', ()=>{
      var m = BasicModel.load({
        id: 1,
        str: 'x'
      });
      m.str = 'y';
      m.$save();
      expect(m.$isBusy).toBe(true);
      expect(()=>{
        return m.$save();
      }).toThrow("BasicModel#$save: cannot save a model in the LOADED-DIRTY-BUSY state: " + m);
    });
    it('should throw an exception for a model that is DELETED', done=>{
      var m = BasicModel.load({
        id: 1,
        foo: 'x',
        bar: 2
      });
      m.$delete();
      resolve(m);
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.DELETED);
        expect(()=>{
          return m.$save();
        }).toThrow("BasicModel#$save: cannot save a model in the DELETED state: " + m);
        done();
      });
    });
    it('should throw an exception for a model that is EMPTY', ()=>{
      var m = BasicModel.empty(88);
      expect(()=>{
        return m.$save();
      }).toThrow("BasicModel#$save: cannot save a model in the EMPTY state: " + m);
    });
    it('should set $sourceState to LOADED when mapper.create resolves thvar e promise', done=>{
      var m = new BasicModel({
        str: 'x',
        num: 2
      });
      m.$save();
      expect(m.$sourceState).toBe(Model.NEW);
      resolve(m);
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.LOADED);
        done();
      });
    });
    it('should set $isBusy to false when mapper.create resolves the promise', done=>{
      var m = new BasicModel({
        str: 'x',
        num: 2
      });
      m.$save();
      expect(m.$isBusy).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should not change $sourceState when mapper.create rejects the promise', done=>{
      var m = new BasicModel({
        str: 'x',
        num: 2
      });
      m.$save();
      expect(m.$sourceState).toBe(Model.NEW);
      reject('blah');
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.NEW);
        done();
      });
    });
    it('should set $isBusy to false when mapper.create rejects the promise', done=>{
      var m = new BasicModel({
        str: 'x',
        num: 2
      });
      m.$save();
      expect(m.$isBusy).toBe(true);
      reject('blah');
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should set $isBusy to false when mapper.update resolves the promise', done=>{
      var m = BasicModel.load({
        id: 224,
        str: 'x',
        num: 2
      });
      m.str = 'a';
      m.$save();
      expect(m.$isBusy).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should set $isBusy to false when mapper.update rejects the promise', done=>{
      var m = BasicModel.load({
        id: 224,
        str: 'x',
        num: 2
      });
      m.str = 'a';
      m.$save();
      expect(m.$isBusy).toBe(true);
      reject('blah');
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should not delete the changes hash when mapper.update rejects the promise', ()=>{
      var m = BasicModel.load({
        id: 224,
        str: 'x',
        num: 2
      });
      m.str = 'a';
      m.num = 3;
      expect(m.changes).toEqual({
        str: 'x',
        num: 2
      });
      m.$save();
      reject('blah');
      expect(m.changes).toEqual({
        str: 'x',
        num: 2
      });
    });
  });
  describe('#$delete', ()=>{
    var m;
    beforeEach(()=>{
      BasicModel.mapper = {
        get:mapperCallback,
        delete:mapperCallback
      };
      spyOn(BasicModel.mapper, 'delete').and.callThrough();
      m = BasicModel.load({id:144});
    });
    it("should invoke the mapper's delete method", ()=>{
      m.$delete();
      expect(BasicModel.mapper["delete"].calls.count()).toBe(1);
      expect(BasicModel.mapper["delete"].calls.mostRecent().args).toEqual([m]);
    });
    it("should pass along any arguments to the mapper's delete method", ()=>{
      m.$delete('foo', 'bar', 'baz');
      expect(BasicModel.mapper["delete"].calls.count()).toBe(1);
      expect(BasicModel.mapper["delete"].calls.mostRecent().args).toEqual([m, 'foo', 'bar', 'baz']);
    });
    it('should set the $promise property', ()=>{
      expect(m.$promise).toBeUndefined();
      m.$delete();
      expect(m.$promise).not.toBeUndefined();
    });
    it('should set $isBusy to true', ()=>{
      expect(m.$isBusy).toBe(false);
      m.$delete();
      expect(m.$isBusy).toBe(true);
    });
    it('should work when the model state is EMPTY', ()=>{
      m = BasicModel.empty(447);
      m.$delete();
      expect(BasicModel.mapper["delete"].calls.count()).toBe(1);
      expect(BasicModel.mapper["delete"].calls.mostRecent().args).toEqual([m]);
      expect(m.$isBusy).toBe(true);
    });
    it("should not invoke the mapper's delete method when the model is in the NEW state", ()=>{
      m = new BasicModel();
      m.$delete();
      expect(BasicModel.mapper["delete"]).not.toHaveBeenCalled();
      expect(m.$sourceState).toBe(Model.DELETED);
      expect(m.$isBusy).toBe(false);
    });
    it('should do nothing when the model state is DELETED', done=>{
      m.$delete();
      resolve(m);
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.DELETED);
        expect(m.$isBusy).toBe(false);
        m.$delete();
        expect(BasicModel.mapper["delete"].calls.count()).toBe(1);
        expect(m.$sourceState).toBe(Model.DELETED);
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('should throw an exception when the model is BUSY', ()=>{
      m.$get();
      expect(m.$isBusy).toBe(true);
      expect(()=>m.$delete()).toThrow("BasicModel#$delete: cannot delete a model in the LOADED-BUSY state: " + m);
    });
    it('should set $sourceState to DELETED when the mapper resolves the promise', done=>{
      m = BasicModel.load({
        id: 144,
        str: 'hey',
        num: 222
      });
      m.$delete();
      expect(m.$sourceState).toBe(Model.LOADED);
      resolve(m);
      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.DELETED);
        done();
      });
    });
    it('should set $isBusy to false when the mapper resolves the promise', done=>{
      m = BasicModel.load({
        id: 144,
        str: 'hey',
        num: 222
      });
      m.$delete();
      expect(m.$isBusy).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
    it('resets changes when the mapper resolves the promise', done=>{
      m = BasicModel.load({
        id: 144,
        str: 'hey',
        num: 222
      });
      m.num = 223;
      m.$delete();
      expect(m.$hasChanges()).toBe(true);
      resolve(m);
      setTimeout(()=>{
        expect(m.$hasChanges()).toBe(false);
        done();
      });
    });
    it('should remove the model from the identity map when the mapper resolves the promise', done=>{
      var m1, m2;
      m1 = BasicModel.load({
        id: 888
      });
      m1.$delete();
      expect(BasicModel.get(888)).toBe(m1);
      resolve(m1);
      setTimeout(()=>{
        m2 = BasicModel.get(888);
        expect(m2).not.toBe(m1);
        expect(m2.$sourceState).toBe(Model.EMPTY);
        done();
      });
    });
    it('should remove the model from any associations when the mapper resolves the promise', done=>{
      var a, p, t;
      Post.mapper = {
        delete:mapperCallback
      };
      p = Post.load({
        id: 184,
        title: 'the title',
        body: 'the body',
        author: {
          id: 9,
          first: 'Homer',
          last: 'Simpson'
        },
        tags: [
          {
            id: 18,
            name: 'the tag'
          }
        ]
      });
      a = p.author;
      t = p.tags[0];
      expect(a.posts).toEqual([p]);
      expect(t.posts).toEqual([p]);
      p.$delete();
      resolve(p);
      setTimeout(()=>{
        expect(a.posts).toEqual([]);
        expect(t.posts).toEqual([]);
        done();
      });
    });
    it('should not change the source state when the mapper rejects the promise', done=>{
      m = BasicModel.load({
        id: 144,
        str: 'hey',
        num: 222
      });
      m.$delete();
      expect(m.$sourceState).toBe(Model.LOADED);
      reject('error');

      setTimeout(()=>{
        expect(m.$sourceState).toBe(Model.LOADED);
        done();
      });
    });
    it('should set $isBusy to false when the mapper rejects the promise', done=>{
      m = BasicModel.load({
        id: 145,
        str: 'hey',
        num: 222
      });
      m.$delete();
      expect(m.$isBusy).toBe(true);
      reject('error');
      setTimeout(()=>{
        expect(m.$isBusy).toBe(false);
        done();
      });
    });
  });
  describe('#$isNew', ()=>{
    it('returns true when the sourceState is NEW and false otherwise', ()=>{
      var m1 = new BasicModel();
      var m2 = BasicModel.load({id:345});
      expect(m1.$isNew).toBe(true);
      expect(m2.$isNew).toBe(false);
    });
  });
  describe('#$isEmpty', ()=>{
    it('returns true when the sourceState is EMPTY and false otherwise', ()=>{
      var m1 = BasicModel.empty(123);
      var m2 = BasicModel.load({id:124});
      expect(m1.$isEmpty).toBe(true);
      expect(m2.$isEmpty).toBe(false);
    });
  });
  describe('#$isLoaded', ()=>{
    it('returns true when the sourceState is LOADED and false otherwise', ()=>{
      var m1 = BasicModel.load({id:445});
      var m2 = new BasicModel();
      expect(m1.$isLoaded).toBe(true);
      expect(m2.$isLoaded).toBe(false);
    });
  });
  describe('#$isDeleted', ()=>{
    it('returns true when the sourceState is DELETED and false otherwise', done=>{
      BasicModel.mapper = {
        delete:mapperCallback
      };
      var m1 = BasicModel.load({id: 5});
      m1.$delete();
      resolve(m1);
      setTimeout(()=>{
        var m2 = new BasicModel();
        expect(m1.$isDeleted).toBe(true);
        expect(m2.$isDeleted).toBe(false);
        done();
      });
    });
  });
  describe('#$isNotfound', ()=>{
    it('returns true when the sourceState is NOTFOUND and false otherwise', done=>{
      BasicModel.mapper = {
        get: mapperCallback
      };
      var m1 = BasicModel.get(783);
      reject('error');
      setTimeout(()=>{
        var m2 = new BasicModel();
        expect(m1.$isNotfound).toBe(true);
        expect(m2.$isNotfound).toBe(false);
        done();
      });
    });
  });
  describe('.hasOne', ()=>{
    describe('with no inverse and owner option set to false', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Bar = class Bar extends Model{};
        Bar.create();

        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasOne('bar','Bar');
        });
      });
      it('should create a property with the given name', ()=>{
        expect('bar' in Foo.prototype).toBe(true);
      });
      it('should initialize the property to null', ()=>{
        expect((new Foo()).bar).toBeNull();
      });
      it('should not have changes when setting the hasOne side', ()=>{
        var f = Foo.load({id:91});
        var b = Bar.load({id:121});
        expect(f.$hasChanges()).toBe(false);
        f.bar = b;
        expect(f.$hasChanges()).toBe(false);
      });
      it('should not have changes when unsetting the hasOne side', ()=>{
        var f = Foo.load({id:91});
        var b = Bar.load({id:121});
        expect(f.$hasChanges()).toBe(false);
        f.bar = b;
        expect(f.$hasChanges()).toBe(false);
        f.bar = null;
        expect(f.$hasChanges()).toBe(false);
      });
      it('does not update changes when setting', ()=>{
        var f = Foo.load({id:91});
        var b = Bar.load({id:121});
        expect(f.changes).toEqual({});
        f.bar = b;
        expect(f.changes).toEqual({});
      });
      it('should throw an exception when setting an object of the wrong type', ()=>{
        class Baz extends Model{}
        Baz.create();

        var baz = new Baz();
        var f = new Foo();
        expect(()=>f.bar=baz).toThrow("Foo#bar: expected an object of type 'Bar' but received " + baz + " instead");
      });
    });
    describe('with no inverse and owner option set to true', ()=>{
      var Bar, Foo;
      Foo = Bar = null;
      beforeEach(()=>{
        Bar = class Bar extends Model{};
        Bar.create($=>{
          $.attr('str', 'string');
        });

        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasOne('bar', Bar, {owner:true});
        });
      });
      it('the owner model has changes when setting', ()=>{
        var f = Foo.load({id:12});
        expect(f.$hasChanges()).toBe(false);
        expect(f.changes).toEqual({});
        f.bar = new Bar();
        expect(f.$hasChanges()).toBe(true);
        expect(f.changes).toEqual({bar:void 0});
      });
      it('the owner model has changes when clearing the association', ()=>{
        var f = Foo.load({
          id: 12,
          bar: {id:19}
        });
        expect(f.$hasChanges()).toBe(false);
        f.bar = null;
        expect(f.$hasChanges()).toBe(true);
      });
      it('marks the parent as changed when the child changes', ()=>{
        var f = Foo.load({
          id: 12,
          bar: {id:1, str:'a'}
        });
        expect(f.$hasChanges()).toBe(false);
        f.bar.str = 'b';
        expect(f.$hasChanges()).toBe(true);
      });
    });
    describe('with a hasOne inverse', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Bar = class Bar extends Model{};
        Bar.create($=>{
          $.hasOne('foo', 'Foo', {inverse:'bar'});
        });

        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasOne('bar', 'Bar', {inverse:'foo'});
        });
      });
      it('should set the receiver as the inverse when setting', ()=>{
        var f1 = new Foo();
        var f2 = new Foo();
        var b1 = new Bar();
        var b2 = new Bar();
        f1.bar = b1;
        expect(b1.foo).toBe(f1);
        b2.foo = f2;
        expect(b2.foo).toBe(f2);
      });
      it('should clear both sides of the association when clearing one side', ()=>{
        var f = new Foo();
        var b = new Bar();
        f.bar = b;
        expect(f.bar).toBe(b);
        expect(b.foo).toBe(f);
        f.bar = null;
        expect(f.bar).toBeNull();
        expect(b.foo).toBeNull();
      });
    });
    describe('with hasMany inverse', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasOne('bar', 'Bar', {inverse:'foos'});
        });

        Bar = class Bar extends Model{};
        Bar.create($=>{
          $.hasMany('foos', 'Foo', {inverse:'bar'});
        });
      });
      it('should add the receiver to the inverse array when setting', ()=>{
        var f1 = new Foo();
        var f2 = new Foo();
        var b = new Bar();
        f1.bar = b;
        expect(b.foos).toEqual([f1]);
        f2.bar = b;
        expect(b.foos).toEqual([f1, f2]);
      });
      it('should remove the receiver from the inverse array when clearing', ()=>{
        var f1 = new Foo();
        var f2 = new Foo();
        var b = new Bar();
        f1.bar = b;
        f2.bar = b;
        expect(b.foos).toEqual([f1, f2]);
        f1.bar = null;
        expect(b.foos).toEqual([f2]);
        f2.bar = null;
        expect(b.foos).toEqual([]);
      });
    });
  });
  describe('.hasMany', ()=>{
    describe('with no inverse and owner option set to false', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Bar = class Bar extends Model{};
        Bar.create();

        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasMany('bars', Bar, {owner:false});
        });
      });
      it('should create a property with the given name', ()=>{
        expect('bars' in Foo.prototype).toBe(true);
      });
      it('should generate an "add<Name>" method', ()=>{
        expect(typeof Foo.prototype.addBars).toBe('function');
      });
      it('should generate an "remove<Name>" method', ()=>{
        expect(typeof Foo.prototype.removeBars).toBe('function');
      });
      it('should generate an "clear<Name>" method', ()=>{
        expect(typeof Foo.prototype.clearBars).toBe('function');
      });
      it('should initialize the property to an empty array', ()=>{
        expect((new Foo()).bars).toEqual([]);
      });
      it('should throw an exception when setting models of the wrong type', ()=>{
        var f = new Foo();
        var m = new BasicModel();
        expect(()=>f.bars = [new Bar(), m])
          .toThrow("Foo#bars: expected an object of type 'Bar' but received " + m + " instead");
      });
      describe('generated #add<Name> method', ()=>{
        it('should add the given model to the array', ()=>{
          var f = new Foo();
          var b1 = new Bar();
          var b2 = new Bar();
          expect(f.bars).toEqual([]);
          f.addBars(b1);
          expect(f.bars).toEqual([b1]);
          f.addBars(b2);
          expect(f.bars).toEqual([b1, b2]);
        });
        it('does not update changes', ()=>{
          var f = Foo.load({id:12});
          expect(f.$hasChanges()).toBe(false);
          f.addBars(new Bar());
          expect(f.$hasChanges()).toBe(false);
        });
        it('should throw an exception when adding objects of the wrong type', ()=>{
          var f = new Foo();
          var m = new BasicModel();
          expect(()=>f.addBars(m)).toThrow("Foo#bars: expected an object of type 'Bar' but received " + m + " instead");
        });
      });
      describe('generated #remove<Name> method', ()=>{
        it('should remove the given model from the array', ()=>{
          var f = new Foo();
          var b1 = new Bar();
          var b2 = new Bar();
          f.bars = [b1, b2];
          expect(f.bars).toEqual([b1, b2]);
          f.removeBars(b1);
          expect(f.bars).toEqual([b2]);
          f.removeBars(b2);
          expect(f.bars).toEqual([]);
        });
        it('should not change the model when removing objects', ()=>{
          var f = Foo.load({id:12});
          var b = new Bar();
          f.addBars(b);
          expect(f.$hasChanges()).toBe(false);
          f.removeBars(b);
          expect(f.$hasChanges()).toBe(false);
        });
      });
    });

    describe('with no inverse and owner option set to true', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Bar = class Bar extends Model{};
        Bar.create($=>{
          $.attr('str', 'string');
        });

        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasMany('bars', 'Bar', {owner:true});
        });
      });
      it('should change the model when adding objects', ()=>{
        var f = Foo.load({id:12});
        expect(f.$hasChanges()).toBe(false);
        f.addBars(new Bar());
        expect(f.$hasChanges()).toBe(true);
      });
      it('updates changes when adding objects', ()=>{
        var f = Foo.load({id:12});
        expect(f.changes).toEqual({});
        f.addBars(new Bar());
        expect(f.changes).toEqual({bars:[]});
      });
      it('updates changes when setting the association', ()=>{
        var f = Foo.load({id:13});
        expect(f.changes).toEqual({});
        expect(f.$hasChanges()).toBe(false);
        f.bars = [new Bar(), new Bar()];
        expect(f.changes).toEqual({bars:[]});
        expect(f.$hasChanges()).toBe(true);
      });
      it('updates changes when removing objects', ()=>{
        var f = Foo.load({
          id: 12,
          bars: [{id: 19}]
        });
        var bar = f.bars[0];
        expect(f.changes).toEqual({});
        expect(f.$hasChanges()).toBe(false);
        f.removeBars(bar);
        expect(f.changes).toEqual({
          bars: [bar]
        });
        expect(f.$hasChanges()).toBe(true);
      });
      it('does not change the model when removing an object not in the association', ()=>{
        var f = Foo.load({
          id: 12,
          bars: [{id: 19}]
        });
        expect(f.$hasChanges()).toBe(false);
        f.removeBars({});
        expect(f.$hasChanges()).toBe(false);
      });
      it('marks the parent as changed when the child changes', ()=>{
        var f = Foo.load({
          id: 12,
          bars: [{
              id: 19,
              str: 'a'
          }]
        });
        expect(f.$hasChanges()).toBe(false);
        f.bars[0].str = 'b';
        expect(f.$hasChanges()).toBe(true);
      });
    });
    describe('with a hasOne inverse', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasMany('bars', 'Bar', {inverse:'foo'});
        });
        Bar = class  Bar extends Model{};
        Bar.create($=>{
          $.hasOne('foo', 'Foo', {inverse:'bars'});
        });
      });
      it('should set the hasOne side when adding to the hasMany side', ()=>{
        var b1, b2, f;
        f = new Foo();
        b1 = new Bar();
        b2 = new Bar();
        expect(b1.foo).toBeNull();
        expect(b2.foo).toBeNull();
        f.addBars(b1);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBeNull();
        f.addBars(b2);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBe(f);
      });
      it('should set the hasOne side when setting the hasMany side', ()=>{
        var b1, b2, f;
        f = new Foo();
        b1 = new Bar();
        b2 = new Bar();
        expect(b1.foo).toBeNull();
        expect(b2.foo).toBeNull();
        f.bars = [b1, b2];
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBe(f);
      });
      it('should clear the hasOne side when removing from the hasMany side', ()=>{
        var b1, b2, f;
        f = new Foo();
        b1 = new Bar();
        b2 = new Bar();
        f.addBars(b1, b2);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBe(f);
        f.removeBars(b2);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBeNull();
      });
      it('should clear the hasOne side when the hasMany side is cleared', ()=>{
        var b1, b2, f;
        f = new Foo();
        b1 = new Bar();
        b2 = new Bar();
        f.addBars(b1, b2);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBe(f);
        f.clearBars();
        expect(b1.foo).toBeNull();
        expect(b2.foo).toBeNull();
      });
      it('should clear the hasOne side when the hasMany side is set to an empty array', ()=>{
        var b1, b2, f;
        f = new Foo();
        b1 = new Bar();
        b2 = new Bar();
        f.addBars(b1, b2);
        expect(b1.foo).toBe(f);
        expect(b2.foo).toBe(f);
        f.bars = [];
        expect(b1.foo).toBeNull();
        expect(b2.foo).toBeNull();
      });
    });
    describe('with a hasMany inverse', ()=>{
      var Bar, Foo;
      beforeEach(()=>{
        Foo = class Foo extends Model{};
        Foo.create($=>{
          $.hasMany('bars', 'Bar', {inverse:'foos'});
        });
        Bar = class  Bar extends Model{};
        Bar.create($=>{
          $.hasMany('foos', 'Foo', {inverse:'bars'});
        });
      });
      it('should add the receiver on the inverse side when an object is added', ()=>{
        var f1 = new Foo();
        var b1 = new Bar();
        var b2 = new Bar();
        expect(f1.bars).toEqual([]);
        expect(b1.foos).toEqual([]);
        expect(b2.foos).toEqual([]);
        f1.addBars(b1);
        expect(f1.bars).toEqual([b1]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([]);
        f1.addBars(b2);
        expect(f1.bars).toEqual([b1, b2]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([f1]);
      });
      it('should add the receiver on the inverse side when the association is set', ()=>{
        var f1 = new Foo();
        var b1 = new Bar();
        var b2 = new Bar();
        f1.bars = [b1, b2];
        expect(f1.bars).toEqual([b1, b2]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([f1]);
      });
      it('should remove the receiver from the inverse side of the previously associated models when the association is set', ()=>{
        var f1 = new Foo();
        var b1 = new Bar();
        var b2 = new Bar();
        var b3 = new Bar();
        var b4 = new Bar();
        f1.bars = [b1, b2];
        expect(f1.bars).toEqual([b1, b2]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([f1]);
        f1.bars = [b3, b4];
        expect(f1.bars).toEqual([b3, b4]);
        expect(b1.foos).toEqual([]);
        expect(b2.foos).toEqual([]);
      });
      it('should remove the receiver from the inverse side when a model is removed', ()=>{
        var f1 = new Foo();
        var b1 = new Bar();
        var b2 = new Bar();
        f1.addBars(b1, b2);
        expect(f1.bars).toEqual([b1, b2]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([f1]);
        f1.removeBars(b2);
        expect(f1.bars).toEqual([b1]);
        expect(b1.foos).toEqual([f1]);
        expect(b2.foos).toEqual([]);
        b1.removeFoos(f1);
        expect(f1.bars).toEqual([]);
        expect(b1.foos).toEqual([]);
        expect(b2.foos).toEqual([]);
      });
    });
  });
  describe('#toString', ()=>{
    describe('for an empty model', ()=>{
      it('should display the class name, state, and id', ()=>{
        expect(BasicModel.empty(123).toString()).toBe('#<BasicModel (EMPTY) {"id":123}>');
        expect(BasicModel.empty('foo').toString()).toBe('#<BasicModel (EMPTY) {"id":"foo"}>');
      });
    });
    describe('for a loaded model', ()=>{
      it('should display the class name, state, id, attributes, and associated object ids', ()=>{
        var a1 = Author.load({
          id: 3,
          first: 'Marge',
          last: 'Simpson'
        });
        var a2 = Author.load({
          id: 4,
          first: 'Lisa',
          last: 'Simpson',
          posts: [
            {
              id: 9,
              title: 'the title',
              body: 'the body',
              tags: []
            }, {
              id: 10,
              title: 'another title',
              body: 'some body',
              tags: []
            }
          ]
        });
        expect(a1.toString()).toMatch(/^#<Author \(LOADED\)/);
        expect(a1.toString()).toMatch(/"id":3/);
        expect(a1.toString()).toMatch(/"first":"Marge"/);
        expect(a1.toString()).toMatch(/"last":"Simpson"/);
        expect(a1.toString()).toMatch(/"posts":\[\]/);
        expect(a2.toString()).toMatch(/^#<Author \(LOADED\)/);
        expect(a2.toString()).toMatch(/"id":4/);
        expect(a2.toString()).toMatch(/"posts":\[9,10\]/);
        expect(a2.posts[0].toString()).toMatch(/^#<Post \(LOADED\)/);
        expect(a2.posts[0].toString()).toMatch(/"id":9/);
        expect(a2.posts[0].toString()).toMatch(/"author":4/);
      });
    });
  });
});
