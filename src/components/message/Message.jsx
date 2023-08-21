import './message.css';

export default function Message({own}) {
  return (
    <div className={ own ? "message own" : "message" }>
      <div className="messageTop">
        <img className="messageImg" src="noAvatar.png" alt="" />
        <p className="messageText">Hello this is a message</p>
      </div>
      <div className="messageBottom">
        1 hour ago
      </div>
    </div>
  );
}
