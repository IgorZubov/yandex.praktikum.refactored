import Block from '../../framework/Block'

export default class Form extends Block {
  protected template = `
    <form>
      <input type="text" placeholder="Логин" ref="login">
      <input type="password" placeholder="Пароль" ref="password">
      <button>Submit</button>
    </form>
  `;
}
