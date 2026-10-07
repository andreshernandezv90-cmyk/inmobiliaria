import Hero from '@/components/home/Hero'
import QuickAccess from '@/components/home/QuickAccess'
import FeaturedProperties from '@/components/home/FeaturedProperties'
import ZoneExplorer from '@/components/home/ZoneExplorer'
import SellPropertyCTA from '@/components/home/SellPropertyCTA'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'
import InstagramSection from '@/components/home/InstagramSection'
import Seo from '@/components/ui/Seo'
import { HERO } from '@/data/hero'
import { useAsync } from '@/hooks/useAsync'
import { imageAtWidth } from '@/lib/images'
import { getCatalogSummary, getFeaturedProperties, getZones } from '@/services/propertyService'
import { getInstagramPosts } from '@/services/instagramService'

export default function Home() {
  const featured = useAsync(() => getFeaturedProperties(6))
  const zones = useAsync(getZones)
  const summary = useAsync(getCatalogSummary)
  const instagram = useAsync(() => getInstagramPosts(6))

  return (
    <>
      <Seo image={imageAtWidth(HERO.image_url, 1200)} />
      <Hero zones={zones.data ?? []} />
      <QuickAccess summary={summary.data} />
      <FeaturedProperties properties={featured.data ?? []} loading={featured.loading} />
      <ZoneExplorer zones={zones.data ?? []} />
      <SellPropertyCTA />
      <WhatsAppCTA sampleProperty={featured.data?.find((p) => p.code === 'PROP-004') ?? featured.data?.[0]} />
      <InstagramSection posts={instagram.data ?? []} />
    </>
  )
}
