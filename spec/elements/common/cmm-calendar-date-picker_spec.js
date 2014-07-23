import createElement    from '../../spec-utils/create-element';
import mockElement      from '../../spec-utils/mock-element';
import ElementInterface from '../ElementInterface';

describe('common/cmm-calendar-date-picker', function(){

  beforeEach(async function(done){
    this.ei = new ElementInterface(
      await createElement('<cmm-calendar-date-picker/>',{})
    );
    done();
  });

  describe('CalendarModel',function(){
    it('1 is 1', function(){
      expect(1).toBe(1);
    });
  });
});
