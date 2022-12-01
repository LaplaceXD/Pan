import banner from "@assets/imgs/login_banner.jpg";
import logo from "@assets/Logo_128x128.svg";
import { Field, Submit } from "@components/common";

import styles from "./Login.module.css";

function Login() {
  return (
    <main className={styles.container}>
      <img src={banner} alt="Bread." />

      <div className={styles.content}>
        <img src={logo} alt="Pan logo." />
        <p className={styles.subtitle}>Welcome back to Pan!</p>

        <form className={styles.form} method="POST">
          <Field label="User ID:" type="text" id="user_id" name="user" />
          <Field label="Password:" type="password" id="password" name="pass" />

          <Submit label="Login" />
        </form>
      </div>
    </main>
  );
}

export default Login;
