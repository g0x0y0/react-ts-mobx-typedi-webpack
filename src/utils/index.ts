import Container from 'typedi';

/** Форматирование строки со вставкой переданных переменных */
const format = (str: string, ...args: (string | number)[]): string =>
	str.replace(/{(\d+)}/g, (_, num: number) => (typeof args[num] !== 'undefined' ? args[num]?.toString() : ''));

/** Подтверждение что переданный параметр объект */
const isObject = (obj: any) => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;

/** Привести первый символ строки к заглавному символу */
const toCapitalize = <S extends string>(str: S) => str[0].toUpperCase() + str.slice(1);

/** Назначить методы для декорированного класса которые определены в переданном массиве с названиями классов
 * В декоратор передается название класса, через Container.get создается экземпляр класса,
 * внутри декоратора парсятся доступные методы созданного экземпляра
 * с помощью defineProperty, записывается сам метод, геттер и сеттер для декорированного класса.
 * @param models - массив строк с названиями классов с которых будут браться методы
 * @returns class extends constructor - конструктор декорированного класса с назначенными методами
 */
export const DefineMethods = (...models: string[]): Function => {
	return (constructor: any) => {
		return class extends constructor {
			constructor(...args: any[]) {
				super(...args);
				models.forEach((model: string) => {
					const modelInstance: any = Container.get(model);
					Object.keys(modelInstance).forEach((method) => {
						if (method[0] === '_') {
							Object.defineProperty(
								this,
								method,
								typeof modelInstance[method] === 'function'
									? { value: modelInstance[method], configurable: false, enumerable: false }
									: {
											get: () => modelInstance[method],
											set: (...args) => {
												modelInstance[method] = args;
											},
											configurable: false,
											enumerable: false,
									  }
							);
						}
						if (method[0] !== '_') {
							Object.defineProperty(
								this,
								method,
								typeof modelInstance[method] === 'function'
									? { value: modelInstance[method], configurable: true, enumerable: true }
									: {
											get: () => modelInstance[method],
											set: (...args) => {
												modelInstance[method] = args;
											},
											configurable: true,
											enumerable: true,
									  }
							);
						}
					});
				});
			}
		};
	};
};

/** @see {@link https://www.typescriptlang.org/docs/handbook/mixins.html} */

export function ApplyMixins(...constructors: any[]) {
	return (constructor: any) => {
		constructors.forEach((baseCtor) => {
			Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
				Object.defineProperty(
					constructor.prototype,
					name,
					Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
				);
			});
		});
	};
}

/** Декоратор для отлавливания ошибок в запросах оборачиваемого метода в классах api
 * При ошибке всплывает уведомление с текстом ошибки
 */
export const catcherErrors = (customErrors?: Record<string | number, string>) => {
	return (target: any, name: string, descriptor: any) => {
		const original = descriptor.value;
		if (typeof original === 'function') {
			descriptor.value = async function (...args: any) {
				try {
					return await original.apply(this, args);
				} catch (e) {
					this.notificationModel.setError((e as Error).message, 'error');
				}
			};
		}
		return descriptor;
	};
};

/** Декоратор для показа уведомлений при успешном ответе при запросе оборачиваемого метода классах api */
export const notify = () => {
	return (target: any, name: string, descriptor: any) => {
		const original = descriptor.value;
		if (typeof original === 'function') {
			descriptor.value = async function (...args: any[]) {
				const result = await original.apply(this, args);
				this.notificationModel.setError(result.fact, 'info');
				return result;
			};
		}
		return descriptor;
	};
};

export { isObject, format, toCapitalize };
