import React, { ChangeEvent, FC } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageSearch from '@mui/icons-material/ImageSearch';
import { AppModel } from './app-model';
import { CircularProgress, Tooltip } from '@mui/material';
import { observer } from 'mobx-react';
import { format } from 'src/utils';
import { Timer } from '@core';

export interface AppProps {
	model: AppModel;
}

const RecipeReviewCard: FC<AppProps> = observer(({ model }) => {
	return (
		<Card sx={{ maxWidth: 345, margin: 'auto', textAlign: 'center' }}>
			<div style={{ height: 200 }}>
				{model.isLoading ? (
					<CircularProgress color="inherit" />
				) : (
					<CardMedia component="img" height="194" image={model.image} alt="animal/bird" />
				)}
			</div>
			<CardActions disableSpacing>
				<IconButton onClick={() => model.addToFavorite()}>
					<FavoriteIcon htmlColor={model.isFavorite ? 'red' : ''} />
				</IconButton>
				<IconButton onClick={() => model.loadImage()}>
					<Tooltip title={model.lang.app.next}>
						<ImageSearch style={{ fontSize: 40 }} />
					</Tooltip>
				</IconButton>
				<select onChange={(event: ChangeEvent<HTMLSelectElement>) => (model.locale = event.target.value)}>
					{model.languages.map(({ name, value }) => (
						<option key={name} value={value}>
							{name}
						</option>
					))}
				</select>
				<select onChange={(event: ChangeEvent<HTMLSelectElement>) => model.setTypeAnimal(event.target.value)}>
					{Object.keys(model.animals).map((name) => (
						<option key={name} value={model.animals[name].value}>
							{model.lang.app.animals[name]}
						</option>
					))}
				</select>
			</CardActions>
			<CardContent>
				<Typography variant="body2" color="text.secondary">
					<Timer />
					<br />
					<>
						{format(model.lang.timer.secondsFrom, 'App')}: {model?.timer?.secondsPassed}
					</>
				</Typography>
			</CardContent>
			<CardActions style={{ justifyContent: 'center' }}>
				<Pagination
					count={model.imageData.length}
					variant="outlined"
					shape="rounded"
					size="small"
					page={model.currentImageIndex + 1}
					onChange={(_, page) => model.setCurrentImageIndex(page)}
				/>
			</CardActions>
			<CardHeader title={model.lang.app.fact} subheader={model.factImage} />
		</Card>
	);
});

export const app: FC<AppProps> = ({ model }) => {
	return (
		<main style={{ width: '100%', height: '100vh' }}>
			<RecipeReviewCard model={model} />
		</main>
	);
};
