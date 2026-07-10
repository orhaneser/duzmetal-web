import { NAVIGATION_MENU, type PageType } from '../config/navigation'

interface FooterProps {
  onPageChange: (page: PageType) => void
}

export const Footer = ({ onPageChange }: FooterProps) => {
  return (
    <footer className="border-t border-stone-300/70 bg-white/70 px-6 py-10 text-sm text-stone-600 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b51e1e]">Düz Metal</p>
          <p className="mt-3 max-w-md leading-7">GÜÇLÜ STOK, TOPTAN SATIŞ, HIZLI TESLİMAT</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {NAVIGATION_MENU.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onPageChange(item.page)}
              className="transition hover:text-[#b51e1e]"
            >
              {item.label}
            </button>
          ))}
          <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#b51e1e]/15 bg-[#b51e1e]/10 px-4 py-2 text-sm font-semibold text-[#a11818] transition hover:bg-[#b51e1e]/15">
            B2B Giriş
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs uppercase tracking-[0.28em] text-stone-500">© 2026 Düz Metal. Tüm hakları saklıdır.</p>
    </footer>
  )
}
