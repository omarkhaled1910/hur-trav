'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const Reveal: React.FC<Props> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Guards against environments where IntersectionObserver callbacks never
    // fire (e.g. a backgrounded/hidden tab) so content is never stuck invisible.
    const fallback = window.setTimeout(() => setVisible(true), 1200)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          window.clearTimeout(fallback)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(node)
    return () => {
      window.clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-all duration-700 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
