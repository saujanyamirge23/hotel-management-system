# Hotel Management System

A comprehensive hotel management system with React.js frontend and Spring Boot microservices backend. The system can run in two modes: **Full Stack** (with backend services) or **Frontend-Only** (with mock data for demo purposes).

## 🏨 Features

### 👨‍💼 Manager Portal
- **Dashboard**: Overview with key metrics and recent activity
- **Chef Management**: Hire, fire, and manage chef staff with CRUD operations
- **Table Management**: Monitor table status, manage bookings, and seating workflow
- **Menu Management**: Add, edit, and remove menu items with pricing
- **Analytics**: View customer feedback and ratings

### 👥 Customer Portal
- **Dashboard**: View available tables, waiting times, and quick stats
- **Menu Browser**: Browse menu with filtering, search, and dietary preferences
- **Table Booking**: Book tables with party size, preferred time, and wait estimation
- **Feedback System**: Submit feedback with star ratings and comments

## 🏗️ Architecture

### Backend (Spring Boot Microservices)
- **User Service** (Port 8081) - Chef and staff management
- **Table Service** (Port 8082) - Table bookings and waiting times
- **Menu Service** (Port 8083) - Menu items and pricing
- **Feedback Service** (Port 8084) - Customer feedback management

### Frontend (React.js)
- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Bootstrap** for responsive UI
- **Axios** for API communication
- **Mock API** for frontend-only deployment

## 🚀 Quick Start

### Option 1: Frontend-Only Demo (Recommended for Quick Setup)

This option runs the complete application with mock data - perfect for demos and development.

```bash
# Clone the repository
git clone <your-repo-url>
cd hotelmanagement

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the application
npm start
```

The application will open at `http://localhost:3000` with full functionality using mock data.

### Option 2: Full Stack Setup

#### Prerequisites
- **Java 17+**
- **Node.js 16+**
- **MySQL 8.0+**
- **Maven 3.6+**

#### Backend Setup
1. **Start MySQL** and create databases:
   ```sql
   CREATE DATABASE hotel_user_service;
   CREATE DATABASE hotel_table_service;
   CREATE DATABASE hotel_menu_service;
   CREATE DATABASE hotel_feedback_service;
   ```

2. **Configure each microservice**:
   - Navigate to each service directory (`user-service`, `table-service`, `menu-service`, `feedback-service`)
   - Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hotel_[service]_service
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Build and run each service**:
   ```bash
   # For each service directory
   mvn clean install
   mvn spring-boot:run
   ```

#### Frontend Setup (Full Stack Mode)
1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API endpoints** in `src/services/api.js` (if needed)

4. **Start the application**:
   ```bash
   npm start
   ```

## 🌐 Deployment

### Frontend-Only Deployment (No Backend Required)

The application includes a complete mock API system that provides full functionality without any backend dependencies.

#### Deploy to Netlify
1. **Build the project**:
   ```bash
   cd frontend
   npm run build:deploy
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `build` folder to [Netlify](https://app.netlify.com/drop)
   - Or use Netlify CLI:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=build
   ```

#### Deploy to Vercel
```bash
cd frontend
npm install -g vercel
vercel --prod
```

#### Deploy to GitHub Pages
1. **Update package.json** with your repository URL
2. **Deploy**:
   ```bash
   npm run build:deploy
   npm install -g gh-pages
   gh-pages -d build
   ```

### Full Stack Deployment

For production deployment with real backend services, consider:
- **Backend**: AWS EC2, Google Cloud, or Heroku
- **Database**: AWS RDS, Google Cloud SQL, or managed MySQL
- **Frontend**: Netlify, Vercel, or AWS S3 + CloudFront

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Data JPA** - Database abstraction
- **Hibernate** - ORM
- **MySQL** - Database
- **Maven** - Build tool

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **LocalStorage** - Data persistence (mock mode)

## 📡 API Endpoints

### User Service (Port 8081)
- `GET /api/chefs` - Get all chefs
- `POST /api/chefs` - Add new chef
- `PUT /api/chefs/{id}` - Update chef
- `DELETE /api/chefs/{id}` - Remove chef

### Table Service (Port 8082)
- `GET /api/tables` - Get all tables
- `POST /api/tables/book` - Book a table
- `GET /api/tables/waiting-time` - Get current waiting time

### Menu Service (Port 8083)
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add menu item
- `PUT /api/menu/{id}` - Update menu item
- `DELETE /api/menu/{id}` - Delete menu item

### Feedback Service (Port 8084)
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit feedback

## 🔧 Development

### Project Structure
```
hotelmanagement/
├── frontend/                 # React.js application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services and mock data
│   │   └── styles/          # CSS styles
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── user-service/            # Spring Boot microservice
├── table-service/           # Spring Boot microservice
├── menu-service/            # Spring Boot microservice
├── feedback-service/        # Spring Boot microservice
└── README.md               # This file
```

### Mock API Features
The frontend includes a complete mock API system (`src/services/mockAPI.js`) that provides:
- **Data Persistence**: Uses localStorage to maintain data across sessions
- **Realistic Delays**: 300ms network simulation for authentic UX
- **Full CRUD Operations**: All create, read, update, delete operations
- **Sample Data**: Pre-populated with realistic hotel data

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## 📝 License
This project is licensed under the MIT License.

## 🤝 Support
For support or questions, please open an issue in the GitHub repository.

---

**Note**: This system can run completely frontend-only with mock data, making it perfect for demos, development, and deployment without backend infrastructure.
