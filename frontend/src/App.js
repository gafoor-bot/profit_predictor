import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [inputs, setInputs] = useState({
    rdSpend: '',
    administration: '',
    marketingSpend: ''
  });
  const [errors, setErrors] = useState({
    rdSpend: '',
    administration: '',
    marketingSpend: ''
  });
  const [profit, setProfit] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);

    // Update input value
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate value
    if (value === '') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    } else if (isNaN(numValue)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Please enter a valid number'
      }));
    } else if (numValue <= 5000) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Value must be greater than 5000'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there are any validation errors
    if (Object.values(errors).some(error => error !== '')) {
      setError('Please fix the validation errors before submitting');
      return;
    }

    setError(null);
    setProfit(null);
    setIsLoading(true);

    const data = {
      rd_spend: parseFloat(inputs.rdSpend),
      administration: parseFloat(inputs.administration),
      marketing_spend: parseFloat(inputs.marketingSpend)
    };

    try {
      const response = await axios.post('http://localhost:3001/predict', data);
      setProfit(response.data.predicted_profit);
    } catch (err) {
      setError('Error predicting profit. Make sure backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="overlay"></div>
      <div className="card">
        <h1>Company Profit Prediction</h1>
        <p className="subtitle">Leverage the power of machine learning to forecast your company's financial future</p>
        
        <div className="info-section">
          <h2>Welcome to the Future of Business Planning</h2>
          <p>
            In today's competitive business landscape, making informed decisions about resource allocation is crucial for success. 
            Our advanced machine learning model analyzes your company's spending patterns across three critical areas to provide 
            accurate profit predictions.
          </p>
          <p>
            By inputting your Research & Development investments, Administrative costs, and Marketing expenditures, our system 
            processes this data through a sophisticated algorithm trained on successful business patterns. This powerful tool 
            helps you understand the potential return on your investments and guides you in making data-driven decisions for 
            your company's growth.
          </p>
        </div>

        <div className="test-section">
          <h2>Experience the Power of Prediction</h2>
          <p>
            Ready to see how it works? Try our prediction tool with these sample values that represent typical business 
            spending patterns. Simply enter these numbers or input your own company's data to get an instant profit prediction.
          </p>
          <div className="sample-values">
            <p>Sample Test Values:</p>
            <p>R&D Spend: 6500.0</p>
            <p>Administration: 7500.0</p>
            <p>Marketing Spend: 8500.0</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label>
              R&D Spend
              <input
                type="text"
                inputMode="decimal"
                name="rdSpend"
                value={inputs.rdSpend}
                onChange={handleChange}
                placeholder="Enter R&D spending (must be greater than 5000)"
                required
                className={errors.rdSpend ? 'error' : ''}
              />
              {errors.rdSpend && <span className="error-message">{errors.rdSpend}</span>}
            </label>
          </div>

          <div className="input-group">
            <label>
              Administration
              <input
                type="text"
                inputMode="decimal"
                name="administration"
                value={inputs.administration}
                onChange={handleChange}
                placeholder="Enter administration costs (must be greater than 5000)"
                required
                className={errors.administration ? 'error' : ''}
              />
              {errors.administration && <span className="error-message">{errors.administration}</span>}
            </label>
          </div>

          <div className="input-group">
            <label>
              Marketing Spend
              <input
                type="text"
                inputMode="decimal"
                name="marketingSpend"
                value={inputs.marketingSpend}
                onChange={handleChange}
                placeholder="Enter marketing budget (must be greater than 5000)"
                required
                className={errors.marketingSpend ? 'error' : ''}
              />
              {errors.marketingSpend && <span className="error-message">{errors.marketingSpend}</span>}
            </label>
          </div>

          <button 
            type="submit" 
            className="predict-button"
            disabled={isLoading || Object.values(errors).some(error => error !== '')}
          >
            {isLoading ? 'Predicting...' : 'Predict Profit'}
          </button>
        </form>

        {profit !== null && (
          <div className="result success">
            <h2>Predicted Profit</h2>
            <p className="profit-amount">${profit.toFixed(2)}</p>
          </div>
        )}

        {error && (
          <div className="result error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
