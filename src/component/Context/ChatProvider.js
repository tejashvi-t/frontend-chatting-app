import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {

    const [user, setuser] = useState()
    const [selectedChats, setSelectedChats] = useState()
    const [chats, setchats] = useState([])
    const [notification, setNotification] = useState([])


    const history = useHistory();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setuser(userInfo);

        if (!userInfo) { history.push("/") }
    }, [history]);

    return (
        <ChatContext.Provider 
        value={{ user, setuser, selectedChats, setSelectedChats, chats, setchats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;