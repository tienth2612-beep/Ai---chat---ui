/** @type {import('next').NextConfig} */
const nextConfig = {
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: "https",
    //             hostname: "**",
    //         },
    //     ],
    //     unoptimized: true,
    // },
    // env: {
    //     API_URL: process.env.API_URL,
    // },
    //output: 'export',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    }
};

module.exports = nextConfig; 