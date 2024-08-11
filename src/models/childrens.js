import API, { BASE_URL } from './API';


const ChildrenAPI = {
  // Create a new child
  createChild: async (childData) => {
    try {
      const response = await API.post(BASE_URL, '/children', childData);
      return response;
    } catch (error) {
      console.error('Error creating child:', error);
      throw error;
    }
  },

  // Get all children
  getChildren: async () => {
    try {
      const response = await API.get(BASE_URL, '/children');
      return response;
    } catch (error) {
      console.error('Error fetching children:', error);
      throw error;
    }
  },

  // Get a single child by ID
  getChild: async (id) => {
    try {
      const response = await API.get(BASE_URL, `/children/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching child with ID ${id}:`, error);
      throw error;
    }
  },

  // Update a child by ID
  updateChild: async (id, childData) => {
    try {
      const response = await API.put(BASE_URL, `/children/${id}`, childData);
      return response;
    } catch (error) {
      console.error(`Error updating child with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a child by ID
  deleteChild: async (id) => {
    try {
      const response = await API.delete(BASE_URL, `/children/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
      throw error;
    }
  }
};

export default ChildrenAPI;
