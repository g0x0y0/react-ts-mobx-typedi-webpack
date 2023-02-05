import { Config } from '@core/config';
import { makeObservable, observable } from 'mobx';
import { ApplyMixins, DefineMethods } from 'src/utils';
import { Service } from 'typedi';

@Service('Test')
export class Test {
	@observable _test: string = 'test';

	get test() {
		return this._test;
	}
}

/** Унаследовать методы из перечисленных классов
 * таким образом в пропсе model в реакт компонентах  будут определяться все унаследованные методы и переменные
 */
export interface Model extends Config {}

@Service('Model')
@DefineMethods('Config', 'Test')
@ApplyMixins(Config, Test)
export class Model {
	@observable isConnectedModel = false;

	connectModel = () => {
		this.isConnectedModel = true;
		this.onConnectModel();
		makeObservable(this);
	};

	disconnectModel(): void {
		this.onDisconnectModel();
	}

	protected onConnectModel(): void | Promise<void> {}
	protected onDisconnectModel(): void | Promise<void> {}
}
