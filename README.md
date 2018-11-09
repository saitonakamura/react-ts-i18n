# React Typescript I18n

> Tiny (1kb) react i18n provider with focus on type safety

## Motivation

There's a lot of i18n libraries in the wild, but not all of them even have typings, let alone type safety when getting a string by key.
So I build a tiny wrapper over react context api which allows you to pass your resource types as generics use it.

## Install

```sh
npm i react-ts-i18n
```

## Basic Usage

> ⚠ Though basic setup is a good place to start from, I really recommend you to pay attention to [Advanced Usage](#advanced-usage)

You can see complete example here [examples/basic](examples/basic)

### Preparation

Well, I lied a little bit about 1kb because you have to do a little bit of code yourself, but don't worry, it's really a little bit!
So let's create your wrapper over the base one.

`i18n.ts`

```typescript
import { LangProvider, LangConsumer, ResourceRecord } from 'react-ts-i18n'

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
export const resources: ResourceRecord<Languages, Resource> = {
  en: enResources,
  ru: ruResources,
}
```

### App Usage

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
      {/* In fact you're the king over your resource object, so you can do whatever you want */}
      <h1>{l(r => r.someInterpolationFunction(10))}</h1>
    )}
  </MyLangConsumer>
)
```

## Advanced usage

Basic examples are nice, but of course we want real world cases, when resources can be splitted by the different files and can be loaded dynamically (you don't want to load ALL available languages from the start, are you?).
The advanced configuration is that instead of static imports we use can pass a function that returnes a Promise that has our resource.
ES2017 `dynamic import` feature is an obvious way to go (webpack/parcel/you name it will split the chunks for you).
You can see complete example here [examples/dynamicImport](examples/dynamicImport)

### Preparation

`en.ts`

```typescript
// Reference resource
export const enResources = {
  title: 'Home page',
}

// Exporting type be statically imported and used
export type EnResource = typeof enResources
```

`i18n.ts`

```typescript
import { LangProvider, LangConsumer, ResourceRecord } from 'react-ts-i18n'
// Statically importing only type here (so it's not gonna affect the bundle)
import { EnResource } from './en'

export type Languages = 'en' | 'ru'
export type Resource = EnResource

export const resources: ResourceRecord<Languages, Resource> = {
  // Harnessing the power of dynamic imports
  en: () => import('./en').then(r => r.enResources),
  // In fact it's not neccessary for all keys to be dynamically imported, you can mix then in any way
  ru: () => import('./ru').then(r => r.ruResources),
}

export class MyLangProvider extends LangProvider<Languages, Resource> {}
export class MyLangConsumer extends LangConsumer<Languages, Resource> {}
```

`ru.ts`

```typescript
// Again statically importing only the type (otherwise you're gonna stumble into circular dependency problems)
import { Resource } from './i18n'

export const ruResources: Resource = {
  title: 'Домашняя страница',
}
```

### App Usage

```typescript
import React from 'react'
import { MyLangProvider, MyLangConsumer, resources } from './i18n'

// Since resources would be dynamically loaded we need to show some loader
// You probably want to place it closer to the root,
// since the language will be changed all across the application
const Root: React.SFC<{}> = () => (
  <MyLangProvider initialLang="en" initialResources={resources}>
    <MyLangConsumer>
      {/* render prop has isLoadingLang boolean to indicate if language is in the loading process */}
      {({ isLoadingLang }) =>
        isLoadingLang
          ? <div>Translations are loading...</div>
          : <App />
      }
    </MyLangConsumer>
  </MyLangProvider>
)

// Nothing changes from the l function consumer perspective
// language will be changed when promise will be resolved
const App: React.SFC<{}> = () => (
  <MyLangConsumer>{({ l }) => <h1>{l('title')}</h1>}</MyLangConsumer>
)
```

## Consumer render prop

`l: (keyof Resource | (r: Resource) => React.ReactNode) => React.ReactNode`

the `localize` function, your best friend and ally in this internationalized world

`lang: Languages` 

Current selected language

`onLangChange: (newLang: Languages) => void`

Selected language callback

`isLoadingLang: boolean`

Indication whether selected language is loading at the moment
