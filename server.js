import express from 'express'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
app.use(express.json())

// CORS Header'ları
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Logs directory oluştur
const logsDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'mail.uzmanposta.com',
  port: 587,
  secure: false,
  auth: {
    user: 'b2b@duzmetal.com',
    pass: 'x87bpPvF32wK,6GdU(B*q9iC@JHueg',
  },
})

// Verifi et
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error)
  } else {
    console.log('SMTP Server Ready')
  }
})

app.post('/api/dealer-application', async (req, res) => {
  try {
    const { ad_soyad, telefon, firma_adi, vergi_dairesi, vergi_no, aciklama } =
      req.body

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
    const logDate = new Date().toISOString().split('T')[0]

    // Log dosyasına kaydet
    const logFile = path.join(logsDir, `dealer-applications-${logDate}.txt`)
    const logEntry = `
=====================================
TARİH: ${timestamp}
=====================================
AD SOYAD: ${ad_soyad}
TELEFON: ${telefon}
FIRMA ADI: ${firma_adi}
VERGİ DAİRESİ: ${vergi_dairesi}
VERGİ NUMARASI: ${vergi_no}
AÇIKLAMA: ${aciklama}
=====================================

`

    fs.appendFileSync(logFile, logEntry)

    // Email gönder
    const mailOptions = {
      from: 'b2b@duzmetal.com',
      to: 'satisdestek@duzmetal.com, orhaneser60@gmail.com',
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
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; white-space: pre-wrap;">${aciklama}</td>
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
Açıklama: ${aciklama}

Tarih: ${timestamp}
      `,
    }

    await transporter.sendMail(mailOptions)

    console.log('Email gönderildi:', {
      to: mailOptions.to,
      cc: mailOptions.cc,
      subject: mailOptions.subject,
    })

    res.json({
      success: true,
      message: 'Başvuru başarıyla gönderilmiştir',
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      message:
        'Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyiniz.',
    })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
