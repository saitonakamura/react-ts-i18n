import { Languages } from './i18n'

export const enResources = {
  title: 'Home page',
  langChangeProposal: 'Please select the language',
  currentDate: (date: Date, lang: Languages) =>
    `Current date is ${date.toLocaleDateString(lang)}`,
}

export type EnResource = typeof enResources
