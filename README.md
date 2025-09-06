# Brother Bal Ganesh Utsav Mandal Website

A modern, responsive website for the Brother Bal Ganesh Utsav Mandal, built with Next.js, TypeScript, and Tailwind CSS. The website provides a digital presence for the mandal with features for event management, photo galleries, donations, and community engagement.

## 🌟 Features

### Core Features

- **Responsive Design**: Mobile-first approach with beautiful UI
- **Event Management**: Display upcoming and past events with schedules
- **Photo Gallery**: Upload and view photos/videos from events
- **Donation System**: UPI QR code and bank transfer options
- **Contact Form**: Easy communication with the organization
- **Admin Panel**: Complete content management system

### Technical Features

- **Next.js 15.5.0**: Latest version with App Router and Turbopack
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4.1.12**: Latest utility-first styling
- **Supabase**: Backend as a Service (Database & Auth)
- **ImageKit**: Image optimization and CDN
- **QR Code Generation**: Website access via QR codes
- **Middleware Protection**: Route-based admin authentication
- **Prettier & ESLint**: Code formatting and linting
- **Turbopack**: Fast development builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- ImageKit account (optional)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd brothers-group
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # ImageKit Configuration (Optional)
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

   # Email Configuration
   SUPABASE_SMTP_PASSWORD=your_smtp_password

   # Website Configuration
   NEXT_PUBLIC_SITE_URL=https://brothersgroup.com
   NEXT_PUBLIC_SITE_NAME="Brothers Group"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Or using yarn:

   ```bash
   yarn dev
   ```

   The development server will start with Turbopack for faster builds.

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Set up the database** (Optional)
   If you have seed data, run the SQL from `seed-data.sql` in your Supabase SQL Editor to populate the database with sample data.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   │   ├── announcements/ # Announcements management
│   │   ├── banners/       # Banner management
│   │   ├── cleanup/       # Data cleanup tools
│   │   ├── contacts/      # Contact management
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── donations/     # Donation tracking
│   │   ├── events/        # Event management
│   │   ├── gallery/       # Gallery management
│   │   ├── qr-codes/      # QR code management
│   │   └── users/         # User management
│   ├── api/               # API routes
│   │   ├── admin/         # Admin API endpoints
│   │   ├── announcements/ # Announcements API
│   │   ├── auth/          # Authentication API
│   │   ├── banners/       # Banners API
│   │   ├── contact/       # Contact API
│   │   ├── donations/     # Donations API
│   │   ├── events/        # Events API
│   │   ├── gallery/       # Gallery API
│   │   └── qr/            # QR code API
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── donate/            # Donation page
│   ├── events/            # Events page
│   ├── gallery/           # Gallery page
│   ├── upload/            # Upload page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── AdminPageHeader.tsx # Admin page header
│   ├── Footer.tsx         # Site footer
│   ├── Modal.tsx          # Modal component
│   ├── Navigation.tsx     # Main navigation
│   ├── QRCode.tsx         # QR code component
│   └── UploadForm.tsx     # Upload form component
├── lib/                   # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── cache.ts           # Caching utilities
│   ├── imagekit.ts        # ImageKit integration
│   └── supabase.ts        # Supabase client
└── middleware.ts          # Next.js middleware for route protection
```

## 🎨 Customization

### Colors and Branding

The website uses a warm orange and yellow color scheme. You can customize colors in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        orange: {
          50: "#fff7ed",
          // ... other shades
          900: "#7c2d12",
        },
      },
    },
  },
};
```

### Content Management

- **Events**: Add/edit events through the admin panel
- **Gallery**: Upload and manage photos/videos
- **Donations**: Configure UPI and bank details
- **Contact**: Update contact information and social links

### Scripts Available

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database schema from `database-schema.sql` in your Supabase SQL Editor
3. The schema includes the following tables:
   - `admin_profiles` - Admin user management with role-based access
   - `events` - Event management with categories and status
   - `gallery` - Photo/video storage with approval workflow
   - `donations` - Donation tracking with UPI integration
   - `contacts` - Contact form submissions
   - `banners` - Banner management for homepage
   - `announcements` - Announcement system
   - `qr_codes` - QR code generation and tracking

### ImageKit Setup (Optional)

1. Create an ImageKit account
2. Configure image optimization settings
3. Update environment variables

### Email Configuration

Configure Supabase SMTP for sending donation receipts and notifications.

## 📱 Admin Panel

### Access

- URL: `/admin`
- Protected by middleware with role-based access control
- Two admin roles: `admin` and `super_admin`

### Features

- **Dashboard**: Overview of website statistics and recent activity
- **Event Management**: Add, edit, delete events with categories
- **Gallery Management**: Approve/reject user uploads
- **User Management**: Manage admin users with role assignments
- **Donation Tracking**: View and manage donation records
- **Contact Management**: Handle contact form submissions
- **Banner Management**: Manage homepage banners
- **Announcement System**: Create and manage announcements
- **QR Code Generation**: Generate and manage QR codes
- **Data Cleanup**: Administrative tools for data maintenance

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Other Platforms

The website can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for mobile
- **SEO**: Meta tags, structured data, sitemap
- **Accessibility**: WCAG 2.1 compliant

## 🔒 Security

- **Authentication**: Custom admin authentication with role-based access
- **Middleware Protection**: Route-based access control using Next.js middleware
- **Content Moderation**: Admin approval workflow for user uploads
- **Data Protection**: Secure data handling with Supabase RLS
- **HTTPS**: Secure connections enforced
- **Input Validation**: Server-side validation for all forms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: support@brothersgroup.com
- Website: https://brothersgroup.com
- Documentation: See this README and inline code comments

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for the backend services
- Tailwind CSS for the styling system
- The Brothers Group community

---

**Built with ❤️ for the Brothers Group**
