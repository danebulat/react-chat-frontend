import './conversation.css';

export default function Conversation({ conversation, currentConversation }) {

  const conversationClass = () => {
    if (currentConversation == null)
      return "conversation";

    return conversation.id === currentConversation.id
      ? "currentConversation"
      : "conversation";
  }

  return (
    <div className={conversationClass()}>
      <img className="conversationImg" src="enter.svg" alt="" />
      <span className="conversationName">{conversation.title}</span>
    </div>
  );
}
