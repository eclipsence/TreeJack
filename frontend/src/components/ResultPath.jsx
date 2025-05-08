import React from 'react';

// Active node and path styling to match tree visualization
const activeNodeColor = "#1a7d36"; // Green color for active nodes

const ResultPath = ({ pathResult, unreachableNodes }) => {
  if (!pathResult && !unreachableNodes) {
    return (
      <div className="result-path empty-result">
        <p>Run a simulation to see results</p>
      </div>
    );
  }

  return (
    <div className="result-path">
      {pathResult && (
        <div className="path-results">
          <div className="panel-header">
            <h3>Simulation Results</h3>
          </div>
          
          <div className="path-summary">
            <h4>Path Taken</h4>
            <div className="path-nodes">
              {pathResult.path.map((nodeId, index) => (
                <div key={nodeId} className="path-node">
                  <span className="node-index">{index + 1}</span>
                  <span className="node-id">{nodeId}</span>
                  {index < pathResult.path.length - 1 && (
                    <span className="path-arrow">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="final-node">
            <h4>Final Node</h4>
            <div className="node-details">
              <p><strong>ID:</strong> {pathResult.final_node.node_id}</p>
              <p><strong>Text:</strong> {pathResult.final_node.text}</p>
              {pathResult.final_node.condition && (
                <p><strong>Condition:</strong> {pathResult.final_node.condition}</p>
              )}
            </div>
          </div>

          <div className="export-options">
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(pathResult, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = 'path-results.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="export-button"
            >
              Export Results
            </button>
          </div>
        </div>
      )}

      {unreachableNodes && (
        <div className="unreachable-results">
          <h4>Unreachable Nodes</h4>
          {unreachableNodes.length > 0 ? (
            <div className="unreachable-nodes">
              {unreachableNodes.map(nodeId => (
                <div key={nodeId} className="unreachable-node">
                  {nodeId}
                </div>
              ))}
            </div>
          ) : (
            <p>All nodes are reachable with provided inputs</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultPath; 