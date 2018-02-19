import React, { Component } from 'react';
import { Enums, TarifaTipusSelector } from './utils/TarifaTipusSelector.js'
import { TelenorSzamlaGrid } from './TelenorSzamlaGrid.js'
import 'whatwg-fetch';
import JsonUtils from './utils/JsonUtils.js';
import { korlatlanTarifa, simaTarifa } from './Tarifak';
import TeleoptimumMenu from './TeleoptimumMenu';
import {parseString} from 'xml2js';

export default class SzamlaUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            idoszak: '',
            sorszam: '',
            filters: {},
            brutto: 0,
            telefonszamok: {},
            ugyfelek: [],
            results: {
                telefonszamok: 'hianyzo telefonszamok:'
            },
            step: 'CHECK_TELEFONSZAM'
        }

        fetch(window.CONFIG.backend + '/ugyfelek', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                return response.json()
            }).then((json) => {
                this.setState({ ugyfelek: json })
            }).catch((ex) => {
                console.log('parsing failed', ex)
            })
    }

    handleFileUpoad(event) {
        let f = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            parseString(reader.result, (err, szamlaXml) => {
                this.setState({idoszak: szamlaXml.foszamla.szamla[0].fejlec[0].szamlainfo[0].idoszak[0], sorszam: szamlaXml.foszamla.szamla[0].fejlec[0].szamlainfo[0].sorszam[0]})
                let rows = [];
                let telefonszamok = this.state.telefonszamok;
                let brutto = this.state.brutto;
                let mobilSzamok = szamlaXml.foszamla.szamla.reduce((szamok, szamla) => {
                    return szamok.concat(szamla.tetelek[0].kartyaszintutetelek[0].mobilszam);
                }, []);
                mobilSzamok.forEach(item => {
                    let telefonszam = item.$.ctn;
                    telefonszamok[telefonszam] = { telefonszam: telefonszam, tipus: 'sima', kedvezmeny: 0, ugyfel: {}, kartyatipus: 'adat' };
                    let mapTetel = (tetel, tipus) => {
                        let row = {};
                        row.id = rows.length + 1;
                        row.telefonszam = telefonszam;
                        row.termeknev = tetel.termeknev[0];
                        let parseMennyiseg = function(mennyiseg) {
                            if (!mennyiseg) {
                                return 1;
                            }
                            mennyiseg = mennyiseg[0];
                            if (mennyiseg.match(/(.+):(.+):(.+)/)) {
                                let timeInMinutes = 0;
                                let idok = mennyiseg.split(":");
                                timeInMinutes += parseInt(idok[0]) * 60;
                                timeInMinutes += parseInt(idok[1]);
                                timeInMinutes += parseInt(idok[2]) / 60;
                                return +(timeInMinutes.toFixed(2));
                            } else {
                                return parseFloat(mennyiseg.replace(',', '.'));
                            }
                        }
                        row.mennyiseg = parseMennyiseg(tetel.menny);
                        tetel.mennyegys ? row.egyseg = tetel.mennyegys[0] : row.egyseg = '';
                        row.bruttoar = parseFloat(tetel.bruttoar[0].replace(',', '.'));
                        row.nettoar = tetel.nettoar ? parseFloat(tetel.nettoar[0].replace(',', '.')) : row.bruttoar;
                        row.tipus = (tipus == '' ? TarifaTipusSelector.findTipus(row.termeknev) : tipus);
                        tetel.afakulcs ? row.afakulcs = parseInt(tetel.afakulcs[0]) : row.afakulcs = (function() {
                            return Math.round((row.bruttoar / row.nettoar - 1) * 100);
                        })();
                        let egysegAr = tetel.nettoegysegar ? tetel.nettoegysegar[0] : "";
                        egysegAr.match(/\d+/) ? row.nettoegysegar = parseFloat(egysegAr.replace(',', '.')) : row.nettoegysegar = (function() {
                            return row.nettoar / row.mennyiseg;
                        })();
                        if (row.nettoegysegar == 2600 && row.termeknev == 'Üzleti elõfizetés'){
                            telefonszamok[telefonszam].tipus = 'korlatlan';
                        }
                        if (row.termeknev == 'Üzleti elõfizetés'){
                            telefonszamok[telefonszam].kartyatipus = 'hangalapu';
                        }
                        row.szamlaTipus = 'ismeretlen';
                        row.tovabbszamlazva = true;
                        brutto += row.bruttoar;
                        row = this.editEuRoaming(row);
                        rows.push(row);
                    }
                    JsonUtils.traverseJson(item, mapTetel, '');
                });
                this.setState({ rows: rows, brutto: brutto });
            });
        }

        // Read in the image file as a data URL.
        reader.readAsText(f);
    }

    editEuRoaming(row){
        if (row.termeknev.toLowerCase().includes("roaming") && 
                row.termeknev.toLowerCase().includes("1. zóna") &&
                row.nettoegysegar == 8){
            row.egysegAr = 12.0;
            row.nettoegysegar = 12.0;
            row.nettoar = row.egysegAr * row.mennyiseg;
            row.bruttoar = row.nettoar * (100 + row.afakulcs) / 100;
        }
        return row;
    }

    checkTelefonszamok() {
        let error = false;
        for (let i in this.state.telefonszamok) {
            let telefonszam = i.replace(new RegExp('-', 'g'), '');
            let ugyfel = this.state.ugyfelek.find(elem => {
                let szam = elem.telefonszamok.find(teloszam => teloszam.telefonszam == telefonszam)
                return szam && szam.telefonszam == telefonszam;
            });
            if (ugyfel == undefined) {
                let results = this.state.results;
                results.telefonszamok += " " + telefonszam;
                this.setState({ results: results });
                error = true;
            } else {
                console.log(ugyfel);
                this.state.telefonszamok[i].ugyfel = ugyfel;
            }
        }
        if (!error) {
            this.setState({ step: 'MERGE' })
        }
    }

    findTipusKedvezmeny() {
        let newRows = []
        this.state.rows.forEach(row => {
            let newRow = JSON.parse(JSON.stringify(row));
            let additionalInfo = this.state.telefonszamok[row.telefonszam];
            let oneToOne = additionalInfo.ugyfel.needsSpecialInvoice == 3
            newRow.szamlaTipus = additionalInfo.tipus;
            newRow.tovabbszamlazva = oneToOne || Enums[newRow.tipus].tovabbszamlazva[newRow.szamlaTipus];
            if (!oneToOne) {
                if (newRow.szamlaTipus == 'sima' && TarifaTipusSelector.isKedvezmenyes(newRow.tipus)) {
                    additionalInfo.kedvezmeny += newRow.mennyiseg;
                }
            }
            newRows.push(newRow);
        });
        this.setState({ rows: newRows, step: 'CONVERT' });
    }

    mergeRows() {
        try {
            var rows = [];
            this.state.rows.forEach((row) => {
                if (this.state.telefonszamok[row.telefonszam].ugyfel.needsSpecialInvoice == 3) {
                    rows.push(row);
                }else if (this.state.telefonszamok[row.telefonszam].ugyfel.needsSpecialInvoice == 1){
                    //leave out
                } else {
                    this.findAndMergeRow(rows, row);
                }
            });
            this.setState({ rows: rows, step: 'DISCOUNTS' });
        } catch (e) {
            let results = this.state.results;
            results.merge = e;
            this.setState({results: results});
        }
    }

    findAndMergeRow(rows, row) {
        for (let i = 0; i < rows.length; i++) {
            let currentRow = rows[i];
            if (currentRow.telefonszam == row.telefonszam && currentRow.termeknev == row.termeknev) {
                currentRow.mennyiseg += row.mennyiseg;
                currentRow.nettoar += row.nettoar;
                currentRow.bruttoar += row.bruttoar;
                return;
            }
        }
        rows.push(row);
    }

    convertTetelek() {
        let newRows = [];
        let brutto = 0;
        let szorzo = 1;
        this.state.rows.forEach(row => {
            let newRow = JSON.parse(JSON.stringify(row));
            if (this.state.telefonszamok[row.telefonszam].ugyfel.needsSpecialInvoice == 3) {
                newRows.push(newRow)
            }else if (this.state.telefonszamok[row.telefonszam].ugyfel.needsSpecialInvoice == 1){
                return;
            } else {
                let tarifa = []
                if (row.szamlaTipus == 'sima') {
                    tarifa = simaTarifa;
                } else {
                    tarifa = korlatlanTarifa;
                }
                let tarifaElem = tarifa.find(element => element.tipus == row.tipus);
                if (Enums[newRow.tipus].egyseg) {
                    newRow.egyseg = Enums[newRow.tipus].egyseg;
                    newRow.mennyiseg = Enums[newRow.tipus].mennyiseg;
                }
                if (tarifaElem) {
                    newRow.nettoegysegar = tarifaElem.nettoegysegar;
                    newRow.afakulcs = tarifaElem.afakulcs;
                    newRow.nettoar = newRow.nettoegysegar * newRow.mennyiseg;
                    newRow.bruttoar = newRow.nettoar * (100 + newRow.afakulcs) / 100;
                }
                szorzo = this.adjustHavidijak(row, newRow);
                if (newRow.tovabbszamlazva) {
                    brutto += newRow.bruttoar;
                }
                newRows.push(newRow);

            }
        });
        for (let prop in this.state.telefonszamok) {
            let telProp = this.state.telefonszamok[prop];
            if (telProp.ugyfel.needsSpecialInvoice == 1 || telProp.ugyfel.needsSpecialInvoice == 3){
                continue;
            }
            if (telProp.kedvezmeny > 0) {
                newRows.push(this.createForgalmidijKedvezmenyTetel(newRows.length + 1, telProp));
            }
            if (telProp.tipus == 'sima' && telProp.kartyatipus === "hangalapu"){
                newRows.push(this.createEgycsoport(newRows.length + 1, telProp, szorzo));
            }
        }
        this.setState({ rows: newRows, brutto: brutto, step: 'GENERATE' });
    }

    adjustHavidijak(row, newRow){
        let szorzo = 1;
        if (row.tipus.match(/(HAVIDIJ|MOBIL_INTERNET_*)/) && row.nettoar / row.nettoegysegar < 1){
            szorzo = row.nettoar / row.nettoegysegar;
            newRow.nettoar = newRow.nettoegysegar * szorzo;
            newRow.bruttoar = newRow.nettoar * (100 + newRow.afakulcs) / 100;
        }
        return szorzo;
    }

    createForgalmidijKedvezmenyTetel(id, telefonszamProp) {
        let tetel = {};
        tetel.id = id;
        tetel.telefonszam = telefonszamProp.telefonszam;
        tetel.termeknev = 'Forgalmidij-kedvezmeny';
        tetel.mennyiseg = Math.min(telefonszamProp.kedvezmeny, 150);
        tetel.egyseg = 'perc';
        tetel.nettoegysegar = -12;
        tetel.nettoar = tetel.nettoegysegar * tetel.mennyiseg;
        tetel.afakulcs = 27;
        tetel.bruttoar = tetel.nettoar * (100 + tetel.afakulcs) / 100;
        tetel.tipus = 'KEDVEZMENY';
        tetel.szamlaTipus = 'sima';
        tetel.tovabbszamlazva = true;
        return tetel;
    }

    createEgycsoport(id, telefonszamProp, szorzo) {
        let tetel = {};
        tetel.id = id;
        tetel.telefonszam = telefonszamProp.telefonszam;
        tetel.termeknev = 'Egycsoport';
        tetel.mennyiseg = 1;
        tetel.egyseg = 'honap';
        tetel.nettoegysegar = 400;
        tetel.nettoar = tetel.nettoegysegar * tetel.mennyiseg * szorzo;
        tetel.afakulcs = 27;
        tetel.bruttoar = tetel.nettoar * (100 + tetel.afakulcs) / 100;
        tetel.tipus = 'EGYEB';
        tetel.szamlaTipus = 'sima';
        tetel.tovabbszamlazva = true;
        return tetel;
    }

    updateRows(rows, filters) {
        this.setState({ rows: rows, filters: filters })
    }

    navigateToSzamlaGenerator() {
        localStorage.setItem('telefonszamok', JSON.stringify(this.state.telefonszamok));
        localStorage.setItem('rows', JSON.stringify(this.state.rows));
        localStorage.setItem('idoszak', this.state.idoszak);
        localStorage.setItem('sorszam', this.state.sorszam);
        location.replace('#/generate');
    }

    render(){
    return (
        <div>
            <TeleoptimumMenu active='szamlak'/>
            <div className="container" style={{width: '80%'}}>
                <div className="row">
                    <div className="col-xs-12">
                        <form>
                            <div className="form-group" style={{float:"left"}}>
                                <label htmlFor="szamlaInput">Havi szamla</label>
                                <input type="file" id="szamlaInput" onChange={this.handleFileUpoad.bind(this)}/>
                                <p className="help-block">{this.state.idoszak}</p>
                                <p className="help-block">{this.state.sorszam}</p>
                            </div>
                            {/*<div className="form-group" style={{float:"left"}}>
                                <label htmlFor="szamlaInput">Extra szamla</label>
                                <input type="file" id="szamlaInput" onChange={this.handleFileUpoad.bind(this)}/>
                                <p className="help-block">{this.state.idoszak}</p>
                            </div>*/}
                        </form>
                    </div>
                </div>
                <TelenorSzamlaGrid rows={this.state.rows} updateRows={this.updateRows.bind(this)} filters={this.state.filters}/>
                <div className="row">
                    <div className="col-xs-10"></div>
                    <div className="col-xs-2">
                        Brutto: {this.state.brutto}
                    </div>
                </div>    
                {this.state.step == 'CHECK_TELEFONSZAM' ? 
                (<div className="row">
                    <div className="col-xs-6">
                        <button className="btn btn-primary active" onClick={this.checkTelefonszamok.bind(this)} role="button">Telefonszamok ellenorzese</button>  
                    </div>
                    <div className="col-xs-6">
                        {this.state.results.telefonszamok}
                    </div>
    
                </div>) : ""}

                {this.state.step == 'MERGE' ? 
                (<div className="row">
                  <div className="col-xs-6">
                  <button className="btn btn-primary active" onClick={this.mergeRows.bind(this)} role="button">Azonos tetel osszevonasa</button>
                  </div>
                  <div className="col-xs-6">
                  {this.state.results.merge}
                  </div>
                  </div>)  : ""}

                {this.state.step == 'DISCOUNTS' ? 
                (<div className="row">
                <div className="col-xs-6">
                <button className="btn btn-primary active" onClick={this.findTipusKedvezmeny.bind(this)} role="button">Kedvezmenyek szamitasa</button>
                </div>
                <div className="col-xs-6">
                {this.state.results.kedvezmenyek}
                </div>
                </div>) : ""}
                {this.state.step == 'CONVERT' ?
                (<div className="row">
                <div className="col-xs-6">
                <button className="btn btn-primary active" onClick={this.convertTetelek.bind(this)} role="button">Tetelek konvertalasa</button>
                </div>
                <div className="col-xs-6">
                {this.state.results.konvertalas}
                </div>
                </div> ) : ""}
                {this.state.step == 'GENERATE' ?    
                (<div className="row">
                  <div className="col-xs-6">
                  <button className="btn btn-primary active" onClick={this.navigateToSzamlaGenerator.bind(this)} role="button">Szamlak letrehozasa</button>
                  </div>
                  <div className="col-xs-6">
                  
                  </div>
                  </div>) : ""}
            </div>
        </div>
      );
}


}
