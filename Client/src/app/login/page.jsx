import dynamic from "next/dynamic"
const Login = dynamic(() => import("../../components/login/login"), {ssr:false});

const SignIn = () => {
    return(
        <Login/>
    )
}

export default SignIn