import styles from "./forecast.module.css";

export default function Loading() {
  return <main className={styles.app}><div className={styles.main}><p className={styles.eyebrow}>PRONÓSTICOS GRANATES</p><h1>Calculando el camino del Pontevedra…</h1><p role="status">Consultamos los resultados y simulamos el calendario restante. La primera carga puede tardar unos segundos.</p></div></main>;
}
