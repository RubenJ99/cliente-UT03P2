let a = new Map();
let b = new Map();
b.set('Camera',1000);
b.set('Telefono',20);
a.set('October', new Map(b));
b.set('Laptop',100);
a.set('November', new Map(b));

let data = {
	label: '',
	data: [],
	backgroundColor: '',
	borderWidth: 0
 };

let x = Array.from(a.values());
let monthAndMap = Array.from(x.values());
monthAndMap.forEach(entry => {
	data.label = entry.
});

