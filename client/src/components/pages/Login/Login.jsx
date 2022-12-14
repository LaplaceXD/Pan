import { Navigate } from "react-router-dom";

import banner from "@assets/imgs/login_banner.jpg";
import logo from "@assets/Logo_128x128.svg";
import LoginForm from "@components/module/LoginForm";
import { useAuth } from "@hooks/auth";

import styles from "./Login.module.css";

function Login() {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/" />
  ) : (
    <main className={styles.container}>
      <img src={banner} alt="Bread." />

      <div className={styles.content}>
        <img src={logo} alt="Pan logo." />
        <p className={styles.subtitle}>Welcome back to Pan!</p>

        <LoginForm className={styles.form} />
      </div>
    </main>
  );
}

export default Login;
