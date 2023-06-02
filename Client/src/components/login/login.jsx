"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";
import swal from 'sweetalert';
import styles from "./landing.module.css"
import {useCreateUserMutation, useLoginUserMutation} from "../../globalRedux/features/querys/usersQuery"

const Login = () => {

    const router = useRouter()

    const [registerPanel, setRegisterPanel] = useState(false)

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })

    const [RegisterData, setRegisterData] = useState({
        email: "",
        password: "",
        age: 0
    })

    const [startLogin, setStartLogin] = useState(false)

    const [createUser] = useCreateUserMutation()
    const [loginUser] = useLoginUserMutation()

    const handleInput = (e) => {
        setLoginData({...loginData, [e.target.name]:e.target.value})
    }

    const handleInputRegister = (e) => {
        setRegisterData({...RegisterData, [e.target.name]: e.target.value})
    }

    const changeView = () => {
        if(registerPanel){
            setRegisterPanel(false)
        }else{
            setRegisterPanel(true)
        }
    }

    const onSubmitLogin = async(e) => {
        window.localStorage.clear()
        e.preventDefault()
        const loginResult = await loginUser({
            email: loginData.email,
            password: loginData.password
        })
        if(loginResult.error){
            await swal({
                title: "Something goes wrong",
                text: loginResult.error.data,
                icon: "error",
                dangerMode: true
            })
        }else{
            window.localStorage.setItem("email", loginData.email)
            const success = await swal({
                title: "Welcome to TukiTuki!",
                text: loginResult.data,
                icon: "success"
            })
            if(success){
                router.push("/home")
            }
        }
    }

    const onSubmitRegister = async (e) => {
        window.localStorage.clear()
        e.preventDefault()
        const registerResult = await createUser({
            email: RegisterData.email,
            password: RegisterData.password,
            age: RegisterData.age,
        })
        if(registerResult.error){
            await swal({
                title: "Something goes wrong",
                text: registerResult.error.data,
                icon: "error",
                dangerMode: true
            })
        }else{
            window.localStorage.setItem("email", RegisterData.email)
            const success = await swal({
                title: "Welcome to TukiTuki!",
                text: registerResult.data,
                icon: "success"
            })
            if(success){
                router.push("/home")
            }
        }
    }

    const startLoginFunction = () => {
        setStartLogin(true)
    }

    return(
        <div className={styles.back}>
            {!startLogin ? 
            <div className={styles.containerNoLogin}>
                <h3>Welcome to</h3>
                <h1>TukiTuki</h1>
                <p>Login or Register to start.</p>
                <button onClick={startLoginFunction}>Enter</button>
            </div>
            :
            <div className={styles.container}>
                <img src="/family.jpg"/>
                {registerPanel ? (
                    <div className={styles.formDiv}>
                        <h1>Register</h1>
                        <form onSubmit={onSubmitRegister}>
                            <input name="email" className={styles.input} value={RegisterData.email} onChange={handleInputRegister} placeholder="Email"/>
                            <input name="password" className={styles.input} value={RegisterData.password} onChange={handleInputRegister} placeholder="Password" type="password"></input>
                            <input name="age" type="number" className={styles.input} value={RegisterData.age} onChange={handleInputRegister} placeholder="age"/>
                            <button className={styles.login}>Register</button>
                        </form>
                            <button onClick={changeView} className={styles.registerButton}>I have an account</button>
                    </div>
                ) :
                <div className={styles.formDiv}>
                    <h1>Sign In</h1>
                    <form onSubmit={onSubmitLogin}>
                        <input name="email" className={styles.input} value={loginData.email} onChange={handleInput} placeholder="Email"/>
                        <input name="password" className={styles.input} value={loginData.password} onChange={handleInput} placeholder="Password" type="password"></input>
                        <div>
                            <input type="checkbox"/>
                            <label>Remember me</label>
                        </div>
                        <button className={styles.login}>Log In</button>
                    </form>
                        <button onClick={changeView} className={styles.registerButton}>I don´t have an account</button>
                </div>}
            </div>}
            <div className={styles.videoDiv}>
                <video className={styles.video} src="/family.mp4" autoPlay loop muted/>
            </div>
        </div>
    )
}

export default Login