import { Link } from "react-router-dom"

const PullRequest = ({_id,title,requesterId,createdAt,comments}) => {
  return (
      <div class="pull-request">
          <div class="pull-request-header">
              <img class="pull-request-logo" src="https://icongr.am/octicons/git-pull-request.svg?size=128&color=08b602" alt="Pull Request Logo" />
              <Link to={`/pull-request/${_id}`} style={{textDecoration:'none',color:'#0064d7'}}><h2 class="pull-request-title">{title}</h2></Link>
          </div>
          <div class="pull-request-details">
              <p>By {requesterId.username}</p>
              <p><img className="pull-request-comment" src="https://icongr.am/octicons/comment-discussion.svg?size=128&color=adadad"/> {comments.length} </p>
              <p>Created at </p>
          </div>
      </div>
  )
}

export default PullRequest;