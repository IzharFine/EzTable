// ********************************
// EzTable - Built by Izhar Fine, 
// Release year 2018 - Version 0.1
// ********************************

export class EzTable {
    constructor(data) {
        this.Properties = {
            TableName: data.Properties ? data.Properties[0].TableName || null : null,
            UpdateCallBack: data.Properties ? data.Properties[0].UpdateCallBack || null : null,
            DeleteCallBack: data.Properties ? data.Properties[0].DeleteCallBack || null : null,
            AddCallBack: data.Properties ? data.Properties[0].AddCallBack || null : null,
            EnableSearch: data.Properties ? data.Properties[0].EnableSearch || false : false,
            Sortable: data.Properties ? data.Properties[0].Sortable || false : false,
            ColumnMode: data.Properties ? data.Properties[0].ColumnMode || false : false,
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


    buildTable(targetDOM) {
        let table = document.createElement('div');
        table.className = 'ez-table ' + (this.Properties.ColumnMode ? ' ez-column' : '');
        table.setAttribute('data-template', this.Properties.Template);
        let filtersWrapper = document.createElement('div');
        filtersWrapper.className = 'ez-filters-wrapper';
        table.appendChild(filtersWrapper);
        if (this.Properties.EnableSearch)
            filtersWrapper.appendChild(this.buildSearchComp(table));
        filtersWrapper.appendChild(this.buildHamburgerMenu(table));
        table.appendChild(this.Header.buildHeader(this));
        table.appendChild(this.Body.buildRows(this, this.Body.Rows));
        this.DomObj = table;
        if (this.Properties.RowsInPage) {
            this.PagingComp = this.buildPagingComp();
            this.DomObj.appendChild(this.PagingComp);
        }
        if (targetDOM)
            targetDOM.appendChild(table);
        return table;
    }

    buildHamburgerMenu(table) {
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-hamburger-wrapper';
        let label = document.createElement('span');
        label.className = 'ez-hamburger';
        label.textContent = '☰';
        wrapper.appendChild(label);
        let menu = document.createElement('div');
        menu.className = 'ez-hamburger-menu ez-hide';
        if (this.Properties.AddCallBack)
            menu.appendChild(this.buildAddBtn());
        let pageInRowsInput = this.buildPageInRowsInput(table);
        menu.appendChild(pageInRowsInput);
        let sortSelect = this.buildSortSelect(table)
        menu.appendChild(sortSelect);
        let templateSelect = this.buildTemplateSelect(table);
        menu.appendChild(templateSelect);
        menu.appendChild(this.buildColumnModeSelect(table));
        label.addEventListener('click', () => {
            menu.classList.toggle('ez-hide');
        });
        document.querySelector('body').addEventListener('click', () => {
            if (event.target.parentNode != wrapper && event.target != pageInRowsInput.children[0] && event.target != sortSelect.children[0] && event.target != templateSelect.children[0]) {
                menu.className = 'ez-hamburger-menu ez-hide';
            }
        });
        wrapper.appendChild(menu);
        return wrapper;
    }

    buildPageInRowsInput(table) {
        let wrapper = document.createElement('div');
        wrapper.classList = 'ez-hamburger-line';
        let input = document.createElement('input');
        input.value = this.Properties.RowsInPage;
        input.placeholder = 'No paging';
        input.addEventListener('change', () => {
            this.Properties.RowsInPage = input.value * 1;
            this.CurrentPage = 1;
            this.showHideDisplayRows(0);
        });
        wrapper.appendChild(input);
        return wrapper;
    }

    buildTemplateSelect(table) {
        let wrapper = document.createElement('div');
        wrapper.classList = 'ez-hamburger-line ez-template-select';
        let templateObj = [
            {
                Name: "Templates", Options:
                [{ Value: '', Desc: 'Default' },
                { Value: 'ez-dark', Desc: 'Dark' },
                ]
            }];
        let select = new EzSelect(templateObj);
        select = select.buildSelect('Templates');
        select.value = this.Properties.Template;
        select.addEventListener('change', () => {
            table.setAttribute('data-template', select.value);
        });
        wrapper.appendChild(select)
        return wrapper;
    }

    buildSortSelect() {
        let wrapper = document.createElement('div');
        wrapper.classList = 'ez-hamburger-line ez-sort-select';
        let select = document.createElement('select');
        this.Header.HeaderCols.forEach(ele => {
            let option = document.createElement('option');
            option.textContent = ele.Name + ' ASC';
            option.setAttribute('data-direction', 'asc');
            option.value = ele.Index;
            select.appendChild(option);
            option = document.createElement('option');
            option.textContent = ele.Name + ' DESC';
            option.setAttribute('data-direction', 'desc');
            option.value = ele.Index;
            select.appendChild(option);
        });
        select.addEventListener('change', () => {
            let index = select.options[select.selectedIndex].value;
            let ascFlag = select.options[select.selectedIndex].getAttribute('data-direction') != "asc";
            this.sortTable(index, this, ascFlag);
        });
        wrapper.appendChild(select)
        return wrapper;
    }

    buildColumnModeSelect(table) {
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-hamburger-line';
        let cbox = document.createElement('input');
        cbox.type = 'checkbox';
        cbox.checked = this.Properties.ColumnMode;
        cbox.addEventListener('change', () => {
            table.classList.toggle('ez-column');
        });
        let label = document.createElement('span');
        label.textContent = 'Column Mode:';
        wrapper.appendChild(label);
        wrapper.appendChild(cbox);
        return wrapper;
    }

    buildAddBtn() {
        let wrapper = document.createElement('div');
        wrapper.className = 'ez-hamburger-line';
        let addBtn = document.createElement('input');
        addBtn.type = 'button';
        addBtn.className = 'ez-add-btn';
        addBtn.value = 'ADD ROW';
        addBtn.addEventListener('click', () => {
            addBtn.disabled = true;
            let addDiv = this.buildAddDiv(addBtn);
            this.DomObj.appendChild(addDiv);
            setTimeout(() => { addDiv.className = 'ez-add-div ez-show' }, 500);
        });
        wrapper.appendChild(addBtn);
        return wrapper;
    }

    buildAddDiv(addBtn) {
        let addDiv = document.createElement('div');
        addDiv.className = 'ez-add-div';
        let addFields = [];
        this.Header.HeaderCols.forEach((field, index) => {
            let fieldInput;
            let fieldTemp = {
                Value: ''
            };
            let tempField = new EzField(fieldTemp, index);
            let fieldRow = document.createElement('div');
            let fieldLabel = document.createElement('label');
            fieldLabel.textContent = field.Name;
            if (this.Properties.UpdateCallBack) {
                fieldInput = tempField.buildDOMField(this);
            }
            else {
                fieldInput = document.createElement('input');
            }
            fieldInput.className = 'ez-add-field';
            fieldInput.addEventListener('change', () => {
                if (fieldInput.type == 'checkbox') {
                    tempField.Value = fieldInput.checked;
                }
                else {
                    tempField.Value = fieldInput.value;
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
        submitBtn.addEventListener('click', () => {
            let newRow = [{
                Id: '0', Index: this.Body.Rows.length + 1, Fields:
                addFields
            }];
            this.Body.buildDomRows(this, newRow);
            this.Body.Rows.push(newRow[0]);
            this.showHideDisplayRows(this.CurrentPage - 1);
            addDiv.className = 'ez-add-div';
            setTimeout(() => { addDiv.remove(); }, 500);
            addBtn.disabled = false;
            window[this.Properties.AddCallBack.trim()](newRow[0], this.Properties.TableName);
        });
        let cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.className = 'ez-cancel-add ez-btn';
        cancelBtn.value = 'CANCEL';
        cancelBtn.addEventListener('click', () => {
            addDiv.className = 'ez-add-div'
            setTimeout(() => { addDiv.remove(); }, 500);
            addBtn.disabled = false;
        });
        btnsCont.appendChild(submitBtn);
        btnsCont.appendChild(cancelBtn);
        addDiv.appendChild(btnsCont);
        return addDiv;
    }

    buildPagingComp() {
        if (this.PagingComp) {
            this.DomObj.removeChild(this.PagingComp);
            this.PagingComp = null;
        }
        let row = document.createElement('div');
        row.className = 'ez-paging';
        let leftArrow = document.createElement('div');
        leftArrow.classList = 'ez-arrow ez-left-arrow';
        leftArrow.addEventListener('click', () => {
            pageInput.value = pageInput.value - 1;
            this.changePage(pageInput);
        });
        let rightArrow = document.createElement('div');
        rightArrow.classList = 'ez-arrow ez-right-arrow';;
        rightArrow.addEventListener('click', () => {
            pageInput.value = pageInput.value * 1 + 1;
            this.changePage(pageInput);
        });
        let pageInput = document.createElement('input');
        pageInput.type = 'number';
        pageInput.className = 'ez-change-page';
        pageInput.value = this.CurrentPage;
        pageInput.addEventListener('change', () => {
            this.changePage(pageInput);
        });
        let maxPage = document.createElement('span');
        let maxPageNumber = Math.ceil(this.Body.DisplayRows.length / this.Properties.RowsInPage);
        maxPage.textContent = ' / ' + maxPageNumber;
        let pagingTextCont = document.createElement('span');
        let toPage = ((this.CurrentPage - 1) * this.Properties.RowsInPage + this.Properties.RowsInPage) > this.Body.DisplayRows.length ? this.Body.DisplayRows.length : ((this.CurrentPage - 1) * this.Properties.RowsInPage + this.Properties.RowsInPage);
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

    changePage(pageInput) {
        let maxPageNumber = Math.ceil(this.Body.DisplayRows.length / this.Properties.RowsInPage);
        if (!isNaN(pageInput.value) && pageInput.value > 0 && pageInput.value <= maxPageNumber) {
            this.CurrentPage = pageInput.value;
            this.showHideDisplayRows(pageInput.value - 1);
        }
        else
            pageInput.value = this.CurrentPage;
    }

    showHideDisplayRows(page) {
        while (this.Body.DomObj.hasChildNodes()) {
            this.Body.DomObj.removeChild(this.Body.DomObj.childNodes[0]);
        }
        if (this.Properties.RowsInPage) {
            let firstRow = page * this.Properties.RowsInPage;
            for (let i = firstRow; (i < firstRow + this.Properties.RowsInPage && i < this.Body.DisplayRows.length); i++) {
                this.Body.DomObj.appendChild(this.Body.DisplayRows[i].DomObj);
            }
            this.PagingComp = this.buildPagingComp();
            this.DomObj.appendChild(this.PagingComp);
        }
        else {
            if (this.PagingComp) {
                this.DomObj.removeChild(this.PagingComp);
                this.PagingComp = null;
            }
            for (let i = 0; i < this.Body.DisplayRows.length; i++) {
                this.Body.DomObj.appendChild(this.Body.DisplayRows[i].DomObj);
            }
        }
    }

    buildSearchComp() {
        let self = this;
        let searchComp = document.createElement('input');
        searchComp.type = 'text';
        searchComp.className = 'ez-search-input';
        searchComp.placeholder = 'Type text to filter';
        searchComp.addEventListener('keyup', () => {
            this.CurrentPage = 1;
            this.Body.DisplayRows = [];
            if (self.Properties.UpdateCallBack) {
                this.Body.Rows.forEach((row, index) => {
                    let foundFlag = false;
                    row.Fields.forEach(field => {
                        let fieldStruct = (self.TableStruct ? self.TableStruct.getStuctByIndex(field.Index) : null);
                        let fieldType = (fieldStruct ? fieldStruct.Type.toLowerCase() : 'text');
                        if (typeof (field.Value) == 'string') {
                            switch (fieldType) {
                                case 'checkbox':
                                    break;
                                case 'date':
                                    let fixedValue = field.Value.split('-');
                                    fixedValue = fixedValue[2] + '/' + fixedValue[1] + '/' + fixedValue[0];
                                    if (fixedValue.indexOf(searchComp.value.toLowerCase()) != -1) {
                                        foundFlag = true;
                                        return;
                                    }
                                    break;
                                case 'select':
                                    let selectName = fieldStruct.SelectName;
                                    let selectSelectedDesc = self.Selects.getDescByValue(selectName, field.Value);
                                    if (selectSelectedDesc && selectSelectedDesc.toLowerCase().indexOf(searchComp.value.toLowerCase()) != -1) {
                                        foundFlag = true;
                                        return;
                                    }
                                    break;
                                default:
                                    if (field.Value.toLowerCase().indexOf(searchComp.value.toLowerCase()) != -1) {
                                        foundFlag = true;
                                        return;
                                    }
                                    break;
                            }
                        }
                    });
                    this.manageDisplayRows(foundFlag, row, index);
                });
            }
            else {
                this.Body.Rows.forEach((row, index) => {
                    let foundFlag = false;
                    row.Fields.forEach((field, index) => {
                        if (typeof (field.Value) == 'string' && field.Value.toLowerCase().indexOf(searchComp.value.toLowerCase()) != -1) {
                            foundFlag = true;
                            return;
                        }
                    });
                    this.manageDisplayRows(foundFlag, row, index);
                });
            }
            if (this.Properties.RowsInPage)
                this.showHideDisplayRows(0);
            else {
                this.Body.DisplayRows.forEach(row => {
                    this.Body.DomObj.appendChild(row.DomObj);
                });
            }
        });
        return searchComp;
    }

    manageDisplayRows(foundFlag, row, index) {
        if (foundFlag) {
            row.Index = index;
            this.Body.DisplayRows.push(row);
        }
        else if (row.DomObj.parentNode == this.Body.DomObj) {
            this.Body.DomObj.removeChild(row.DomObj);
        }
    }

    sortTable(colIndex, table, ascFlag) {
        table.Body.DisplayRows.sort(function (a, b) {
            var aVal = a.Fields[colIndex].Value;
            var bVal = b.Fields[colIndex].Value;
            if (aVal > bVal)
                return ascFlag ? -1 : 1;
            else if (aVal == bVal)
                return 0;
            else (aVal < bVal)
            return ascFlag ? 1 : -1;
        });
        table.showHideDisplayRows(table.CurrentPage - 1);
    }
}

export class TableStruct {
    constructor(data) {
        this.Structs = [];
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

    getStuctByIndex(index) {
        return this.Structs[index];
    }
}

export class EzSelect {
    constructor(data) {
        this.Selects = [];
        data.forEach(element => {
            let values = [];
            let dictionary = [];
            element.Options.forEach(option => {
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

    getDescByValue(selectName, value) {
        return this.Selects[selectName].Dictionary[value];
    }

    buildSelect(name) {
        let select = document.createElement('select');
        this.Selects[name].Values.forEach(selectField => {
            let option = document.createElement('option');
            option.value = selectField.Value;
            option.text = selectField.Desc;
            select.appendChild(option);
        });
        return select;
    }
}

export class EzHeader {
    constructor(data) {
        this.HeaderCols = [];
        data.forEach((element, index) => {
            let headerCol = {
                Name: element.Name,
                Index: index,
                DomObj: null
            };
            this.HeaderCols.push(headerCol);
        });
        return this;
    }

    buildHeader(table) {
        let headerWrapper = document.createElement('div');
        headerWrapper.className = 'ez-header-wrapper';
        this.HeaderCols.forEach(element => {
            let headerCol = document.createElement('div');
            headerCol.className = 'ez-header-col';
            headerCol.textContent = element.Name;
            element.DomObj = headerCol;
            if (table.Properties.Sortable) {
                let sortComp = document.createElement('div');
                sortComp.classList = 'ez-arrow ez-bottom-arrow';
                sortComp.addEventListener('click', () => {
                    this.buildSortComp(element, sortComp, table);
                });
                headerCol.appendChild(sortComp);
            }
            headerWrapper.appendChild(headerCol);
        });
        if (table.Properties.DeleteCallBack) {
            let headerCol = document.createElement('div');
            headerCol.className = 'ez-header-col';
            headerCol.textContent = 'Actions';
            headerWrapper.appendChild(headerCol);
        }
        return headerWrapper;
    }

    buildSortComp(headerCol, sortComp, table) {
        let ascFlag = true;
        if (sortComp.className == 'ez-arrow ez-bottom-arrow') {
            ascFlag = false;
            sortComp.className = 'ez-arrow ez-top-arrow';
        }
        else
            sortComp.className = 'ez-arrow ez-bottom-arrow';
        table.sortTable(headerCol.Index, table, ascFlag);
    }
}

export class EzBody {
    constructor(data) {
        this.DomObj = null;
        this.Rows = [];
        this.DisplayRows = [];
        data.forEach((rows, rowIndex) => {
            let fields = [];
            rows[0].Values.forEach((field, index) => {
                fields.push(new EzField(field, index));
            });
            let row = {
                Index: rowIndex,
                Id: rows[0].Id,
                Fields: fields,
                DomObj: null
            }
            this.Rows.push(row);
        });
        return this;
    }

    buildRows(table, rows) {
        let domRows = this.buildDomRows(table, rows);
        let body = document.createElement('div');
        body.className = 'ez-body';
        this.DisplayRows = rows;
        this.DomObj = body;
        for (let i = 0; i < (table.Properties.RowsInPage || domRows.length) && domRows[i]; i++) {
            body.appendChild(domRows[i]);
        }
        return body;
    }

    buildDomRows(table, rows) {
        let domRows = [];
        rows.forEach(row => {
            let domRow = document.createElement('div');
            domRow.className = 'ez-row';
            row.Fields.forEach((field, index) => {
                let domField = document.createElement('div');
                domField.className = 'ez-field';
                domField.setAttribute('ez-title', table.Header.HeaderCols[index].Name);
                field.DomObj = field.buildField(table);
                field.RowParent = row;
                domField.appendChild(field.DomObj);
                if (!index) {
                    let toggleRow = document.createElement('span');
                    toggleRow.textContent = '+';
                    toggleRow.className = 'ez-toggle';
                    toggleRow.addEventListener('click', () => {
                        field.RowParent.DomObj.classList.toggle('ez-show');
                        toggleRow.textContent = toggleRow.textContent == '+' ? '-' : '+';
                    });
                    domField.appendChild(toggleRow);
                }
                domRow.appendChild(domField);
            });
            if (table.Properties.DeleteCallBack) {
                let deleteRow = document.createElement('div');
                deleteRow.className = 'ez-field ez-delete-row';
                let deleteBtn = document.createElement('span');
                deleteBtn.textContent = 'DELETE';
                deleteBtn.className = 'ez-btn delete-btn';
                deleteBtn.addEventListener('click', () => {
                    if (confirm('Are you sure that you want to delete this row?')) {
                        let lengthFix = table.Body.Rows.length;
                        table.Body.DisplayRows.splice(table.Body.DisplayRows.indexOf(row), 1);
                        if (lengthFix == table.Body.Rows.length)
                            table.Body.Rows.splice(table.Body.Rows.indexOf(row), 1);
                        table.showHideDisplayRows(table.CurrentPage - 1);
                        window[table.Properties.DeleteCallBack.trim()](row, table.Properties.TableName);
                    }
                });
                deleteRow.appendChild(deleteBtn);
                domRow.appendChild(deleteRow);
            }
            row.DomObj = domRow;
            domRows.push(domRow);
        });
        return domRows;
    }
}

export class EzField {
    constructor(data, index) {
        this.Index = index;
        this.Value = data.Value;
        this.RowParent = null;
        this.DomObj = null;
        return this;
    }

    buildField(table) {
        let domObj = '';
        if (table.Properties.UpdateCallBack) {
            domObj = this.buildDOMField(table);
            (domObj).addEventListener('change', () => {
                this.updateField(table);
            });
        }
        else {
            domObj = document.createElement('span');
            domObj.className = 'ez-span-field';
            domObj.textContent = this.Value;
        }
        return domObj;
    }

    buildDOMField(table) {
        let domObj;
        let struct;
        let type;
        let disabled;
        if (table.TableStruct) {
            struct = table.TableStruct.getStuctByIndex(this.Index);
            type = struct.Type.toLowerCase();
            disabled = struct.Disabled;
        }
        else {
            type = 'text';
            disabled = false;
        }
        switch (type) {
            case 'text':
            case 'number':
            case 'date':
            case 'checkbox':
                domObj = document.createElement('input');
                domObj.type = type;
                if (type == 'checkbox') {
                    domObj.checked = JSON.parse(this.Value ? this.Value : 0);
                }
                else {
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

    updateField(table) {
        let fieldStruct = (table.TableStruct ? table.TableStruct.getStuctByIndex(this.Index) : null);
        let rowId = this.RowParent.Id;
        let tableName = table.Properties.TableName;
        let oldValue = this.Value;
        if (this.DomObj.type == 'checkbox') {
            this.Value = this.DomObj.checked;
        }
        else {
            this.Value = this.DomObj.value;
        }
        if (table.Properties.UpdateCallBack) {
            window[table.Properties.UpdateCallBack.trim()](this, oldValue, fieldStruct, rowId, tableName);
        }
    }
}
