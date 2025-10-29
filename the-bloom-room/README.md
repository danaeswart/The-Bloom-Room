# 🌸 The Bloom Room

**A vibrant online art marketplace connecting artists and buyers in one inspiring creative space.**

The Bloom Room is a digital community platform where artists can showcase their work, buyers can discover unique pieces, and everyone can share inspiration. Whether you're posting original artwork or just sharing what inspires your creative process, The Bloom Room nurtures creativity and artistic collaboration.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Architecture & System Design](#architecture--system-design)
- [API Reference](#api-reference)
- [SEO & Analytics](#seo--analytics)
- [Deployment](#deployment)
- [Testing](#testing)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)
- [Contact](#contact)

---

## 🎨 About the Project

The Bloom Room is more than just an art marketplace—it's a creative ecosystem where:

- **Artists** can upload, manage, and sell their artwork with detailed profiles and verification systems
- **Buyers** can discover, request, and purchase unique pieces directly from artists  
- **Everyone** can share inspirational content and connect with the creative community
- **Admins** can manage artist verification and platform oversight

The platform features a flower-themed design with responsive layouts, smooth animations, and an intuitive user experience across all devices.

---

## ✨ Features

### 🖼️ **Artwork Management**
- Upload and display artwork with multiple images
- Edit artwork details, pricing, and availability
- Manage artwork status (available, sold, unavailable)
- Image carousel with smooth transitions

### 👥 **User Profiles**
- Personalized artist and buyer profiles
- Profile picture uploads via Cloudinary
- Bio and attribute customization
- Artist verification system with admin approval

### 🛍️ **Marketplace Features**
- Browse artwork feed with responsive post containers
- Request artwork purchases directly from artists
- Order management system
- Price validation and availability checks

### 💬 **Social Features**
- Create "Bloom Posts" for inspiration and artwork
- Interactive feed with community content
- Follow and discover other artists
- Responsive commenting system

### 🔐 **Authentication & Security**
- User registration and login system
- Role-based access (Artist, Buyer, Admin)
- Protected routes and admin panels
- Secure file uploads

### 📱 **Responsive Design**
- Mobile-first responsive design
- Smooth parallax flower animations
- Loading overlays with custom flower spinners
- Optimized for all screen sizes

### 🔍 **SEO & Analytics**
- Google Analytics integration
- Comprehensive meta tags with React Helmet
- XML sitemap for search engines
- Robots.txt for crawler optimization

---

## 🛠️ Built With

### **Frontend**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18** - UI Framework
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) **JavaScript ES6+** - Programming Language
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) **CSS3** - Styling with responsive design
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) **React Router** - Client-side routing
- **React Helmet** - Dynamic meta tag management
- **Axios** - HTTP client for API calls

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) **Node.js** - Runtime environment
- ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express) **Express.js** - Web framework
- ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=flat&logo=mysql&logoColor=white) **MySQL** - Database
- **Cloudinary** - Image hosting and management
- **Multer** - File upload handling

### **Deployment & Tools**
- ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white) **Render** - Cloud deployment platform
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) **Git** - Version control
- **Google Analytics** - User behavior tracking
- **Google Search Console** - SEO optimization

---

## 🚀 Getting Started

### Prerequisites

Before running The Bloom Room locally, ensure you have:

- **Node.js** v18+ ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MySQL** database server
- **Cloudinary** account for image uploads ([Sign up here](https://cloudinary.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danaeswart/The-Bloom-Room.git
   cd The-Bloom-Room
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Setup

1. **Database Setup**
   - Create a MySQL database
   - Run the schema from `backend/db/schema.sql`
   - Update database connection details in `backend/db/db.js`

2. **Cloudinary Configuration**
   - Get your Cloudinary credentials
   - Update `backend/server/cloudinary.js` with your API keys

3. **Backend Configuration**
   - Update `BASE_URL` in your frontend files to point to your backend server
   - Configure CORS settings in `backend/server/server.js`

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend/server
   node server.js
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000` (or your configured port)

---

## 💡 Usage

### **Getting Started as a User**

1. **Sign Up**: Create an account choosing Artist or Buyer role
2. **Profile Setup**: Complete your profile with bio, attributes, and profile picture
3. **Explore**: Browse the community feed to discover artwork and inspiration

### **For Artists**

1. **Verification**: Request artist verification through admin approval
2. **Upload Artwork**: Create detailed artwork posts with images, descriptions, and pricing
3. **Manage Portfolio**: Edit, update, or remove artwork from your profile
4. **Handle Requests**: Review and respond to buyer purchase requests
5. **Share Inspiration**: Create Bloom Posts to share what inspires your creativity

### **For Buyers**

1. **Discover Art**: Browse the marketplace feed to find pieces you love
2. **Request Purchases**: Send purchase requests directly to artists
3. **Track Orders**: Monitor your purchase requests and communications
4. **Build Collections**: Save and organize artwork that catches your eye

### **Navigation**

- **Home**: Landing page with platform introduction
- **Feed**: Community artwork and inspiration posts
- **Profile**: Your personal profile and artwork management
- **Admin Panel**: Artist verification and platform management (Admin only)

---

## 🏗️ Architecture & System Design

### **Frontend Architecture**
```
frontend/
├── public/                 # Static files, sitemap, robots.txt
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.js     # Navigation components
│   │   ├── PostContainer.js # Artwork display containers
│   │   └── Footer.js     # Footer component
│   ├── pages/            # Route components
│   │   ├── Home.js       # Landing page
│   │   ├── Profile.js    # User profiles
│   │   ├── Feed.js       # Community feed
│   │   └── Admin/        # Admin panels
│   ├── context/          # React Context for state management
│   ├── assets/           # Images and static assets
│   └── css/              # Component-specific styles
```

### **Backend Architecture**
```
backend/
├── server/
│   ├── server.js         # Main Express server
│   ├── cloudinary.js     # Image upload configuration
│   └── routes/           # API route handlers
│       ├── auth.js       # Authentication routes
│       ├── artist.js     # Artist management
│       ├── artworks.js   # Artwork CRUD operations
│       ├── buyer.js      # Buyer operations
│       ├── orders.js     # Purchase request handling
│       └── admin.js      # Admin verification system
├── db/
│   ├── db.js            # Database connection
│   └── schema.sql       # Database schema
└── uploads/             # Local file storage (backup)
```

### **Database Schema**

**Key Tables:**
- `Users` - User authentication and basic info
- `Artists` - Artist-specific profiles and verification status
- `Buyers` - Buyer profiles and preferences  
- `Artworks` - Artwork details, pricing, and status
- `Orders` - Purchase requests and transactions
- `Admin_Approval` - Artist verification workflow

---

## 📡 API Reference

### **Authentication Endpoints**
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### **Artist Endpoints**
- `GET /artist/:id` - Get artist profile
- `PUT /artist/:id` - Update artist profile
- `POST /artist/verification` - Request verification

### **Artwork Endpoints**
- `GET /artwork` - Get all artwork
- `GET /artwork/:id` - Get specific artwork
- `POST /artwork` - Create new artwork
- `PUT /artwork/:id` - Update artwork
- `DELETE /artwork/:id` - Delete artwork

### **Order Endpoints**
- `GET /orders/user/:userId` - Get user orders
- `POST /orders` - Create purchase request
- `PUT /orders/:id` - Update order status

### **Admin Endpoints**
- `GET /admin/verification/requests` - Get pending verifications
- `POST /admin/verification/approve` - Approve artist
- `POST /admin/verification/decline` - Decline artist

---

## 🔍 SEO & Analytics

### **Search Engine Optimization**
- **Dynamic Meta Tags**: Each page has unique titles, descriptions, and keywords using React Helmet
- **Open Graph Tags**: Optimized social media sharing for Facebook, Twitter
- **XML Sitemap**: Comprehensive sitemap at `/sitemap.xml` with all routes
- **Robots.txt**: Search engine crawler guidelines
- **Google Search Console**: Site verification and indexing management

### **Analytics Integration**
- **Google Analytics 4**: Comprehensive user behavior tracking
- **Page View Tracking**: Automatic tracking across all routes
- **Conversion Tracking**: Monitor artwork requests and user registrations

### **Performance Optimization**
- **Responsive Images**: Optimized image loading with Cloudinary
- **Code Splitting**: Efficient bundle loading
- **CSS Optimization**: Mobile-first responsive design
- **Loading States**: Smooth user experience with loading indicators

---

## 🚀 Deployment

### **Frontend Deployment (Render)**
1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables
5. Deploy automatically on push to main branch

### **Backend Deployment (Render)**
1. Deploy backend as a web service
2. Configure database connection strings
3. Set up Cloudinary environment variables
4. Configure CORS for your frontend domain

### **Domain & SSL**
- Custom domain configuration through Render
- Automatic SSL certificate provisioning
- CDN integration for global performance

---

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and login flow
- [ ] Artist verification process
- [ ] Artwork upload and management
- [ ] Purchase request workflow
- [ ] Admin approval system
- [ ] Responsive design on mobile devices
- [ ] Image upload and display
- [ ] Navigation and routing

### **SEO Testing**
- [ ] Google Search Console verification
- [ ] Sitemap accessibility at `/sitemap.xml`
- [ ] Robots.txt accessibility at `/robots.txt`
- [ ] Meta tag validation
- [ ] Social media preview testing

---

## 🗺️ Roadmap

### **Phase 1: Core Improvements**
- [ ] Automated testing suite implementation
- [ ] Enhanced search and filtering capabilities
- [ ] Real-time messaging between artists and buyers
- [ ] Payment integration (Stripe/PayPal)

### **Phase 2: Community Features**
- [ ] Artist portfolio galleries
- [ ] Community challenges and contests
- [ ] Social following and recommendations
- [ ] Advanced artwork categorization

### **Phase 3: Platform Expansion**
- [ ] Mobile app development (React Native)
- [ ] Artist commission calculator
- [ ] Bulk artwork management tools
- [ ] Advanced analytics dashboard

### **Phase 4: Monetization**
- [ ] Premium artist accounts
- [ ] Featured artwork promotions
- [ ] Platform transaction fees
- [ ] Advertising opportunities for art supplies

---

## 🤝 Contributing

We welcome contributions to The Bloom Room! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and conventions
- Add comments for complex functionality
- Test your changes thoroughly
- Update documentation as needed
- Ensure responsive design compatibility

### **Areas for Contribution**
- Bug fixes and performance improvements
- New feature development
- UI/UX enhancements
- Documentation improvements
- Testing coverage expansion

---

## 👨‍💻 Authors

**Danae Swart** - *Full Stack Developer & Project Creator*
- GitHub: [@danaeswart](https://github.com/danaeswart)
- LinkedIn: [Danae Swart](https://linkedin.com/in/danaeswart)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgements

- **React Community** - For the incredible framework and ecosystem
- **Cloudinary** - For reliable image hosting and optimization
- **Render** - For seamless deployment and hosting
- **Google Analytics** - For comprehensive user behavior insights
- **Open Source Community** - For the tools and libraries that made this possible
- **Artist Community** - For inspiration and feedback during development

---

## 📞 Contact

**Project Repository**: [https://github.com/danaeswart/The-Bloom-Room](https://github.com/danaeswart/The-Bloom-Room)

**Live Application**: [https://your-bloom-room-app.onrender.com](https://your-bloom-room-app.onrender.com)

**Issues & Bug Reports**: Please use the [GitHub Issues](https://github.com/danaeswart/The-Bloom-Room/issues) page

**General Inquiries**: [your-email@example.com](mailto:your-email@example.com)

---

## 🌸 Thank You

Thank you for your interest in The Bloom Room! We believe in the power of creativity to connect people and inspire positive change. Whether you're an artist looking to share your work, a buyer seeking unique pieces, or a developer interested in contributing, we're excited to have you as part of our growing community.

**Happy Creating! 🎨**

---

*Made with ❤️ for the global artist community*
