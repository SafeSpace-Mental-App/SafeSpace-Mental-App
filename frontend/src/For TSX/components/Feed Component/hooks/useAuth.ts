import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";

export const useAuth = () => {
  const navigate = useNavigate();
  //FOR USERNAME
  const currentUsername = (() => {
    const stored = localStorage.getItem("username");
    return stored && stored.trim() && stored !== "null"
      ? stored.trim()
      : "Anonymous";
  })();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "null") {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  }, []);

  useEffect(() => {
    const handler = () => window.location.reload();
    window.addEventListener("userLoggedIn", handler);
    return () => window.removeEventListener("userLoggedIn", handler);
  }, []);

  //TO CHECK IF YOU HAVE ACCOUNT OTHERWISE SIGN UP
  const checkAuth = (action: () => void) => {
    const token = localStorage.getItem("token");
    if (!token || token === "null") {
      alert("Please sign in to post.");
      navigate("/signin");
    } else {
      action();
    }
  };

  // FOR ERROR MESSAGE
  const handle401 = (err: any, message?: string) => {
    if (err?.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (!token || token === "null") {
        if (message) alert(message);
        navigate("/signin");
      }
      return true;
    }
    return false;
  };

  return { currentUsername, checkAuth, handle401 };
};
