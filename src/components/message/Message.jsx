import './message.css';
import {format} from 'timeago.js';

export default function Message({message, own, users}) {

  const getUsernameById = (userId) => {
    return users.find(u => u.userId === userId).username;
  }

  return (
    <div className={ own ? "message own" : "message" }>
      <div className="messageTop">
        <span className="messageUsername">
          {getUsernameById(message.user_id)}
        </span>
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">
        { format(message.created_at) }
      </div>
    </div>
  );
}
