import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function ContactPage({ onNavigate }: { onNavigate: (page: 'home' | 'catalog' | 'contact' | 'brands' | 'dealer') => void }) {
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
              İletişim
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
              Bir sonraki iş birliği için birlikte çalışalım.
            </h1>
            <p className="mt-6 text-lg leading-8 text-stone-600 max-w-2xl mx-auto">
              Soudal ve diğer markaların ürünleri, teknik destek veya dağıtım planlaması için bizimle iletişime geçebilirsiniz.
            </p>
          </motion.section>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-stone-200 bg-white p-8 text-left shadow-[0_20px_60px_rgba(15,23,42,0.03)] sm:p-10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">İletişim</p>
              <h3 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
                İstanbul merkezli operasyonlarımızla size yakın bir destek sunuyoruz.
              </h3>
              <p className="mt-4 text-lg leading-8 text-stone-600">
                İnşaat ve imalat operasyonlarınızın Soudal ve yapı kimyası ürün gereksinimlerine uygun lojistik planlaması için iletişime geçebilirsiniz.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 text-stone-600">
                  <MapPin size={18} className="mt-0.5 text-[#a11818]" />
                  <div>
                    <p className="font-semibold text-stone-900">Adres</p>
                    <p>Yeşilbayır, Hadımköy-İstanbul Cd. No:114 D:1, 34279 Arnavutköy/İstanbul, Türkiye</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-stone-600">
                  <Mail size={18} className="mt-0.5 text-[#a11818]" />
                  <div>
                    <p className="font-semibold text-stone-900">E-posta</p>
                    <p>satisdestek@duzmetal.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-stone-600">
                  <Phone size={18} className="mt-0.5 text-[#a11818]" />
                  <div>
                    <p className="font-semibold text-stone-900">Telefon</p>
                    <p>+90 549 903 24 10</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.03)]"
            >
              <iframe
                title="Düz Metal konum haritası"
                src="https://www.google.com/maps?q=Ye%C5%9Filbay%C4%B1r%2C%20Had%C4%B1mk%C3%B6y-%C4%B0stanbul%20Cd.%20No%3A114%2F1%2C%2034555%20Arnavutk%C3%B6y%2F%C4%B0stanbul&output=embed"
                className="h-full min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer onPageChange={onNavigate} />
    </div>
  )
}
