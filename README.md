# React Typescript I18n

> Tiny (1kb) react i18n provider with focus on type safety

## Motivation

There's a lot of i18n libraries in the wild, but not all of them even have typings, let alone type safety when getting a string by key.
So I build a tiny wrapper over react context api which allows you to pass your resource types as generics use it.

## Install

```sh
npm i react-ts-i18n
```

## Usage

### Preparation

Well, I lied a little bit about 1kb because you have to do a little bit of code yourself, but don't worry, it's really a little bit!
So let's create your wrapper over the base one.

`i18n.ts`

```typescript
import { LangProvider, LangConsumer, LangProviderProps } from 'react-ts-i18n'

// Here hoes our so-called reference resource
// We'll be using as a shape for all another resources
const enResource = {
  title: 'My home page'
}

// Let's extract type out of enResource aka reference resource
type Resource = typeof enResource

// This is another resource which uses Resource type
const ruResource: Resource = {
  title: 'Моя домашняя страница'
}

// Typed-union of available languages
type Languages = 'en' | 'ru'

// Re-export of library providers but enriched with types!
export class MyLangProvider extends LangProvider<Languages, Resource> {}
export class MyLangConsumer extends LangConsumer<Languages, Resource> {}

// Resources dictionary to be passed to Provider as initialResources
export const resources: LangProviderProps<
  Languages,
  Resource
>['initialResources'] = {
  en: enResources,
  ru: ruResources,
}
```

### Real Usage

```typescript
import React from 'react'
import { MyLangProvider, MyLangConsumer, resources } from './i18n'

// Wrap your root component with your newly created MyLangProvider
// Pass the initialLang (up to you) and initialResources (that resources we exported in i18n.ts wrapper)
const Root: React.SFC<{}> = () => (
  <MyLangProvider initialLang="en" initialResources={resources}>
    <App />
  </MyLangProvider>
)

// Use MyLangConsumer somewhere down the component tree
// and use l (yeah, just 'l', means 'localize') function to get an access to your resources
const App: React.SFC<{}> = () => (
  <MyLangConsumer>
    {({ l }) => (
      {/* You can use keyof-based access */}
      <h1>{l('title')}</h1>
      {/* You can use expressions */}
      <h1>{l(r => r.title)}</h1>
      {/* In fact your the king over your resource object, so you can do whatever you want */}
      <h1>{l(r => r.someInterolationFunction(10))}</h1>
    )}
  </MyLangConsumer>
)
```