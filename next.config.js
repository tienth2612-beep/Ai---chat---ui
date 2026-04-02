/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. QUAN TRỌNG NHẤT: Chuyển sang chế độ export tĩnh
    output: 'export', 

    // 2. Bắt buộc khi dùng output: 'export' nếu bạn có dùng thẻ <Image />
    // Vì export tĩnh không có server Node.js để tối ưu ảnh realtime
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },

    // 3. Giữ lại các env nếu cần dùng ở client side
    env: {
        API_URL: process.env.API_URL,
    },

    // 4. Tùy chọn: folder chứa kết quả build (mặc định là 'out')
    // distDir: 'build/client', 

    eslint: {
        ignoreDuringBuilds: true,
    }
};

module.exports = nextConfig;