"use client"

import { useGetUserChatsQuery } from "@/globalRedux/features/querys/chatQuery"
import ChatCard from "../chatsCards/chatCard"
import styles from "./chats.module.css"
import { useEffect, useState } from "react"

const Chats = ({data}) => {

    const [allChats, setAllChats] = useState(null)

    const getAllChats = async () => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/chat/allchats/${data}`)
        .then(response => response.json())
        .then(response => setAllChats(response))
    }

    useEffect(() => {
        const socket = new WebSocket("ws://tukituki-backend-2f9e.onrender.com:3003")
        if(allChats !== null){
        socket.addEventListener("open", () => {
            let dataToSend = {
                id: data,
            }
            const info = JSON.stringify(dataToSend)
            socket.send(info)
        })
        socket.addEventListener("message", (event) => {
            const chatsReponse = JSON.parse(event.data)
            console.log(chatsReponse);
            const oldChats = [...allChats]
            oldChats.unshift(chatsReponse)
            setAllChats(oldChats)
        })
    }
    },[allChats])

    useEffect(() => {
        if(data){
            getAllChats()
        }
    },[data])

    if(allChats === null){
        return(
            <p>Loading...</p>
        )
    }

    return(
        <div className={styles.container}>
            {allChats && allChats.length > 0 ?
                allChats.map(value => <ChatCard data={value} userId={data}/>)
                : <div className={styles.errorDiv}><h3 className={styles.errorTitle}>Oops</h3><p className={styles.error}>You dont have chats!</p></div>
            }
        </div>
    )
}

export default Chats