import { InstagramIcon } from '@/components/icons/BrandIcons'
import Button from '@/components/ui/Button'
import ResponsiveImage from '@/components/ui/ResponsiveImage'
import Reveal from '@/components/ui/Reveal'
import { SOCIAL } from '@/config/site'

/**
 * Sección de Instagram. Si no hay publicaciones (o falla la carga),
 * se oculta la rejilla pero se mantiene el enlace al perfil.
 */
export default function InstagramSection({ posts = [] }) {
  return (
    <section aria-labelledby="instagram-title" className="py-20 md:py-28">
      <div className="container-page">
        <Reveal className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{SOCIAL.instagram.handle}</p>
            <h2 id="instagram-title" className="heading-display mt-4 text-[2.1rem] leading-[1.08] sm:text-5xl">
              Síguenos en Instagram
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Recorridos, nuevas propiedades y detalles que no caben en una ficha.
            </p>
          </div>
          <Button href={SOCIAL.instagram.url} variant="secondary" className="self-start md:self-auto">
            <InstagramIcon className="size-[1.05rem]" />
            Seguir en Instagram
          </Button>
        </Reveal>

        {posts.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.id} delay={index * 0.05}>
                <a
                  href={post.permalink ?? SOCIAL.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block overflow-hidden rounded-xl"
                >
                  <ResponsiveImage
                    src={post.image_url}
                    alt={post.caption}
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                    widths={[320, 480, 640]}
                    fallbackWidth={480}
                    className="aspect-square"
                    imgClassName="transition-transform duration-[1.2s] ease-(--ease-premium) group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-3 opacity-0 transition-all duration-500 group-hover:bg-ink/55 group-hover:opacity-100 group-focus-visible:bg-ink/55 group-focus-visible:opacity-100">
                    <InstagramIcon className="mb-2 size-5 text-white" />
                    <span className="line-clamp-2 text-xs leading-snug text-white">{post.caption}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
