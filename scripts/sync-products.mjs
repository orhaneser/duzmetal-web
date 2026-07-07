import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../public/products.xml')

// Load environment variables from .env.local
async function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env.local')
    const envContent = await readFile(envPath, 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        const value = valueParts.join('=')
        if (key && value) {
          process.env[key.trim()] = value.trim()
        }
      }
    }
  } catch (error) {
    console.warn('Could not load .env.local file:', error.message)
  }
}

await loadEnv()

const baseUrl = process.env.ULUDEM_API_BASE_URL || process.env.VITE_ULUDEM_API_BASE_URL || 'https://api.duzmetal.com'
const bearerToken = process.env.ULUDEM_BEARER_TOKEN || process.env.VITE_ULUDEM_BEARER_TOKEN
const clientId = process.env.ULUDEM_CLIENT_ID
const clientSecret = process.env.ULUDEM_CLIENT_SECRET

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function getAccessToken() {
  if (bearerToken) {
    console.log('Using provided bearer token')
    return bearerToken
  }

  if (!clientId || !clientSecret) {
    throw new Error('ULUDEM_CLIENT_ID and ULUDEM_CLIENT_SECRET are required')
  }

  console.log(`Requesting OAuth token from ${baseUrl}/api/oauth/token...`)
  
  const response = await fetch(`${baseUrl}/api/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'urun:liste',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`OAuth Error (${response.status}):`, errorText.substring(0, 500))
    throw new Error(`Token request failed with status ${response.status}`)
  }

  const payload = await response.json()
  console.log('✓ OAuth token obtained successfully')
  const tokenData = payload.data || payload
  const accessToken = tokenData.access_token || payload.access_token || tokenData.token
  if (!accessToken) {
    throw new Error('No access token in response')
  }
  console.log(`Token (first 20 chars): ${accessToken.substring(0, 20)}...`)
  if (tokenData.expires_in) console.log(`Token expires in: ${tokenData.expires_in} seconds`)
  return accessToken
}

async function fetchProducts(accessToken) {
  console.log(`Fetching products from ${baseUrl}/api/urun/index...`)
  console.log(`Authorization header: Bearer ${accessToken.substring(0, 20)}...`)
  
  let allProducts = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    console.log(`\nFetching page ${page}...`)
    const response = await fetch(`${baseUrl}/api/urun/index`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'tr',
      },
      body: JSON.stringify({
        kelime: '',
        markaId: 0,
        sayfa: page,
        sayfaLimit: 200,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error (${response.status}):`, errorText.substring(0, 500))
      throw new Error(`Product list request failed with status ${response.status}`)
    }

    const payload = await response.json()
    console.log(`✓ API response received`)
    
    // Data structure: { status, code, data: { toplamSayfa, sayfa, veri: [...] } }
    let rows = []
    if (payload.data?.veri && Array.isArray(payload.data.veri)) {
      rows = payload.data.veri
    } else if (payload.data && Array.isArray(payload.data)) {
      rows = payload.data
    } else if (Array.isArray(payload)) {
      rows = payload
    }
    
    if (payload.data?.toplamSayfa) {
      totalPages = payload.data.toplamSayfa
      console.log(`Pages: ${(payload.data.sayfa || page)}/${totalPages}`)
    }
    console.log(`Rows in this page: ${rows.length}`)
    
    // Debug first product image structure
    if (rows.length > 0 && rows[0]) {
      console.log('First product resimList:', JSON.stringify(rows[0].resimList, null, 2).substring(0, 200))
    }
    
    const pageProducts = rows.map((item, index) => {
      const code = item?.kod || item?.urunKodu || item?.code || item?.id || `${index + 1}`
      const name = item?.baslik || item?.urunAdi || item?.name || `Ürün ${index + 1}`
      
      // Get first image from resimList array 
      let image = ''
      if (Array.isArray(item?.resimList) && item.resimList.length > 0) {
        const first = item.resimList[0]
        // If it's an object with url property, use that; otherwise use toString
        image = (typeof first === 'string') ? first : (first?.url || first?.resimUrl || JSON.stringify(first))
      }
      
      // Fallback to other image fields
      if (!image) {
        image = item?.resim || item?.resimUrl || item?.gorsel || ''
      }
      
      const brand = item?.marka || item?.brand || 'Soudal'

      return { 
        code: String(code), 
        name: String(name), 
        image: String(image).trim(), 
        brand: String(brand) 
      }
    }).filter((item) => item.code && item.name && item.image && item.image !== '[object Object]')
    
    allProducts = allProducts.concat(pageProducts)
    page++
  }

  console.log(`\n✓ Total products fetched: ${allProducts.length}`)
  return allProducts
}


function buildXml(products) {
  const generatedAt = new Date().toISOString()
  const validProducts = products.filter((item) => item.code && item.name && item.image)
  const productXml = validProducts
    .map((product) => `  <product>\n    <code>${escapeXml(product.code)}</code>\n    <name>${escapeXml(product.name)}</name>\n    <brand>${escapeXml(product.brand)}</brand>\n    <image>${escapeXml(product.image)}</image>\n  </product>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<products generatedAt="${escapeXml(generatedAt)}" totalCount="${validProducts.length}">\n${productXml}\n</products>\n`
}

async function main() {
  console.log(`Using API base URL: ${baseUrl}`)
  console.log(`Client ID: ${clientId ? clientId.substring(0, 10) + '...' : 'NOT SET'}`)
  
  const accessToken = await getAccessToken()
  const products = await fetchProducts(accessToken)
  const validProducts = products.filter((item) => item.image)
  
  console.log(`Fetched ${products.length} total products, ${validProducts.length} with images`)
  
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, buildXml(validProducts), 'utf8')
  console.log(`Wrote ${validProducts.length} products with images to ${outputPath}`)
}

main().catch((error) => {
  console.error('Sync failed:', error.message)
  process.exitCode = 1
})
