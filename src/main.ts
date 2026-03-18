import './style.css';
import Handlebars from 'handlebars';
import { registerComponent } from './framework/ComponentRegistry';
import Button from './components/button/Button';
import Input from './components/input/Input';
import Select from './components/select/Select';
import ErrorMessage from './components/errorMessage/ErrorMessage';
import Link from './components/link/Link';
import Label from './components/label/Label';
import Footer from './components/footer/Footer';
import App from './App';
import AppWithForm from './AppWithForm';
import AppWithFormLite from './AppWithFormLite';

Handlebars.registerHelper('concat', function (...args: unknown[]) {
  return args.slice(0, -1).join('');
});

registerComponent(Button);
registerComponent(Input);
registerComponent(Select);
registerComponent(ErrorMessage);
registerComponent(Link);
registerComponent(Label);
registerComponent(Footer);

const app = new App();
// const app = new AppWithFormLite(); //The simpliest form, without children
// const app = new AppWithForm(); //Form with children
app.render();
