import AttrMunger from 'helpers/AttrMunger';
import {loadJSON} from 'helpers/load';

// !!! <MOCKDATA> !!!
  import MOCKDATA from './GithubIssueMapperMOCKDATA';
// !!! </MOCKDATA> !!!

export default {
  get:(model ,{repo, issueNumber})=>
    (
      // loadJSON(`https://api.github.com/${repo}/issues/${issueNumber}`)
      Promise.resolve(MOCKDATA)
    ).then((data)=>{
      if(!data) throw "No Data";
      model.$load(AttrMunger.camelize(data));
    })
};
