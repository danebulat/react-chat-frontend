import { useState, useEffect, useRef, useContext } from 'react';
import { useAuth, AuthContext} from '../../contexts/AuthContext';
import TopBar from '../../components/topbar/TopBar';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatonline/ChatOnline';
import axios from 'axios';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { serverUri, socketUri } from '../../config/server.js';
import './messenger.css';

export default function Messenger() {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const { currentUser } = useAuth(); 
  const scrollRef = useRef();
  const socket = useRef(null);
  const anonId = useRef(null);

  /* -------------------------------------------------- */
  /* Helper functions                                   */
  /* -------------------------------------------------- */

  function getOnlineUsers() {
    if (onlineUsers.length === 0) {
      return [];
    }

    const onlineIds = onlineUsers.map(o => o.userId);
    return registeredUsers.filter(u => {
      return onlineIds.includes(Number(u.userId));
    });
  }

  function getOfflineUsers() {
    if (onlineUsers.length === 0) {
      return [];
    }

    const onlineIds = onlineUsers.map(o => o.userId);
    return registeredUsers.filter(u => {
      return !onlineIds.includes(Number(u.userId));
    });
  }

  function setupSocket() {

    //set initial anonId
    anonId.current = uuidv4();

    //cache anonymous user or logged in user on server
    if (!currentUser) {
      socket.current.emit("addUser", anonId.current);
    } else {
      socket.current.emit("addUser", currentUser.id);
    }

    //re-join chat if in chat
    if (currentChat) {
      socket.current.emit("joinedChat", {
        senderId: (currentUser ? currentUser.id : anonId.current),
        conversationId: currentChat.id,
      });
    }
  }

  /* -------------------------------------------------- */
  /* fetch all conversations                            */
  /* -------------------------------------------------- */
    
  //connect socket regardless of login status
  useEffect(() => {

    if (!socket.current) {
      //console.log(`socket path: ${socketPath}`);

      //ensure socket is connected on page load
      socket.current = io(`${socketUri}`);
      
      //get connected users
      socket.current.on("getUsers", users => {
        setOnlineUsers(users); //TODO: Store only user ids
      });

      //after joining a chat
      socket.current.on("chatJoined", _res => {
        //console.log('chat joined...');
      });

      //after receiving a message
      socket.current.on("getMessage", res => {
        setMessages(prev => [...prev, { 
          user_id: res.senderId, 
          text: res.text, 
          created_at: Date.now(),
        }]);
      });

      setupSocket();
    }
  }, []);

  useEffect(() => {

    //replace anonymous user with logged in user for socket
    //or the other way round
    setupSocket();
  }, [currentUser]);

  /* -------------------------------------------------- */
  /* fetch all conversations                            */
  /* -------------------------------------------------- */

  useEffect(() => {
    //console.log('fetching stuff...');

    //get all conversations using api
    const getConversations = async () => {
      try {
        const res = await axios.get(`${serverUri}/api/conversations`);
        setConversations(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    //get all registered users using api
    const getRegisteredUsers = async () => {
      try {
        const res = await axios.get(`${serverUri}/api/users`);
        setRegisteredUsers(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    getConversations();
    getRegisteredUsers();
  }, [currentUser]); // re-fretch users when user registers

  /* -------------------------------------------------- */
  /* fetch messages when new chat selected              */
  /* -------------------------------------------------- */

  //TODO: Update junction table (associate conversation
  //to user.

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      try {
        //use api to get messages
        const res = await axios.get(
          `${serverUri}/api/messages/${currentChat.id}`
        );
        setMessages(res.data);

        //cache joined conversation on socket server
        //handle both anonymouse and logged in users
        socket.current.emit("joinedChat", {
          senderId: (currentUser ? currentUser.id : anonId.current),
          conversationId: currentChat.id,
        });
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

    if (newMessage === '') {
      return;
    } 

    const message = {
      userId: currentUser.id,
      conversationId: currentChat.id,
      text: newMessage,
    };

    try {
      //store message using api
      const res = await axios.post(`${serverUri}/api/messages`,
        message,
        { headers: { authorization: "Bearer " + currentUser.accessToken }}
      );
      setMessages([...messages, res.data]);
      setNewMessage("");

      //send message to socket server
      socket.current.emit("handleNewMessage", {
        senderId: currentUser.id,
        conversationId: currentChat.id,
        text: newMessage, 
      });
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

  /* -------------------------------------------------- */
  /* Markup                                             */
  /* -------------------------------------------------- */
  
  return (
    <>
      <TopBar />
      <div className="messenger">

        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input disabled placeholder="Search conversations" className="chatMenuInput" />
            <h2 className="chatsHeader">User</h2>
            <p className={ currentUser ? "usernameText" : "anonymousText" }>
              { currentUser ? currentUser.username : "anonymous" }
            </p>
            <h2 className="chatsHeader">Chats</h2>
            { conversations.map(c => (
              <div key={c.title} onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentConversation={currentChat}/>
              </div>
            ))}
            <h2 className="chatsHeader">Source Code</h2>
            <p className="codeLink">
              <a href="https://github.com/danebulat/react-chat-frontend" target="_blank">Frontend</a>
            </p>
            <p className="codeLink">
              <a href="https://github.com/danebulat/react-chat-backend" target="_blank">Backend</a>
            </p>
            <p className="codeLink">
              <a href="https://github.com/danebulat/react-chat-socket" target="_blank">Socket</a>
            </p>
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ?
              <>
                <div className="chatBoxTop">
                  {messages && messages.map((m, index) => (
                    <div key={index} ref={scrollRef}>
                      <Message 
                        users={registeredUsers} 
                        message={m} 
                        own={
                          currentUser
                          ? (m.user_id === currentUser.id ? true : false) 
                          : false
                        } />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea onChange={e => setNewMessage(e.target.value)}
                      rows="1"
                      value={newMessage}
                      className="chatMessageInput" 
                      placeholder={currentUser ? "write something..." : "Please log in to chat"}
                      disabled={currentUser ? 0 : 1}>
                  </textarea>
                  <button onClick={handleSubmit} 
                      className="chatSubmitButton"
                      disabled={currentUser ? 0 : 1}>
                    Send
                  </button>
                </div>
              </> 
              : <span className="noConversationText">Open a chat to start talking.</span>
            }
          </div>
        </div>
        
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <h2 className="chatOnlineHeader">Online</h2>
            {getOnlineUsers().map((u, index) => 
              <div key={index}><ChatOnline user={u} isOnline={true} /></div>
            )}
            <h2 className="chatOnlineHeader">Offline</h2>
            {getOfflineUsers().map((u, index) => 
              <div key={index}><ChatOnline user={u} isOnline={false} /></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
