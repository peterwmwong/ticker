import './RepoView.css';
import GithubRepo from '../models/github/GithubRepo';
import EventsView from './EventsView.jsx';

const RepoView = ({id, type}, {repo})=>
  <div className="RepoView">
    <div className="App__content Card Card--fullBleed bg-purple">
      <div className="Card-title">
        <h1 className="c-white t-word-wrap-break-word" textContent={id} />
        <span className="c-gray-lighter t-light" textContent={repo && repo.description} />
      </div>
    </div>
    <EventsView id={id} type={type} />
  </div>;

const init = ({id}, state, {loadRepo})=>(
  GithubRepo.get(id).then(loadRepo),
  loadRepo(GithubRepo.localGet(id))
);

RepoView.state = {
  onInit: init,
  onProps: init,
  loadRepo: (props, state, actions, repo)=>({repo})
}

export default RepoView;
