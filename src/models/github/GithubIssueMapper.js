import loadJSON from 'helpers/load';

export default {
  get:(model ,{repo, issueNumber})=>
    (
      loadJSON(`https://api.github.com/${repo}/issues/${issueNumber}`)
    ).then((data)=>{
      if(!data) throw "No Data";
      model.$load(data);
    })
};
