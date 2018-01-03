import React, { Component } from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';
import UgyfelEditor from './UgyfelEditor';

export default class Ugyfelek extends Component {

    constructor(props){
        super(props);
        this.state = {
            ugyfelek: []            
        }
        this.getUgyfelek();
        this.originUgyfelek;
    }

    getUgyfelek(){
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
            this.originUgyfelek = json;
            this.setState({ ugyfelek: json })
        }).catch((ex) => {
            console.log('parsing failed', ex)
        });
    }

    convertCimToString(cim) {
        var strCim = "";
        strCim += cim.kozterulet + " ";
        strCim += this.isNotBlank(cim.kozterulet_tipus) ? cim.kozterulet_tipus + " " : "";
        strCim += this.isNotBlank(cim.haz_szam) ? cim.haz_szam + " " : "";
        strCim += this.isNotBlank(cim.emelet) ? cim.emelet + " em " : "";
        strCim += this.isNotBlank(cim.ajto) ? cim.ajto : "";
        strCim += " " + cim.varos + " " + cim.iranyitoszam;
        return strCim;
    }

    isBlank(param){
        if (param === null || param.trim() === ""){
            return true;
        }else{
            return false;
        }
    }

    isNotBlank(param){
        return !this.isBlank(param);
    }

    cancel(reload = false){
        this.setState({selectedUgyfel: null});
        if (reload){
            this.getUgyfelek();
        }
    }

    addNewUgyfel(){
        let ugyfel = {
            id:null,
            version:0,
            nev:"",
            ugyfelKod:"",
            fizetesiMod:"",
            szamlaSzam:"",
            email:"",
            adoszam:"",
            szamlaEmailben: false,
            ugyfelTipus:"magan",
            ceg_jegyzek_szam:"",
            kacsolat_tarto_nev:"",
            kapcsolat_tarto_sz_ig_szam:"",
            kapcsolat_tarto_tsz:"",
            anyja_neve:"",
            egyeb_telefonszam:"",
            sz_hely_ido:"",
            szem_ig_szam:"",
            needsSpecialInvoice:0,
            cimek:[  
                {  
                    orszag:"Magyarország",
                    varos:"",
                    kozterulet:"",
                    kozterulet_tipus:"",
                    haz_szam:"",
                    emelet:"",
                    ajto:"",
                    iranyitoszam:'',
                    tipus:"ALLANDO"
                },
                {  
                    orszag:"Magyarország",
                    varos:"",
                    kozterulet:"",
                    kozterulet_tipus:"",
                    haz_szam:"",
                    emelet:"",
                    ajto:"",
                    iranyitoszam:'',
                    tipus:"LEVELEZESI"
                }
            ]
        }
        this.setState({selectedUgyfel: ugyfel});
    }

    renderUgyfelRow(){
        return this.state.ugyfelek.map((ugyfel, idx) => {
            return (
                <tr key={idx} className="project">
                    <td><span style={{cursor: "pointer"}} onClick={() => {this.setState({selectedUgyfel: ugyfel})}}>{ugyfel.nev}</span></td>
                    <td>
                        <ul>
                            {ugyfel.telefonszamok.map((telefonszam, idx) => {
                                return <li key={idx}>{telefonszam.telefonszam}</li>
                            })}
                        </ul>
                    </td>
                    <td>{ugyfel.email}</td>
                    <td>{ugyfel.cimek.map((cim, idx) => {return (<div key={idx}>{cim.tipus}: {this.convertCimToString(cim)}</div>)})}</td>
                </tr>
            );
        })
    }

    filterUgyfelek(toFilter){
        if (toFilter.trim() === ""){
            this.setState({ugyfelek: this.originUgyfelek});
        }else {
            let filtered = this.originUgyfelek.filter(ugyfel => ugyfel.nev.includes(toFilter));
            this.setState({ugyfelek: filtered});
        }
    }

    renderUgyfelTabla(){
        return (
            <div>
                <div className="row">
                    <div className="col-xs-6" style={{textAlign: "left"}}>
                        <button className="btn btn-primary" 
                                        onClick={this.addNewUgyfel.bind(this)}>Uj ugyfel</button>
                    </div>
                    <div className="col-xs-6" style={{textAlign: "right"}}>
                        <input type="text" className="form-control" 
                                    onChange={(event) => this.filterUgyfelek(event.target.value)}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12">
                        <table className="table table-striped" id="ugyfelTable">
                            <thead>
                                <tr>
                                    <th>Nev</th>
                                    <th>Telefonszamok</th>
                                    <th>Email</th>
                                    <th>Cim</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderUgyfelRow()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    render(){
        return (
            <div>
                <TeleoptimumMenu active='ugyfelek'>
            	</TeleoptimumMenu>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            {this.state.selectedUgyfel ? 
                                <UgyfelEditor user = {this.props.user}
                                              ugyfel={this.state.selectedUgyfel} 
                                              cancel={this.cancel.bind(this)}
                                              cimToString={this.convertCimToString.bind(this)}/> : this.renderUgyfelTabla()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}