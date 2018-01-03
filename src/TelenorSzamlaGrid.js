import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Editors } from 'react-data-grid/addons';
import {TarifaTipusSelector} from './utils/TarifaTipusSelector.js'
import './react-data-grid.css'

var Selectors = Data.Selectors;
var DropDownEditor =Editors.DropDownEditor;
var IssueTypesEditor = <DropDownEditor options={TarifaTipusSelector.getTarifaTipusok()}/>;
var BooelanTypesEditor = <DropDownEditor options={[{id: 'true', value: true, text: 'igen', title: 'igen'}, {id: 'false', value: false, text: 'nem', title: 'nem'}]}/>;

const BooleanFormatter = React.createClass({

    render() {
        const bool = this.props.value == 'false' ? false : this.props.value;
        return (<div><img style={{height: '18px'}} src={bool ? "checked.png" : "unchecked.png"} /></div>);
    }
});

//Columns definition
var columns = [
  {
    key: 'id',
    name: 'ID',
    width: 80
  },
  {
    key: 'telefonszam',
    name: 'Telefonszám',
    width: 100,
    filterable: true,
    sortable: true
  },
  {
    key: 'termeknev',
    name: 'Terméknév',
    width: 200,
    editable : true,
    filterable: true,
    sortable: true
  },
  {
    key: 'szamlaTipus',
    name: 'Szmla Tipus',
    editable : true,
    filterable: true,
    sortable: true
  },
  {
    key: 'tipus',
    name: 'Tipus',
    editable : true,
    filterable: true,
    editor : IssueTypesEditor,
    sortable: true
  },
  {
    key: 'tovabbszamlazva',
    name: 'Tovabb',
    editable : true,
    width: 80,
    formatter: BooleanFormatter,
    editor: BooelanTypesEditor
  },
  {
    key: 'mennyiseg',
    name: 'Mennyiség',
  },
  {
    key: 'egyseg',
    name: 'Egység',
    sortable: true
  },
  {
    key: 'nettoegysegar',
    name: 'Egység Ár',
    sortable: true
  },
  {
    key: 'afakulcs',
    name: 'Áfakulcs',
    sortable: true
  },
  {
    key: 'nettoar',
    name: 'Nettó Ár',
    sortable: true
  },
  // {
  //   key: 'afa',
  //   name: 'Áfa',
  // },
  {
    key: 'bruttoar',
    name: 'Brutto Ár',
    sortable: true
  }
]

export class TelenorSzamlaGrid extends Component {

    constructor(props){
        super(props);
    }

    getRows() {
      return Selectors.getRows(this.props);
    }

    rowGetter(rowIdx){
      var rows = this.getRows();
      return rows[rowIdx];
    }

    getSize() {
      return this.getRows().length;
    }

    handleRowUpdated(e){
      //merge updated row with current row and rerender by setting state
      var rows = this.props.rows;
      Object.assign(rows[e.rowIdx], e.updated);
      this.props.updateRows(rows, this.props.filters);
    }

    handleFilterChange(filter){
      var newFilters = Object.assign({}, this.props.filters);
      if (filter.filterTerm) {
        newFilters[filter.column.key] = filter;
      } else {
        delete newFilters[filter.column.key];
      }
      this.props.updateRows(this.props.rows, newFilters);
    }

    onClearFilters(){
      //all filters removed
      this.props.updateRows(this.props.rows, {});
    }

    handleGridSort(sortColumn, sortDirection){

      var comparer = function(a, b) {
        if(sortDirection === 'ASC'){
          return (a[sortColumn] > b[sortColumn]) ? 1 : -1;
        }else if(sortDirection === 'DESC'){
          return (a[sortColumn] < b[sortColumn]) ? 1 : -1;
        }
      }
      var rows = sortDirection === 'NONE' ? this.state.originalRows.slice(0) : this.props.rows.sort(comparer);
      this.props.updateRows(rows, this.props.filters);
    }

    render(){
        return (
            <div className="row">
              <div className="col-xs-12">
                <ReactDataGrid
                  enableCellSelect={true}
                  columns={columns}
                  rowGetter={this.rowGetter.bind(this)}
                  rowsCount={this.getSize()}
                  minHeight={500}
                  onRowUpdated={this.handleRowUpdated.bind(this)}
                  toolbar={<Toolbar enableFilter={true}/>}
                  onAddFilter={this.handleFilterChange.bind(this)}
                  onClearFilters={this.onClearFilters.bind(this)}
                  onGridSort={this.handleGridSort.bind(this)}
                />
              </div>
            </div>
        );
    }
}
