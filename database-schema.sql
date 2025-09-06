-- Brother Bal Ganesh Utsav Mandal Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create admin_profiles table
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
    phone TEXT,
    created_by UUID REFERENCES public.admin_profiles(id) NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Religious', 'Cultural', 'Community', 'Youth')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
    created_by UUID REFERENCES public.admin_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
    file_size INTEGER,
    uploader_name TEXT,
    uploader_email TEXT,
    uploader_phone TEXT,
    category TEXT DEFAULT 'General',
    imagekit_file_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID REFERENCES public.admin_profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name TEXT NOT NULL,
    donor_email TEXT,
    donor_phone TEXT,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_method TEXT CHECK (payment_method IN ('upi', 'bank_transfer', 'cash', 'online')),
    transaction_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    receipt_sent BOOLEAN DEFAULT FALSE,
    receipt_email TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'general' CHECK (type IN ('general', 'event', 'donation', 'urgent')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    priority INTEGER DEFAULT 1,
    created_by UUID REFERENCES public.admin_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    imagekit_file_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'resolved')),
    replied_by UUID REFERENCES public.admin_profiles(id),
    replied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    size INTEGER NOT NULL DEFAULT 256,
    margin INTEGER NOT NULL DEFAULT 2,
    created_by UUID REFERENCES public.admin_profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON public.admin_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_email ON public.admin_profiles(email);
CREATE INDEX IF NOT EXISTS idx_admin_profiles_role ON public.admin_profiles(role);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);

CREATE INDEX IF NOT EXISTS idx_gallery_status ON public.gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_file_type ON public.gallery(file_type);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON public.gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_imagekit_file_id ON public.gallery(imagekit_file_id);

CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_donor_email ON public.donations(donor_email);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON public.announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

CREATE INDEX IF NOT EXISTS idx_banners_created_at ON public.banners(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_created_by ON public.banners(created_by);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Admin profiles policies
CREATE POLICY "Admin profiles are viewable by authenticated users and service role" ON public.admin_profiles
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admin profiles are insertable by service role" ON public.admin_profiles
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admin profiles are updatable by service role or owner" ON public.admin_profiles
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

CREATE POLICY "Admin profiles are deletable by service role or super admin" ON public.admin_profiles
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Events policies
CREATE POLICY "Events are viewable by everyone and service role" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Events are insertable by admins and service role" ON public.events
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Events are updatable by admins and service role" ON public.events
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Events are deletable by super admins and service role" ON public.events
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Gallery policies
CREATE POLICY "Gallery items are viewable by everyone and service role" ON public.gallery
    FOR SELECT USING (true);

CREATE POLICY "Gallery items are insertable by everyone and service role" ON public.gallery
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Gallery items are updatable by admins and service role" ON public.gallery
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Gallery items are deletable by admins and service role" ON public.gallery
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Donations policies
CREATE POLICY "Donations are viewable by admins and service role" ON public.donations
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Donations are insertable by everyone and service role" ON public.donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Donations are updatable by admins and service role" ON public.donations
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Announcements policies
CREATE POLICY "Announcements are viewable by everyone and service role" ON public.announcements
    FOR SELECT USING (true);

CREATE POLICY "Announcements are insertable by admins and service role" ON public.announcements
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Announcements are updatable by admins and service role" ON public.announcements
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Announcements are deletable by super admins and service role" ON public.announcements
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Banners policies
CREATE POLICY "Banners are viewable by everyone and service role" ON public.banners
    FOR SELECT USING (true);

CREATE POLICY "Banners are insertable by admins and service role" ON public.banners
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Banners are updatable by admins and service role" ON public.banners
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Banners are deletable by admins and service role" ON public.banners
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Contact submissions policies
CREATE POLICY "Contact submissions are viewable by admins and service role" ON public.contact_submissions
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Contact submissions are insertable by everyone and service role" ON public.contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact submissions are updatable by admins and service role" ON public.contact_submissions
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Contact submissions are deletable by admins and service role" ON public.contact_submissions
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- QR codes policies
CREATE POLICY "QR codes are viewable by admins and service role" ON public.qr_codes
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "QR codes are insertable by admins and service role" ON public.qr_codes
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "QR codes are updatable by admins and service role" ON public.qr_codes
    FOR UPDATE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "QR codes are deletable by super admins and service role" ON public.qr_codes
    FOR DELETE USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.admin_profiles 
            WHERE user_id = auth.uid() AND role = 'super_admin'
        )
    );

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_profiles_updated_at BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON public.qr_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant future permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated;


