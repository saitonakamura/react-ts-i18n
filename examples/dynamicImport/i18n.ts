import { LangProvider, LangConsumer, ResourceRecord } from '../../index'
import { EnResource } from './en'

export type Languages = 'en' | 'ru'
export type Resource = EnResource

export const resources: ResourceRecord<Languages, Resource> = {
  en: () => import('./en').then(r => r.enResources),
  ru: () => import('./ru').then(r => r.ruResources),
}

export class MyLangProvider extends LangProvider<Languages, Resource> {}

export class MyLangConsumer extends LangConsumer<Languages, Resource> {}
