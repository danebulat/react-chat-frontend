import { useState, useEffect, useRef, useContext } from 'react';
import { useAuth, AuthContext} from '../../contexts/AuthContext';
import TopBar from '../../components/topbar/TopBar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import ChatOnline from '../../components/chatonline/ChatOnline';
import axios from 'axios';
import {io} from 'socket.io-client';
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
  const socket = useRef();

  function getOnlineUsers() {
    const onlineIds = onlineUsers.map(o => o.userId);

    return registeredUsers.filter(u => {
      return onlineIds.includes(Number(u.userId));
    });
  }

  function getOfflineUsers() {
    const onlineIds = onlineUsers.map(o => o.userId);

    return registeredUsers.filter(u => {
      return !onlineIds.includes(Number(u.userId));
    });
  }

  useEffect(() => {
    if (currentUser) {
      console.log('connect socket...');

      //ensure socket is connected when user exists
      socket.current = io("ws://localhost:8900");

      //cache user id and socket id on server
      socket.current.emit("addUser", currentUser.id);

      //get connected users
      socket.current.on("getUsers", users => {
        //TODO: Store only user ids
        setOnlineUsers(users);
      });

      //after joining a chat
      socket.current.on("chatJoined", _res => {
        console.log('chat joined...');
      });

      //after receiving a message
      socket.current.on("getMessage", res => {
        setMessages(prev => [...prev, { 
          sender: res.senderId,
          text: res.text, 
          created_at: Date.now(),
        }]);
      });
    } 
  }, [currentUser]);

  /* -------------------------------------------------- */
  /* fetch all conversations                            */
  /* -------------------------------------------------- */

  useEffect(() => {

    //get all conversations using api
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations");
        setConversations(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    //get all registered users using api
    const getRegisteredUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setRegisteredUsers(res.data);
      }
      catch (err) {
        console.log(err);
      }
    }

    getConversations();
    getRegisteredUsers();
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
        //use api to get messages
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentChat.id}`
        );
        setMessages(res.data);

        //cache joined conversation on socket server
        socket.current.emit("joinedChat", {
          senderId: currentUser.id,
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

    if (!e.target.value) {
      return;
    } 

    const message = {
      userId: currentUser.id,
      conversationId: currentChat.id,
      text: newMessage,
    };

    try {
      //store message using api
      const res = await axios.post("http://localhost:5000/api/messages",
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

  return (
    <>
      <TopBar />
      <div className="messenger">

        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="Search conversations" className="chatMenuInput" />
            <h2 className="chatsHeader">Chats</h2>
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
                      <Message users={registeredUsers} message={m} 
                        own={m.user_id === currentUser.id ? true : false} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea onChange={e => setNewMessage(e.target.value)}
                    rows="1"
                    value={newMessage}
                    className="chatMessageInput" 
                    placeholder="write something...">
                  </textarea>
                  <button onClick={handleSubmit} className="chatSubmitButton">Send</button>
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
