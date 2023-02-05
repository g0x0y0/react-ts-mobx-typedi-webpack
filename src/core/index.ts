/** @ReactComponents - реакт компоненты импортированные из файла ./exports (которые предварительно там подготавливаются) */
import ReactComponents, { IApplication } from './exports';
import { model } from './model/model';
import Container from 'typedi';

/**  */
export const { App, Timer, Notification } = Object.entries(ReactComponents).reduce(
	(obj, [name, ReactComponent]) => ({ ...obj, [name]: model({ model: Container.get(name + 'Model'), ReactComponent }) }),
	{} as IApplication
);
