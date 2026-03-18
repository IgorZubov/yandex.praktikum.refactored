import Form from './Form';
import { registerComponent } from './framework/ComponentRegistry';
import Block from './framework/Block';

class ButtonLite extends Block {
  static componentName = 'ButtonLite';
  
  protected template = `
    <button>{{buttonLabel}}</button>
  `;
}

class InputLite extends Block {
  static componentName = 'InputLite';
  
  protected template = `
    <input type="{{type}}" placeholder="{{placeholder}}" ref="{{ref}}" id="{{ref}}" />
  `;
}

registerComponent(ButtonLite);
registerComponent(InputLite);

export default class AppWithForm {
  render(): void {
    const form = new Form();
    const FormElement = form.element();

    document.body.appendChild(FormElement);
  }
}