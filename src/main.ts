import Form from './components/form/Form';

const form = new Form();
const FormElement = form.element();

document.querySelector<HTMLDivElement>('#app')!.appendChild(FormElement);
// document.body.appendChild(FormElement);
