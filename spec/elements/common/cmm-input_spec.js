import createElement    from '../../spec-utils/create-element';
import ElementInterface from '../ElementInterface';

ddescribe('common/cmm-input', function(){
  var ei, model;

  beforeEach(async (done)=>{
    model = {
      options: ['one', 'two', 'three'],
      value:'',
      inputValue:''
    };
    ei = new ElementInterface(
      await createElement(`
        <cmm-input value='{{value}}' inputValue='{{inputValue}}'>
          <cmm-options>
            <template repeat='{{ option in options }}'>
              <cmm-option value='[[option]]'></cmm-option>
            </template>
          </cmm-options>
        </cmm-input>
      `, model)
    );
    done();
  });

  it('initializes `value` and `inputValue`', ()=>{
    expect(model.value).toBe('');
    expect(model.inputValue).toBe('');
  });
});
