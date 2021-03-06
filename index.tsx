import * as React from 'react'

interface ResourseProviderFunc<TResource> {
  (strings: TResource): React.ReactNode
}

interface LocalizeFunc<TResource> {
  (key: keyof TResource | ResourseProviderFunc<TResource>): React.ReactNode
}

const LangContext = React.createContext({
  l: (key: any) => key.toString() as React.ReactNode,
  lang: 'en' as any,
  onLangChange: (_: any) => {},
  isLoadingLang: false,
})

interface FetchResourceFunc<TResource> {
  (): Promise<TResource>
}

export type ResourceRecord<
  TLangs extends keyof any,
  TResource extends object
> = Record<TLangs, TResource | FetchResourceFunc<TResource>>

export interface LangProviderProps<
  TLangs extends keyof any,
  TResource extends object
> {
  initialLang: TLangs
  initialResources: ResourceRecord<TLangs, TResource>
}

interface LangProviderState<
  TLangs extends keyof any,
  TResource extends object
> {
  lang: TLangs
  onLangChange: (newLang: TLangs) => void
  l: LocalizeFunc<TResource>
  isLoadingLang: boolean
}

export class LangProvider<
  TLangs extends keyof any,
  TResource extends object
> extends React.Component<
  LangProviderProps<TLangs, TResource>,
  LangProviderState<TLangs, TResource>
> {
  private resources: ResourceRecord<TLangs, TResource>

  constructor(props: LangProviderProps<TLangs, TResource>) {
    super(props)

    this.resources = props.initialResources

    this.state = {
      lang: props.initialLang,
      onLangChange: this.handleLangChange,
      l: this.localize,
      isLoadingLang: false,
    }

    const selectedResouce = this.resources[props.initialLang]
    if (this.isFetchFunc(selectedResouce)) {
      ;(this.state as LangProviderState<TLangs, TResource>).isLoadingLang = true

      this.enrichResources(selectedResouce, props.initialLang).then(() =>
        this.setState({ isLoadingLang: false }),
      )
    }
  }

  private isKeyof(
    key: keyof TResource | ResourseProviderFunc<TResource>,
  ): key is keyof TResource {
    return typeof key === 'string'
  }

  private isObject(
    resource: TResource | FetchResourceFunc<TResource>,
  ): resource is TResource {
    return typeof resource === 'object'
  }

  private isFetchFunc(
    resource: TResource | FetchResourceFunc<TResource>,
  ): resource is FetchResourceFunc<TResource> {
    return resource instanceof Function
  }

  private handleLangChange = (newLang: TLangs) => {
    const resource = this.resources[newLang]

    if (this.isFetchFunc(resource)) {
      this.setState({ isLoadingLang: true })

      this.enrichResources(resource, newLang).then(() =>
        this.setState({ lang: newLang, isLoadingLang: false }),
      )
    } else {
      this.setState({ lang: newLang })
    }
  }

  private enrichResources = (
    resource: FetchResourceFunc<TResource>,
    lang: TLangs,
  ) =>
    resource().then(res => {
      this.resources = { ...(this.resources as any), [lang]: res }
    })

  private localize: LocalizeFunc<TResource> = key => {
    const { lang } = this.state
    const resource = this.resources[lang]

    if (this.isObject(resource)) {
      if (this.isKeyof(key)) return resource[key]
      else return key(resource)
    }

    if (this.isFetchFunc(resource))
      throw Error('resource should be loaded at this moment')

    throw Error('resource is neither object nor promise create function')
  }

  render() {
    return (
      <LangContext.Provider value={this.state}>
        {this.props.children}
      </LangContext.Provider>
    )
  }
}

export class LangConsumer<
  TLangs extends keyof any,
  TResource extends object
> extends React.Component<
  React.ConsumerProps<LangProviderState<TLangs, TResource>>,
  {}
> {
  render() {
    return <LangContext.Consumer {...this.props} />
  }
}
