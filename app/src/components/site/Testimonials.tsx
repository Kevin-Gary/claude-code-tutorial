import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";

/** Social-proof band of short, warm testimonials. */
const QUOTES = [
  {
    name: "Priya M.",
    role: "Reformed plant killer",
    text: "I’ve kept a fiddle leaf fig alive for eight months. Eight! Verdant just tells me when to water and I listen.",
  },
  {
    name: "Daniel K.",
    role: "40-plant collection",
    text: "The diagnosis feature caught spider mites before I’d even noticed. Saved my whole calathea shelf.",
  },
  {
    name: "Sofia R.",
    role: "New plant parent",
    text: "It feels like texting a friend who happens to know everything about plants. Never makes me feel silly.",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[var(--content-max)] px-6 pb-24 md:px-10">
      <div className="mb-12 text-center">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-[30px] font-extrabold tracking-[-0.02em] text-[var(--forest-900)] md:text-[38px]">
          Greener thumbs, happier homes
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {QUOTES.map((q) => (
          <figure
            key={q.name}
            className="m-0 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-7 shadow-[var(--shadow-sm)]"
          >
            <div className="mb-3.5 flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((s) => (
                <Icon key={s} name="star" size={16} color="var(--sun-500)" />
              ))}
            </div>
            <blockquote className="mb-5 mt-0 text-[16.5px] leading-[1.55] text-[var(--text-body)]">
              “{q.text}”
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar name={q.name} size="sm" />
              <div>
                <div className="text-[14px] font-bold text-[var(--text-strong)]">
                  {q.name}
                </div>
                <div className="text-[13px] text-[var(--text-muted)]">
                  {q.role}
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
