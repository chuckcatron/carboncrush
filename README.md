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
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5 Turbo
- **Animations**: Framer Motion
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repository-url>
cd carbon-crush
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database migration:
   ```bash
   # Copy the SQL from supabase/migrations/001_initial_schema.sql
   # and run it in your Supabase SQL editor
   ```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Set Site URL to `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)
4. Configure email templates (optional)

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Tables

- **profiles**: User profiles with preferences and carbon goals
- **carbon_calculations**: Historical carbon footprint calculations
- **recommendations**: AI-generated recommendations and their status

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic timestamp handling
- Optimized indexes for performance
- Foreign key constraints for data integrity

## 🔐 Authentication Flow

1. **Signup**: Users create accounts with email verification
2. **Onboarding**: New users complete profile setup
3. **Session Management**: Automatic session handling with Supabase
4. **Profile Sync**: User data synced between auth and profiles table

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

- Hosted on renewable energy (Supabase)
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
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
OPENAI_API_KEY=your_openai_api_key
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
- Powered by [Supabase](https://supabase.com) for backend services
- AI recommendations by [OpenAI](https://openai.com)
- Icons by [Lucide](https://lucide.dev)
- Images from [Pexels](https://pexels.com)

---

**Start your climate action journey today! 🌱**