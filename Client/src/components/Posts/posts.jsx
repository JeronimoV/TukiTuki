import Publications from "../Publications/publications"
import { useGetFriendsPostsQuery } from "@/globalRedux/features/querys/postsQuery"
import styles from "./posts.module.css"
import { useEffect, useState } from "react"
import swal from "sweetalert"
import { storage } from "@/utils/firebase"
import {ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from "uuid"

const Posts = ({data}) => {

    const [newPost, setNewPost] = useState({
        textContent: "",
        imageContent: "",
        userId: data
    })

    const [images, setImages] = useState("")

    const [friendsPosts, setFriendsPosts] = useState(null)

    const getPosts = async () => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/posts/friends/${data}`).then(response => response.json()).then(response => setFriendsPosts(response))
    }

    useEffect(() => {
        if(data){
            getPosts()
        }
    }, [data])

    console.log(images);

    const makePost = async (e) => {
        e.preventDefault()
        await fetch(`https://tukituki-backend-2f9e.onrender.com/posts`, {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                textContent: newPost.textContent,
                imageContent: images,
                userId: newPost.userId
            }),
        }).then(() => setNewPost({
            textContent: "",
            imageContent: "",
            userId: data
        }))
        .then(() => setImages(""))
        .then(() => swal({
            title: "Action with success!",
            text: "Your publication was created!",
            icon: "success"
        }))
    }

    const handleInput = (e) => {
        setNewPost({...newPost, [e.target.name]: e.target.value})
    }

    const uploadImage = async (e) => {
        const fileName = e.target.files[0]
        const imageRef = ref(storage, `posts/${fileName.name + v4()}`)
        await uploadBytes(imageRef, fileName).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(response => setImages(response))
        })
    }

    const deleteImage = () => {
        setImages("")
    }

    console.log(friendsPosts);

    return(
        <div className={styles.container}>
            <form className={styles.createPost} onSubmit={makePost}>
                <input className={styles.textInput} placeholder="What are you thinking?" value={newPost.textContent} name="textContent" onChange={handleInput}/>
                {images !== "" ? <div className={styles.imageContainer}><p className={styles.closeImage} onClick={deleteImage}>X</p><img className={styles.postImage} src={images}/></div> : null}
                <div className={styles.postButton}>
                    <label className={styles.fileButton}>
                        <img className={styles.inputImage} src="https://www.svgrepo.com/show/376769/attachment.svg"/>
                        Select a Image
                        <input onChange={uploadImage} className={styles.file} type="file"/>
                    </label>
                    <button className={styles.ButtonForPost}><img className={styles.inputImage} src="https://www.svgrepo.com/show/377013/plus.svg"/>Post</button>
                </div>
            </form>
            {friendsPosts && friendsPosts.length > 0 ?
                friendsPosts.map(value => 
                        <Publications data={value}/>
                ):  <div>
                        <h3 className={styles.errorTitle}>Oops! Something goes wrong!</h3>
                    </div>
            }
            
        </div>
    )
}

export default Posts