import PropertyCard from '@/components/property/PropertyCard'
import PropertyCardSkeleton from '@/components/property/PropertyCardSkeleton'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { ROUTES } from '@/config/routes'

/** Rejilla de propiedades destacadas (entre 3 y 6). */
export default function FeaturedProperties({ properties, loading }) {
  return (
    <section aria-labelledby="featured-title" className="py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          id="featured-title"
          eyebrow="Selección"
          title="Propiedades destacadas"
          description="Una curaduría de las propiedades con mejor ubicación, diseño y oportunidad de inversión de este mes."
          action={{ label: 'Ver todas las propiedades', to: ROUTES.properties }}
        />

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {loading
            ? Array.from({ length: 6 }, (_, i) => <PropertyCardSkeleton key={i} />)
            : properties.map((property, index) => (
                <Reveal key={property.id} delay={(index % 3) * 0.08}>
                  <PropertyCard property={property} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  )
}
