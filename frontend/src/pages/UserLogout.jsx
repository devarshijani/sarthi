import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const userLogout = () => {

    const token = localStorage.getItem("userToken");
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status === 200){
            localStorage.removeItem("userToken");
            navigate("/login");
        }
    })

  return (
    <div>
      userlogout
    </div>
  )
}

export default userLogout
