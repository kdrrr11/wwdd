# CloudMiner - Crypto Mining Simulation Platform

## Features

### User Management
- Firebase Authentication (email/password)
- User profiles with balance tracking
- 3-month free trial with $25 USDT earning limit

### Mining Simulation
- Real-time mining simulation for BTC, ETH, DOGE, LTC
- Only one coin can be mined at a time
- Visual progress indicators and hash rate displays
- Earnings calculation based on packages

### Package System
- Multiple mining packages with different hash rates
- TRC20 USDT payment system
- Admin approval workflow
- Weekly withdrawal options

### Admin Features
- Payment approval/rejection
- User management
- Package management
- Mining session monitoring

### Technical Features
- Responsive mobile-first design
- Real-time Firebase integration
- SEO optimized
- Professional UI/UX

## Setup Instructions

### 1. Firebase Configuration
1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Enable Realtime Database
4. Update `src/config/firebase.ts` with your configuration

### 2. Database Rules
Set up Firebase Realtime Database rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true"
      }
    },
    "miningSessions": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('isAdmin').val() === true"
      }
    },
    "paymentNotifications": {
      ".read": "root.child('users').child(auth.uid).child('isAdmin').val() === true",
      ".write": "auth != null"
    },
    "packages": {
      ".read": true,
      ".write": "root.child('users').child(auth.uid).child('isAdmin').val() === true"
    }
  }
}
```

### 3. Environment Variables
Create a `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 4. TRC20 Payment Setup
1. Update the TRC20 address in `src/pages/PackagesPage.tsx`
2. Set up payment verification (optional)

### 5. Admin Setup
Create an admin user by setting `isAdmin: true` in the user's Firebase record.

## Development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run build
```

Upload the `dist` folder to your hosting provider.

## Payment Flow

1. User selects package
2. User sends TRC20 USDT to provided address
3. User clicks "Notify Payment"
4. Admin reviews and approves payment
5. Package activates automatically
6. User can start enhanced mining

## Security Notes

- All sensitive operations require authentication
- Admin operations require special permissions
- Payment verification should be implemented for production
- Rate limiting recommended for API calls

## Legal Disclaimer

This platform provides a mining simulation service. It does not perform actual cryptocurrency mining. All earnings are simulated for educational and entertainment purposes.