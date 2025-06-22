import Block from '../../framework/Block'

export default class Form extends Block {
  protected template = `
    <form>
      {{{ Input type="text" placeholder="Логин" ref="login" }}}
      {{{ Input type="password" placeholder="Пароль" ref="password" }}}
      {{{ Button label="Авторизация" }}}
    </form>
  `;

  protected events = {
    submit: (event) => {
      event.preventDefault();
      console.log(this.refs.login.value);
      console.log(this.refs.password.value);
    },
  };
}
