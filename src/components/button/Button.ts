import Block from '../../framework/Block'

export default class Button extends Block {
  static componentName = 'Button';
  
  protected template = `
    <button>{{label}}</button>
  `;
}
