import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import styles from "./SocialAuth.module.css";



export default function SocialAuth() {
  return (
    <div className={styles.container}>
      <div className={styles.buttons}>
        <button className={styles.btn}>
          <FcGoogle className={styles.icon} />
  
        </button>

        <button className={styles.btn}>
          <FaApple className={styles.icon} />
         
        </button>
      </div>
    </div>
  );
}
