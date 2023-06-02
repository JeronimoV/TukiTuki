"use client"

import ConnectedFriends from "../ConnectedFriends/ConnectedFriends"
import Chats from "../Chats/chats"
import Posts from "../Posts/posts"
import styles from "./pageView.module.css"
import { useEffect, useState } from "react"
import PersonalChat from "../personalChat/personalChat"
import { useSelector } from "react-redux"
import { chatSlices } from "@/globalRedux/features/slices/chatsSices"

const PageView = () => {

    const [showChats, setShowChats] = useState(false)

    const [chatId, setChatId] = useState(null)

    const [email, setEmail] = useState(null)

    const [userData, setUserData] = useState(null)

    const actualChatId = useSelector(value => value.saveChat.chatId)
    const chatStatus = useSelector(value => value.saveChat.chatStatus)

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
        await fetch(`https://tukituki-backend.onrender.com/users/id/${email}`)
        .then(response => response.json())
        .then(response => {
            setUserData(response)
        })
    }

    useEffect(() => {
        if(userData){
            localStorage.setItem("id", userData.dataToSend.id)
        }
    }, [userData])

    const toggleChat = () => {
        if(showChats){
            setShowChats(false)
        }else{
            setShowChats(true)
        }
    }

    if(!userData){
        return <p>Loading...</p>
    }

    return(
        <div className={styles.container}>
            <div className={styles.chat}>
                {showChats ? <Chats data={userData.dataToSend.id}/> : null}
                {chatId === 0 || !chatId ? null :
                    <PersonalChat chatId={chatId} userId={userData.dataToSend.id}/>
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