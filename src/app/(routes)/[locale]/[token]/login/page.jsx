"use client";
import LoginService from "@/app/services/LoginService";
import style from "../../../../../../public/assets/css/module/admin/login.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import MainService from "@/app/services/MainService";

export default function LoginPage({ params }) {
  const router = useRouter();
  const { token } = params;

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(null); // null: loading, true: valid, false: invalid

  useEffect(() => {
    MainService.checkMagicLink(token)
      .then((response) => {
        if (response.data.status.code === 200) {
          console.log(response.data.status.code)
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      })
      .catch((error) => {
        console.log("Error checking token:", error);
        setIsValid(false);
      });
  }, [token]);

  // Token geçersiz ise yönlendir
  useEffect(() => {
    if (isValid === false) {
      router.push("/404");
    }
  }, [isValid, router]);

  const validate = () => {
    let newErrors = {};
    if (!userName.trim()) newErrors.userName = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const reqAuth = { userName, password };

    LoginService.login(reqAuth)
      .then((response) => {
        if (response.data.status.code === 200) {
          const jwtToken = response.data.httpHeaders?.Authorization?.[0]?.replace("Bearer ", "");
          if (jwtToken) {
            Cookies.set("Authorization", jwtToken, {
              expires: 1,       
              secure: false,
              sameSite: "strict",
            });
          }
          router.push(`/az/${token}/admin`);
        } else if (response.data.status.code === 404) {
          setErrorMessage("User not found");
        } else if (response.data.status.code === 405) {
          setErrorMessage("Wrong username or password");
        } else {
          setErrorMessage("Invalid Error");
        }
      })
      .catch((error) => {
        console.log("something went wrong-", error);
        setErrorMessage("Server error");
      });
  };

  const isFormValid = userName.trim() && password.trim() && password.length >= 6;

  if (isValid === null) {
    return <p>Loading...</p>;
  }

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h2 className={style.title}>Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={style.input}
        />
        {errors.userName && <p className={style.error}>{errors.userName}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={style.input}
        />
        {errors.password && <p className={style.error}>{errors.password}</p>}

        <button type="submit" className={style.button} disabled={!isFormValid}>
          Sign In
        </button>

        {errorMessage && <p className={style.error}>{errorMessage}</p>}
      </form>
    </div>
  )
}
