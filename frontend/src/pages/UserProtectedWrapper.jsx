  import React, { useContext, useEffect } from "react";
  import { UserDataContext } from "../context/UserContext";
  import { useNavigate } from "react-router-dom";

  const UserProtectWrapper = ({ children }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserDataContext);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
      if (!token) {
        navigate("/login");
      }

      axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      });
      
    }, [token, navigate]);

    return <>{children}</>;
  };

  export default UserProtectWrapper;
