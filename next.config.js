/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    env: {
        API_URL: process.env.API_URL,
    },
    output: 'export',
    distDir: 'build/client',
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // If no API URL is set, return empty rewrites array
        if (!apiUrl) {
            console.warn('NEXT_PUBLIC_API_URL is not set');
            return [];
        }
        // Ensure the API URL ends with a slash
        const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
        return [
            {
                source: '/api/:path*',
                destination: `${baseUrl}:path*`,
            },
        ];
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig; 