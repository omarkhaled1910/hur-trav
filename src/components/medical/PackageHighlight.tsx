import React from 'react'

import { Reveal } from './Reveal'

type Props = {
  eyebrow: string
  title: string
  description: string
  items: { title: string; description: string }[]
}

export const PackageHighlight: React.FC<Props> = ({ eyebrow, title, description, items }) => {
  return (
    <section className="relative py-20 md:py-28">
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-x-0 top-0 h-40 text-teal-700/[0.08] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-[var(--coral)] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <div
            aria-hidden
            className="absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 120} className="relative">
              <div className="flex flex-col items-start gap-4 md:items-center md:text-center">
                <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full border border-teal-700/20 bg-background text-lg font-bold text-teal-700 shadow-[0_10px_30px_-12px_rgba(13,148,136,0.45)] dark:text-teal-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-semibold text-foreground md:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
