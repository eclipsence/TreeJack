# TreeJack - Decision Tree Visualizer

TreeJack is a web-based interactive tool for visualizing, simulating, and debugging decision trees. It helps developers and product owners understand logic flows, identify unreachable paths, and test various input scenarios through a clean, minimalistic interface.

## Motivation

Decision trees are a powerful way to represent complex logic, but they can quickly become difficult to manage, test, or communicate—especially when embedded deep in business rules or hardcoded workflows. Developers often struggle to trace how inputs flow through nested conditions, while product managers and stakeholders find it hard to validate decision logic without running real data through the system.

TreeJack was created to solve this. It gives you a clean, visual, and interactive environment to build, simulate, and debug decision trees. Whether you’re:
	-	designing a credit approval system,
	-	mapping onboarding flows,
	-	building conversational logic for chatbots, or
	-	validating conditional forms or feature flags,

TreeJack empowers you to prototype, test, and explain logic clearly—without writing a single line of backend logic.

By combining visual clarity with input-driven simulation and smart features like unreachable node detection and path export, TreeJack bridges the gap between logic design and real-world debugging.

## Features

- **Tree Visualization**: Visually represent decision trees with interactive nodes and dynamic spacing
- **Active Path Highlighting**: Green highlighting for active paths with subtle animations
- **Input Simulation**: Test how different inputs affect the traversal path
- **Auto Simulation**: Automatically updates the tree view when input values change (with debouncing)
- **Tree Navigation**: Easily center the tree view with a dedicated button
- **Unreachable Node Detection**: Identify nodes that cannot be reached with given sample inputs
- **Path Export**: Export traversal results for documentation and sharing
- **Example Trees**: Pre-loaded examples including a complex loan application decision tree
- **Responsive Layout**: Clean black and white interface with appropriate spacing and typography
- **Dynamic Node Spacing**: Automatically adjusts spacing based on text content length
- **Semi-transparent Text Backgrounds**: Improved readability with background behind node text

## UI Design

TreeJack features a minimalist black and white interface with green highlights for active elements:

- **Header**: Simple black header with application name and description
- **Left Panel**: Contains tree definition editor, input values, and results
- **Right Panel**: Displays the interactive tree visualization
- **Active Paths**: Highlighted in green with subtle animations and pulse effects
- **Text Backgrounds**: Semi-transparent backgrounds behind node text for better readability
- **Dynamic Spacing**: Nodes are automatically positioned to prevent text overlap
- **Navigation Controls**: Center button and interactive panning/zooming

## Project Structure

```
TreeJack/
├── backend/               # FastAPI backend
│   ├── main.py            # API endpoints
│   ├── models.py          # Data models
│   ├── engine.py          # Tree traversal logic
│   ├── tree_examples.py   # Example trees
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # React frontend
│   ├── src/               
│   │   ├── components/    # React components
│   │   │   ├── TreeViewer.jsx    # Tree visualization
│   │   │   ├── InputPanel.jsx    # Tree and input editors
│   │   │   └── ResultPath.jsx    # Results display
│   │   ├── App.jsx        # Main application
│   │   ├── App.css        # Styles
│   │   ├── api.js         # API service
│   │   └── main.jsx       # Entry point
│   ├── index.html         # HTML template
│   └── package.json       # JS dependencies
│
├── examples/              # Example trees and inputs
│   ├── complex_tree.json  # Loan application example
│   └── sample_inputs.json # Sample inputs for testing
│
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd TreeJack/backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

   Note: If port 8000 is already in use, you can specify a different port:
   ```bash
   uvicorn main:app --reload --port 8001
   ```

The API will be available at http://localhost:8000 (or the port you specified)

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd TreeJack/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The web application will be available at http://localhost:5173

## Using the Application

### Loading an Example Tree

1. Use the "Example Tree" dropdown to select a pre-defined tree
2. The tree will be loaded and displayed in the right panel
3. Default input values will be automatically generated based on the tree conditions

### Creating a Custom Tree

Create a custom decision tree by editing the JSON in the Tree Definition panel. The tree structure should follow this format:

```json
{
  "root": {
    "node_id": "start",
    "text": "Start Node",
    "condition": null,
    "children": [
      {
        "node_id": "node_1",
        "text": "Condition Node",
        "condition": "input.value > 10",
        "children": []
      }
    ]
  }
}
```

Each node should have:
- `node_id`: Unique identifier for the node
- `text`: Display text for the node
- `condition`: JavaScript expression that evaluates to true/false (null for start nodes)
- `children`: Array of child nodes

### Simulating Tree Traversal

1. Define your input values in the Input Values JSON editor
2. The tree will automatically update to show the path based on your inputs (after a short delay to prevent excessive API calls)
3. Alternatively, click "Simulate" to manually trigger a simulation
4. View the results in the Simulation Results panel
5. The active path will be highlighted in green in the tree visualization

### Navigating the Tree View

- **Pan**: Click and drag in the tree area to move the view
- **Zoom**: Use the mouse wheel to zoom in and out
- **Center**: Click the "Center Tree" button in the top-right corner to reset the view position and zoom

### Detecting Unreachable Nodes

1. Load or create a tree
2. Click "Find Unreachable Nodes" to analyze the tree
3. View the list of unreachable nodes in the results panel

### Exporting Results

Click "Export Results" in the Simulation Results panel to download the path data as a JSON file.

## Example Tree Format

Here's a simple example of a decision tree structure:

```json
{
  "root": {
    "node_id": "start",
    "text": "Start",
    "condition": null,
    "children": [
      {
        "node_id": "age_check",
        "text": "Age Check",
        "condition": "input.age >= 18",
        "children": [
          {
            "node_id": "adult",
            "text": "Adult Path",
            "condition": null,
            "children": []
          }
        ]
      },
      {
        "node_id": "minor",
        "text": "Minor Path",
        "condition": "input.age < 18",
        "children": []
      }
    ]
  }
}
```

With input values:

```json
{
  "age": 25
}
```

## Condition Expressions

Conditions are JavaScript expressions evaluated against the input object. Examples:

- `input.age >= 18` - Check if age is 18 or greater
- `input.score > 700 && input.income > 50000` - Check multiple conditions
- `input.status === "approved"` - Check string equality
- `input.applications.length > 0` - Check properties of nested objects or arrays

## Advanced Features

### Dynamic Node Spacing

TreeJack automatically adjusts the spacing between nodes based on the text content length to prevent overlapping. Long text will result in more space between nodes.

### Active Path Animation

Active paths are highlighted with a subtle pulse animation to make them more visually prominent. The animation creates a gentle pulsing effect that draws attention to the active path.

### Auto-Simulation

When you modify input values, TreeJack automatically updates the tree visualization after a short delay (debounce). This provides immediate visual feedback without making excessive API calls.

### JSON Editor Features

The JSON editors include:
- Syntax highlighting
- Error detection
- Auto formatting
- Real-time validation

## License

MIT 
