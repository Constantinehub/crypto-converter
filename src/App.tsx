import React, { useState, useEffect } from 'react';
import {
	FormControl,
	InputLabel,
	TextField,
	Typography,
	Select,
	MenuItem,
	Switch,
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import styled from 'styled-components';
import obj from './utils/data.json';

const AppContainer = styled.div`
	display: flex;
	justify-content: center;
	min-height: 100vh;
`;

const Wrapper = styled.div`
	width: 600px;
	padding: 3rem 0;
`;

const Divider = styled.div`
	height: 1px;
	background-color: lightgray;
`;

const CustomMenu = styled.ul`
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: flex-end;
	padding: 0;
	margin: 0 0 3rem;
`;

const CustomMenuItem = styled.li`
	position: relative;
	display: inline-flex;
	padding: 0.5rem 0.1rem;
	text-transform: uppercase;
	margin-right: 2rem;
	color: black;
	background-color: white;
	
	&:last-child {
		margin-right: 0;
	}
	
	&:before {
		content: '';
		position: absolute;
		left: 0;
		bottom: -1px;
		width: 0;
		height: 1px;
		background-color: black;
		transition: width 0.2s ease;
	}
	
	&:hover {
		cursor: pointer;

		&:before {
			width: 100%;
			transition-duration: 0.3s;
		}
	}
`;

const ConverterContainer = styled.div`
	padding-top: 3rem;
`;

const Calculation = styled.div`
	display: flex;
	align-items: stretch;
`;

const Result = styled.div`
	display: flex;
	justify-content: center;
  	margin-bottom: 1.5rem;
  
  	.result {
	  	margin-right: 5px;
    }
  
  	.currency {
	  	font-weight: bold;
    }
`;

const LeftSide = styled.div`
	width: 100%;
`;

const MiddleSide = styled.div`
	align-self: center;
	padding: 0 2rem;
`;

const RightSide = styled.div`
	width: 100%;
`;

const FormControlItem = styled.div`
	width: 100%;
	max-width: 300px;
	display: flex;
	margin-bottom: 1rem;
	align-items: flex-end;
`;

const MenuList = () => {
	const menu = ['Home', 'Photos', 'Something bigger'];

	return (
		<CustomMenu>
			{menu.map((item, idx) => <CustomMenuItem key={idx}>{item}</CustomMenuItem>)}
		</CustomMenu>
	);
}

const Converter = () => {
	const currencyPairs = obj?.['currencies-pairs'];
	const [currencyList, setCurrencyList] = useState<any>([]);
	const [items, setItems] = useState<any>([]);
	const [conversionTo, setConversionTo] = useState<string>('');
	const [result, setResult] = useState<string>('');

	const getCurrencyListFromPairs = (pairs: any) => {
		return Object.keys(pairs).reduce((accum, item) => {
			const key = item.split('-')[0];
			accum.add(key);
			return accum;
		}, new Set());
	}

	const calculateItems = (items: any) => {
		return items.reduce((accum: any, currentItem: any) => {
			const { price, currency } = currentItem;
			// @ts-ignore
			const conversionRate = currencyPairs[`${currency}-${conversionTo}`];

			if (conversionRate) {
				accum += price * conversionRate;
			} else {
				accum += price;
			}

			return accum;
		}, 0);
	}

	const getFormattedNumber = (number: number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	useEffect(() => {
		const filteredCurrencyList = Array.from(getCurrencyListFromPairs(obj['currencies-pairs']));
		const transformedItemList = obj?.data.map((item: any) => ({
			...item,
			selected: false,
		}));
		setCurrencyList(filteredCurrencyList);
		setItems(transformedItemList);
	}, []);

	useEffect(() => {
		if (currencyList.length) {
			setConversionTo(currencyList[0])
		}
	}, [currencyList]);

	useEffect(() => {
		const selectedItems = items.filter((item: any) => item.selected);

		if (selectedItems.length) {
			const calculatedItems = calculateItems(selectedItems);
			setResult(getFormattedNumber(calculatedItems));
		} else {
			setResult('');
		}
	}, [items, conversionTo]);

	const renderCurrencySelect = (value: string, onChangeHandler: any, label: string, itemIndex?: number) => {
		return (
			<FormControl
				sx={{ width: itemIndex !== undefined ? 100 : '100%' }}
				variant="standard"
			>
				<InputLabel>{label}</InputLabel>
				<Select
					value={value}
					onChange={({ target: { value } }: any) => {
						onChangeHandler(value, itemIndex)
					}}
				>
					{currencyList.map((item: string, idx: number) => (
						<MenuItem key={`${item}_${idx}`} value={item}>{item}</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	}

	const renderCurrencyItems = () => {
		return items.map(({ id, price, selected, currency }: any, index: number) => {
			return (
				<FormControlItem key={index}>
					<Switch
						checked={selected}
						onChange={() => handleSwitchChange(index)}
					/>
					<TextField
						label="Sum"
						variant="standard"
						value={price}
						sx={{
							marginRight: '15px',
							minWidth: '50px',
						}}
						InputProps={{
							readOnly: true,
						}}
					/>
					{renderCurrencySelect(currency, handleItemCurrencyChange, 'Currency', index)}
				</FormControlItem>
			)
		});
	}

	const handleSwitchChange = (index: number) => {
		setItems((prevItems: any) => {
			return prevItems.map((item: any, idx: number) => {
				if (index === idx) {
					return {
						...item,
						selected: !item.selected,
					}
				}
				return item;
			});
		});
	}

	const handleItemCurrencyChange = (value: string, itemIndex: number) => {
		setItems((prevData: any) => prevData.map((item: any, idx: number) => {
			if (itemIndex === idx) {
				return {
					...item,
					currency: value,
				}
			}
			return item;
		}));
	}

	const handleConversionToChange = (value: string) => {
		setConversionTo(value);
	}

	return (
		<ConverterContainer>
			{result && (
				<Result>
					<Typography className="result">{result}</Typography>
					<Typography className="currency">{conversionTo}</Typography>
				</Result>
			)}
			<Calculation>
				<LeftSide>
					{renderCurrencyItems()}
				</LeftSide>
				<MiddleSide>
					<CurrencyExchangeIcon color="success" />
				</MiddleSide>
				<RightSide>
					{renderCurrencySelect(conversionTo, handleConversionToChange, 'Conversion To')}
				</RightSide>
			</Calculation>
		</ConverterContainer>
	);
};

function App() {
	return (
		<AppContainer>
			<Wrapper>
				<MenuList />
				<Divider />
				<Converter />
			</Wrapper>
		</AppContainer>
	);
}

export default App;
