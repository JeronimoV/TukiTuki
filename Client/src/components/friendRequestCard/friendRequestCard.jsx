import { useState } from "react";
import styles from "./friendRequestCard.module.css"
import swal from "sweetalert";

const FriendRequestCard = ({data, id}) => {

    const [responseStatus, setResponseStatus] = useState("notResponse")

    let dataToSend = {
        requestId: data.requestId, UserApplicant: data.id, UserRequested: id
    }
    
    const submitResponse = async (userResponse) => {
        dataToSend.response = userResponse
        await fetch(`https://tukituki-backend-2f9e.onrender.com/friends/response`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
        }).then(value => 
            userResponse === "Accept" ? swal({
                title: "Action Success!",
                text: "Friend Request Accepted!",
                icon: "success"
            }) : swal({
                title: "Action Success!",
                text: "Friend Request Rejected!",
                icon: "error"
            })).then(value => setResponseStatus("HaveResponse"))
    }

    return(
        <div className={responseStatus === "notResponse" ? styles.container : styles.hidden}>
            <div className={styles.info}>
                <img className={styles.image} src={data.picture}/>
                <p className={styles.nickname}>{data.nickname}</p>
            </div>
            <p className={styles.text}>Friend Request</p>
            <div className={styles.buttons}>
                <button className={styles.accept} onClick={() => submitResponse("Accept")}>Accept</button>
                <button className={styles.reject} onClick={() => submitResponse("Reject")}>Reject</button>
            </div>
        </div>
    )
}

export default FriendRequestCard