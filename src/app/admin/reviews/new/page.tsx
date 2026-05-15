import { ReviewForm } from '@/components/admin/ReviewForm'

export default function NewReviewPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-navy-900 mb-8">New Review</h1>
      <ReviewForm />
    </div>
  )
}
