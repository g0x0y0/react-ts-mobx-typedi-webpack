declare global {
	const LOGGER: boolean;
	const RANDOM_URL: string;
	interface String {
		format(...args: string[]): string;
	}
}

export {};
