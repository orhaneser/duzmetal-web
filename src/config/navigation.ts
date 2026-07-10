// Tüm menü linklerinin merkezi tanımı
export const NAVIGATION_MENU = [
  { label: 'Kurumsal', href: '#kurumsal', type: 'link' as const },
  { label: 'Ürünlerimiz', page: 'catalog' as const, type: 'button' as const },
  { label: 'Markalarımız', page: 'brands' as const, type: 'button' as const },
  { label: 'İletişim', page: 'contact' as const, type: 'button' as const },
  { label: 'Bayilik Başvurusu', page: 'dealer' as const, type: 'button' as const },
] as const

export type NavigationItem = typeof NAVIGATION_MENU[number]
export type PageType = 'home' | 'catalog' | 'contact' | 'brands' | 'dealer'
