/* Variables globales */
/* Eléments de la modale */
var myModal = document.getElementById('myModal');
var modalContent = document.getElementById('modalContent');
var modalHeader = document.querySelector('.modal-header');
var modalBody = document.querySelector('.modal-body');
var modalFooter = document.querySelector('.modal-footer');
var titreH1 = document.querySelector('.container header h1');
var modalAlerte = document.querySelector('.modalAlerte');
var btnAddItem = document.getElementById('add_item'); // Bouton d'ajout d'un item
var todo = document.getElementById('todo'); // Div englobant le tableau
/* Eléments réglages */
var btn_reglages = document.getElementById('btn_reglages');
var panel = document.getElementById('reglages');
var fond = document.getElementById('fond');
var set_categories = document.getElementById('set_categories');
var set_stats = document.getElementById('set_stats');
/* Eléments Popoup */
var popup = document.getElementById('popup');
var popupHeader = document.querySelector('#popup header');
var popupSection = document.querySelector('#popup section');
var popupFooter = document.querySelector('#popup footer');
var badges = document.querySelectorAll('.badge');
var categories = JSON.parse(localStorage.getItem('categories')) || []; // Les catégories
var avancements = ['Projet', 'En cours', 'Avancé', 'En pause', 'Bloqué', 'Terminé']; // Avvancments possibles...
var labels = ['default', 'info', 'primary', 'warning', 'danger', 'success']; // ... et les labels qui vont avec
var actualCategorie;
var actualFilter;
var url = parseURLParams(window.location.href);
var listeCategories = JSON.parse(localStorage.getItem('categories'));
(typeof url !== 'undefined' && typeof url['c'] !== 'undefined') ? actualCategorie = categories[url['c']] : actualCategorie = 'Tous';
(typeof url !== 'undefined' && typeof url['f'] !== 'undefined') ? actualFilter = avancements[url['f']] : actualFilter = 'Aucun';
var categorieActuelle;
var items = JSON.parse(localStorage.getItem('items')) || []; // Les items
var titrePrincipal = localStorage.getItem('titre') || 'Cliquer pour ajouter un titre';
var countAv = [0, 0, 0, 0, 0, 0];
for (var i = 0; i < items.length; i++) {
    // console.log(JSON.parse(items[i]));
    for (var j = 0; j < avancements.length; j++) {
        if (JSON.parse(items[i]).avancement === avancements[j])
            countAv[j]++;
    }
}
console.log(countAv);
/* Récupération de l'URL pour récupérer les paramètres */
function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1, queryEnd = url.indexOf("#") + 1 || url.length + 1, query = url.slice(queryStart, queryEnd - 1), pairs = query.replace(/\+/g, " ").split("&"), parms = {}, i, n, v, nv;
    if (query === url || query === "")
        return;
    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);
        if (!parms.hasOwnProperty(n))
            parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}
/* Formatage de la date */
function formatedDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1; // Bien penser au +1 car Janvier est en 0
    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = dd + '/' + mm + '/' + yyyy;
    return today;
}
/* Création d'un item dans la todo */
var Item = (function () {
    function Item(categorie, titre, description, avancement) {
        this.categorie = categorie;
        this.titre = titre;
        this.description = description;
        this.avancement = avancement;
    }
    Item.prototype.addToTab = function () {
        var cat = this.categorie;
        cat = cat.slice(0, cat.indexOf('#'));
        var av = this.avancement;
        var limiteur = av.indexOf("#");
        var avance = av.slice(0, limiteur);
        var lab = av.slice(limiteur + 1, av.length);
        console.log(avance + ' - ' + lab);
        var item = {
            titre: this.titre,
            categorie: cat,
            description: this.description,
            date: formatedDate(new Date()),
            avancement: avance,
            label: lab
        };
        var stringItem = JSON.stringify(item);
        items.push(stringItem);
        localStorage.setItem('items', JSON.stringify(items));
        location.reload();
    };
    return Item;
}());
function removeItem(i) {
    var item = items[i];
    items.splice(i, 1);
    localStorage.setItem('items', JSON.stringify(items));
    location.reload();
}
/* Création d'une catégorie */
var MenuItem = (function () {
    function MenuItem(name) {
        this.name = name;
    }
    MenuItem.prototype.addMenuItem = function () {
        console.log("On ajoute " + this.name + " au menu");
        categories.push(this.name);
        localStorage.setItem('categories', JSON.stringify(categories));
        location.reload();
    };
    return MenuItem;
}());
/* Classe création d'une modale */
var Modale = (function () {
    function Modale(values) {
        this.values = values;
    }
    Modale.prototype.showModale = function () {
        //On efface les précédentes données
        modalBody.innerHTML = '';
        modalFooter.innerHTML = '';
        var data = this.values;
        myModal.style.display = 'flex';
        modalHeader.lastElementChild.innerHTML = data.titre;
        if (data.description) {
            var p = document.createElement('p');
            p.innerHTML = data.description;
            modalBody.appendChild(p);
        }
        if (data.inputs) {
            // On créer la div "form"
            var formDiv = document.createElement('div');
            formDiv.className = 'form-group';
            // On créer les inputs
            for (var i = 0; i < data.inputs.elements; i++) {
                var inputGroup = document.createElement('div');
                inputGroup.className = 'input-group';
                var label = document.createElement('label');
                label.className = 'input-group-addon';
                label.htmlFor = 'modaleInput_' + i;
                var icon = document.createElement('i');
                icon.className = 'glyphicon glyphicon-' + data.inputs.icons[i];
                label.appendChild(icon);
                inputGroup.appendChild(label);
                var input = document.createElement('input');
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
        if (data.selects) {
            // On créer la div englobant la ou les selects suivant le style défini
            var div = document.createElement('div');
            div.style.display = data.selects.style;
            // On créer les selects
            for (var i = 0; i < data.selects.elements; i++) {
                var select = document.createElement('select');
                select.className = 'form-control';
                // console.log(data.selects.options.values[i]);
                for (var j = 0; j < data.selects.options.values[i].length; j++) {
                    // console.log(data.selects.options.values[i][j]);
                    var option = document.createElement('option');
                    option.value = data.selects.options.values[i][j] + '#' + labels[j];
                    option.innerHTML = data.selects.options.values[i][j];
                    select.appendChild(option);
                }
                div.appendChild(select);
            }
            modalBody.appendChild(div);
        }
        var _loop_1 = function (i) {
            var button = document.createElement('button');
            button.innerHTML = data.buttons.names[i];
            button.className = 'btn btn-' + data.buttons.type[i];
            button.addEventListener('click', function () {
                var inputsValues = [];
                var selectsValues = [];
                var inputs = document.querySelectorAll('.modal-body .form-group input[type="text"].form-control');
                var selects = document.querySelectorAll('.modal-body select');
                for (var j = 0; j < inputs.length; j++) {
                    inputsValues.push(inputs[j]['value']);
                }
                for (var j = 0; j < selects.length; j++) {
                    selectsValues.push(selects[j]['value']);
                }
                var values = [inputsValues, selectsValues];
                // console.log(inputsValues);
                modalEvent(data.buttons.event[i], values);
            });
            modalFooter.appendChild(button);
        };
        for (var i = 0; i < data.buttons.names.length; i++) {
            _loop_1(i);
        }
    };
    return Modale;
}());
var Popup = (function () {
    function Popup(values) {
        this.values = values;
    }
    Popup.prototype.showPopup = function () {
        var _this = this;
        var data = this.values;
        popup.style.display = 'block';
        popup.style.left = data.positions[0] + 'px';
        popup.style.top = data.positions[1] + 'px';
        data.titre === 'Description' ? popup.style.width = '450px' : popup.style.width = '300px';
        // Le titre
        popupHeader.lastElementChild.innerHTML = data.titre;
        var actuel = data.actuel;
        var div = popupSection.firstElementChild;
        div.innerHTML = '';
        // console.log(div);
        switch (data.type) {
            case 'liste':
                var moment = void 0;
                data.titre === 'Avancement' ? moment = avancements : moment = categories;
                div.innerHTML = '';
                div.className = 'list-group';
                for (var i = 0; i < moment.length; i++) {
                    if (moment[i] == actuel) {
                        var active = document.createElement('a');
                        active.className = 'list-group-item active';
                        active.href = '#';
                        active.innerHTML = moment[i];
                        active.addEventListener('click', function (e) {
                            e.preventDefault();
                            popup.style.display = 'none';
                        });
                        div.appendChild(active);
                    }
                    else {
                        var choices = document.createElement('a');
                        choices.className = 'list-group-item';
                        choices.href = '#' + i;
                        choices.innerHTML = moment[i];
                        choices.addEventListener('click', function (e) {
                            e.preventDefault();
                            _this.saveItem(data.id, e.target.toString(), data.titre);
                        });
                        div.appendChild(choices);
                    }
                }
                popupFooter.innerHTML = '';
                var buttonCancel = document.createElement('button');
                buttonCancel.className = 'btn btn-default';
                buttonCancel.innerHTML = 'Annuler';
                buttonCancel.addEventListener('click', function () {
                    _this.closePopup();
                });
                popupFooter.appendChild(buttonCancel);
                break;
            case 'filtre':
                div.className = 'list-group';
                var actualURL = location.href;
                console.log(actualURL);
                var c = categories.indexOf(actualCategorie);
                var f = avancements.indexOf(actualFilter);
                console.log(typeof c + ' - ' + f);
                var index_html = 'index.html';
                var index_html_c = 'index.html?c=' + c;
                var index_html_f = 'index.html?f=';
                var index_html_c_f = 'index.html?c=' + c + '&f=';
                var noFilter = document.createElement('a');
                c === -1 ? noFilter.href = index_html : noFilter.href = index_html_c;
                actualFilter === 'Aucun' ? noFilter.className = 'active list-group-item' : noFilter.className = 'list-group-item';
                noFilter.innerHTML = 'Aucun';
                var bulletNoFilter = document.createElement('i');
                bulletNoFilter.className = 'glyphicon glyphicon-ban-circle';
                noFilter.appendChild(bulletNoFilter);
                div.appendChild(noFilter);
                for (var i = 0; i < avancements.length; i++) {
                    if (actualFilter === avancements[i]) {
                        var a = document.createElement('a');
                        a.href = '#';
                        a.className = 'active list-group-item';
                        a.innerHTML = avancements[i];
                        a.addEventListener('click', function (e) {
                            e.preventDefault();
                            _this.closePopup();
                        });
                        var bullet = document.createElement('i');
                        bullet.className = 'label label-' + labels[i];
                        bullet.innerHTML = ' ';
                        a.appendChild(bullet);
                        div.appendChild(a);
                    }
                    else {
                        var a = document.createElement('a');
                        (c === -1 && f === -1 || c === -1 && f !== -1) ? a.href = index_html_f + i : a.href = index_html_c_f + i;
                        a.className = 'list-group-item';
                        a.innerHTML = avancements[i];
                        var bullet = document.createElement('i');
                        bullet.className = 'label label-' + labels[i];
                        bullet.innerHTML = ' ';
                        a.appendChild(bullet);
                        div.appendChild(a);
                    }
                }
                popupFooter.innerHTML = '';
                var cancelFiltre = document.createElement('button');
                cancelFiltre.className = 'btn btn-default';
                cancelFiltre.innerHTML = 'Annuler';
                cancelFiltre.addEventListener('click', function () {
                    _this.closePopup();
                });
                popupFooter.appendChild(cancelFiltre);
                break;
            case 'input':
                div.innerHTML = '';
                div.className = 'input-group';
                var label = document.createElement('label');
                label.className = 'input-group-addon';
                label.htmlFor = 'popupInput_' + data.id;
                var icon = document.createElement('i');
                icon.className = 'glyphicon glyphicon-edit';
                var input_1 = document.createElement('input');
                label.appendChild(icon);
                div.appendChild(label);
                input_1.value = actuel;
                input_1.id = 'popupInput_' + data.id;
                input_1.className = 'form-control';
                div.appendChild(input_1);
                input_1.focus();
                popupFooter.innerHTML = '';
                var buttonCancel2 = document.createElement('button');
                buttonCancel2.className = 'btn btn-default';
                buttonCancel2.innerHTML = 'Annuler';
                buttonCancel2.addEventListener('click', function () {
                    _this.closePopup();
                });
                popupFooter.appendChild(buttonCancel2);
                var buttonEdit = document.createElement('button');
                buttonEdit.className = 'btn btn-primary';
                buttonEdit.innerHTML = 'Modifier';
                buttonEdit.addEventListener('click', function () {
                    _this.saveItem(data.id, input_1.value, data.titre);
                });
                popupFooter.insertBefore(buttonEdit, popupFooter.firstElementChild);
                break;
        }
    };
    Popup.prototype.saveItem = function (id, value, partie) {
        var aModifier = JSON.parse(items[id]);
        switch (partie) {
            case 'Avancement':
                var avanceId = value.slice(value.indexOf('#') + 1, value.length);
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
                var catId = value.slice(value.indexOf('#') + 1, value.length);
                aModifier.categorie = categories[catId];
                items[id] = JSON.stringify(aModifier);
                localStorage.setItem('items', JSON.stringify(items));
                location.reload();
                break;
        }
    };
    Popup.prototype.closePopup = function () {
        popup.style.display = 'none';
    };
    return Popup;
}());
function editItem(elem, id, partie) {
    var node = elem.nodeName;
    var plusY;
    var moinsX;
    node === 'TD' ? plusY = -5 : plusY = 5;
    partie === 'Description' ? moinsX = 225 : moinsX = 150;
    var rect = elem.getBoundingClientRect();
    var y = rect.top + window.scrollY + elem.offsetHeight + plusY;
    var x = rect.left + elem.offsetWidth / 2 - moinsX;
    var typeAffichage;
    if (partie === 'Titre' || partie === 'Description')
        typeAffichage = 'input';
    else
        typeAffichage = 'liste';
    var popupOptions = {
        type: typeAffichage,
        titre: partie,
        positions: [x, y],
        id: id,
        actuel: elem.innerHTML
    };
    var newPopup = new Popup(popupOptions);
    newPopup.showPopup();
}
/* Initialisation de l'application */
(function init() {
    console.log(actualCategorie);
    console.log(actualFilter);
    if (actualCategorie === undefined)
        window.location.href = 'index.html';
    if (actualFilter === undefined)
        window.location.href = 'index.html';
    if (typeof Storage === 'undefined') {
        alert("Arf, dommage ! - Votre navigateur n'offre pas la possibilit\u00E9 de sauvegarder des donn\u00E9es !");
        return false;
    }
    titreH1.innerHTML = titrePrincipal;
    if (localStorage.getItem('categories') !== null) {
        // console.log(actualCategorie);
        // On construit le menu principal
        var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Nombre d'items par catégories
        var tous = items.length;
        badges[0].innerHTML = tous;
        for (var i = 0; i < items.length; i++) {
            for (var j = 0; j < categories.length; j++) {
                if (JSON.parse(items[i]).categorie == categories[j]) {
                    count[j]++;
                }
            }
        }
        // console.log(count);
        for (var i = 0; i < categories.length; i++) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            var span = document.createElement('span');
            span.innerHTML = count[i].toString();
            span.className = 'badge';
            a.innerHTML = categories[i];
            a.href = '?c=' + i;
            a.appendChild(span);
            li.appendChild(a);
            document.querySelector('.nav-pills').insertBefore(li, document.querySelector('.nav-pills').lastElementChild);
        }
        var mainLinks = document.querySelectorAll('.nav-pills li a');
        for (var i = 0; i < mainLinks.length; i++) {
            if (mainLinks[i].firstChild['data'] == actualCategorie) {
                mainLinks[i].parentNode['classList'].add('active');
            }
        }
        // Le tableau dépend de l'url (partie chosie)
        // Créer le tableau, mais vide (table tag, tr et th tags)
        var table = document.createElement('table');
        table.className = 'table table-striped table-hover';
        //On créer la première ligne
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        tr.innerHTML = "\n\t\t\t\t\t<th></th>\n\t\t\t\t\t<th>Cat\u00E9gorie</th>\n\t\t\t\t\t<th>Titre</th>\n\t\t\t\t\t<th>Description</th>\n\t\t\t\t\t<th>Date d'id\u00E9e</th>\n\t\t\t\t\t<th onclick=\"sortAvancement(this, '" + actualCategorie + "');\" title=\"Filtrer\">Avancement <i class=\"glyphicon glyphicon-filter\"></i></th>\n\t\t\t\t  ";
        thead.appendChild(tr);
        table.appendChild(thead);
        todo.appendChild(table);
        var tbody = document.createElement('tbody');
        if (actualCategorie == 'Tous') {
            // console.log('Premier cas');
            for (var i = 0; i < items.length; i++) {
                var label = JSON.parse(items[i]).label;
                var tr_1 = document.createElement('tr');
                if (actualFilter === 'Aucun') {
                    tr_1.innerHTML = "\n\t\t\t\t\t\t\t\t\t<td><span class=\"close\" title=\"Supprimer\" onclick=\"removeItem(" + i + ");\">&times;</span></td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Categorie');\">" + JSON.parse(items[i]).categorie + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Titre');\">" + JSON.parse(items[i]).titre + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Description');\">" + JSON.parse(items[i]).description + "</td>\n\t\t\t\t\t\t\t\t\t<td>" + JSON.parse(items[i]).date + "</td>\n\t\t\t\t\t\t\t\t\t<td><span class=\"label label-" + label + "\" onclick=\"editItem(this, " + i + ", 'Avancement');\">" + JSON.parse(items[i]).avancement + "</span></td>\n\t\t\t\t\t\t\t\t   ";
                    tbody.appendChild(tr_1);
                    table.appendChild(tbody);
                    // console.log(JSON.parse(liste[i]));
                }
                if (JSON.parse(items[i]).avancement === actualFilter) {
                    tr_1.innerHTML = "\n\t\t\t\t\t\t\t\t\t<td><span class=\"close\" title=\"Supprimer\" onclick=\"removeItem(" + i + ");\">&times;</span></td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Categorie');\">" + JSON.parse(items[i]).categorie + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Titre');\">" + JSON.parse(items[i]).titre + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Description');\">" + JSON.parse(items[i]).description + "</td>\n\t\t\t\t\t\t\t\t\t<td>" + JSON.parse(items[i]).date + "</td>\n\t\t\t\t\t\t\t\t\t<td><span class=\"label label-" + label + "\" onclick=\"editItem(this, " + i + ", 'Avancement');\">" + JSON.parse(items[i]).avancement + "</span></td>\n\t\t\t\t\t\t\t\t   ";
                    tbody.appendChild(tr_1);
                    table.appendChild(tbody);
                    // console.log(JSON.parse(liste[i]));
                }
            }
        }
        else {
            for (var i = 0; i < items.length; i++) {
                if (JSON.parse(items[i]).categorie == actualCategorie) {
                    var label = JSON.parse(items[i]).label;
                    var tr_2 = document.createElement('tr');
                    if (actualFilter === 'Aucun') {
                        tr_2.innerHTML = "\n\t\t\t\t\t\t\t\t\t<td><span class=\"close\" title=\"Supprimer\" onclick=\"removeItem(" + i + ");\">&times;</span></td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Categorie');\">" + JSON.parse(items[i]).categorie + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Titre');\">" + JSON.parse(items[i]).titre + "</td>\n\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Description');\">" + JSON.parse(items[i]).description + "</td>\n\t\t\t\t\t\t\t\t\t<td>" + JSON.parse(items[i]).date + "</td>\n\t\t\t\t\t\t\t\t\t<td><span class=\"label label-" + label + "\" onclick=\"editItem(this, " + i + ", 'Avancement');\">" + JSON.parse(items[i]).avancement + "</span></td>\n\t\t\t\t\t\t\t\t   ";
                        tbody.appendChild(tr_2);
                        table.appendChild(tbody);
                        // console.log(JSON.parse(liste[i]));
                    }
                    if (JSON.parse(items[i]).avancement === actualFilter) {
                        // console.log(JSON.parse(items[i]).titre);
                        tr_2.innerHTML = "\n\t\t\t\t\t\t\t\t\t\t<td><span class=\"close\" title=\"Supprimer\" onclick=\"removeItem(" + i + ");\">&times;</span></td>\n\t\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Categorie');\">" + JSON.parse(items[i]).categorie + "</td>\n\t\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Titre');\">" + JSON.parse(items[i]).titre + "</td>\n\t\t\t\t\t\t\t\t\t\t<td ondblclick=\"editItem(this, " + i + ", 'Description');\">" + JSON.parse(items[i]).description + "</td>\n\t\t\t\t\t\t\t\t\t\t<td>" + JSON.parse(items[i]).date + "</td>\n\t\t\t\t\t\t\t\t\t\t<td><span class=\"label label-" + label + "\" onclick=\"editItem(this, " + i + ", 'Avancement');\">" + JSON.parse(items[i]).avancement + "</span></td>\n\t\t\t\t\t\t\t\t\t   ";
                        tbody.appendChild(tr_2);
                        table.appendChild(tbody);
                    }
                }
            }
        }
        /* Initialisation du paneau des réglages */
        // On commences par les catégories
        var listCat = set_categories.lastElementChild;
        for (var i = 0; i < categories.length; i++) {
            var li = document.createElement('li');
            li.className = 'list-group-item';
            var text = document.createElement('span');
            text.innerHTML = categories[i];
            text.id = 'categorie_' + i;
            text.addEventListener('click', function (e) {
                editValue(e.target, 'categories');
            });
            var close_1 = document.createElement('close');
            close_1.className = 'close';
            close_1.innerHTML = '&times;';
            close_1.id = 'categorie_suppr#' + i;
            close_1.addEventListener('click', function (e) {
                supprCat(e.target);
            });
            li.appendChild(text);
            li.appendChild(close_1);
            listCat.appendChild(li);
        }
        // Les statistiques
        var listStats = set_stats.lastElementChild;
        var total = document.createElement('li');
        total.className = 'list-group-item list-stats';
        var txt = document.createElement('span');
        txt.innerHTML = 'Total';
        var mark = document.createElement('b');
        mark.className = 'label label-perso';
        mark.innerHTML = items.length;
        total.appendChild(txt);
        total.appendChild(mark);
        listStats.appendChild(total);
        for (var i = 0; i < avancements.length; i++) {
            var li = document.createElement('li');
            li.className = 'list-group-item list-stats';
            var text = document.createElement('span');
            text.innerHTML = avancements[i];
            var bullet = document.createElement('b');
            bullet.className = 'label label-' + labels[i];
            bullet.innerHTML = countAv[i].toString();
            li.appendChild(text);
            li.appendChild(bullet);
            listStats.appendChild(li);
        }
    }
    else
        return false;
})();
function sortAvancement(elem, cat) {
    var rect = elem.getBoundingClientRect();
    var y = rect.top + window.scrollY + elem.offsetHeight;
    var x = rect.left + elem.offsetWidth / 2 - 150;
    var popupOptions = {
        type: 'filtre',
        titre: 'Filtre : ' + actualFilter,
        positions: [x, y],
        actuel: cat
    };
    var newPopup = new Popup(popupOptions);
    newPopup.showPopup();
}
/* Initialisation nouvelle catégorie */
function newCat() {
    if (categories.length < 10) {
        var inputsOptions = {
            elements: 1,
            icons: ['info-sign'],
            placeholders: ['Ajouter une catégorie'],
            values: ['']
        };
        var buttonsOptions = {
            names: ['Ajouter', 'Annuler'],
            type: ['primary', 'default'],
            event: ['addCat', 'cancelModal']
        };
        var modalOptions = {
            titre: 'Nouvelle categorie',
            type: 'ajout',
            buttons: buttonsOptions,
            inputs: inputsOptions
        };
        var modale = new Modale(modalOptions);
        modale.showModale();
        console.log(modale);
    }
    else {
        alert('Arf, dommage ! Le nombre de catégories maximales a été atteint (10) !');
    }
}
function newItem() {
    if (categories.length === 0) {
        alert('Créez au moins un catégorie avant de créer un item.');
        return false;
    }
    var inputsOptions = {
        elements: 2,
        icons: ['info-sign', 'align-justify'],
        placeholders: ['Ajouter un titre', 'Description'],
        values: ['', '']
    };
    var optionsOptions = {
        values: [categories, avancements]
    };
    var selectsOptions = {
        elements: 2,
        style: 'flex',
        options: optionsOptions
    };
    var buttonsOptions = {
        names: ['Ajouter', 'Annuler'],
        type: ['primary', 'default'],
        event: ['addItem', 'cancelModal']
    };
    var modalOptions = {
        titre: 'Ajouter un élément',
        type: 'ajout',
        buttons: buttonsOptions,
        inputs: inputsOptions,
        selects: selectsOptions
    };
    var modale = new Modale(modalOptions);
    modale.showModale();
    console.log(modale);
}
/* Evenement des boutons dans une modale */
function modalEvent(event, values) {
    switch (event) {
        case 'addCat':
            var newCategorie = new MenuItem(values[0].toString()); // seulement l'input ici
            newCategorie.addMenuItem();
            break;
        case 'addItem':
            var newItem_1 = new Item(values[1][0], values[0][0], values[0][1], values[1][1]); // categorie, titre, description, avancement
            console.log(newItem_1);
            newItem_1.addToTab();
            break;
        case 'cancelModal':
            myModal.style.display = 'none';
            break;
    }
}
/* Réglages */
function toggleSettings() {
    if (panel.style.display === 'none') {
        panel.style.display = 'flex';
        fond.style.display = 'block';
        btn_reglages.removeChild(btn_reglages.firstChild);
        var icon = document.createElement('i');
        icon.innerHTML = '&times;';
        icon.className = 'close';
        btn_reglages.title = 'Fermer';
        btn_reglages.appendChild(icon);
    }
    else {
        panel.style.display = 'none';
        fond.style.display = 'none';
        btn_reglages.removeChild(btn_reglages.firstChild);
        var icon = document.createElement('i');
        icon.className = 'glyphicon glyphicon-cog';
        btn_reglages.title = 'Réglages';
        btn_reglages.appendChild(icon);
    }
}
function editValue(elem, type) {
    var text = elem.innerHTML;
    var input = document.createElement('input');
    input.type = 'text';
    input.value = text;
    elem.nodeName !== 'H1' ? input.className = 'editing' : input.className = 'editing h1editing';
    elem.parentNode.replaceChild(input, elem);
    input.focus();
    input.addEventListener('blur', function () {
        valueEdited(elem.id, input.value, type, elem);
    });
}
function valueEdited(id, value, type, elem) {
    switch (type) {
        case 'titre':
            localStorage.setItem('titre', value);
            break;
        case 'categories':
            id = id.slice(id.indexOf('_') + 1, id.length);
            categories[id] = value;
            localStorage.setItem('categories', JSON.stringify(categories));
            location.reload();
            break;
    }
    var input = document.querySelector('.editing');
    elem.innerHTML = value;
    input.parentNode.replaceChild(elem, input);
    elem.addEventListener('click', function () {
        editValue(elem, type);
    });
}
function supprCat(elem) {
    console.log(elem.id);
    var cat = elem.id.slice(elem.id.indexOf('#' + 1, elem.id.length));
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
//# sourceMappingURL=main.js.map