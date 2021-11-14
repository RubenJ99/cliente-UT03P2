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




let monthSales = Array.of(6500, 3250, 4000); //cambiar para practica con los mapitas
let monthLabels = Array.of("Octubre", "Noviembre", "Diciembre");
let deptSales = Array.of(12, 9, 7, 3);
let deptLabels = Array.of("Cámara", "Móvil", "Portátil", "Tablet");
let yearlyTotal = 0;

//DEFINICION DE CHART
let monthlySalesChart = new Chart(monthCtx, {
	type: "bar",
	data: {
		labels: [],
		datasets: [{
			label: 'Camaras',
			data: monthlySalesCamera,
			backgroundColor: 'rgba(238,184,104,1)',
			borderWidth: 0,
			},
			{
				label: 'Portatiles',
				data: monthlySalesLaptop,
				backgroundColor: 'rgba(75,166,223,1)',
				borderWidth: 0,
			},
			{
				label: 'Telefonos',
				data: monthlySalesPhone,
				backgroundColor: 'rgba(239,118,122,1)',
				borderWidth: 0,
			},
			{
				label: 'Tablets',
				data: monthlySalesTablet,
				backgroundColor: 'rgba(40,167,69,1)',
				borderWidth: 0,
			},
		],
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
	data: {
		labels: [],
		datasets: [
			{
				label: "Número de ventas",
				data: [],
				backgroundColor: [
					"rgba(238, 184, 104, 1)",
					"rgba(75, 166, 223, 1)",
					"rgba(239, 118, 122, 1)",
					"rgba(40, 167, 69, 1)",
				],
				borderWidth: 0,
			},
		],
	},
	options: {},
});

function addYearlyTotal(a, b, c) {
	return a + b + c;
}

function initMonthlyTotalSales(){
	yearlyLabel.innerHTML = Array.from(monthlySalesMap.values()).reduce(
		function (count, value){
		return count + value;
		}, 0) + "€";
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
bSalesOver5000.addEventListener("click", findOver5000);

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


bReset.addEventListener('click',resetMonthlySales);

//Añadir ventas al gráfico //MODIFICAR PRACTICA CASI SEGURO
function addSale(){
	let itemsInMonth = new Map();
		//SI EL MAPA PADRE CONTIENE EL MES SELECCIONADO
		if (monthlySalesMap.has(newMonth.value)){
			itemsInMonth = monthlySalesMap.get(newMonth.value); //month contiene map del mes seleccionado
			if(itemsInMonth.has(newProduct.value)){ //en caso de que tengamos un registro del item en ese mes
				let num = itemsInMonth.get(newProduct.value); //sacamos el valor del item y lo actualizamos
				num += Number.parseInt(newAmount.value);
				itemsInMonth.set(newProduct.value, num);
			}else{
				itemsInMonth.set(newProduct.value, Number.parseInt(newAmount.value)); //si no añadimos el nuevo valor
			}
			monthlySalesMap.set(newMonth.value, itemsInMonth); //Acabado cualquiera de los 2 casos el mapa padre
																									//se actualiza retornando un mapa con valores correctos para el mes elegido
		}else{ //EN CASO DE QUE EL MAPA PADRE NO CONTENGA REGISTRO DEL MES SELECCIONADO
			itemsInMonth.set(newProduct.value, Number.parseInt(newAmount.value)); //Generamos un mapa con el item y su valor
			monthlySalesMap.set(newMonth.value, itemsInMonth);//En el mapa padre creamos una entrada key mes val mapa de items
		}
		 //Recuento de totales
		 initMonthlyTotalSales();
		 monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.
			values());
			 monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
			 monthlySalesChart.update();



			//  } catch (error){
			//  // Tratamiento de excepciones
			//  alert(error.message);
			//  } finally {
			//  // Reseteo de formulario
			//  cleanAddSaleForm();
			//  }

		 }

bAddSaleModal.addEventListener('click',addSale);

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
	for (let [month, amount] of monthlySalesMap.entries()){
	// Creamos elemento option con jQuery
	let opt = $("<option>").val(month).text(month + ": " + amount);
	// Añadimos elemento al select.
	removeSales.append(opt);
	}
 }

 // Borrar meses de la colección
function removeMonthlySale(){
	let removeSales = document.getElementById("removeSales");
	// Borramos de la colección la venta.
	monthlySalesMap.delete(removeSales.value);
	// Actualizamos colección en el gráfico
	monthlySalesChart.data.datasets[0].data = Array.from(monthlySalesMap.values());
	monthlySalesChart.data.labels = Array.from(monthlySalesMap.keys());
	monthlySalesChart.update();
	// Actualizasmos la vista
	initMonthlyTotalSales();
	drawSelectMontlySales();
 }