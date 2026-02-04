@echo off
REM FOODLICKS Build Script for Render Deployment (Windows)

echo 🚀 Starting FOODLICKS build process...

REM Backend build
echo 📦 Building backend...
cd backend
call npm install --production
if %errorlevel% neq 0 (
    echo ❌ Backend build failed
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Frontend build
echo 🎨 Building frontend...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependencies failed
    exit /b 1
)
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    exit /b 1
)
echo ✅ Frontend build completed

REM Return to root
cd ..

echo 🎉 Build process completed successfully!
echo 📁 Frontend build output: frontend/dist
echo 🔧 Backend ready for production