"use client";
import styles from "./forecast.module.css";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className={styles.app}><div className={styles.main}><h1>No se ha podido cargar el cálculo.</h1><p>Inténtalo de nuevo en unos instantes. No se han modificado los resultados.</p><button className={styles.tableToggle} type="button" onClick={reset}>Volver a intentarlo</button></div></main>;
}
