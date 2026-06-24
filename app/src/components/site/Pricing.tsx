/**
 * Pricing section — STUB (intentionally unbuilt).
 *
 * This is a placeholder on purpose. In the Claude Camp Day 2 warm-up you ask
 * Claude Code to design a subscription pricing model for Verdant, write it (plus a
 * short business justification) into the product context, and implement the real
 * pricing UI right here: a couple of tiers (name, price, features, CTA), built with
 * the same design-system tokens + the <Button> component the rest of the site uses
 * (see Testimonials.tsx / ui/Button.tsx for the patterns).
 */
export function Pricing() {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-[var(--content-max)] px-6 pb-24 md:px-10"
    >
      <div className="mb-12 text-center">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[30px] font-extrabold tracking-[-0.02em] text-[var(--forest-900)] md:text-[38px]">
          Simple pricing
        </h2>
        <p className="mx-auto mt-3 max-w-[520px] text-[16.5px] leading-[1.55] text-[var(--text-muted)]">
          One plan to keep every plant alive. (Pricing coming soon.)
        </p>
      </div>

      {/* TODO(pricing): replace this placeholder with the real pricing UI.
          A couple of tiers — name, price, a short feature list, and a CTA —
          built from the design-system tokens and the <Button> component. */}
      <div className="mx-auto flex max-w-[560px] flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] bg-[var(--bg-sunk)] px-8 py-16 text-center">
        <div className="font-[family-name:var(--font-text)] text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Pricing section · to be built
        </div>
        <p className="mt-3 max-w-[380px] text-[15px] leading-[1.5] text-[var(--text-muted)]">
          This section is stubbed out on purpose. Ask Claude Code to design a
          subscription model and implement the tiers here.
        </p>
      </div>
    </section>
  );
}
