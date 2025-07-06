# Aloha Shield AI - Hawaii Climate Insurance Platform

A comprehensive climate insurance platform specifically designed for Hawaii residents, providing specialized coverage for earthquake, volcano, and flood risks with AI-powered assessment and real-time premium calculations.

![Platform Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL-blue)
![Authentication](https://img.shields.io/badge/Auth-Replit%20OAuth-purple)

## 🌺 Features

### Core Insurance Services
- **Earthquake Insurance**: Fault line proximity analysis and seismic risk assessment
- **Volcano Insurance**: Lava zone mapping with real-time eruption probability modeling
- **Flood Insurance**: FEMA zone integration with elevation-based risk calculation
- **AI-Powered Risk Assessment**: GPT-4o analyzes property data and Hawaii-specific risks

### Advanced Capabilities
- **Document Processing**: OCR-enabled insurance document handling with Tesseract.js
- **Multi-Language Support**: English and Spanish language options
- **Real-Time Premium Calculator**: Dynamic pricing based on property characteristics
- **AR Property Assessment**: Virtual property inspection with risk factor identification
- **Emergency Kit Generator**: Personalized emergency preparedness recommendations

### Educational & Simulation Tools
- **Volcano Risk Simulation**: Interactive volcanic activity modeling
- **Climate Learning Modules**: Gamified educational content with achievements
- **3D Risk Visualization**: WebGL-powered environmental risk displays

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript and modern hooks
- **Vite** for optimized development and production builds
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** with custom Hawaii-themed design system
- **TanStack Query** for server state management and caching
- **Wouter** for lightweight client-side routing

### Backend
- **Node.js 20** with Express.js and TypeScript
- **PostgreSQL 16** with Neon serverless driver
- **Drizzle ORM** with automatic migrations and type safety
- **Replit Auth** with OpenID Connect integration
- **Session management** with PostgreSQL storage

### AI & Processing
- **OpenAI GPT-4o** for insurance quotes and customer chat
- **Tesseract.js** for OCR text extraction from documents
- **Chart.js & Recharts** for data visualization
- **Three.js** for 3D risk simulations

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- OpenAI API key
- Replit account (for authentication)

### Installation

```bash
# Clone the repository
git clone https://github.com/ethereumdevnews/aloha-shield-ai.git
cd aloha-shield-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Authentication
REPL_ID=your-replit-app-id
REPLIT_DOMAINS=your-app-domain.replit.dev
SESSION_SECRET=your-session-secret

# AI Services
OPENAI_API_KEY=your-openai-api-key
```

### Database Setup

```bash
# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── contexts/      # React contexts
├── server/                 # Express backend API
│   ├── services/          # Business logic services
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── replitAuth.ts      # Authentication setup
├── shared/                 # Shared TypeScript schemas
└── uploads/               # Document storage directory
```

## 🌊 API Documentation

### Authentication Endpoints
```
GET  /api/auth/user         # Get current user profile
GET  /api/login            # Initiate Replit Auth flow  
GET  /api/callback         # Auth callback handler
GET  /api/logout           # Sign out and clear session
```

### Insurance Operations
```
POST /api/quotes           # Generate new insurance quote
POST /api/calculate-premium # Real-time premium calculation
POST /api/chat             # AI chat assistant
```

### Document Management
```
POST /api/documents/upload          # Upload insurance documents
GET  /api/customers/:id/documents   # List customer documents
DELETE /api/documents/:id           # Remove document
```

## 🌺 Hawaii-Specific Features

### Risk Factors
- **Volcanic Activity**: Real-time monitoring of Kilauea and Mauna Loa
- **Seismic Data**: USGS earthquake monitoring and fault line mapping
- **Flood Zones**: FEMA flood zone designation and storm surge modeling
- **Elevation Analysis**: Sea level rise projections and tsunami risk

### Cultural Integration
- **Hawaiian Language Support**: Native Hawaiian translations and terminology
- **Local Emergency Resources**: Hawaii-specific emergency preparedness
- **Community Features**: Integration with local insurance providers (HPIA)

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Update database schema
npm run db:studio    # Open Drizzle Studio
```

### Code Quality
- **TypeScript**: Strict mode with comprehensive type checking
- **ESLint**: Code quality and consistency enforcement
- **Drizzle ORM**: Type-safe database operations
- **Zod Validation**: Runtime schema validation

## 🌍 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Setup
- Configure PostgreSQL database with SSL
- Set up session storage with proper TTL
- Configure CORS for your domain
- Set secure cookie options for production

### Replit Deployment
The application is optimized for Replit Deployments with:
- Automatic builds and health checks
- TLS certificate management
- Custom domain support
- Environment variable management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏝 About Hawaii Climate Insurance

This platform addresses the unique climate risks faced by Hawaii residents, providing comprehensive coverage and education for volcanic activity, seismic events, and flood risks. Built with modern web technologies and AI-powered assessment tools, it offers personalized insurance solutions for the diverse communities across the Hawaiian Islands.

## 📞 Support

For support, email support@alohashield.ai or join our community Discord.

---

Made with 🌺 for the people of Hawaii
