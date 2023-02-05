import * as locales from '@components/locale';

export interface ILocale {
	en?: Record<string, any>;
	ru?: Record<string, any>;
	[index: string]: Record<string, any>;
}

export const lang = Object.entries(locales).reduce<ILocale>(
	(objLang, [name, locale]: [string, ILocale]) => {
		for (const langKey in objLang) {
			objLang[langKey] = Object.assign(objLang[langKey], {
				[name.replace(/(Locale|locale)?$/, '')]: locale[langKey],
			});
		}
		return objLang;
	},
	{ ru: {}, en: {} }
);
