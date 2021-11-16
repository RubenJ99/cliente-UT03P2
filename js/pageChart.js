"use strict";
const monthCtx = document.getElementById("monthlySales").getContext("2d");
const deptCtx = document.getElementById("deptSales").getContext("2d");
const yearlyLabel = document.getElementById("yearlyTotal");
const bSalesOver5000 = document.getElementById("bSalesOver5000");

const bReset = document.getElementById('bReset');
const newAmount = document.getElementById('itemAmount');
const newMonth = document.getElementById('monthId');
const bAddSaleModal = document.getElementById('bAddSaleModal');


const monthlySalesMap = new Map();
const newProduct = document.forms[0].inlineRadioOptions; //!!
const BG_COLORS = {
	'Camera': 'rgba(238, 184, 104, 1)',
	'Mobile': 'rgba(239, 118, 122, 1)',
	'Laptop': 'rgba(75, 166, 223, 1)',
	'Tablet': 'rgba(40, 167, 69, 1)',
}

const monthlySoldCameras = [];
const monthlySoldLaptops = [];
const monthlySoldMobiles = [];
const monthlySoldTablets = [];
const dataForPie = [0,0,0,0];



const monthLabels = [];
let deptSales = Array.of(12, 9, 7, 3);
let deptLabels = ["Camera","Mobile","Laptop","Tablet"];
let yearlyTotal = 0;

//DEFINICION DE CHART
let monthlySalesChart = new Chart(monthCtx, {
	type: "bar",
	data: {
		labels: [],
		datasets: [{
			label: 'Camera',
			data: [],
			backgroundColor: 'rgba(238, 184, 104, 1)',
			borderWidth: 0,
		},
		{label: 'Laptop',
			data: [],
			backgroundColor: 'rgba(239, 118, 122, 1)',
			borderWidth: 0,
		},
		{
		label: 'Mobile',
		data: [],
		backgroundColor: 'rgba(75, 166, 223, 1)',
		borderWidth: 0,
		},
		{
		label: 'Tablet',
		data: [],
		backgroundColor: 'rgba(40, 167, 69, 1)',
		borderWidth: 0,
		},],
	},
	options: {
		scales: {
			yAxes: [
				{
					ticks: {
						beginAtZero: true,
					},
				},
			],
		},
	},
});

//DEF PIE CHART
let deptSalesChart = new Chart(deptCtx, {
	type: "pie",
	data:{
		labels: deptLabels,
		datasets: [{
				label: "Número de ventas",
				data: [],
				backgroundColor: [
					"rgba(238, 184, 104, 1)",
					"rgba(75, 166, 223, 1)",
					"rgba(239, 118, 122, 1)",
					"rgba(40, 167, 69, 1)",
				],
				borderWidth: 0,
		}],
	},
	options: {},
});

function initMonthlyTotalSales(){
	let items = Array.from(monthlySalesMap.values());
	let aux;
	let acc = 0;
	items.forEach(item => {
		aux = Array.from(item.values()).reduce((count, value) => {
			return count + value;
			}, 0);
		acc += aux;
	});
	yearlyLabel.innerHTML = acc + "€";
}

initMonthlyTotalSales();


//Resetear datos en los gráficos
function resetMonthlySales(){
	monthlySalesMap.clear();
	monthlySalesChart.reset();
	monthlySalesChart.render();
	initMonthlyTotalSales();
 }
const PARSED_MONTHS = {
	'2021-01': 'January',
	'2021-02': 'February',
	'2021-03': 'March',
	'2021-04': 'April',
	'2021-05': 'May',
	'2021-06': 'June',
	'2021-07': 'July',
	'2021-08': 'August',
	'2021-09': 'September',
	'2021-10': 'October',
	'2021-11': 'November',
	'2021-12': 'December',
}
function parseMonth(date) {
	return PARSED_MONTHS[date];
}
const PRODS = {
	option1: 'Camera',
	option2: 'Mobile',
	option3: 'Laptop',
	option4: 'Tablet',
}
function parseProd(radio) {
	return PRODS[radio];
}

const PROD_POS = {
	Camera: 0,
	Mobile: 1,
	Laptop: 2,
	Tablet: 3,
}
//Añadir ventas al gráfico //MODIFICAR PRACTICA CASI SEGURO
function addSale(){
	let product = parseProd(newProduct.value);
	let parsedMonth = parseMonth(newMonth.value);
	let itemsInMonth = new Map();
	let data = {
		label: '',
		data: [],
		backgroundColor: '',
		borderWidth: 0,
	}
	let months = Array.from(monthlySalesMap.keys()).map(elem => parseMonth(elem));
	console.log(months)
		//SI EL MAPA PADRE CONTIENE EL MES SELECCIONADO
		if (monthlySalesMap.has(newMonth.value)){
			itemsInMonth = monthlySalesMap.get(newMonth.value); //month contiene map del mes seleccionado
			if(itemsInMonth.has(product)){ //en caso de que tengamos un registro del item en ese mes
				let num = itemsInMonth.get(product); //sacamos el valor del item y lo actualizamos
				let oldNum = num;
				num += Number.parseInt(newAmount.value);
				itemsInMonth.set(product, num);
				monthlySalesChart.data.datasets.forEach(dataSet => {
					if(dataSet.label === product){
						let indx = dataSet.data.indexOf(oldNum);
						dataSet.data.splice(indx,1,num);
					}
				});
			}else{
				itemsInMonth.set(product, Number.parseInt(newAmount.value)); //si no añadimos el nuevo valor
				console.log('por aqui');
				monthlySalesChart.data.datasets.forEach(dataSet => {
					if(dataSet.label === product){
						console.log(product);
						let i = months.indexOf(parseMonth(newMonth.value));
						console.log(i);
						dataSet.data.splice(i,1,Number.parseInt(newAmount.value));
					}
				});
			}
			monthlySalesMap.set(newMonth.value, itemsInMonth); //Acabado cualquiera de los 2 casos el mapa padre
																									//se actualiza retornando un mapa con valores correctos para el mes elegido
		}else{ //EN CASO DE QUE EL MAPA PADRE NO CONTENGA REGISTRO DEL MES SELECCIONADO
			itemsInMonth.set(product, Number.parseInt(newAmount.value)); //Generamos un mapa con el item y su valor
			monthlySalesMap.set(newMonth.value, itemsInMonth);//En el mapa padre creamos una entrada key mes val mapa de items
			monthlySalesChart.data.datasets.forEach(dataSet => {
				if(dataSet.label === product){
					dataSet.data.push(Number.parseInt(newAmount.value));
				}else{
					dataSet.data.push(0);
				}
			});
		}
		months = Array.from(monthlySalesMap.keys()).map(elem => parseMonth(elem));//Muestra los meses de los que hay registro en el grafico barras
		monthlySalesChart.data.labels = months;

		let arrPos = PROD_POS[product];
		let n = Number.parseInt(newAmount.value);
		let acc = dataForPie[arrPos];
		acc += n;
		dataForPie.splice(arrPos,1,acc);
		deptSalesChart.data.datasets[0].data = dataForPie;

		console.log(monthlySalesChart.data.datasets[0].data);
		console.log(monthlySalesChart.data.datasets[2].data);
		//Recuento de totales
		initMonthlyTotalSales();
		monthlySalesChart.update();
		deptSalesChart.update();
		cleanAddSaleForm();
}

function cleanAddSaleForm(){
	newMonth.value = "";
	newAmount.value = "";
}

 // Crear select con
function drawSelectMontlySales(){
	// Seleccionamos elemento usando id con jQuery
	let removeSales = $("#removeSales");
	// Eliminamos option del select.
	removeSales.empty();
	for (let [month, itemMap] of monthlySalesMap.entries()){
		for (let[item, value] of itemMap.entries()) {
			let opt = $("<option>").val(month+"/"+item).text(month + " -> " + item + " : " + value);
			removeSales.append(opt);
		}
	}
 }

 // Borrar meses de la colección
function removeMonthlySale(){
	let removeSales = document.getElementById("removeSales");
	let dateAndItem = removeSales.value.split("/");
	let valToRemove;
	let arrPos;
	if(monthlySalesMap.has(dateAndItem[0])){
		let selectedMap = monthlySalesMap.get(dateAndItem[0]);
		if(selectedMap.has(dateAndItem[1])){
			arrPos = PROD_POS[dateAndItem[1]];
			valToRemove = selectedMap.get(dateAndItem[1]);
			selectedMap.delete(dateAndItem[1]);
		}else{
			throw 'Selected item does not exist for this date'
		}
	}else{
		throw 'Selected date does not exist'
	}

	let n = Number.parseInt(valToRemove);
	let acc = dataForPie[arrPos];
	acc -= n;
	dataForPie.splice(arrPos,1,acc);



	// Actualizamos colección en el gráfico
	monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.values());
	monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
	monthlySalesChart.update();

	deptSalesChart.data.datasets[0].data = dataForPie;
	deptSalesChart.update();
	// Actualizasmos la vista
	initMonthlyTotalSales();
	drawSelectMontlySales();
 }
