import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let publicClient: SupabaseClient | null = null
let adminClient: SupabaseClient | null = null

function requireEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

function getPublicClient() {
  publicClient ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  )

  return publicClient
}

function getAdminClient() {
  adminClient ??= createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  )

  return adminClient
}

export const PLAYBOOKS_BUCKET = 'playbooks'
export const IMAGES_BUCKET = 'images'

// Plain function exports — never evaluated at module load time by Turbopack.
export function getPublicStorage() {
  return getPublicClient().storage
}

export function getAdminStorage() {
  return getAdminClient().storage
}

export async function getSignedDownloadUrl(filePath: string): Promise<string | null> {
  const { data, error } = await getAdminStorage()
    .from(PLAYBOOKS_BUCKET)
    .createSignedUrl(filePath, 60 * 60)

  if (error || !data) return null
  return data.signedUrl
}
