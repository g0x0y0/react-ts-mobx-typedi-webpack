import React, { FC } from 'react';
import { format } from 'src/utils';
import { TimerModel } from './timer-model';

export interface TimerProps {
	model: TimerModel;
}

export const timer: FC<TimerProps> = ({ model }) => {
	return (
		<>
			{format(model.lang.timer.secondsFrom, 'Timer')}: {model.secondsPassed}
		</>
	);
};
