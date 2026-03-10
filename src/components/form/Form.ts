import Block from '../../framework/Block'
import type { BlockOwnProps } from '../../framework/Block';

interface FormProps extends BlockOwnProps {
  buttonName?: string;
}

export default class Form extends Block<FormProps> {
  protected template = `
    <form>
      <input type="text" placeholder="Логин" ref="login">
      <input type="password" placeholder="Пароль" ref="password">
      <button>{{buttonName}}</button>
    </form>
  `;

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      console.log(this.refs);
      console.log((this.refs.password as HTMLInputElement).value);
    },
  };

  componentDidMount() {
    console.log('Form component mounted');
    setTimeout(() => this.setProps({ buttonName: "Клик через 3 секунды!" }), 3000);
  }
}
