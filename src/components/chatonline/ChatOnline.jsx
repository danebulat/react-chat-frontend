import './chatOnline.css';

export default function ChatOnline({ user, isOnline }) {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">

        <div className="chatOnlineImgContainer">
          {isOnline ? <div className="chatOnlineBadge"></div>
                    : <div className="chatOfflineBadge"></div>}
        </div>

        <span className="chatOnlineName">
          {user.username} 
        </span>
      </div>
    </div>
  );
}
