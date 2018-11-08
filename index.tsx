import * as React from "react";

interface ResourseProviderFunc<TResource> {
  (strings: TResource): React.ReactNode
}

interface LocalizeFunc<TResource> {
  (key: keyof TResource | ResourseProviderFunc<TResource>): React.ReactNode;
}

const LangContext = React.createContext({ 
  l: (_: any) => '' as React.ReactNode,
  lang: 'en' as any,
  onLangChange: (_: any) => {}
});

export interface LangProviderProps<TLangs extends keyof any, TResource extends object> {
  lang: TLangs;
  resources: Record<TLangs, TResource>
};

interface LangProviderState<TLangs extends keyof any, TResource extends object> {
  lang: TLangs;
  onLangChange: (newLang: TLangs) => void;
  l: LocalizeFunc<TResource>
};

export class LangProvider<TLangs extends keyof any, TResource extends object>
  extends React.Component<LangProviderProps<TLangs, TResource>, LangProviderState<TLangs, TResource>> {

  constructor(props: LangProviderProps<TLangs, TResource>) {
    super(props);
    this.state = {
      lang: props.lang,
      onLangChange: this.handleLangChange,
      l: this.localize
    };
  }

  isKeyof(key: keyof TResource | ResourseProviderFunc<TResource>): key is keyof TResource {
    return typeof key === 'string'
  }

  handleLangChange = (newLang: TLangs) =>
    this.setState({ lang: newLang });

  localize: LocalizeFunc<TResource> = key => {
    const resource = this.props.resources[this.state.lang]
    if (this.isKeyof(key))
      return resource[key];
    else
      return key(resource);
  }

  render() {
    return (
      <LangContext.Provider value={this.state}>
        {this.props.children}
      </LangContext.Provider>
    );
  }
}

export class LangConsumer<TLangs extends keyof any, TResource extends object>
  extends React.Component<React.ConsumerProps<LangProviderState<TLangs, TResource>>, {}> {

  render() {
    return (
      <LangContext.Consumer {...this.props} />
    )
  }
}
