import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Building2,
  Factory,
  PackageCheck,
  ShieldCheck,
  Truck,
  Warehouse,
} from 'lucide-react'
import { ProductCatalogPage } from './components/ProductCatalogPage'
import { ContactPage } from './components/ContactPage'
import { BrandsPage } from './components/BrandsPage'
import { Section } from './components/Section'
import { StatCard } from './components/StatCard'

interface ImageSliderProps {
  images: string[];
  alt: string;
}

const ImageSlider = ({ images, alt }: ImageSliderProps) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full overflow-hidden rounded-[2rem]">
        {images.map((image, index) => (
          <motion.img
            key={index}
            src={image}
            alt={`${alt} ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: current === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
              current === index
                ? 'bg-white w-8 h-2'
                : 'bg-white/60 w-2 h-2 hover:bg-white/80'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const reasons = [
  {
    title: 'Hızlı ve güvenli tedarik',
    description: 'Soudal ve partner markaları yapı kimyası ürünlerini güçlü stok ve dağıtım altyapısıyla zamanda teslim ediyoruz.',
    icon: Warehouse,
  },
  {
    title: 'Teknik danışmanlık ve destek',
    description: 'Soudal ürün seçimi, uygulama alanı ve saha ihtiyaçları için uzman ekibimiz yanınızda.',
    icon: Truck,
  },
  {
    title: 'Profesyonel dağıtım yönetimi',
    description: 'Soudal kimyası ürünlerinde doğru seçim, profesyonel depolama ve güvenilir teslimat akışıyla operasyonel süreklilik sağlıyoruz.',
    icon: ShieldCheck,
  },
]

type ProductCardItem = {
  title: string
  description: string
  image: string
  icon: typeof Factory
}

const fallbackProducts: ProductCardItem[] = [
  {
    title: 'Soudal Yapı Kimyasalları',
    description: 'Yapı ve imalat operasyonlarında dayanıklılık, uygulama kolaylığı ve uzun ömürlü performans hedefleyen Soudal yapıştırıcı, conta ve koruma ürünleri. Resmi Soudal distribütörü olarak toptan satış sunuyoruz.',
    image: '/images/katalog-1.jpg',
    icon: Factory,
  },
  {
    title: 'Tytan Sızdırmazlık Sistemleri',
    description: 'Tytan silikon ve poliüretan sızdırmazlık ürünlerinde hava, su ve termal yalıtımda profesyonel çözümler ve teknik destek.',
    image: '/images/katalog-2.jpg',
    icon: Building2,
  },
  {
    title: 'Selsil Tedarik Çözümleri',
    description: 'Selsil yapı kimyası ürünlerinin profesyonel depo yönetimi, stok desteği ve garantili teslimat sunumu.',
    image: '/images/katalog-3.jpg',
    icon: PackageCheck,
  },
]

const stats = [
  { value: '100%', label: 'resmi distribütör' },
  { value: '100+', label: 'ürün portföyü' },
  { value: '24/7', label: 'teknik destek' },
  { value: '48 saat', label: 'hızlı teslimat' },
]

const references = ['Enerji', 'İnşaat', 'İmalat', 'Lojistik', 'Altyapı', 'Otomotiv']

function App() {
  const [products, setProducts] = useState<ProductCardItem[]>(fallbackProducts)
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'contact' | 'brands'>(() => {
    // URL'den page'i oku
    const hash = window.location.hash.slice(2) // #/home -> home
    const validPages = ['home', 'catalog', 'contact', 'brands']
    const pageFromUrl = hash as any
    if (validPages.includes(pageFromUrl)) {
      return pageFromUrl
    }
    // localStorage'dan oku
    const saved = localStorage.getItem('duzmetal-current-page')
    if (saved && validPages.includes(saved)) {
      return saved as any
    }
    return 'home'
  })

  // URL'yi güncelle ve localStorage'a kaydet
  const handlePageChange = (page: 'home' | 'catalog' | 'contact' | 'brands') => {
    setCurrentPage(page)
    window.location.hash = `#/${page}`
    localStorage.setItem('duzmetal-current-page', page)
  }

  useEffect(() => {
    const token = import.meta.env.VITE_ULUDEM_BEARER_TOKEN
    const apiBaseUrl = import.meta.env.VITE_ULUDEM_API_BASE_URL ?? 'http://b4bapi.uludem.com.tr'

    if (!token) {
      setProducts(fallbackProducts)
      return
    }

    const controller = new AbortController()

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/urun/index`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept-Language': 'tr',
          },
          body: JSON.stringify({
            kelime: '',
            markaId: 0,
            sayfa: 1,
            sayfaLimit: 6,
          }),
          signal: controller.signal,
        })

        const payload = await response.json()
        const responseItems = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.items)
            ? payload.data.items
            : Array.isArray(payload?.items)
              ? payload.items
              : []

        const mappedProducts: ProductCardItem[] = responseItems.slice(0, 6).map((item: any, index: number) => ({
          title: item.baslik || item.title || `Ürün ${index + 1}`,
          description: item.aciklama || item.description || `${item.marka ?? 'Ürün'}${item.model ? ` • ${item.model}` : ''}`,
          image: Array.isArray(item.resimList) && item.resimList.length > 0
            ? item.resimList[0]
            : fallbackProducts[index % fallbackProducts.length].image,
          icon: Factory,
        }))

        setProducts(mappedProducts.length > 0 ? mappedProducts : fallbackProducts)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Could not fetch UluDem products', error)
        }
        setProducts(fallbackProducts)
      }
    }

    void fetchProducts()

    return () => controller.abort()
  }, [])

  if (currentPage === 'catalog') {
    return <ProductCatalogPage onBack={() => handlePageChange('home')} onNavigate={handlePageChange} />
  }

  if (currentPage === 'contact') {
    return <ContactPage onBack={() => handlePageChange('home')} onNavigate={handlePageChange} />
  }

  if (currentPage === 'brands') {
    return <BrandsPage onBack={() => handlePageChange('home')} onNavigate={handlePageChange} />
  }

  return (
    <div className="min-h-screen bg-transparent text-stone-800">
      <motion.header
        style={{ opacity: 1 }}
        className="fixed inset-x-0 top-4 z-30 px-4 sm:px-6 lg:px-8 pointer-events-auto"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.5rem] border border-[#d94a4a]/25 bg-[#b51e1e] px-4 py-3.5 shadow-[0_18px_60px_rgba(12,12,12,0.24)] sm:px-5 sm:py-4 lg:px-6 lg:py-4.5">
          <a href="#" className="flex items-center rounded-full px-1.5 py-1.5 text-white transition hover:bg-white/10">
            <img
              src="https://api.duzmetal.com/medyalar/genel/ac6c6626-c109-4279-9088-b236e34d946b.png"
              alt="Düz Metal"
              className="h-10 w-auto object-contain brightness-0 invert sm:h-12"
            />
          </a>
          <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] text-white md:flex">
            <a href="#kurumsal" className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Kurumsal</a>
            <button type="button" onClick={() => handlePageChange('catalog')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Ürünlerimiz</button>
            <button type="button" onClick={() => handlePageChange('brands')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Markalarımız</button>
            <button type="button" onClick={() => handlePageChange('contact')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">İletişim</button>
          </nav>
          <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#b51e1e] shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
            B2B Giriş
          </a>
        </div>
      </motion.header>

      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" poster="/hero-video-poster.jpg">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,39,0.82)_0%,rgba(17,24,39,0.68)_38%,rgba(17,24,39,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(181,30,30,0.16),_transparent_28%)]" />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-32 sm:px-8 lg:px-10 lg:py-36">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.4rem]">Güvenilir dağıtım, güçlü marka temsilciliği.</h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">Soudal ve diğer seçkin markalarla ürünlerini; güçlü stok, toptan satış ve teknik destek anlayışıyla müşterilerimize sunuyoruz.</p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <button type="button" onClick={() => handlePageChange('contact')} className="rounded-full bg-[#b51e1e] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(181,30,30,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#a51818]">İletişime Geç</button>
                  <button type="button" onClick={() => setCurrentPage('catalog')} className="rounded-full border border-stone-400/70 bg-white/85 px-7 py-3.5 text-sm font-semibold text-stone-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-0.5 hover:bg-white">Ürünleri İncele</button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Section eyebrow="Toptan Dağıtım ve Marka Temsili" title="Soudal ve diğer seçkin markalarla müşterilerimize güvenli, hızlı ve profesyonel bir tedarik deneyimi sunuyoruz." description="Müşterilerimize sadece ürün değil, teknik destek, stok güvence ve kesintisiz dağıtım altyapısı da sağlıyoruz.">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.03)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Operasyonel kapasite</p>
              <p className="mt-4 text-lg leading-8 text-stone-600">Tedarik zincirinde güvenilirlik sağlayan, büyük ölçekli Soudal ve partner markaları ihtiyaçlarına cevap veren yapımızla iş ortaklarımızın beklentilerini en iyi şekilde karşılıyoruz.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {stats.map((item) => (
                <StatCard key={item.label} value={item.value} label={item.label} />
              ))}
            </div>
          </div>
        </Section>

        <Section id="urunler" eyebrow="Ürünler" title="Müşteri ve saha ihtiyaçlarına uygun yapı kimyası ve malzeme çözümleri." description="Toptan dağıtım ve marka temsilciliği kimliğimizle, farklı uygulama alanlarına uygun ürün gamını güçlü stok ve teknik destekle sunuyoruz.">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] sm:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Soudal Ürün Portföyü</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">Ürün portföyümüzü katalog sayfasında profesyonel düzenle inceleyebilirsiniz.</h3>
              </div>
              <button type="button" onClick={() => setCurrentPage('catalog')} className="inline-flex items-center justify-center rounded-full bg-[#b51e1e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a51818]">
                Katalog sayfasına git
              </button>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {products.slice(0, 3).map((product, index) => {
                const Icon = product.icon
                return (
                  <motion.article key={product.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.06 }} whileHover={{ y: -8, scale: 1.01 }} className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-stone-50 shadow-[0_20px_60px_rgba(15,23,42,0.03)]">
                    <div className="relative h-56 overflow-hidden">
                      <img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
                      <div className="absolute left-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/90 text-stone-800">
                        <Icon size={18} />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-stone-900">{product.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-stone-600">{product.description}</p>
                    </div>
                  </motion.article>
                )
              })}
            </div>
          </div>
        </Section>

        <Section id="hizmetler" eyebrow="Neden Soudal Distribütörü Olarak Biz" title="Soudal tedarikinde deneyim, güvenilirlik ve operasyonel mükemmellik ile hizmet sunan dağıtım partneri." description="Stok güveni, lojistik yönetimi, Soudal ürün bilgisi ve teknik destek süreçleri aynı çatı altında, güvenli ve öngörülebilir bir şekilde yürütülür.">
          <div className="grid gap-6 lg:grid-cols-3">
            {reasons.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[2rem] border border-stone-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.03)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b51e1e]/10 text-[#a11818]">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-stone-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Section>

        <Section id="hakkimizda" eyebrow="Soudal Distribütörü Düz Metal Hakkında" title="İHTİYACINIZA UYGUN TÜM İZOLASYON GRUBU ÜRÜNLERİ İLE HİZMETİNİZDEYİZ" description="Düz Metal olarak, yapı ve imalat operasyonlarının ihtiyaçlarını karşılayabilmek için ileri düzey stok yönetimi, güvenli taşıma yapısı ve teknik ekip desteği ile çalışmaktayız.">
          <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white min-h-[400px] md:min-h-[500px]">
              <ImageSlider 
                images={['/images/soudal-palet-stok.jpg', '/images/hakkimizda-slider-1.jpg']} 
                alt="Hakkımızda Görselleri"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }} className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.03)] sm:p-10">
              <p className="text-lg leading-8 text-stone-600">Düz Metal olarak, üretim, inşaat ve saha operasyonlarının ihtiyaçlarını karşılayabilmek için ileri düzey stok yönetimi, güvenli taşıma yapısı ve teknik ekip desteği ile çalışmalarımızı sürdürmekteyiz.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b51e1e]">Misyon</p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">Tedarik operasyonlarını güvenli, zamanında ve maliyet etkin şekilde yürütülmesini sağlayan çözümler sunmak. Soudal ve partner markaları ürünlerinde en güvenilir dağıtıcı olmak.</p>
                </div>
                <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#b51e1e]">Vizyon</p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">Türkiye'nin önde gelen endüstriyel metal tedarik ortakları arasında sürdürülebilir bir konuma ulaşmak.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        <section className="mx-auto w-full max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="overflow-hidden rounded-[2.5rem] border border-stone-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)] grid gap-8 sm:grid-cols-[0.75fr_1fr]">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-[2.5rem]">
              <img src="/images/teknobond-401ep.jpg" alt="TEKNOBOND 401 EP - Saf Epoksi Esaslı Kimyasal Döbel" className="h-full w-full object-cover" />
            </div>
            <div className="grid gap-8 bg-white/90 p-8 sm:p-10 lg:p-12 content-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Tekno Endüstriyel Koruma Çözümleri</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">Tekno izolasyon, koruma ve dayanıklılık ürünleri.</h3>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">Tekno endüstriyel ürünleriyle çelik, metal ve yapı yüzeylerine uzun ömürlü koruma sağlıyoruz. Yüksek performanslı kaplama, çıkmazlık ve yalıtım sistemleri ile tedarik sunuyoruz.</p>
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-6">
                <div className="space-y-4 text-sm text-stone-600">
                  <div className="flex items-start gap-3"><Warehouse size={18} className="mt-1 text-[#a11818]" /><div><p className="font-semibold text-stone-900">Yüksek seviyede stok kontrolü</p><p className="mt-1">Kritik malzemelerin sürekliliğini koruyan düzenli bir stok yapısı.</p></div></div>
                  <div className="flex items-start gap-3"><Truck size={18} className="mt-1 text-[#a11818]" /><div><p className="font-semibold text-stone-900">Operasyonel dağıtım</p><p className="mt-1">İnşaat ve imalat operasyonlarının planlarına uygun Tekno ürün dağıtımı ile zaman yönetimi.</p></div></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <Section id="referanslar" eyebrow="Tedarik Sektörleri" title="Soudal ve yapı kimyası ürünlerini farklı endüstrilere dağıtıyoruz." description="Endüstri ihtiyaçlarının çeşitliliğine göre esnek ve güvenilir Soudal tedarik çözümleri sunuyoruz." align="center">
          <div className="flex flex-wrap justify-center gap-3">
            {references.map((ref) => (
              <motion.div key={ref} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-600">{ref}</motion.div>
            ))}
          </div>
        </Section>
      </main>

      <footer className="border-t border-stone-300/70 bg-white/70 px-6 py-10 text-sm text-stone-600 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Düz Metal</p>
            <p className="mt-3 max-w-md leading-7">GÜÇLÜ STOK, TOPTAN SATIŞ, HIZLI TESLİMAT</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#kurumsal" className="transition hover:text-[#b51e1e]">Kurumsal</a>
            <button type="button" onClick={() => handlePageChange('catalog')} className="transition hover:text-[#b51e1e]">Ürünlerimiz</button>
            <button type="button" onClick={() => handlePageChange('brands')} className="transition hover:text-[#b51e1e]">Markalarımız</button>
            <button type="button" onClick={() => handlePageChange('contact')} className="transition hover:text-[#b51e1e]">İletişim</button>
            <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#b51e1e]/15 bg-[#b51e1e]/10 px-4 py-2 text-sm font-semibold text-[#a11818] transition hover:bg-[#b51e1e]/15">B2B Giriş</a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs uppercase tracking-[0.28em] text-stone-500">© 2026 Düz Metal. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

export default App
