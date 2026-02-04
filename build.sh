#!/bin/bash

# FOODLICKS Build Script for Render Deployment

echo "🚀 Starting FOODLICKS build process..."

# Backend build
echo "📦 Building backend..."
cd backend
npm install --production
echo "✅ Backend dependencies installed"

# Frontend build
echo "🎨 Building frontend..."
cd ../frontend
npm install
npm run build
echo "✅ Frontend build completed"

# Create deployment info
cd ..
echo "📋 Creating deployment info..."
cat > deployment-info.json << EOF
{
  "app": "FOODLICKS",
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "backend": {
    "nodeVersion": "$(node --version)",
    "npmVersion": "$(npm --version)"
  },
  "frontend": {
    "buildTool": "Vite",
    "framework": "React 18"
  }
}
EOF

echo "🎉 Build process completed successfully!"
echo "📁 Frontend build output: frontend/dist"
echo "🔧 Backend ready for production"