// Mock API Service - Replaces real backend API calls with localStorage operations
import { getData, setData, addItem, updateItem, deleteItem, generateId } from './mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Chatbot API
export const chatbotAPI = {
  sendMessage: async ({ message, userId, context }) => {
    await delay();
    
    // Import chatbot service for processing
    const { chatbotAPI: chatbotService } = await import('./chatbotService');
    return await chatbotService.sendMessage({ message, userId, context });
  }
};

// Mock Authentication API
export const authAPI = {
  login: async (credentials) => {
    await delay();
    const users = getData('users');
    const user = users.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { 
        data: { 
          user: userWithoutPassword, 
          token: `mock-token-${user.id}` 
        } 
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  logout: async () => {
    await delay();
    localStorage.removeItem('currentUser');
    return { data: { message: 'Logged out successfully' } };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  register: async (userData) => {
    await delay();
    const users = getData('users');
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = addItem('users', {
      ...userData,
      role: userData.role || 'customer',
      createdAt: new Date().toISOString()
    });

    const { password, ...userWithoutPassword } = newUser;
    return { data: userWithoutPassword };
  }
};

// Mock Chef API
export const chefAPI = {
  getAllChefs: async () => {
    await delay();
    return { data: getData('chefs') };
  },

  getActiveChefs: async () => {
    await delay();
    const chefs = getData('chefs').filter(chef => chef.isActive);
    return { data: chefs };
  },

  createChef: async (chefData) => {
    await delay();
    const newChef = addItem('chefs', {
      ...chefData,
      isActive: true,
      createdAt: new Date().toISOString()
    });
    return { data: newChef };
  },

  updateChef: async (id, chefData) => {
    await delay();
    const updatedChef = updateItem('chefs', id, {
      ...chefData,
      updatedAt: new Date().toISOString()
    });
    return { data: updatedChef };
  },

  deleteChef: async (id) => {
    await delay();
    // Soft delete - mark as inactive
    const updatedChef = updateItem('chefs', id, {
      isActive: false,
      deletedAt: new Date().toISOString()
    });
    return { data: updatedChef };
  },

  reactivateChef: async (id) => {
    await delay();
    const updatedChef = updateItem('chefs', id, {
      isActive: true,
      reactivatedAt: new Date().toISOString()
    });
    return { data: updatedChef };
  }
};

// Mock Table API
export const tableAPI = {
  getAllTables: async () => {
    await delay();
    return { data: getData('tables') };
  },

  getAllBookings: async () => {
    await delay();
    return { data: getData('bookings') };
  },

  getWaitingBookings: async () => {
    await delay();
    const bookings = getData('bookings').filter(booking => booking.status === 'WAITING');
    return { data: bookings };
  },

  getWaitingTimeInfo: async () => {
    await delay();
    const tables = getData('tables');
    const bookings = getData('bookings');
    
    const availableTableCount = tables.filter(table => table.status === 'AVAILABLE').length;
    const occupiedTableCount = tables.filter(table => table.status === 'OCCUPIED').length;
    const currentWaitingCount = bookings.filter(booking => booking.status === 'WAITING').length;
    
    // Calculate estimated wait time (simplified)
    const estimatedWaitMinutes = currentWaitingCount > availableTableCount ? 
      (currentWaitingCount - availableTableCount) * 30 : 0;

    return {
      data: {
        availableTableCount,
        occupiedTableCount,
        currentWaitingCount,
        estimatedWaitMinutes
      }
    };
  },

  createTable: async (tableData) => {
    await delay();
    const newTable = addItem('tables', {
      ...tableData,
      createdAt: new Date().toISOString()
    });
    return { data: newTable };
  },

  updateTable: async (id, tableData) => {
    await delay();
    const updatedTable = updateItem('tables', id, {
      ...tableData,
      updatedAt: new Date().toISOString()
    });
    return { data: updatedTable };
  },

  deleteTable: async (id) => {
    await delay();
    deleteItem('tables', id);
    return { data: { success: true } };
  },

  createBooking: async (bookingData) => {
    await delay();
    const newBooking = addItem('bookings', {
      ...bookingData,
      status: 'WAITING',
      table: null,
      createdAt: new Date().toISOString()
    });
    return { data: newBooking };
  },

  seatBooking: async (bookingId, tableId) => {
    await delay();
    const tables = getData('tables');
    const table = tables.find(t => t.id === parseInt(tableId));
    
    // Update booking
    const updatedBooking = updateItem('bookings', bookingId, {
      status: 'SEATED',
      table: { id: table.id, tableNumber: table.tableNumber },
      seatedAt: new Date().toISOString()
    });

    // Update table status
    updateItem('tables', tableId, { status: 'OCCUPIED' });

    return { data: updatedBooking };
  },

  completeBooking: async (bookingId) => {
    await delay();
    const bookings = getData('bookings');
    const booking = bookings.find(b => b.id === parseInt(bookingId));
    
    if (booking && booking.table) {
      // Free up the table
      updateItem('tables', booking.table.id, { status: 'AVAILABLE' });
    }

    const updatedBooking = updateItem('bookings', bookingId, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    });

    return { data: updatedBooking };
  },

  cancelBooking: async (bookingId) => {
    await delay();
    const bookings = getData('bookings');
    const booking = bookings.find(b => b.id === parseInt(bookingId));
    
    if (booking && booking.table) {
      // Free up the table if it was assigned
      updateItem('tables', booking.table.id, { status: 'AVAILABLE' });
    }

    const updatedBooking = updateItem('bookings', bookingId, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString()
    });

    return { data: updatedBooking };
  }
};

// Mock Menu API
export const menuAPI = {
  getAllMenuItems: async () => {
    await delay();
    return { data: getData('menuItems') };
  },

  getAvailableMenuItems: async () => {
    await delay();
    const menuItems = getData('menuItems').filter(item => item.isAvailable);
    return { data: menuItems };
  },

  createMenuItem: async (itemData) => {
    await delay();
    const newItem = addItem('menuItems', {
      ...itemData,
      createdAt: new Date().toISOString()
    });
    return { data: newItem };
  },

  updateMenuItem: async (id, itemData) => {
    await delay();
    const updatedItem = updateItem('menuItems', id, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
    return { data: updatedItem };
  },

  deleteMenuItem: async (id) => {
    await delay();
    deleteItem('menuItems', id);
    return { data: { success: true } };
  },

  toggleAvailability: async (id, isAvailable) => {
    await delay();
    const updatedItem = updateItem('menuItems', id, {
      isAvailable,
      availabilityUpdatedAt: new Date().toISOString()
    });
    return { data: updatedItem };
  }
};

// Mock Booking API
export const bookingAPI = {
  createBooking: async (bookingData) => {
    await delay();
    const newBooking = addItem('bookings', {
      ...bookingData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      status: bookingData.status || 'confirmed'
    });
    
    // Update table status to booked for the time slot
    const tables = getData('tables');
    const updatedTables = tables.map(table => 
      table.id === bookingData.tableId 
        ? { ...table, status: 'booked', currentBooking: newBooking.id }
        : table
    );
    setData('tables', updatedTables);
    
    return { data: newBooking };
  },

  getUserBookings: async (userId) => {
    await delay();
    const bookings = getData('bookings');
    const userBookings = bookings.filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return { data: userBookings };
  },

  getAllBookings: async () => {
    await delay();
    const bookings = getData('bookings');
    return { data: bookings };
  },

  updateBooking: async (id, updates) => {
    await delay();
    const updatedBooking = updateItem('bookings', id, updates);
    return { data: updatedBooking };
  },

  cancelBooking: async (id) => {
    await delay();
    const booking = updateItem('bookings', id, { status: 'cancelled' });
    
    // Free up the table
    const tables = getData('tables');
    const updatedTables = tables.map(table => 
      table.currentBooking === id 
        ? { ...table, status: 'available', currentBooking: null }
        : table
    );
    setData('tables', updatedTables);
    
    return { data: booking };
  }
};

// Mock Feedback API
export const feedbackAPI = {
  createFeedback: async (feedbackData) => {
    await delay();
    const newFeedback = addItem('feedback', {
      ...feedbackData,
      createdAt: new Date().toISOString()
    });
    return { data: newFeedback };
  },

  getRecentFeedback: async (days = 30) => {
    await delay();
    const feedback = getData('feedback');
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const recentFeedback = feedback.filter(f => 
      new Date(f.createdAt) >= cutoffDate
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return { data: recentFeedback };
  },

  getFeedbackAnalytics: async () => {
    await delay();
    const feedback = getData('feedback');
    
    if (feedback.length === 0) {
      return {
        data: {
          totalFeedback: 0,
          averageOverallRating: 0,
          averageFoodRating: 0,
          averageServiceRating: 0,
          averageAmbianceRating: 0
        }
      };
    }

    const analytics = {
      totalFeedback: feedback.length,
      averageOverallRating: feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length,
      averageFoodRating: feedback.reduce((sum, f) => sum + f.foodRating, 0) / feedback.length,
      averageServiceRating: feedback.reduce((sum, f) => sum + f.serviceRating, 0) / feedback.length,
      averageAmbianceRating: feedback.reduce((sum, f) => sum + f.ambianceRating, 0) / feedback.length
    };

    return { data: analytics };
  }
};
