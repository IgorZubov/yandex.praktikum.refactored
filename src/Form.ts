import Block from './framework/Block';

export default class Form extends Block {
  protected template = `
    <form>
      {{{ InputLite type="text" placeholder="Логин" ref="login" }}}
      {{{ InputLite type="password" placeholder="Пароль" ref="password" }}}
      {{{ ButtonLite buttonLabel="Авторизация"}}}
    </form>
  `;

  protected events = {
    submit: (event) => {
      event.preventDefault();
      console.log(this.refs.login.value);
      console.log(this.refs.password.value);
    },
  };

  componentDidMount() {
    // Не будет работать, потому что НУЖНО вызвать setProps ИМЕННО на кнопке:
    // setTimeout(() => this.setProps({ buttonName: "Клик через 3 секунды!" }), 3000);
    setTimeout(() => this.children[2].setProps({ buttonLabel: "Клик через 3 секунды!" }), 3000);
  }
}