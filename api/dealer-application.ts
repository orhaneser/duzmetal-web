import type { VercelRequest, VercelResponse } from '@vercel/node'
import nodemailer from 'nodemailer'

// Nodemailer transporter konfigürasyonu
const transporter = nodemailer.createTransport({
  host: 'mail.uzmanposta.com',
  port: 587,
  secure: false,
  auth: {
    user: 'b2b@duzmetal.com',
    pass: 'x87bpPvF32wK,6GdU(B*q9iC@JHueg',
  },
})

export default async (req: VercelRequest, res: VercelResponse) => {
  // CORS Header'ları
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // OPTIONS isteği
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { ad_soyad, telefon, firma_adi, vergi_dairesi, vergi_no, aciklama } = req.body

    // Validasyon (aciklama isteğe bağlı)
    if (!ad_soyad || !telefon || !firma_adi || !vergi_dairesi || !vergi_no) {
      return res.status(400).json({ message: 'Tüm zorunlu alanlar doldurulmalıdır' })
    }

    // Vergi numarası validasyonu
    const vergiNum = vergi_no.replace(/\D/g, '')
    if (vergiNum.length < 10 || vergiNum.length > 11) {
      return res.status(400).json({
        message: 'Vergi Numarası 10 veya 11 rakamdan oluşmalıdır',
      })
    }

    // Timestamp
    const timestamp = new Date().toLocaleString('tr-TR')

    // Email gönder
    const mailOptions = {
      from: 'b2b@duzmetal.com',
      to: ['satisdestek@duzmetal.com', 'orhaneser60@gmail.com'],
      subject: `Yeni Bayilik Başvurusu - ${firma_adi}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="background-color: #b51e1e; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0;">Yeni Bayilik Başvurusu</h2>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Ad Soyadı:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${ad_soyad}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Telefon:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${telefon}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Firma Adı:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${firma_adi}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Vergi Dairesi:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${vergi_dairesi}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Vergi Numarası:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${vergi_no}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; vertical-align: top;">Açıklama:</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; white-space: pre-wrap;">${aciklama || '(Boş)'}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #f9f9f9; padding: 15px; text-align: center; border-top: 1px solid #ddd; margin-top: 20px; font-size: 12px; color: #666;">
                <p>Bu başvuru ${timestamp} tarihinde alınmıştır.</p>
                <p><strong>Duzmetal - Soudal, Tytan, Selsil Distribütörü</strong></p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Yeni Bayilik Başvurusu

Ad Soyadı: ${ad_soyad}
Telefon: ${telefon}
Firma Adı: ${firma_adi}
Vergi Dairesi: ${vergi_dairesi}
Vergi Numarası: ${vergi_no}
Açıklama: ${aciklama || '(Boş)'}

Tarih: ${timestamp}
      `,
    }

    // Mail gönder
    await transporter.sendMail(mailOptions)

    console.log('Email gönderildi:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      timestamp,
    })

    return res.status(200).json({
      success: true,
      message: 'Başvuru başarıyla gönderilmiştir',
    })
  } catch (error) {
    console.error('Dealer Application Error:', error)
    return res.status(500).json({
      message: 'Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyiniz.',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
