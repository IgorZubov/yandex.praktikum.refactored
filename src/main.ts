import Form from './components/form/Form';
import Button from './components/button/Button';
import Input from './components/input/Input';
import {registerComponent} from './framework/ComponentRegistry';

registerComponent(Button);
registerComponent(Input);

const form = new Form();
const FormElement = form.element();

document.querySelector<HTMLDivElement>('#app')!.appendChild(FormElement);
// document.body.appendChild(FormElement);
