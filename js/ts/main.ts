/* Variables globales */
	/* Eléments de la modale */
const myModal = document.getElementById('myModal');
const modalContent = document.getElementById('modalContent');
const modalHeader = document.querySelector('.modal-header');
const modalBody = document.querySelector('.modal-body');
const modalFooter = document.querySelector('.modal-footer');

const titreH1 = document.querySelector('.container header h1');

const modalAlerte = document.querySelector('.modalAlerte');

const btnAddItem = document.getElementById('add_item'); // Bouton d'ajout d'un item
const todo = document.getElementById('todo'); // Div englobant le tableau

	/* Eléments réglages */
const btn_reglages = document.getElementById('btn_reglages');
const panel = document.getElementById('reglages');
const fond = document.getElementById('fond');
const set_categories = document.getElementById('set_categories');
const set_stats = document.getElementById('set_stats');

	/* Eléments Popoup */
let popup = document.getElementById('popup');
let popupHeader = document.querySelector('#popup header');
let popupSection = document.querySelector('#popup section');
let popupFooter = document.querySelector('#popup footer');

const badges = document.querySelectorAll('.badge');

let categories = JSON.parse(localStorage.getItem('categories')) || []; // Les catégories
const avancements: Array<string> = ['Projet', 'En cours', 'Avancé', 'En pause', 'Bloqué', 'Terminé']; // Avvancments possibles...
const labels: Array<string> = ['default', 'info', 'primary', 'warning', 'danger', 'success']; // ... et les labels qui vont avec

let actualCategorie: string;
let actualFilter: string;
let url = parseURLParams(window.location.href);
let listeCategories = JSON.parse(localStorage.getItem('categories'));
(typeof url !== 'undefined' && typeof url['c'] !== 'undefined') ? actualCategorie = categories[url['c']] : actualCategorie = 'Tous';
(typeof url !== 'undefined' && typeof url['f'] !== 'undefined') ? actualFilter = avancements[url['f']] : actualFilter = 'Aucun';

let categorieActuelle: string;
let items = JSON.parse(localStorage.getItem('items')) || []; // Les items
let titrePrincipal = localStorage.getItem('titre') || 'Cliquer pour ajouter un titre';

let countAv: Array<number> = [0,0,0,0,0,0];
for(let i=0; i<items.length; i++) {
	// console.log(JSON.parse(items[i]));
	for(let j=0; j<avancements.length; j++) {
		if(JSON.parse(items[i]).avancement === avancements[j]) countAv[j]++;
	}
}
console.log(countAv);


/* Récupération de l'URL pour récupérer les paramètres */
function parseURLParams(url) {
	let queryStart = url.indexOf("?") + 1,
		queryEnd   = url.indexOf("#") + 1 || url.length + 1,
		query = url.slice(queryStart, queryEnd - 1),
		pairs = query.replace(/\+/g, " ").split("&"),
		parms = {}, i, n, v, nv;
	if (query === url || query === "") return;
	for (i = 0; i < pairs.length; i++) {
		nv = pairs[i].split("=", 2);
		n = decodeURIComponent(nv[0]);
		v = decodeURIComponent(nv[1]);

		if (!parms.hasOwnProperty(n)) parms[n] = [];
		parms[n].push(nv.length === 2 ? v : null);
	}
	return parms;
}

/* Formatage de la date */
function formatedDate(date): string {
	let dd = date.getDate();
	let mm = date.getMonth() + 1; // Bien penser au +1 car Janvier est en 0
	let yyyy = date.getFullYear();
	if(dd < 10) {
		dd = '0' + dd;
	} 
	if(mm < 10) {
		mm = '0' + mm;
	} 
	let today = dd + '/' + mm + '/' + yyyy;
	return today;
}

/* Création d'un item dans la todo */
class Item {
	categorie: string;
	titre: string;
	description: string;
	date: string;
	avancement: string;
	label: string;
	
	constructor(categorie: string, titre: string, description: string, avancement: string) {
		this.categorie = categorie;
		this.titre = titre;
		this.description = description;
		this.avancement = avancement;
	}
	addToTab(): void {
		var cat = this.categorie;
			cat = cat.slice(0, cat.indexOf('#'));
		var av = this.avancement;
		var limiteur = av.indexOf("#");
		var avance = av.slice(0, limiteur);
		var lab = av.slice(limiteur+1, av.length);
		console.log(avance + ' - ' + lab);
		let item = {
			titre: this.titre,
			categorie: cat,
			description: this.description,
			date: formatedDate(new Date()),
			avancement: avance,
			label: lab
		};
		let stringItem: string = JSON.stringify(item);
			items.push(stringItem);
		localStorage.setItem('items', JSON.stringify(items));
		location.reload();
	}
}

function removeItem(i) {
	let item: string = items[i];
	items.splice(i, 1);
	localStorage.setItem('items', JSON.stringify(items));
	location.reload();
}

/* Création d'une catégorie */
class MenuItem {
	name: string;
	
	constructor(name: string) {
		this.name = name;
	}
	
	addMenuItem(): void {
		console.log(`On ajoute ${this.name} au menu`);
		categories.push(this.name);
		localStorage.setItem('categories', JSON.stringify(categories));
		location.reload();
	}
}

/* Interface : Values pour paramétrer la modale, des boutons, des inputs, selects (options) */
interface ValuesModale {
	type: string;
	titre: string; 
	description?: string;
	buttons: Button;
	inputs?: Input;
	selects?: Select;
	callback?: Function;
}

interface Button {
	names: Array<string>;
	type: Array<string>;
	event: Array<string>;
}

interface Input {
	elements: number;
	icons: Array<string>;
	placeholders?: Array<string>;
	values?: Array<string>;
}

interface Select {
	elements: number;
	style: string;
	options: Option;
}

interface Option {
	values: Array<Array<string>>;
}

/* Classe création d'une modale */
class Modale {
	values: ValuesModale;
	
	constructor(values: ValuesModale) {
		this.values = values;
	}
	
	showModale() {
		//On efface les précédentes données
		modalBody.innerHTML = '';
		modalFooter.innerHTML = '';
		let data = this.values;
		myModal.style.display = 'flex';
		modalHeader.lastElementChild.innerHTML = data.titre;
		if(data.description) {
			let p = document.createElement('p');
				p.innerHTML = data.description;
			modalBody.appendChild(p);
		}
		if(data.inputs) {
			// On créer la div "form"
			let formDiv = document.createElement('div');
				formDiv.className = 'form-group';
			// On créer les inputs
			for(let i=0; i<data.inputs.elements; i++) {
				let inputGroup = document.createElement('div');
					inputGroup.className = 'input-group';
				let label = document.createElement('label');
					label.className = 'input-group-addon';
					label.htmlFor = 'modaleInput_' + i;
				let icon = document.createElement('i');
					icon.className = 'glyphicon glyphicon-' + data.inputs.icons[i];
				label.appendChild(icon);
				inputGroup.appendChild(label);
				let input = document.createElement('input');
					input.type = 'text',
					input.id = 'modaleInput_' + i;
					input.placeholder = data.inputs.placeholders[i];
					input.className = 'form-control';
					input.value = data.inputs.values[i];
				inputGroup.appendChild(input);
				formDiv.appendChild(inputGroup);
			}
			modalBody.appendChild(formDiv);
		}
		
		if(data.selects) {
			// On créer la div englobant la ou les selects suivant le style défini
			let div = document.createElement('div');
				div.style.display = data.selects.style;
			// On créer les selects
			for(let i=0; i<data.selects.elements; i++) {
				let select = document.createElement('select');
					select.className = 'form-control';
				// console.log(data.selects.options.values[i]);
				for(let j=0; j<data.selects.options.values[i].length; j++) {
					// console.log(data.selects.options.values[i][j]);
					let option = document.createElement('option');
						option.value = data.selects.options.values[i][j] + '#' + labels[j];
						option.innerHTML = data.selects.options.values[i][j];
					select.appendChild(option);
				}
				div.appendChild(select);
			}
			modalBody.appendChild(div);
		}
		
		for(let i=0; i<data.buttons.names.length; i++) {
			let button = document.createElement('button');
				button.innerHTML = data.buttons.names[i];
				button.className = 'btn btn-' + data.buttons.type[i];
				button.addEventListener('click', () => {
					let inputsValues = [];
					let selectsValues = [];
					let inputs = document.querySelectorAll('.modal-body .form-group input[type="text"].form-control');
					let selects = document.querySelectorAll('.modal-body select');
					for(let j=0; j<inputs.length; j++) {
						inputsValues.push(inputs[j]['value']);
					}
					for(let j=0; j<selects.length; j++) {
						selectsValues.push(selects[j]['value']);
					}
					let values = [inputsValues, selectsValues];
					// console.log(inputsValues);
					modalEvent(data.buttons.event[i], values);
				});
			modalFooter.appendChild(button);
		}
	}
}

interface ValuesPopup {
	type: string; //liste, input
	titre: string;
	positions: number[]; //valeurs x et y à partir de l'élément
	id?: number; //id de l'item ou catégorie à modifier
	actuel: string;
}

class Popup {
	values: ValuesPopup;
	
	constructor(values: ValuesPopup) {
		this.values = values;
	}
	
	showPopup(): void {
		let data = this.values;
		popup.style.display = 'block';
		popup.style.left = data.positions[0] + 'px';
		popup.style.top = data.positions[1] + 'px';
		data.titre === 'Description' ? popup.style.width = '450px' : popup.style.width = '300px';
		// Le titre
		popupHeader.lastElementChild.innerHTML = data.titre;
		let actuel = data.actuel;
		let div = popupSection.firstElementChild;
			div.innerHTML = '';
		// console.log(div);
		switch(data.type) {
			case 'liste':
				let moment: Array<string>;
				data.titre === 'Avancement' ? moment = avancements : moment = categories;
				div.innerHTML = '';
				div.className = 'list-group';
				for(let i=0; i<moment.length; i++) {
					if(moment[i] == actuel) {
						let active = document.createElement('a');
							active.className = 'list-group-item active';
							active.href = '#';
							active.innerHTML = moment[i];
							active.addEventListener('click', (e) => {
								e.preventDefault();
								popup.style.display = 'none';
							});
						div.appendChild(active);
					}
					else {
						let choices = document.createElement('a');
							choices.className = 'list-group-item';
							choices.href = '#' + i;
							choices.innerHTML = moment[i];
							choices.addEventListener('click', (e) => {
								e.preventDefault();
								this.saveItem(data.id, e.target.toString(), data.titre);
							});
						div.appendChild(choices);
					}
				}
				popupFooter.innerHTML = '';
				let buttonCancel = document.createElement('button');
					buttonCancel.className = 'btn btn-default';
					buttonCancel.innerHTML = 'Annuler';
					buttonCancel.addEventListener('click', () => {
						this.closePopup();
					});
				popupFooter.appendChild(buttonCancel);
			break;
			case 'filtre':
				div.className = 'list-group';
				let actualURL = location.href;
				console.log(actualURL);
				let c:number = categories.indexOf(actualCategorie);
				let f: number = avancements.indexOf(actualFilter);
				console.log(typeof c + ' - ' + f);
				let index_html: string = 'index.html';
				let index_html_c: string = 'index.html?c=' + c;
				let index_html_f: string = 'index.html?f=';
				let index_html_c_f: string = 'index.html?c=' + c + '&f=';
				
				let noFilter = document.createElement('a');
					c ===  -1 ? noFilter.href = index_html : noFilter.href = index_html_c;
					actualFilter === 'Aucun' ? noFilter.className = 'active list-group-item' : noFilter.className = 'list-group-item';
					noFilter.innerHTML = 'Aucun';
				let bulletNoFilter = document.createElement('i');
					bulletNoFilter.className = 'glyphicon glyphicon-ban-circle';
				noFilter.appendChild(bulletNoFilter);
				div.appendChild(noFilter);
				for(let i=0; i<avancements.length; i++) {
					if(actualFilter === avancements[i]) {
						let a = document.createElement('a');
							a.href = '#';
							a.className = 'active list-group-item';
							a.innerHTML = avancements[i];
							a.addEventListener('click', (e) => {
								e.preventDefault();
								this.closePopup();
							});
						let bullet = document.createElement('i');
							bullet.className = 'label label-' + labels[i];
							bullet.innerHTML = ' ';
						a.appendChild(bullet);
						div.appendChild(a);
					}
					else {
						let a = document.createElement('a');
						(c === -1 && f === -1 || c === -1 && f !== -1) ? a.href = index_html_f + i : a.href = index_html_c_f + i;
							a.className = 'list-group-item';
							a.innerHTML = avancements[i];
						let bullet = document.createElement('i');
							bullet.className = 'label label-' + labels[i];
							bullet.innerHTML = ' ';
						a.appendChild(bullet);
						div.appendChild(a);
					}
				}
				popupFooter.innerHTML = '';
				let cancelFiltre = document.createElement('button');
					cancelFiltre.className = 'btn btn-default';
					cancelFiltre.innerHTML = 'Annuler';
					cancelFiltre.addEventListener('click', () => {
						this.closePopup();
					});
				popupFooter.appendChild(cancelFiltre);
			break;
			case 'input':				
				div.innerHTML = '';
				div.className = 'input-group';
				let label = document.createElement('label');
					label.className = 'input-group-addon';
					label.htmlFor = 'popupInput_' + data.id;
				let icon = document.createElement('i');
					icon.className = 'glyphicon glyphicon-edit';
				let input = document.createElement('input');
				label.appendChild(icon);
				div.appendChild(label);
					input.value = actuel;
					input.id = 'popupInput_' + data.id;
					input.className = 'form-control';
				div.appendChild(input);
				input.focus();
				popupFooter.innerHTML = '';
				let buttonCancel2 = document.createElement('button');
					buttonCancel2.className = 'btn btn-default';
					buttonCancel2.innerHTML = 'Annuler';
					buttonCancel2.addEventListener('click', () => {
						this.closePopup();
					});
				popupFooter.appendChild(buttonCancel2);
				let buttonEdit = document.createElement('button');
					buttonEdit.className = 'btn btn-primary';
					buttonEdit.innerHTML = 'Modifier';
					buttonEdit.addEventListener('click', () => {
						this.saveItem(data.id, input.value, data.titre);
					});
				popupFooter.insertBefore(buttonEdit, popupFooter.firstElementChild);
			break;
		}
	}
	saveItem(id: number, value: string, partie: string) {
		let aModifier = JSON.parse(items[id]);
		switch(partie) {
			case 'Avancement':
				let avanceId = value.slice(value.indexOf('#')+1, value.length);
				aModifier.avancement = avancements[avanceId];
				aModifier.label = labels[avanceId];
				items[id] = JSON.stringify(aModifier);
				localStorage.setItem('items', JSON.stringify(items));
				location.reload();
			break;
			case 'Titre':
				aModifier.titre = value;
				items[id] = JSON.stringify(aModifier);
				localStorage.setItem('items', JSON.stringify(items));
				location.reload();
			break;
			case 'Description':
				aModifier.description = value;
				items[id] = JSON.stringify(aModifier);
				localStorage.setItem('items', JSON.stringify(items));
				location.reload();
			break;
			case 'Categorie':
				let catId = value.slice(value.indexOf('#')+1, value.length);
				aModifier.categorie = categories[catId];
				items[id] = JSON.stringify(aModifier);
				localStorage.setItem('items', JSON.stringify(items));
				location.reload();
			break;
		}
	}
	closePopup(): void {
		popup.style.display = 'none';
	}
}

function editItem(elem, id, partie) {
	let node = elem.nodeName;
	let plusY: number;
	let moinsX: number;
	node === 'TD' ? plusY = -5 : plusY = 5;
	partie === 'Description' ? moinsX = 225 : moinsX = 150;
	let rect = elem.getBoundingClientRect();
	let y: number = rect.top + window.scrollY + elem.offsetHeight + plusY;
	let x: number = rect.left + elem.offsetWidth/2 - moinsX;
	let typeAffichage: string;
	if(partie === 'Titre' || partie === 'Description') typeAffichage = 'input';
	else typeAffichage = 'liste';
	const popupOptions = {
		type: typeAffichage,
		titre: partie,
		positions: [x, y],
		id: id,
		actuel: elem.innerHTML
	};
	
	let newPopup = new Popup(popupOptions);
		newPopup.showPopup();
}

/* Initialisation de l'application */
(function init() {
	console.log(actualCategorie);
	console.log(actualFilter);
	if(actualCategorie === undefined) window.location.href = 'index.html';
	if(actualFilter === undefined) window.location.href = 'index.html';
	if(typeof Storage === 'undefined') {
		alert(`Arf, dommage ! - Votre navigateur n'offre pas la possibilité de sauvegarder des données !`);
		return false;
	}
	titreH1.innerHTML = titrePrincipal;
	if(localStorage.getItem('categories') !== null) {
		// console.log(actualCategorie);
		// On construit le menu principal
		let count: Array<number> = [0,0,0,0,0,0,0,0,0,0]; // Nombre d'items par catégories
		let tous = items.length;
		badges[0].innerHTML = tous;
		for(let i=0; i<items.length; i++) {
			for(let j=0; j<categories.length; j++) {
				if(JSON.parse(items[i]).categorie == categories[j]) {
					count[j]++;
				}
			}
		}
		// console.log(count);
		for(let i=0; i<categories.length; i++) {
			let li = document.createElement('li');
			let a = document.createElement('a');
			let span = document.createElement('span');
				span.innerHTML = count[i].toString();
				span.className = 'badge';
				a.innerHTML = categories[i];
				a.href = '?c=' + i;
			a.appendChild(span);
			li.appendChild(a);
			document.querySelector('.nav-pills').insertBefore(li, document.querySelector('.nav-pills').lastElementChild);
		}
		const mainLinks = document.querySelectorAll('.nav-pills li a');
		for(let i=0; i<mainLinks.length; i++) {
			if(mainLinks[i].firstChild['data'] == actualCategorie) {
				mainLinks[i].parentNode['classList'].add('active');
			}
		}
		// Le tableau dépend de l'url (partie chosie)
		// Créer le tableau, mais vide (table tag, tr et th tags)
		let table = document.createElement('table');
			table.className = 'table table-striped table-hover';
		//On créer la première ligne
		let thead = document.createElement('thead');
		let tr = document.createElement('tr');
			tr.innerHTML = `
					<th></th>
					<th>Catégorie</th>
					<th>Titre</th>
					<th>Description</th>
					<th>Date d'idée</th>
					<th onclick="sortAvancement(this, '${actualCategorie}');" title="Filtrer">Avancement <i class="glyphicon glyphicon-filter"></i></th>
				  `;
		thead.appendChild(tr);
		table.appendChild(thead);
		todo.appendChild(table);
		let tbody = document.createElement('tbody');
		if(actualCategorie == 'Tous') {
			// console.log('Premier cas');
			for(let i=0; i<items.length; i++) {
				let label = JSON.parse(items[i]).label;
				let tr = document.createElement('tr');
				if(actualFilter === 'Aucun') {
										tr.innerHTML = `
									<td><span class="close" title="Supprimer" onclick="removeItem(${i});">&times;</span></td>
									<td ondblclick="editItem(this, ${i}, 'Categorie');">${JSON.parse(items[i]).categorie}</td>
									<td ondblclick="editItem(this, ${i}, 'Titre');">${JSON.parse(items[i]).titre}</td>
									<td ondblclick="editItem(this, ${i}, 'Description');">${JSON.parse(items[i]).description}</td>
									<td>${JSON.parse(items[i]).date}</td>
									<td><span class="label label-${label}" onclick="editItem(this, ${i}, 'Avancement');">${JSON.parse(items[i]).avancement}</span></td>
								   `;
					tbody.appendChild(tr);
					table.appendChild(tbody);
				// console.log(JSON.parse(liste[i]));
				}
				if(JSON.parse(items[i]).avancement === actualFilter) {
					tr.innerHTML = `
									<td><span class="close" title="Supprimer" onclick="removeItem(${i});">&times;</span></td>
									<td ondblclick="editItem(this, ${i}, 'Categorie');">${JSON.parse(items[i]).categorie}</td>
									<td ondblclick="editItem(this, ${i}, 'Titre');">${JSON.parse(items[i]).titre}</td>
									<td ondblclick="editItem(this, ${i}, 'Description');">${JSON.parse(items[i]).description}</td>
									<td>${JSON.parse(items[i]).date}</td>
									<td><span class="label label-${label}" onclick="editItem(this, ${i}, 'Avancement');">${JSON.parse(items[i]).avancement}</span></td>
								   `;
					tbody.appendChild(tr);
					table.appendChild(tbody);
				// console.log(JSON.parse(liste[i]));
				}
			}
		}
		else { //Ca se complique !
			for(let i=0; i<items.length; i++) {
				if(JSON.parse(items[i]).categorie == actualCategorie) {
					let label = JSON.parse(items[i]).label;
					let tr = document.createElement('tr');
					if(actualFilter === 'Aucun') {
										tr.innerHTML = `
									<td><span class="close" title="Supprimer" onclick="removeItem(${i});">&times;</span></td>
									<td ondblclick="editItem(this, ${i}, 'Categorie');">${JSON.parse(items[i]).categorie}</td>
									<td ondblclick="editItem(this, ${i}, 'Titre');">${JSON.parse(items[i]).titre}</td>
									<td ondblclick="editItem(this, ${i}, 'Description');">${JSON.parse(items[i]).description}</td>
									<td>${JSON.parse(items[i]).date}</td>
									<td><span class="label label-${label}" onclick="editItem(this, ${i}, 'Avancement');">${JSON.parse(items[i]).avancement}</span></td>
								   `;
					tbody.appendChild(tr);
					table.appendChild(tbody);
				// console.log(JSON.parse(liste[i]));
					}
					if(JSON.parse(items[i]).avancement === actualFilter) {
					// console.log(JSON.parse(items[i]).titre);
						tr.innerHTML = `
										<td><span class="close" title="Supprimer" onclick="removeItem(${i});">&times;</span></td>
										<td ondblclick="editItem(this, ${i}, 'Categorie');">${JSON.parse(items[i]).categorie}</td>
										<td ondblclick="editItem(this, ${i}, 'Titre');">${JSON.parse(items[i]).titre}</td>
										<td ondblclick="editItem(this, ${i}, 'Description');">${JSON.parse(items[i]).description}</td>
										<td>${JSON.parse(items[i]).date}</td>
										<td><span class="label label-${label}" onclick="editItem(this, ${i}, 'Avancement');">${JSON.parse(items[i]).avancement}</span></td>
									   `;
					tbody.appendChild(tr);
					table.appendChild(tbody);
					}
				}
			}
		}
		/* Initialisation du paneau des réglages */
		// On commences par les catégories
		let listCat = set_categories.lastElementChild;
		for(let i=0; i<categories.length; i++) {
			let li = document.createElement('li');
				li.className = 'list-group-item';
			let text = document.createElement('span');
				text.innerHTML = categories[i];
				text.id = 'categorie_' + i;
				text.addEventListener('click', (e) => {
					editValue(e.target, 'categories');
				});
			let close = document.createElement('close');
				close.className = 'close';
				close.innerHTML = '&times;';
				close.id = 'categorie_suppr#' + i;
				close.addEventListener('click', (e) => {
					supprCat(e.target);
				});
			li.appendChild(text);
			li.appendChild(close);
			listCat.appendChild(li);
		}
		// Les statistiques
		let listStats = set_stats.lastElementChild;
		let total = document.createElement('li');
			total.className = 'list-group-item list-stats';
		let txt = document.createElement('span');
			txt.innerHTML = 'Total';
		let mark = document.createElement('b');
			mark.className = 'label label-perso';
			mark.innerHTML = items.length;
		total.appendChild(txt);
		total.appendChild(mark);
		listStats.appendChild(total)
		for(let i=0; i<avancements.length; i++) {
			let li = document.createElement('li');
				li.className = 'list-group-item list-stats';
			let text = document.createElement('span');
				text.innerHTML = avancements[i];
			let bullet = document.createElement('b');
				bullet.className = 'label label-' + labels[i];
				bullet.innerHTML = countAv[i].toString();
			li.appendChild(text);
			li.appendChild(bullet);
			listStats.appendChild(li);
		}
	}
	else return false;
})();

function sortAvancement(elem, cat) {
	let rect = elem.getBoundingClientRect();
	let y: number = rect.top + window.scrollY + elem.offsetHeight;
	let x: number = rect.left + elem.offsetWidth/2 - 150;
	const popupOptions = {
		type: 'filtre',
		titre: 'Filtre : ' + actualFilter,
		positions: [x, y],
		actuel: cat
	};
	let newPopup = new Popup(popupOptions);
		newPopup.showPopup();
}

/* Initialisation nouvelle catégorie */
function newCat() {
	if(categories.length < 10) {
		const inputsOptions = {
			elements: 1,
			icons: ['info-sign'],
			placeholders: ['Ajouter une catégorie'],
			values: ['']
		};
		const buttonsOptions = {
			names: ['Ajouter', 'Annuler'],
			type: ['primary', 'default'],
			event: ['addCat', 'cancelModal']
		};
		const modalOptions = {
			titre: 'Nouvelle categorie',
			type: 'ajout',
			buttons: buttonsOptions,
			inputs: inputsOptions
		};
		let modale = new Modale(modalOptions);
			modale.showModale();
		console.log(modale);
	}
	else {
		alert('Arf, dommage ! Le nombre de catégories maximales a été atteint (10) !');
	}
}

function newItem() {
	if(categories.length === 0) {
		alert('Créez au moins un catégorie avant de créer un item.');
		return false;
	}
	const inputsOptions = {
		elements: 2,
		icons: ['info-sign', 'align-justify'],
		placeholders: ['Ajouter un titre', 'Description'],
		values: ['', '']
	};
	const optionsOptions = {
		values: [categories, avancements]
	};
	const selectsOptions = {
		elements: 2,
		style: 'flex',
		options: optionsOptions
	};
	const buttonsOptions = {
		names: ['Ajouter', 'Annuler'],
		type: ['primary', 'default'],
		event: ['addItem', 'cancelModal']
	}
	const modalOptions = {
		titre: 'Ajouter un élément',
		type: 'ajout',
		buttons: buttonsOptions,
		inputs: inputsOptions,
		selects: selectsOptions
	}
	let modale = new Modale(modalOptions);
		modale.showModale();
		console.log(modale);
}

/* Evenement des boutons dans une modale */
function modalEvent(event: string, values) {
	switch(event) {
		case 'addCat':
			let newCategorie = new MenuItem(values[0].toString()); // seulement l'input ici
				newCategorie.addMenuItem();
		break;
		case 'addItem':
			let newItem = new Item(values[1][0], values[0][0], values[0][1], values[1][1]); // categorie, titre, description, avancement
			console.log(newItem);
				newItem.addToTab();
		break;
		case 'cancelModal':
			myModal.style.display = 'none';
		break;
	}
}

/* Réglages */
function toggleSettings() {
	if(panel.style.display === 'none') {
		panel.style.display = 'flex';
		fond.style.display = 'block';
		btn_reglages.removeChild(btn_reglages.firstChild);
		let icon = document.createElement('i');
			icon.innerHTML = '&times;';
			icon.className = 'close';
		btn_reglages.title = 'Fermer';
		btn_reglages.appendChild(icon);
	}
	else {
		panel.style.display = 'none';
		fond.style.display = 'none';
		btn_reglages.removeChild(btn_reglages.firstChild);
		let icon = document.createElement('i');
			icon.className = 'glyphicon glyphicon-cog';
		btn_reglages.title = 'Réglages';
		btn_reglages.appendChild(icon);
	}
}

function editValue(elem, type) {
	let text = elem.innerHTML;
	let input = document.createElement('input');
		input.type = 'text';
		input.value = text;
	elem.nodeName !== 'H1' ? input.className = 'editing' : input.className = 'editing h1editing';
	elem.parentNode.replaceChild(input, elem);
		input.focus();
		input.addEventListener('blur', () => {
			valueEdited(elem.id, input.value, type, elem);
		});
}

function valueEdited(id, value, type, elem) {
	switch(type) {
		case 'titre':
			localStorage.setItem('titre', value);
		break;
		case 'categories':
			id = id.slice(id.indexOf('_')+1, id.length);
			categories[id] = value;
			localStorage.setItem('categories', JSON.stringify(categories));
			location.reload();
		break;
	}
	let input = document.querySelector('.editing');
	elem.innerHTML = value;
	input.parentNode.replaceChild(elem, input);
		elem.addEventListener('click', () => {
			editValue(elem, type);
		});
}

function supprCat(elem) {
	console.log(elem.id);
	let cat = elem.id.slice(elem.id.indexOf('#'+1, elem.id.length));
	categories.splice(cat, 1);
	localStorage.setItem('categories', JSON.stringify(categories));
	location.reload();
}

function showAlert(button) {
	button.disabled = true;
	modalAlerte['style'].display = 'block';
}

function closeAlert() {
	modalAlerte['style'].display = 'none';
	document.querySelector('.btn-danger')['disabled'] = false;
}

function dump() {
	localStorage.removeItem('items');
	location.reload();
}