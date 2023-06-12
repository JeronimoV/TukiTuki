"use client"

import { useGetUserWithNicknameQuery } from "@/globalRedux/features/querys/usersQuery"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css"
import Publications from "../Publications/publications";
import { useEffect, useState } from "react";
import {io} from "socket.io-client"

const ProfileView = () => {

    const [isFriend, setIsFriend] = useState(null)

    const [newSocket, setNewSocket] = useState(null)

    const id = localStorage.getItem("id")

    const nickname = usePathname().split("/")[2]

    const {data: userData, isLoading, isError} = useGetUserWithNicknameQuery(nickname)

    const router = useRouter()

    useEffect(() =>{
        if(isLoading){
            console.log("Loading...");
        }else{
            let friendResult = userData.friends.find(value => value.FriendId === id)
            if(friendResult){
                setIsFriend(true)
            }else{
                setIsFriend(false)
            }
        }
    }, [userData])

    useEffect(() => {
        const socket = io("https://tukituki-backend-2f9e.onrender.com")
        socket.on("connect", () => {
            socket.emit("user_connected", {id: id})
        })
        setNewSocket(socket)
    },[id])

    if(isLoading){
        return <p>Loading...</p>
    }

    if(isError){
        return <p>Error...</p>
    }

    const startChat = async() => {
        console.log(newSocket);
        if(newSocket !== null){
        const dataToSend = {
            id: id,
            userId: id,
            friendId: userData.id,
            getChats: true
        }
        newSocket.emit("create_chat", dataToSend)
        router.push("home")
    }
    }

    return(
        <div className={styles.container}>
            <div className={styles.info}>
                <img className={styles.image} src={userData.picture}/>
                <img className={styles.profileBack} src={userData.coverPhoto}/>
                <div className={styles.userData}>
                    <h3 className={styles.name}>{userData.nickname}</h3>
                    <p className={styles.description}>{userData.description ? userData.description : "User doesnt have a description"}</p>
                    <div className={styles.additionalData}>
                        <p className={styles.friends}>Friends: {userData.friends.length}</p>
                        {id !== userData.id ?
                        <p className={styles.friends}>{isFriend ? "You two are friends!" : "You are not friends!"}</p> : null}
                    </div>
                </div>
                <div className={styles.buttons}>
                {id !== userData.id ?
                    <div>{isFriend ? null :<button className={styles.button}>Add friend</button>}<button className={styles.button} onClick={startChat}>Start chat</button></div> : <button className={styles.button} onClick={() => router.push("/home/edit")}>Edit profile</button>}
                </div>
            </div>
                {userData.posts.length > 0 ? <div className={styles.posts}>
                    {userData.posts.map(value => 
                        <Publications data={value}/>
                    )}
                </div> : null}
            <img className={styles.backgroundProfile} src={userData.backgroundPicture}/>
        </div>
    )
}

export default ProfileView