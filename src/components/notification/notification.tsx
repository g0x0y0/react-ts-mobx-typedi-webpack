import React, { FC, ReactElement, useEffect } from 'react';
import { NotificationModel } from './notification-model';
import { useSnackbar } from 'notistack';
import { Button, Tooltip } from '@mui/material';
import HighlightOff from '@mui/icons-material/HighlightOff';

interface ErrorProps {
	model: NotificationModel;
	children: ReactElement;
}

export const notification: FC<ErrorProps> = ({ model, children }) => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	useEffect(() => {
		if (model.message) {
			enqueueSnackbar(model.message, {
				variant: model.severity,
				autoHideDuration: model.hideDuration,
				action: (key) => (
					<Button size="small" style={{ color: 'white' }} onClick={() => closeSnackbar(key)}>
						<Tooltip title={model.lang.notification.closeButton}>
							<HighlightOff />
						</Tooltip>
					</Button>
				),
			});
			model.resetError();
		}
	}, [model.message]);
	return children;
};
