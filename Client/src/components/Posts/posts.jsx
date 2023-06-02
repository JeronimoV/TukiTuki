import Publications from "../Publications/publications"
import { useGetFriendsPostsQuery } from "@/globalRedux/features/querys/postsQuery"
import styles from "./posts.module.css"
import { useState } from "react"
import swal from "sweetalert"

const Posts = ({data}) => {

    const [newPost, setNewPost] = useState({
        textContent: "",
        imageContent: "",
        userId: data
    })

    const {data: friendsPosts, isLoading, isError, error} = useGetFriendsPostsQuery(data)

    if(isLoading){
        return( <p>Loading...</p>)
    }

    const makePost = async (e) => {
        e.preventDefault()
        await fetch(`https://tukituki-backend.onrender.com/posts`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPost),
        }).then(() => setNewPost({
            textContent: "",
            imageContent: "",
            userId: data
        })).then(() => swal({
            title: "Action with success!",
            text: "Your publication was created!",
            icon: "success"
        }))
    }

    const handleInput = (e) => {
        setNewPost({...newPost, [e.target.name]: e.target.value})
    }

    console.log(friendsPosts);

    return(
        <div className={styles.container}>
            <form className={styles.createPost} onSubmit={makePost}>
                <input className={styles.textInput} placeholder="What are you thinking?" value={newPost.textContent} name="textContent" onChange={handleInput}/>
                <div className={styles.postButton}>
                    <label className={styles.fileButton}>
                        <img className={styles.inputImage} src="https://www.svgrepo.com/show/376769/attachment.svg"/>
                        Select a Image
                        <input className={styles.file} type="file"/>
                    </label>
                    <button className={styles.ButtonForPost}><img className={styles.inputImage} src="https://www.svgrepo.com/show/377013/plus.svg"/>Post</button>
                </div>
            </form>
            {!isError ?
                friendsPosts.map(value => 
                        <Publications data={value}/>
                ):  <div>
                        <h3>Oops! Something goes wrong!</h3>
                        <p>{error.data}</p>
                    </div>
            }
            
        </div>
    )
}

export default Posts