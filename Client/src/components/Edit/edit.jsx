import { useEffect, useState } from "react"
import styles from "./edit.module.css"
import swal from "sweetalert"
import { storage } from "@/utils/firebase"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import { v4 } from "uuid"

const Edit = () => {

    const [id, setId] = useState(null)

    useEffect(() => {
        setId(localStorage.getItem("id"))
    }, [])

    useEffect(() => {
        if(id && id !== null){
            getUserData()
        }
    }, [id])

    const getUserData = async () => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/users/${id}`)
        .then(response => response.json())
        .then(response => setProfile(response))
    }

    const [profile, setProfile] = useState({
        id: "",
        picture: "",
        backgroundPicture: "",
        coverPhoto: "",
        nickname: "",
        email: "",
        description: "",
    })

    const [images, setImages] = useState({
        picture: "",
        backgroundPicture: "",
        coverPhoto: ""
    })


    const uploadImage = (e) => {
        console.log(e.target.files[0]);
        const fileName = e.target.files[0].name.split(".")
        const imageRef = ref(storage, `profile/pictures/${fileName[0] + v4()}`)
        uploadBytes(imageRef, fileName).then(() => {
            setImages({...images, picture: getDownloadURL()})
        })
    }

    if(id === null){
        return <p>Loading...</p>
    }

    const handleInput = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        await fetch(`https://tukituki-backend-2f9e.onrender.com/users/`, {
            method: "PUT", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(profile),
        }).then(async() => {
            await swal({
                title: "User data updated!",
                text: "The data was updated with success!",
                icon: "success"
            }).then(() => window.location.href = `/home/${profile.nickname}`)
        }).catch(async() => {
            await swal({
                title: "Something goes wrong",
                text: "Verify your data or try it again later",
                icon: "error"
            })
        })
    }

    if(userData === null){
        return <p>Loading...</p>
    }

    return (
        <div className={styles.father}>
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.sections}>
                        Profile Photos
                        <label>
                            <p>Profile Picture</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} placeholder={userData.picture} type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} onChange={uploadImage} placeholder={userData.picture} type="file" />
                                </label>
                            </div>
                        </label>
                        <label>
                            <p>Background Picture</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} placeholder="Background picture" type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} placeholder="Background picture" type="file" />
                                </label>
                            </div>
                        </label>
                        <label>
                            <p>Cover Photo</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} placeholder="Cover Photo" type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} placeholder="Cover Photo" type="file" />
                                </label>
                            </div>
                        </label>
                    </label>
                    <label className={styles.sections}>
                        Profile Info
                        <label>
                            <p>Nickname</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} maxLength={13} onChange={handleInput} name="nickname" value={profile.nickname} placeholder={userData.nickname} type="text" />
                            </div>
                        </label>
                        <label>
                            <p>Email</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} onChange={handleInput} name="email" value={profile.email} placeholder={userData.email} type="text" />
                            </div>
                        </label>
                        <label>    
                            <p>Description</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} onChange={handleInput} name="description" value={profile.description} placeholder={userData.description === null ? "You dont have a description" : userData.description} type="text" />
                            </div>
                        </label>
                    </label>
                    <button className={styles.button}>Confirm</button>
                </form>
            </div>
            <div className={styles.profile}>
                <div className={styles.profileFront}>
                    <img className={styles.profilePicture} src={profile.picture}/>
                    <img className={styles.profileCover} src={profile.coverPhoto}/>
                    <div className={styles.profileData}>
                        <p className={styles.nickname}>{profile.nickname}</p>
                        <p className={styles.description}>{profile.description}</p>
                    </div>
                </div>
                <img className={styles.background} src={profile.backgroundPicture}/>
            </div>
        </div>
    )
}

export default Edit