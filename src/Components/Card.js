import React, { Component } from 'react';

class Card extends Component {
	render() {
		const { name, description, image} = this.props.card;
		const { index, selected,  onClick} = this.props;
		return (
			<div className='card-wrapper' onClick={() => {onClick(this.props.card, index)}}>
				<img src={image} alt=""/>
				<div className="overflow" />
				<div className={`card-inner ${selected ? 'selected' : ''}`}>
					<div className="card-name">{name}</div>
					<div className='card-description'>{description}</div>
					<div className={`card-button ${selected ? 'selected' : ''}`}>
						{selected ? 'Selected' : 'Select'}
					</div>
				</div>
			</div>
		)
	}
}

export default Card;