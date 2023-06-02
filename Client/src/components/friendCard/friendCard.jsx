import { useGetUserWithIdQuery } from "@/globalRedux/features/querys/usersQuery"
import styles from "./friendCard.module.css"
import Link from "next/link"

const FriendCard = ({data}) => {

    const {data: userData, isLoading, isError} = useGetUserWithIdQuery(data?.FriendId)

    if(isLoading){
        return(
            <p>Loading...</p>
        )
    }

    if(isError){
        return(
            <p>Error...</p>
        )
    }

    return(
        <Link className={styles.link} href={`/home/${userData.nickname}`}>
        <div className={styles.container}>
            <img className={styles.image} src={userData.picture}></img>
            <h3 className={styles.name}>{userData.nickname}</h3>
        </div>
        </Link>
    )
}

export default FriendCard