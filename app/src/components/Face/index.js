import styles from "./styles.module.scss";

export default function Face() {
  return (
    <span
      className={styles.facelet}
      data-tooltip-id="atualizarTip"
      data-tooltip-content="Hello world!"
      data-tooltip-place="top"
    >
      ◕‿‿◕
    </span>
  );
}
