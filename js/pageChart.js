//RUBEN JUAREZ PEREZ 2DAW
"use strict";
const monthCtx = document.getElementById("monthlySales").getContext("2d");
const deptCtx = document.getElementById("deptSales").getContext("2d");
const yearlyLabel = document.getElementById("yearlyTotal");
const bSalesOver5000 = document.getElementById("bSalesOver5000");

const bReset = document.getElementById('bReset');
const newAmount = document.getElementById('itemAmount');
const newMonth = document.getElementById('monthId');
const bAddSaleModal = document.getElementById('bAddSaleModal');
const bCloseAdd = document.getElementById('bCloseAdd');

const monthlySalesMap = new Map(); //Mapa padre con todos los meses y los mapas asociados
const newProduct = document.forms[0].inlineRadioOptions; //Con esta constante almacenamos las opciones de los radio al añadir


const dataForPie = [0,0,0,0]; //Uso este array para almacenar los totales de cada item y lo inicializo a 0 porque sino me daba problemas
//de representacion




let deptLabels = ["Camera","Mobile","Laptop","Tablet"]; //Los nombres de los departamentos inicializados para nuestra pie chart
let yearlyTotal = 0; //Total anual

//DEFINICION DE CHART
/**
 * La implementacion de esta chart es tal que asi:
 * los meses van en un array que se va generando a demanda del usuario, es decir, no metemos los 12 meses a piñon
 * despues tenemos 4 datasets que son los item que vendemos en nuestra tienda los cuales tienen un array data que esta vacio de base
 * ya que no tenemos datos al principio, este se ira actualizando metiendo datos a demanda, para solucionar problemas de render
 * a medida que uno de los array data crece los otros tambien lo hacen poniendo 0 en sus posiciones mensuales si no tiene datos,
 * luego si se decide añadir datos a posteriori ese 0 se actualiza por el dato nuevo como se podra ver en addSale()
 */
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
/**
 * La implementacion de esta chart es tal que asi:
 * En esta chart colocamos ya las label que son nuestros items, por defecto, y solo trabajamos con la primera posicion del array datasets
 * el cual contiene otro array de datos que tendra 4 posiciones, 1 por cada item que vendemos estos valores se iran acumulando y mostrando
 * como un total anual de ventas de cada item
 */
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
/**
 *Esta funcion toma todos los valores de ventas y las acumula mostrando el total de $ ganados en este año
 */
function initMonthlyTotalSales(){
	let items = Array.from(monthlySalesMap.values()); //Obtenemos los mapas de items en modo array
	let aux;
	let acc = 0;
	//Con este foreach recorremos el array que contiene el mapa item -> value
	items.forEach(item => { //ayudado de una variable aux sacamos los value del map itm -> val y realizamos un reduce obtendremos el total
	//de ventas de el mapa x y lo guardamos en el acumulador, se repetira las veces que haga falta, una vez terminado  se muestra el acumulador
		aux = Array.from(item.values()).reduce((count, value) => {
			return count + value;
			}, 0);
		acc += aux;
	});
	yearlyLabel.innerHTML = acc + "€";
}

initMonthlyTotalSales();


/**
 * Esta funcion simplemente resetea los valores de los graficos y la cuenta anual cuando le das al boton de reset,
 * usando los metodos disponibles de las chart y vaciando el mapa de meses de sus valores
 */
function resetMonthlySales(){
	monthlySalesMap.clear();
	monthlySalesChart.reset();
	monthlySalesChart.render();
	deptSalesChart.reset();
	deptSalesChart.render();
	initMonthlyTotalSales();
 }

 //Uso este objeto literal para no tener que realizar un switch, me parece que hacerlo de esta manera es mas rapido,comodo y facil
 //de mantener
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

/**
 *
 * @param {*} date una fecha en formato año-mes, luego se comprueba si este se encuentra en el array sino lanza error
 * @returns String
 */
function parseMonth(date) {
	if(typeof(PARSED_MONTHS[date]) === 'undefined') throw 'Invalid date';
	return PARSED_MONTHS[date];
}
//Misma funcionalidad que PARSED_MONTHS pero para los value recogidos de los radiobuttons
const PRODS = {
	option1: 'Camera',
	option2: 'Mobile',
	option3: 'Laptop',
	option4: 'Tablet',
}
/**
 *
 * @param {*} radio el value recogido de los radio buttons al crear una nueva venta, se comprueba en el literal PRODS y si no se encuentra
 * lanza una excepcion
 * @returns String
 */
function parseProd(radio) {
	if(typeof(PRODS[radio]) === 'undefined') throw 'Invalid item';
	return PRODS[radio];
}
//Uso este literal en el codigo interno para saber cual es la posicion que deben de tomar los valores en relacion al item que pertenezcan
const PROD_POS = {
	Camera: 0,
	Mobile: 1,
	Laptop: 2,
	Tablet: 3,
}
/**
 * Breve explicacion de como funciona todo aqui(no soy el mejor explicandose):
 *
 * Despues de comprobar que los valores introducidos por el usuarios son validos
 * Empiezan las comprobaciones para saber que hacer con los datos dentro de los mapas y como generar valores para las chart
 *
 * - Si ya tenemos registro del mes
 * 	+ comprobamos si tambien tenemos registro del item en el mes, es decir actualizamos valor
 * 		* En este caso sacamos el valor asociado al producto y usando un acumulador sumamos el nuevo valor al anterior
 * 		ademas almacenamos el valor antiguo para ir al array de datos de nuestra barChart y recorrerla y actualizar el valor antiguo
 * 		con el nuevo
 * 	+ si no tenemos registro del item en el mes
 * 		* añadimos el producto y su valor al mapa asociado al mes. Para la barChart buscamos el label que contenga el producto
 * 		y editamos el valor asociado a la posicion del mes en el array meses con la nueva amount, esto es porque por defecto
 *		cuando metemos un valor nuevo, los otros productos obtienen 0 para que el array de datos de la chart tenga consistencia
 			entonces tenemos que editar el 0 no meter un nuevo valor
	- Si no tenemos registro del mes
		+ Metemos el mes en el mapa de meses y generamos un mapa que meteremos como value de este mes con el nombre del producto y su value
		 para nuestra barChart encontramos el producto y hacemos push al array del nuevo valor, a todos los otros items se les hace push de 0
		 de tal manera que si queremos añadir un valor a un mes ya añadido previamente  se editara como se ha explicado antes


	En relacion al pieChart despues de todo esto obtenemos la posicion del producto de forma relativa al array de productos,
	usando un acumulador añadimos el nuevo valor a su posicion del array de totales mensuales por item y retornamos todo el array
	a la posicion 0 del dataset, que es el objeto que estamos usando para representar datos
 */
function addSale(){
try {
	if(newProduct.value.length === 0) throw 'Please select a product before adding it';
	if(newMonth.value.length === 0) throw 'Please select a date before adding a product';
	if(Number.parseInt(newAmount.value) < 0 || Number.isNaN(Number.parseInt(newAmount.value))) throw 'Please insert a valid amount';

	let product = parseProd(newProduct.value);
	let itemsInMonth = new Map();

	let months = Array.from(monthlySalesMap.keys()).map(elem => parseMonth(elem));

		//SI EL MAPA PADRE CONTIENE EL MES SELECCIONADO
		if (monthlySalesMap.has(newMonth.value)){
			itemsInMonth = monthlySalesMap.get(newMonth.value); //month contiene map del mes seleccionado
			if(itemsInMonth.has(product)){ //en caso de que tengamos un registro del item en ese mes
				let num = itemsInMonth.get(product); //sacamos el valor del item y lo actualizamos
				let oldNum = num;
				num += Number.parseInt(newAmount.value);
				itemsInMonth.set(product, num);

				monthlySalesChart.data.datasets.forEach(dataSet => { //dataSet son los objetos referencia a item
					if(dataSet.label === product){ //encontrado el que contiene el item que queremos realizamos la operacion, en este caso de actualizacion
						let indx = dataSet.data.indexOf(oldNum); //como ya tenemos un valor asi pues obtenemos la index de este para su edicion
						dataSet.data.splice(indx,1,num);//el 1 en splice sustituye el valor en vez de insertar y mover como hace el 0
					}
				});
			}else{
				itemsInMonth.set(product, Number.parseInt(newAmount.value)); //si no añadimos el nuevo valor
				monthlySalesChart.data.datasets.forEach(dataSet => {
					if(dataSet.label === product){
						let i = months.indexOf(parseMonth(newMonth.value)); //Lo explicado arriba
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
		monthlySalesChart.data.labels = months; //Pasa los meses como array

		let arrPos = PROD_POS[product]; //obtenemos pos del producto en el array
		let n = Number.parseInt(newAmount.value);
		let acc = dataForPie[arrPos];
		acc += n;
		dataForPie.splice(arrPos,1,acc); //como dataForPie es un array editamos su valor previo con el splice
		deptSalesChart.data.datasets[0].data = dataForPie; //retornamos todos los datos de nuevo no solo el editado


		//Recuento de totales
		initMonthlyTotalSales();
		monthlySalesChart.update();
		deptSalesChart.update();

} catch (error) {
	console.error(error);
	alert(error);
}finally{
	cleanAddSaleForm();
}
}
/**
 * Resetea los valores del modal para añadir valores
 */
function cleanAddSaleForm(){
	newMonth.value = "";
	newAmount.value = "";
}
bCloseAdd.addEventListener('click',cleanAddSaleForm);

/**
 * Usando JQuery mostramos los registros de datos que tenemos en el modal de eliminar.
 * Quizas un doble forof no es lo mejor pero no se me ocurrio otra cosa en ese momento
 */
function drawSelectMontlySales(){
	// Seleccionamos elemento usando id con jQuery
	let removeSales = $("#removeSales");
	// Eliminamos option del select.
	removeSales.empty();
	for (let [month, itemMap] of monthlySalesMap.entries()){
		for (let[item, value] of itemMap.entries()) {
			let opt = $("<option>").val(month+"/"+item).text(month + " -> " + item + " : " + value); //como valor paso mes/item para luego usarlo en operaciones de borrado
			removeSales.append(opt);
		}
	}
 }

/**
 * Funciona tal que asi:
 *
 * partimos el valor de removeSales en 2 usando la / que tenia de forma que tenemos un array de 2 posiciones en 0 el mes y en 1 el item
 * bien, comprobamos si tenemos registro del mes seleccionado, si es asi obtenemos el mapa asociado al mes que queremos eliminar,
 * obtenemos la posicion el item en el array labels de la pieChart, obtenemos el valor que vamos a eliminar y luego lo borramos de su map
 * para la barChart encontramos la posicion en el array del mes y desenrollamos los datasets como en addSale, cuando encontramos
 * el dataset que coincida con el item que vamos a borrar lo que hacemos es editar su posicion el el array de valores con 0 para que
 * deje de mostrarse la barra en el grafico y siga teniendo consistencia
 *
 *
 * De vuelta a la pieChart teniendo el valor a eliminar, encontramos la posicion del item en relacion al array y sobre el acumulador
 * al valor total le restamos el valor a eliminar, despues editamos la posicion requerida con el nuevo valor
 *
 * para terminar actualizamos las chart para que muestren correctamente los valores nuevos
 */
function removeMonthlySale(){
	let removeSales = document.getElementById("removeSales");
	let dateAndItem = removeSales.value.split("/");
	let valToRemove;
	let arrPos;
	if(monthlySalesMap.has(dateAndItem[0])){
		let selectedMap = monthlySalesMap.get(dateAndItem[0]); //mapa del mes requerido
		if(selectedMap.has(dateAndItem[1])){
			arrPos = PROD_POS[dateAndItem[1]];
			valToRemove = selectedMap.get(dateAndItem[1]);
			selectedMap.delete(dateAndItem[1]); //borramos el valor asociado al item en su mapa

			let indx = monthlySalesChart.data.labels.indexOf(parseMonth(dateAndItem[0]));
			monthlySalesChart.data.datasets.forEach(dataSet => { //recorriendo todo el array seleccionamos el item a modificar y cambiamos a 0
				if(dataSet.label === dateAndItem[1]){
					dataSet.data.splice(indx,1,0);
				}
			});

			let n = Number.parseInt(valToRemove);
			let acc = dataForPie[arrPos];
			acc -= n; //restamos el valToRemove al total y actualizamos con splice sobre la posicion del item en el array
			dataForPie.splice(arrPos,1,acc);
		}else{
			throw 'Selected item does not exist for this date'
		}
	}else{
		throw 'Selected date does not exist'
	}

	// Actualizamos colección en el gráfico

	monthlySalesChart.update();

	deptSalesChart.data.datasets[0].data = dataForPie;
	deptSalesChart.update();
	// Actualizasmos la vista
	initMonthlyTotalSales();
	drawSelectMontlySales();
 }
