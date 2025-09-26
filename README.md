# CloudMiner - Advanced Crypto Mining Platform

A professional cryptocurrency mining simulation platform with real-time earnings, package management, and comprehensive admin features.

## 🚀 Features

### ✨ User Experience
- **Real-time Mining**: Live hash rate monitoring and earnings calculation
- **Mobile Responsive**: Fully optimized for all devices
- **Trial System**: 3-month free trial with $25 earning limit
- **Package System**: Premium packages with enhanced hash rates
- **Instant Withdrawals**: TRC20 USDT withdrawal system

### 💰 Mining System
- **Multi-Coin Support**: BTC, ETH, DOGE, LTC mining
- **Real Calculations**: Package-based hash rate and earning multipliers
- **Trial Limits**: Automatic stopping when limits reached
- **Live Updates**: Real-time balance and earnings updates

### 📱 Mobile Features
- **Responsive Design**: Perfect mobile experience
- **Touch Optimized**: Mobile-friendly controls
- **Bottom Navigation**: Easy mobile navigation
- **Optimized Performance**: Fast loading on mobile

### 🛡️ Admin Features
- **Payment Management**: Approve/reject package purchases
- **Withdrawal Control**: Process withdrawal requests
- **User Management**: Monitor all user activities
- **Real-time Dashboard**: Live admin analytics

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom components
- **Backend**: Firebase Realtime Database + Authentication
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM v7
- **State**: Firebase real-time listeners

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/cloudminer.git
cd cloudminer
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Realtime Database
4. Copy your Firebase config

### 3. Environment Configuration
Create `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Database Rules
Apply these rules to your Realtime Database:
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
    "withdrawalRequests": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 5. Admin Setup
To create an admin user:
1. Register normally through the app
2. Go to Firebase Console > Realtime Database > users
3. Find your user record (by email)
4. Add `"isAdmin": true` to your user object
5. Save the changes
6. Refresh the app to see admin features

### 6. Run Development Server
```bash
npm run dev
```

### 7. Build for Production
```bash
npm run build
```

## 🎯 Usage Guide

### For Users
1. **Registration**: Sign up with email/password
2. **Free Trial**: Start with 3-month trial ($25 limit)
3. **Mining**: Select a coin and start mining
4. **Packages**: Upgrade for higher hash rates
5. **Withdrawal**: Request TRC20 USDT withdrawals

### For Admins
1. **Payment Review**: Approve/reject package purchases
2. **Withdrawal Management**: Process withdrawal requests
3. **User Monitoring**: Track all user activities
4. **Package Management**: Modify package settings

## 🔧 Configuration

### Mining Packages
Edit `src/pages/PackagesPage.tsx` to modify:
- Package prices and durations
- Hash rate multipliers
- Daily earning estimates

### Payment Address
Update TRC20 address in `src/pages/PackagesPage.tsx`:
```typescript
const trcAddress = "YOUR_TRC20_WALLET_ADDRESS";
```

### Mining Calculations
Modify `src/utils/miningCalculations.ts` to adjust:
- Package multipliers
- Earning calculations
- Hash rate calculations

## 📱 Mobile Optimization

The platform is fully responsive with:
- **Mobile Navigation**: Bottom tab bar for easy access
- **Touch Interfaces**: Optimized buttons and controls
- **Responsive Grids**: Adaptive layouts for all screens
- **Performance**: Optimized for mobile performance

## 🔒 Security Features

- **Firebase Auth**: Secure authentication system
- **Database Rules**: Strict access control
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error management
- **Real-time Security**: Live permission checking

## 🚀 Performance Features

- **Real-time Updates**: Live data synchronization
- **Optimized Calculations**: Efficient earning calculations
- **Lazy Loading**: Performance-optimized components
- **Memory Management**: Proper cleanup and state management

## 📊 Analytics

Track important metrics:
- User registration rates
- Mining session duration
- Package conversion rates
- Withdrawal request patterns

## 🐛 Troubleshooting

### Common Issues
1. **Firebase Connection**: Check environment variables
2. **Mining Not Starting**: Verify trial status and permissions
3. **Mobile Layout**: Clear browser cache
4. **Real-time Updates**: Check Firebase rules

### Debug Mode
Enable console logging by adding to localStorage:
```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Email notifications
- [ ] Advanced mining algorithms
- [ ] Social features
- [ ] API integration

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact support team
- Check documentation

---

**Note**: This is a mining simulation platform for educational purposes. All earnings are simulated and based on the package system.