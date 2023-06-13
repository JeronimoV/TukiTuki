"use client"

import ConnectedFriends from "../ConnectedFriends/ConnectedFriends"
import Chats from "../Chats/chats"
import Posts from "../Posts/posts"
import styles from "./pageView.module.css"
import { useEffect, useState } from "react"
import PersonalChat from "../personalChat/personalChat"
import { useDispatch, useSelector } from "react-redux"
import { chatSlices } from "@/globalRedux/features/slices/chatsSices"
import {io} from "socket.io-client"

const PageView = () => {

    window.addEventListener('popstate', function (event) {
        window.location.reload(); // Recargar la página cuando se utiliza el botón de retroceso del navegador
      });

    const [showChats, setShowChats] = useState(false)

    const [chatId, setChatId] = useState(null)

    const [email, setEmail] = useState(null)

    const [userData, setUserData] = useState(null)

    const [actualSocket, setActualSocket] = useState(null)

    const actualChatId = useSelector(value => value.saveChat.chatId)
    const chatStatus = useSelector(value => value.saveChat.chatStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        setChatId(actualChatId)
        setShowChats(chatSlices)
    }, [actualChatId, chatStatus])

    useEffect(() => {
        setEmail(localStorage.getItem("email"))
    },[])

    useEffect(() => {
        if(email){
            getUserData()
        }
    }, [email])

    const getUserData = async () => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/users/id/${email}`)
        .then(response => response.json())
        .then(response => {
            setUserData(response)
        })
    }

    useEffect(() => {
        if(userData && userData.dataToSend){
            console.log("SOY EL ID",userData.dataToSend.id);
            localStorage.setItem("id", userData.dataToSend.id)
            const socket = io("https://tukituki-backend-2f9e.onrender.com")
            setActualSocket(socket)
            socket.on("connect", () => {
                socket.emit("user_connected", {id: userData.dataToSend.id})
                console.log("SOY EL SOCKEEEEEEET", socket.connected);
        })
        return () =>{
            socket.off("connect")
        }
        }
    }, [userData])

    const toggleChat = () => {
        if(showChats){
            setShowChats(false)
        }else{
            setShowChats(true)
        }
    }

    console.log(actualSocket);

    if(!userData){
        return <p>Loading...</p>
    }
    if(!actualSocket){
        return <p>Loading...</p>
    }

    return(
        <div className={styles.container}>
            <div className={styles.chat}>
                {showChats ? <Chats data={userData.dataToSend.id} socket={actualSocket}/> : null}
                {chatId === 0 || !chatId || !userData.dataToSend.id ? null :
                    <PersonalChat chatId={chatId} userId={userData.dataToSend.id} socket={actualSocket}/>
                }  
            </div>
            <div className={styles.chatButton} onClick={toggleChat}>
                <p>Chats</p>
            </div>
            <div className={styles.posts}>
                <Posts data={userData.dataToSend.id}/>
            </div>
            <div className={styles.others}>
                <ConnectedFriends userData={userData}/>
            </div>
        </div>
    )
}

export default PageView