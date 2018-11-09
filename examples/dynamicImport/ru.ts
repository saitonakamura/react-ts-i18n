import { Resource, Languages } from './i18n'

export const ruResources: Resource = {
  title: 'Домашняя страница',
  langChangeProposal: 'Пожалуйста выберите язык',
  currentDate: (date: Date, lang: Languages) =>
    `Текущая дата ${date.toLocaleDateString(lang)}`,
}
