# MFTracker - Real-time Mutual Fund Portfolio Tracker

A comprehensive web application for tracking mutual fund investments with real-time data integration using the **mftool** Python library. Built with **TypeScript**, **React**, **Vite**, and **Python Flask**.

## ✨ Features

### 📊 Dashboard
- Real-time portfolio overview with total value and returns
- Live mutual fund performance tracking
- Market summary and insights
- Auto-refresh every 5 minutes for live data

### 🏢 Mutual Funds
- Browse all available mutual funds with real-time NAV data
- Search and filter funds by name, code, or category
- Detailed fund information including expense ratio, fund size, AMC details
- Historical NAV charts and performance data
- Fund comparison and analysis tools

### 💼 Portfolio Management
- Add, edit, and remove mutual fund holdings
- Track investment performance and returns
- Portfolio allocation visualization with interactive charts
- Real-time gain/loss calculations

### 🔌 Real-time Data Integration
- **MFTool API Integration**: Fetches live mutual fund data from Indian markets
- **Auto-refresh**: Data updates automatically every 5 minutes
- **Live NAV**: Current Net Asset Values for all funds
- **Market Status**: Real-time market open/close status

## 🛠️ Technology Stack

### Backend
- **Python 3.8+** with Flask framework
- **MFTool**: Python library for mutual fund data
- **Flask-CORS**: Cross-origin resource sharing
- **Python-dotenv**: Environment variable management

### Frontend
- **React 18** with TypeScript
- **Vite**: Fast development and building
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization and charts
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API calls

### Development Tools
- **TypeScript**: Type-safe development
- **ESLint**: Code quality and consistency
- **PostCSS & Autoprefixer**: CSS processing
- **Concurrently**: Run multiple commands simultaneously

## 🚀 Getting Started

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MFTracker
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```
   This command will install:
   - Root project dependencies
   - Frontend dependencies
   - Python backend dependencies

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   FLASK_ENV=development
   PORT=5000
   ```

### Running the Application

1. **Start both servers (recommended)**
   ```bash
   npm run dev
   ```
   This starts both the Python backend (port 5000) and React frontend (port 3000)

2. **Run servers individually**
   ```bash
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
MFTracker/
├── server/                 # Python Flask backend
│   ├── app.py             # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── client/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   └── tailwind.config.js # Tailwind CSS config
├── package.json           # Root project configuration
└── README.md             # Project documentation
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server health and MFTool status

### Mutual Funds
- `GET /api/funds` - Get all mutual funds with details
- `GET /api/funds/{id}` - Get specific fund details
- `GET /api/funds/search?q={query}&category={category}` - Search funds
- `GET /api/funds/categories` - Get all fund categories

### Portfolio
- `GET /api/portfolio` - Get portfolio holdings (sample data)

### Market Data
- `GET /api/market/summary` - Market overview and trending funds

## 📊 Data Sources

### MFTool Integration
The application uses the **mftool** Python library to fetch real-time mutual fund data from Indian markets:

- **Live NAV Data**: Current Net Asset Values
- **Fund Details**: Expense ratios, fund size, AMC information
- **Historical Data**: NAV history for performance analysis
- **Scheme Information**: Comprehensive fund scheme details

### Real-time Features
- **Auto-refresh**: Data updates every 5 minutes
- **Live Market Status**: Real-time market open/close information
- **Current NAV**: Latest available NAV values
- **Performance Tracking**: Historical performance data

## 🎨 UI Components

### Dashboard
- Portfolio summary cards
- Market overview
- Recent fund performance
- Quick action buttons

### Funds List
- Searchable and filterable fund table
- Sortable columns (name, code, NAV, category)
- Real-time data with refresh capability
- Category-based filtering

### Fund Details
- Comprehensive fund information
- NAV history charts
- Performance metrics
- Scheme details

### Portfolio
- Holdings management
- Performance tracking
- Allocation charts
- Add/edit/delete functionality

## 🔧 Configuration

### Vite Configuration
- Development server on port 3000
- API proxy to backend (port 5000)
- TypeScript and React support
- Hot module replacement

### Tailwind CSS
- Custom color palette
- Responsive design utilities
- Component-based styling
- Dark mode support ready

### Python Backend
- Flask development server
- CORS enabled for frontend
- Environment variable support
- Error handling and logging

## 🚀 Deployment

### Production Build
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the Python backend:
   ```bash
   cd server
   pip install -r requirements.txt
   gunicorn app:app
   ```

### Environment Variables
- `FLASK_ENV`: Set to 'production' for production
- `PORT`: Backend server port (default: 5000)
- `FLASK_DEBUG`: Debug mode (default: False)

## 🔮 Future Enhancements

### Planned Features
- **User Authentication**: Secure login and user management
- **Database Integration**: Persistent portfolio storage
- **Real-time Notifications**: Price alerts and updates
- **Advanced Analytics**: Performance analysis and insights
- **Mobile App**: React Native mobile application
- **API Rate Limiting**: Optimized data fetching
- **Caching**: Redis-based data caching
- **WebSocket**: Real-time data streaming

### Technical Improvements
- **Testing**: Unit and integration tests
- **CI/CD**: Automated deployment pipeline
- **Monitoring**: Application performance monitoring
- **Security**: Enhanced security measures
- **Documentation**: API documentation with Swagger

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🙏 Acknowledgments

- **MFTool**: Python library for mutual fund data
- **React Team**: Frontend framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Charting library
- **Lucide**: Icon library

---

**MFTracker** - Empowering investors with real-time mutual fund insights and portfolio management tools.

