import styles from './styles.module.scss';
import { ActiveLink } from '../ActiveLink';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <ActiveLink href="/" activeClassName={styles.active}>
                    <a>
                        <h2>Controle de Contas</h2>
                    </a>
                </ActiveLink>
                <nav>
                    <ActiveLink href="/tipoconta" activeClassName={styles.active}>
                        <a>Tipos de Contas</a>
                    </ActiveLink>

                    <ActiveLink href="/conta" activeClassName={styles.active}>
                        <a>Contas</a>
                    </ActiveLink>

                    <ActiveLink href="/lancto" activeClassName={styles.active}>
                        <a>Lançamentos</a>
                    </ActiveLink>
                </nav>
            </div>
        </header>
    );
}