import Block from '../../framework/Block';
import type { BlockOwnProps } from '../../framework/Block';

interface ErrorMessageProps extends BlockOwnProps {
  message?: string;
}

export default class ErrorMessage extends Block<ErrorMessageProps> {
  static componentName = 'ErrorMessage';

  protected template = `<p class="error">{{message}}</p>`;
}
