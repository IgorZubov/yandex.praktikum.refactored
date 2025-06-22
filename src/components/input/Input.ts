import Block from '../../framework/Block'

export default class Input extends Block {
  static componentName = 'Input';
  
  protected template = `
    <input type="{{type}}" placeholder="{{placeholder}}" ref="{{ref}}">
  `;
}