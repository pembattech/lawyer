const API_BASE_URL = 'http://localhost:8000/api';
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/token/`,
  REGISTER: `${API_BASE_URL}/register/`,
  USER: `${API_BASE_URL}/user/`,
  LOGOUT: `${API_BASE_URL}/logout/`, 
};

// Utility function for headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

// Auth service functions
export const authService = {
  login: async (email, password) => {
    const response = await fetch(AUTH_API.LOGIN, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    const data = await response.json();
    // Store the token in localStorage
    if (data.access) {
      localStorage.setItem('accessToken', data.access);
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }
    }
    return data;
  },

  register: async (userData) => {
    const response = await fetch(AUTH_API.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }, // Just send Content-Type without auth
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.email?.[0] || 
        error.password?.[0] || 
        error.non_field_errors?.[0] || 
        'Registration failed'
      );
    }
    return response.json();
  },

  getUser: async () => {
    const response = await fetch(AUTH_API.USER, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    return response.json();
  },
  
  logout: async () => {
    try {
      const response = await fetch(AUTH_API.LOGOUT, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      
      // Clear local storage regardless of API call success
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (response.ok) {
        return { success: true, message: 'Logout successful' };
      } else {
        const error = await response.json();
        return { success: false, message: error.detail || 'Logout API call failed' };
      }
    } catch (error) {
      // Clear tokens on error and return failure response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return { success: false, message: 'Logout API call error' };
    }
  },
  
  // Utility method to check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
  
  // Optional: Refresh token functionality if your backend supports it
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      // If refresh fails, log the user out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return data;
  }
};

// Optional: API service for case-related endpoints
export const caseService = {
  getCaseUpdates: async () => {
    const response = await fetch(`${API_BASE_URL}/cases/updates/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch case updates');
    }
    return response.json();
  },
  
  getDocumentRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/documents/requests/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch document requests');
    }
    return response.json();
  },
  
  getAppointments: async () => {
    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },
  
  // Add more case-related API functions as needed
};