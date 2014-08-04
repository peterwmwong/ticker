import Model from '../../helpers/model/Model';

class Repo extends Model{}
Repo.create($=>{
  $.attr('name', 'string');
  $.attr('url', 'string');
});

export default Repo;
