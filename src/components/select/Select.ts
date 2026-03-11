import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface SelectProps extends BlockOwnProps {
  id?: string;
  options?: string[];
}

export default class Select extends Block<SelectProps> {
  static componentName = 'Select';

  protected template = `
    <select id="{{id}}" class="select">
      {{#each options}}
        <option value="{{this}}">{{this}}</option>
      {{/each}}
    </select>
  `;
}
