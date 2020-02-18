import { getCities } from "./cities";

export const botMessages = [
	[
		{
			type: 'bot',
			message: "So you want to change your deal preferences? I'll help with that!"
		},
		{
			type: 'bot',
			message: 'Which city would you like deals departing from?',
		}
	],
	[
		{
			type: 'bot',
			message: 'Great. What kind of destinations are you looking for?'
		},
	],
	[
		{
			type: 'bot',
			message: 'You\'re all set. You\'ll start receiving these deals from now on.'
		}
	]
];

export const userMessages = [
	{
		type: 'user',
		inputType: 'select',
		options: []
	},
	{
		type: 'user',
		inputType: 'card',
		cards: [
			{
				id: "5b019bd6c4b8452bf98c9f2d,5b019bd6c4b8452bf98c9f2c,5b027b7ee061853ff4773cf5,5b027b7ee061853ff4773cf6,5b027b7ee061853ff4773cf7",
				name: 'Anywhere',
				description: 'Any destinations we find',
				image: require('../images/cards/anywhere.png')
			},
			{
				id: "5b019bd6c4b8452bf98c9f2d",
				name: 'Warm',
				description: 'Caribbean, Bali, Cancun, etc',
				image: require('../images/cards/warm.png')
			},
			{

				id: "5b019bd6c4b8452bf98c9f2c",
				name: 'Adventurous',
				description: 'Iceland, Congo, Egypt, etc.',
				image: require('../images/cards/adventurous.png')
			},
			{

				id: "5b027b7ee061853ff4773cf5",
				name: 'Big Cities',
				description: 'Tokyo, London, Taipei, etc/',
				image: require('../images/cards/big-cities.png')
			},
			{

				id: "5b027b7ee061853ff4773cf6",
				name: 'Europe',
				description: 'Paris, Rome, Amsterdam, etc.',
				image: require('../images/cards/europe.png')
			},
			{

				id: "5b027b7ee061853ff4773cf7",
				name: 'U.S Cities',
				description: 'NYC, LA, Denver, Seattle, etc.',
				image: require('../images/cards/us-cities.png')
			},
		]
	},
	{
		type: 'user',
		inputType: 'static',
		message: 'Finish',
		finish: true
	},
];


getCities().then(res => {
	userMessages[0].options = res; // TODO: currently updaing the 0 element just to make it easier
});
