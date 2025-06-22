import Handlebars from 'handlebars';

// Интерфейс для скрытых свойств компонента
interface BlockOwnProps {
  __children?: Array<{
    component: Block<object>;
    embed(node: DocumentFragment): void;
  }>;
  __refs?: Record<string, Element>;
}

// Тип для обработчиков событий
type EventListType = Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;

export default abstract class Block<Props extends BlockOwnProps = BlockOwnProps> {
  /** Шаблонная строка из которой будет формироваться элемент */
  protected abstract template: string;
  
  /** Свойства компонента */
  protected props = {} as Props;
  
  /** Реальный элемент, созданный на базе шаблона */
  private domElement: Element | null = null;
  
  /** Дочерние компоненты */
  protected children: Block<object>[] = [];
  
  /** Ссылки на элементы */
  protected refs: Record<string, Element> = {};
  
  /** В этом объекте ключ – это название события, а значение – функция обработчик */
  protected events: EventListType = {};

  /** На случай, если у компонента нет свойств задаём пустой объект */
  constructor(props: Props = {} as Props) {
    this.props = props;
  }

  /** Метод для получения элемента */
  public element(): Element | null {
    if (!this.domElement) {
      this.render();
    }
    return this.domElement;
  }

  /** Обновить свойства. Передаваемые значения "мержатся" с уже существующими */
  public setProps(props: Partial<Props>) {
    /** Сбрасываем __children и __refs на начальное значение */
    this.props = { ...this.props, ...props, __children: [], __refs: {} } as Props;
    this.render();
  }

  /** Метод для переопределения в классе наследнике */
  protected componentDidMount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Метод подключает обработчики и вызывает componentDidMount */
  private mountComponent() {
    this.attachListeners();
    this.componentDidMount();
  }

  /** Метод для переопределения в классе наследнике */
  protected componentWillUnmount() {
    /** В базовом классе здесь ничего нет */
  }

  /** Вызов переопределяемого метода и снятие обработки событий */
  private unmountComponent() {
    if (this.domElement) {
      this.componentWillUnmount();
      this.removeListeners();
      /** вызываем очистку в порядке, обратном созданию */
      this.children.reverse().forEach(child => child.unmountComponent());
    }
  }

  /** Метод добавления обработчиков событий на элемент */
  private attachListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName];
      if (typeof eventCallback == 'function' && this.domElement) {
        this.domElement.addEventListener(eventName, eventCallback);
      }
    }
  }

  /** Метод удаляющий добавленные ранее события */
  private removeListeners() {
    for (const eventName in this.events) {
      const eventCallback = this.events[eventName];
      if (typeof eventCallback === 'function' && this.domElement) {
        this.domElement.removeEventListener(eventName, eventCallback);
      }
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

  private compile(): Element | null {
    const html = Handlebars.compile(this.template)(this.props);
    const templateElement = document.createElement('template');
    templateElement.innerHTML = html;
    const fragment = templateElement.content;

    if (this.props.__children) {
      /** Сохраняем все дочерние компоненты */
      this.children = this.props.__children.map((child) => child.component);

      /** Для каждого элемента массива вызываем метод embed, который заменит заглушку на компонент */
      this.props.__children.forEach((child) => {
        child.embed(fragment);
      });
    }

    /** Если ссылки переданы, то используем их как начальное состояние аккумулятора в reduce */
    const defaultRefs = this.props?.__refs ?? {};
    this.refs = Array.from(fragment.querySelectorAll('[ref]')).reduce(
      (list, element) => {
        const key = element.getAttribute('ref') as string;
        list[key] = element as HTMLElement;
        element.removeAttribute('ref');
        return list;
      },
      defaultRefs,
    );

    return templateElement.content.firstElementChild;
  }

  // Методы для обратной совместимости с существующим кодом
  public getContent(): HTMLElement {
    const element = this.element();
    if (!element) {
      throw new Error('Element is not created');
    }
    return element as HTMLElement;
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'block';
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'none';
    }
  }

  // Метод для рекурсивного размонтирования (для совместимости)
  public dispatchComponentDidMount(): void {
    this.componentDidMount();
    this.children.forEach(child => {
      child.dispatchComponentDidMount();
    });
  }
}
