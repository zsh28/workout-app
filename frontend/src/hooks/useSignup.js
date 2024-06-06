import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    console.log("Response JSON:", json);

    if (!response.ok) {
      setError(json.message);
      setIsLoading(false);
      return;
    }

    if (response.ok) {
      //save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));
      //update auth context
      dispatch({ type: "LOGIN", payload: json });
      setSuccess("Signup successful!");
      setIsLoading(false);
    }
  };
  return { error, isLoading, signup, success };
};
