// src/utils/languages.ts
import { Language, Translation } from '../types';

export const supportedLanguages: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

export const translations: Record<string, Translation> = {
  tr: {
    // Navigation
    dashboard: 'Kontrol Paneli',
    mining: 'Madencilik',
    packages: 'Paketler',
    withdrawal: 'Para Çekme',
    profile: 'Profil',
    admin: 'Yönetici',
    support: 'Destek',
    logout: 'Çıkış Yap',
    settings: 'Ayarlar',
    
    // Auth
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    forgotPassword: 'Şifremi Unuttum',
    resetPassword: 'Şifre Sıfırla',
    confirmPassword: 'Şifre Tekrar',
    selectLanguage: 'Dil Seçin',
    
    // Dashboard
    totalBalance: 'Toplam Bakiye',
    trialEarnings: 'Deneme Kazancı',
    activePackage: 'Aktif Paket',
    freeTrial: 'Ücretsiz Deneme',
    welcomeBack: 'Tekrar hoşgeldiniz',
    quickActions: 'Hızlı İşlemler',
    recentActivity: 'Son Aktiviteler',
    
    // Mining
    startMining: 'Madenciliği Başlat',
    stopMining: 'Madenciliği Durdur',
    hashRate: 'Hash Hızı',
    earnings: 'Kazanç',
    miningActive: 'Madencilik Aktif',
    selectCoin: 'Coin Seçin',
    miningRules: 'Madencilik Kuralları',
    
    // Packages
    selectPackage: 'Paket Seç',
    paymentInstructions: 'Ödeme Talimatları',
    copyAddress: 'Adresi Kopyala',
    paymentNotification: 'Ödeme Bildirimi',
    
    // Profile
    accountInfo: 'Hesap Bilgileri',
    balanceEarnings: 'Bakiye ve Kazançlar',
    trialStatus: 'Deneme Durumu',
    
    // Support
    contactSupport: 'Destek İletişim',
    supportEmail: 'Destek E-posta',
    createTicket: 'Destek Talebi Oluştur',
    subject: 'Konu',
    message: 'Mesaj',
    priority: 'Öncelik',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Landing Page
    heroTitle: 'Kripto Para Madenciliği ile Pasif Gelir Elde Edin',
    heroSubtitle: 'Bitcoin, Ethereum, Solana ve 8+ kripto para madenciliği ile günlük kazanç sağlayın. Profesyonel bulut madenciliği hizmeti ile güvenli yatırım yapın.',
    freeBonus: 'Ücretsiz $25 Bonus Al',
    howItWorks: 'Nasıl Çalışır?',
    whyChooseUs: 'Neden CryptoCloud Mining?',
    secureTitle: '100% Güvenli',
    secureDesc: 'SSL şifreleme ve çok katmanlı güvenlik sistemleri ile verileriniz tamamen korunur.',
    highPerformanceTitle: 'Yüksek Performans',
    highPerformanceDesc: 'Son teknoloji madencilik donanımları ile maksimum hash rate ve verimlilik.',
    dailyPaymentsTitle: 'Günlük Ödemeler',
    dailyPaymentsDesc: 'Kazançlarınız günlük olarak hesaplanır ve bakiyenize eklenir.',
    
    // Common
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    submit: 'Gönder',
    close: 'Kapat',
    success: 'Başarılı',
    error: 'Hata',
    warning: 'Uyarı',
    info: 'Bilgi',
    yes: 'Evet',
    no: 'Hayır',
    confirm: 'Onayla',
    delete: 'Sil',
    edit: 'Düzenle',
    view: 'Görüntüle',
    back: 'Geri',
    next: 'İleri',
    previous: 'Önceki',
    
    // Status
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Beklemede',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    completed: 'Tamamlandı',
    
    // Time
    today: 'Bugün',
    yesterday: 'Dün',
    thisWeek: 'Bu Hafta',
    thisMonth: 'Bu Ay',
    days: 'gün',
    hours: 'saat',
    minutes: 'dakika',
    seconds: 'saniye'
  },
  
  en: {
    // Navigation
    dashboard: 'Dashboard',
    mining: 'Mining',
    packages: 'Packages',
    withdrawal: 'Withdrawal',
    profile: 'Profile',
    admin: 'Admin',
    support: 'Support',
    logout: 'Logout',
    settings: 'Settings',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    confirmPassword: 'Confirm Password',
    selectLanguage: 'Select Language',
    
    // Dashboard
    totalBalance: 'Total Balance',
    trialEarnings: 'Trial Earnings',
    activePackage: 'Active Package',
    freeTrial: 'Free Trial',
    welcomeBack: 'Welcome back',
    quickActions: 'Quick Actions',
    recentActivity: 'Recent Activity',
    
    // Mining
    startMining: 'Start Mining',
    stopMining: 'Stop Mining',
    hashRate: 'Hash Rate',
    earnings: 'Earnings',
    miningActive: 'Mining Active',
    selectCoin: 'Select Coin',
    miningRules: 'Mining Rules',
    
    // Packages
    selectPackage: 'Select Package',
    paymentInstructions: 'Payment Instructions',
    copyAddress: 'Copy Address',
    paymentNotification: 'Payment Notification',
    
    // Profile
    accountInfo: 'Account Information',
    balanceEarnings: 'Balance & Earnings',
    trialStatus: 'Trial Status',
    
    // Support
    contactSupport: 'Contact Support',
    supportEmail: 'Support Email',
    createTicket: 'Create Support Ticket',
    subject: 'Subject',
    message: 'Message',
    priority: 'Priority',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Landing Page
    heroTitle: 'Earn Passive Income with Cryptocurrency Mining',
    heroSubtitle: 'Generate daily earnings by mining Bitcoin, Ethereum, Solana and 8+ cryptocurrencies. Secure investment with professional cloud mining service.',
    freeBonus: 'Get Free $25 Bonus',
    howItWorks: 'How It Works?',
    whyChooseUs: 'Why Choose CryptoCloud Mining?',
    secureTitle: '100% Secure',
    secureDesc: 'Your data is completely protected with SSL encryption and multi-layered security systems.',
    highPerformanceTitle: 'High Performance',
    highPerformanceDesc: 'Maximum hash rate and efficiency with state-of-the-art mining hardware.',
    dailyPaymentsTitle: 'Daily Payments',
    dailyPaymentsDesc: 'Your earnings are calculated daily and added to your balance.',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds'
  },
  
  de: {
    // Navigation
    dashboard: 'Dashboard',
    mining: 'Mining',
    packages: 'Pakete',
    withdrawal: 'Auszahlung',
    profile: 'Profil',
    admin: 'Admin',
    support: 'Support',
    logout: 'Abmelden',
    settings: 'Einstellungen',
    
    // Auth
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen',
    resetPassword: 'Passwort zurücksetzen',
    confirmPassword: 'Passwort bestätigen',
    selectLanguage: 'Sprache wählen',
    
    // Dashboard
    totalBalance: 'Gesamtguthaben',
    trialEarnings: 'Testeinnahmen',
    activePackage: 'Aktives Paket',
    freeTrial: 'Kostenlose Testversion',
    welcomeBack: 'Willkommen zurück',
    quickActions: 'Schnellaktionen',
    recentActivity: 'Letzte Aktivitäten',
    
    // Mining
    startMining: 'Mining starten',
    stopMining: 'Mining stoppen',
    hashRate: 'Hash-Rate',
    earnings: 'Einnahmen',
    miningActive: 'Mining aktiv',
    selectCoin: 'Coin auswählen',
    miningRules: 'Mining-Regeln',
    
    // Packages
    selectPackage: 'Paket auswählen',
    paymentInstructions: 'Zahlungsanweisungen',
    copyAddress: 'Adresse kopieren',
    paymentNotification: 'Zahlungsbenachrichtigung',
    
    // Profile
    accountInfo: 'Kontoinformationen',
    balanceEarnings: 'Guthaben & Einnahmen',
    trialStatus: 'Test-Status',
    
    // Support
    contactSupport: 'Support kontaktieren',
    supportEmail: 'Support E-Mail',
    createTicket: 'Support-Ticket erstellen',
    subject: 'Betreff',
    message: 'Nachricht',
    priority: 'Priorität',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Landing Page
    heroTitle: 'Passives Einkommen durch Kryptowährungs-Mining',
    heroSubtitle: 'Erzielen Sie tägliche Einnahmen durch Mining von Bitcoin, Ethereum, Solana und 8+ Kryptowährungen. Sichere Investition mit professionellem Cloud-Mining-Service.',
    freeBonus: 'Kostenlosen $25 Bonus erhalten',
    howItWorks: 'Wie funktioniert es?',
    whyChooseUs: 'Warum CryptoCloud Mining wählen?',
    secureTitle: '100% Sicher',
    secureDesc: 'Ihre Daten sind vollständig geschützt durch SSL-Verschlüsselung und mehrschichtige Sicherheitssysteme.',
    highPerformanceTitle: 'Hohe Leistung',
    highPerformanceDesc: 'Maximale Hash-Rate und Effizienz mit modernster Mining-Hardware.',
    dailyPaymentsTitle: 'Tägliche Zahlungen',
    dailyPaymentsDesc: 'Ihre Einnahmen werden täglich berechnet und Ihrem Guthaben hinzugefügt.',
    
    // Common
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    submit: 'Senden',
    close: 'Schließen',
    success: 'Erfolg',
    error: 'Fehler',
    warning: 'Warnung',
    info: 'Info',
    yes: 'Ja',
    no: 'Nein',
    confirm: 'Bestätigen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    view: 'Anzeigen',
    back: 'Zurück',
    next: 'Weiter',
    previous: 'Vorherige',
    
    // Status
    active: 'Aktiv',
    inactive: 'Inaktiv',
    pending: 'Ausstehend',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
    completed: 'Abgeschlossen',
    
    // Time
    today: 'Heute',
    yesterday: 'Gestern',
    thisWeek: 'Diese Woche',
    thisMonth: 'Diesen Monat',
    days: 'Tage',
    hours: 'Stunden',
    minutes: 'Minuten',
    seconds: 'Sekunden'
  },
  
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    mining: 'التعدين',
    packages: 'الحزم',
    withdrawal: 'السحب',
    profile: 'الملف الشخصي',
    admin: 'المدير',
    support: 'الدعم',
    logout: 'تسجيل الخروج',
    settings: 'الإعدادات',
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور',
    resetPassword: 'إعادة تعيين كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    selectLanguage: 'اختر اللغة',
    
    // Dashboard
    totalBalance: 'الرصيد الإجمالي',
    trialEarnings: 'أرباح التجربة',
    activePackage: 'الحزمة النشطة',
    freeTrial: 'التجربة المجانية',
    welcomeBack: 'مرحباً بعودتك',
    quickActions: 'الإجراءات السريعة',
    recentActivity: 'النشاط الأخير',
    
    // Mining
    startMining: 'بدء التعدين',
    stopMining: 'إيقاف التعدين',
    hashRate: 'معدل التجزئة',
    earnings: 'الأرباح',
    miningActive: 'التعدين نشط',
    selectCoin: 'اختر العملة',
    miningRules: 'قواعد التعدين',
    
    // Packages
    selectPackage: 'اختر الحزمة',
    paymentInstructions: 'تعليمات الدفع',
    copyAddress: 'نسخ العنوان',
    paymentNotification: 'إشعار الدفع',
    
    // Profile
    accountInfo: 'معلومات الحساب',
    balanceEarnings: 'الرصيد والأرباح',
    trialStatus: 'حالة التجربة',
    
    // Support
    contactSupport: 'اتصل بالدعم',
    supportEmail: 'بريد الدعم الإلكتروني',
    createTicket: 'إنشاء تذكرة دعم',
    subject: 'الموضوع',
    message: 'الرسالة',
    priority: 'الأولوية',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Landing Page
    heroTitle: 'احصل على دخل سلبي من تعدين العملات المشفرة',
    heroSubtitle: 'احصل على أرباح يومية من تعدين البيتكوين والإيثريوم وسولانا و8+ عملات مشفرة. استثمار آمن مع خدمة التعدين السحابي المهنية.',
    freeBonus: 'احصل على مكافأة $25 مجاناً',
    howItWorks: 'كيف يعمل؟',
    whyChooseUs: 'لماذا تختار CryptoCloud Mining؟',
    secureTitle: '100% آمن',
    secureDesc: 'بياناتك محمية بالكامل بتشفير SSL وأنظمة الأمان متعددة الطبقات.',
    highPerformanceTitle: 'أداء عالي',
    highPerformanceDesc: 'أقصى معدل تجزئة وكفاءة مع أحدث أجهزة التعدين.',
    dailyPaymentsTitle: 'مدفوعات يومية',
    dailyPaymentsDesc: 'يتم حساب أرباحك يومياً وإضافتها إلى رصيدك.',
    
    // Common
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    close: 'إغلاق',
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات',
    yes: 'نعم',
    no: 'لا',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    view: 'عرض',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    
    // Status
    active: 'نشط',
    inactive: 'غير نشط',
    pending: 'في الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    completed: 'مكتمل',
    
    // Time
    today: 'اليوم',
    yesterday: 'أمس',
    thisWeek: 'هذا الأسبوع',
    thisMonth: 'هذا الشهر',
    days: 'أيام',
    hours: 'ساعات',
    minutes: 'دقائق',
    seconds: 'ثواني'
  }
};

export const detectUserLanguage = (): string => {
  // Check localStorage first
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
    return savedLanguage;
  }
  
  // Browser language detection
  const browserLang = navigator.language.split('-')[0];
  const supportedCodes = supportedLanguages.map(lang => lang.code);
  
  if (supportedCodes.includes(browserLang)) {
    return browserLang;
  }
  
  // Default to Turkish
  return 'tr';
};

export const getTranslation = (key: string, lang: string = 'tr'): string => {
  const keys = key.split('.');
  let translation: any = translations[lang] || translations.tr;
  
  for (const k of keys) {
    translation = translation[k];
    if (!translation) break;
  }
  
  return translation || key;
};

export const setDocumentLanguage = (lang: string) => {
  document.documentElement.lang = lang;
  
  // RTL support for Arabic
  if (lang === 'ar') {
    document.documentElement.dir = 'rtl';
    document.body.style.fontFamily = 'Arial, sans-serif';
  } else {
    document.documentElement.dir = 'ltr';
    document.body.style.fontFamily = '';
  }
};