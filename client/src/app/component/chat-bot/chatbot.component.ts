import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  icon: string;
  gradient: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  agentName?: string;
}

interface KnowledgeItem {
  keywords: string[];
  reply: string;
}

@Component({
  selector: 'app-floating-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class FloatingChatbotComponent {
  isOpen = false;
  selectedAgentId = 'raima';
  message = '';
  isLoading = false;

  agents: Agent[] = [
    {
      id: 'raima',
      name: 'RAIma',
      role: 'Restaurant Website Help Assistant',
      status: 'online',
      icon: '🍽️',
      gradient: 'green'
    }
  ];

  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: 'Hello! I am RAIma, your restaurant website help assistant. Ask me how to login, register, view restaurants, check menus, place orders, cancel orders, or give feedback.',
      agentName: 'RAIma'
    }
  ];

  private knowledgeBase: KnowledgeItem[] = [
    {
      keywords: ['login', 'sign in', 'signin', 'how to login', 'log in'],
      reply:
        'To login, click on the Login option, enter your username and password, complete the Google reCAPTCHA verification, and then click Login. If your details are correct, you will be redirected to your dashboard.'
    },
    {
      keywords: ['register', 'signup', 'sign up', 'create account', 'new account'],
      reply:
        'To register, go to the Register page, enter your username, email, password, and select your role if available. Then submit the form. After successful registration, you can login using your username and password.'
    },
    {
      keywords: ['captcha', 'recaptcha', 'google captcha', 'verification'],
      reply:
        'Google reCAPTCHA is used during login to verify that you are a real user. Please tick the reCAPTCHA checkbox before clicking Login. If it fails, refresh the page and try again.'
    },
    {
      keywords: ['forgot password', 'reset password', 'password forgot'],
      reply:
        'Currently, password reset may not be available in this system. Please contact the admin or system owner to reset your password manually.'
    },
    {
      keywords: ['login failed', 'invalid login', 'wrong password', 'cannot login'],
      reply:
        'If login fails, please check your username and password, complete the reCAPTCHA, and try again. Also make sure you are registered. If the issue continues, contact the admin.'
    },
    {
      keywords: ['logout', 'sign out', 'log out'],
      reply:
        'To logout, click the Logout button or option in the navigation/menu. This will clear your login session and redirect you back to the login or landing page.'
    },
    {
      keywords: ['restaurant', 'restaurants', 'view restaurant', 'browse restaurant', 'available restaurants'],
      reply:
        'To view restaurants, go to the Restaurants section. You can browse available restaurants and check their details such as name, location, cuisine, address, email, and phone number.'
    },
    {
      keywords: ['menu', 'menu item', 'food items', 'view menu', 'check menu', 'items'],
      reply:
        'To view menu items, open the Menu section. You can see available food items with details like item name, menu type, price, quantity, and restaurant name.'
    },
    {
      keywords: ['search restaurant', 'filter restaurant', 'find restaurant'],
      reply:
        'You can search restaurants using the search/filter box on the restaurant page. Type the restaurant name, location, or cuisine to filter the results.'
    },
    {
      keywords: ['search menu', 'filter menu', 'find food', 'search food'],
      reply:
        'You can search menu items using the search box on the menu page. Try searching by food name, menu type, or restaurant name.'
    },
    {
      keywords: ['order', 'place order', 'how to order', 'buy food', 'book order'],
      reply:
        'To place an order, login as a customer, go to the Menu section, select the food items you want, and click the order/place order option. After placing the order, you can view it in the Orders section.'
    },
    {
      keywords: ['my orders', 'view order', 'order history', 'order status'],
      reply:
        'To view your orders, go to the Orders section after logging in. You can check your order details, order status, total amount, restaurant, and order time.'
    },
    {
      keywords: ['cancel order', 'delete order', 'remove order'],
      reply:
        'To cancel an order, go to the Orders section, find the order you want to cancel, and click the Cancel option. Once cancelled, the order status will change to CANCELLED.'
    },
    {
      keywords: ['order not placed', 'order failed', 'cannot order'],
      reply:
        'If your order is not placing, make sure you are logged in as a customer, selected valid menu items, and your backend/server is running. If the issue continues, refresh the page and try again.'
    },
    {
      keywords: ['feedback', 'give feedback', 'submit feedback', 'review', 'rating'],
      reply:
        'To give feedback, login and go to the Feedback section. Select the related restaurant or menu item if required, enter your comment and rating, then submit the feedback.'
    },
    {
      keywords: ['view feedback', 'my feedback', 'feedback response', 'admin reply'],
      reply:
        'You can view feedback in the Feedback section. If the admin has replied to your feedback, the response will be shown along with your feedback details.'
    },
    {
      keywords: ['feedback not submitting', 'cannot submit feedback', 'feedback failed'],
      reply:
        'If feedback is not submitting, make sure you are logged in, all required fields are filled, and the server is running. Also check that your rating/comment is valid.'
    },
    {
      keywords: ['customer', 'customer features', 'what customer can do'],
      reply:
        'As a customer, you can register, login, browse restaurants, view menu items, place orders, cancel orders, view your orders, and submit feedback.'
    },
    {
      keywords: ['manager', 'manager features', 'what manager can do'],
      reply:
        'As a manager, you can manage menu items for the assigned restaurant, view orders, and update or cancel order status depending on your access.'
    },
    {
      keywords: ['admin', 'admin features', 'what admin can do'],
      reply:
        'As an admin, you can create and manage restaurants, assign managers, view users, view feedback, and reply to customer feedback.'
    },
    {
      keywords: ['dashboard', 'home page', 'main page'],
      reply:
        'After login, you will be redirected to the dashboard. From there, you can navigate to restaurants, menu items, orders, feedback, and other sections based on your role.'
    },
    {
      keywords: ['assign manager', 'manager assign', 'assign restaurant'],
      reply:
        'Only an admin can assign a manager to a restaurant. Go to the Assign Manager section, select the restaurant and manager, then submit the assignment.'
    },
    {
      keywords: ['add restaurant', 'create restaurant', 'new restaurant'],
      reply:
        'Only an admin can add a restaurant. Go to the Restaurant section, fill in restaurant details such as name, location, address, cuisine, email, and phone number, then submit.'
    },
    {
      keywords: ['update restaurant', 'edit restaurant'],
      reply:
        'Only an admin can update restaurant details. Go to the Restaurant section, choose the restaurant, edit the required details, and save the changes.'
    },
    {
      keywords: ['delete restaurant', 'remove restaurant'],
      reply:
        'Only an admin can delete a restaurant. Go to the Restaurant section and click the delete option for the restaurant you want to remove.'
    },
    {
      keywords: ['add menu', 'add menu item', 'create menu item', 'new food item'],
      reply:
        'Managers can add menu items from the Menu section. Fill in item name, menu type, price, quantity, and restaurant details, then submit.'
    },
    {
      keywords: ['update menu', 'edit menu', 'edit menu item'],
      reply:
        'Managers can update menu items from the Menu section. Select the item, modify details like price, quantity, or name, and save the update.'
    },
    {
      keywords: ['delete menu', 'remove menu item', 'delete food'],
      reply:
        'Menu item deletion depends on role access. Usually, managers or admins should delete menu items from the Menu section.'
    },
    {
      keywords: ['user details', 'customers list', 'view users', 'all users'],
      reply:
        'Admins can view user/customer details from the Customer Details or Users section, depending on your navigation menu.'
    },
    {
      keywords: ['role', 'roles', 'access', 'permission'],
      reply:
        'This website has role-based access. Customers can order and give feedback. Managers can manage menu and orders. Admins can manage restaurants, managers, users, and feedback replies.'
    },
    {
      keywords: ['page not opening', 'route issue', 'cannot open page'],
      reply:
        'If a page is not opening, make sure you are logged in and have the correct role access. Some pages are only available for admin, manager, or customer users.'
    },
    {
      keywords: ['server error', 'backend error', 'api error', 'something went wrong'],
      reply:
        'If you see a server or API error, check whether the Spring Boot backend is running, MySQL is connected, and you are logged in with a valid token.'
    },
    {
      keywords: ['data not loading', 'restaurants not loading', 'menu not loading', 'orders not loading'],
      reply:
        'If data is not loading, refresh the page and check if the backend server is running. Also make sure you are logged in and have permission to access that section.'
    },
    {
      keywords: ['token expired', 'session expired', 'unauthorized', 'forbidden'],
      reply:
        'If your session is expired or you see unauthorized access, please logout and login again. Your login token may have expired or your role may not have permission for that page.'
    },
    {
      keywords: ['contact', 'help', 'support'],
      reply:
        'For help, you can contact the system admin or restaurant support team. If the issue is related to login, orders, or feedback, mention your username and the problem clearly.'
    },
    {
      keywords: ['how to use', 'guide', 'website guide'],
      reply:
        'Website guide: First register or login. Customers can browse restaurants, view menus, place orders, and give feedback. Managers can manage menu and orders. Admins can manage restaurants, users, managers, and feedback replies.'
    }
  ];

  get currentAgent(): Agent {
    return this.agents.find(agent => agent.id === this.selectedAgentId) || this.agents[0];
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  sendMessage(): void {
    const trimmedMessage = this.message.trim();

    if (!trimmedMessage || this.isLoading) {
      return;
    }

    this.messages.push({
      sender: 'user',
      text: trimmedMessage
    });

    this.message = '';
    this.isLoading = true;

    setTimeout(() => {
      this.messages.push({
        sender: 'bot',
        text: this.generateBotReply(trimmedMessage),
        agentName: this.currentAgent.name
      });

      this.isLoading = false;
    }, 500);
  }

  generateBotReply(userMessage: string): string {
    const lowerMessage = this.normalizeText(userMessage);

    const matchedItem = this.knowledgeBase.find(item =>
      item.keywords.some(keyword =>
        lowerMessage.includes(this.normalizeText(keyword))
      )
    );

    if (matchedItem) {
      return matchedItem.reply;
    }

    if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      return 'Hello! I am RAIma. I can help you with login, registration, restaurants, menus, orders, feedback, dashboard, and role-based website usage.';
    }

    if (
      lowerMessage.includes('thank') ||
      lowerMessage.includes('thanks')
    ) {
      return 'You are welcome! You can ask me anything about using this restaurant website.';
    }

    return this.getFallbackReply();
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s@]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getFallbackReply(): string {
    return 'I can help you with website-related questions. Try asking: "How to login?", "How to place order?", "How to give feedback?", "How to view menu?", "How to cancel order?", or "What can admin do?".';
  }

  getStatusClass(status: string): string {
    if (status === 'online') {
      return 'status-online';
    }

    if (status === 'busy') {
      return 'status-busy';
    }

    return 'status-offline';
  }

  getGradientClass(gradient: string): string {
    return `agent-${gradient}`;
  }
}