import { useEffect, useState } from "react"
import styles from "./userSearchCard.module.css"
import swal from "sweetalert"

const UserSearchResult = ({data, id}) => {

    const [friendRequest, setFriendRequest] = useState(false)
    const [verifyFriendButton, setVerifyFriendButton] = useState(null)

    const sendFriendRequest = async() => {
        await fetch("https://tukituki-backend-2f9e.onrender.com/friends/send", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({UserApplicant: id,
                UserRequested: data.id}),
        }).then(response => setFriendRequest(true)).then(value => swal({
            title: "Action Success!",
            text: "Friend Request send!",
            icon: "success"
        }))
    }

    const verifyFriend = async () => {
        await fetch("https://tukituki-backend-2f9e.onrender.com/friends/verify", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({friendId: data.id,
                userId: id}),
        }).then(value => value.json()).then(value => { value === "true" ? setVerifyFriendButton(true) : setVerifyFriendButton(false)})
    }

    useEffect(() => {
        verifyFriend()
    }, [data.id, id])

    return(
        <div className={styles.container}>
            <img className={styles.image} src={data.picture}/>
            <div className={styles.data}>
                <h3>{data.nickname}</h3>
            </div>
            {
                verifyFriendButton === true || friendRequest === true ? <button className={styles.button}>✔</button> :
                id === data.id ? null : <button onClick={sendFriendRequest} className={styles.button}>+</button>
            }
        </div>
    )
}

export default UserSearchResult