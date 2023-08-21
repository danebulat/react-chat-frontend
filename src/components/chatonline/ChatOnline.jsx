import './chatOnline.css';

export default function ChatOnline() {
  return (
    <div class="chatOnline">
      <div className="chatOnlineFriend">

        <div className="chatOnlineImgContainer">
          <img className="chatOnlineImg" src="noAvatar.png" alt="" />
          <div className="chatOnlineBadge"></div>
        </div>

        <span className="chatOnlineName">
          John Doe
        </span>
      </div>
    </div>
  );
}