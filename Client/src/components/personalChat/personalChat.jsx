import { useGetChatMessagesQuery } from "@/globalRedux/features/querys/chatQuery"
import styles from "./personalChat.module.css"
import { useEffect, useState } from "react"
import { useGetChatFriendInfoQuery } from "@/globalRedux/features/querys/chatQuery"

const PersonalChat = ({chatId, userId, socket}) => {

    console.log("SOY EL SOCKET", socket);
    
    const [userMessage, setUserMessage] = useState({
        message: ""
    })
    
    const [messages, setMessages] = useState(null)

    const getChatMessages = async() => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/chat/message/${chatId}`)
        .then(response => response.json())
        .then(response => setMessages(response))
    }

    const {data: friendData, isLoading, isError, refetch} = useGetChatFriendInfoQuery({chatId, userId})


    console.log(friendData);

    useEffect(() => {
        socket.on("update_message", (event) => {
            console.log("SOY EL MENSAJEEEEEEEEEEEEEE", messages);
            console.log("SOY EL EVENT",event);
            if(messages !== null){
                const oldMessage = [...messages]
                oldMessage.unshift(event)
                console.log("OLD MESSAGES", oldMessage);
                setMessages(oldMessage)
            }else{
                setMessages([event])
            }
        })
        return () => {
            socket.off("update_message");
        };
    }, [messages])

    useEffect(() => {
        if(chatId){
            getChatMessages()
            refetch()
        }
    }, [chatId])

    const sendMessage = (event) => {
        event.preventDefault()
        const messageToSend = userMessage.message
        socket.emit("send_message", {
            id: userId,
            message: messageToSend,
            chatId: chatId,
            userId: userId
        })
        setUserMessage({
            message: ""
        })
    }

    const handleInput = (event) => {
        setUserMessage({...userMessage, [event.target.name]: event.target.value})
    }

    if(messages === null || !messages){
        return <p>Loading...</p>
    }

    console.log(friendData);

    if(isLoading){
        return <p>Loading...</p>
    }

    if(isError){
        return <p>Error...</p>
    }

    return(
        <div className={styles.container}>
            <div className={styles.container2}>
                <div className={styles.header}>
                    <img className={styles.image} src={friendData.picture}/>
                    <p className={styles.friendName}>{friendData.nickname}</p>
                </div>
                <div className={styles.chat}>
                { messages && messages.length > 0 ?
                            messages.map(value => 
                                value.UserId === userId ? (
                                    <div>
                                        <p className={styles.you}>You</p>
                                        <p className={styles.user}>{value.message}</p>
                                    </div>
                                ) :
                                (<div>
                                    <p className={styles.him}>Him</p>
                                    <p className={styles.friend}>{value.message}</p>
                                </div>)
                            ): null
                        }
                </div>
                <form className={styles.form} onSubmit={sendMessage}>
                    <input name="message" onChange={handleInput} value={userMessage.message} className={styles.input}></input>
                    <button className={styles.button}>Enviar</button>
                </form>
            </div>
        </div>
    )
}

export default PersonalChat