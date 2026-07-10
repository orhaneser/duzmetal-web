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

export const DealerApplicationPage = () => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bayilik Başvurusu
          </h1>
          <p className="text-lg text-gray-600">
            Duzmetal'in güçlü iş ortaklığı programına katılın ve Soudal, Tytan,
            Selsil ve diğer markaların distribütörü olun.
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
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

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6"
        >
          <h3 className="font-semibold text-blue-900 mb-2">
            Bayilik Hakkında
          </h3>
          <p className="text-blue-700 text-sm">
            Duzmetal olarak, Soudal, Tytan, Selsil, Apel ve diğer güçlü markaların
            distribütörü olmak için sizi bekliyoruz. Güçlü stok, hızlı teslimat ve
            profesyonel destek ile iş ortakları olarak büyüyebiliriz. Başvurunuz
            alındıktan sonra en kısa sürede sizinle iletişime geçilecektir.
          </p>
        </motion.div>
      </div>
    </main>
  )
}
