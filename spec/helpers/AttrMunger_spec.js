import AttrMunger from 'helpers/AttrMunger';

describe('services/AttrMunger', ()=>{
  describe('.camelize', ()=>{
    it('should camelize keys', ()=>{
      expect(AttrMunger.camelize({foo_bar:1, baz:2}))
        .toEqual({fooBar:1, baz:2});
    });

    it('should camelize keys in nested objects', ()=>{
      expect(AttrMunger.camelize({foo:{baz_quux: 3}, hello:'there'}))
        .toEqual({foo:{bazQuux:3}, hello:'there'});
    });

    it('should camelize keys in objects of nested arrays', ()=>{
      expect(AttrMunger.camelize({foo: [{baz_quux:3}, {baz_quux:4}]}))
        .toEqual({foo:[{bazQuux:3}, {bazQuux:4}]});
    });

    it('should pass through arrays of non-object values', ()=>{
      expect(AttrMunger.camelize({foo_bar:[1, 2, 'three', 4]}))
        .toEqual({fooBar:[1, 2, 'three', 4]});
    });

    it('should properly handle arrays of arrays', ()=>{
      expect(
        AttrMunger.camelize({
          foo_bar:[
            [{baz_quux:'a'}],
            [{hey_ho:'b'}]
          ]
        })
      ).toEqual({
        fooBar:[
          [{bazQuux:'a'}],
          [{heyHo:'b'}]]
      });
    });

    it('should properly handle array objects', ()=>{
      expect(
        AttrMunger.camelize([
          {foo_bar:1},
          {foo_bar:2}
        ])
      ).toEqual([
        {fooBar:1},
        {fooBar:2}
      ]);
    });

    it('will not modify the passed-in object', ()=>{
      var obj = {underscore_value:1};
      AttrMunger.camelize(obj);
      expect(obj.underscore_value).toBeDefined();
    });
  });

  describe('.underscore', ()=>{
    it('should underscore keys', ()=>{
      expect(AttrMunger.underscore({fooBar:1, baz:2}))
        .toEqual({foo_bar:1, baz:2});
    });

    it('should underscore keys in nested objects', ()=>{
      expect(AttrMunger.underscore({foo:{bazQuux: 3}, hello:'there'}))
        .toEqual({foo: {baz_quux:3}, hello: 'there'});
    });

    it('should underscore keys in objects of nested arrays', ()=>{
      expect(
        AttrMunger.underscore({
          foo:[
            {bazQuux:3},
            {bazQuux:4}
          ]
        })
      ).toEqual({
        foo:[
          {baz_quux:3},
          {baz_quux:4}
        ]
      });
    });

    it('will not modify the passed-in object', ()=>{
      var obj = {camelValue:1};
      AttrMunger.underscore(obj);
      expect(obj.camelValue).toBeDefined();
    });
  });
});
