# 🌱 CamLand Platform - Seed Data Guide

This guide explains how to populate your CamLand platform with realistic test data for all dashboard types.

## 🎯 What Gets Created

### 👥 **Real Authenticated Users** (16 total)
- **4 Regular Users** - Browse and favorite properties
- **5 Property Owners** - Manage property portfolios  
- **3 Community Heads** - Endorse properties and earn commissions
- **3 Real Estate Brokers** - Manage client properties
- **1 System Administrator** - Full platform management

### 🏠 **Comprehensive Property Data** (11+ properties)
- **Diverse Property Types**: Houses, apartments, villas, commercial, land, hotels
- **Multiple Locations**: Douala, Yaoundé, Bamenda, Buea, Limbe
- **Various Statuses**: Available, rented, sold, pending verification
- **Rich Media**: Property images and descriptions
- **Real Coordinates**: Accurate GPS locations for map display

### 📊 **Dashboard-Ready Data**
- **User Activity**: Property views, favorites, search history
- **Property Performance**: View counts, inquiries, reviews
- **Commission Tracking**: Transaction history for brokers/community heads
- **Admin Analytics**: System metrics and user activity logs
- **Verification Queue**: Properties pending approval

## 🚀 Quick Setup

### Option 1: Complete Automated Setup (Recommended)
```bash
# Run the complete setup script
./setup_seed_data.sh
```

### Option 2: Step-by-Step Setup
```bash
# 1. Install dependencies
npm install

# 2. Create authenticated users
npm run seed:users

# 3. Create property data (after users are created)
npm run seed:properties

# 4. Or do both at once
npm run seed:all
```

## 🔑 Test Login Credentials

All test users have simple passwords for easy testing:

| Role | Email | Password | Description |
|------|--------|----------|-------------|
| **User** | marie.ngassa@email.com | `password123` | Browse properties, create favorites |
| **Owner** | john.doe@email.com | `password123` | 3 properties including featured villa |
| **Community** | chief.johnson@email.com | `password123` | Endorse properties, earn commissions |
| **Broker** | sarah.mbole@realty.com | `password123` | Manage client properties |
| **Admin** | admin@camland.com | `admin123!` | Full system access and management |

> 💡 **Pro Tip**: Try logging in with different roles to see how the dashboard changes!

## 📋 Prerequisites

Before running the seed scripts, ensure you have:

1. **Supabase CLI** installed and configured
2. **Node.js** (v16 or higher)
3. **Environment variables** set in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 🎨 Dashboard Features to Test

### 👤 **User Dashboard**
- Property search and browsing
- Favorites management
- Property inquiry system
- Trending properties display

### 🏠 **Property Owner Dashboard**
- Property portfolio management
- Performance analytics (views, inquiries)
- Verification status tracking
- Revenue summaries

### 👑 **Community Head Dashboard**
- Property endorsement queue
- Commission tracking
- Community statistics
- Bulk endorsement tools

### 🤝 **Broker Dashboard**
- Client property management
- Commission breakdown
- Performance metrics
- Client activity tracking

### ⚡ **Admin Dashboard**
- System health monitoring
- User management tools
- Property oversight
- Financial analytics
- Security alerts

## 🗺️ **Interactive Map Features**

The seed data includes properties with real GPS coordinates:

- **Douala**: Commercial spaces and luxury villas
- **Yaoundé**: Family homes and office complexes  
- **Bamenda**: Traditional compounds and agricultural land
- **Buea**: Student accommodation and hotels
- **Limbe**: Beachside resorts and tourism properties

## 🔄 **Resetting Data**

To start fresh:

```bash
# Reset the database (removes all data)
supabase db reset

# Re-run the seed scripts
./setup_seed_data.sh
```

## 🐛 **Troubleshooting**

### "Failed to create users"
- Check your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Ensure Supabase is running: `supabase status`

### "Property data creation failed"
- Make sure users were created first
- Check database connection: `supabase db psql -c "SELECT COUNT(*) FROM profiles;"`

### "Permission denied"
- Make scripts executable: `chmod +x setup_seed_data.sh`

## 📊 **Data Statistics**

After successful seeding, you'll have:

- **16 authenticated users** across all roles
- **11+ properties** with diverse types and statuses
- **20+ favorites** distributed among users
- **15+ property reviews** with ratings
- **10+ property inquiries** with responses
- **Realistic view counts** and activity metrics

## 🎉 **Ready to Explore!**

Once seeded, start your development server:

```bash
npm run dev
```

Then visit `http://localhost:5173` and login with any test account to explore the role-based dashboards!

---

*Need help? Check the main README.md or create an issue in the repository.*