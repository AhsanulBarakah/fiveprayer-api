# FivePrayer Times

A prayer times application built with Astro, displaying Islamic prayer times in English and Arabic.

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

- Node.js >= 24.0.0

### Installation

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   ```sh
   cp .env.example .env
   ```
   Then add your FivePrayer API key to `.env`:
   ```
   FIVEPRAYER_API_KEY=your_api_key_here
   ```

### Development

```sh
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

```sh
npm run build
```

### Preview

```sh
npm run preview
```

## 📁 Project Structure

```text
/
├── public/
├── src
│   ├── components/
│   │   └── PrayerTimes.astro
│   ├── lib/
│   │   └── api.ts
│   ├── layouts/
│   └── pages/
│       └── index.astro
├── .env.example
└── package.json
```

## 🔐 API Key

The API key is stored in the `.env` file (not committed to git). Use `.env.example` as a template for your local setup.

## 🛠 Tech Stack

- **Framework**: Astro 6.x
- **Language**: TypeScript
- **Styling**: Inline CSS with scoped styles
- **API**: FivePrayer API
- **Deployment**: GitHub Pages via GitHub Actions
- **Node.js**: >= 24.0.0

## 🏗 Architecture

### Component Structure

- **PrayerTimes.astro**: Main component that:
  - Fetches prayer times from the API
  - Displays prayer schedule
  - Handles language switching
  - Updates next prayer dynamically
  - Refreshes data at midnight

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

### Server-Side Features (Vercel/Netlify Only)

- **Daily Auto-Refresh**: Prayer times automatically refresh at midnight when deployed to Vercel or Netlify
- **API Endpoints**: Server-side API calls for fresh prayer times

## 🚢 Deployment

This project supports multiple deployment platforms. Choose based on your needs:

### Option 1: Vercel (Recommended)

Vercel supports server-side functions, enabling daily auto-refresh of prayer times.

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
- Server-side functions for daily auto-refresh
- Automatic HTTPS
- Global CDN
- Preview deployments for every branch

### Option 2: Netlify

Netlify also supports server-side functions for daily auto-refresh.

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
   - Publish directory: `dist`

#### Benefits
- Server-side functions for daily auto-refresh
- Automatic HTTPS
- Form handling
- Edge functions

### Option 3: GitHub Pages (Static Only)

GitHub Pages is a static hosting service with limitations.

#### Setup Steps

1. **Push to GitHub**: Ensure your code is pushed to the main branch
2. **Add API Key Secret**:
   - Go to repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `FIVEPRAYER_API_KEY`
   - Value: Your API key
   - Click "Add secret"
3. **Configure GitHub Pages**:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"
   - Save the changes

#### Deployment Workflow

The `.github/workflows/deploy.yml` file handles:
- Building the site with Node.js 24
- Passing the API key as an environment variable
- Deploying to GitHub Pages using official GitHub Actions

#### Automatic Deployments

Every push to the `main` branch triggers:
- Automatic build
- Deployment to GitHub Pages
- Site updates at: `https://username.github.io/fiveprayer-astro/`

#### Limitations
- **No server-side functions**: Prayer times are static (fetched during build)
- **No daily auto-refresh**: Must redeploy to update prayer times
- **No API endpoints**: Client-side API calls won't work

**Recommendation**: Use Vercel or Netlify for full functionality including daily auto-refresh.

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FIVEPRAYER_API_KEY` | FivePrayer API key for fetching prayer times | Yes |

## 🐛 Troubleshooting

### Prayer Times Not Loading

- Check that your API key is valid
- Verify the API key is in the `.env` file locally
- For production, ensure `FIVEPRAYER_API_KEY` is set in GitHub Secrets

### Next Prayer Not Updating

- Ensure JavaScript is enabled in your browser
- Check the browser console for errors
- The next prayer updates every minute automatically
- **Recent Fix**: Updated time parsing to handle 12-hour format (AM/PM) correctly

### Next Prayer Highlight Wrong

- The app now properly converts 12-hour time format (e.g., "5:30 PM") to 24-hour format for comparison
- This ensures the correct next prayer is highlighted based on current time

### Deployment Issues

- Verify GitHub Pages is set to "GitHub Actions"
- Check the Actions tab for workflow errors
- Ensure the API key secret is added to GitHub

### Local Development 404 Error

- The base path is set to `/` for local development
- For production, it's set to `/fiveprayer-astro/`
- This is handled automatically via `import.meta.env.PROD`

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
5. GitHub Actions automatically deploys to GitHub Pages

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
- [Astro](https://astro.build/) for the framework
- GitHub Pages for hosting
