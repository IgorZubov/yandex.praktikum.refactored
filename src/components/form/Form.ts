import Block from '../../framework/Block'

export default class Form extends Block {
  protected template = `
    <form>
      <input type="text" placeholder="Логин" ref="login">
      <input type="password" placeholder="Пароль" ref="password">
      <button>Submit</button>
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
