import React, { useState, useEffect } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import api from '../api';

// Custom theme for the JSON editor
const jsonEditorTheme = {
  base00: "white",
  base01: "#fafafa",
  base02: "#f0f0f0",
  base03: "#999",
  base04: "#666",
  base05: "#333",
  base06: "#222",
  base07: "#111",
  base08: "#000",
  base09: "#333",
  base0A: "#444",
  base0B: "#000",
  base0C: "#333",
  base0D: "#000",
  base0E: "#333",
  base0F: "#555"
};

const InputPanel = ({ 
  treeData, 
  onTreeChange, 
  inputValues, 
  onInputChange, 
  onSimulate, 
  examples, 
  onLoadExample,
  onDetectUnreachable
}) => {
  const [jsonError, setJsonError] = useState(null);
  const [treeEditorValue, setTreeEditorValue] = useState(null);
  const [inputEditorValue, setInputEditorValue] = useState(null);
  const [selectedExample, setSelectedExample] = useState("");
  const [sampleInputs, setSampleInputs] = useState([]);
  const [selectedInput, setSelectedInput] = useState("");
  const [simulationDebounceTimeout, setSimulationDebounceTimeout] = useState(null);
  
  useEffect(() => {
    // Initialize the tree editor with current tree data
    if (treeData) {
      setTreeEditorValue(treeData);
    }
  }, [treeData]);

  useEffect(() => {
    // Initialize the input editor with current input values
    if (inputValues) {
      setInputEditorValue(inputValues);
    }
  }, [inputValues]);

  // Load sample inputs when an example is selected
  useEffect(() => {
    const fetchSampleInputs = async () => {
      if (selectedExample) {
        try {
          const sampleData = await api.getSampleInputs(selectedExample);
          setSampleInputs(sampleData);
          // Reset selected input when getting new samples
          setSelectedInput("");
        } catch (error) {
          console.error("Error loading sample inputs:", error);
          setSampleInputs([]);
        }
      } else {
        setSampleInputs([]);
      }
    };

    fetchSampleInputs();
  }, [selectedExample]);

  // Handle tree JSON changes
  const handleTreeChange = (content) => {
    try {
      if (content.error) {
        setJsonError('Invalid JSON in tree editor');
        return;
      }
      setJsonError(null);
      setTreeEditorValue(content.jsObject);
      if (onTreeChange) {
        onTreeChange(content.jsObject);
      }
    } catch (error) {
      setJsonError(`Error parsing tree JSON: ${error.message}`);
    }
  };

  // Handle input JSON changes
  const handleInputChange = (content) => {
    try {
      if (content.error) {
        setJsonError('Invalid JSON in input editor');
        return;
      }
      setJsonError(null);
      setInputEditorValue(content.jsObject);
      if (onInputChange) {
        onInputChange(content.jsObject);
        
        // When inputs change significantly, automatically simulate
        if (treeData && content.jsObject && 
            !isEqualObjects(inputValues, content.jsObject) &&
            Object.keys(content.jsObject).length > 0) {
          // Use a debounced simulation to avoid too many API calls
          if (simulationDebounceTimeout) {
            clearTimeout(simulationDebounceTimeout);
          }
          setSimulationDebounceTimeout(setTimeout(() => {
            onSimulate();
          }, 800)); // Debounce for 800ms
        }
      }
    } catch (error) {
      setJsonError(`Error parsing input JSON: ${error.message}`);
    }
  };

  // Helper function to check if two objects are roughly equal
  const isEqualObjects = (obj1, obj2) => {
    const keys1 = Object.keys(obj1 || {});
    const keys2 = Object.keys(obj2 || {});
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];
      
      // Simple comparison for primitive values
      if (val1 !== val2) return false;
    }
    
    return true;
  };

  // Handle example selection
  const handleExampleChange = (e) => {
    const example = e.target.value;
    setSelectedExample(example);
    
    if (example && onLoadExample) {
      onLoadExample(example);
    }
  };

  // Handle sample input selection
  const handleSampleInputChange = (e) => {
    const inputIndex = parseInt(e.target.value, 10);
    setSelectedInput(e.target.value);
    
    if (!isNaN(inputIndex) && inputIndex >= 0 && inputIndex < sampleInputs.length) {
      const sampleInput = sampleInputs[inputIndex].input_values;
      if (onInputChange) {
        onInputChange(sampleInput);
      }
    }
  };

  return (
    <div className="input-panel">
      <div className="panel-header">
        <h3>Tree Definition</h3>
        {examples && (
          <div className="example-selector">
            <label>
              Example Tree
              <select onChange={handleExampleChange} value={selectedExample}>
                <option value="">Select an example</option>
                {Object.keys(examples).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      <div className="json-editor-container">
        <JSONInput
          id="tree-editor"
          placeholder={treeEditorValue || { root: { node_id: "start", text: "Start", children: [] } }}
          locale={locale}
          height="200px"
          width="100%"
          onChange={handleTreeChange}
          theme={jsonEditorTheme}
          colors={{
            background: "#ffffff",
            default: "#333333",
            string: "#000000",
            number: "#333333",
            colon: "#333333",
            keys: "#000000",
            error: "#cc0000",
            background_warning: "rgba(255, 0, 0, 0.05)"
          }}
          style={{
            body: {
              fontSize: "14px",
              fontFamily: "'Inter', -apple-system, sans-serif",
              padding: "8px",
            },
            container: {
              borderRadius: "4px",
              borderColor: "#eeeeee",
            },
            warningBox: {
              display: "none"
            }
          }}
          waitAfterKeyPress={400}
          confirmGood={false}
        />
      </div>

      <div className="panel-header">
        <h3>Input Values</h3>
        {sampleInputs && sampleInputs.length > 0 && (
          <div className="sample-input-selector">
            <label>
              Sample Input
              <select onChange={handleSampleInputChange} value={selectedInput}>
                <option value="">Select a sample input</option>
                {sampleInputs.map((input, index) => (
                  <option key={index} value={index}>
                    {input.name || `Sample ${index + 1}`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      
      <div className="json-editor-container">
        <JSONInput
          id="input-editor"
          placeholder={inputEditorValue || {}}
          locale={locale}
          height="150px"
          width="100%"
          onChange={handleInputChange}
          theme={jsonEditorTheme}
          colors={{
            background: "#ffffff",
            default: "#333333",
            string: "#000000",
            number: "#333333",
            colon: "#333333",
            keys: "#000000",
            error: "#cc0000",
            background_warning: "rgba(255, 0, 0, 0.05)"
          }}
          style={{
            body: {
              fontSize: "14px",
              fontFamily: "'Inter', -apple-system, sans-serif",
              padding: "8px",
            },
            container: {
              borderRadius: "4px",
              borderColor: "#eeeeee",
            },
            warningBox: {
              display: "none"
            }
          }}
          waitAfterKeyPress={400}
          confirmGood={false}
        />
      </div>

      {jsonError && <div className="error-message">{jsonError}</div>}

      <div className="button-group">
        <button 
          className="primary-button" 
          onClick={onSimulate}
          disabled={!treeData}
        >
          Simulate
        </button>
        <button 
          className="secondary-button" 
          onClick={onDetectUnreachable}
          disabled={!treeData}
        >
          Find Unreachable Nodes
        </button>
      </div>
    </div>
  );
};

export default InputPanel; 