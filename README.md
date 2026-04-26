# FivePrayer Times

A prayer times application built with Next.js, displaying Islamic prayer times in English and Arabic.

## Features

- Real-time prayer times fetched from FivePrayer API
- Bilingual support (English/Arabic) with instant language switching
- Live clock with Arabic numeral support
- Dynamic next prayer calculation based on current time
- Daily auto-refresh at midnight for next day's prayer times
- Beautiful gradient UI with responsive design
- RTL support for Arabic text

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   ```sh
   cp .env.example .env.local
   ```
   Then add your FivePrayer API key to `.env.local`:
   ```
   FIVEPRAYER_API_KEY=your_api_key_here
   ```

### Development

```sh
npm run dev
```

The site will be available at `http://localhost:3000`

### Build

```sh
npm run build
```

### Preview

```sh
npm run start
```

## 📁 Project Structure

```text
/
├── app/
│   ├── api/
│   │   └── prayer-times/
│   │       └── route.ts
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── NextPrayer.tsx
│   │   ├── PrayerItem.tsx
│   │   └── PrayerSchedule.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── api.ts
├── public/
├── .env.example
├── .env.local
├── next.config.js
├── package.json
└── tsconfig.json
```

## 🔐 API Key

The API key is stored in the `.env.local` file (not committed to git). Use `.env.example` as a template for your local setup.

## 🛠 Tech Stack

- **Framework**: Next.js 16.x
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: FivePrayer API
- **Deployment**: Vercel
- **Node.js**: >= 18.0.0

## 🏗 Architecture

### Component Structure

- **page.tsx**: Main page component that:
  - Fetches prayer times from the API
  - Manages state and data fetching
  - Coordinates child components
- **LanguageSwitcher.tsx**: Language toggle component
- **Header.tsx**: Displays title, date, and live clock
- **NextPrayer.tsx**: Shows next prayer card
- **PrayerItem.tsx**: Individual prayer row with highlighting
- **PrayerSchedule.tsx**: Full prayer schedule list
- **Footer.tsx**: Timezone and attribution
- **route.ts**: API route that fetches prayer times from FivePrayer API
- **api.ts**: API client for FivePrayer API

### Data Flow

1. **Page Load**: Client fetches prayer times from `/api/prayer-times`
2. **API Endpoint**: Calls FivePrayer API with the API key
3. **Display**: Prayer times rendered in the UI
4. **Updates**: Next prayer recalculates every minute
5. **Midnight**: Prayer times refresh for the new day

### Client-Side Features

- **Dynamic Prayer Calculation**: Next prayer calculated based on current time
- **Periodic Updates**: Next prayer updates every minute
- **Language Switching**: Instant toggle between English and Arabic

### Server-Side Features

- **API Routes**: Server-side API calls for fresh prayer times
- **Daily Auto-Refresh**: Prayer times automatically refresh at midnight

## 🚢 Deployment

This project supports multiple deployment platforms. Choose based on your needs:

### Option 1: Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

#### Setup Steps

1. **Install Vercel CLI**:
   ```sh
   npm i -g vercel
   ```

2. **Deploy**:
   ```sh
   vercel
   ```
   Follow the prompts to link your project.

3. **Add Environment Variable**:
   - Go to your Vercel project dashboard
   - Settings > Environment Variables
   - Name: `FIVEPRAYER_API_KEY`
   - Value: Your API key
   - Add to: Production, Preview, Development

4. **Redeploy**:
   ```sh
   vercel --prod
   ```

#### Benefits
- Native Next.js support
- Automatic HTTPS
- Global CDN
- Preview deployments for every branch
- Server-side API routes

### Option 2: Netlify

Netlify also supports Next.js applications.

#### Setup Steps

1. **Install Netlify CLI**:
   ```sh
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```sh
   netlify deploy --prod
   ```
   Follow the prompts to link your project.

3. **Add Environment Variable**:
   - Go to your Netlify site dashboard
   - Site settings > Environment variables
   - Key: `FIVEPRAYER_API_KEY`
   - Value: Your API key

4. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

#### Benefits
- Next.js support
- Automatic HTTPS
- Form handling
- Edge functions

### Option 3: Docker

For self-hosting or custom deployment.

#### Setup Steps

1. **Build Docker image**:
   ```sh
   docker build -t fiveprayer-api .
   ```

2. **Run container**:
   ```sh
   docker run -p 3000:3000 -e FIVEPRAYER_API_KEY=your_key fiveprayer-api
   ```

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIVEPRAYER_API_KEY` | FivePrayer API key for fetching prayer times | Yes |

## 🐛 Troubleshooting

### Prayer Times Not Loading

- Check that your API key is valid
- Verify the API key is in the `.env.local` file locally
- For production, ensure `FIVEPRAYER_API_KEY` is set in your deployment platform

### Next Prayer Not Updating

- Ensure JavaScript is enabled in your browser
- Check the browser console for errors
- The next prayer updates every minute automatically
- **Recent Fix**: Updated to use API's next_prayer data for accurate highlighting in both languages

### Next Prayer Highlight Wrong in Arabic

- The app now uses the API's next_prayer data directly for highlighting
- This ensures correct prayer highlighting regardless of language (English/Arabic)

### Deployment Issues

- Verify environment variables are set in your deployment platform
- Check deployment logs for errors
- Ensure the API key is correctly configured

### Local Development Issues

- Ensure you're running `npm run dev` from the project root
- Check that port 3000 is not already in use
- Verify Node.js version is >= 18.0.0

## 📝 Development Workflow

1. Make changes locally
2. Test with `npm run dev`
3. Commit changes:
   ```sh
   git add .
   git commit -m "Your message"
   ```
4. Push to GitHub:
   ```sh
   git push origin main
   ```
5. Deploy to your platform (Vercel/Netlify/etc.)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/my-feature`
6. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [FivePrayer API](https://fiveprayer.com/) for prayer times data
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
