import styles from "./styles.module.scss";
import { ActiveLink } from "../ActiveLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <div>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>
              <h2 className={styles.titulo}>Controle de Contas</h2>
            </a>
          </ActiveLink>
        </div>
        <nav className={styles.fill}>
          <div className={styles.menu}>
            <div></div>
            <div>
              <ActiveLink
                href="/"
                className={styles.dashboard}
                activeClassName={styles.activeDashboard}
              >
                <a>&lt;&lt; Dashboard &gt;&gt;</a>
              </ActiveLink>

              <ActiveLink href="/tipoconta" activeClassName={styles.active}>
                <a>Tipos de Conta</a>
              </ActiveLink>

              <ActiveLink href="/conta" activeClassName={styles.active}>
                <a>Contas</a>
              </ActiveLink>

              <ActiveLink href="/lancto" activeClassName={styles.active}>
                <a>Lançamentos</a>
              </ActiveLink>

              <ActiveLink href="/credito" activeClassName={styles.active}>
                <a>Manutenção de Crédito</a>
              </ActiveLink>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
