"use client"

import FriendCard from "../friendCard/friendCard"
import styles from "./connectedFriends.module.css"

const ConnectedFriends = ({userData}) => {

    return(
        <div className={styles.container}>
            <h1 className={styles.title}>Your Friends</h1>
            <div className={styles.friends}>
            { userData.allFriends.length ?
                userData.allFriends.map(value => <FriendCard data={value}/>) 
                : <p className={styles.error}>You have not friends!</p>
            }
            </div>
        </div>
    )
}

export default ConnectedFriends