import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Change this in production

const api = {
  // Get example trees
  getExamples: async () => {
    try {
      const response = await axios.get(`${API_URL}/examples`);
      return response.data;
    } catch (error) {
      console.error('Error fetching examples:', error);
      throw error;
    }
  },

  // Get sample inputs for a specific tree
  getSampleInputs: async (treeName) => {
    try {
      const response = await axios.get(`${API_URL}/examples/${treeName}/sample_inputs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sample inputs:', error);
      throw error;
    }
  },

  // Simulate tree traversal with inputs
  simulateTree: async (tree, inputValues) => {
    try {
      const response = await axios.post(`${API_URL}/simulate`, {
        tree: tree,
        input_values: inputValues
      });
      return response.data;
    } catch (error) {
      console.error('Error simulating tree:', error);
      throw error;
    }
  },

  // Detect unreachable nodes
  detectUnreachableNodes: async (tree, sampleInputs) => {
    try {
      const response = await axios.post(`${API_URL}/detect-unreachable`, {
        tree: tree,
        sample_inputs: sampleInputs
      });
      return response.data;
    } catch (error) {
      console.error('Error detecting unreachable nodes:', error);
      throw error;
    }
  }
};

export default api; 