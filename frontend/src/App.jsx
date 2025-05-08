import React, { useState, useEffect } from 'react';
import TreeViewer from './components/TreeViewer';
import InputPanel from './components/InputPanel';
import ResultPath from './components/ResultPath';
import api from './api';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [pathResult, setPathResult] = useState(null);
  const [examples, setExamples] = useState(null);
  const [unreachableNodes, setUnreachableNodes] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch examples when component mounts
  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const exampleData = await api.getExamples();
        setExamples(exampleData);
      } catch (error) {
        setError('Failed to load examples: ' + error.message);
      }
    };

    fetchExamples();
  }, []);

  // Handle loading an example tree
  const handleLoadExample = async (exampleKey) => {
    try {
      if (examples && examples[exampleKey]) {
        setTreeData(examples[exampleKey]);
        
        // Reset other states
        setPathResult(null);
        setUnreachableNodes(null);
        setError(null);
        
        // Set some default input values based on the tree
        const defaultInputs = deriveDefaultInputs(examples[exampleKey]);
        setInputValues(defaultInputs);
      }
    } catch (error) {
      setError('Failed to load example: ' + error.message);
    }
  };

  // Derive some default inputs based on the tree structure
  const deriveDefaultInputs = (tree) => {
    const inputs = {};
    
    // Function to extract conditions and create sample inputs
    const extractConditions = (node) => {
      if (node.condition) {
        try {
          // Very simple extraction of variable names and values from conditions
          const matches = node.condition.match(/input\.(\w+)\s*([<>=!]+)\s*(\d+|'[^']*'|"[^"]*")/g);
          
          if (matches) {
            matches.forEach(match => {
              const parts = match.match(/input\.(\w+)\s*([<>=!]+)\s*(\d+|'[^']*'|"[^"]*")/);
              if (parts && parts.length >= 4) {
                const varName = parts[1];
                const operator = parts[2];
                let value = parts[3];
                
                // Convert string numbers to actual numbers
                if (/^\d+$/.test(value)) {
                  value = parseInt(value, 10);
                } else if (/^\d+\.\d+$/.test(value)) {
                  value = parseFloat(value);
                } else if (/^['"].*['"]$/.test(value)) {
                  // Remove quotes from string values
                  value = value.substring(1, value.length - 1);
                }
                
                // Set a default value based on the condition
                if (!inputs[varName]) {
                  if (operator.includes('>')) {
                    inputs[varName] = typeof value === 'number' ? value + 1 : value;
                  } else if (operator.includes('<')) {
                    inputs[varName] = typeof value === 'number' ? value - 1 : value;
                  } else {
                    inputs[varName] = value;
                  }
                }
              }
            });
          }
        } catch (e) {
          console.error("Error parsing condition:", e);
        }
      }
      
      // Process children recursively
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => extractConditions(child));
      }
    };
    
    if (tree && tree.root) {
      extractConditions(tree.root);
    }
    
    return inputs;
  };

  // Handle tree simulation
  const handleSimulate = async () => {
    if (!treeData) {
      setError('No tree data available');
      return;
    }

    setLoading(true);
    setError(null);
    setPathResult(null);
    setUnreachableNodes(null);

    try {
      const result = await api.simulateTree(treeData, inputValues);
      setPathResult(result);
    } catch (error) {
      setError('Simulation error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle detection of unreachable nodes
  const handleDetectUnreachable = async () => {
    if (!treeData) {
      setError('No tree data available');
      return;
    }

    setLoading(true);
    setError(null);
    setUnreachableNodes(null);

    try {
      // Create some sample inputs based on the current inputs
      const sampleInputs = [inputValues];
      
      // Generate variations of inputs for better coverage
      const variations = generateInputVariations(inputValues);
      sampleInputs.push(...variations);
      
      const result = await api.detectUnreachableNodes(treeData, sampleInputs);
      setUnreachableNodes(result.unreachable_nodes);
    } catch (error) {
      setError('Error detecting unreachable nodes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate variations of input values for better coverage
  const generateInputVariations = (baseInputs) => {
    const variations = [];
    
    // Create a couple of variations by modifying numeric values
    Object.keys(baseInputs).forEach(key => {
      if (typeof baseInputs[key] === 'number') {
        // Higher value variation
        const higherVariation = { ...baseInputs };
        higherVariation[key] = baseInputs[key] + 10;
        variations.push(higherVariation);
        
        // Lower value variation
        const lowerVariation = { ...baseInputs };
        lowerVariation[key] = Math.max(0, baseInputs[key] - 10);
        variations.push(lowerVariation);
      } else if (typeof baseInputs[key] === 'string') {
        // Different string variation
        const stringVariation = { ...baseInputs };
        stringVariation[key] = baseInputs[key] === '' ? 'alternative' : '';
        variations.push(stringVariation);
      }
    });
    
    return variations;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TreeJack</h1>
        <p>Visualize and debug decision trees</p>
      </header>
      
      <main className="app-main">
        <div className="left-panel">
          <InputPanel
            treeData={treeData}
            onTreeChange={setTreeData}
            inputValues={inputValues}
            onInputChange={setInputValues}
            onSimulate={handleSimulate}
            onDetectUnreachable={handleDetectUnreachable}
            examples={examples}
            onLoadExample={handleLoadExample}
          />
          
          <ResultPath 
            pathResult={pathResult} 
            unreachableNodes={unreachableNodes} 
          />
        </div>
        
        <div className="right-panel">
          <div className="tree-viewer-container">
            <TreeViewer 
              treeData={treeData} 
              activePath={pathResult?.path || []}
            />
          </div>
        </div>
      </main>
      
      {loading && <div className="loading-indicator">Processing...</div>}
      
      {error && (
        <div className="error-notification">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

export default App; 