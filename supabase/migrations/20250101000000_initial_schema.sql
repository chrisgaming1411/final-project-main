-- Create the schema for the Homebase Finder application

/*
          # Create Profiles Table
          This table stores public user data, linked to the authentication service.

          ## Query Description: "This operation creates the `profiles` table to store user information like name and user type. It's linked to Supabase's built-in authentication. It also sets up Row Level Security to ensure users can only manage their own profile, protecting user data from unauthorized access."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: `public.profiles`
          - Columns: `id`, `name`, `user_type`, `avatar_url`, `created_at`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Create policies for SELECT, INSERT, UPDATE)
          - Auth Requirements: Users must be authenticated to interact with their own profile.
          
          ## Performance Impact:
          - Indexes: Primary Key on `id`
          - Triggers: None
          - Estimated Impact: Low
          */
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    user_type TEXT CHECK (user_type IN ('owner', 'seeker')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.profiles IS 'Stores public user profile information.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

/*
          # Create Boarding Houses Table
          This table stores all the boarding house listings.

          ## Query Description: "This operation sets up the `boarding_houses` table for property listings. It includes Row Level Security so that property owners can only manage their own listings, while allowing anyone to view them. This prevents one owner from accidentally modifying another's property."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: `public.boarding_houses`
          - Columns: `id`, `owner_id`, `name`, `address`, `description`, `image_url`, `facebook_url`, `contact_no`, `created_at`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Create policies for SELECT, INSERT, UPDATE, DELETE)
          - Auth Requirements: Users must be authenticated as 'owner' to create, update, or delete listings.
          
          ## Performance Impact:
          - Indexes: Primary Key on `id`, Foreign Key on `owner_id`
          - Triggers: None
          - Estimated Impact: Low
          */
CREATE TABLE public.boarding_houses (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT,
    image_url TEXT,
    facebook_url TEXT,
    contact_no TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.boarding_houses IS 'Stores information about each boarding house property.';

ALTER TABLE public.boarding_houses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Boarding houses are viewable by everyone."
ON public.boarding_houses FOR SELECT
USING (true);

CREATE POLICY "Owners can insert their own boarding houses."
ON public.boarding_houses FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own boarding houses."
ON public.boarding_houses FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own boarding houses."
ON public.boarding_houses FOR DELETE
USING (auth.uid() = owner_id);

/*
          # Create Rooms Table
          This table stores details about individual rooms within a boarding house.

          ## Query Description: "This operation creates the `rooms` table, linked to the `boarding_houses` table. Security rules are in place to ensure that only the owner of a boarding house can add, edit, or remove its rooms, maintaining data integrity. All visitors can view room details."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: `public.rooms`
          - Columns: `id`, `boarding_house_id`, `name`, `price`, `capacity`, `inclusions`, `created_at`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Create policies for SELECT, INSERT, UPDATE, DELETE)
          - Auth Requirements: Users must be the owner of the parent boarding house.
          
          ## Performance Impact:
          - Indexes: Primary Key on `id`, Foreign Key on `boarding_house_id`
          - Triggers: None
          - Estimated Impact: Low
          */
CREATE TABLE public.rooms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    boarding_house_id BIGINT REFERENCES public.boarding_houses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC,
    capacity TEXT,
    inclusions TEXT[],
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.rooms IS 'Stores details for individual rooms within a boarding house.';

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are viewable by everyone."
ON public.rooms FOR SELECT
USING (true);

CREATE POLICY "Owners can manage rooms in their own boarding houses."
ON public.rooms FOR ALL
USING (
    auth.uid() = (
        SELECT owner_id
        FROM public.boarding_houses
        WHERE id = rooms.boarding_house_id
    )
)
WITH CHECK (
    auth.uid() = (
        SELECT owner_id
        FROM public.boarding_houses
        WHERE id = rooms.boarding_house_id
    )
);

/*
          # Create Favorites Table
          This table tracks which users have favorited which boarding houses.

          ## Query Description: "This operation creates the `favorites` table to allow seekers to save their favorite properties. Row Level Security is strictly enforced so that a user can only see and manage their own list of favorites, ensuring user privacy."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table: `public.favorites`
          - Columns: `id`, `user_id`, `boarding_house_id`, `created_at`
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes (Create policies for SELECT, INSERT, DELETE)
          - Auth Requirements: Users must be authenticated to manage their favorites.
          
          ## Performance Impact:
          - Indexes: Primary Key on `id`, Composite UNIQUE index on (`user_id`, `boarding_house_id`)
          - Triggers: None
          - Estimated Impact: Low
          */
CREATE TABLE public.favorites (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    boarding_house_id BIGINT REFERENCES public.boarding_houses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, boarding_house_id)
);
COMMENT ON TABLE public.favorites IS 'Tracks user favorites for boarding houses.';

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites."
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites."
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites."
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

/*
          # Automatic Profile Creation
          This function and trigger automatically create a profile for a new user upon sign-up.

          ## Query Description: "This operation adds a helper function and a trigger. When a new user signs up via Supabase Auth, this automatically creates a corresponding entry in the `profiles` table using the metadata (like name and user type) they provided during registration. This automates profile creation and keeps user data synchronized."
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Function: `public.handle_new_user`
          - Trigger: `on_auth_user_created` on `auth.users` table
          
          ## Security Implications:
          - RLS Status: N/A
          - Policy Changes: No
          - Auth Requirements: Runs with definer security to insert into `profiles`.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: Added
          - Estimated Impact: Low (runs once per user creation)
          */
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, user_type)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'userType'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
