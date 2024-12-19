/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'vndrvdtxmgjliecrhnhz.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/two_cabin_images/**',
            },
        ],
    },
    // output: "export",
};

export default nextConfig;
