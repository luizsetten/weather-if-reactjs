import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export function UserDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    sessionStorage.removeItem("@weatherData/userToken");
    navigate("/");
  }

  async function verifyUser() {
    const token = sessionStorage.getItem("@weatherData/userToken");

    if (!token) {
      navigate("/");
    }

    // const isValid = await api.post("/users/verifyToken", { token });
    // if (!isValid) handleLogout();
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      <div>User dashboard</div>
    </>
  );
}
