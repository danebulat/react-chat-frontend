import './message.css';
import {format} from 'timeago.js';

export default function Message({message, own}) {
  return (
    <div className={ own ? "message own" : "message" }>
      <div className="messageTop">
        <img className="messageImg" src="noAvatar.png" alt="" />
        <p className="messageText">{ message.text }</p>
      </div>
      <div className="messageBottom">
        { format(message.created_at) }
      </div>
    </div>
  );
}
