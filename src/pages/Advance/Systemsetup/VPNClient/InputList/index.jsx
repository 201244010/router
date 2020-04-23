import React from 'react';
import { checkIp, checkRange } from '~/assets/common/check';
import Form from "~/components/Form";
import './inputList.scss';

const MODULE = 'vpn';
const { FormItem, Input, InputGroup } = Form;

class InputList extends React.Component {
	constructor(props){
		super(props);
		this.state = {
            value : props.value,
        };
	}

	static getDerivedStateFromProps(props){
        return {
            value : props.value
        }
    }

	onInputListChange = (e, itemIndex, type) => {
		const { value } = this.state;
		const change = value.map((item, index) => {
			let content = item.split('/');
			let ip = content[0].split('.');
			let input = content[1];
			if(index === itemIndex) {
				if(type === 'ip') {
					return [e.join('.'), input].join('/');
				}
				if(type === 'input') {
					return [ip.join('.'), e].join('/');
				}
			} else {
				return item;
			}
		})
		this.setState({
			value: change,
		})
		if(this.props.onChange) {
			this.props.onChange(change);
		}
	}

	addRow = () => {
		//这个里面用到了浅拷贝的知识点
		const { value } = this.state;
		value.push('.../');
		this.setState({
			value: value,
		});
	}

	deleteRow = (itemIndex) => {
		const { value } = this.state;
		value.splice(itemIndex, 1);
		this.setState({
			value: value,
		});
	}

	render() {
		const { value = ['.../'] } = this.state;
		const { disabled, name = '' } = this.props;
		return (
			<React.Fragment>
			{
				value.map((item,index,arr) => {
					const content = item.split('/');
					const ip = content[0].split('.');
					const input = content[1];
					let hasError = false;
					let tip = '';

					if(item !== '.../') {
						hasError = checkIp(ip, { who: '' }) !== '' || checkRange(input, { who: '', min: 0, max: 31 }) !== '';
						tip = hasError? `${intl.get(MODULE, 55)/*_i18n:请正确输入*/}${name}${intl.get(MODULE, 56)/*_i18n:，如 192.168.100.0/(0 ~ 31)*/}`: '';
					}

					return (
						<div key={index} className={`inputList-row-body ${hasError? 'has-errorTip':''}`}>
							<div className='inputList-row-list'>
								<FormItem className='inputList-row-group'>
									<InputGroup                                                                
										inputs={[{value: ip[0], maxLength: 3}, {value: ip[1], maxLength: 3}, {value: ip[2], maxLength: 3}, {value: ip[3], maxLength: 3}]}
										onChange={value => this.onInputListChange(value, index, 'ip')}
										disabled={disabled}
									/>
								</FormItem>
								<FormItem className='inputList-row-input'>
									<Input
										value={input}
										type='text'
										onChange={value => this.onInputListChange(value, index, 'input')}
										disabled={disabled}
									/>
								</FormItem>
								{/* {
									arr.length === (index + 1) ?
									<div
										className='add-img'
										onClick={() => this.addRow(index)}
									></div>
									:
									<div 
										className='delete-img'
										onClick={() => this.deleteRow(index)}
									></div>
								} */}
								{	arr.length !== 1?
									<div
										className='delete-img'
										onClick={() => this.deleteRow(index)}
									></div>
									:
									''
								}
							</div>
							<p className='inputList-row-tip'>{tip}</p>
						</div>
					);	
				})
			}
				<div className='inputList-add' onClick={this.addRow} >
					<p className='inputList-add-plus'>+</p>
					<p className='inputList-add-font'>{intl.get(MODULE, 57)/*_i18n:添加*/}</p>
				</div>
			</React.Fragment>	
		);
	}
}
export default InputList;