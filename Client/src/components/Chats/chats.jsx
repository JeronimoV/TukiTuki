"use client"

import { useGetUserChatsQuery } from "@/globalRedux/features/querys/chatQuery"
import ChatCard from "../chatsCards/chatCard"
import styles from "./chats.module.css"
import { useEffect, useState } from "react"
import {io} from "socket.io-client"

const Chats = ({data}) => {

    const [allChats, setAllChats] = useState(null)

    const getAllChats = async () => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/chat/allchats/${data}`)
        .then(response => response.json())
        .then(response => setAllChats(response))
    }

    useEffect(() => {
        const socket = io("https://tukituki-backend-2f9e.onrender.com")
        socket.on("connect", () => {
            socket.emit("user_connected", {id: data})
            console.log("SOY EL SOCKEEEEEEET", socket.connected);
        })
        socket.on("create_chat", (event) => {
            console.log("SOY ESTEEEEEEEEEEEEEEEE",event);
            console.log("Entreeeeeeeee");
            if(allChats === null){
                setAllChats([event])
            }else{
                const oldChats = [...allChats]
                oldChats.unshift(event)
                setAllChats(oldChats)
            }
        })
        return () => {
            socket.off("user_connected");
            socket.off("create_chat");
        };
    },[])

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