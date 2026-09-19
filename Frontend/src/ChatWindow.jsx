import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import server from "./environment";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat, loading, setLoading, theme, setTheme } = useContext(MyContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [voiceLang, setVoiceLang] = useState("en-IN");

      const getReply = async () => {
    if (!prompt.trim()) return;

    const currPrompt = prompt;
    setPrompt("");
    setNewChat(false);
    setLoading(true);

  
    setPrevChats(prevChats => [
        ...prevChats,
        { role: "user", content: currPrompt }
    ]);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
            message: currPrompt,
            threadId: currThreadId
        })
    };

         try {
       const response = await fetch(`${server.prod}/api/chat`, options);
       const res = await response.json();

        if (!response.ok) {
         setReply(res.error || "Something went wrong. Please try again.");
        } else {
            setReply(res.reply);
           }
          } catch (err) {
        console.log(err);
        setReply("Something went wrong. Please try again.");
           }
            setLoading(false);
            };


useEffect(() => {
    if (reply) {
        setPrevChats(prevChats => [
            ...prevChats,
            { role: "assistant", content: reply }
        ]);
    }
}, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

         const toggleTheme = () => {
         const newTheme = theme === "dark" ? "light" : "dark";
         setTheme(newTheme);
         localStorage.setItem("theme", newTheme);
       };

          const handleLogout = () => {
         localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/login");
          };

       useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = voiceLang;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognition;
}, [voiceLang]);

const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
};

     const toggleVoiceLang = () => {
      setVoiceLang(prev => (prev === "hi-IN" ? "en-IN" : "hi-IN"));
      };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>ChatSphere AI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItem" onClick={toggleTheme}>
                        <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i> {theme === "dark" ? "Light Mode" : "Dark Mode"}
                    </div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <button type="button" className="langToggle" onClick={toggleVoiceLang} title="Toggle voice language">
                          {voiceLang === "hi-IN" ? "हिं" : "EN"}
                    </button>
                 <div id="mic" className={isListening ? "listening" : ""} onClick={toggleMic} title="Speak to type">
                         <i className="fa-solid fa-microphone"></i>
                 </div>
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    ChatSphere AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;