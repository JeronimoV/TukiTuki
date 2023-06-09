import { useGetUserWithIdQuery } from "@/globalRedux/features/querys/usersQuery"
import Image from "next/image"
import PersonalChat from "../personalChat/personalChat"
import styles from "./chatCard.module.css"
import { useDispatch, useSelector } from "react-redux"
import { saveChatId } from "@/globalRedux/features/slices/chatsSices"
import { useState, useEffect } from "react"

const ChatCard = ({data, userId, socket}) => {

    const [adCounter, setAdCounter] = useState(0)

    const dispatch = useDispatch()

    let id = data.UserId === userId ? data.FriendId : data.UserId

    const {data: userData, isLoading, isError} = useGetUserWithIdQuery(id)

    if(isLoading){
        return <p>Loading...</p>
    }

    if(isError){
        return <p>Error...</p>
    }

    const toggleChat = () => {
        dispatch(saveChatId(data.id))
    }

    return(
        <div>
            <div className={styles.container} onClick={toggleChat}>
                <img className={styles.image} src={userData.picture}/>
                <div className={styles.textContainer}>
                    <h3 className={styles.name}>{userData.nickname}</h3>
                </div>
            </div>
        </div>
    )
}

export default ChatCard