import Handlebars from 'handlebars';
import { HelperOptions } from 'handlebars';


/** Уникальный идентификатор для заглушки */
let uniqueId = 0;

/**
 * Функция для регистрации компонента в Handlebars
 * @param Component - Класс компонента для регистрации
 */
function registerComponent(Component: any) {
  const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;
  
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const component = new Component(hash);
      
      /** если в свойствах компонента есть ссылка - сохраним её в свойства класса */
      if ('ref' in hash) {
        (data.root.__refs = data.root.__refs || {})[hash.ref] = component.element();
      }
      
      /** Примешиваем к свойствам компонента поле __children */
      (data.root.__children = data.root.__children || []).push({
        /** Экземпляр компонента */
        component,
        /** Функция для замены заглушки созданным компонентом */
        embed(node: DocumentFragment) {
          /** Ищем в родительском компоненте заглушки для замены их на реальные компоненты */
          const placeholder = node.querySelector(`[${dataAttribute}]`);
          if (!placeholder) {
            /** Если заглушка не найдена, то вызываем исключение */
            throw new Error(
              `Can't find data-id for component ${Component.componentName}`,
            );
          }
          
          const element = component.element();
          if (!element) {
            throw new Error('Component element is not created');
          }
          
          placeholder.replaceWith(element);
        },
      });
      
      return `<div ${dataAttribute}></div>`;
    },
  );
}

export { registerComponent };
