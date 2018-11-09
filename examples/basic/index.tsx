import React from 'react'
import { render } from 'react-dom'
import { MyLangProvider, MyLangConsumer, resources } from './i18n'

const Header: React.SFC<{}> = () => (
  <MyLangConsumer>{({ l }) => <h1>{l('title')}</h1>}</MyLangConsumer>
)

const LangChanger: React.SFC<{}> = () => (
  <MyLangConsumer>
    {({ l, lang, onLangChange }) => (
      <>
        {l(r => r.langChangeProposal)}{' '}
        <select
          value={lang}
          onChange={e => onLangChange(e.target.value as any)}>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </select>
      </>
    )}
  </MyLangConsumer>
)

const CurrentDate: React.SFC<{}> = () => (
  <MyLangConsumer>
    {({ l, lang }) => l(r => r.currentDate(new Date(), lang))}
  </MyLangConsumer>
)

const App: React.SFC<{}> = () => (
  <>
    <Header />
    <p>
      <LangChanger />
    </p>
    <p>
      <CurrentDate />
    </p>
  </>
)

const Root: React.SFC<{}> = () => (
  <MyLangProvider initialLang="en" initialResources={resources}>
    <App />
  </MyLangProvider>
)

render(<Root />, document.querySelector('#root'))
