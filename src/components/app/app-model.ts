import { Model } from '@core/model';
import { action, computed, observable, runInAction } from 'mobx';
import { Inject, Service } from 'typedi';
import { TimerModel } from '../timer/timer-model';
import { AppService } from './service';

interface IImageData {
	data: { image: string; fact: string };
	isFavorite: boolean;
}

@Service('AppModel')
export class AppModel extends Model {
	@Inject('AppService') private appService: AppService;
	@Inject('TimerModel') timer: TimerModel;
	@observable imageData: IImageData[] = [];
	@observable currentImageIndex: number = 0;
	@observable isLoading: boolean = true;

	// prettier-ignore
	animals: { [key: string]: { name: string; value: string } } = {
		bird       : { name: this.lang.app.animals.bird,         value: 'bird'      },
		cat        : { name: this.lang.app.animals.cat,          value: 'cat'       },
		dog        : { name: this.lang.app.animals.dog,          value: 'dog'       },
		fox        : { name: this.lang.app.animals.fox,          value: 'fox'       },
		kangaroo   : { name: this.lang.app.animals.kangaroo,     value: 'kangaroo'  },
		koala      : { name: this.lang.app.animals.koala,        value: 'koala'     },
		panda      : { name: this.lang.app.animals.panda,        value: 'panda'     },
		raccoon    : { name: this.lang.app.animals.raccoon,      value: 'raccoon'   },
		'red_panda': { name: this.lang.app.animals['red_panda'], value: 'red_panda' },
	};

	protected onConnectModel(): void {
		this.loadImage();
	}

	@action loadImage = async () => {
		this.isLoading = true;
		const data = await this.appService.getRandomImage();
		runInAction(() => {
			this.isLoading = false;
			if (data) {
				this.imageData.push({ data, isFavorite: false });
				this.currentImageIndex = this.imageData.length - 1;
			}
		});
	};

	@computed get animal() {
		return this.animals[this.appService.getAnimal()];
	}

	@action setTypeAnimal(type: string) {
		this.appService.setTypeAnimal(type);
	}

	@action addToFavorite() {
		this.imageData[this.currentImageIndex].isFavorite = !this.imageData[this.currentImageIndex].isFavorite;
	}

	@action setCurrentImageIndex(page: number) {
		this.currentImageIndex = page - 1;
	}

	@computed get isFavorite() {
		return this.imageData[this.currentImageIndex]?.isFavorite;
	}

	@computed get image() {
		return this.imageData[this.currentImageIndex]?.data?.image;
	}

	@computed get factImage() {
		return this.imageData[this.currentImageIndex]?.data?.fact;
	}
}
