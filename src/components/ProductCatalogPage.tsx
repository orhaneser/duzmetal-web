import { motion } from 'framer-motion'
import {
  ImageOff,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

type CatalogProduct = {
  id: string
  code: string
  name: string
  brand: string
  image: string
}

const STORAGE_KEY = 'duzmetal-product-catalog-v1'
const SYNC_META_KEY = 'duzmetal-product-sync-meta-v1'
const PAGE_SIZE = 20
const XML_CATALOG_URL = '/products.xml'
const SYNC_TTL_MS = 1000 * 60 * 60 * 24 * 3

const fallbackProducts: CatalogProduct[] = [
  { id: 'DUZ-001', code: 'DUZ-001', name: 'Soudal Pu Silikon Yapıştırıcı 300ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1581092335064-14f3ee9b14e1?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-002', code: 'DUZ-002', name: 'Soudal Poliüretan Yapıştırıcı 750ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-003', code: 'DUZ-003', name: 'Soudal Silikon Buji Beyaz 300ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-004', code: 'DUZ-004', name: 'Soudal Akril Yapıştırıcı 500ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-005', code: 'DUZ-005', name: 'Soudal Epoksi Hızlı 100ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1565043589228-c4c2a0435052?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-006', code: 'DUZ-006', name: 'Soudal Su Geçirmez İzolasyon 5L', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1590794056223-7ddda5dd4be0?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-007', code: 'DUZ-007', name: 'Soudal Metal Bağlantı Spreyi 400ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-008', code: 'DUZ-008', name: 'Soudal Termal Yalıtım Contası', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-009', code: 'DUZ-009', name: 'Soudal Açık Hava Koruyucu 1L', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-010', code: 'DUZ-010', name: 'Soudal Yüzey Temizleyici 500ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1581092335064-14f3ee9b14e1?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-001', code: 'ACT-001', name: 'Aktix Yapı Silikon Beyaz 300ml', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-002', code: 'ACT-002', name: 'Aktix Silikon Buji Şeffaf 300ml', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-003', code: 'ACT-003', name: 'Aktix Enerji Tasarruflu Pencere Buji', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-004', code: 'ACT-004', name: 'Aktix Yalıtım Bandı 50m', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1581092335064-14f3ee9b14e1?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-005', code: 'ACT-005', name: 'Aktix Yapı Sızdırmazlık 1L', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1565043589228-c4c2a0435052?auto=format&fit=crop&w=900&q=80' },
  { id: 'APE-001', code: 'APE-001', name: 'Apel Montaj Aksesuar Seti', brand: 'Apel', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80' },
  { id: 'APE-002', code: 'APE-002', name: 'Apel Plastik Dolgu Malzemesi', brand: 'Apel', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { id: 'APE-003', code: 'APE-003', name: 'Apel Montaj Camı Profili', brand: 'Apel', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
  { id: 'SEL-001', code: 'SEL-001', name: 'Selsil Silikon Temizlik Ürünü 500ml', brand: 'Selsil', image: 'https://images.unsplash.com/photo-1590794056223-7ddda5dd4be0?auto=format&fit=crop&w=900&q=80' },
  { id: 'SEL-002', code: 'SEL-002', name: 'Selsil Buji Temizleme Solüsyonu 1L', brand: 'Selsil', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
  { id: 'TYT-001', code: 'TYT-001', name: 'Tytan Poliüretan Yapıştırıcı 750ml', brand: 'Tytan', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80' },
  { id: 'TYT-002', code: 'TYT-002', name: 'Tytan Silikon Buji Beyaz 300ml', brand: 'Tytan', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { id: 'TYT-003', code: 'TYT-003', name: 'Tytan Yüzey Stabilizatörü 5L', brand: 'Tytan', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { id: 'TEK-001', code: 'TEK-001', name: 'Tekno Koruyucu Kaplama 10L', brand: 'Tekno', image: 'https://images.unsplash.com/photo-1565043589228-c4c2a0435052?auto=format&fit=crop&w=900&q=80' },
  { id: 'TEK-002', code: 'TEK-002', name: 'Tekno Endüstriyel Çıkmazlıklar 1L', brand: 'Tekno', image: 'https://images.unsplash.com/photo-1590794056223-7ddda5dd4be0?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-011', code: 'DUZ-011', name: 'Soudal Profesyonel Tamir Harcı 1kg', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-012', code: 'DUZ-012', name: 'Soudal Yüksek Performanslı Conta', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-013', code: 'DUZ-013', name: 'Soudal Endüstriyel Yüzey Spreyi', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-014', code: 'DUZ-014', name: 'Soudal İzolasyon ve Koruma Paketi', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { id: 'DUZ-015', code: 'DUZ-015', name: 'Soudal Elastik Dolgu Harcı 600ml', brand: 'Soudal', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
  { id: 'SOU-SILICONE1', code: 'SOU-SILICONE1', name: '280 GR SOUDAL SILICONE U ŞEFFAF', brand: 'SOUDAL', image: 'https://api.duzmetal.com/medyalar/urun/55989/c44a2bc9-c67e-4c85-aa92-d6ecd735155a.png' },
  { id: 'SOU-SILICONE2', code: 'SOU-SILICONE2', name: '280 GR SOUDAL SILICONE U SİYAH', brand: 'SOUDAL', image: 'https://api.duzmetal.com/medyalar/urun/55988/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6.png' },
  { id: 'ACT-006', code: 'ACT-006', name: 'Aktix Cam Silikon Koyu 300ml', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1565043589228-c4c2a0435052?auto=format&fit=crop&w=900&q=80' },
  { id: 'ACT-007', code: 'ACT-007', name: 'Aktix Poliüretan Dolgu 750ml', brand: 'Aktix', image: 'https://images.unsplash.com/photo-1590794056223-7ddda5dd4be0?auto=format&fit=crop&w=900&q=80' },
  { id: 'APE-004', code: 'APE-004', name: 'Apel Dil Profili Plastik 10m', brand: 'Apel', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80' },
  { id: 'APE-005', code: 'APE-005', name: 'Apel Kornişe Ek Parçası', brand: 'Apel', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80' },
  { id: 'SEL-003', code: 'SEL-003', name: 'Selsil Gözlük Temizlik Ürünü 200ml', brand: 'Selsil', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80' },
  { id: 'TYT-004', code: 'TYT-004', name: 'Tytan Silikon Buji Şeffaf 300ml', brand: 'Tytan', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80' },
  { id: 'TYT-005', code: 'TYT-005', name: 'Tytan Yapı Silikon Koyu 300ml', brand: 'Tytan', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80' },
  { id: 'TEK-003', code: 'TEK-003', name: 'Tekno Temizleyici Solüsyon 5L', brand: 'Tekno', image: 'https://images.unsplash.com/photo-1565043589228-c4c2a0435052?auto=format&fit=crop&w=900&q=80' },
  { id: 'TEK-004', code: 'TEK-004', name: 'Tekno İzolasyon Bandı 50m', brand: 'Tekno', image: 'https://images.unsplash.com/photo-1590794056223-7ddda5dd4be0?auto=format&fit=crop&w=900&q=80' },
]

function readStoredProducts(): CatalogProduct[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is CatalogProduct => Boolean(item && typeof item === 'object' && 'code' in item && 'name' in item && 'brand' in item))
      : []
  } catch {
    return []
  }
}

function parseXmlProducts(xmlText: string): CatalogProduct[] {
  if (typeof window === 'undefined') {
    return []
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlText, 'application/xml')
  const productNodes = Array.from(doc.querySelectorAll('product'))

  return productNodes
    .map((node) => {
      const code = node.querySelector('code')?.textContent?.trim() || ''
      const name = node.querySelector('name')?.textContent?.trim() || ''
      const brand = node.querySelector('brand')?.textContent?.trim() || 'Soudal'
      const image = node.querySelector('image')?.textContent?.trim() || ''

      if (!code || !name || !image) {
        return null
      }

      return {
        id: code,
        code,
        name,
        brand,
        image,
      }
    })
    .filter((item: CatalogProduct | null): item is CatalogProduct => Boolean(item))
}


function writeStoredProducts(products: CatalogProduct[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function readLastSyncAt(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(SYNC_META_KEY)
}

function writeLastSyncAt(value: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SYNC_META_KEY, value)
}

function formatPageRange(total: number, page: number) {
  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)
  return `${start}-${end}`
}

export function ProductCatalogPage({ onBack, onNavigate }: { onBack: () => void; onNavigate: (page: 'home' | 'catalog' | 'contact' | 'brands') => void }) {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('Tümü')

  const handleLogoClick = () => {
    onBack()
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    const storedProducts = readStoredProducts()
    const storedLastSyncAt = readLastSyncAt()
    const shouldRefresh = !storedLastSyncAt || Date.now() - Number(storedLastSyncAt) > SYNC_TTL_MS

    if (storedProducts.length > 0) {
      setProducts(storedProducts)
    } else {
      setProducts(fallbackProducts)
    }

    const controller = new AbortController()

    const fetchProducts = async () => {
      setLoading(true)

      try {
        const response = await fetch(XML_CATALOG_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`XML catalog request failed with status ${response.status}`)
        }

        const xmlText = await response.text()
        const xmlProducts = parseXmlProducts(xmlText)
        const previousProducts = storedProducts.length > 0 ? storedProducts : fallbackProducts
        const nextProducts = xmlProducts.length > 0 ? xmlProducts : previousProducts
        const syncTimestamp = new Date().toISOString()

        setProducts(nextProducts)
        writeStoredProducts(nextProducts)
        writeLastSyncAt(syncTimestamp)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Could not load product catalog XML', error)
        }
        const fallback = storedProducts.length > 0 ? storedProducts : fallbackProducts
        setProducts(fallback)
      } finally {
        setLoading(false)
      }
    }

    if (!storedProducts.length || shouldRefresh) {
      void fetchProducts()
    } else {
      setLoading(false)
    }

    return () => controller.abort()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedBrand])

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))
    return ['Tümü', ...uniqueBrands.sort((a, b) => a.localeCompare(b, 'tr'))]
  }, [products])

  // Türkçe karakterleri ASCII'ye dönüştür ve küçük yap
  const normalizeString = (str: string): string => {
    const turkishMap: { [key: string]: string } = {
      'İ': 'i',
      'ı': 'i',
      'Ş': 's',
      'ş': 's',
      'Ğ': 'g',
      'ğ': 'g',
      'Ü': 'u',
      'ü': 'u',
      'Ö': 'o',
      'ö': 'o',
      'Ç': 'c',
      'ç': 'c',
    }
    return str
      .split('')
      .map((char) => turkishMap[char] || char)
      .join('')
      .toLowerCase()
  }

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeString(searchTerm.trim().replace(/\s+/g, ' '))

    const filtered = products.filter((product) => {
      const matchesSearch = !normalizedSearch ||
        normalizeString(product.name.replace(/\s+/g, ' ')).includes(normalizedSearch) ||
        normalizeString(product.brand).includes(normalizedSearch) ||
        normalizeString(product.code).includes(normalizedSearch)

      const matchesBrand = selectedBrand === 'Tümü' || product.brand === selectedBrand

      return matchesSearch && matchesBrand
    })

    // Ürünleri ada göre alfabetik sırala
    return filtered.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  }, [products, searchTerm, selectedBrand])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))

  const visibleProducts = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE)
  }, [page, filteredProducts])

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-stone-800 sm:px-6 lg:px-8">
      <motion.header
        style={{ opacity: 1 }}
        className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8 pointer-events-auto mb-4"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.5rem] border border-[#d94a4a]/25 bg-[#b51e1e] px-4 py-3.5 shadow-[0_18px_60px_rgba(12,12,12,0.24)] sm:px-5 sm:py-4 lg:px-6 lg:py-4.5">
          <button onClick={handleLogoClick} className="flex items-center rounded-full px-1.5 py-1.5 text-white transition hover:bg-white/10">
            <img
              src="https://api.duzmetal.com/medyalar/genel/ac6c6626-c109-4279-9088-b236e34d946b.png"
              alt="Düz Metal"
              className="h-10 w-auto object-contain brightness-0 invert sm:h-12"
            />
          </button>
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] text-white md:flex">
            <button type="button" onClick={() => onNavigate('home')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Kurumsal</button>
            <button type="button" className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Ürünlerimiz</button>
            <button type="button" onClick={() => onNavigate('brands')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Markalarımız</button>
            <button type="button" onClick={() => onNavigate('contact')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">İletişim</button>
          </nav>
          <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#b51e1e] shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
            B2B Giriş
          </a>
        </div>
      </motion.header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 pt-24">

        <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-[999px] border border-stone-200 bg-stone-50 px-4 py-3 shadow-inner">
              <Search size={18} className="text-[#a11818]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ürün adı veya marka ara"
                className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-700">
                <SlidersHorizontal size={16} className="text-[#a11818]" />
                Marka
              </div>
              {brands.map((brand) => {
                const active = brand === selectedBrand
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${active ? 'bg-[#b51e1e] text-white shadow-[0_8px_20px_rgba(181,30,30,0.18)]' : 'border border-stone-200 bg-white text-stone-700 hover:border-[#b51e1e]/20 hover:text-[#b51e1e]'}`}
                  >
                    {brand}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-stone-600">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 font-semibold text-stone-700">
              {filteredProducts.length} ürün bulundu
            </span>
            {searchTerm ? (
              <button type="button" onClick={() => setSearchTerm('')} className="rounded-full border border-stone-200 bg-white px-3 py-2 font-semibold text-stone-700 transition hover:text-[#b51e1e]">
                Aramayı temizle
              </button>
            ) : null}
            {selectedBrand !== 'Tümü' ? (
              <button type="button" onClick={() => setSelectedBrand('Tümü')} className="rounded-full border border-stone-200 bg-white px-3 py-2 font-semibold text-stone-700 transition hover:text-[#b51e1e]">
                Tüm markaları göster
              </button>
            ) : null}
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.04)]">
                <div className="h-80 bg-stone-200" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 rounded bg-stone-200" />
                  <div className="h-5 w-3/4 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative h-96 overflow-hidden bg-stone-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.currentTarget
                        target.src = 'https://images.unsplash.com/photo-1581092335064-14f3ee9b14e1?auto=format&fit=crop&w=900&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-stone-700">
                      {product.brand}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-3 text-base font-semibold leading-snug text-stone-900">{product.name}</h2>
                  </div>
                </motion.article>
              ))}
            </div>

            {!filteredProducts.length ? (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-10 text-center text-stone-600">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-[#a11818]">
                  <ImageOff size={24} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-stone-900">Aramanıza uygun ürün bulunamadı</h3>
                <p className="mt-3 text-sm leading-7">Filtreyi temizleyip tüm ürünleri görüntüleyebilir veya farklı bir marka seçebilirsiniz.</p>
                <button type="button" onClick={() => { setSearchTerm(''); setSelectedBrand('Tümü') }} className="mt-6 rounded-full bg-[#b51e1e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a51818]">
                  Tüm ürünleri göster
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 rounded-[1.75rem] border border-stone-200 bg-white p-5 shadow-[0_20px_70px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-stone-600">
                  Sayfa {page} • {formatPageRange(filteredProducts.length, page)} / {filteredProducts.length} ürün gösteriliyor
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#b51e1e]/20 hover:text-[#b51e1e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Önceki
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${pageNumber === page ? 'bg-[#b51e1e] text-white' : 'border border-stone-300 text-stone-700 hover:border-[#b51e1e]/20 hover:text-[#b51e1e]'}`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-[#b51e1e]/20 hover:text-[#b51e1e] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
