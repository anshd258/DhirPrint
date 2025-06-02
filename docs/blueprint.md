# **App Name**: DhirPrint AI

## Core Features:

- Firebase Authentication: User authentication via Firebase (email/password, Google). Stores user data in Firestore at users/{uid}.
- Product Browsing: Displays three product categories: Flex Banners, Acrylic Signs, Neon Signs. Products details fetched from Firestore products/{productId}.
- AI-Powered Design Generation Tool: Generates custom artwork using the Gemini AI tool based on text prompts and reference images (if provided). Uses a Cloud Function (CF) generateImage (Gemini AI) to store the generated images in aiImages, allowing the user to select a final design, overlay text, specify quantity, and view a price breakdown. Adds the customized item to the shopping cart, writing to carts/{uid}.
- Product Customization: Enables users to customize product details such as size and material using selection menus in ProductDetailScreen.
- Shopping Cart: Allows users to add customized items to a shopping cart, writing data to carts/{uid}.
- Checkout: Allows users to checkout and provide shipping details, with Stripe integration (using Stripe Elements) or Razorpay UPI for payments. Uses a Cloud Function (CF) createOrder to create a PaymentIntent/Razorpay order, and on success, writes to orders/{orderId}, clears the cart, and sends an email.
- AI Chat Assistant Tool: Offers an AI chat assistant that answers FAQs about the design process, powered by Gemini AI. Uses a Cloud Function (CF) chatAssistant to handle the chat and stores chat sessions in chatSessions/{sessionId}.
- Verify Print Readiness: A Cloud Function (CF) that verifies image DPI versus size, providing suggestions if the resolution is low.
- Admin Panel: Admin panel accessible only to users with the 'admin' role. Includes a dashboard with KPIs, a ProductsListAdmin (Table + Add/EditDialog), and an OrdersListAdmin (Table + Detail view), inventory alerts. Uses a Cloud Function (CF) generateSalesReport to generate reports in reports/{reportId} and displays charts.
- Cloud Functions: Cloud Functions (CF) to handle various backend tasks: onUserCreate, generateImage, verifyPrintReadiness, chatAssistant, createOrder, onOrderCreated, generateSalesReport.
- Order Success and Tracking Screens: Displays an order success screen and an order tracking screen with a steps component, tracking link, design previews, and a reorder option.

## Style Guidelines:

- Primary color: Neon pink (#FF007F) for a vibrant and modern look.
- Secondary color: Electric blue for contrast and visual interest.
- Accent color: Lime green to highlight interactive elements.
- Body and headline font: Use 'Inter' (sans-serif) for a clean, modern, and highly readable aesthetic. Great for body text and UI.
- Use clean, minimalist icons from Radix or Phosphor to maintain a modern and simple look; use Shadcn ui components.
- Employ a grid-based layout with generous whitespace to ensure a clean and user-friendly interface. Use Shadcn UI components.
- Incorporate subtle micro-animations on hover and button clicks to provide a tactile and responsive user experience. Use Shadcn UI components for animations.