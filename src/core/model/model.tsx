import 'reflect-metadata';
import React, { createElement, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Model } from '.';

export interface ModelProps {
	model: Model;
	ReactComponent: React.FC<any>;
}

export const model = ({ model, ReactComponent }: ModelProps) => {
	const componentName = `${model.constructor.name.replace(/(Model)/, 'ReactModelComponent')}`;
	if (!model.isConnectedModel) {
		model.connectModel();
	}
	return (() => {
		const component = (props: any) => {
			useEffect(() => () => model.disconnectModel(), []);
			return createElement(observer(ReactComponent), { ...props, model });
		};
		/** Определить имя для компонента, например - AppReactModelComponent @see {@link componentName} */
		Object.defineProperty(component, 'name', {
			value: componentName,
			configurable: true,
		});
		return component;
	})();
};
