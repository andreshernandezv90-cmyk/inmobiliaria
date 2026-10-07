import { useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { ChevronDown, Search } from 'lucide-react'
import { OPERATIONS, PRICE_RANGES, PROPERTY_TYPES } from '@/constants/property'
import { propertiesUrl } from '@/config/routes'

/**
 * Buscador principal: Comprar/Rentar + zona + tipo + precio.
 * Al enviar navega al catálogo con los filtros como query params
 * (/propiedades?operation=venta&city=zapopan&property_type=casa…).
 *
 * @param {{ zones: { slug: string, name: string }[], className?: string }} props
 */
export default function SearchBar({ zones = [], className = '' }) {
  const navigate = useNavigate()
  const baseId = useId()
  const [operation, setOperation] = useState('venta')
  const [city, setCity] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')

  const ranges = PRICE_RANGES[operation]

  const changeOperation = (value) => {
    setOperation(value)
    setPriceRange('') // los rangos de venta y renta son distintos
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const range = ranges[Number(priceRange)]
    navigate(
      propertiesUrl({
        operation,
        city,
        property_type: propertyType,
        min_price: range?.min,
        max_price: range?.max,
      }),
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar propiedades"
      className={`rounded-3xl bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(22,21,19,0.45)] ${className}`}
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
        {/* Comprar / Rentar */}
        <fieldset className="flex shrink-0 rounded-[1.1rem] bg-sand-100 p-1 lg:w-52">
          <legend className="sr-only">Tipo de operación</legend>
          {Object.entries(OPERATIONS).map(([value, { action }]) => {
            const checked = operation === value
            return (
              <label
                key={value}
                className={`relative flex flex-1 cursor-pointer items-center justify-center rounded-[0.85rem] py-3 text-sm font-semibold transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-600 ${
                  checked ? 'bg-ink text-ivory' : 'text-ink-soft hover:text-ink'
                }`}
              >
                <input
                  type="radio"
                  name={`${baseId}-operation`}
                  value={value}
                  checked={checked}
                  onChange={() => changeOperation(value)}
                  className="sr-only"
                />
                {action}
              </label>
            )
          })}
        </fieldset>

        <div className="grid flex-1 grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <SelectField id={`${baseId}-city`} label="Zona" value={city} onChange={setCity}>
            <option value="">Todas las zonas</option>
            {zones.map((zone) => (
              <option key={zone.slug} value={zone.slug}>
                {zone.name}
              </option>
            ))}
          </SelectField>

          <SelectField id={`${baseId}-type`} label="Tipo de propiedad" value={propertyType} onChange={setPropertyType}>
            <option value="">Todos los tipos</option>
            {Object.entries(PROPERTY_TYPES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>

          <SelectField id={`${baseId}-price`} label="Precio" value={priceRange} onChange={setPriceRange}>
            <option value="">Cualquier precio</option>
            {ranges.map((range, index) => (
              <option key={range.label} value={index}>
                {range.label}
              </option>
            ))}
          </SelectField>
        </div>

        <button
          type="submit"
          className="inline-flex h-14 items-center justify-center gap-2 rounded-[1.1rem] bg-ink px-8 text-sm font-semibold text-ivory transition-colors duration-300 hover:bg-ink-soft lg:h-auto"
        >
          <Search className="size-[1.1rem]" strokeWidth={2} aria-hidden="true" />
          Buscar
        </button>
      </div>
    </form>
  )
}

/** Select nativo (accesible y cómodo en móvil) con etiqueta superior. */
function SelectField({ id, label, value, onChange, children }) {
  return (
    <div className="relative rounded-xl px-4 py-2.5 transition-colors hover:bg-sand-100/60 has-[select:focus-visible]:ring-2 has-[select:focus-visible]:ring-gold-600 has-[select:focus-visible]:ring-inset lg:px-5">
      <label htmlFor={id} className="block text-[0.68rem] font-semibold tracking-[0.16em] text-muted uppercase">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-0.5 w-full cursor-pointer appearance-none bg-transparent pr-6 text-[0.95rem] font-medium text-ink focus:outline-none"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 bottom-3.5 size-4 text-muted"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </div>
  )
}
