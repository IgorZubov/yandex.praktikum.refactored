import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface LinkProps extends BlockOwnProps {
  href?: string;
  'class'?: string;
  'data-page'?: string;
  text?: string;
}

export default class Link extends Block<LinkProps> {
  static componentName = 'Link';

  protected template = `<a href="{{href}}" class="{{class}}" data-page="{{data-page}}">{{text}}</a>`;
}
