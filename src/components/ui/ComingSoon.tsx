import Link from 'next/link'

interface Props {
  title: string
  message?: string
}

export function ComingSoon({ title, message }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 bg-lime-100 text-lime-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          Coming soon
        </div>
        <h1 className="text-3xl font-serif font-bold text-navy-900 mb-4">{title}</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          {message ?? 'This section is still being built. Check back soon.'}
        </p>
        <Link
          href="/stringing"
          className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-navy-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Book a restring
        </Link>
        <div className="mt-4">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
