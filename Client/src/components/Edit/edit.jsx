import { useEffect, useState } from "react"
import styles from "./edit.module.css"
import swal from "sweetalert"
import { storage } from "@/utils/firebase"
import {ref, uploadBytes, getDownloadURL } from "firebase/storage"
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

    const [profile, setProfile] = useState(null)

    const [images, setImages] = useState(null)

    useEffect(() => {
        if(profile && images === null){
            setImages({
                picture: profile?.picture,
                backgroundPicture: profile?.backgroundPicture,
                coverPhoto: profile?.coverPhoto
            })
        }
    }, [profile])


    const uploadImage = async (e) => {
        console.log(e.target.files[0]);
        const fileName = e.target.files[0]
        const imageRef = ref(storage, `profile/${e.target.name}/${fileName.name + v4()}`)
        await uploadBytes(imageRef, fileName).then(async (snapshot) => {
            await getDownloadURL(snapshot.ref).then(response => setImages({...images, [e.target.name]: response}))
        })
    }

    if(id === null){
        return <p>Loading...</p>
    }

    const handleInput = (e) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    const handleImage = (e) => {
        setImages({...images, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        const allTheData = {
            id: id,
            nickname: profile.nickname,
            email:  profile.email,
            description: profile.description,
            picture: images.picture,
            backgroundPicture: images.backgroundPicture,
            coverPhoto: images.coverPhoto
        }
        await fetch(`https://tukituki-backend-2f9e.onrender.com/users/`, {
            method: "PUT", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(allTheData),
        }).then(async() => {
            localStorage.setItem("email", profile.email)
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

    console.log("SOY LAS IMAGENES",images);

    if(profile === null){
        return <p>Loading...</p>
    }

    if(images === null){
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
                                <input className={styles.input} name="picture" onChange={handleImage} placeholder={profile.picture} type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} name="picture" onChange={uploadImage} placeholder={profile.picture} type="file" />
                                </label>
                            </div>
                        </label>
                        <label>
                            <p>Background Picture</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} name="backgroundPicture" onChange={handleImage} placeholder={profile.backgroundPicture} type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} name="backgroundPicture" onChange={uploadImage} placeholder="Background picture" type="file" />
                                </label>
                            </div>
                        </label>
                        <label>
                            <p>Cover Photo</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} name="coverPhoto" onChange={handleImage} placeholder={profile.coverPhoto} type="text" />
                                <label className={styles.imagesFiles}>
                                    Select a file
                                    <input className={styles.fileInput} name="coverPhoto" onChange={uploadImage} placeholder="Cover Photo" type="file" />
                                </label>
                            </div>
                        </label>
                    </label>
                    <label className={styles.sections}>
                        Profile Info
                        <label>
                            <p>Nickname</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} maxLength={13} onChange={handleInput} name="nickname" value={profile.nickname} placeholder={profile.nickname} type="text" />
                            </div>
                        </label>
                        <label>
                            <p>Email</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} onChange={handleInput} name="email" value={profile.email} placeholder={profile.email} type="text" />
                            </div>
                        </label>
                        <label>    
                            <p>Description</p>
                            <div className={styles.allInputs}>
                                <input className={styles.input} onChange={handleInput} name="description" value={profile.description} placeholder={profile.description === null ? "You dont have a description" : profile.description} type="text" />
                            </div>
                        </label>
                    </label>
                    <button className={styles.button} type="submit">Confirm</button>
                </form>
            </div>
            <div className={styles.profile}>
                <div className={styles.profileFront}>
                    <img className={styles.profilePicture} src={images.picture}/>
                    <img className={styles.profileCover} src={images.coverPhoto}/>
                    <div className={styles.profileData}>
                        <p className={styles.nickname}>{profile.nickname}</p>
                        <p className={styles.description}>{profile.description}</p>
                    </div>
                </div>
                <img className={styles.background} src={images.backgroundPicture}/>
            </div>
        </div>
    )
}

export default Edit