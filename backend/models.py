from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel, Field


class Node(BaseModel):
    node_id: str
    text: str
    condition: Optional[str] = None
    children: List["Node"] = []


class DecisionTree(BaseModel):
    root: Node
    sample_inputs: List[Dict[str, Any]] = Field(default_factory=list)


class InputPayload(BaseModel):
    tree: DecisionTree
    input_values: Dict[str, Any] = Field(default_factory=dict)


class PathResult(BaseModel):
    path: List[str]
    visited_nodes: List[Node]
    final_node: Node 