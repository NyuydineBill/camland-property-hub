#!/bin/bash

# CamLand Platform - Complete Data Seeding Setup
# This script creates real authenticated users and comprehensive property data

echo "🚀 CamLand Platform - Complete Data Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Error: Not in a Supabase project directory."
    echo "   Please run this script from your project root directory."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local file not found."
    echo ""
    echo "Please create a .env.local file with the following variables:"
    echo "VITE_SUPABASE_URL=your_supabase_url"
    echo "VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    echo "You can find these values in your Supabase project dashboard."
    exit 1
fi

# Check if required commands exist
commands=("node" "npm" "supabase")
for cmd in "${commands[@]}"; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ Error: $cmd is not installed or not in PATH"
        case $cmd in
            "node"|"npm")
                echo "   Please install Node.js: https://nodejs.org/"
                ;;
            "supabase")
                echo "   Please install Supabase CLI: npm install -g supabase"
                ;;
        esac
        exit 1
    fi
done

echo "✅ All required tools are available"
echo ""

# Check Supabase status
echo "🔍 Checking Supabase connection..."
if ! supabase status &> /dev/null; then
    echo "🔄 Supabase not running. Starting local development environment..."
    supabase start
    if [ $? -ne 0 ]; then
        echo "❌ Failed to start Supabase. Please check your setup."
        exit 1
    fi
else
    echo "✅ Supabase is running"
fi

echo ""

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Step 1: Create real authenticated users
echo "👥 Step 1: Creating authenticated users..."
echo "========================================="
echo "Creating users for all roles:"
echo "  • 4 Regular Users"
echo "  • 5 Property Owners" 
echo "  • 3 Community Heads"
echo "  • 3 Real Estate Brokers"
echo "  • 1 System Administrator"
echo ""

npm run seed:users
if [ $? -ne 0 ]; then
    echo "❌ Failed to create users. Check your SUPABASE_SERVICE_ROLE_KEY in .env.local"
    exit 1
fi

echo ""
echo "✅ Users created successfully!"
echo ""

# Wait a moment for the database to process
echo "⏳ Waiting for user profiles to be created..."
sleep 3

# Step 2: Create property and related data
echo "🏠 Step 2: Creating property data..."
echo "===================================="
echo "Creating:"
echo "  • 11 diverse properties across Cameroon"
echo "  • Property images and media"
echo "  • User favorites and reviews"
echo "  • Property inquiries"
echo "  • Realistic view counts and activity"
echo ""

npm run seed:properties
if [ $? -ne 0 ]; then
    echo "❌ Failed to create property data"
    exit 1
fi

echo ""
echo "✅ Property data created successfully!"
echo ""

# Final verification
echo "📊 Verifying data creation..."
echo "============================="

# Get data summary
SUMMARY=$(supabase db psql -c "
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as users,
  (SELECT COUNT(*) FROM public.properties) as properties,
  (SELECT COUNT(*) FROM public.favorites) as favorites,
  (SELECT COUNT(*) FROM public.property_reviews) as reviews,
  (SELECT COUNT(*) FROM public.property_inquiries) as inquiries;
" --csv 2>/dev/null | tail -n 1)

if [ ! -z "$SUMMARY" ]; then
    IFS=',' read -r users properties favorites reviews inquiries <<< "$SUMMARY"
    echo "✅ Data Summary:"
    echo "   👥 Users: $users"
    echo "   🏠 Properties: $properties" 
    echo "   ❤️  Favorites: $favorites"
    echo "   ⭐ Reviews: $reviews"
    echo "   📧 Inquiries: $inquiries"
else
    echo "⚠️  Could not verify data (but creation likely succeeded)"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🎯 Test Login Credentials:"
echo "=========================="
echo "All users have simple passwords for testing:"
echo ""
echo "👤 REGULAR USER:"
echo "   Email: marie.ngassa@email.com"
echo "   Password: password123"
echo ""
echo "🏠 PROPERTY OWNER:"
echo "   Email: john.doe@email.com"
echo "   Password: password123"
echo "   (Has 3 properties including a featured villa)"
echo ""
echo "👑 COMMUNITY HEAD:"
echo "   Email: chief.johnson@email.com"
echo "   Password: password123"
echo "   (Can endorse properties and earn commissions)"
echo ""
echo "🤝 REAL ESTATE BROKER:"
echo "   Email: sarah.mbole@realty.com"
echo "   Password: password123"
echo "   (Can manage client properties)"
echo ""
echo "⚡ SYSTEM ADMINISTRATOR:"
echo "   Email: admin@camland.com"
echo "   Password: admin123!"
echo "   (Full platform access and management)"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Start your development server:"
echo "   npm run dev"
echo ""
echo "2. Open http://localhost:5173 in your browser"
echo ""
echo "3. Click 'Get Started' and login with any of the test accounts"
echo ""
echo "4. Experience different dashboard types based on user roles!"
echo ""
echo "💡 Features to Test:"
echo "==================="
echo "• Role-based dashboards (User, Owner, Community, Broker, Admin)"
echo "• Interactive property map with real locations"
echo "• Property search and filtering"
echo "• Property details with images and reviews"
echo "• User favorites and inquiries"
echo "• Admin panel with system management (admin account)"
echo "• Commission tracking (broker/community accounts)"
echo "• Property verification workflow"
echo ""
echo "🎊 Happy Testing!"