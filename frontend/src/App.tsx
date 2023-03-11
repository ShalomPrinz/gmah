import { useEffect, useState } from 'react'
import './App.css'

import { getFamiliesCount } from './services'

function App() {
  const [familiesCount, isLoading] = useFamiliesCount()

  return (
    <>
      <h1>גמ"ח ישיבת קרית שמונה</h1>
      { isLoading && "טוען את מספר הנתמכים" }
      <h3>מספר נתמכים בגמ"ח: {familiesCount}</h3>
    </>
  )
}

function useFamiliesCount() {
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    setLoading(true)
    getFamiliesCount()
      .then(res => setCount(res.data.familiesCount))
      .catch(error => console.error("Error occurred while trying to get families count", error))
      .finally(() => setLoading(false))
  }, [])

  return [count, loading]
}

export default App
