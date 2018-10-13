// ********************************
// EzTable - Built by Izhar Fine, 
// Release year 2018 - Version 0.1
// ********************************

import { EzBody, EzHeader, EzField, EzSelect, EzTable } from './eztable.js';

export class EzTableGenerator {
    constructor() {
            this.EzTable = null,
            this._Properties = [{
                TableName: '',
                AddCallBack: '',
                UpdateCallBack: '',
                DeleteCallBack: '',
                RowsInPage: 0,
                EnableSearch: false,
                Sortable: false,
                ColumnMode: false,
                Template: ''
            }],
            this._TempTableStruct =
            [{
                PHName: '',
                Type: 'Text',
                Disabled: false,
                SelectName: ''
            }],
            this._TempSelects = [
                {
                    Name: '', Options:
                    [{ Value: '', Desc: '' }]
                }],
            this._TableStruct = null,
            this._Selects = null,
            this._TypeSelect = [
                {
                    Name: "Types", Options:
                    [{ Value: 'Text', Desc: 'Text' },
                    { Value: 'Number', Desc: 'Number' },
                    { Value: 'Date', Desc: 'Date' },
                    { Value: 'Checkbox', Desc: 'Checkbox' },
                    { Value: 'Select', Desc: 'Select' }]
                }],
            this._TemplateSelect = [
                {
                    Name: "Templates", Options:
                    [{ Value: '', Desc: 'Default' },
                    { Value: 'ez-dark', Desc: 'Dark' },
                    ]
                }],
            this._Rows = null,
            this._Header = null
    }

    loadTable(object) {
        if (object.constructor == Object) {
            this._loadFromJsonObject(object);
        }
        else {
            this._loadFromDOMTable(document.querySelector(object));
        }
    }

    buildTable(targetDOM) {
        let tableObj = {
            Header: this._Header,
            Body: this._Rows,
            Properties: this._Properties,
            TableStruct: this._TableStruct && this._TableStruct.length ? this._TableStruct : null,
            Selects: this._Selects
        }
        let ezTable = new EzTable(tableObj);
        ezTable.buildTable(document.querySelector(targetDOM));
        this.EzTable = ezTable;
    }


    _loadFromJsonObject(jsonObject) {
        this._Properties = jsonObject.Properties || null;
        this._Selects = jsonObject.Selects || null;
        this._TableStruct = jsonObject.TableStruct || null;
        this._Rows = jsonObject.Body;
        this._Header = jsonObject.Header;
    }

    _loadFromDOMTable(tableObject, targetDOM) {
        let header = Array.prototype.slice.call(tableObject.getElementsByTagName('thead')[0].getElementsByTagName('th'));
        let headerObj = [];
        header.forEach(col => {
            let headerCol = {
                Name: col.textContent
            }
            headerObj.push(headerCol);
        });
        let rows = Array.prototype.slice.call(tableObject.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        let rowsObj = [];
        rows.forEach(field => {
            let values = [];
            for (let i = 0; i < field.getElementsByTagName('td').length; i++) {
                let fieldObj = {
                    Value: field.getElementsByTagName('td')[i].textContent
                }
                values.push(fieldObj);
            }
            let row = [{
                Id: field.getAttribute('data-id'),
                Values: values
            }]
            rowsObj.push(row);
        });
        this._Rows = rowsObj;
        this._Header = headerObj;
        tableObject.style.display = 'none';
    }

    controlPanel() {
        let generatorWrapper = document.createElement('div');
        generatorWrapper.className = 'ez-table-generator';
        let title = document.createElement('h3');
        title.textContent = 'EzTable Object Generator';
        let closeBtn = document.createElement('span');
        closeBtn.textContent = 'X';
        closeBtn.className = 'ez-table-generator-close-btn';
        closeBtn.addEventListener('click', () => {
            generatorWrapper.className = 'ez-table-generator';
            setTimeout(() => { generatorWrapper.remove(); }, 500);
        });
        generatorWrapper.appendChild(closeBtn);
        generatorWrapper.appendChild(title);
        generatorWrapper.appendChild(this._buildGeneratorDivs('Properties'));
        generatorWrapper.appendChild(this._buildGeneratorDivs('Struct'));
        generatorWrapper.appendChild(this._buildGeneratorDivs('Selects'));
        document.querySelector('body').appendChild(generatorWrapper);
        setTimeout(() => { generatorWrapper.classList = 'ez-table-generator ez-show'; }, 50);
    }

    _buildGeneratorDivs(name) {
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-table-generator-object-wrapper';
        let toggleBtn = document.createElement('div');
        toggleBtn.className = 'ez-table-generator-title';
        toggleBtn.textContent = name;
        wrapper.appendChild(toggleBtn);
        if (name != 'Properties') {
            let addBtn = document.createElement('input');
            addBtn.type = 'button';
            addBtn.className = 'ez-table-generator-btn';
            addBtn.value = 'ADD';
            addBtn.addEventListener('click', () => {
                this._jsonObjectBuilder(name, wrapper);
            });
            wrapper.appendChild(addBtn);
        }
        toggleBtn.addEventListener('click', () => {
            if (wrapper.getElementsByClassName('ez-table-generator-edit-add')[0])
                wrapper.removeChild(wrapper.getElementsByClassName('ez-table-generator-edit-add')[0]);
            else
                this._buildEditAddGenerator(name, wrapper);
        });
        return wrapper;
    }

    _updateJsonObjectByName(name, jsonObject) {
        switch (name) {
            case 'Properties':
                this._Properties = jsonObject;
                break;
            case 'Struct':
                this._TableStruct = jsonObject;
                break;
            case 'Selects':
                this._Selects = jsonObject;
                break;
        }
    }

    _getJsonObjectByName(name) {
        switch (name) {
            case 'Properties':
                return this._Properties;
                break;
            case 'Struct':
                return this._TableStruct;
                break;
            case 'TempStruct':
                return this._TempTableStruct;
                break;
            case 'TempSelects':
                return this._TempSelects;
                break;
            case 'Selects':
                return this._Selects;
                break;
        }
    }

    _buildEditAddGenerator(name, parent) {
        if (parent.getElementsByClassName('ez-table-generator-edit-add')[0])
            parent.removeChild(parent.getElementsByClassName('ez-table-generator-edit-add')[0]);
        let jsonObject = this._getJsonObjectByName(name);
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-table-generator-edit-add';
        if (jsonObject) {
            jsonObject.forEach((object, index) => {
                this._buildEditAddRow(object, index, name, wrapper);
            });
            parent.appendChild(wrapper);
        }
    }

    _buildEditAddRow(object, index, name, wrapper) {
        let rowsWrapper = document.createElement('div');
        rowsWrapper.className = 'ez-table-generator-rows-wrapper';
        Object.keys(object).forEach(property => {
            if (object[property].constructor == Array || object.constructor == Array) {
                this._buildEditAddRow(object[property], index, name, wrapper);
            }
            else {
                let row = document.createElement('div');
                row.className = 'ez-table-generator-row';
                let label = document.createElement('label');
                label.textContent = property;
                row.appendChild(label);
                let input;
                if (name == 'Struct' && property == 'Type') {
                    let select = new EzSelect(this._TypeSelect);
                    input = select.buildSelect('Types');
                    input.value = object.Type;
                }
                else if (name == 'Properties' && property == 'Template') {
                    let select = new EzSelect(this._TemplateSelect);
                    input = select.buildSelect('Templates');
                    input.value = object.Template;
                }
                else {
                    input = document.createElement('input');
                    input.type = typeof (object[property]) == 'boolean' ? 'checkbox' : typeof (object[property]);
                    if (input.type == 'checkbox') {
                        input.checked = object[property];
                    }
                    else {
                        input.value = object[property];
                    }
                }
                input.className = 'ez-cp-field';
                input.addEventListener('change', () => {
                    object[property] = input.type == 'checkbox' ? input.checked ? true : false : input.type == 'number' ? input.value * 1 : input.value;
                });
                let col = document.createElement('div');
                col.className = 'ez-table-generator-col';
                col.appendChild(label);
                if (name == 'Selects' && property == 'Name') {
                    let addBtn = document.createElement('input');
                    addBtn.type = 'button';
                    addBtn.className = 'ez-table-generator-btn';
                    addBtn.value = 'ADD';
                    addBtn.addEventListener('click', () => {
                        let jsonObject = this._Selects[this._Selects.indexOf(object)];
                        let tempObject = this._getJsonObjectByName('Temp' + name);
                        tempObject = JSON.stringify(tempObject);
                        tempObject = JSON.parse(tempObject);
                        jsonObject.Options.push(tempObject[0].Options[0]);
                        this._getJsonObjectByName(name)[this._Selects.indexOf(object)] = jsonObject;
                        this._buildEditAddGenerator(name, wrapper.parentNode);
                    });
                    col.appendChild(addBtn);
                }
                if (name == 'Selects' && property == 'Name' || name == 'Struct' && property == 'SelectName') {
                    let removeBtn = document.createElement('input');
                    removeBtn.type = 'button';
                    removeBtn.className = 'ez-table-generator-btn';
                    removeBtn.value = 'DEL';
                    removeBtn.addEventListener('click', () => {
                        this._getJsonObjectByName(name).splice(this._getJsonObjectByName(name).indexOf(object), 1);
                        this._buildEditAddGenerator(name, wrapper.parentNode);
                    });
                    col.appendChild(removeBtn);
                }
                row.appendChild(col);
                col = document.createElement('div');
                col.className = 'ez-table-generator-col';
                col.appendChild(input);
                row.appendChild(col);
                rowsWrapper.appendChild(row);
            }
        });
        if (rowsWrapper.childNodes.length)
            wrapper.appendChild(rowsWrapper);
    }

    _jsonObjectBuilder(name, wrapper) {
        let jsonObject = this._getJsonObjectByName(name);
        let tempObject = this._getJsonObjectByName('Temp' + name);
        tempObject = JSON.stringify(tempObject);
        tempObject = tempObject.substring(1, tempObject.length - 1);
        if (jsonObject && jsonObject.length != 0) {
            jsonObject = JSON.stringify(jsonObject);
            jsonObject = jsonObject.substring(1, jsonObject.length - 1) + ',' + tempObject;
        }
        else
            jsonObject = tempObject;
        this._updateJsonObjectByName(name, JSON.parse('[' + jsonObject + ']'));
        this._buildEditAddGenerator(name, wrapper);
    }
}
