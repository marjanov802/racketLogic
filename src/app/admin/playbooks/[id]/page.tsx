import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PlaybookForm } from '@/components/admin/PlaybookForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPlaybookPage({ params }: PageProps) {
  const { id } = await params
  let playbook
  try {
    playbook = await prisma.playbook.findUnique({ where: { id } })
  } catch {
    notFound()
  }
  if (!playbook) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/playbooks" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Playbooks
      </Link>
      <h1 className="text-2xl font-bold text-navy-900 mb-8">Edit Playbook</h1>
      <PlaybookForm
        playbook={{
          id: playbook.id,
          title: playbook.title,
          slug: playbook.slug,
          description: playbook.description,
          longDescription: playbook.longDescription ?? '',
          price: String(playbook.price),
          previewContent: playbook.previewContent ?? '',
          category: playbook.category,
          published: playbook.published,
          featured: playbook.featured,
          isBundle: playbook.isBundle,
          fileUrl: playbook.fileUrl ?? '',
        }}
      />
    </div>
  )
}
