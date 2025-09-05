/*
  # Fix user registration RLS policy

  1. Security Updates
    - Add policy to allow public user registration
    - Allow anonymous users to insert new user records
    - Maintain security for other operations

  2. Changes
    - Add "Allow public registration" policy for INSERT operations
    - Enable anon role to create new user accounts during registration
*/

-- Allow anonymous users to register (insert new users)
CREATE POLICY "Allow public registration" 
  ON public.users 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- Ensure the policy is applied correctly
GRANT INSERT ON public.users TO anon;