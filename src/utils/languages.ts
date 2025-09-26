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
    
    // Auth
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    forgotPassword: 'Şifremi Unuttum',
    resetPassword: 'Şifre Sıfırla',
    
    // Dashboard
    totalBalance: 'Toplam Bakiye',
    trialEarnings: 'Deneme Kazancı',
    activePackage: 'Aktif Paket',
    freeTrial: 'Ücretsiz Deneme',
    
    // Mining
    startMining: 'Madenciliği Başlat',
    stopMining: 'Madenciliği Durdur',
    hashRate: 'Hash Hızı',
    earnings: 'Kazanç',
    miningActive: 'Madencilik Aktif',
    
    // Support
    contactSupport: 'Destek İletişim',
    supportEmail: 'Destek E-posta',
    createTicket: 'Destek Talebi Oluştur',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Common
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    submit: 'Gönder',
    close: 'Kapat',
    success: 'Başarılı',
    error: 'Hata',
    warning: 'Uyarı',
    info: 'Bilgi'
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
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    
    // Dashboard
    totalBalance: 'Total Balance',
    trialEarnings: 'Trial Earnings',
    activePackage: 'Active Package',
    freeTrial: 'Free Trial',
    
    // Mining
    startMining: 'Start Mining',
    stopMining: 'Stop Mining',
    hashRate: 'Hash Rate',
    earnings: 'Earnings',
    miningActive: 'Mining Active',
    
    // Support
    contactSupport: 'Contact Support',
    supportEmail: 'Support Email',
    createTicket: 'Create Support Ticket',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    close: 'Close',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
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
    
    // Auth
    login: 'Anmelden',
    register: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    forgotPassword: 'Passwort vergessen',
    resetPassword: 'Passwort zurücksetzen',
    
    // Dashboard
    totalBalance: 'Gesamtguthaben',
    trialEarnings: 'Testeinnahmen',
    activePackage: 'Aktives Paket',
    freeTrial: 'Kostenlose Testversion',
    
    // Mining
    startMining: 'Mining starten',
    stopMining: 'Mining stoppen',
    hashRate: 'Hash-Rate',
    earnings: 'Einnahmen',
    miningActive: 'Mining aktiv',
    
    // Support
    contactSupport: 'Support kontaktieren',
    supportEmail: 'Support E-Mail',
    createTicket: 'Support-Ticket erstellen',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Common
    loading: 'Laden...',
    save: 'Speichern',
    cancel: 'Abbrechen',
    submit: 'Senden',
    close: 'Schließen',
    success: 'Erfolg',
    error: 'Fehler',
    warning: 'Warnung',
    info: 'Info'
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
    
    // Auth
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور',
    resetPassword: 'إعادة تعيين كلمة المرور',
    
    // Dashboard
    totalBalance: 'الرصيد الإجمالي',
    trialEarnings: 'أرباح التجربة',
    activePackage: 'الحزمة النشطة',
    freeTrial: 'التجربة المجانية',
    
    // Mining
    startMining: 'بدء التعدين',
    stopMining: 'إيقاف التعدين',
    hashRate: 'معدل التجزئة',
    earnings: 'الأرباح',
    miningActive: 'التعدين نشط',
    
    // Support
    contactSupport: 'اتصل بالدعم',
    supportEmail: 'بريد الدعم الإلكتروني',
    createTicket: 'إنشاء تذكرة دعم',
    
    // Company
    companyName: 'CryptoCloud Mining GmbH',
    companyAddress: 'Berliner Allee 12, 40212 Düsseldorf, Germany',
    
    // Common
    loading: 'جاري التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    submit: 'إرسال',
    close: 'إغلاق',
    success: 'نجح',
    error: 'خطأ',
    warning: 'تحذير',
    info: 'معلومات'
  }
};

export const detectUserLanguage = (): string => {
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