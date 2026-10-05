import styles from "@/styles/Settings.module.scss";

export default function OfflineFallback() {
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logo.svg" alt="logo" />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.errorData}>
        <h1>503</h1>
        <p>No Internet</p>
      </div>
    </div>
  );
}
