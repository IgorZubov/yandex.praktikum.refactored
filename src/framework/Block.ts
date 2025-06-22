import Handlebars from 'handlebars';
export default abstract class Block<Props extends object> {
  protected abstract template: string;

  protected props = {} as Props;

  private domElement: Element | null = null;

  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement("template");

    templateElement.innerHTML = html;

    return templateElement.content.firstElementChild;
  }

  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }

    return this.domElement;
  }

  public setProps(props: Partial<Props>) {
    this.props = { ...this.props, ...props };
    this.render();
  }

  protected componentDidMount() {}

  private mountComponent() {
    this.componentDidMount();
  }

  protected componentWillUnmount() {}

  private unmountComponent() {
    if (this.domElement) {
      this.componentWillUnmount();
    }
  }

  protected render() {
    this.unmountComponent();
    const fragment = this.compile();

    if (this.domElement && fragment) {
      this.domElement.replaceWith(fragment);
    }

    this.domElement = fragment;
    this.mountComponent();
  }
}