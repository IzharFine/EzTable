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
1. Build your table with JsonObject you made.
```
example of valid EzTable JsonObject:
var JsonObject = {
    Properties:[{
        AddCallBack: 'add',
        UpdateCallBack: 'update',
        DeleteCallBack: 'delete',
        EnableSearch: true,
        Sortable: true,
        RowsInPage: 4,
        TableName: '',
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
     [{ Id: "6", Values:
            [
                {Value: 'Itay'},
                {Value: 'Velner'},
                {Value: '1989-06-18'},
                {Value: true},
                {Value: '1'}]
     }],
     [{ Id: "7", Values:
            [
                {Value: 'Moran'},
                {Value: 'Fine'},
                {Value: '1985-03-18'},
                {Value: true},
                {Value: '2'}]
     }],
     [{ Id: "9", Values:
            [
                {Value: 'Tamara'},
                {Value: 'Vaisman'},
                {Value: '1991-19-10'},
                {Value: true},
                {Value: '2'}]
     }],
    ]
};
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
