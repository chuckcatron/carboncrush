# GPT-4o Integration Setup Guide

Your CarbonCrush app now supports both Claude (Anthropic) and GPT-4o (OpenAI) for generating smart AI recommendations!

## 🚀 Quick Setup

### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Add to Environment Variables
In your `.env.local` file, uncomment and add your key:

```bash
# OpenAI (Add your OpenAI API key here to enable GPT-4o)
OPENAI_API_KEY="sk-your-actual-key-here"
```

### 3. Restart Your Development Server
```bash
npm run dev
```

## ✨ Features

### 🧠 Dual AI Provider System
- **Claude (Anthropic)**: Advanced reasoning and environmental expertise
- **GPT-4o (OpenAI)**: Fast, multimodal AI with broad knowledge

### 🔄 Smart Fallback System
- If primary AI provider fails, automatically tries the other
- Falls back to static recommendations if both AI providers fail
- Ensures users always get recommendations

### ⚙️ Provider Selection UI
- AI provider selector appears when multiple providers are available
- Shows provider status (enabled/disabled) based on API key configuration
- Displays which AI generated the recommendations
- Shows processing time for performance insights

### 🎯 Optimized Prompts
Both AI providers use the same comprehensive prompt system that includes:
- User's carbon footprint breakdown
- Detailed transportation, energy, and food data
- Location and household information
- Personalized recommendations with specific steps and cost savings

## 🔧 How It Works

### API Integration
- **Claude**: Uses `claude-3-5-sonnet-20241022` model
- **GPT-4o**: Uses `gpt-4o` model for fast, high-quality responses
- Both providers return identical JSON structure for consistency

### Provider Selection
Users can choose their preferred AI provider through the UI:
1. Click the "AI" button with settings icon
2. Select between Claude or GPT-4o
3. Generate recommendations with chosen provider

### Response Format
All AI providers return:
```json
{
  "recommendations": [...],
  "provider": "claude|gpt4o|fallback",
  "model": "model-name",
  "processingTime": 1234,
  "availableProviders": [...]
}
```

## 📊 Provider Information Display

The UI shows:
- **Provider Icon**: 🧠 for Claude, ⚡ for GPT-4o, 🔧 for fallback
- **Provider Name**: Full provider name and company
- **Processing Time**: How long the AI took to generate recommendations
- **Model Information**: Which specific model was used

## 🛠️ Configuration Options

### Environment Variables
```bash
# Both providers are optional - at least one should be configured
ANTHROPIC_API_KEY="sk-ant-..."  # For Claude
OPENAI_API_KEY="sk-..."         # For GPT-4o
```

### Provider Availability
- **No API keys**: Uses static fallback recommendations
- **One API key**: Uses that provider with fallback to static
- **Both API keys**: Full provider selection with smart fallback

## 🚀 Benefits

### For Users
- **Choice**: Pick their preferred AI provider
- **Reliability**: Always get recommendations thanks to fallback system
- **Transparency**: See which AI generated their recommendations
- **Performance**: Fast responses from both providers

### For Developers
- **Flexibility**: Easy to add new AI providers
- **Reliability**: Robust error handling and fallbacks
- **Maintainability**: Clean separation of concerns
- **Scalability**: Load balancing between providers

## 🔍 Testing

### With Claude Only
Set only `ANTHROPIC_API_KEY` - provider selector won't appear, uses Claude

### With GPT-4o Only  
Set only `OPENAI_API_KEY` - provider selector won't appear, uses GPT-4o

### With Both Providers
Set both API keys - provider selector appears, users can choose

### With No API Keys
Remove both keys - uses static fallback recommendations

## 🎉 Ready to Go!

Your app now has a robust, dual-AI recommendation system that provides users with choice, reliability, and transparency. The system is production-ready and will gracefully handle any API issues or provider outages.

Enjoy generating smart, personalized carbon footprint recommendations with the power of both Claude and GPT-4o! 🌱