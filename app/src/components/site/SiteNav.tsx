import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Marketing site top navigation. */
const LINKS = ["How it works", "Features", "Plant library", "Pricing"];

export function SiteNav() {
  return (
    <nav className="mx-auto flex max-w-[var(--content-max)] items-center justify-between px-6 py-[22px] md:px-10">
      <a href="#" className="flex items-center gap-2.5 no-underline">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/verdant-mark.svg" width={36} height={36} alt="" />
        <span className="font-[family-name:var(--font-display)] text-[22px] font-extrabold tracking-[-0.02em] text-[var(--forest-800)]">
          Verdant
        </span>
      </a>
      <div className="hidden items-center gap-[30px] md:flex">
        {LINKS.map((l) => (
          <a
            key={l}
            href="#"
            className="text-[15px] font-semibold text-[var(--text-body)] no-underline hover:text-[var(--forest-600)]"
          >
            {l}
          </a>
        ))}
      </div>
      <Button variant="primary" leftIcon={<Icon name="smartphone" size={18} />}>
        Get the app
      </Button>
    </nav>
  );
}
