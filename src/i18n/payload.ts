export const payloadLocales = [
  {
    label: 'English',
    code: 'en',
  },
  {
    label: 'العربية',
    code: 'ar',
    rtl: true,
  },
] as const

export const payloadLocalization = {
  locales: [...payloadLocales],
  defaultLocale: 'en' as const,
  fallback: true,
}
