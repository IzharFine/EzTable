# EzTable 0.1
Smart DataTable, built by Izhar Fine.<br />
An easy way to convert simpale table to smart datatable.

# Introduction
## How to use
First you need to add refernces to the js and css files:
```
<script src="yourPath/eztable.js"></script>
<link rel="stylesheet" type="text/css" href="yourPath/eztable.css">
```
then you need to create the EzTableGenerator object:
```
var ezTable = new EzTableGenerator();
```
After you made the object you have 2 options:<br />
1. Build your table with JsonObject you made (more information about EzTable JsonObject later in this introduction).
```
ezTable.buildTable(YourJsonObject, 'HTMLTargetSelector');
```
2. Configuration the table build by your own.<br />
For this part you need to use:
```
ezTable.controlPanel();
```
After you use this command a window with 3 labels will appear in the left top corner of your page.<br />
The struct and selects labels are not required but they can improve your table.
## Properties:
### TableName(string)
Describes your table name.<br />
### AddCallBack(string)
If you want to have a row add option to your table you need to write here function name for callback.<br />
### UpdateCallBack(string)
If you want to have a update column option to your table you need to write here function name for callback.<br />
### DeleteCallBack(string)
If you want to have a delete row option to your table you need to write here function name for callback.<br />
### RowsInPage(number)
If you want to add paging to your table its describes how many rows you want per page (0 means no paging).<br />
### EnableSearch(boolean)
Enable/disable search input to your table.<br />
### Sortable(boolean)
Enable/disable sortable by column to your table. <br />
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

After you finish to custom your table you can save the settings:
```
var properties = JSON.stringify(ezTable.Properties);
var struct = JSON.stringify(ezTable.TableStruct);
var selects = JSON.stringify(ezTable.Selects);
```


In this case you need an exist table in your DOM in this struct:
```
<table>
<thead>
<tr>
<th>TITLE</th>
</tr>
</thead>
<tbody>
<tr>
<td>TEXT</td>
</tr>
</tbody>
</table>
```
