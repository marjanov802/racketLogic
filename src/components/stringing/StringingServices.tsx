'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StringingBookingForm } from './StringingBookingForm'

interface Service {
  id: string
  name: string
  price: string
  priceNote: string
  badge: string | null
  description: string
  includes: string[]
  highlight: boolean
}

interface Props {
  services: Service[]
}

export function StringingServices({ services }: Props) {
  const [selectedService, setSelectedService] = useState('')

  function handleSelectService(id: string) {
    setSelectedService(id)
    setTimeout(() => {
      document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <>
      {/* Service cards */}
      <section id="services" className="section-padding">
        <div className="container-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-navy-900 mb-3">Stringing services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Click any service to jump straight to the booking form with that option selected.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={`flex flex-col h-full rounded-2xl border p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${
                  selectedService === service.id
                    ? 'border-lime-500 ring-2 ring-lime-500/30 bg-lime-50/30'
                    : service.highlight
                    ? 'border-lime-400/60 bg-lime-50/20 hover:border-lime-500'
                    : 'border-gray-200 bg-white hover:border-lime-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  {service.badge ? (
                    <Badge variant={service.highlight ? 'lime' : 'navy'}>{service.badge}</Badge>
                  ) : (
                    <div />
                  )}
                  <div className="text-right">
                    <div className="text-xl font-bold text-navy-900">{service.price}</div>
                    <div className="text-xs text-gray-500">{service.priceNote}</div>
                  </div>
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-1">{service.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Includes</p>
                  {service.includes.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${service.highlight ? 'text-lime-600' : 'text-lime-500'}`} />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <div className={`w-full text-center py-2 text-sm font-semibold rounded transition-colors ${
                    selectedService === service.id
                      ? 'bg-lime-500 text-navy-950'
                      : 'text-lime-600 group-hover:text-lime-700'
                  }`}>
                    {selectedService === service.id ? 'Selected — scroll down to book' : 'Click to select & book'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className="section-padding bg-gray-50">
        <div className="container-lg">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-navy-900 mb-3">Book your stringing</h2>
              <p className="text-gray-500">
                Fill in the form below and we will confirm your booking within 24 hours.
              </p>
            </div>
            <StringingBookingForm
              services={services}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
          </div>
        </div>
      </section>
    </>
  )
}
