import './index.css'
import { useEffect, useState } from 'react'

const Page = () => {
  const [queryHistory, setQueryHistory] = useState([]) 
  
  const fetchQueryHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/query_history`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id")
        })
      })
      
      const data = await response.json()
      setQueryHistory(data.message)

    } catch (error) {
      console.error("Error fetching query history:", error)
      setQueryHistory([]) 
    }
  }

  useEffect(() => {
    fetchQueryHistory()
  }, [])

  useEffect(() => {
    console.log("Query History State:", queryHistory)
  }, [queryHistory])

  return (
    <div className='query-history-container'>
      <h1>Query History</h1>
      {queryHistory.length > 0 ? (
        <table >
          <thead>
            <tr>
              <th>Modality</th>
              <th>Organ</th>
              <th>Disease</th>
              <th>Result</th>
              <th>Article</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {queryHistory && queryHistory.map((row, index) => (
              <tr key={index}>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[8]}</td>
                <td>{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No query history found.</p>
      )}
    </div>
  )
}

export default Page