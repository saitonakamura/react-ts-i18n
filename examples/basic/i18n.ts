import { LangProvider, LangConsumer, ResourceRecord } from '../../index'

const enResources = {
  title: 'Home page',
  langChangeProposal: 'Please select the language',
  currentDate: (date: Date, lang: Languages) =>
    `Current date is ${date.toLocaleDateString(lang)}`,
}

const ruResources: Resource = {
  title: 'Домашняя страница',
  langChangeProposal: 'Пожалуйста выберите язык',
  currentDate: (date: Date, lang: Languages) =>
    `Текущая дата ${date.toLocaleDateString(lang)}`,
}

type Languages = 'en' | 'ru'
type Resource = typeof enResources

export const resources: ResourceRecord<Languages, Resource> = {
  en: enResources,
  ru: ruResources,
}

export class MyLangProvider extends LangProvider<Languages, Resource> {}

export class MyLangConsumer extends LangConsumer<Languages, Resource> {}
