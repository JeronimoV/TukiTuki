"use client"

import styles from "./navBar.module.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserSearchResult from "../userSearch/userSearchCard";
import FriendRequestCard from "../friendRequestCard/friendRequestCard";

const NavBar = () => {

  const [email, setEmail] = useState(null)

  const [id, setId] = useState(null)

  const [userdata, setUserdata] = useState(null)

  const [searchInfo, setSearchInfo] = useState(null)

  const [searchResults, setSearchResults] = useState(null)

  const [allNotifications, setAllNotifications] = useState(null)

  const getUserData = async () => {
      await fetch(`https://tukituki-backend-2f9e.onrender.com/users/id/${email}`)
      .then(response => response.json())
      .then(response => {
          setId(response.dataToSend.id)
          setUserdata(response.dataToSend)
      })
  }

  useEffect(() => {
    setEmail(localStorage.getItem("email"))
  },[])

  useEffect(() => {
    if(email){
      getUserData()
    }
  },[email])

  useEffect(() => {
    if (id){
      getNotifications()
    }
  }, [id])

  const path = usePathname();

  const searchUser = async (e) => {
    e.preventDefault()
    await fetch(`https://tukituki-backend-2f9e.onrender.com/users/search/${searchInfo}`)
    .then(response => response.json())
    .then(response => setSearchResults(response))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchInfo(e.target.value)
  }

  const closeResults = () => {
    setSearchResults(null)
  }

  const getNotifications = async () => {
    await fetch(`https://tukituki-backend-2f9e.onrender.com/friends/request/${id}`)
    .then(response => response.json())
    .then(response => setAllNotifications(response))
  }

  if (path !== "/login") {
    if(userdata === null){
      return(
        <p>Loading...</p>
      )
    }
    return (
      <div className={styles.menu}>
        <div className={styles.container}>
          <Link className={styles.link} href="/home"><h3>TukiTuki</h3></Link>
          <form onSubmit={searchUser} className={styles.searchBarContainer}>
            <input onChange={handleSearch} value={searchInfo} placeholder="Search user on TukiTuki" className={styles.searchBar}/>
            <button>Search</button>
          </form>
          <div className={styles.profile}>
            <div className={styles.buttonMenu}>
              <img src={userdata?.picture} />
              <p className={styles.nickname}>{userdata.nickname}</p>
            </div>
            <div className={styles.hiddenMenu}>
              <Link className={styles.link} href={`home/${userdata.nickname}`}>
                <div>
                    <img src="https://www.svgrepo.com/show/377111/user.svg" />
                    <p>Profile</p>
                </div>
              </Link>
                <div>
                    <img src="https://www.svgrepo.com/show/377056/settings-cog.svg"/>
                    <p>Configuration</p>
                </div>
                <div>
                    <img src="https://www.svgrepo.com/show/377013/plus.svg"/>
                    <p>Make a post</p>
                </div>
                <div>
                    <img src="https://www.svgrepo.com/show/376950/logout.svg"/>
                    <p>LogOut</p>
                </div>
            </div>
          </div>
            <div className={styles.notification}>
              <div className={styles.header}>
                <p className={styles.notificationTitle}>Notifications</p>
                <img className={styles.notificationImage} src="https://www.svgrepo.com/show/376783/bell.svg"/>
              </div>
              <div className={styles.hiddenMenuNotification}>
                {Array.isArray(allNotifications) && allNotifications && allNotifications.length > 0 && allNotifications !== null ?
                  allNotifications.map((value) => 
                    <FriendRequestCard data={value} id={id}/>
                  )
                  : null
                }
                </div>
            </div>
        </div>
        {
          searchResults !== null ?
            <div className={styles.results}>
              <h3 className={styles.resultsTitle}>Results for {searchInfo}</h3>
              {searchResults !== null ? 
                searchResults.map(value => <Link className={styles.profileSend} href={`/home/${value.nickname}`}><UserSearchResult data={value} id={id}/></Link>)
              : null}
              <button className={styles.closeButton} onClick={closeResults}>X</button>
            </div> : null
        }
      </div>
    );
  }
};

export default NavBar;
