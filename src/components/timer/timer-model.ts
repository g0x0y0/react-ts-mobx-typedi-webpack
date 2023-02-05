import { Model } from '@core/model';
import { action, observable } from 'mobx';
import { Service } from 'typedi';

@Service('TimerModel')
export class TimerModel extends Model {
	@observable secondsPassed = 0;

	@observable interval: NodeJS.Timer;

	protected onConnectModel(): void {
		this.startInterval();
		return;
	}

	protected onDisconnectModel() {
		clearInterval(this.interval);
	}

	@action startInterval() {
		this.interval = setInterval(() => {
			this.increaseTimer();
		}, 1000);
	}

	@action increaseTimer = () => {
		this.secondsPassed += 1;
	};
}
