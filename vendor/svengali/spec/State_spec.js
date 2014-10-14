import {State} from 'base/build/svengali';

xdescribe('State', ()=>{
  describe('new State(parent, stateChart, definition:Object)', ()=>{
    describe('definition.concurrent [Boolean] Is a concurrent state if true, default is false', ()=>{
      it('should default `concurrent` to `false`, when not specified', function() {
        var s = new State(null, null, {});
        expect(s.concurrent).toBe(false);
      });

      it('should set `concurrent` to `true`, when `true`', function() {
        var s = new State(null, null, {concurrent: true});
        expect(s.concurrent).toBe(true);
      });
    });

    describe('definition.history [Boolean] Is a history state if true, default is false', ()=>{
      it('should default `history` to `false`, when not specified', ()=>{
        var s = new State(null, null, {});
        expect(s.history).toBe(false);
      });

      it('should set `concurrent` to `true`, when `true`', ()=>{
        var s = new State(null, null, {history: true});
        expect(s.history).toBe(true);
      });

      it('should throw an exception if `concurrent` and `history` are set', function() {
        expect(function() {
          new State(null, null, {concurrent: true, history: true});
        }).toThrow('State: history states are not allowed on concurrent states');
      });
    });
  });
})
