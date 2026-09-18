import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { useState, useEffect } from 'react';
import server from "./environment";

function ChatPage() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark"); 
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(
  localStorage.getItem("currThreadId") || uuidv1()
);
  const [prevChats, setPrevChats] = useState([]); 
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

     useEffect(() => {
    const loadCurrChat = async () => {
      try {
        const response = await fetch(`${server.prod}/api/thread/${currThreadId}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const res = await response.json();
        if (res.length > 0) {
          setPrevChats(res);
          setNewChat(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadCurrChat();
  }, []);

  const [loading, setLoading] = useState(false); 

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    loading, setLoading,
    theme, setTheme,
  };

  return (
         <div className={`app ${theme === "light" ? "light-theme" : ""}`}>
       <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  )
}

export default ChatPage