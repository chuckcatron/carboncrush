# CarbonCrush - Climate Action Platform

A gamified platform that makes climate action fun, social, and rewarding. Track your carbon footprint, get AI-powered recommendations, and join a community of climate warriors.

## 🌱 Features

- **Carbon Footprint Calculator**: Comprehensive tracking across transportation, energy, food, shopping, and waste
- **AI-Powered Recommendations**: Personalized suggestions using Anthropic Claude to reduce your environmental impact
- **Community Challenges**: Join climate action challenges with friends and compete on leaderboards
- **Rewards System**: Earn points and redeem real-world sustainable rewards
- **Business Directory**: Discover eco-friendly businesses in your area powered by Google Places API
- **Progress Tracking**: Monitor your climate journey with detailed analytics
- **Premium Features**: Advanced analytics, unlimited AI recommendations, and carbon offset marketplace
- **Monetization**: Multiple revenue streams including subscriptions, carbon offsets, and business partnerships

## 💰 Monetization Strategy

### 1. **Freemium Subscription Model**
- **Free Tier**: Basic carbon calculator, 3 AI recommendations/month, community features
- **Pro Tier ($9.99/month)**: Unlimited AI recommendations, advanced analytics, carbon offset marketplace
- **Business Tier ($49.99/month)**: Team collaboration, API access, custom branding, compliance reporting

### 2. **Carbon Offset Marketplace**
- Commission-based sales of verified carbon offset projects
- 10-15% commission on offset purchases
- Partnership with verified project developers worldwide
- Estimated revenue: $25K-50K/month

### 3. **Business Partnerships & Affiliate Marketing**
- Partner with sustainable brands (Tesla, Patagonia, solar companies)
- 5-15% commission on referred sales
- Featured placement fees for premium partners
- Estimated revenue: $15K-30K/month

### 4. **B2B Solutions**
- Corporate sustainability dashboards
- Employee engagement programs
- ESG reporting tools
- White-label solutions
- Estimated revenue: $30K-100K/month

### 5. **Data & Analytics (Privacy-Compliant)**
- Aggregated sustainability insights for researchers
- Market trends for sustainable product companies
- Anonymous behavioral data for climate organizations
- Estimated revenue: $10K-25K/month

## 🚀 Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js or Supabase Auth
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **AI**: Anthropic Claude 3 Sonnet
- **Maps**: Google Places API for business directory
- **Payments**: Stripe for subscriptions and carbon offset purchases
- **Animations**: Framer Motion
- **Charts**: Chart.js with React Chart.js 2
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key
- Google Places API key
- Stripe account (for payments)

### 1. Clone and Install

```bash
git clone <repository-url>
cd carbon-crush
npm install
```

### 2. Supabase Setup

#### Option A: Create New Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to get your keys
3. Copy the migration files to set up your database schema

#### Option B: Use Existing Database
1. Use your existing PostgreSQL database URL
2. Run the migrations manually

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase (recommended)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Or direct PostgreSQL connection
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Anthropic
ANTHROPIC_API_KEY="your-anthropic-api-key"

# Google Places API
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optional)
RESEND_API_KEY="your-resend-api-key"
```

### 4. Database Setup

If using Supabase:
```bash
# The migration files are already created in supabase/migrations/
# Apply them through the Supabase dashboard or CLI
```

If using direct PostgreSQL:
```bash
npm run db:generate
npm run db:migrate
```

### 5. Get Your API Keys

#### Supabase Keys
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Copy the service_role key (keep this secret!)

#### Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

#### Google Places API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

#### Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable and secret keys from the API section
3. Set up webhook endpoints for subscription management

#### NextAuth Secret
Generate a secure secret for NextAuth:
```bash
openssl rand -base64 32
```

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 💳 Payment Integration

### Stripe Setup
1. Create products in Stripe Dashboard:
   - Climate Pro ($9.99/month)
   - Climate Business ($49.99/month)
2. Set up webhook endpoints for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Carbon Offset Payments
- Integrate with verified carbon offset providers
- Set up commission tracking
- Implement certificate generation

## 📊 Revenue Projections

### Year 1 Targets
- **Users**: 10,000 free, 1,000 pro, 50 business
- **Monthly Revenue**: $25K-50K
- **Annual Revenue**: $300K-600K

### Year 2 Targets
- **Users**: 50,000 free, 5,000 pro, 200 business
- **Monthly Revenue**: $100K-200K
- **Annual Revenue**: $1.2M-2.4M

### Revenue Breakdown
- Subscriptions: 60%
- Carbon Offsets: 25%
- Partnerships: 10%
- B2B Solutions: 5%

## 🗄️ Database Options

### Supabase (Recommended)
- **Pros**: Built-in auth, real-time subscriptions, edge functions, file storage
- **Cons**: Vendor lock-in
- **Best for**: Full-stack applications with real-time features

### Direct PostgreSQL
- **Pros**: Full control, no vendor lock-in, can use any PostgreSQL provider
- **Cons**: Need to implement auth and real-time features separately
- **Best for**: Custom setups, existing infrastructure

## 🔐 Authentication Options

### Option 1: Supabase Auth (Recommended)
```typescript
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider';

const { user, signIn, signUp, signOut } = useSupabaseAuth();
```

### Option 2: NextAuth.js (Current Implementation)
```typescript
import { useAuth } from '@/contexts/AuthContext';

const { user, login, signup, logout } = useAuth();
```

## 📊 Using Supabase Features

### Real-time Subscriptions
```typescript
import { useSupabaseSubscription } from '@/hooks/useSupabase';

const recommendations = useSupabaseSubscription('recommendations', 
  `user_id=eq.${userId}`,
  (payload) => {
    console.log('Real-time update:', payload);
  }
);
```

### Database Queries
```typescript
import { useSupabaseQuery, useSupabaseMutation } from '@/hooks/useSupabase';

// Query data
const { data, loading, error } = useSupabaseQuery('carbon_calculations', 
  'id, calculation_data, results, created_at'
);

// Mutations
const { insert, update, remove } = useSupabaseMutation();
```

### File Storage
```typescript
import { supabase } from '@/lib/supabase';

// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.png', file);

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-avatar.png');
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_production_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_production_service_role_key"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your_production_secret"
ANTHROPIC_API_KEY="your_anthropic_api_key"
GOOGLE_PLACES_API_KEY="your_google_places_api_key"
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
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
- AI recommendations by [Anthropic Claude](https://anthropic.com)
- Maps by [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- Payments by [Stripe](https://stripe.com)
- Icons by [Lucide](https://lucide.dev)
- Images from [Pexels](https://pexels.com)

---

**Start your climate action journey today and build a sustainable business! 🌱💰**