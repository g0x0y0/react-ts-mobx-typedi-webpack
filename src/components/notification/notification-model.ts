import type { AlertColor } from '@mui/material';
import { action, observable } from 'mobx';
import { Service } from 'typedi';
import { Model } from '@core/model';

@Service('NotificationModel')
export class NotificationModel extends Model {
	@observable severity: AlertColor = 'info';
	@observable message: string = '';
	@observable hideDuration: number = 10000;

	@action resetError() {
		this.message = '';
		this.severity = 'info';
	}

	@action setError(message: string, severity: AlertColor) {
		this.severity = severity;
		this.message = message;
	}
}
