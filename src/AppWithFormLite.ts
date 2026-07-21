import FormLite from './FormLite';

export default class AppWithFromLiteLite {
  render(): void {
    const form = new FormLite({ buttonName: "Клик!" });
    const FormElement = form.element();

    document.body.appendChild(FormElement);
    // form.setProps({ buttonName: "Клик!" });
  }
}