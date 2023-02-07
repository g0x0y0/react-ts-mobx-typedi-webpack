import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration as WebpackConfig, DefinePlugin } from 'webpack';
import { Configuration as ServerConfig } from 'webpack-dev-server';
import TerserPlugin from 'terser-webpack-plugin';

export type Configuration = WebpackConfig & ServerConfig;

const config = (env: any, cfg: any) => {
	return {
		entry: './src/index.tsx',
		mode: cfg.mode,
		devtool: cfg.mode ? 'source-map' : 'inline-source-map',
		output: {
			path: path.join(__dirname, './build'),
			filename: 'main.min.js',
		},
		resolve: {
			extensions: ['.ts', '.js', '.json', '.tsx'],
			plugins: [new TsconfigPathsPlugin({ extensions: ['.ts', '.js', '.json', '.tsx'] })],
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)?$/,
					exclude: /node_modules/,
					use: 'ts-loader'
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		plugins: [
			new DefinePlugin({
				MAIN_NAME : JSON.stringify('App'),
				VERSION   : JSON.stringify('1.0.0'),
				LOGGER    : JSON.stringify(cfg.env.logger),
				RANDOM_URL: JSON.stringify(cfg.mode === 'development' ? '/random' : 'https://some-random-api.ml'),
			}),
			new HtmlWebpackPlugin({ template: './src/index.html' }),
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin(),
		],
		optimization: {
			minimize: cfg.mode === 'production',
			minimizer: [
				new TerserPlugin({
					include:         /\.min\.js$/,
					parallel:        true,
					extractComments: 'all'
				})
			]
		},
		devServer: {
			port: 8008,
			open: false,
			allowedHosts: 'all',
			proxy: {
				'/random/**': {
					target: 'https://some-random-api.ml',
					secure: true,
					changeOrigin: true,
					pathRewrite: {
						'/random': '',
					},
				},
			},
		},
	} as Configuration;
};

export default config;
