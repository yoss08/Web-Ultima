-- ULTIMA MASTER SCHEMA
-- This file represents the exact schema provided by the user.

CREATE TABLE profiles (
    id uuid NOT NULL PRIMARY KEY,
    full_name text,
    email text,
    phone text,
    role text,
    avatar_url text,
    club_id uuid,
    points integer,
    status boolean NOT NULL DEFAULT true,
    is_banned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE clubs (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL,
    location text,
    phone text,
    description text,
    photo_url text,
    open_time text,
    close_time text,
    price_per_court numeric,
    admin_id uuid REFERENCES profiles(id),
    super_admin_id uuid REFERENCES profiles(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE courts (
    id uuid NOT NULL PRIMARY KEY,
    club_id uuid REFERENCES clubs(id),
    name text NOT NULL,
    type text,
    surface text,
    capacity integer,
    status text,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE bookings (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES profiles(id),
    club_id uuid REFERENCES clubs(id),
    court_id uuid NOT NULL REFERENCES courts(id),
    booking_date date NOT NULL,
    time_slot text NOT NULL,
    duration numeric,
    total_price numeric,
    status text,
    full_name text,
    email text,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE matches (
    id uuid NOT NULL PRIMARY KEY,
    booking_id uuid NOT NULL REFERENCES bookings(id),
    player1_id uuid NOT NULL REFERENCES profiles(id),
    player2_id uuid NOT NULL REFERENCES profiles(id),
    player3_id uuid REFERENCES profiles(id),
    player4_id uuid REFERENCES profiles(id),
    club_id uuid REFERENCES clubs(id),
    winner1_id uuid REFERENCES profiles(id),
    winner2_id uuid REFERENCES profiles(id),
    score text,
    status text,
    match_type text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
    id uuid NOT NULL PRIMARY KEY,
    user_id uuid REFERENCES profiles(id),
    type text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    notification_type_id text,
    related_entity_id uuid,
    related_entity_type text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE tournaments (
    id uuid NOT NULL PRIMARY KEY,
    club_id uuid REFERENCES clubs(id),
    title text NOT NULL,
    description text,
    rules_text text,
    start_date date NOT NULL,
    end_date date,
    registration_deadline timestamp with time zone,
    max_players integer,
    current_players integer DEFAULT 0,
    entry_fee numeric,
    prize_pool text,
    competition_type text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE tournament_registrations (
    id uuid NOT NULL PRIMARY KEY,
    tournament_id uuid REFERENCES tournaments(id),
    player_id uuid REFERENCES profiles(id),
    status character varying NOT NULL DEFAULT 'pending',
    registered_at timestamp with time zone DEFAULT now()
);

CREATE TABLE training_sessions (
    id uuid NOT NULL PRIMARY KEY,
    coach_id uuid REFERENCES profiles(id),
    student_id uuid REFERENCES profiles(id),
    court_id uuid REFERENCES courts(id),
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    session_type text,
    status text,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE coach_students (
    id uuid NOT NULL PRIMARY KEY,
    coach_id uuid REFERENCES profiles(id),
    student_id uuid REFERENCES profiles(id)
);

CREATE TABLE coach_feedbacks (
    id uuid NOT NULL PRIMARY KEY,
    coach_id uuid REFERENCES profiles(id),
    student_id uuid REFERENCES profiles(id),
    content text NOT NULL,
    rating integer,
    speed integer,
    technique integer,
    stamina integer,
    mental integer,
    power integer,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE coach_notes (
    id uuid NOT NULL PRIMARY KEY,
    coach_id uuid NOT NULL REFERENCES profiles(id),
    student_id uuid NOT NULL REFERENCES profiles(id),
    content text,
    updated_at timestamp with time zone DEFAULT now()
);
