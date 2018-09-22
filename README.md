# EzTable
EzTable Version 0.1, Smart DataTable.<br />
An easy way to convert simpale table to smart datatable.

# Introduction
## How to use
First you need to create the EzTableGenerator object like this:
```
var ezTable = new EzTableGenerator();
```
After you made the object you have 2 options:<br />
1. Build your table with JsonObject you made (if you dont know what i`m talking about you can read about it later in this introduction).
```
ezTable.buildTable(YourJsonObject, 'HTMLTargetSelector');
```
2. Configuration the table build by your own.<br />
For this part you need to use:
```
ezTable.controlPanel();
```
After you use this command a window with 3 labels will appear in the left top corner of your page.<br />
## Properties:
### TableName(string)
describes your table name.<br />
### AddCallBack(string)
if you want to have a row add option to your table you need to write here function name for callback.<br />
### UpdateCallBack(string)
if you want to have a update column option to your table you need to write here function name for callback.<br />
### DeleteCallBack(string)
if you want to have a delete row option to your table you need to write here function name for callback.<br />
### RowsInPage(number)
if you want to add paging to your table its describes how many rows you want per page (0 means no paging).<br />
### EnableSearch(boolean)
enable/disable search input to your table.<br />
### Sortable(boolean)
enable/disable sortable by column to your table. <br />
### Template(select) 
template of your table.<br />

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
