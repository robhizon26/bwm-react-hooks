
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import CounterView from './CounterView';
import './CounterApp.css';

// set is object that keeps only unique data
const functions = new Set();

const CounterApp = (props) => {
  const [count, setCount] = useState(0);
  const [whatever, setWhatever] = useState(10); 

  const { title } = props;

  useEffect(() => {
    console.log('Calling USE EFFECT');
  }, [])

  const increment = useCallback((step) => () => setCount(count + step), [count])
  const doWhatever = useCallback(() => setWhatever(whatever + 1), [whatever])
  
  functions.add(increment);
  functions.add(doWhatever);
  
  return (
    <div>
      <div className="counter-app">
        <h1>{title}</h1>
        <CounterView 
          countValue={count} 
          handleIncrement={increment}
        />
        <button onClick={doWhatever}>Do whatever</button>
        <h1>Functions: {functions.size}</h1>
      </div>
    </div>
  )
}

CounterApp.propTypes = {
  title: PropTypes.string.isRequired
}

export default CounterApp;


