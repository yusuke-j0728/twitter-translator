/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
    DEEPL_API_KEY: process.env.DEEPL_API_KEY,
  },
}

module.exports = nextConfig