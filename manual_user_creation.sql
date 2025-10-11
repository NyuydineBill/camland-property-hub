-- Manual User Creation Function
-- Use this if the automatic trigger still fails

-- Function to manually create a user with profile
CREATE OR REPLACE FUNCTION create_user_with_profile(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT DEFAULT 'User',
  user_phone TEXT DEFAULT '',
  user_role TEXT DEFAULT 'user'
)
RETURNS JSON AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Validate role
  IF user_role NOT IN ('user', 'owner', 'community', 'broker', 'admin') THEN
    user_role := 'user';
  END IF;
  
  -- Create user in auth.users (this will be handled by Supabase Auth)
  -- We can't directly insert into auth.users, so we'll just create the profile
  -- The user creation should be done through the frontend
  
  -- For now, just return instructions
  result := json_build_object(
    'message', 'User creation should be done through the frontend signup form',
    'instructions', 'Use the signup form in the application to create users',
    'note', 'The profile will be created automatically after user signup'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', SQLERRM,
      'message', 'Failed to create user'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to create profile for existing user
CREATE OR REPLACE FUNCTION create_profile_for_user(
  user_id UUID,
  user_name TEXT DEFAULT 'User',
  user_phone TEXT DEFAULT '',
  user_role TEXT DEFAULT 'user'
)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Validate role
  IF user_role NOT IN ('user', 'owner', 'community', 'broker', 'admin') THEN
    user_role := 'user';
  END IF;
  
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
    RETURN json_build_object(
      'error', 'User not found',
      'message', 'The specified user ID does not exist'
    );
  END IF;
  
  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (user_id, user_name, user_phone, user_role)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role;
  
  result := json_build_object(
    'success', true,
    'message', 'Profile created successfully',
    'user_id', user_id,
    'profile_data', json_build_object(
      'full_name', user_name,
      'phone', user_phone,
      'role', user_role
    )
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', SQLERRM,
      'message', 'Failed to create profile'
    );
END;
$$ LANGUAGE plpgsql;

-- Test the functions
SELECT create_profile_for_user(
  (SELECT id FROM auth.users LIMIT 1),
  'Test User',
  '+237 000 000 000',
  'user'
);