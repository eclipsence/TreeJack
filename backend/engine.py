from typing import List, Dict, Any, Optional
from models import Node


def evaluate_condition(condition: str, inputs: Dict[str, Any]) -> bool:
    """
    Safely evaluate a condition string against the provided inputs.
    
    Example conditions:
    - "input.age >= 18"
    - "input.country == 'US'"
    - "input.score > 90 and input.attempts < 3"
    """
    if not condition:
        return True
    
    # Create a safe evaluation environment with only the input data
    eval_globals = {}
    eval_locals = {"input": type('input', (), inputs)}
    
    try:
        # Evaluate the condition in the restricted environment
        result = eval(condition, eval_globals, eval_locals)
        return bool(result)
    except Exception as e:
        # If there's an error evaluating (missing variable, syntax error, etc)
        print(f"Error evaluating condition '{condition}': {str(e)}")
        return False


def traverse_tree(node: Node, inputs: Dict[str, Any]) -> tuple[List[str], List[Node], Node]:
    """
    Recursively traverse the decision tree based on input values.
    Returns the path of node_ids that were visited, list of node objects, and the final node.
    """
    # Start with the current node
    path = [node.node_id]
    visited_nodes = [node]
    
    # Base case: leaf node (no children)
    if not node.children:
        return path, visited_nodes, node
    
    # Check each child node
    for child in node.children:
        # If the child has no condition, or its condition evaluates to True
        if child.condition is None or evaluate_condition(child.condition, inputs):
            # Recursively traverse this valid child
            child_path, child_visited, final_node = traverse_tree(child, inputs)
            
            # Return the combined path
            return path + child_path, visited_nodes + child_visited, final_node
    
    # If no valid child path was found, return just this node
    return path, visited_nodes, node


def detect_unreachable_nodes(tree: Node, sample_inputs: List[Dict[str, Any]]) -> List[str]:
    """
    Detect nodes that are unreachable given a set of sample inputs.
    Returns a list of unreachable node_ids.
    """
    # Collect all node_ids in the tree
    all_nodes = set()
    
    def collect_nodes(node):
        all_nodes.add(node.node_id)
        for child in node.children:
            collect_nodes(child)
    
    collect_nodes(tree)
    
    # Collect nodes visited with sample inputs
    visited_nodes = set()
    for inputs in sample_inputs:
        path, _, _ = traverse_tree(tree, inputs)
        visited_nodes.update(path)
    
    # Return nodes that were never visited
    return list(all_nodes - visited_nodes) 