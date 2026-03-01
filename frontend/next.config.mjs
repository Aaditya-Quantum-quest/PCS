/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      'onnxruntime-node': 'commonjs onnxruntime-node',
    });
    return config;
  },
  // Suppress ONNX warnings in development
  logging: {
    level: 'error', // Only show errors, not warnings
  },
  turbopack: {},
};


export default nextConfig;
