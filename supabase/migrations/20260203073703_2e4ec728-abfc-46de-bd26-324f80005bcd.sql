-- Create a secure function to assign admin role with race condition protection
CREATE OR REPLACE FUNCTION public.try_assign_first_admin(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INT;
  existing_role_id UUID;
  result JSONB;
BEGIN
  -- Get exclusive lock to prevent race conditions
  PERFORM pg_advisory_xact_lock(123456789);
  
  -- Check if user already has admin role
  SELECT id INTO existing_role_id 
  FROM user_roles 
  WHERE user_id = p_user_id AND role = 'admin';
  
  IF existing_role_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Already an admin',
      'is_admin', true,
      'first_admin', false
    );
  END IF;
  
  -- Check admin count
  SELECT COUNT(*) INTO admin_count FROM user_roles WHERE role = 'admin';
  
  IF admin_count = 0 THEN
    -- No admins exist - first user becomes admin
    INSERT INTO user_roles (user_id, role) VALUES (p_user_id, 'admin');
    RETURN jsonb_build_object(
      'success', true,
      'message', 'Admin role assigned successfully',
      'is_admin', true,
      'first_admin', true
    );
  ELSE
    -- Admins exist - check if requester is admin
    IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = p_user_id AND role = 'admin') THEN
      RETURN jsonb_build_object(
        'success', true,
        'message', 'Already an admin',
        'is_admin', true,
        'first_admin', false
      );
    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Admin already exists. Contact existing admin for access.',
        'is_admin', false,
        'first_admin', false
      );
    END IF;
  END IF;
END;
$$;