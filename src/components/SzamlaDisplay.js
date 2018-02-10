import React, {Component} from 'react';

export default class SzamlaDisplay extends Component{

    constructor(args){
        super(args);
        this.dateFormat = "YYYY-MM-DD";
    }

    render(){
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6">
                        <h2>SZÁMLA</h2>
                    </div>
                    <div className="col-xs-6">
                        <span className="sorszam">{this.props.szamla.szamlaSorszam}</span>
                        <span className="sorszam-title">Sorszám:
                        </span>
                    </div>
                </div>
                <div className="row" style={{border: "1px solid black"}}>
                    <div
                        className="col-xs-6"
                        style={{ borderRight: "1px solid black" }}>
                        A számlakibocsátó neve, címe:<br/>
                        <b>TeleOptimum Kft.</b><br/>
                        <br/>
                        7700 Mohács<br/>
                        Péter utca 27.<br/>
                        <br/>
                        Adószám: 23436686-2-02<br/>
                        <br/>
                        Bankszámla: 10700718-66663027-51100005<br/>
                        <br/>
                        Bank neve: CIB Bank Zrt.<br/>
                        Cégj.szám: 01-09-965601<br/>

                    </div>
                    <div className="col-xs-6">
                        Vásárló neve, címe:<br/>
                        <b>{this.props.szamla.nev}</b><br/>
                        <br/> {this.props.szamla.cim.iranyitoszam} {this.props.szamla.cim.varos}<br/> 
                        {this.props.szamla.cim.kozterulet} {this.props.szamla.cim.kozterulet_tipus} {this.props.szamla.cim.haz_szam}
                        <br/> 
                        <br/>
                        Adószám: {this.props.szamla.adoszam}<br/>
                    </div>
                </div>
                <div
                    className="row"
                    style={{
                        fontSize: "12px",
                        borderBottom: "1px solid black"
                    }}>
                    <div className="col-xs-2">
                        <b>A fizetés módja:</b><br/> {this.props.szamla.fizetesiMod}
                    </div>
                    <div className="col-xs-3">
                        <b>Teljesítés dátuma:</b><br/> {this.props.szamla.teljesites.format(this.dateFormat)}
                    </div>
                    <div className="col-xs-2">
                        <b>Számla kelte:</b><br/> {this.props.szamla.kelte.format(this.dateFormat)}
                    </div>
                    <div className="col-xs-3">
                        <b>Fizetés határideje:</b><br/> {this.props.szamla.hatarido.format(this.dateFormat)}
                    </div>
                    <div className="col-xs-2 right-align">
                        <b>Pénznem:</b><br/>
                        <span
                            style={{
                            fontSize: "20px"
                        }}>
                            <b>HUF</b>
                        </span>
                    </div>
                </div>
                <div className="row tetel-table-header">
                    A termék vagy szolgáltatás
                </div>
                <div className="row tetel-table-header">
                    <div className="col-xs-3 no-border">
                        megnevezése, egyéb adatai
                    </div>
                    <div className="col-xs-1">
                        menny
                    </div>
                    <div className="col-xs-1">
                        egyseg
                    </div>
                    <div className="col-xs-3">
                        <div className="row">
                            <div className="col-xs-6">
                                netto egységár
                            </div>
                            <div className="col-xs-6 border-left">
                                netto ár
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-1">
                        ÁFA kulcs
                    </div>
                    <div className="col-xs-3">
                        <div className="row">
                            <div className="col-xs-6">
                                ÁFA
                            </div>
                            <div className="col-xs-6 border-left">
                                Brutto
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.szamla.szamlaTetelek
                    .map(tetel => {
                        return (
                            <div key={tetel.telefonszam}>
                                <div
                                    className="row"
                                    style={{
                                    fontSize: "12px"
                                }}>
                                    <div className="col-xs-3">
                                        {tetel.megnevezes}
                                    </div>
                                    <div className="col-xs-1">
                                        {tetel.mennyiseg}
                                    </div>
                                    <div className="col-xs-1">
                                        {tetel.egyseg}
                                    </div>
                                    <div className="col-xs-3">
                                        <div className="row">
                                            <div className="col-xs-6 right-align">
                                                {tetel
                                                    .nettoegysegar
                                                    .toFixed(2)}
                                            </div>
                                            <div className="col-xs-6 right-align">
                                                {(tetel.nettoegysegar * tetel.mennyiseg).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-1">
                                        {tetel.afakulcs}
                                    </div>
                                    <div className="col-xs-3">
                                        <div className="row">
                                            <div className="col-xs-6 right-align">
                                                {(tetel.nettoar * (tetel.afakulcs) / 100).toFixed(2)}
                                            </div>
                                            <div className="col-xs-6 right-align">
                                                {(tetel.nettoegysegar * tetel.mennyiseg * (100 + tetel.afakulcs) / 100).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                <div className="row gray">
                    <div className="col-xs-6 bold">
                        Számlaérték Áfá-val növelten:
                    </div>
                    <div
                        className="col-xs-6 right-align"
                        style={{
                        fontSize: "32px",
                        fontWeight: "bold"
                    }}>
                        {this.props.szamla
                            .szamlaTetelek
                            .reduce((prev, current) => prev + current.bruttoar, 0)
                            .toFixed(2)}
                    </div>
                </div>
            </div>    
        )
    }
}