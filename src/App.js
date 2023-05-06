import './App.css';
import {useState} from 'react'
import axios from 'axios'

function App() {

  const[sentimentText, setSentimentText ] = useState('')
  const[sentimentOutput, setSentimentOutput ] = useState('')
  const[confidenceScore, setConfidenceScore ] = useState('')


  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log(sentimentText)
    try {
      const response = await axios.get(`http://localhost:5000/${sentimentText}`)
      console.log(response.data)

      setSentimentOutput(response.data.sentiment)
      setConfidenceScore(response.data.score)
      console.log(sentimentOutput, confidenceScore)

    } 
    
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <div className='form-div' >
        <label>Enter your Text sentence for sentiment analysis</label>
        <textarea type='text' placeholder='Enter your Text!' className='textarea' onChange={e => setSentimentText(e.target.value)} />
        <input type='submit' onClick={handleSubmit}  />

      <div className='output-div'>
       <h4>Sentiment: {sentimentOutput}</h4>
       <h4>Confidence Score: {confidenceScore}</h4>
      </div>
    </div>
    </div>
  );
}

export default App;
