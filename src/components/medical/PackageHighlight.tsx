import React from 'react'

import { siteConfig } from '@/config/site'

type Props = {
  title: string
  items: { title: string; description: string }[]
}

export const PackageHighlight: React.FC<Props> = ({ title, items }) => {
  return (
    <section className="border-y border-border bg-card/50 py-14 md:py-16">
      <div className="container">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">
            {siteConfig.packageDays} days in Hurghada — premium recovery, Red Sea views, and certified
            clinical care.
          </p>
        </div>
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-background p-6 shadow-sm"
            >
              <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
