"use strict";
const monthCtx = document.getElementById("monthlySales").getContext("2d");
const deptCtx = document.getElementById("deptSales").getContext("2d");
const yearlyLabel = document.getElementById("yearlyTotal");
const bSalesOver5000 = document.getElementById("bSalesOver5000");

const bReset = document.getElementById('bReset');
const newAmount = document.getElementById('itemAmount');
const newMonth = document.getElementById('monthId');
const bAddSaleModal = document.getElementById('bAddSaleModal');

// const monthlyLabelsSet = new Set();
// const monthlySalesArray = [];

const monthlySalesMap = new Map();
const newProduct = document.forms[0].inlineRadioOptions; //!!


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
		datasets: [],
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

function addYearlyTotal(a, b, c) {
	return a + b + c;
}

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

function findOver5000() {
	let position = -1;
	let quantity = monthSales.find((elem, index) => {
		if (elem > 5000) {
			position = index;
			return true;
		}
		return false;
	});
	alert("Cantidad: " + quantity + " Indice: " + position);
}


function getSalesMonths(){
	monthlySalesMap.forEach(function (amount, month){
	alert(month + ": " + amount);
	});
 }

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

let data = {
	label: '',
	data: [],
	backgroundColor: '',
	borderWidth: 0,
}
const dataCam = {...data};
const dataMob = {...data};
const dataLap = {...data};
const dataTab = {...data};

/**
 *
 * @param {Map} monthlySalesMap
 */
function cameraSales(monthlySalesMap) {
	let cameras = []
	for (const [key, val] of monthlySalesMap.entries()) {
		if(val.has('Camera')){
			cameras.push(val.get('Camera'))
		}
	}

	if(!dataCam.label.localeCompare('Camera')) dataCam.label = 'Camera';
	dataCam.data = cameras;
	dataCam.backgroundColor = 'rgba(238,184,104,1)';
	monthlySalesChart.data.datasets.push(dataCam);
}
/**
 *
 * @param {Map} monthlySalesMap
 */
 function mobileSales(monthlySalesMap) {
	let mobiles = []
	for (const [key, val] of monthlySalesMap.entries()) {
		if(val.has('Mobile')){
			mobiles.push(val.get('Mobile'))
		}
	}

	if(!dataMob.label.localeCompare('Mobile')) dataMob.label = 'Mobile';
	dataMob.data = mobiles;
	dataMob.backgroundColor = 'rgba(239,118,122,1)';
	monthlySalesChart.data.datasets.push(dataMob);
}
/**
 *
 * @param {Map} monthlySalesMap
 */
 function laptopSales(monthlySalesMap) {
	let laptops = []
	for (const [key, val] of monthlySalesMap.entries()) {
		if(val.has('Laptop')){
			laptops.push(val.get('Laptop'))
		}
	}

	if(!(dataLap.label.localeCompare('Laptop'))) dataLap.label = 'Laptop';
	dataLap.data = laptops;
	dataLap.backgroundColor = 'rgba(75,166,223,1)';
	monthlySalesChart.data.datasets.push(dataLap);
}
/**
 *
 * @param {Map} monthlySalesMap
 */
 function tabletSales(monthlySalesMap) {
	let tablets = []
	for (const [key, val] of monthlySalesMap.entries()) {
		if(val.has('Tablet')){
			tablets.push(val.get('Tablet'))
		}
	}

	if(!dataTab.label.localeCompare('Tablet')) dataTab.label = 'Tablet';
	dataTab.data = tablets;
	dataTab.backgroundColor = 'rgba(40,167,69,1)';
	monthlySalesChart.data.datasets.push(dataTab);
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
		//SI EL MAPA PADRE CONTIENE EL MES SELECCIONADO
		if (monthlySalesMap.has(newMonth.value)){
			itemsInMonth = monthlySalesMap.get(newMonth.value); //month contiene map del mes seleccionado
			if(itemsInMonth.has(product)){ //en caso de que tengamos un registro del item en ese mes
				let num = itemsInMonth.get(product); //sacamos el valor del item y lo actualizamos
				num += Number.parseInt(newAmount.value);
				itemsInMonth.set(product, num);
			}else{
				itemsInMonth.set(product, Number.parseInt(newAmount.value)); //si no añadimos el nuevo valor
			}
			monthlySalesMap.set(newMonth.value, itemsInMonth); //Acabado cualquiera de los 2 casos el mapa padre
																									//se actualiza retornando un mapa con valores correctos para el mes elegido
		}else{ //EN CASO DE QUE EL MAPA PADRE NO CONTENGA REGISTRO DEL MES SELECCIONADO
			itemsInMonth.set(product, Number.parseInt(newAmount.value)); //Generamos un mapa con el item y su valor
			monthlySalesMap.set(newMonth.value, itemsInMonth);//En el mapa padre creamos una entrada key mes val mapa de items
		}
		 //Recuento de totales
		 initMonthlyTotalSales();


		 cameraSales(monthlySalesMap);
		 mobileSales(monthlySalesMap);
		 laptopSales(monthlySalesMap);
		 tabletSales(monthlySalesMap);

		if(monthLabels.indexOf(parsedMonth!==-1)){
			monthLabels.push(parsedMonth);
		}
		monthlySalesChart.data.labels = monthLabels;







		let arrPos = PROD_POS[product];
		let n = Number.parseInt(newAmount.value);
		let acc = dataForPie[arrPos];
		acc += n;
		dataForPie.splice(arrPos,1,acc);


	deptSalesChart.data.datasets[0].data = dataForPie;



		monthlySalesChart.update();
		deptSalesChart.update();



			//  } catch (error){
			//  // Tratamiento de excepciones
			//  alert(error.message);
			//  } finally {
			//  // Reseteo de formulario
			//  cleanAddSaleForm();
			//  }
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
