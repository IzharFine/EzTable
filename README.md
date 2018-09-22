# EzTable
EzTable Version 0.1, Smart DataTable.<br />
An easy way to convert simpale table to smart datatable.

# Introduction
### How to use
First you need to create the EzTableGenerator object like this:
```
var yourTable = new EzTableGenerator();
```
After you made the object you have 2 options:<br />
1. Build your table with JsonObject you made (if you dont know what i`m talking about you can read about it later in this introduction).
```
yourTable.buildTable(YourJsonObject, 'HTMLTargetSelector');
```
2. Config the table build by your own.<br />
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
