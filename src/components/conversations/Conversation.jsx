import './conversation.css';

export default function Conversation({ conversation }) {
  return (
    <div className="conversation">
      <img className="conversationImg" src="enter.svg" alt="" />
      <span className="conversationName">{conversation.title}</span>
    </div>
  );
}
