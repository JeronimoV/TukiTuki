import {useGetUserWithEmailQuery, useGetUserWithIdQuery} from "../globalRedux/features/querys/usersQuery"

const getUserData = (email) => {

    const data = useGetUserWithEmailQuery(email)

    const {data: userData, isLoading} = useGetUserWithIdQuery(data?.data)

    if(isLoading){
        return "Loading"
    }

    const dataToSend = {
        email: userData?.email,
        nickname: userData?.nickname,
        id: userData?.id,
        picture: userData?.picture,
        accountAccess: userData?.accountAccess
    }

    return dataToSend
}

export default getUserData