import { PlaybookForm } from '@/components/admin/PlaybookForm'

export default function NewPlaybookPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-navy-900 mb-8">New Playbook</h1>
      <PlaybookForm />
    </div>
  )
}
