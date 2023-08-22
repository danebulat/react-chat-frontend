import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TopBar from '../../components/topbar/TopBar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatonline/ChatOnline';
import axios from 'axios';
import './messenger.css';

export default function Messenger() {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const { currentUser } = useAuth(); 
  const scrollRef = useRef();

  /* -------------------------------------------------- */
  /* fetch all conversations                            */
  /* -------------------------------------------------- */

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations");
        setConversations(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);

  /* -------------------------------------------------- */
  /* fetch messages when new chat selected              */
  /* -------------------------------------------------- */

  //TODO: Update junction table (associate conversation
  //to user.

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentChat.id}`
        );
        setMessages(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  /* -------------------------------------------------- */
  /* handle submit message click                        */
  /* -------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      userId: currentUser.id,
      conversationId: currentChat.id,
      text: newMessage,
    };
    
    try {
      const res = await axios.post("http://localhost:5000/api/messages",
        message,
        { headers: { authorization: "Bearer " + currentUser.accessToken }}
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    }
    catch (err) {
      console.log(err);
    }
  };

  /* -------------------------------------------------- */
  /* Scroll when new message added                      */
  /* -------------------------------------------------- */

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages]);

  return (
    <>
      <TopBar />
      <div className="messenger">

        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search for friends" className="chatMenuInput" />
            { conversations.map(c => (
              <div key={c.title} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c}/>
              </div>
            ))}
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ?
              <>
                <div className="chatBoxTop">
                  {messages && messages.map((m, index) => (
                    <div key={index} ref={scrollRef}>
                      <Message message={m} 
                        own={m.user_id === currentUser.id ? true : false} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea onChange={e => setNewMessage(e.target.value)}
                    value={newMessage}
                    className="chatMessageInput" 
                    placeholder="write something...">
                  </textarea>
                  <button onClick={handleSubmit} className="chatSubmitButton">Send</button>
                </div>
              </> 
              : <span className="noConversationText">Open a conversation to start a chat</span>
            }
          </div>
        </div>
        
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
            <ChatOnline />
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}
