import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Assuming you have a CSS file for basic styling

function App() {
  let [res, setRes] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState(null);

  const validateJSON = (input) => {
    try {
      JSON.parse(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJSON(jsonInput)) {
      setJsonError('');
      try {
        res = await axios.post('https://bfhl-backend-n4zg.onrender.com/bfhl', JSON.parse(jsonInput));
        setResponse(res.data);
        setRes(res)
        console.log(res.data)
        // setFilteredResponse(res);
      } catch (error) {
        console.error('API call failed:', error);
      }
    } else {
      setJsonError('Invalid JSON format.');
    }
  };

  const handleFilter = (selectedOptions) => {
    console.log(selectedOptions);
    // console.log(res.filter(item => isNaN(item)));
    // if (!res) return;

    const filtered = [];
    if (selectedOptions.includes('Alphabets')) {
      filtered.push(...res.data.alphabets);
    }

    if (selectedOptions.includes('Numbers')) {
      filtered.push(...res.data.numbers);
    }

    if (selectedOptions.includes('Highest lowercase alphabet')) {
      const lowerAlphabets = res.data.highest_lowercase_alphabet;
      if (lowerAlphabets.length) {
        filtered.push(...lowerAlphabets);
      }
    }

    setFilteredResponse(filtered.join(', '));
  };
  
  const handleSelectChange = (e) => {
    if (selectedOptions.includes(e.target.value)){
      selectedOptions.splice(selectedOptions.indexOf(e.target.value),1);
      handleFilter(selectedOptions);
    }
    else{
      console.log("Added something");
      console.log(e.target.value);
      // const newse = 
      setSelectedOptions(selectedOptions => {
        const  newse = [...selectedOptions,e.target.value];
        return newse;
      });
      console.log("in functions");
      console.log(selectedOptions);
      handleFilter([...selectedOptions,e.target.value]);
    }
  };

  return (
    <div className="app-container">
      <h1>21BCE5560 - BFHL</h1>
      <div className="input-section">
        <label>API Input</label>
        <textarea
          className="json-input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"data":["M","1","334","4","B"]}'
        />
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        {jsonError && <p style={{ color: 'red' }}>{jsonError}</p>}
      </div>
      {response && (
        <div className="filter-section">
          <label>Multi Filter</label>
          <select
            className="multi-select"
            multiple
            value={selectedOptions}
            onClick={handleSelectChange}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          {/* <button className="filter-btn" onClick={()=>{handleFilter(res)}}>Filter</button> */}
        </div>
      )}
      {filteredResponse && (
        <div className="response-section">
          <h2>Filtered Response</h2>
          <p>{filteredResponse}</p>
        </div>
      )}
    </div>
  );
}

export default App;