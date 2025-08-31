// Chatbot Service - Handles AI API integration and conversation logic
import { tableAPI, menuAPI, feedbackAPI } from './mockAPI';

// Mock AI responses for demonstration - In production, replace with actual AI API calls
const mockAIResponses = {
  booking: [
    "I'd be happy to help you with a table booking! Let me check our availability.",
    "Great choice! Our restaurant offers an amazing dining experience. What date and time would you prefer?",
    "I can help you reserve a table. How many guests will be joining you?"
  ],
  menu: [
    "Our menu features exquisite dishes crafted by our expert chefs. Would you like to see our full menu or are you looking for something specific?",
    "I'd love to tell you about our menu! We have appetizers, main courses, and delicious desserts. What type of cuisine interests you?"
  ],
  policy: [
    "Here's our cancellation policy: You can cancel your reservation up to 2 hours before your booking time without any charges. For cancellations within 2 hours, a small fee may apply.",
    "Our hotel policies are designed to ensure the best experience for all guests. What specific policy would you like to know about?"
  ],
  general: [
    "I'm here to help with any questions about our hotel and restaurant services!",
    "How can I assist you today? I can help with bookings, menu information, or answer any questions about our services."
  ]
};

// FAQ Database
const faqDatabase = {
  "cancellation policy": {
    question: "What is your cancellation policy?",
    answer: "You can cancel your reservation up to 2 hours before your booking time without any charges. For cancellations within 2 hours, a small fee of $10 may apply. No-shows are charged the full reservation fee.",
    category: "policy"
  },
  "booking policy": {
    question: "How do I make a booking?",
    answer: "You can make a booking through our website, by calling us at (555) 123-4567, or by using this chat assistant. We require a valid email and phone number for all reservations.",
    category: "booking"
  },
  "payment policy": {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), cash, and digital payments (Apple Pay, Google Pay). Payment is required at the time of dining.",
    category: "payment"
  },
  "dress code": {
    question: "Is there a dress code?",
    answer: "We maintain a smart casual dress code. No shorts, flip-flops, or athletic wear in the dining room. Jackets are not required but appreciated for dinner service.",
    category: "policy"
  },
  "hours": {
    question: "What are your operating hours?",
    answer: "We're open Monday-Thursday: 11:00 AM - 10:00 PM, Friday-Saturday: 11:00 AM - 11:00 PM, Sunday: 10:00 AM - 9:00 PM. Kitchen closes 30 minutes before closing time.",
    category: "general"
  },
  "dietary restrictions": {
    question: "Do you accommodate dietary restrictions?",
    answer: "Absolutely! We offer vegetarian, vegan, gluten-free, and allergen-free options. Please inform us of any dietary restrictions when making your reservation or speak with your server.",
    category: "menu"
  },
  "parking": {
    question: "Is parking available?",
    answer: "Yes, we offer complimentary valet parking for all dining guests. Self-parking is also available in our adjacent garage with validation.",
    category: "general"
  },
  "private dining": {
    question: "Do you offer private dining?",
    answer: "Yes, we have private dining rooms available for groups of 8-50 people. Please contact our events team at events@grandpalace.com or call (555) 123-4568 to make arrangements.",
    category: "booking"
  }
};

// Intent detection using keywords
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('book') || lowerMessage.includes('reservation') || lowerMessage.includes('table')) {
    return 'booking';
  }
  if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish')) {
    return 'menu';
  }
  if (lowerMessage.includes('cancel') || lowerMessage.includes('policy') || lowerMessage.includes('refund')) {
    return 'policy';
  }
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
    return 'hours';
  }
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('card')) {
    return 'payment';
  }
  if (lowerMessage.includes('dress') || lowerMessage.includes('attire') || lowerMessage.includes('code')) {
    return 'dress code';
  }
  if (lowerMessage.includes('parking') || lowerMessage.includes('park') || lowerMessage.includes('valet')) {
    return 'parking';
  }
  if (lowerMessage.includes('dietary') || lowerMessage.includes('allergy') || lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
    return 'dietary restrictions';
  }
  if (lowerMessage.includes('private') || lowerMessage.includes('event') || lowerMessage.includes('group')) {
    return 'private dining';
  }
  
  return 'general';
};

// Generate contextual responses
const generateResponse = async (message, context) => {
  const intent = detectIntent(message);
  
  // Check if it's a direct FAQ match
  if (faqDatabase[intent]) {
    return {
      message: faqDatabase[intent].answer,
      actions: intent === 'booking' ? [
        { label: 'Book Now', text: 'I want to make a reservation' },
        { label: 'Check Availability', text: 'Show me available tables' }
      ] : []
    };
  }
  
  // Handle specific intents with dynamic data
  switch (intent) {
    case 'booking':
      if (context.isAuthenticated) {
        const tables = await tableAPI.getAllTables();
        const availableTables = tables.data.filter(t => t.status === 'available');
        return {
          message: `I can help you book a table! We currently have ${availableTables.length} tables available. Would you like to see our availability or make a reservation directly?`,
          actions: [
            { label: 'Check Availability', text: 'Show me available tables' },
            { label: 'Book Now', text: 'I want to make a reservation' },
            { label: 'View Menu', text: 'Show me the menu first' }
          ]
        };
      } else {
        return {
          message: "I'd love to help you with a booking! To make a reservation, you'll need to sign in first. This helps us manage your booking and send you confirmations.",
          actions: [
            { label: 'Sign In', text: 'I want to sign in' },
            { label: 'Browse Menu', text: 'Show me the menu' },
            { label: 'Check Availability', text: 'Show available tables' }
          ]
        };
      }
      
    case 'menu':
      const menuItems = await menuAPI.getAllMenuItems();
      const categories = [...new Set(menuItems.data.map(item => item.category))];
      return {
        message: `Our menu features ${menuItems.data.length} delicious items across ${categories.length} categories: ${categories.join(', ')}. Would you like to see the full menu or learn about a specific category?`,
        actions: [
          { label: 'View Full Menu', text: 'Show me the complete menu' },
          { label: 'Main Courses', text: 'Show me main course options' },
          { label: 'Appetizers', text: 'What appetizers do you have?' }
        ]
      };
      
    case 'policy':
      return {
        message: faqDatabase['cancellation policy'].answer + "\n\nWould you like to know about any other policies?",
        actions: [
          { label: 'Payment Policy', text: 'What payment methods do you accept?' },
          { label: 'Dress Code', text: 'What is your dress code?' },
          { label: 'Make Booking', text: 'I want to make a reservation' }
        ]
      };
      
    default:
      const responses = mockAIResponses[intent] || mockAIResponses.general;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      return {
        message: randomResponse,
        actions: [
          { label: 'Book Table', text: 'I want to make a reservation' },
          { label: 'View Menu', text: 'Show me your menu' },
          { label: 'Policies', text: 'What is your cancellation policy?' }
        ]
      };
  }
};

// Main chatbot API
export const chatbotAPI = {
  sendMessage: async ({ message, userId, context }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    try {
      const response = await generateResponse(message, context);
      return { data: response };
    } catch (error) {
      console.error('Chatbot API error:', error);
      return {
        data: {
          message: "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team at (555) 123-4567.",
          actions: []
        }
      };
    }
  },
  
  getFAQs: () => {
    return Object.values(faqDatabase);
  },
  
  searchFAQs: (query) => {
    const results = Object.values(faqDatabase).filter(faq => 
      faq.question.toLowerCase().includes(query.toLowerCase()) ||
      faq.answer.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }
};

// Export FAQ categories for UI
export const faqCategories = {
  booking: "Reservations & Booking",
  menu: "Menu & Dining",
  policy: "Policies & Rules",
  payment: "Payment & Billing",
  general: "General Information"
};
