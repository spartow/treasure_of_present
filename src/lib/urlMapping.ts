/**
 * URL Mapping Utility
 * Maps button labels and categories to actual URLs from the crawled site
 */

export const URL_MAPPING = {
  // Main pages
  home: 'https://www.parvizshahbazi.com/',
  support: 'https://www.parvizshahbazi.com/support.php',
  contact: 'https://www.parvizshahbazi.com/contact.htm',
  links: 'https://www.parvizshahbazi.com/links.htm',
  liveTV: 'https://www.parvizshahbazi.com/',
  liveRadio: 'https://www.parvizshahbazi.com/live_radio.php',
  radio: 'https://www.parvizshahbazi.com/radio.php',
  musicRadio: 'https://www.parvizshahbazi.com/music_radio.php',

  // Special program sections
  payamManavi: 'https://www.parvizshahbazi.com/ganj_videos/payam_hay_manavi.php',
  peighamEshgh: 'https://www.parvizshahbazi.com/ganj_videos/peigham_eshgh.php',
  koodakanEshgh: 'https://www.parvizshahbazi.com/ganj_videos/koodakaan_eshgh.php',
  javaananEshgh: 'https://www.parvizshahbazi.com/ganj_videos/javaanaan_eshgh.php',
  cheraghEshgh: 'https://www.parvizshahbazi.com/ganj_videos/cheragh_eshgh.php',
  ganjinehEshgh: 'https://www.parvizshahbazi.com/ganj_videos/ganjineh_eshgh.php',
  summaries: 'https://www.parvizshahbazi.com/ganj_videos/ganje_hozour_summary_notes.php',

  // Video categories (1-100, 101-200, etc.)
  videoCategories: {
    '1-100': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=1-100',
    '101-200': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=101-200',
    '201-300': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=201-300',
    '301-400': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=301-400',
    '401-500': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=401-500',
    '501-600': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=501-600',
    '601-700': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=601-700',
    '701-800': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=701-800',
    '801-900': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=801-900',
    '901-1000': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=901-1000',
    '1001-1100': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=1001-1100',
  },

  // Audio categories
  audioCategories: {
    '1-100': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audio-1-100',
    '101-200': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-101-200',
    '201-300': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-201-300',
    '301-400': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audio-301-400',
    '401-500': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-401-500',
    '501-600': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-501-600',
    '601-700': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-601-700',
    '701-800': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-701-800',
    '801-900': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-801-900',
    '901-1000': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-901-1000',
    '1001-1100': 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=audios-1001-1100',
  },

  // Special collections mapping
  specialCollections: {
    'تصویری حجم پایین': 'https://www.parvizshahbazi.com/ganj_videos/ganje_hozour_video.php',
    'صوتی حجم پایین': 'https://www.parvizshahbazi.com/ganj_videos/ganje_hozour_audio.php',
    'پیام‌های معنوی': 'https://www.parvizshahbazi.com/ganj_videos/payam_hay_manavi.php',
    'پیغام عشق': 'https://www.parvizshahbazi.com/ganj_videos/peigham_eshgh.php',
    'کودکان عشق': 'https://www.parvizshahbazi.com/ganj_videos/koodakaan_eshgh.php',
    'جوانان عشق': 'https://www.parvizshahbazi.com/ganj_videos/javaanaan_eshgh.php',
    'گنجینه عشق': 'https://www.parvizshahbazi.com/ganj_videos/ganjineh_eshgh.php',
    'چراغ عشق': 'https://www.parvizshahbazi.com/ganj_videos/cheragh_eshgh.php',
  },

  // Phone call programs
  phoneCalls: 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=Phone-Call',
  phoneCallsVideo: 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=Phone-Calls',

  // Music poems
  musicPoems: 'https://www.parvizshahbazi.com/ganj_videos/category.php?cat=Music_poems-Mollavi-Hafez&sortby=date',
};

/**
 * Get video category URL by range label
 */
export function getVideoCategoryUrl(range: string): string {
  return URL_MAPPING.videoCategories[range as keyof typeof URL_MAPPING.videoCategories] || URL_MAPPING.home;
}

/**
 * Get audio category URL by range label
 */
export function getAudioCategoryUrl(range: string): string {
  return URL_MAPPING.audioCategories[range as keyof typeof URL_MAPPING.audioCategories] || URL_MAPPING.home;
}

/**
 * Get special collection URL by name
 */
export function getSpecialCollectionUrl(name: string): string {
  return URL_MAPPING.specialCollections[name as keyof typeof URL_MAPPING.specialCollections] || URL_MAPPING.home;
}

