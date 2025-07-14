import api from './api';

// Get all travel items
export const getAllItems = async () => {
  try {
    const response = await api.get('/travel-items');
    
    // Ensure we're returning a properly structured response
    if (response && response.data) {
      return response;
    } else {
      throw new Error('Invalid response structure from API');
    }
  } catch (error) {
    console.error('Error getting travel items:', error);
    // Return an object with empty array to prevent map errors
    if (error.response && error.response.status === 401) {
      // Let the interceptor handle 401 errors
      throw error;
    }
    return { data: { success: false, data: [] } };
  }
};

// Get single travel item by ID
export const getItemById = async (id) => {
  try {
    const response = await api.get(`/travel-items/${id}`);
    return response;
  } catch (error) {
    console.error(`Error getting travel item ${id}:`, error);
    throw error;
  }
};

// Create new travel item
export const createItem = async (itemData) => {
  try {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    
    // Add all fields to the form data
    Object.keys(itemData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, itemData[key]);
      }
    });
    
    // Add the image if it exists
    if (itemData.image && itemData.image instanceof File) {
      formData.append('image', itemData.image);
    }
    
    const response = await api.post('/travel-items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error creating travel item:', error);
    throw error;
  }
};

// Update existing travel item
export const updateItem = async (id, itemData) => {
  try {
    // For file uploads, we need to use FormData
    const formData = new FormData();
    
    // Add all fields to the form data
    Object.keys(itemData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, itemData[key]);
      }
    });
    
    // Add the image if it exists
    if (itemData.image && itemData.image instanceof File) {
      formData.append('image', itemData.image);
    }
    
    const response = await api.put(`/travel-items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  } catch (error) {
    console.error(`Error updating travel item ${id}:`, error);
    throw error;
  }
};

// Delete travel item
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/travel-items/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting travel item ${id}:`, error);
    throw error;
  }
};

// Toggle isPacked status
export const togglePackedStatus = async (id, isPacked) => {
  try {
    // Make sure we have a valid ID
    if (!id) {
      throw new Error('Item ID is required');
    }
    
    const response = await api.put(`/travel-items/${id}`, { isPacked }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  } catch (error) {
    console.error(`Error toggling packed status for item ${id}:`, error);
    throw error;
  }
}; 