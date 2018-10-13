# EzTable 0.1
Smart DataTable, built in JavaScript ES6 & CSS by Izhar Fine.<br />
An easy way to convert simple table to smart DataTable.

# Introduction
Demo: https://izharfine.github.io/EzTable/
## How to use
First you need to add refernces to the js and css files like this:
```
<script type="module">
    import { EzTableGenerator } from "yourPath/eztablegenerator.js";
    window["EzTableGenerator"] = EzTableGenerator;
</script>
<link rel="stylesheet" type="text/css" href="yourPath/eztable.css">
```
Then you need to create the EzTableGenerator object:
```
let ezTable = new EzTableGenerator();
```
After that you have to load your table object.<br />
Your table object Can be an JsonObject or DOMTable (you can see bouth structs later in this introduction).
* Your table object MUST contain at least the table header.
```
ezTable.loadTable(YourTableObject);
```
After that you can use the control panel to configuration the table build by your own (this part not required, the table have default configuration):<br />
```
ezTable.controlPanel();
```
After you use this command a window with 3 labels will appear in the left top corner of your page (more information about this you can read later in this introduction).<br />
When you finish this steps your table is ready to set:<br />
```
eztable.buildTable(TargetDOMSelector);
```
# Important notes and more information:
## Valid DOM table struct (you must have the header section, you dont need to have rows in your tbody but must have the tbody section).:
```
<table>
<thead>
<tr>
<th>TITLE</th>
</tr>
</thead>
<tbody>
<tr data-id="5">
<td>TEXT</td>
</tr>
</tbody>
</table>
```
* Note:
data-id attribute desctibe the identity in the DB and its required only if u need it for UpdateCallBack/DeleteCallBack. <br />

## After you finish to custom your table with the control panel you can save the settings:
```
let properties = JSON.stringify(ezTable._Properties);
let struct = JSON.stringify(ezTable._TableStruct);
let selects = JSON.stringify(ezTable._Selects);
```
* And re-use it in that way:
```
ezTable._Properties = JSON.parse(properties);
ezTable._TableStruct = JSON.parse(struct);
ezTable._Selects = JSON.parse(selects);
```
## Valid full build of EzTable JsonObject:
```
var JsonObject = {
    Properties:[{
        AddCallBack: 'add',
        UpdateCallBack: 'update',
        DeleteCallBack: 'delete',
        EnableSearch: true,
        Sortable: true,
        ColumnMode: false,
        RowsInPage: 2,
        TableName: 'ez-table',
        Template: ''
    }],
    Selects:[
            { Name: "Genders", Options:
            [{Value: '1', Desc: 'Male'},
            {Value: '2', Desc: 'Female'}]
        },
        { Name: "Test", Options:
            [{Value: '1', Desc: 'Test'},
            {Value: '2', Desc: 'Me'}]
        }
    ],
    TableStruct:[
        {
            PHName:'USR_First_Name',
            Type:'Text',
            Disabled:false,
            SelectName: ''
        },
        {
            PHName:'USR_Last_Name',
            Type:'Text',
            Disabled:true,
            SelectName: ''
        },
        {
            PHName:'USR_Birthday',
            Type:'Date',
            Disabled:false,
            SelectName: ''
        },
        {
            PHName:'USR_Active',
            Type:'Checkbox',
            Disabled:false,
            SelectName: ''
        },
        {
            PHName:'USR_Gender',
            Type:'Select',
            Disabled:false,
            SelectName: 'Genders'
        }
    ],
    Header:[
        {
            Name:'First Name',
        },
        {
            Name:'Last Name',
        },
        {
            Name:'Birthday',
        },
        {
            Name:'Active',
        },
        {
            Name:'Gender',
        }
    ],
    Body: [
            [{ Id: "1", Values:
            [{Value: 'Moshe'},
            {Value: 'Cohen'},
            {Value: null},
            {Value: false},
            {Value: '1'}]
        }],
        [{ Id: "2", Values:
            [
                {Value: 'Izhar'},
                {Value: 'Fine'},
                {Value: '1990-03-11'},
                {Value: true},
                {Value: '1'}]
     }],
     [{ Id: "5", Values:
            [
                {Value: 'Yakir'},
                {Value: 'Karsish'},
                {Value: '1990-06-11'},
                {Value: true},
                {Value: '1'}]
     }],
    ]
};
```
### More information about the control panel part:
## Properties:
### TableName(string)
Describes your table name.<br />
### AddCallBack(string)
If you want to have a row add option to your table you need to write here function name for callback.<br />
The callback will get 2 parameters:<br />
1. New row object.<br />
2. Table Name.<br />
* PAY ATTENTION!<br />
The new row ID is 0 by default, you probably will have change it and set the new row ID you got from the server for instant Update/Delete functions.<br />
### UpdateCallBack(string)
If you want to have a update column option to your table you need to write here function name for callback.<br />
The callback will get 5 parameters:<br />
1. Changed field object. <br />
2. Old field value. <br />
3. Field struct.<br />
4. Row ID.<br />
5. Table name.<br />
### DeleteCallBack(string)
If you want to have a delete row option to your table you need to write here function name for callback.<br />
The callback will get 2 parameters:<br />
1. Row ID.<br />
2. Table Name.<br />
### RowsInPage(number)
If you want to add paging to your table its describes how many rows you want per page(0 means no paging), better performance for big tables.<br />
### EnableSearch(boolean)
Enable/disable search input to your table.<br />
### Sortable(boolean)
Enable/disable sortable by column to your table. <br />
### ColumnMode(boolean)
Table view mode. <br />
### Template(string) 
Template of your table.<br />

## Struct:
In this part you can describe each column (its especially helps with the UpdateCallBack and AddCallBack parts).<br />
You should add structs as many as your columns length, each struct describes 1 column by index.<br />
You can add struct object by click on the add object button.
### PHName(string)
Physical name of the column.
### Type(string)
Type of the column.
### Disabled(boolean)
Enable/disable (only relevant if using the UpdateCallBack/AddCallBack).
### SelectName(string)
Select name that belong to the column (only relevant if using the UpdateCallBack/AddCallBack and you want to add dropdown (select)).<br />

## Selects:
In this part you can add dropdowns (selects) to your table.<br />
You can add select object by click on the add object button and add option object by click the add button.<br />
### Name(string)
Name of the select (the identity).
### Value(string)
Option value.
### Desc(string)
Option description.
<br /><br />
### Because it wrote with ES6 module its work only in server (local server can be good too).
### Enjoy! :)
