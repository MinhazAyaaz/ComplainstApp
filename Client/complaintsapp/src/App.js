import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";

function App() {

  const [backendData, setBackEndData] = useState([{}])

  useEffect(()=>{
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackEndData(data)
      }
    )
  }, [])

  return (
    <div className="App">
        {(typeof backendData.users === 'undefined') ? (
          <p>Loading...</p>
        ) : (
          backendData.users.map((user, i) => (
            <p key={i}>{user}</p>
          ))
        )}
    </div>
  );
}

export default App;
