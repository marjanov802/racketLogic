import type { Metadata } from 'next'
import { Mail, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with RacketLogic. Book stringing, ask about playbooks, enquire about custom programmes or ask a general question.',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient text-white py-20">
        <div className="container-lg">
          <Badge variant="lime" className="mb-5 text-xs font-semibold uppercase tracking-widest">
            Get in touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 max-w-xl">Contact RacketLogic</h1>
          <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
            Book stringing, ask about playbooks, enquire about custom programmes or ask a general
            question.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4 text-lime-400" />
              <a href="mailto:hello@racket-logic.com" className="hover:text-lime-400 transition-colors">
                hello@racket-logic.com
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-lime-400" />
              <span>England, UK</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-gray-50">
        <div className="container-lg">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-navy-900 mb-3">Send us a message</h2>
              <p className="text-gray-600">We will respond within 24–48 hours.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
