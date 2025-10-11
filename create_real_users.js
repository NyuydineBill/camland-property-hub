#!/usr/bin/env node

/**
 * CamLand Platform - Real User Seeding Script
 * 
 * This script creates real authenticated users in Supabase for testing all dashboard types.
 * It uses Supabase's Admin API to create users with confirmed email addresses.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test users to create
const testUsers = [
  // Regular Users
  {
    email: 'marie.ngassa@email.com',
    password: 'password123',
    full_name: 'Marie Ngassa',
    phone: '+237 677 123 456',
    role: 'user'
  },
  {
    email: 'paul.tabi@email.com',
    password: 'password123',
    full_name: 'Paul Tabi',
    phone: '+237 678 234 567',
    role: 'user'
  },
  {
    email: 'grace.fon@email.com',
    password: 'password123',
    full_name: 'Grace Fon',
    phone: '+237 679 345 678',
    role: 'user'
  },
  {
    email: 'emmanuel.toko@email.com',
    password: 'password123',
    full_name: 'Emmanuel Toko',
    phone: '+237 680 456 789',
    role: 'user'
  },

  // Property Owners
  {
    email: 'john.doe@email.com',
    password: 'password123',
    full_name: 'John Doe',
    phone: '+237 681 567 890',
    role: 'owner'
  },
  {
    email: 'sarah.johnson@email.com',
    password: 'password123',
    full_name: 'Sarah Johnson',
    phone: '+237 682 678 901',
    role: 'owner'
  },
  {
    email: 'michael.ashu@email.com',
    password: 'password123',
    full_name: 'Michael Ashu',
    phone: '+237 683 789 012',
    role: 'owner'
  },
  {
    email: 'jennifer.mbang@email.com',
    password: 'password123',
    full_name: 'Jennifer Mbang',
    phone: '+237 684 890 123',
    role: 'owner'
  },
  {
    email: 'david.ngoh@email.com',
    password: 'password123',
    full_name: 'David Ngoh',
    phone: '+237 685 901 234',
    role: 'owner'
  },

  // Community Heads
  {
    email: 'chief.johnson@email.com',
    password: 'password123',
    full_name: 'Chief Johnson Fon',
    phone: '+237 686 012 345',
    role: 'community'
  },
  {
    email: 'mama.grace@email.com',
    password: 'password123',
    full_name: 'Mama Grace Tabi',
    phone: '+237 687 123 456',
    role: 'community'
  },
  {
    email: 'elder.paul@email.com',
    password: 'password123',
    full_name: 'Elder Paul Ngassa',
    phone: '+237 688 234 567',
    role: 'community'
  },

  // Real Estate Brokers
  {
    email: 'sarah.mbole@realty.com',
    password: 'password123',
    full_name: 'Agent Sarah Mbole',
    phone: '+237 689 345 678',
    role: 'broker'
  },
  {
    email: 'james.toko@properties.com',
    password: 'password123',
    full_name: 'Broker James Toko',
    phone: '+237 690 456 789',
    role: 'broker'
  },
  {
    email: 'mary.ashu@realty.com',
    password: 'password123',
    full_name: 'Agent Mary Ashu',
    phone: '+237 691 567 890',
    role: 'broker'
  },

  // System Administrator
  {
    email: 'admin@camland.com',
    password: 'admin123!',
    full_name: 'Admin CamLand',
    phone: '+237 692 678 901',
    role: 'admin'
  }
];

async function createUser(userData) {
  try {
    console.log(`Creating user: ${userData.email} (${userData.role})`);
    
    // Create the auth user with confirmed email
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: userData.full_name,
        role: userData.role,
        phone: userData.phone
      }
    });

    if (authError) {
      console.error(`❌ Error creating auth user ${userData.email}:`, authError.message);
      return null;
    }

    console.log(`✅ Created auth user: ${userData.email}`);
    return authUser.user;

  } catch (error) {
    console.error(`❌ Unexpected error creating user ${userData.email}:`, error.message);
    return null;
  }
}

async function createAllUsers() {
  console.log('🚀 Starting CamLand user creation...');
  console.log('=====================================');
  
  const createdUsers = [];
  
  for (const userData of testUsers) {
    const user = await createUser(userData);
    if (user) {
      createdUsers.push({
        id: user.id,
        email: user.email,
        role: userData.role,
        name: userData.full_name
      });
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n📊 User Creation Summary:');
  console.log('========================');
  
  const roleStats = createdUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  Object.entries(roleStats).forEach(([role, count]) => {
    console.log(`${role.toUpperCase()}: ${count} users`);
  });

  console.log(`\nTotal: ${createdUsers.length} users created`);
  
  if (createdUsers.length > 0) {
    console.log('\n🎯 Test Login Credentials:');
    console.log('==========================');
    console.log('All users have password: "password123" (admin: "admin123!")');
    console.log('\nSample logins for each role:');
    console.log('👤 USER: marie.ngassa@email.com');
    console.log('🏠 OWNER: john.doe@email.com');
    console.log('👑 COMMUNITY HEAD: chief.johnson@email.com');
    console.log('🤝 BROKER: sarah.mbole@realty.com');
    console.log('⚡ ADMIN: admin@camland.com');
    
    console.log('\n🗄️ Next Steps:');
    console.log('==============');
    console.log('1. Run the property seed data: npm run seed:properties');
    console.log('2. Start your dev server: npm run dev');
    console.log('3. Login with any of the created accounts');
    console.log('4. Experience different dashboard types!');
  }
}

// Run the script
createAllUsers().catch(console.error);