import React, { useState, useEffect } from 'react';
import {
	FormControl,
	InputLabel,
	TextField,
	Typography,
	Select,
	Button,
	MenuItem,
	Switch,
} from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AddIcon from '@mui/icons-material/Add';
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

const ConverterContainer = styled.div``;

const Calculation = styled.div`
	display: flex;
	align-items: stretch;
`;

const ResultContainer = styled.div`
    display: flex;
    justify-content: center;
    min-height: 5rem;
    position: relative;
`;

const Result = styled.div`
	display: flex;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
  
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
	padding: 1rem 2rem 0;
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
						value={`${price}`}
						sx={{
							marginRight: '15px',
							minWidth: '50px',
						}}
						onChange={(evt: any) => {
							const { target: { value } } = evt;
							const sanitizedValue = value.replace(/[^0-9\.]/g,'');
							handleItemSumChange(sanitizedValue, index);
						}}
					/>
					{renderCurrencySelect(currency, handleItemCurrencyChange, 'Currency', index)}
				</FormControlItem>
			)
		});
	}

	const handleItemSumChange = (value: any, index: number) => {
		const newData = [...items];
		newData[index] = {
			...items[index],
			price: Number(value),
		}

		setItems(newData);
	}

	const handleSwitchChange = (index: number) => {
		const newData = [...items];
		newData[index] = {
			...items[index],
			selected: !items[index].selected
		}

		setItems(newData);
	}

	const handleItemCurrencyChange = (value: string, itemIndex: number) => {
		const newData = [...items];
		newData[itemIndex] = {
			...items[itemIndex],
			currency: value
		}

		setItems(newData);
	}

	const handleConversionToChange = (value: string) => {
		setConversionTo(value);
	}

	const handleAddMoreClick = () => {
		const newData = [...items];
		newData.push({
			id: Number(items[items.length-1] + 1),
			price: 0,
			currency: currencyList[0],
			selected: false,
		});

		setItems(newData);
	}

	return (
		<ConverterContainer>
			<ResultContainer>
				{result && (
					<Result>
						<Typography className="result">{result}</Typography>
						<Typography className="currency">{conversionTo}</Typography>
					</Result>
				)}
			</ResultContainer>
			<Calculation>
				<LeftSide>
					{renderCurrencyItems()}
					<Button
						fullWidth
						color="primary"
						variant="contained"
						startIcon={<AddIcon />}
						sx={{
							marginTop: '1rem',
							textAlign: 'center',
						}}
						onClick={handleAddMoreClick}
					>
						Add more
					</Button>
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
