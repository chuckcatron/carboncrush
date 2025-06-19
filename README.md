# CarbonCrush - Climate Action Platform

A gamified platform that makes climate action fun, social, and rewarding. Track your carbon footprint, get AI-powered recommendations, and join a community of climate warriors.

## 🌱 Features

- **Carbon Footprint Calculator**: Comprehensive tracking across transportation, energy, food, shopping, and waste
- **AI-Powered Recommendations**: Personalized suggestions using OpenAI to reduce your environmental impact
- **Community Challenges**: Join climate action challenges with friends and compete on leaderboards
- **Rewards System**: Earn points and redeem real-world sustainable rewards
- **Business Directory**: Discover eco-friendly businesses in your area
- **Progress Tracking**: Monitor your climate journey with detailed analytics

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **AI**: OpenAI GPT-3.5 Turbo
- **Animations**: Framer Motion
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Neon database account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd carbon-crush
npm install
```

### 2. Neon Database Setup

1. Create a new project at [neon.tech](https://neon.tech)
2. Get your database connection string from the dashboard
3. Run the database migration:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Tables

- **users**: User profiles with preferences and carbon goals
- **carbon_calculations**: Historical carbon footprint calculations
- **recommendations**: AI-generated recommendations and their status

### Key Features

- PostgreSQL with Drizzle ORM
- Type-safe database operations
- Automatic timestamp handling
- Foreign key constraints for data integrity

## 🔐 Authentication Flow

1. **Signup**: Users create accounts with email/password
2. **Onboarding**: New users complete profile setup
3. **Session Management**: JWT-based sessions with NextAuth.js
4. **Profile Sync**: User data managed through API routes

## 🤖 AI Recommendations

The AI recommendation system:

1. Analyzes user's carbon footprint data
2. Considers user profile and location
3. Generates personalized, actionable recommendations
4. Provides fallback recommendations if AI fails
5. Tracks implementation status and impact

## 🎮 Gamification Features

- **Points System**: Earn points for climate actions
- **Achievements**: Unlock badges for milestones
- **Leaderboards**: Compete with community members
- **Challenges**: Participate in time-limited climate challenges
- **Rewards Store**: Redeem points for real-world rewards

## 🌍 Environmental Impact

CarbonCrush is built with sustainability in mind:

- Hosted on renewable energy (Neon)
- Optimized for performance to reduce energy consumption
- Promotes real-world climate action
- Partners with eco-friendly businesses

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your_production_neon_database_url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your_production_secret"
OPENAI_API_KEY="your_openai_api_key"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [bolt.new](https://bolt.new) - AI-powered development platform
- Powered by [Neon](https://neon.tech) for database services
- AI recommendations by [OpenAI](https://openai.com)
- Icons by [Lucide](https://lucide.dev)
- Images from [Pexels](https://pexels.com)

---

**Start your climate action journey today! 🌱**