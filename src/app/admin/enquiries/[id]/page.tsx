import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EnquiryStatusForm } from '@/components/admin/EnquiryStatusForm'

interface PageProps { params: Promise<{ id: string }> }

export default async function AdminEnquiryDetailPage({ params }: PageProps) {
  const { id } = await params
  let enquiry
  try { enquiry = await prisma.customProgrammeEnquiry.findUnique({ where: { id } }) }
  catch { notFound() }
  if (!enquiry) notFound()

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Enquiries
      </Link>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{enquiry.name}</h1>
          <p className="text-gray-500 text-sm">{enquiry.email} · {formatDate(enquiry.createdAt)}</p>
        </div>
        <Badge variant="yellow">{enquiry.status}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-bold text-navy-900 mb-3">Player Profile</h3>
          <dl className="space-y-2 text-sm">
            {[['Level', enquiry.playingLevel], ['Years playing', enquiry.yearsPlaying || '—'], ['How often', enquiry.howOften || '—'], ['Age', enquiry.age || '—']].map(([l, v]) => (
              <div key={l} className="flex gap-3"><dt className="text-gray-500 w-28 flex-shrink-0">{l}</dt><dd className="text-navy-900 font-medium capitalize">{v}</dd></div>
            ))}
          </dl>
        </Card>
        <Card>
          <h3 className="font-bold text-navy-900 mb-3">Training Availability</h3>
          <dl className="space-y-2 text-sm">
            {[['Days/week', enquiry.trainingDaysPerWeek || '—'], ['Session', enquiry.sessionLength || '—'], ['Plays matches', enquiry.playsMatches ? 'Yes' : 'No'], ['Has coaching', enquiry.hasCoaching ? 'Yes' : 'No']].map(([l, v]) => (
              <div key={l} className="flex gap-3"><dt className="text-gray-500 w-28 flex-shrink-0">{l}</dt><dd className="text-navy-900 font-medium">{v as string}</dd></div>
            ))}
          </dl>
        </Card>
      </div>
      <Card className="mb-6">
        <h3 className="font-bold text-navy-900 mb-3">Goals &amp; Focus</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-500">Main goal: </span><span className="text-navy-900">{enquiry.goal}</span></p>
          <p><span className="text-gray-500">Weakness: </span><span className="text-navy-900">{enquiry.weakness || '—'}</span></p>
          <p><span className="text-gray-500">Duration: </span><span className="text-navy-900">{enquiry.programmeDuration || '—'}</span></p>
          <p><span className="text-gray-500">Injuries: </span><span className="text-navy-900">{enquiry.injuriesOrLimitations || 'None stated'}</span></p>
        </div>
        {enquiry.areasToImprove.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {enquiry.areasToImprove.map((a) => <Badge key={a} variant="lime">{a}</Badge>)}
          </div>
        )}
      </Card>
      <EnquiryStatusForm enquiryId={enquiry.id} currentStatus={enquiry.status} currentAdminNotes={enquiry.adminNotes ?? ''} />
    </div>
  )
}
