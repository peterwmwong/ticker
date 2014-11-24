xdescribe('statechart issues', ()=>{
  describe('Parameterized States', ()=>{
    describe('Downsides of `force` flag with `goto()`', ()=>{
      it('enters of ancestors are called', ()=>{
        var childEnterCount = 0;
        var parentEnterCount = 0;

        var child = statechart.State('child');
        child.enter(()=>{++childEnterCount});

        var parent = statechart.State('parent');
        parent.enter(()=>{++parentEnterCount});
        parent.addSubstate(child);

        parent.goto('./child');
        expect(childEnterCount).toBe(1);
        expect(parentEnterCount).toBe(1);

        parent.goto('./child', {force:true});
        expect(childEnterCount).toBe(2);
        expect(parentEnterCount).toBe(1);
      });

      it('exits not called', ()=>{
        var parentExitCount = 0;

        var parent = statechart.State('parent');
        parent.exit(()=>{++parentExitCount});

        parent.goto('.');
        expect(parentExitCount).toBe(0);

        parent.goto('.', {force:true});
        expect(parentExitCount).toBe(1);
      });
    });
  });
});
