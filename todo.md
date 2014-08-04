
- [Design] Data Source
  - Provides Data that can be Rendered as a card

    ```js
    interface IDataSource {
      query({}):Data[]
    }
    ```

    ```js
    class Github /* implements IDataSource */ {
      query({}):Data[] {
        return
      }
    }
    ```


- [Design] Less boilerplate for Model/Mapper
    ```js
    class JsonRestMapper {
      get(model, id, options){
        var options = copy(options);
        options.id = id;
        loadJSON(this.getURL(options)).then((result)=>
          model.$class.load(
            AttrMunger.camelize(result)))
        )
      }

      query(array, options){
        loadJSON(this.getURL(options)).then((result)=>
          array.$replace(
            array.$class.loadAll(
              AttrMunger.camelize(result)))
        )
      }

      create(model, options){/*...*/}
      update(model, options){/*...*/}
      delete(model, options){/*...*/}
    }

    export default class Event extends Model.init({
      mapper: new JsonRestMapper({url: '/api/events/:id'})
    });
    ```
- [Design] Better Model initilization API
    ```js
    // BEFORE
    class GithubUserEvent extends Model{}
    GithubUserEvent.create($=>{
      $.mapper = GithubUserEventMapper;
      $.attr('type', 'string');
      $.attr('actor', 'identity');
      $.attr('repo', 'identity');
      $.attr('payload', 'identity');
    });
    export default GithubUserEvent;

    // AFTER
    export default class GithubUserEvent extends Model.init({
      mapper:  GithubUserEventMapper,
      type:    'string',
      actor:   'identity',
      repo:    'identity',
      payload: 'identity'
    }){};
    ```
- [Refactor] es6 <-> polymer
  - https://github.com/geelen/x-gif
