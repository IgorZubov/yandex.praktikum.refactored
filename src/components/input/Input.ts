import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface InputProps extends BlockOwnProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
}

export default class Input extends Block<InputProps> {
  static componentName = 'Input';

  protected template = `
    <input id="{{id}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input">
  `;
}
