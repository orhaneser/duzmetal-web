import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

type Brand = {
  name: string
  logo: string
}

const XML_CATALOG_URL = '/products.xml'

// Marka logolarının URL'leri (Türkçe karakterlere dikkat!)
const BRAND_LOGOS: Record<string, string> = {
  'SOUDAL': 'https://www.soudalturkiye.com/img/logo.svg',
  'SELSİL': 'https://eshop.selsil.com/cdn/shop/files/logo.png?height=628&pad_color=ffffff&v=1727703985&width=1200',
  'APEL': 'https://www.nextendustri.com/upload/apel.png',
  'TEKNO': 'https://manuzone.com/files/logo/logoen-swnZSU0.png',
  'TYTAN': 'https://tytan.com/tr/wp-content/themes/selena-tytan.com/dist/images/logo-white.svg',
  'MOMENTIVE': 'https://www.momentive.com/etc.clientlibs/momentive/clientlibs/dist/images/momentive-logo.svg',
  'HENKEL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Henkel_logo_2020.svg/1280px-Henkel_logo_2020.svg.png',
  'BASF': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/BASF_logo.svg/1280px-BASF_logo.svg.png',
  'BOSTIK': 'https://www.bostik.com/-/media/Project/Bostik/bostik-global/images/logos/bostik-logo-white.svg',
  'DOW': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Dow_Chemical_Company_Logo.svg/1280px-Dow_Chemical_Company_Logo.svg.png',
  'TREMCO': 'https://www.tremco.com/resource/image/c4e3ca6e-11d9-4a26-b6dc-a2c0d5e1f2b3/logo.png',
}

function getImageClassName(brandName: string): string {
  const upperName = brandName.toUpperCase().trim()
  // TEKNO logosu küçük olduğu için büyütüyoruz
  if (upperName === 'TEKNO') {
    return 'h-full w-full object-contain p-2 transition duration-500 group-hover:scale-105 scale-125'
  }
  return 'h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105'
}

function getBrandLogo(brandName: string): string {
  const trimmed = brandName.trim()
  return BRAND_LOGOS[trimmed] || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=400&q=80'
}

function parseXmlBrands(xmlText: string): Brand[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    console.error('XML parsing error')
    return []
  }

  const products = xmlDoc.getElementsByTagName('product')
  const brandSet = new Set<string>()

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const brandElement = product.getElementsByTagName('brand')[0]

    if (brandElement && brandElement.textContent) {
      brandSet.add(brandElement.textContent)
    }
  }

  const brands: Brand[] = []
  brandSet.forEach((brandName) => {
    const logo = getBrandLogo(brandName)
    brands.push({ name: brandName, logo })
  })

  return brands.sort((a, b) => a.name.localeCompare(b.name, 'tr'))
}

export function BrandsPage({ onNavigate }: { onNavigate: (page: 'home' | 'catalog' | 'contact' | 'brands' | 'dealer') => void }) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    const fetchBrands = async () => {
      try {
        const response = await fetch(XML_CATALOG_URL)
        if (!response.ok) {
          throw new Error('Failed to fetch brands')
        }
        const xmlText = await response.text()
        const parsedBrands = parseXmlBrands(xmlText)
        setBrands(parsedBrands)
      } catch (error) {
        console.error('Could not load brands', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchBrands()
  }, [])

  return (
    <div className="min-h-screen bg-transparent text-stone-800">
      <Navbar onPageChange={onNavigate} />

      <main className="space-y-16 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-16 pt-24">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#b51e1e]/15 bg-[#b51e1e]/10 px-3 py-1.5 text-sm font-semibold text-[#a11818]">
              İş Ortakları
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Soudal ve Partner Markaları
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600 max-w-2xl mx-auto">
              Düz Metal, seçkin markaların ürünlerini toptan dağıtım, stok desteği ve teknik uzmanlık ile sunar.
            </p>
          </motion.section>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full flex items-center justify-center py-16 text-stone-600">
                Markalar yükleniyor...
              </div>
            ) : brands.length === 0 ? (
              <div className="col-span-full flex items-center justify-center py-16 text-stone-600">
                Marka bulunamadı
              </div>
            ) : (
              brands.map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4 h-40 w-full rounded-[1rem] bg-stone-50 flex items-center justify-center overflow-hidden border border-stone-200">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className={getImageClassName(brand.name)}
                        onError={(event) => {
                          const target = event.currentTarget
                          target.src = 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=400&q=80'
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-stone-900">{brand.name}</h3>
                  </div>
                </motion.div>
              ))
            )}
          </div>


        </div>
      </main>

      <Footer onPageChange={onNavigate} />
    </div>
  )
}
