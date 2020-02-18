import React, { Component } from 'react';
import Card from './Card';
import { postMessage } from "../Utils/middleware";

class CardContainer extends Component {

	state = {
		selected: {},
		selectedCard: {}
	};

	onClick = (card) => {
		const selected =  Object.assign(this.state.selected);
		if (!selected[card.id]) {
			selected[card.id] = card;
		}
		else delete selected[card.id];
		this.setState({
			selected
		});
	};
	getCards() {
		const { cards } = this.props;
		const allCards =  cards.map((card, i) => {
			return <Card onClick={this.onClick} card={card} index={i} key={i} selected={this.state.selected[card.id]}/>;
		});
		allCards.push(<div className='padding-adjust' id={69}/>);
		return allCards;
	}

	addCard = () => {
		// this.state.card
		const { selected } = this.state;
		const userMessage = this.props.message;
		const postObject = Object.keys(selected).map(d => {
			return {
				_id: d,
				name: selected[d]
			}
		});
		postMessage(userMessage.key, postObject);
		const message = Object.keys(selected).reduce((acc, d) => {
			return `${acc} ${selected[d].name},`;
		}, '').slice(0, -1);
		this.props.addMessage({
			type: 'user',
			message
		});
	};


	render() {
		const { selected } = this.state;
		const showButton = Object.keys(selected).length !== 0;
		return (
			<div className='cards-container'>
				<hr/>
				<div className="cards-inner-container">
					{this.getCards()}
				</div>
				{showButton ?
					<div
						className={`button-wrapper ${showButton ? 'visible' : ''}`}
						onClick={this.addCard}
					>
						<div className='message message-static'>
							Done
						</div>
					</div> : null}
			</div>
		)
	}
}

export default CardContainer;