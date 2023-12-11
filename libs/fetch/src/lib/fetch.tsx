import styles from './fetch.module.css'

/* eslint-disable-next-line */
export interface FetchProps {}

export function Fetch(props: FetchProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Fetch!</h1>
    </div>
  )
}

export default Fetch
