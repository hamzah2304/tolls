import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../Navbar.css";

export default function Navbar() {
  return (
    <nav class="navbar">
      <a href="http:localhost:3000/" target={"_blank"}>
        <h2 class="navtitle">Tolls</h2>
        {/* <img className={styles.alchemy_logo} src="/cw3d-logo.png"></img> */}
      </a>
      <ConnectButton></ConnectButton>
    </nav>
  );
}
