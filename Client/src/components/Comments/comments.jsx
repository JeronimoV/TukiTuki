import { useGetUserWithIdQuery } from "@/globalRedux/features/querys/usersQuery"
import Image from "next/image"
import styles from "./comment.module.css"
import { useEffect, useState } from "react"

const Comments = ({data}) => {

    console.log(data);

    const [userData, setUserData] = useState(null)

    const getUserData = async() => {
        await fetch(`https://tukituki-backend.onrender.com/users/${data.UserId}`).then(response => response.json()).then(response => setUserData(response))
    }

    useEffect(() => {
        if(data && data.UserId){
            getUserData()
        }
    },[data, data.UserId])

    if(userData === null){
        return <p>Loading...</p>
    }

    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.picture} src={userData.picture}/>
                <p>{userData.nickname}</p>
            </div>
            <div className={styles.comment}>
                {data.imageContent &&  data.textContent ? <div><img src={data.imageContent}/> <p>{data.textContent}</p> </div>: null}
                {data.imageContent ? <img src={data.imageContent}/> : null}
                {data.textContent ? <p>{data.textContent}</p> : null}
            </div>
        </div>
    )
}

export default Comments