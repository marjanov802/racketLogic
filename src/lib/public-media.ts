import fs from 'node:fs'
import path from 'node:path'

const imageExtensions = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp'])

function stripWrappingQuotes(value: string) {
  return value.trim().replace(/^["']|["']$/g, '')
}

function safeDecodeUri(value: string) {
  try {
    return decodeURI(value)
  } catch {
    return value
  }
}

function getPublicRoot() {
  return path.resolve(process.cwd(), 'public')
}

function isInsidePublicRoot(resolvedPath: string) {
  const publicRoot = getPublicRoot()
  const relative = path.relative(publicRoot, resolvedPath)
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative))
}

export function normalisePublicMediaPath(value: string | null | undefined) {
  if (!value) return null

  let cleaned = stripWrappingQuotes(value).replace(/\\/g, '/')
  if (!cleaned) return null

  if (/^https?:\/\//i.test(cleaned)) return cleaned

  cleaned = cleaned.replace(/^file:\/+/i, '')

  const publicMarkerIndex = cleaned.toLowerCase().lastIndexOf('/public/')
  if (publicMarkerIndex >= 0) {
    cleaned = cleaned.slice(publicMarkerIndex + '/public'.length)
  } else {
    cleaned = cleaned.replace(/^public\//i, '')
  }

  if (/^[a-z]:\//i.test(cleaned)) return null

  const publicPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`
  if (publicPath.split('/').includes('..')) return null

  return publicPath
}

export function normalisePublicFolderPath(value: string | null | undefined) {
  return normalisePublicMediaPath(value)?.replace(/\/+$/, '') ?? null
}

export function publicPathExists(publicPath: string) {
  if (/^https?:\/\//i.test(publicPath)) return true

  const publicRoot = getPublicRoot()
  const resolvedPath = path.resolve(publicRoot, safeDecodeUri(publicPath).replace(/^\//, ''))
  return isInsidePublicRoot(resolvedPath) && fs.existsSync(resolvedPath)
}

export function getUsablePublicMediaUrl(value: string | null | undefined) {
  const publicPath = normalisePublicMediaPath(value)
  if (!publicPath || !publicPathExists(publicPath)) return null

  return /^https?:\/\//i.test(publicPath) ? publicPath : encodeURI(publicPath)
}

export function labelFromFilename(filename: string) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getImagesFromPublicFolder(folderPath: string | null | undefined) {
  const publicFolder = normalisePublicFolderPath(folderPath)
  if (!publicFolder || /^https?:\/\//i.test(publicFolder)) return []

  const publicRoot = getPublicRoot()
  const resolvedFolder = path.resolve(publicRoot, safeDecodeUri(publicFolder).replace(/^\//, ''))
  if (!isInsidePublicRoot(resolvedFolder) || !fs.existsSync(resolvedFolder)) return []

  return fs
    .readdirSync(resolvedFolder, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
    .map((entry) => ({
      name: labelFromFilename(entry.name),
      url: encodeURI(`${publicFolder}/${entry.name}`),
    }))
}

export function firstImageFromPublicFolder(folderPath: string | null | undefined) {
  return getImagesFromPublicFolder(folderPath)[0]?.url ?? null
}
