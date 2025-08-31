// Mock Data Storage and Management
// This file handles localStorage operations and provides sample data

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Get data from localStorage
export const getData = (key) => {
  const data = localStorage.getItem(`hotel_${key}`);
  return data ? JSON.parse(data) : getInitialData(key);
};

// Set data to localStorage
export const setData = (key, data) => {
  localStorage.setItem(`hotel_${key}`, JSON.stringify(data));
  return data;
};

// Add new item to collection
export const addItem = (collection, item) => {
  const data = getData(collection);
  const newItem = { ...item, id: generateId() };
  data.push(newItem);
  setData(collection, data);
  return newItem;
};

// Update existing item
export const updateItem = (collection, id, updates) => {
  const data = getData(collection);
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    setData(collection, data);
    return data[index];
  }
  return null;
};

// Delete item from collection
export const deleteItem = (collection, id) => {
  const data = getData(collection);
  const filteredData = data.filter(item => item.id !== id);
  setData(collection, filteredData);
  return true;
};

// Initialize data if not exists
const getInitialData = (key) => {
  let initialData = [];
  
  switch (key) {
    case 'users':
      initialData = [
        {
          id: 'user_manager_1',
          name: 'Hotel Manager',
          email: 'manager@hotel.com',
          password: 'manager123',
          role: 'manager',
          phone: '+1-555-0101',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'user_customer_1',
          name: 'John Doe',
          email: 'customer@example.com',
          password: 'customer123',
          role: 'customer',
          phone: '+1-555-0102',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'user_customer_2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'jane123',
          role: 'customer',
          phone: '+1-555-0103',
          createdAt: '2024-01-20T00:00:00Z'
        }
      ];
      break;

    case 'chefs':
      initialData = [
        {
          id: 'chef_1',
          name: 'Gordon Ramsay',
          specialty: 'French Cuisine',
          experience: 25,
          salary: 75000,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'chef_2',
          name: 'Julia Child',
          specialty: 'Italian Cuisine',
          experience: 15,
          salary: 65000,
          isActive: true,
          createdAt: '2024-01-05T00:00:00Z'
        },
        {
          id: 'chef_3',
          name: 'Marco Pierre',
          specialty: 'Asian Fusion',
          experience: 12,
          salary: 60000,
          isActive: true,
          createdAt: '2024-01-10T00:00:00Z'
        }
      ];
      break;

    case 'tables':
      initialData = [
        {
          id: 'table_1',
          number: 1,
          capacity: 2,
          status: 'available',
          location: 'Window Side',
          reservedBy: null,
          reservationTime: null
        },
        {
          id: 'table_2',
          number: 2,
          capacity: 4,
          status: 'occupied',
          location: 'Center',
          reservedBy: 'John Doe',
          reservationTime: new Date().toISOString()
        },
        {
          id: 'table_3',
          number: 3,
          capacity: 6,
          status: 'available',
          location: 'Private Corner',
          reservedBy: null,
          reservationTime: null
        },
        {
          id: 'table_4',
          number: 4,
          capacity: 2,
          status: 'reserved',
          location: 'Balcony',
          reservedBy: 'Jane Smith',
          reservationTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'table_5',
          number: 5,
          capacity: 8,
          status: 'available',
          location: 'VIP Section',
          reservedBy: null,
          reservationTime: null
        }
      ];
      break;

    case 'menu':
      initialData = [
        {
          id: 'menu_1',
          name: 'Grilled Salmon',
          category: 'Main Course',
          price: 28.99,
          description: 'Fresh Atlantic salmon grilled to perfection with herbs',
          isAvailable: true,
          dietaryInfo: ['Gluten-Free'],
          preparationTime: 20
        },
        {
          id: 'menu_2',
          name: 'Chicken Alfredo',
          category: 'Main Course',
          price: 22.99,
          description: 'Creamy pasta with grilled chicken and parmesan',
          isAvailable: true,
          dietaryInfo: [],
          preparationTime: 15
        },
        {
          id: 'menu_3',
          name: 'Caesar Salad',
          category: 'Appetizer',
          price: 12.99,
          description: 'Fresh romaine lettuce with caesar dressing and croutons',
          isAvailable: true,
          dietaryInfo: ['Vegetarian'],
          preparationTime: 10
        },
        {
          id: 'menu_4',
          name: 'Chocolate Lava Cake',
          category: 'Dessert',
          price: 8.99,
          description: 'Warm chocolate cake with molten center',
          isAvailable: true,
          dietaryInfo: ['Vegetarian'],
          preparationTime: 12
        },
        {
          id: 'menu_5',
          name: 'Vegetarian Pizza',
          category: 'Main Course',
          price: 18.99,
          description: 'Wood-fired pizza with fresh vegetables and mozzarella',
          isAvailable: true,
          dietaryInfo: ['Vegetarian'],
          preparationTime: 18
        }
      ];
      break;

    case 'feedback':
      initialData = [
        {
          id: 'feedback_1',
          customerName: 'John Doe',
          email: 'john@example.com',
          rating: 5,
          comment: 'Excellent service and amazing food! Will definitely come back.',
          date: '2024-01-20T19:30:00Z',
          category: 'Service'
        },
        {
          id: 'feedback_2',
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          rating: 4,
          comment: 'Great atmosphere and delicious meals. Slightly slow service.',
          date: '2024-01-19T20:15:00Z',
          category: 'Food'
        },
        {
          id: 'feedback_3',
          customerName: 'Mike Johnson',
          email: 'mike@example.com',
          rating: 5,
          comment: 'Perfect dining experience! The staff was very attentive.',
          date: '2024-01-18T18:45:00Z',
          category: 'Overall'
        }
      ];
      break;

    case 'bookings':
      initialData = [
        {
          id: 'booking_1',
          customerName: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0102',
          tableId: 'table_2',
          partySize: 4,
          date: new Date().toISOString().split('T')[0],
          time: '19:00',
          status: 'confirmed',
          specialRequests: 'Window seat preferred',
          createdAt: new Date().toISOString()
        },
        {
          id: 'booking_2',
          customerName: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0103',
          tableId: 'table_4',
          partySize: 2,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '20:00',
          status: 'pending',
          specialRequests: 'Anniversary dinner',
          createdAt: new Date().toISOString()
        }
      ];
      break;

    default:
      initialData = [];
  }

  setData(key, initialData);
  return initialData;
};

// Clear all data (for testing)
export const clearAllData = () => {
  const keys = ['users', 'chefs', 'tables', 'menu', 'feedback', 'bookings'];
  keys.forEach(key => {
    localStorage.removeItem(`hotel_${key}`);
  });
};
