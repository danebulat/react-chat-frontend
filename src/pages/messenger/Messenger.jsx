import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import TopBar from '../../components/topbar/TopBar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatonline/ChatOnline';
import './messenger.css';

export default function Messenger() {

  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    //try to get user from local storage
    if (!auth.currentUser) {
      const lsCurrentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (!lsCurrentUser) navigate('/');
      if (!auth.currentUser) auth.setCurrentUser(lsCurrentUser);
    }

    setIsLoading(false);
  }, []);

  // TODO: is loading flag
  return !isLoading && (  
    <>
      <TopBar />
      <div className="messenger">

        <div className="chatMenu">
          <div class="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            <Conversation />
            <Conversation />
            <Conversation />
            <Conversation />
          </div>
        </div>

        <div className="chatBox">
          <div class="chatBoxWrapper">
            <div className="chatBoxTop">
               <Message />
               <Message own={true} />
               <Message />
            </div>
            <div className="chatBoxBottom">
              <textarea className="chatMessageInput" placeholder="write something..."></textarea>
              <button className="chatSubmitButton">Send</button>
            </div>
          </div>
        </div>
        
        <div className="chatOnline">
          <div class="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
