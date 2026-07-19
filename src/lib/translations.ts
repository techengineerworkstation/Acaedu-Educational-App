// Translation system for Acaedu
// Uses browser's Intl API for locale detection

export type Language = 'en' | 'yo' | 'ig' | 'ha' | 'fr' | 'es' | 'sw' | 'ar' | 'zh'

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.courses': 'Subjects',
    'nav.schedule': 'Schedule',
    'nav.announcements': 'Announcements',
    'nav.notifications': 'Notifications',
    'nav.grades': 'Grades',
    'nav.attendance': 'Attendance',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Sign Out',
    'nav.admin': 'Admin Panel',
    'nav.users': 'User Management',
    'nav.billing': 'Billing',
    'nav.events': 'Events',
    'nav.venues': 'Venues',
    'auth.login': 'Sign In',
    'auth.register': 'Create Account',
    'auth.forgot': 'Forgot Password?',
    'auth.google': 'Continue with Google',
    'auth.apple': 'Continue with Apple',
    'common.search': 'Search...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.no_data': 'No data available',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.confirm': 'Are you sure?',
    'dashboard.welcome': 'Welcome back',
    'dashboard.upcoming': 'Upcoming Classes',
    'dashboard.recent': 'Recent Activity',
    'dashboard.stats': 'Overview',
    'course.enrolled': 'Enrolled Students',
    'course.materials': 'Course Materials',
    'course.videos': 'Video Lectures',
    'schedule.monday': 'Monday',
    'schedule.tuesday': 'Tuesday',
    'schedule.wednesday': 'Wednesday',
    'schedule.thursday': 'Thursday',
    'schedule.friday': 'Friday',
    'schedule.saturday': 'Saturday',
    'schedule.sunday': 'Sunday',
    'notif.class_cancelled': 'Class Cancelled',
    'notif.venue_change': 'Venue Changed',
    'notif.new_announcement': 'New Announcement',
    'notif.exam_reminder': 'Exam Reminder',
    'notif.assignment_due': 'Assignment Due',
    'tts.read_aloud': 'Read Aloud',
    'tts.stop': 'Stop Reading',
    'tts.summarize': 'Summarize',
    'tts.translate': 'Translate',
    'billing.plan_free': 'Free Plan',
    'billing.plan_basic': 'Basic Plan',
    'billing.plan_pro': 'Pro Plan',
    'billing.plan_enterprise': 'Enterprise Plan',
    'billing.upgrade': 'Upgrade Plan',
    'billing.manage': 'Manage Subscription',
  },
  yo: {
    'nav.home': 'Ile',
    'nav.courses': 'Iko',
    'nav.schedule': 'Awon akoko',
    'nav.announcements': 'Ipolowosi',
    'nav.notifications': 'Alaisiri',
    'nav.grades': 'Igbese',
    'nav.attendance': 'Iwa presence',
    'nav.profile': 'Profaili',
    'nav.settings': 'Eto',
    'nav.logout': 'Jade',
    'auth.login': 'Wole',
    'auth.register': 'Fori si',
    'common.search': 'Wa...',
    'common.save': 'Fi pamomo',
    'common.cancel': 'Fagilee',
    'common.delete': 'Yọọ',
    'common.edit': 'Ṣatunkọ',
    'common.loading': 'N gbani...',
    'dashboard.welcome': 'Kaabo',
  },
  ig: {
    'nav.home': 'Ụlọ',
    'nav.courses': 'Mmụta',
    'nav.schedule': 'Oge',
    'nav.announcements': 'Ọrịyo',
    'nav.notifications': 'Ụda',
    'auth.login': 'Banye',
    'auth.register': 'Dee aha',
    'common.search': 'Chọọ...',
    'common.save': 'Chekwa',
    'common.cancel': 'Kagbuo',
    'common.delete': 'Hichapụ',
    'dashboard.welcome': 'Nnọọ',
  },
  ha: {
    'nav.home': 'Gida',
    'nav.courses': 'Darussa',
    'nav.schedule': 'Jadawali',
    'nav.announcements': 'Sanarwa',
    'nav.notifications': 'Sanarwa',
    'auth.login': 'Shiga',
    'auth.register': 'Yi Rajista',
    'common.search': 'Bincika...',
    'common.save': 'Ajiye',
    'common.cancel': 'Soke',
    'common.delete': 'Share',
    'dashboard.welcome': 'Barka da dawowa',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.courses': 'Matières',
    'nav.schedule': 'Emploi du temps',
    'nav.announcements': 'Annonces',
    'nav.notifications': 'Notifications',
    'auth.login': 'Connexion',
    'auth.register': 'Créer un compte',
    'common.search': 'Rechercher...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'dashboard.welcome': 'Bienvenue',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.courses': 'Materias',
    'nav.schedule': 'Horario',
    'nav.announcements': 'Anuncios',
    'nav.notifications': 'Notificaciones',
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Crear cuenta',
    'common.search': 'Buscar...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'dashboard.welcome': 'Bienvenido',
  },
  sw: {
    'nav.home': 'Nyumbani',
    'nav.courses': 'Masomo',
    'nav.schedule': 'Ratiba',
    'nav.announcements': 'Tangazo',
    'nav.notifications': 'Arifa',
    'auth.login': 'Ingia',
    'auth.register': 'Jiandikishe',
    'common.search': 'Tafuta...',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.delete': 'Futa',
    'dashboard.welcome': 'Karibu',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.courses': 'المقررات',
    'nav.schedule': 'الجدول',
    'nav.announcements': 'الإعلانات',
    'nav.notifications': 'الإشعارات',
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'common.search': 'بحث...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'dashboard.welcome': 'مرحباً',
  },
  zh: {
    'nav.home': '首页',
    'nav.courses': '课程',
    'nav.schedule': '时间表',
    'nav.announcements': '公告',
    'nav.notifications': '通知',
    'auth.login': '登录',
    'auth.register': '注册',
    'common.search': '搜索...',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'dashboard.welcome': '欢迎',
  },
}

let currentLanguage: Language = 'en'

export function setLanguage(lang: Language) {
  currentLanguage = lang
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('acaedu-lang', lang)
  }
}

export function getLanguage(): Language {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('acaedu-lang') as Language
    if (saved && translations[saved]) return saved
  }
  // Detect from browser
  const browserLang = navigator.language.split('-')[0] as Language
  return translations[browserLang] ? browserLang : 'en'
}

export function t(key: string): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key
}

export function getAvailableLanguages(): { code: Language; name: string; nativeName: string }[] {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ]
}

// Initialize language on load
if (typeof localStorage !== 'undefined') {
  currentLanguage = getLanguage()
}
