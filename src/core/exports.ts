import { toCapitalize } from 'src/utils';

export interface IApplication {
	App: Function;
	Timer: Function;
	Notification: Function;
}

/** @description
 * все компоненты экспортируются из одного пути - @components
 * следом формируется объект с названием соотв. компонента с большой буквы
 * по ключевому тексту в коде реакт элемента (default.createElement) определяется компонент
 * @attention - возможные ошибки могут быть связаны с изменением текста в коде
 * например вместо default.createElement -> React.createElement
 * но это возможно будет только после обновлений библиотеки React
 */
export default Object.entries<IApplication>({
	...require('@components'),
}).reduce((obj, [name, component]) => {
	return !component.toString().includes('default.createElement') ? obj : { ...obj, [toCapitalize(name)]: component };
}, {}) as IApplication;

/** Перечисление всех существующих экспортированных реакт элементов
 * которые должны инициализироваться вместе с пропсом model
 * этот объект экспортируется и дальше обрабатывается в ./index.ts функцией model @see ./model
 */
// prettier-ignore
// export default {
// 	App         : require('@components').app,
// 	Timer       : require('@components').timer,
// 	Notification: require('@components').notification,
// } as IApplication;
