import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface FormData {
  ad_soyad: string
  telefon: string
  firma_adi: string
  vergi_dairesi: string
  vergi_no: string
  aciklama: string
}

interface FormError {
  [key: string]: string
}

export const DealerApplicationPage = ({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (page: 'home' | 'catalog' | 'contact' | 'brands' | 'dealer') => void }) => {
  const [formData, setFormData] = useState<FormData>({
    ad_soyad: '',
    telefon: '',
    firma_adi: '',
    vergi_dairesi: '',
    vergi_no: '',
    aciklama: '',
  })

  const [errors, setErrors] = useState<FormError>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleLogoClick = () => {
    onBack()
  }

  const validateForm = (): boolean => {
    const newErrors: FormError = {}

    if (!formData.ad_soyad.trim()) {
      newErrors.ad_soyad = 'Ad Soyadı zorunludur'
    }

    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon zorunludur'
    } else if (!/^\d{10,}$/.test(formData.telefon.replace(/\D/g, ''))) {
      newErrors.telefon = 'Geçerli bir telefon numarası giriniz'
    }

    if (!formData.firma_adi.trim()) {
      newErrors.firma_adi = 'Firma Adı zorunludur'
    }

    if (!formData.vergi_dairesi.trim()) {
      newErrors.vergi_dairesi = 'Vergi Dairesi zorunludur'
    }

    if (!formData.vergi_no.trim()) {
      newErrors.vergi_no = 'Vergi Numarası zorunludur'
    } else {
      const vergiNum = formData.vergi_no.replace(/\D/g, '')
      if (vergiNum.length < 10 || vergiNum.length > 11) {
        newErrors.vergi_no = 'Vergi Numarası 10 veya 11 rakamdan oluşmalıdır'
      }
    }

    if (!formData.aciklama.trim()) {
      newErrors.aciklama = 'Açıklama zorunludur'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    
    // Vergi numarası - sadece rakam
    if (name === 'vergi_no') {
      const onlyNumbers = value.replace(/\D/g, '')
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    
    // Temizle hatayı
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/dealer-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Başvuru gönderilemedi')
      }

      setSubmitted(true)
      setFormData({
        ad_soyad: '',
        telefon: '',
        firma_adi: '',
        vergi_dairesi: '',
        vergi_no: '',
        aciklama: '',
      })

      // 3 saniye sonra sayfayı resetle
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Bir hata oluştu'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-stone-800">
      <motion.header
        style={{ opacity: 1 }}
        className="fixed inset-x-0 top-4 z-40 px-4 sm:px-6 lg:px-8 pointer-events-auto"
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
            <button type="button" onClick={handleLogoClick} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Kurumsal</button>
            <button type="button" onClick={() => onNavigate?.('catalog')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Ürünlerimiz</button>
            <button type="button" onClick={() => onNavigate?.('brands')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Markalarımız</button>
            <button type="button" onClick={() => onNavigate?.('contact')} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">İletişim</button>
            <button type="button" className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">Bayilik Başvurusu</button>
          </nav>
          <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#b51e1e] shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
            B2B Giriş
          </a>
        </div>
      </motion.header>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bayilik Başvurusu
            </h1>
          </motion.div>

          {/* Form ve Resim Grid */}
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-10"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Başvuru Başarıyla Gönderildi!
                  </h3>
                  <p className="text-gray-600">
                    Başvurunuz alınmıştır. Kısa sürede sizinle iletişime
                geçilecektir.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ad Soyad */}
              <div>
                <label
                  htmlFor="ad_soyad"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Ad Soyadı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="ad_soyad"
                  name="ad_soyad"
                  value={formData.ad_soyad}
                  onChange={handleChange}
                  placeholder="Adınız ve Soyadınız"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.ad_soyad
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.ad_soyad && (
                  <p className="text-red-500 text-sm mt-1">{errors.ad_soyad}</p>
                )}
              </div>

              {/* Telefon */}
              <div>
                <label
                  htmlFor="telefon"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  placeholder="0532 XXX XX XX"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.telefon ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.telefon && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefon}</p>
                )}
              </div>

              {/* Firma Adı */}
              <div>
                <label
                  htmlFor="firma_adi"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Firma Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firma_adi"
                  name="firma_adi"
                  value={formData.firma_adi}
                  onChange={handleChange}
                  placeholder="Firmanızın Adı"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.firma_adi
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.firma_adi && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firma_adi}
                  </p>
                )}
              </div>

              {/* Vergi Dairesi */}
              <div>
                <label
                  htmlFor="vergi_dairesi"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Vergi Dairesi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="vergi_dairesi"
                  name="vergi_dairesi"
                  value={formData.vergi_dairesi}
                  onChange={handleChange}
                  placeholder="Vergi Dairesi Adı"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.vergi_dairesi
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.vergi_dairesi && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.vergi_dairesi}
                  </p>
                )}
              </div>

              {/* Vergi Numarası */}
              <div>
                <label
                  htmlFor="vergi_no"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Vergi Numarası <span className="text-red-500">*</span>
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (10-11 rakam)
                  </span>
                </label>
                <input
                  type="text"
                  id="vergi_no"
                  name="vergi_no"
                  value={formData.vergi_no}
                  onChange={handleChange}
                  placeholder="Vergi Numarası"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition ${
                    errors.vergi_no
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.vergi_no && (
                  <p className="text-red-500 text-sm mt-1">{errors.vergi_no}</p>
                )}
              </div>

              {/* Açıklama */}
              <div>
                <label
                  htmlFor="aciklama"
                  className="block text-sm font-semibold text-gray-900 mb-2"
                >
                  Açıklama / Müşteri Hedef Grubu <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="aciklama"
                  name="aciklama"
                  value={formData.aciklama}
                  onChange={handleChange}
                  placeholder="Firmanız hakkında bilgi verin, hangi müşteri gruplarını hedeflediniz, neden Duzmetal'i seçmek istiyorsunuz..."
                  rows={5}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none ${
                    errors.aciklama
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                />
                {errors.aciklama && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.aciklama}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">Hata</h4>
                    <p className="text-red-700 text-sm">{submitError}</p>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#b51e1e] hover:bg-[#a51818] active:bg-[#941414]'
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  'Başvuruyu Gönder'
                )}
              </motion.button>

              <p className="text-center text-sm text-gray-500">
                <span className="text-red-500">*</span> Zorunlu alanlar
              </p>
            </form>
            )}
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:flex rounded-2xl border border-stone-200 bg-white shadow-lg overflow-hidden"
            >
              <img
                src="/images/soudal-palet-stok.jpg"
                alt="Duzmetal Stok"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#b51e1e]/10 border-l-4 border-[#b51e1e] rounded-lg p-6"
          >
            <h3 className="font-semibold text-[#a11818] mb-2">
              Duzmetal'in Tedarik Ağına Katılın
            </h3>
            <p className="text-[#7a1414] text-sm">
              Binlerce ürünü stoklayan Duzmetal, hızlı teslimat ve profesyonel destek ile iş ortaklarını büyütmeye yardımcı olur. Başvurunuz alındıktan sonra en kısa sürede sizinle iletişime geçilecektir.
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-stone-300/70 bg-white/70 px-6 py-10 text-sm text-stone-600 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Düz Metal</p>
            <p className="mt-3 max-w-md leading-7">GÜÇLÜ STOK, TOPTAN SATIŞ, HIZLI TESLİMAT</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleLogoClick} className="transition hover:text-[#b51e1e]">Kurumsal</button>
            <button type="button" onClick={() => onNavigate?.('catalog')} className="transition hover:text-[#b51e1e]">Ürünlerimiz</button>
            <button type="button" onClick={() => onNavigate?.('brands')} className="transition hover:text-[#b51e1e]">Markalarımız</button>
            <button type="button" onClick={() => onNavigate?.('contact')} className="transition hover:text-[#b51e1e]">İletişim</button>
            <button type="button" className="transition hover:text-[#b51e1e]">Bayilik Başvurusu</button>
            <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#b51e1e]/15 bg-[#b51e1e]/10 px-4 py-2 text-sm font-semibold text-[#a11818] transition hover:bg-[#b51e1e]/15">
              B2B Giriş
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs uppercase tracking-[0.28em] text-stone-500">© 2026 Düz Metal. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}
