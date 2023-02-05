import { NotificationModel } from '@components';
import { observable } from 'mobx';
import { catcherErrors, notify } from 'src/utils';
import { Inject, Service } from 'typedi';

@Service('HandleFetch')
export class HandleFetch {
	mainUrl: string;
	headers: Headers = new Headers();

	setUrl(urlPath: string) {
		this.mainUrl = urlPath;
		return this;
	}

	setParams(params: any) {
		return this;
	}

	async onRequest() {
		const response = await fetch(this.mainUrl, { headers: this.headers });
		if (response.ok) {
			return response.json();
		} else {
			throw new Error(`Ошибка в запросе ${this.mainUrl}`);
		}
	}
}

@Service('Api')
class Api {
	@Inject('HandleFetch') handleFetch: HandleFetch;
	@Inject('NotificationModel') notificationModel: NotificationModel;

	@catcherErrors()
	@notify()
	getImage(typeAnimal: string) {
		return this.handleFetch.setUrl(`${RANDOM_URL}/animal/${typeAnimal}`).onRequest();
	}
}

@Service('AppService')
export class AppService {
	@Inject('Api') api: Api;

	@observable private animal: string = 'bird';

	getAnimal() {
		return this.animal;
	}

	setTypeAnimal(type: string) {
		this.animal = type;
	}

	async getRandomImage() {
		return this.api.getImage(this.animal);
	}
}
