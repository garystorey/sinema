const fs = require('fs');
const path = require('path');

// Read .env file as fallback for local development
const envPath = path.resolve(__dirname, '..', '.env');
const envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
}

// process.env takes priority over .env file
const tmdbApiKey = process.env.TMDB_API_KEY || envVars.TMDB_API_KEY || '';
const tmdbBaseUrl =
  process.env.TMDB_BASE_URL ||
  envVars.TMDB_BASE_URL ||
  'https://api.themoviedb.org/3';

if (!tmdbApiKey) {
  console.warn(
    'WARNING: TMDB_API_KEY is not set. Please add it to .env or set it as an environment variable.'
  );
}

const envDir = path.resolve(__dirname, '..', 'src', 'environments');
fs.mkdirSync(envDir, { recursive: true });

// Generate environment.ts (development)
fs.writeFileSync(
  path.join(envDir, 'environment.ts'),
  `export const environment = {
  production: false,
  tmdbApiKey: '${tmdbApiKey}',
  tmdbBaseUrl: '${tmdbBaseUrl}',
};
`
);

// Generate environment.prod.ts (production)
fs.writeFileSync(
  path.join(envDir, 'environment.prod.ts'),
  `export const environment = {
  production: true,
  tmdbApiKey: '${tmdbApiKey}',
  tmdbBaseUrl: '${tmdbBaseUrl}',
};
`
);

console.log('Environment files generated successfully.');
