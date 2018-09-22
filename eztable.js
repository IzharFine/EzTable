// ********************************
// EzTable - Built by Izhar Fine, 
// Release year 2018 - Version 0.1
// ********************************

class EzTableGenerator{
    constructor(){
        this.EzTable = null,
        this.Properties = [{
            TableName: '',
            AddCallBack: '',
            UpdateCallBack: '',
            DeleteCallBack: '',
            RowsInPage: 0,
            EnableSearch: false,
            Sortable: false,
            Template: ''
        }],
        this._TempTableStruct = 
            [{
                PHName: '',
                Type: 'Text',
                Disabled:false,
                SelectName: ''
            }],
        this._TempSelects = [
            { Name: '', Options:
            [{Value: '', Desc: ''}]
        }],
        this.TableStruct = null,
        this.Selects = null,
        this.TypeSelect = [
            { Name: "Types", Options:
            [{Value: 'Text', Desc: 'Text'},
            {Value: 'Number', Desc: 'Number'},
            {Value: 'Date', Desc: 'Date'},
            {Value: 'Checkbox', Desc: 'Checkbox'},
            {Value: 'Select', Desc: 'Select'}]
        }],
        this.TemplateSelect = [
            { Name: "Templates", Options:
            [{Value: '', Desc: 'Default'},
            {Value: 'ez-dark', Desc: 'Dark'},
        ]
        }]
    }

    buildTable(object, targetDOM){
        if(object.constructor == Object){
            this._buildFromJsonObject(object, document.querySelector(targetDOM));
        }
        else{
            this._buildFromDOMTable(document.querySelector(object), document.querySelector(targetDOM));
        }
    }


    _buildFromJsonObject(jsonObject, targetDOM){
        let ezTable = new EzTable(jsonObject);
        targetDOM.appendChild(ezTable.buildTable());
        this.EzTable = ezTable;
    }

    _buildFromDOMTable(tableObject, targetDOM){
        let header = Array.prototype.slice.call(tableObject.getElementsByTagName('thead')[0].getElementsByTagName('th'));
        let headerObj = [];
        header.forEach(col=>{
            let headerCol = {
                Name: col.textContent
            }
            headerObj.push(headerCol);
        });
        let rows = Array.prototype.slice.call(tableObject.getElementsByTagName('tbody')[0].getElementsByTagName('tr'));
        let rowsObj = [];
        rows.forEach(field=>{
            let values = []; 
            for(let i=0;i<field.getElementsByTagName('td').length;i++){
                let fieldObj = {
                    Value: field.getElementsByTagName('td')[i].textContent
                }
                values.push(fieldObj);
            }
            let row = [{
                Id: field.getAttribute('data-id'), 
                Values:values
            }]
            rowsObj.push(row);
        });
        let tableObj = {
            Header: headerObj,
            Body: rowsObj,
            Properties: this.Properties,
            TableStruct: this.TableStruct,
            Selects: this.Selects
        }
        let ezTable = new EzTable(tableObj);
        targetDOM.appendChild(ezTable.buildTable());
        tableObject.style.display = 'none';
        this.EzTable = ezTable;
    }

    controlPanel(){
        let generatorWrapper = document.createElement('div');
        generatorWrapper.className = 'ez-table-generator';
        let title = document.createElement('h3');
        title.textContent = 'EzTable Object Generator';
        let closeBtn = document.createElement('span');
        closeBtn.textContent = 'X';
        closeBtn.className = 'ez-table-generator-close-btn';
        closeBtn.addEventListener('click', ()=>{
            generatorWrapper.className = 'ez-table-generator';
            setTimeout(()=>{ generatorWrapper.remove(); }, 500);
        });
        generatorWrapper.appendChild(closeBtn);
        generatorWrapper.appendChild(title);
        generatorWrapper.appendChild(this._buildGeneratorDivs('Properties'));
        generatorWrapper.appendChild(this._buildGeneratorDivs('Struct'));
        generatorWrapper.appendChild(this._buildGeneratorDivs('Selects'));
        document.querySelector('body').appendChild(generatorWrapper);
        setTimeout(()=>{ generatorWrapper.classList = 'ez-table-generator show'; }, 50);
    }

    _buildGeneratorDivs(name){
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-table-generator-object-wrapper';
        let toggleBtn = document.createElement('div');
        toggleBtn.className = 'ez-table-generator-title';
        toggleBtn.textContent = name;
        wrapper.appendChild(toggleBtn);
        if(name!='Properties'){
            let addBtn = document.createElement('input');
            addBtn.type = 'button';
            addBtn.className = 'ez-table-generator-btn';
            addBtn.value = 'Add object';
            addBtn.addEventListener('click',()=>{
                this._jsonObjectBuilder(name, wrapper);
            });
            wrapper.appendChild(addBtn);
        }
        toggleBtn.addEventListener('click', ()=>{
            if(wrapper.getElementsByClassName('ez-table-generator-edit-add')[0])
                  wrapper.removeChild(wrapper.getElementsByClassName('ez-table-generator-edit-add')[0]);
            else
                this._buildEditAddGenerator(name, wrapper);
        });
        return wrapper;
    }

    _updateJsonObjectByName(name, jsonObject){
        switch(name){
            case 'Properties':
            this.Properties = jsonObject;
            break;
            case 'Struct':
            this.TableStruct = jsonObject;
            break;
            case 'Selects':
            this.Selects = jsonObject;
            break;
        }
    }

    _getJsonObjectByName(name){
        switch(name){
            case 'Properties':
            return this.Properties;
            break;
            case 'Struct':
            return this.TableStruct;
            break;
            case 'TempStruct':
            return this._TempTableStruct;
            break;
            case 'TempSelects':
            return this._TempSelects;
            break;
            case 'Selects':
            return this.Selects;
            break;
        }
    }

    _buildEditAddGenerator(name, parent){
        if(parent.getElementsByClassName('ez-table-generator-edit-add')[0])
             parent.removeChild(parent.getElementsByClassName('ez-table-generator-edit-add')[0]);
        let jsonObject = this._getJsonObjectByName(name);
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-table-generator-edit-add';
        if(jsonObject){
            jsonObject.forEach((object, index)=>{
                this._buildEditAddRow(object,index, name, wrapper);
            });
            parent.appendChild(wrapper);
        }
    }

    _buildEditAddRow(object, index, name, wrapper){
        let rowsWrapper = document.createElement('div');
        rowsWrapper.className = 'ez-table-generator-rows-wrapper';
        Object.keys(object).forEach(property=>{
            if(object[property].constructor == Array || object.constructor == Array){
                this._buildEditAddRow(object[property], index, name, wrapper);
            }
            else{
                let row = document.createElement('div');
                row.className = 'ez-table-generator-row';
                let label = document.createElement('label');
                label.textContent = property;
                row.appendChild(label);
                let input;
                if(name == 'Struct' && property == 'Type'){
                    let select = new EzSelect(this.TypeSelect);
                    input = select.buildSelect('Types');
                    input.value = object.Type;
                }
                else if(name == 'Properties' && property == 'Template'){
                    let select = new EzSelect(this.TemplateSelect);
                    input = select.buildSelect('Templates');
                    input.value = object.Template;
                }
                else{
                    input = document.createElement('input');
                    input.type = typeof(object[property]) == 'boolean' ? 'checkbox' : typeof(object[property]);
                    if(input.type == 'checkbox'){
                        input.checked = object[property];
                    }
                    else{
                        input.value = object[property];
                    }
                }
                input.addEventListener('change',()=>{
                    object[property] = input.type == 'checkbox' ? input.checked ? true : false : input.type == 'number' ? input.value*1 : input.value;
                });
                let col = document.createElement('div');
                col.className = 'ez-table-generator-col';
                col.appendChild(label);
                if(name == 'Selects' && property == 'Name'){
                    let addBtn = document.createElement('input');
                    addBtn.type = 'button';
                    addBtn.className = 'ez-table-generator-btn';
                    addBtn.value = 'ADD';
                    addBtn.addEventListener('click',()=>{
                        let jsonObject = this.Selects[this.Selects.indexOf(object)];
                        let tempObject = this._getJsonObjectByName('Temp' + name);
                        tempObject = JSON.stringify(tempObject);
                        tempObject = JSON.parse(tempObject);
                        jsonObject.Options.push(tempObject[0].Options[0]);
                        this._getJsonObjectByName(name)[this.Selects.indexOf(object)] = jsonObject;
                        this._buildEditAddGenerator(name, wrapper.parentNode);
                    });
                    col.appendChild(addBtn);
                }
                if(name == 'Selects' && property == 'Name' || name == 'Struct' && property == 'SelectName'){
                    let removeBtn = document.createElement('input');
                    removeBtn.type = 'button';
                    removeBtn.className = 'ez-table-generator-btn';
                    removeBtn.value = 'REMOVE';
                    removeBtn.addEventListener('click',()=>{
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
        if(rowsWrapper.childNodes.length)
           wrapper.appendChild(rowsWrapper);
    }

    _jsonObjectBuilder(name, wrapper){
        let jsonObject = this._getJsonObjectByName(name);
        let tempObject = this._getJsonObjectByName('Temp' + name);
        tempObject = JSON.stringify(tempObject);
        tempObject = tempObject.substring(1, tempObject.length - 1);
        if(jsonObject && jsonObject.length != 0){
            jsonObject = JSON.stringify(jsonObject);
            jsonObject = jsonObject.substring(1, jsonObject.length - 1) + ',' + tempObject;
        }
        else
            jsonObject = tempObject;
        this._updateJsonObjectByName(name, JSON.parse('[' + jsonObject + ']'));
        this._buildEditAddGenerator(name, wrapper);
    }
}

class EzTable{
    constructor(data){
        this.Properties = {
            TableName: data.Properties ? data.Properties[0].TableName || null : null,
            UpdateCallBack: data.Properties ? data.Properties[0].UpdateCallBack || null : null,
            DeleteCallBack: data.Properties ? data.Properties[0].DeleteCallBack || null : null,
            AddCallBack: data.Properties ? data.Properties[0].AddCallBack || null : null,
            EnableSearch: data.Properties ? data.Properties[0].EnableSearch || false : false,
            Sortable: data.Properties ? data.Properties[0].Sortable || false : false,
            RowsInPage: data.Properties ? data.Properties[0].RowsInPage || null : null,
            Template: data.Properties ? data.Properties[0].Template || '' : ''
        }

        this.DomObj = null;
        this.Selects = data.Selects ? new EzSelect(data.Selects) : null;
        this.TableStruct = data.TableStruct ? new TableStruct(data.TableStruct) : null;
        this.Header = new EzHeader(data.Header);
        this.Body = new EzBody(data.Body);
        this.CurrentPage = 1;
        this.PagingComp = null;
    }


    buildTable(targetDOM){
        let table = document.createElement('div');
        table.className = 'ez-table ' + this.Properties.Template;
        if(this.Properties.EnableSearch || this.Properties.AddCallBack){
            let filtersWrapper = document.createElement('div');
            filtersWrapper.className = 'ez-filters-wrapper';
            if(this.Properties.EnableSearch)
                filtersWrapper.appendChild(this.buildSearchComp());
            if(this.Properties.AddCallBack)
                filtersWrapper.appendChild(this.buildAddBtn());
            table.appendChild(filtersWrapper);
        }
        table.appendChild(this.Header.buildHeader(this));
        table.appendChild(this.Body.buildRows(this, this.Body.Rows));
        this.DomObj = table;
        if(this.Properties.RowsInPage){
            this.PagingComp=this.buildPagingComp();
            this.DomObj.appendChild(this.PagingComp);
        }
        if(targetDOM)
            targetDOM.appendChild(table);
        return table;
    }

    buildAddBtn(){
        let addBtn = document.createElement('input');
        addBtn.type = 'button';
        addBtn.className = 'ez-add-btn';
        addBtn.value = 'ADD';
        addBtn.addEventListener('click',()=>{
            addBtn.disabled = true;
            let addDiv = this.buildAddDiv(addBtn);
            this.DomObj.appendChild(addDiv);
            setTimeout(()=>{ addDiv.className = 'ez-add-div show' }, 500);
        });
        return addBtn;
    }

    buildAddDiv(addBtn){
        let addDiv = document.createElement('div');
        addDiv.className = 'ez-add-div';
        let addFields=[];
        this.Header.HeaderCols.forEach((field,index)=>{
            let fieldInput;
            let fieldTemp = {
                Value:''  
            };
            let tempField = new EzField(fieldTemp, index);
            let fieldRow = document.createElement('div');        
            let fieldLabel = document.createElement('label');
            fieldLabel.textContent = field.Name;
            if(this.Properties.UpdateCallBack){
                fieldInput = tempField.buildDOMField(this);
            }
            else{
                fieldInput = document.createElement('input');
            }
            fieldInput.addEventListener('change',()=>{
                if(fieldInput.type == 'checkbox'){
                    tempField.Value=fieldInput.checked;
                }
                else{
                    tempField.Value=fieldInput.value;
                }
            });
            addFields.push(tempField);
            let fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'ez-add-field-wrapper';
            fieldWrapper.appendChild(fieldLabel);
            fieldRow.appendChild(fieldWrapper);
            fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'ez-add-field-wrapper';
            fieldWrapper.appendChild(fieldInput);
            fieldRow.appendChild(fieldWrapper);
            addDiv.appendChild(fieldRow);
        });
        let btnsCont = document.createElement('div');
        btnsCont.className = 'ez-add-btn-conts';
        let submitBtn = document.createElement('input');
        submitBtn.type = 'button';
        submitBtn.className = 'ez-submit-add ez-btn';
        submitBtn.value = 'SUBMIT';
        submitBtn.addEventListener('click',()=>{  
            let newRow = [{ Id: '0', Index: this.Body.Rows.length+1, Fields:
                addFields
            }];
            this.Body.buildDomRows(this, newRow);
            this.Body.Rows.push(newRow[0]);
            this.showHideDisplayRows(this.CurrentPage-1);
            addDiv.className = 'ez-add-div';
            setTimeout(()=>{ addDiv.remove(); }, 500);
            addBtn.disabled = false;
            window[this.Properties.AddCallBack.trim()](newRow[0], this.Properties.TableName);
        });
        let cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.className ='ez-cancel-add ez-btn';
        cancelBtn.value = 'CANCEL';
        cancelBtn.addEventListener('click',()=>{
            addDiv.className = 'ez-add-div'
            setTimeout(()=>{ addDiv.remove(); }, 500);
            addBtn.disabled = false;
        });
        btnsCont.appendChild(submitBtn);
        btnsCont.appendChild(cancelBtn);
        addDiv.appendChild(btnsCont);
        return addDiv;
    }

    buildPagingComp(){
        if(this.PagingComp){
            this.DomObj.removeChild(this.PagingComp);
            this.PagingComp.remove();
        }
        let row = document.createElement('div');
        row.className = 'ez-paging';
        let leftArrow = document.createElement('div');
        leftArrow.classList = 'ez-arrow ez-left-arrow';
        leftArrow.addEventListener('click', ()=>{
            pageInput.value = pageInput.value - 1;
            this.changePage(pageInput);
        });
        let rightArrow = document.createElement('div');
        rightArrow.classList = 'ez-arrow ez-right-arrow';;
        rightArrow.addEventListener('click', ()=>{
            pageInput.value = pageInput.value*1 + 1;
            this.changePage(pageInput);
        });
        let pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.className = 'ez-change-page';
        pageInput.value = this.CurrentPage;
        pageInput.addEventListener('change', ()=>{
            this.changePage(pageInput);
        });
        let maxPage = document.createElement('span');
        let maxPageNumber = Math.ceil(this.Body.DisplayRows.length / this.Properties.RowsInPage);
        maxPage.textContent = ' / ' + maxPageNumber;
        let pagingTextCont = document.createElement('span');
        let toPage = ((this.CurrentPage-1) * this.Properties.RowsInPage + this.Properties.RowsInPage) > this.Body.DisplayRows.length ? this.Body.DisplayRows.length : ((this.CurrentPage-1) * this.Properties.RowsInPage + this.Properties.RowsInPage);
        pagingTextCont.textContent = 'Showing ' + ((this.CurrentPage - 1) * this.Properties.RowsInPage + 1) + ' to ' + toPage + ' of ' + this.Body.DisplayRows.length + ' entries.';
        row.appendChild(pagingTextCont);
        let changePageCont = document.createElement('div');
        changePageCont.className = 'ez-move-pages-cont';
        changePageCont.appendChild(leftArrow);
        changePageCont.appendChild(pageInput);
        changePageCont.appendChild(maxPage);
        changePageCont.appendChild(rightArrow);
        row.appendChild(changePageCont);
        return row;
    }

    changePage(pageInput){
        let maxPageNumber = Math.ceil(this.Body.DisplayRows.length / this.Properties.RowsInPage);
        if(!isNaN(pageInput.value) && pageInput.value > 0 && pageInput.value <= maxPageNumber){
            this.CurrentPage = pageInput.value;
            this.showHideDisplayRows(pageInput.value - 1);
        }
        else
            pageInput.value = this.CurrentPage;
    }

    showHideDisplayRows(page){
        while(this.Body.DomObj.hasChildNodes()){
            this.Body.DomObj.removeChild(this.Body.DomObj.childNodes[0]);
        }
        if(this.Properties.RowsInPage){
            let firstRow = page * this.Properties.RowsInPage;
            for(let i = firstRow ; (i < firstRow + this.Properties.RowsInPage && i < this.Body.DisplayRows.length) ; i++){
                this.Body.DomObj.appendChild(this.Body.DisplayRows[i].DomObj);
            }
            this.PagingComp=this.buildPagingComp();
            this.DomObj.appendChild(this.PagingComp);
        }
        else{
            for(let i=0 ; i < this.Body.DisplayRows.length ; i++){
                this.Body.DomObj.appendChild(this.Body.DisplayRows[i].DomObj);
            }
        }
    }

    buildSearchComp(){
        let self = this;
        let searchComp = document.createElement('input');
        searchComp.type = 'text';
        searchComp.className = 'ez-search-input';
        searchComp.placeholder = 'Type text to filter';
        searchComp.addEventListener('keyup', ()=>{
            let index=0;
            this.CurrentPage = 1;
            this.Body.DisplayRows = [];
            if(self.Properties.UpdateCallBack){
                this.Body.Rows.forEach((row, index)=>{
                    let foundFlag = false;
                    row.Fields.forEach(field=>{
                        let fieldStruct = (self.TableStruct ? self.TableStruct.getStuctByIndex(field.Index) : null);
                        let fieldType = (fieldStruct ? fieldStruct.Type.toLowerCase() : 'text');
                        if(typeof(field.Value) == 'string'){
                            switch(fieldType){
                                case 'checkbox':
                                break;
                                case 'date':
                                    let fixedValue = field.Value.split('-');
                                    fixedValue = fixedValue[2] + '/' + fixedValue[1] + '/' + fixedValue[0];
                                    if(fixedValue.indexOf(searchComp.value.toLowerCase())!=-1){
                                        foundFlag=true;
                                        return;
                                    }
                                break;
                                case 'select':
                                        let selectName = fieldStruct.SelectName;
                                        let selectSelectedDesc = self.Selects.getDescByValue(selectName, field.Value);
                                        if(selectSelectedDesc && selectSelectedDesc.toLowerCase().indexOf(searchComp.value.toLowerCase())!=-1){
                                            foundFlag=true;
                                            return;
                                    }
                                break;
                                default:
                                    if(field.Value.toLowerCase().indexOf(searchComp.value.toLowerCase())!=-1){
                                        foundFlag=true;
                                        return;
                                    }
                                break;
                            }
                        }
                    });
                    index = this.manageDisplayRows(foundFlag, row, index);
                });
            }
            else{
                this.Body.Rows.forEach(row=>{
                    let foundFlag = false;
                    row.Fields.forEach((field, index)=>{
                        if(typeof(field.Value) == 'string' && field.Value.toLowerCase().indexOf(searchComp.value.toLowerCase())!=-1){
                            foundFlag=true;
                            return;
                        }
                    });
                    index = this.manageDisplayRows(foundFlag, row, index);
                });
            }
            if(this.Properties.RowsInPage)
                 this.showHideDisplayRows(0);
            else{
                this.Body.DisplayRows.forEach(row=>{
                    this.Body.DomObj.appendChild(row.DomObj);
                });
            }
        });
        return searchComp;
    }

    manageDisplayRows(foundFlag, row, index){
        if(foundFlag){
            row.Index = index;
            this.Body.DisplayRows.push(row);
        }
        else if(row.DomObj.parentNode == this.Body.DomObj){
            this.Body.DomObj.removeChild(row.DomObj);
        }
        return index;
    }
}

class TableStruct{
    constructor(data){
        this.Structs=[];
        data.forEach(element => {
            let struct = {
            Type: element.Type,
            Disabled: element.Disabled,
            PHName: element.PHName,
            SelectName: element.SelectName
            };
            this.Structs.push(struct);
        });
        return this;
    }

    getStuctByIndex(index){
        return this.Structs[index];
    }
}

class EzSelect{
    constructor(data){
        this.Selects=[];
        data.forEach(element => {
            let values = [];
            let dictionary = [];
            element.Options.forEach(option=>{
                values.push(option);
                dictionary[option.Value] = option.Desc;
            });
            let select = {
                Name: element.Name,
                Values: values,
                Dictionary: dictionary
            };
            this.Selects[select.Name] = select;
        });
        return this;
    }

    getDescByValue(selectName, value){
        return this.Selects[selectName].Dictionary[value];
    }

    buildSelect(name){
        let select = document.createElement('select');
        this.Selects[name].Values.forEach(selectField =>{
            let option = document.createElement('option');
            option.value = selectField.Value;
            option.text = selectField.Desc;
            select.appendChild(option);
        });
        return select;
    }
}

class EzHeader{
    constructor(data){
        let index=0;
        this.HeaderCols=[];
        data.forEach((element, index)=> {
            let headerCol = {
            Name: element.Name,
            Index: index,
            DomObj: null
            };
            this.HeaderCols.push(headerCol);
        });
        return this;
    }

    buildHeader(table){
        let headerWrapper = document.createElement('div');
        headerWrapper.className = 'ez-header-wrapper';
        this.HeaderCols.forEach(element => {
            let headerCol = document.createElement('div');
            headerCol.className = 'ez-header-col';
            headerCol.textContent = element.Name;
            element.DomObj = headerCol;
            if(table.Properties.Sortable){
                let sortComp = document.createElement('div');
                sortComp.classList = 'ez-arrow ez-bottom-arrow';
                sortComp.addEventListener('click',()=>{
                    this.buildSortComp(element, sortComp, table);
                });
                headerCol.appendChild(sortComp);
            }
            headerWrapper.appendChild(headerCol);
        });
        if(table.Properties.DeleteCallBack){
            let headerCol = document.createElement('div');
            headerCol.className = 'ez-header-col';
            headerCol.textContent = 'Actions';
            headerWrapper.appendChild(headerCol);
        }
        return headerWrapper;
    }

    buildSortComp(headerCol, sortComp, table){
        let ascFlag = true;
        if(sortComp.className=='ez-arrow ez-bottom-arrow'){
            ascFlag = false;
            sortComp.className = 'ez-arrow ez-top-arrow';
        }
        else
             sortComp.className = 'ez-arrow ez-bottom-arrow';
        table.Body.DisplayRows.sort(function (a, b) {
            var aVal = a.Fields[headerCol.Index].Value;
            var bVal = b.Fields[headerCol.Index].Value;
            if (aVal > bVal)
                return ascFlag?-1:1;
            else if (aVal == bVal)
                return 0;
            else (aVal < bVal)
                return ascFlag?1:-1;
        });
        table.showHideDisplayRows(table.CurrentPage-1);
    }
}

class EzBody{
    constructor(data){
        this.DomObj = null;
        this.Rows=[];
        this.DisplayRows=[];
        data.forEach((rows, rowIndex)=>{
            let fields = [];
            rows[0].Values.forEach((field,index)=>{
                fields.push(new EzField(field, index));
            });
            let row = {
                Index:rowIndex,
                Id: rows[0].Id,
                Fields: fields,
                DomObj: null
            }
            this.Rows.push(row);
        });
        return this;
    }

    buildRows(table, rows){
        let domRows = this.buildDomRows(table, rows);
        let body = document.createElement('div');
        body.className = 'ez-body';
        this.DisplayRows = rows;
        this.DomObj = body;
        for(let i=0 ; i<(table.Properties.RowsInPage || domRows.length) && domRows[i] ; i++){
            body.appendChild(domRows[i]);
        }
        return body;
    }

    buildDomRows(table, rows){
        let domRows = [];
        rows.forEach(row =>{
            let domRow = document.createElement('div');
            domRow.className = 'ez-row';
            row.Fields.forEach(field =>{
                let domField = document.createElement('div');
                domField.className = 'ez-field';
                field.DomObj = field.buildField(table);
                field.Parent = row;
                domField.appendChild(field.DomObj);
                domRow.appendChild(domField);
            });
            if(table.Properties.DeleteCallBack){
                let deleteRow = document.createElement('div');
                deleteRow.className = 'ez-field ez-delete-row';
                let deleteBtn = document.createElement('span');
                deleteBtn.textContent = 'DELETE';
                deleteBtn.className = 'ez-btn delete-btn';
                deleteBtn.addEventListener('click',()=>{
                    table.Body.Rows.splice(table.Body.Rows.indexOf(row), 1);
                    table.Body.DisplayRows.splice(table.Body.DisplayRows.indexOf(row), 1);
                    table.showHideDisplayRows(table.CurrentPage-1);
                    window[table.Properties.DeleteCallBack.trim()](row, table.Properties.TableName);
                });
                deleteRow.appendChild(deleteBtn);
                domRow.appendChild(deleteRow);
            }
            row.DomObj=domRow;
            domRows.push(domRow);
        });
        return domRows;
    }
}

class EzField{
    constructor(data, index){
        this.Index = index;
        this.Value = data.Value;
        this.Parent = null;
        this.DomObj = null;
        return this;
    }

    buildField(table){
        let domObj = '';
        if(table.Properties.UpdateCallBack){
            domObj = this.buildDOMField(table);
            (domObj).addEventListener('change', ()=>{
                this.updateField(table);
            });
        }
        else{
            domObj = document.createElement('span');
            domObj.textContent = this.Value;
        }
        return domObj;
    }

    buildDOMField(table){
        let domObj;
        let struct;
        let type;
        let disabled;
        if(table.TableStruct){
            struct = table.TableStruct.getStuctByIndex(this.Index);
            type = struct.Type.toLowerCase();
            disabled = struct.Disabled;
        }
        else{
            type = 'text';
            disabled = false;
        }
        switch(type){
            case 'text':
            case 'number':
            case 'date':
            case 'checkbox':
            domObj = document.createElement('input');
            domObj.type = type;
            if(type=='checkbox'){
                domObj.checked = this.Value;
            }
            else{
            domObj.value = this.Value;
            }
            break;
            case 'select':
            let selectName = struct.SelectName;
            domObj = table.Selects.buildSelect(selectName);
            domObj.value = this.Value;
            break;
        }
        domObj.disabled = disabled;
        return domObj;
    }

    updateField(table){
        let fieldStruct = (table.TableStruct ? table.TableStruct.getStuctByIndex(this.Index) : null);
        let rowId = this.Parent.Id;
        let tableName = table.Properties.TableName;
        let oldValue = this.Value;
        if(this.DomObj.type == 'checkbox'){
            this.Value=this.DomObj.checked;
        }
        else{
            this.Value=this.DomObj.value;
        }
        if(table.Properties.UpdateCallBack){
            window[table.Properties.UpdateCallBack.trim()](this, oldValue, fieldStruct, rowId, tableName);
        }
    }
}

