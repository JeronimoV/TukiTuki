"use client"

const { useEffect } = require("react")
const { useState } = require("react")

const MyReactions = () => {

    const [allReactions, setAllReactions] = useState(null)

    const [userId, setUserId] = useState(null)

    const getReactions = async (id) => {
        await fetch(`https://tukituki-backend-2f9e.onrender.com/users/myfavorites/${id}`)
        .then(response => response.json())
        .then(response => setAllReactions(response))
    }

    useEffect(() => {
        let actualId = localStorage.getItem("id")
        if(actualId){
            setUserId(actualId)
        }
    }, [])

    useEffect(() => {
        if(userId){
            getReactions(userId)
        }
    }, [userId])

    if(!userId){
        return <p>Loading...</p>
    }

    console.log(allReactions);

    return(
        <div>
            <div>
                <h3>Likes</h3>

            </div>
            <div>
                <h3>Dislikes</h3>

            </div>
            <div>
                <h3>Favorites</h3>

            </div>

        </div>
    )
}

export default MyReactions