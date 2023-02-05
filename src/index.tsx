import React from 'react';
import ReactDOM from 'react-dom/client';
import { Notification, App } from '@core';
import { SnackbarProvider } from 'notistack';
import './vendor/normalize.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement);

root.render(
	<SnackbarProvider maxSnack={100} style={{ maxWidth: 500 }}>
		<Notification>
			<App />
		</Notification>
	</SnackbarProvider>
);
