import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface ButtonProps extends BlockOwnProps {
  id?: string;
  text?: string;
  disabled?: boolean;
}

export default class Button extends Block<ButtonProps> {
  static componentName = 'Button';

  protected template = `
    <button id="{{id}}" class="button" {{#if disabled}}disabled{{/if}}>{{text}}</button>
  `;
}
