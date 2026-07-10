import { NAVIGATION_MENU, type PageType } from '../config/navigation'

interface NavbarProps {
  onPageChange: (page: PageType) => void
}

export const Navbar = ({ onPageChange }: NavbarProps) => {
  return (
    <header className="fixed inset-x-0 top-4 z-30 px-4 sm:px-6 lg:px-8 pointer-events-auto">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.5rem] border border-[#d94a4a]/25 bg-[#b51e1e] px-4 py-3.5 shadow-[0_18px_60px_rgba(12,12,12,0.24)] sm:px-5 sm:py-4 lg:px-6 lg:py-4.5">
        <a href="#" onClick={() => onPageChange('home')} className="flex items-center rounded-full px-1.5 py-1.5 text-white transition hover:bg-white/10">
          <img
            src="https://api.duzmetal.com/medyalar/genel/ac6c6626-c109-4279-9088-b236e34d946b.png"
            alt="Düz Metal"
            className="h-10 w-auto object-contain brightness-0 invert sm:h-12"
          />
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] text-white md:flex">
          {NAVIGATION_MENU.map((item) => (
            <div key={item.label}>
              {item.type === 'link' ? (
                <a href={item.href} className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white">
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => onPageChange(item.page)}
                  className="rounded-full px-4.5 py-2.5 transition duration-300 hover:bg-white/14 hover:text-white"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>
        <a href="https://b2b.duzmetal.com" target="_blank" rel="noreferrer" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#b51e1e] shadow-[0_10px_30px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-stone-100 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]">
          B2B Giriş
        </a>
      </div>
    </header>
  )
}
