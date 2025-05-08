import React, { useRef, useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

// Helper function to transform our tree structure to react-d3-tree format
const transformTreeData = (node, activePath = [], childToParentMap = {}) => {
  const isActive = activePath.includes(node.node_id);
  
  // Calculate text length to inform the node sizing
  const textLength = node.text.length;
  const conditionLength = node.condition ? node.condition.length : 0;
  const maxLength = Math.max(textLength, conditionLength);
  
  // Create tree node from our data
  const treeNode = {
    name: node.text,
    attributes: {
      id: node.node_id,
      condition: node.condition || 'No condition',
    },
    // Custom properties for styling active path and sizing
    nodeProps: {
      isActive,
      textLength: maxLength
    }
  };

  // Add children if they exist
  if (node.children && node.children.length > 0) {
    treeNode.children = node.children.map(child => {
      // Track parent-child relationships to later determine active links
      childToParentMap[child.node_id] = node.node_id;
      return transformTreeData(child, activePath, childToParentMap);
    });
  }

  return treeNode;
};

// Function to estimate text width based on content
const estimateTextWidth = (text, fontSize = 14) => {
  // Average character width estimate in pixels (for the given font size)
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
};

// Colors for active nodes and paths
const activeNodeColor = "#1a7d36"; // Green color for active nodes
const activeTextColor = "#085020"; // Darker green for active text
const activeBorderColor = "#1a7d36"; // Green border for active nodes

// Custom node component for the tree
const CustomNode = ({ nodeDatum, toggleNode }) => {
  const isActive = nodeDatum.nodeProps?.isActive;
  const textLength = nodeDatum.nodeProps?.textLength || 10;
  
  // Calculate dynamic spacing based on text length
  const dynamicSpacing = Math.max(25, textLength * 1.5); // Minimum 25px spacing
  
  // Calculate rect width based on text content
  const titleWidth = estimateTextWidth(nodeDatum.name);
  const conditionWidth = nodeDatum.attributes?.condition !== 'No condition' 
    ? estimateTextWidth(nodeDatum.attributes.condition, 12) 
    : 0;
  const rectWidth = Math.max(titleWidth, conditionWidth) + 30; // Adding more padding
  
  return (
    <g>
      {/* Background for better text legibility */}
      <rect
        x={25}
        y={-25}
        width={rectWidth}
        height={nodeDatum.attributes?.condition !== 'No condition' ? 50 : 30}
        fill="white"
        fillOpacity={0.85}
        rx={4}
        ry={4}
        stroke={isActive ? activeBorderColor : "#f0f0f0"}
        strokeWidth={isActive ? 1.5 : 1}
      />
      
      <circle 
        r={15} 
        fill={isActive ? activeNodeColor : "#ffffff"} 
        stroke={isActive ? activeBorderColor : "#aaaaaa"}
        strokeWidth={isActive ? 2 : 1}
        onClick={toggleNode}
      />
      
      <text 
        fill={isActive ? activeTextColor : "#333333"} 
        x={dynamicSpacing} 
        y={nodeDatum.attributes?.condition !== 'No condition' ? -10 : 0} 
        style={{ 
          fontWeight: isActive ? '600' : '500',
          fontSize: '14px',
          letterSpacing: isActive ? '0.2px' : 'normal',
          dominantBaseline: 'middle'
        }}
      >
        {nodeDatum.name}
      </text>
      
      {nodeDatum.attributes?.condition !== 'No condition' && (
        <text 
          fill={isActive ? activeTextColor : "#666666"} 
          x={dynamicSpacing} 
          y="15" 
          style={{ 
            fontSize: '12px',
            fontStyle: 'italic',
            dominantBaseline: 'middle'
          }}
        >
          {nodeDatum.attributes.condition}
        </text>
      )}
    </g>
  );
};

// Define custom path style for edges
const pathClassFunc = ({ source, target }, orientation, activeLinkPairs) => {
  // Check if this link is part of the active path
  const isActivePath = activeLinkPairs.some(pair => 
    (pair.source === source.data.attributes.id && pair.target === target.data.attributes.id) ||
    (pair.target === source.data.attributes.id && pair.source === target.data.attributes.id)
  );
  
  return {
    stroke: isActivePath ? activeNodeColor : '#dddddd',
    strokeWidth: isActivePath ? 2.5 : 1.5,
    strokeDasharray: isActivePath ? 'none' : 'none',
    animation: isActivePath ? 'pulse 2s ease-in-out infinite' : 'none'
  };
};

const TreeViewer = ({ treeData, activePath = [] }) => {
  const treeContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [transformedData, setTransformedData] = useState(null);
  const [translate, setTranslate] = useState({ x: 100, y: 250 });
  const [nodeSeparation, setNodeSeparation] = useState({ siblings: 2, nonSiblings: 2.5 });
  const [nodeSize, setNodeSize] = useState({ x: 300, y: 100 });
  const [activeLinkPairs, setActiveLinkPairs] = useState([]);
  const [treeInstance, setTreeInstance] = useState(null);

  // Create active link pairs from active path
  const createActiveLinkPairs = (activePath, childToParentMap) => {
    const pairs = [];
    
    // For each node in the active path (except the root), create a pair with its parent
    for (let i = 1; i < activePath.length; i++) {
      const childId = activePath[i];
      const parentId = childToParentMap[childId];
      
      if (parentId) {
        pairs.push({
          source: parentId,
          target: childId
        });
      }
    }
    
    return pairs;
  };

  // Calculate optimal node size and separation based on tree complexity
  const calculateOptimalLayout = (root) => {
    // Find the maximum text length in the tree
    let maxTextLength = 0;
    let maxDepth = 0;
    let totalNodes = 0;
    
    const traverseForMetrics = (node, depth = 0) => {
      totalNodes++;
      maxDepth = Math.max(maxDepth, depth);
      
      const textLength = node.name.length;
      const conditionLength = node.attributes?.condition !== 'No condition' ? node.attributes.condition.length : 0;
      const nodeMaxLength = Math.max(textLength, conditionLength);
      
      maxTextLength = Math.max(maxTextLength, nodeMaxLength);
      
      if (node.children && node.children.length) {
        node.children.forEach(child => traverseForMetrics(child, depth + 1));
      }
    };
    
    traverseForMetrics(root);
    
    // Calculate optimal horizontal spacing
    const baseHorizontalSize = 250;
    const textFactor = Math.max(1, maxTextLength / 20); // Scale based on max text length
    const horizontalSize = baseHorizontalSize * textFactor;
    
    // Calculate optimal vertical spacing
    const baseVerticalSize = 80;
    const depthFactor = Math.max(1, totalNodes / (maxDepth * 4)); // More nodes at same depth need more space
    const verticalSize = baseVerticalSize * depthFactor;
    
    // Set separation based on node density
    const siblingsSeparation = Math.max(1.5, 2.2 - (maxDepth / 10)); // Deeper trees need less separation
    const nonSiblingsSeparation = siblingsSeparation * 1.3;
    
    return {
      nodeSize: { x: horizontalSize, y: verticalSize },
      nodeSeparation: { siblings: siblingsSeparation, nonSiblings: nonSiblingsSeparation }
    };
  };

  // Update tree data when props change
  useEffect(() => {
    if (treeData && treeData.root) {
      const childToParentMap = {};
      const transformedTree = transformTreeData(treeData.root, activePath, childToParentMap);
      setTransformedData(transformedTree);
      
      // Calculate active link pairs
      const linkPairs = createActiveLinkPairs(activePath, childToParentMap);
      setActiveLinkPairs(linkPairs);
      
      // Calculate optimal layout
      const { nodeSize: optimalNodeSize, nodeSeparation: optimalSeparation } = calculateOptimalLayout(transformedTree);
      setNodeSize(optimalNodeSize);
      setNodeSeparation(optimalSeparation);
    }
  }, [treeData, activePath]);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        const { width, height } = treeContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setTranslate({ x: width / 10, y: height / 2 });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Handler to center the tree view
  const handleCenterTree = () => {
    if (treeInstance && treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2 });
      
      // Reset zoom to default if treeInstance has zoom method
      if (treeInstance.zoomTo) {
        treeInstance.zoomTo(0.8);
      }
    }
  };

  if (!transformedData) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        fontStyle: 'italic',
        fontSize: '15px',
        backgroundColor: '#ffffff',
        borderRadius: '4px'
      }}>
        No tree data available
      </div>
    );
  }

  return (
    <div 
      ref={treeContainerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '500px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        position: 'relative'
      }}
    >
      <button 
        onClick={handleCenterTree}
        className="center-tree-button"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22v-6M12 8V2M4 12H2M22 12h-2M19.07 4.93l-3.54 3.54M4.93 4.93l3.54 3.54M19.07 19.07l-3.54-3.54M4.93 19.07l3.54-3.54"></path>
        </svg>
        Center Tree
      </button>
      
      <style>
        {`
          @keyframes pulse {
            0% { stroke-width: 2.5; stroke-opacity: 0.8; }
            50% { stroke-width: 3.5; stroke-opacity: 1; }
            100% { stroke-width: 2.5; stroke-opacity: 0.8; }
          }
        `}
      </style>
      <Tree
        data={transformedData}
        orientation="horizontal"
        pathFunc="step"
        translate={translate}
        nodeSize={nodeSize}
        separation={nodeSeparation}
        renderCustomNodeElement={({ nodeDatum, toggleNode }) => (
          <CustomNode nodeDatum={nodeDatum} toggleNode={toggleNode} />
        )}
        zoom={0.8}
        scaleExtent={{ min: 0.2, max: 1.5 }}
        enableLegacyTransitions={true}
        pathClassFunc={(link, orientation) => pathClassFunc(link, orientation, activeLinkPairs)}
        ref={instance => setTreeInstance(instance)}
      />
    </div>
  );
};

export default TreeViewer; 