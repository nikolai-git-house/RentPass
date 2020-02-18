import React, { Component } from 'react';
import { animateScroll } from  'react-scroll';
import { postMessage } from "../Utils/middleware";

class Select extends Component {

	state = {
		activeIndex: -1,
		activeSubOptions: {},
		popularCountries:[],
        activeIndexPopular: -1,
        activeSubOptionsPopular: {},
	};

	componentWillMount() {
		this.arrow = require('../images/arrow.svg');
		this.check = require('../images/Checkmark.svg');
		this.getPopularCountries();
		this.data = {};
		this.popularData = {};
	}

	getOptions() {
		const { activeIndex} = this.state;
		const {options} = this.props;
		return options.map((option, i) => {
			const style = {
				top: `calc(4.4em*${i})`
			};
			return (
				<div
					style={style}
					className={`option-wrapper ${activeIndex === -1 ? 'display-all' : ''} ${activeIndex === i ? 'active' : ''}`} key={i}>
					<div className="option-header" onClick={() => this.onClick(i)}>
						<div className='option-header-name'>{option.name}</div>
						<div className='chevron'>
							<img src={this.arrow} alt=""/>
						</div>
					</div>
					<div className='option-values'>
						{ this.getSubOptions(option.values) }
					</div>
					{activeIndex === i ? <div className="values-overlay" /> : null}
				</div>
			)
		});
	}

    getPopularOptions() {
		const { popularCountries,activeIndexPopular } = this.state;
        return popularCountries.map((option, i) => {
            const style = {
                top: `calc(4.4em*${i})`
            };
            return (
                <div
                    style={style}
                    className={`option-wrapper ${activeIndexPopular === -1 ? 'display-all' : ''} ${activeIndexPopular === i ? 'active' : ''}`} key={i}>
                    <div className="option-header" onClick={() => this.onClickPopular(i)}>
                        <div className='option-header-name'>{option.name}</div>
                        <div className='chevron'>
                            <img src={this.arrow} alt=""/>
                        </div>
                    </div>
                    <div className='option-values'>
                        { this.getPopularSubOptions(option.values) }
                    </div>
                    {activeIndexPopular === i ? <div className="values-overlay" /> : null}
                </div>
            )
        });
	}

	getPopularCountries = () => {
        const { options } = this.props;
		let popularCountries =  options && options.filter((data) => {
			if(data.name.toLowerCase()==='United States'.toLowerCase()|| data.name.toLowerCase()==='Canada'.toLowerCase() || data.name.toLowerCase() ==='United Kingdom'.toLowerCase()){
				return true;
			}
		});
		this.setState({popularCountries:popularCountries.reverse()})
	};

    getPopularSubOptions = (values) => {
        const { activeSubOptionsPopular } = this.state;
        return values.map((value, i) => {
            return (
                <div className={`value ${activeSubOptionsPopular[value.id] ? 'checked' : ''}`}
                     key={i}
                     onClick={() => this.onSubOptionClickPopular(value)}
                >
                    <div className='value-name'>{value.name}</div>
                    <img className='check' src={this.check} alt=""/>
                </div>
            )
        });
	}

	getSubOptions = (values) => {
		const { activeSubOptions } = this.state;
		return values.map((value, i) => {
			return (
				<div className={`value ${activeSubOptions[value.id] ? 'checked' : ''}`}
						 key={i}
						 onClick={() => this.onSubOptionClick(value)}
				>
					<div className='value-name'>{value.name}</div>
					<img className='check' src={this.check} alt=""/>
				</div>
			)
		});
	};

	onClick = (index) => {
		this.setState({
			activeIndex: this.state.activeIndex === -1 ? index : -1,
		});
	};

    onClickPopular = (index) => {
    	this.setState({activeIndexPopular:this.state.activeIndexPopular === -1 ? index : -1});
	}

	onSubOptionClick = (value) => {
		const { activeIndex } = this.state;
		const { options } = this.props;
		const activeSubOptions =  Object.assign(this.state.activeSubOptions);
		if (!activeSubOptions[value.id]) {
			const cities = this.data[activeIndex] && this.data[activeIndex].cities ? this.data[activeIndex].cities : [];
			cities.push(value);
			this.data[activeIndex] =({
				country: options[activeIndex].name,
				cities
			});
			activeSubOptions[value.id] = value;
		}
		else {
			const cities = this.data[activeIndex] && this.data[activeIndex].cities && this.data[activeIndex].cities.length ?
				this.data[activeIndex].cities.filter(d => {
				return d.id !== value.id
			}) : [];
			if (cities.length) {
				this.data[activeIndex] =({
					country: options[activeIndex].name,
					cities
				});
			} else {
				delete this.data[activeIndex];
			}
			delete activeSubOptions[value.id];
		}
		this.setState({
			activeSubOptions
		});
	};
    onSubOptionClickPopular = (value) => {
        const { activeIndexPopular,popularCountries } = this.state;
        const activeSubOptionsPopular =  Object.assign(this.state.activeSubOptionsPopular);
        if (!activeSubOptionsPopular[value.id]) {
            const cities = this.popularData[activeIndexPopular] && this.popularData[activeIndexPopular].cities ? this.popularData[activeIndexPopular].cities : [];
            cities.push(value);
            this.popularData[activeIndexPopular] =({
                country: popularCountries[activeIndexPopular].name,
                cities
            });
            activeSubOptionsPopular[value.id] = value;
        }
        else {
            const cities = this.popularData[activeIndexPopular] && this.popularData[activeIndexPopular].cities && this.popularData[activeIndexPopular].cities.length ?
                this.popularData[activeIndexPopular].cities.filter(d => {
                    return d.id !== value.id
                }) : [];
            if (cities.length) {
                this.popularData[activeIndexPopular] =({
                    country: popularCountries[activeIndexPopular].name,
                    cities
                });
            } else {
                delete this.popularData[activeIndexPopular];
            }
            delete activeSubOptionsPopular[value.id];
        }
        this.setState({
            activeSubOptionsPopular
        });
    };


	addMessage = () => {
		const { activeSubOptions,activeSubOptionsPopular} = this.state;
		let postObject = [];
		Object.values(this.data).forEach(d => {
            postObject = postObject.concat(d.cities);
        });

        Object.values(this.popularData).forEach(d => {
            postObject = postObject.concat(d.cities);
        });
		postMessage('departures', postObject);
		let activeOptions = {...activeSubOptions,...activeSubOptionsPopular};
		const activeValue = Object.keys(activeOptions).reduce((acc, d) => {
			return `${acc} ${activeOptions[d].name},`;
		}, '').slice(0, -1);
		const { addMessage } = this.props;
		if (activeValue){
			addMessage({
				type: 'user',
				message: activeValue
			})
		}
	};

	render() {
		const { activeSubOptions,activeSubOptionsPopular } = this.state;
		const showButton = Object.keys(activeSubOptions).length !== 0 || Object.keys(activeSubOptionsPopular).length !== 0;
		if (showButton) animateScroll.scrollToBottom({
			duration: 500,
			smooth: "easeInOutQuad",
		});
		return (
			<div className='message-select-container'>
				<div className='select-category'>
					POPULAR COUNTRIES
				</div>
                <div className={`select-wrapper ${showButton ? 'active' : ''} popular`}>
                    {this.getPopularOptions()}
                </div>
				<div className='select-category'>
					OTHER COUNTRIES
				</div>
				<div className={`select-wrapper ${showButton ? 'active' : ''}`}>
					{this.getOptions()}
				</div>
				{ showButton ?
					<div
						className={`button-wrapper ${showButton ? 'visible' : ''}`}
						onTouchStart={this.addMessage}
					>
						<div className='message message-static'>
							Done
						</div>
					</div> : null}
			</div>
		)
	}
}

export default Select;