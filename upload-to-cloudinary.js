import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join, basename, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// ─── Cloudinary Config ───────────────────────────────────────────────────────
const CLOUD_NAME = 'ui7ywkah'
const UPLOAD_PRESET = 'yumfast'
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

// ─── Upload a single file ────────────────────────────────────────────────────
async function uploadImage(filePath, folder, publicId) {
  const ext = extname(filePath).slice(1).toLowerCase()
  const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'

  const fileBuffer = readFileSync(filePath)
  const base64 = fileBuffer.toString('base64')
  const dataUri = `data:${mimeType};base64,${base64}`

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file: dataUri,
      upload_preset: UPLOAD_PRESET,
      folder,
      public_id: publicId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message || JSON.stringify(data))
  }

  return data.secure_url
}

// ─── Upload a whole directory ─────────────────────────────────────────────────
async function uploadDirectory(localPath, cloudFolder, label) {
  const files = readdirSync(localPath)
  const urlMap = {}

  console.log(`\n${label}`)
  for (const file of files) {
    const filePath = join(localPath, file)
    const publicId = basename(file, extname(file))
    process.stdout.write(`  ⬆️  ${file} ... `)

    try {
      const url = await uploadImage(filePath, cloudFolder, publicId)
      urlMap[file] = url
      console.log('✅')
      console.log(`      ${url}`)
    } catch (err) {
      console.log('❌')
      console.error(`      Error: ${err.message}`)
    }
  }

  return urlMap
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Starting Cloudinary upload for YumFast mobile app assets...')
  console.log(`   Cloud: ${CLOUD_NAME}  |  Preset: ${UPLOAD_PRESET}\n`)

  // Go up one level from marketing-site to reach the Flutter project root
  const appRoot = join(__dirname, '..')

  const foodUrls = await uploadDirectory(
    join(appRoot, 'assets', 'food'),
    'yumfast/app/food',
    '🍔 Uploading app food images (assets/food/)...'
  )

  const miscUrls = await uploadDirectory(
    join(appRoot, 'assets', 'misc'),
    'yumfast/app/misc',
    '🗂️  Uploading app misc images (assets/misc/)...'
  )

  const result = {
    'app/food': foodUrls,
    'app/misc': miscUrls,
  }

  const outPath = join(__dirname, 'cloudinary-app-urls.json')
  writeFileSync(outPath, JSON.stringify(result, null, 2))

  console.log('\n──────────────────────────────────────────────────────')
  console.log(`✅ All done! URLs saved to cloudinary-app-urls.json`)
  console.log('──────────────────────────────────────────────────────')
  console.log('\nFull URL map:')
  console.log(JSON.stringify(result, null, 2))
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
