import Model from '../../helpers/model/Model';
import GithubIssueMapper from './GithubIssueMapper';

class GithubIssue extends Model{}
GithubIssue.create($=>{
  $.mapper = GithubIssueMapper;

  $.attr('fullName', 'string');
  $.attr('name',     'string');
  $.attr('url',      'string');
  $.attr('score',    'number');
});

export default GithubIssue;
