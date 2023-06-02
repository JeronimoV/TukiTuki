import Comments from "../Comments/comments"
import Image from "next/image"
import styles from "./publications.module.css"
import { useGetUserWithIdQuery } from "@/globalRedux/features/querys/usersQuery"
import { useEffect, useState } from "react"
import swal from "sweetalert"

const Publications = ({data}) => {

    console.log("SOY ESTEEEEEEEEEEEEEE",data);

    const id = localStorage.getItem("id")

    const {data: userData, isLoading, isError} = useGetUserWithIdQuery(data.UserId)

    const [reactions, setReactions] = useState(null)
    const [reactionsAmount, setReactionsAmount] = useState({
        like: 0,
        dislike: 0
    })
    const [isFavorite, setIsFavorite] = useState(false)
    const [allComments, setAllComments] = useState([])
    const [newComment, setNewComment] = useState({
        userId: id, 
        postId: data.id, 
        textContent: "", 
        imageContent: ""
    })
    const [commentPage, setCommentPage] = useState(0)
    const [showComments, setShowComments] = useState(false)

    const reactionsHandler = () =>{
        const Like = []
        const Dislike = []
        data.Reactions.map(value => {value.reaction === "Like" ? Like.push(value.reaction) : Dislike.push(value.reaction); value.UserId === id ? setReactions(value.reaction) : null})
        setReactionsAmount({like: Like.length, dislike: Dislike.length})
        const favoriteSearch =  data.Favorites.find(value => value.UserId === id)
        if(favoriteSearch){
            setIsFavorite(true)
        }else{
            setIsFavorite(false)
        }
    }

    const getComments = async () => {
        if(data){
            await fetch("https://tukituki-backend-2f9e.onrender.com/comments/get", {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({postId: data.id, page: commentPage}),
            }).then(response => response.json()).then(response => {
                if(allComments.length === 0){
                    setAllComments(response)
                }else{
                    const oldComments = [...allComments]
                    const newCommentsArray = oldComments.concat(response)
                    setAllComments(newCommentsArray)
                }
            })
        }
    }

    const getMoreComments = () => {
        setCommentPage(commentPage + 1)
    }

    useEffect(() => {
        if(data && data.Reactions){
            reactionsHandler()
        }
        if(commentPage !== 0){
            getComments()
        }
    }, [data, data.Reactions, commentPage])

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

    //<p>💜</p>
    //<p>🤍</p>

    const addReaction = async (reaction) => {
        if(reaction === reactions){
            setReactions(null)
            if(reaction === "Like"){
                setReactionsAmount({...reactionsAmount, like: reactionsAmount.like - 1})
            }else{
                setReactionsAmount({...reactionsAmount, dislike: reactionsAmount.dislike - 1})
            }
        }else{
            setReactions(reaction)
            if(reaction === "Like"){
                reactionsAmount.dislike > 0 ?
                setReactionsAmount({...reactionsAmount, like: reactionsAmount.like + 1, dislike: reactionsAmount.dislike - 1})
                : setReactionsAmount({...reactionsAmount, like: reactionsAmount.like + 1})
            }else{
                reactionsAmount.like > 0 ?
                setReactionsAmount({...reactionsAmount, dislike: reactionsAmount.dislike + 1 , like: reactionsAmount.like - 1})
                : setReactionsAmount({...reactionsAmount, dislike: reactionsAmount.dislike + 1})
            }
        }
        await fetch("https://tukituki-backend-2f9e.onrender.com/reactions/", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: id, postId: data.id, reaction: reaction}),
        })
    }

    const createComment = async (e) => {
        e.preventDefault()
        if(data)
        await fetch("https://tukituki-backend-2f9e.onrender.com/comments/", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: newComment.userId, postId:newComment.postId, textContent:newComment.textContent, imageContent:newComment.imageContent}),
        }).then(() => swal({
            title: "Action Completed!",
            text: "Comment was posted!",
            icon: "success"
        })).then(() => {
            const oldComments = [...allComments]
            oldComments.unshift(newComment)
            setAllComments(oldComments)
        }).then(() => {
            setNewComment({
                userId: id, 
                postId: data.id, 
                textContent: "", 
                imageContent: ""
            })
        })
        
    }

    const handlerNewComment = (e) => {
        setNewComment({...newComment, [e.target.name]: e.target.value})
    }

    const addFavorite = async () => {
        if(isFavorite === true){
            setIsFavorite(false)
        }else{
            setIsFavorite(true)
        }
        await fetch("https://tukituki-backend-2f9e.onrender.com/favorites/", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId: id, postId: data.id}),
        })
    }

    const commentsStatus = () => {
        if(showComments){
            setShowComments(false)
        }else{
            setShowComments(true)
            if(data && data.UserId){
                getComments()
            }
        }
    }

    if(!allComments){
        return <p>Loading...</p>
    }


    return(
        <div className={styles.container}>
            <div className={styles.header}>
                <img className={styles.userImage} src={userData.picture}/>
                <h2>{userData.nickname}</h2>
            </div>
            {data.textContent ? 
            <div className={styles.content}>
                <p>{data.textContent}</p>
            </div> : null}
            {data.imageContent ? <Image className={styles.image} src={data.imageContent} width={468} height={346} priority quality={100}/>: null}
            <div className={styles.reactions}>
                {reactions === null ? 
                <div className={styles.like}>
                    <div>
                        <p onClick={() => addReaction("Like")} name="Like">🤍</p>
                        <p>{reactionsAmount.like}</p>
                    </div>
                    <div>
                        <img className={styles.dislike} src="https://www.svgrepo.com/show/503044/like.svg" onClick={() => addReaction("Dislike")} name="Dislike"/>
                        <p>{reactionsAmount.dislike}</p>
                    </div>
                </div> : 
                reactions === "Like" ? 
                <div className={styles.like}>
                    <div className={styles.alignLogos}>
                        <p onClick={() => addReaction("Like")} name="Like">💜</p>
                        <p>{reactionsAmount.like}</p>
                    </div>
                    <div className={styles.alignLogos}>
                        <img className={styles.dislike} src="https://www.svgrepo.com/show/503044/like.svg" onClick={() => addReaction("Dislike")} name="Dislike"/>
                        <p>{reactionsAmount.dislike}</p>
                    </div>
                </div> : 
                <div className={styles.like}>
                    <div className={styles.alignLogos}>
                        <p onClick={() => addReaction("Like")} name="Like">🤍</p>
                        <p>{reactionsAmount.like}</p>
                    </div>
                    <div className={styles.alignLogos}>
                        <p onClick={() => addReaction("Dislike")} name="Dislike">👎</p>
                        <p>{reactionsAmount.dislike}</p>
                    </div>
                </div>}
                <div onClick={addFavorite}>
                    {
                        isFavorite ? <div className={styles.alignLogos}><p className={styles.logo}>⭐</p><p>Favorito</p></div>
                        :
                    <div className={styles.alignLogos}>
                        <img className={styles.logo} src={"https://www.svgrepo.com/show/514252/star.svg"} />
                        <p>Favorito</p>
                    </div>}
                </div>
                <div className={styles.alignLogos}>
                    <img className={styles.logo} src={"https://www.svgrepo.com/show/377059/share.svg"}/>
                    <p>Compartir</p>
                </div>
                <div className={styles.alignLogos}>
                    <img className={styles.logo} src={"https://www.svgrepo.com/show/376810/chat.svg"} />
                    <p>Comentarios</p>
                </div>
            </div>
            {showComments ? <div className={styles.commentActionButtonDiv}><button className={styles.commentActionButton} onClick={commentsStatus}>Hide comments</button></div> : <div className={styles.commentActionButtonDiv}><button className={styles.commentActionButton} onClick={commentsStatus}>Show comments</button></div>}
            {showComments ? (
                <div>
                    <form onSubmit={createComment} className={styles.createComment}>
                        <input placeholder="What are you thinking about that?" className={styles.commentText} name="textContent" value={newComment.textContent} onChange={handlerNewComment} type="text"/>
                        <div className={styles.buttonsContainer}>
                            <label className={styles.inputFileComment}>
                                <img className={styles.inputCommentImage} src="https://www.svgrepo.com/show/376769/attachment.svg"/>
                                Select a Image
                                <input type="file"/>
                            </label>
                            <button className={styles.commentButton} type="submit">Comment</button>
                        </div>
                    </form>
                    <div className={styles.commentsContainer}>
                        {allComments && allComments.length > 0 ? 
                            allComments.map(value => <Comments data={value}/>)
                            : <p>This post doesnt have comments. Be the first!</p>
                        }
                    </div>
                    <div className={styles.commentActionButtonDiv}>
                        <button onClick={getMoreComments} className={styles.commentActionButton}>More comments</button>
                        <button className={styles.commentActionButton} onClick={commentsStatus}>Hide comments</button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default Publications