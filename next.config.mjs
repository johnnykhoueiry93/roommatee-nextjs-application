/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          // Match all API routes
          source: "/api/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=59",
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  