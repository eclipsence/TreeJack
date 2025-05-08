from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any

from models import InputPayload, PathResult, DecisionTree
from engine import traverse_tree, detect_unreachable_nodes
from tree_examples import example_trees

app = FastAPI(
    title="TreeJack API",
    description="API for visualizing and traversing decision trees",
    version="1.0.0",
)

# Add CORS middleware to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to TreeJack API"}

@app.post("/simulate")
def simulate_tree(payload: InputPayload) -> PathResult:
    """
    Simulate a decision tree traversal with the given inputs.
    Returns the path of nodes that were visited.
    """
    try:
        path, visited_nodes, final_node = traverse_tree(payload.tree.root, payload.input_values)
        return PathResult(
            path=path,
            visited_nodes=visited_nodes,
            final_node=final_node
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing tree: {str(e)}")

@app.get("/examples")
def get_examples() -> Dict[str, DecisionTree]:
    """
    Return a list of example decision trees.
    """
    return example_trees

@app.get("/examples/{tree_name}/sample_inputs")
def get_sample_inputs(tree_name: str) -> List[Dict[str, Any]]:
    """
    Return sample inputs for a specific example tree.
    """
    if tree_name not in example_trees:
        raise HTTPException(status_code=404, detail=f"Tree '{tree_name}' not found")
    
    tree = example_trees[tree_name]
    if hasattr(tree, 'sample_inputs') and tree.sample_inputs:
        return tree.sample_inputs
    else:
        return []

@app.post("/detect-unreachable")
def find_unreachable_nodes(tree: DecisionTree, sample_inputs: List[Dict[str, Any]]):
    """
    Detect nodes in the tree that are unreachable with the given sample inputs.
    """
    try:
        unreachable = detect_unreachable_nodes(tree.root, sample_inputs)
        return {"unreachable_nodes": unreachable}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error detecting unreachable nodes: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 