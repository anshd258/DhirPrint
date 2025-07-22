# DhirPrint AI

A modern AI-powered print shop application built with Next.js, Firebase, and Google Genkit for custom design generation and e-commerce functionality.

## 🚀 Features

### Core Features
- **Firebase Authentication**: User authentication via Firebase (email/password, Google)
- **Product Browsing**: Three product categories - Flex Banners, Acrylic Signs, Neon Signs
- **AI-Powered Design Generation**: Custom artwork generation using Gemini AI based on text prompts and reference images
- **Product Customization**: Size and material customization for products
- **Shopping Cart**: Full cart functionality with persistent storage
- **Checkout Process**: Integrated with Stripe and Razorpay for payments
- **AI Chat Assistant**: FAQ assistant powered by Gemini AI
- **Print Readiness Verification**: DPI verification for print quality
- **Admin Panel**: Complete admin dashboard with analytics and management tools
- **Order Tracking**: Real-time order status with tracking capabilities

### Cloud Functions
- `onUserCreate` - New user setup
- `generateImage` - AI image generation
- `verifyPrintReadiness` - DPI verification
- `chatAssistant` - AI chat handling
- `createOrder` - Order processing
- `onOrderCreated` - Post-order workflows
- `generateSalesReport` - Analytics reports

## 📁 Project Structure

```
DhirPrint/
├── docs/                      # Documentation
│   └── blueprint.md          # Project blueprint
├── public/                    # Static files
│   ├── assets/
│   │   └── videos/
│   │       └── bgvideo.webm  # Background video
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service Worker
├── src/
│   ├── ai/                   # AI/Genkit integration
│   │   ├── dev.ts           # Development config
│   │   ├── genkit.ts        # Genkit setup
│   │   └── flows/           # AI workflows
│   │       ├── answer-design-faq.ts
│   │       ├── generate-custom-product-design.ts
│   │       ├── generate-product-image.ts
│   │       └── generate-sales-report.ts
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── globals.css      # Global styles
│   │   ├── admin/           # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── reports/
│   │   ├── auth/            # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout process
│   │   ├── design-studio/   # AI design studio
│   │   ├── orders/          # User orders
│   │   ├── product/[productId]/ # Product details
│   │   ├── products/        # Product listing
│   │   │   └── [categoryId]/
│   │   └── order/           # Order pages
│   │       ├── success/[orderId]/
│   │       └── tracking/[orderId]/
│   ├── components/           # React components
│   │   ├── ai/              # AI components
│   │   ├── auth/            # Auth components
│   │   ├── cart/            # Cart components
│   │   ├── checkout/        # Checkout components
│   │   ├── layout/          # Layout components
│   │   ├── orders/          # Order components
│   │   ├── products/        # Product components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                 # Utility libraries
│   │   ├── firebase.ts      # Firebase config
│   │   ├── remove-null-values.ts
│   │   └── utils.ts
│   └── types/               # TypeScript definitions
│       └── index.ts
├── .env                      # Environment variables
├── .gitignore
├── apphosting.yaml          # App hosting config
├── components.json          # shadcn/ui config
├── next.config.ts           # Next.js config
├── package.json             # Dependencies
├── postcss.config.mjs       # PostCSS config
├── tailwind.config.ts       # Tailwind config
└── tsconfig.json            # TypeScript config
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **UI**: React 18.0.0
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Genkit with Gemini AI
- **Payments**: Stripe & Razorpay
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Google AI API key (for Gemini AI)
- Stripe/Razorpay accounts (for payments)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DhirPrint.git
   cd DhirPrint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```bash
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

   # Google AI (Genkit)
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   # Payment Providers (optional)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Set up Firebase Storage
   - Deploy Cloud Functions (if using)

## 🚀 Development

1. **Run the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:9002`

2. **Run Genkit development server** (for AI features)
   ```bash
   npm run genkit:dev
   ```
   
   Or with hot reload:
   ```bash
   npm run genkit:watch
   ```

3. **Type checking**
   ```bash
   npm run typecheck
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

## 📦 Building for Production

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

## 🚢 Deployment

### Vercel (Recommended for Next.js)
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting (with App Hosting)
The project includes an `apphosting.yaml` configuration file for Firebase App Hosting deployment.

## 🎨 Design System

The application follows these design guidelines:

- **Primary Color**: Neon pink (#FF007F)
- **Secondary Color**: Electric blue 
- **Accent Color**: Lime green
- **Typography**: Inter (sans-serif)
- **Icons**: Lucide React
- **Components**: shadcn/ui with Tailwind CSS
- **Layout**: Grid-based with generous whitespace
- **Animations**: Subtle micro-animations on interactions

## 📊 Database Structure

### Firestore Collections
- `users/{uid}` - User profiles
- `products/{productId}` - Product catalog
- `carts/{uid}` - Shopping carts
- `orders/{orderId}` - Order records
- `aiImages/{imageId}` - AI-generated images
- `chatSessions/{sessionId}` - AI chat sessions
- `reports/{reportId}` - Sales reports

## 🔐 Security

- Authentication required for user features
- Admin role-based access control
- Secure payment processing
- Environment variables for sensitive data
- Firebase Security Rules for data access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📧 Support

For support, email support@dhirprint.com or open an issue in the repository.