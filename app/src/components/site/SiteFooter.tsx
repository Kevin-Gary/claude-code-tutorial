import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Closing CTA banner + footer. */
const COLS = [
  { h: "Product", links: ["How it works", "Plant library", "Diagnose", "Pricing"] },
  { h: "Company", links: ["About", "Careers", "Blog", "Press"] },
  { h: "Support", links: ["Help center", "Contact", "Privacy", "Terms"] },
];

export function SiteFooter() {
  return (
    <footer>
      {/* CTA */}
      <div className="mx-auto max-w-[var(--content-max)] px-6 pb-24 md:px-10">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--sprout-500)] px-10 py-16 text-center">
          <h2 className="mb-3.5 mt-0 font-[family-name:var(--font-display)] text-[34px] font-extrabold tracking-[-0.025em] text-[var(--forest-900)] md:text-[46px]">
            Your plants will thank you.
          </h2>
          <p className="mb-[30px] mt-0 text-[18px] text-[var(--forest-800)] opacity-85">
            Free to download. Your first care plan is one photo away.
          </p>
          <div className="flex justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Icon name="smartphone" size={20} />}
            >
              Download for iPhone
            </Button>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="border-t border-[var(--border-default)] bg-[var(--bg-page)]">
        <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-2 gap-8 px-6 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)] md:px-10">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3.5 flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/verdant-mark.svg" width={34} height={34} alt="" />
              <span className="font-[family-name:var(--font-display)] text-[20px] font-extrabold tracking-[-0.02em] text-[var(--forest-800)]">
                Verdant
              </span>
            </div>
            <p className="m-0 max-w-[260px] text-[14px] leading-[1.55] text-[var(--text-muted)]">
              A trusted plant friend in your pocket. Identify, care for, and
              revive every plant you own.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.h}>
              <div className="mb-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-[var(--text-strong)]">
                {c.h}
              </div>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[14px] text-[var(--text-muted)] no-underline hover:text-[var(--forest-600)]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-[var(--content-max)] px-6 pb-10 text-[13px] text-[var(--text-faint)] md:px-10">
          © 2026 Verdant. Grown with care.
        </div>
      </div>
    </footer>
  );
}
