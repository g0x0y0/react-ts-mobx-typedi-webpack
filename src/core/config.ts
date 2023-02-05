import { observable } from 'mobx';
import { applyFormatters, makeLoggable } from 'mobx-log';
import { Service } from 'typedi';
import { ILocale, lang as language } from './locale';

export const defaultFunc = (...args: any) => {};

// prettier-ignore
export interface IConfig {
	getLocale?: typeof defaultFunc;
	setLocale?: typeof defaultFunc;
	locale?   : string;
	lang?     : ILocale;
}

@Service('Config')
export class Config implements IConfig {
	@observable private _locale: string = 'ru';
	private _lang: ILocale = language;

	languages: { name: string; value: string }[] = [
		{ name: 'Русский', value: 'ru' },
		{ name: 'English', value: 'en' },
	];

	get language() {
		return this.languages.find((lang) => lang.value === this._locale) || this.languages[0];
	}

	get locale() {
		return this._locale;
	}

	set locale(locale: string) {
		this._locale = locale;
	}

	get lang() {
		return this._lang[this._locale];
	}

	startLog() {
		applyFormatters();
		makeLoggable(this);
	}

	public stopLog() {
		makeLoggable(this, {
			filters: {
				events: {
					computeds: false,
					observables: false,
					actions: false,
				},
			},
		});
	}
}
