import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TeleoptimumMenu from './TeleoptimumMenu';
import SzamlaKep from './SzamlaKep';

const POSTAI_CSEKK = "POSTAI_CSEKK";
const ATUTALAS = 'ATUTALAS';
export default class Szamlak extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            szamlak: [],
            from: moment().date(1),
			to: moment(),
            detailedSzamla: null,
            printUrl: '',
            selectAll: false,
            nyomtatasiTipus: 'szamla'
        }
        this.originSzamlak = [];
        this.fizetesiModok = [ATUTALAS, POSTAI_CSEKK];
        this.fetchSzamlak(this.state.from, this.state.to);
    }


    fetchSzamlak(from = null, to = null){
		let url = window.CONFIG.backend + '/szamlak';
		if (from && to){
			url += "?from=" + from + "&to=" + to;
		}
		fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
				'Content-Type': 'application/json'
			}
		})
		.then((response) => {
			return response.json()
		})
		.then(json => {
            json.forEach(szamla => {szamla.selected = false;});
            this.originSzamlak = JSON.parse(JSON.stringify(json));
			this.setState({szamlak: json})
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
	}

    handleFromChange(date) {
		this.setState({
			from: date
		});
	}

	handleToChange(date) {
		this.setState({
			to: date
		});
	}


    renderSzamla(szamla){
        let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
            return sum + tetel.bruttoar
        }, 0);
        return (
            <tr key={szamla.id}>
                <td><input type="checkbox" checked={szamla.selected} onChange={() => {this.selectSzamla(szamla)}}/></td>
                <td style={{cursor:'pointer'}} onClick={() => {this.setState({detailedSzamla: szamla})}}>{szamla.nev}</td>
                <td>{szamla.email}</td>
                <td>{szamla.szamlaSorszam}</td>
                <td>{szamla.kelte}</td>
                <td style={{textAlign: "right"}}>{Math.round(brutto)}</td>
            </tr>
        );
    }

    filterSzamlak(toFilter){
        if (toFilter.trim() === ""){
            this.setState({szamlak: this.originSzamlak});
        }else {
            let filtered = this.originSzamlak.filter(szamla => szamla.nev.includes(toFilter) || 
                                                               szamla.szamlaSorszam.includes(toFilter) || 
                                                               szamla.email.includes(toFilter) ||
                                                               JSON.stringify(szamla.telefonszamok).includes(toFilter));
            this.setState({szamlak: filtered});
        }
    }

    filterFizetesiMod(e, type){
        if (e.target.checked){
            this.fizetesiModok.push(type)
        }else{
            let index = this.fizetesiModok.indexOf(type);
            if (index > -1){
                this.fizetesiModok.splice(index, 1);
            }
        }
        let filtered = this.originSzamlak.filter(szamla => this.fizetesiModok.includes(szamla.fizetesiMod));
        this.setState({szamlak: filtered});
    }

    selectAll(e){
        this.state.szamlak.forEach(szamla => {
            szamla.selected = e.target.checked;
        });
        this.setState({selectAll: e.target.checked, szamlak: this.state.szamlak}, this.generateUrls);
    }

    selectSzamla(szamla){
        szamla.selected ? szamla.selected = false : szamla.selected = true;
        this.setState({szamlak: this.state.szamlak, selectAll: false}, this.generateUrls);
    }

    viewDetails(szamla){
        this.setState({detailedSzamla: szamla})
    }

    generateUrls(){
        let params = this.state.szamlak.filter(szamla => szamla.selected).map(szamla => "ids=" + szamla.id).join('&');
        switch(this.state.nyomtatasiTipus){
            case 'szamla':
                this.setState({printUrl: window.CONFIG.backend + '/szamlak/collect/szamla?' + params});
                break;
            case 'melleklet':
                this.setState({printUrl: window.CONFIG.backend + '/szamlak/collect/melleklet?' + params});
                break;
            case 'csekk':
                this.setState({printUrl: window.CONFIG.backend + '/szamlak/collect/csekk?' + params});
                break;
            case 'all':
               this.setState({printUrl: window.CONFIG.backend + '/szamlak/collect/szamla_melleklet?' + params});
               break;
        }
    }

    render(){
        return (
            <div>
                <TeleoptimumMenu active='szamlak'/>
                <div className="container">
                    {!this.state.detailedSzamla ? 
                    <div>
                        <div className="row">
                            <div className="col-xs-6" style={{textAlign: "left", height: "36px"}}>
                                <div style={{marginRight: "10px", float:'left'}}>
                                    Tol:
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.from}
                                        onChange={this.handleFromChange.bind(this)} 
                                    />
                                </div>
                                <div style={{marginRight: "10px", float:'left'}}>
                                    Ig:
                                    <DatePicker
                                        dateFormat="YYYY-MM-DD"
                                        selected={this.state.to}
                                        onChange={this.handleToChange.bind(this)} 
                                    />
                                </div>
                                <div style={{float: 'left'}}>
                                    <button style={{marginTop: "-4px"}} className="btn btn-success" onClick={() => this.fetchSzamlak(this.state.from, this.state.to)}>Keres</button>
                                </div>
                            </div>
                            <div className="col-xs-6" style={{textAlign: "right"}}>
                                <form className="form-inline">
                                    <div className="checkbox" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="checkbox" defaultChecked={true} onChange={(event) => {this.filterFizetesiMod(event, ATUTALAS)}}/> Atutatalas
                                        </label>
                                    </div>
                                    <div className="checkbox" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="checkbox" defaultChecked={true} onChange={(event) => {this.filterFizetesiMod(event, POSTAI_CSEKK)}}/> Keszpenz
                                        </label>
                                    </div>
                                    <div className="form-group" style={{marginLeft: "10px"}}>
                                        <input type="text" className="form-control" style={{marginTop: "-4px"}}
                                        onChange={(event) => this.filterSzamlak(event.target.value)}/>
                                    </div>
                                </form>                                
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6" style={{textAlign: "left"}}>
                                <form className="form-inline">
                                    <div className="radio" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="radio" checked={this.state.nyomtatasiTipus === 'szamla'} onChange={()=>{this.setState({nyomtatasiTipus: 'szamla'}, this.generateUrls)}}/> Szamla
                                        </label>
                                    </div>
                                    <div className="radio" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="radio" checked={this.state.nyomtatasiTipus === 'melleklet'} onChange={()=>{this.setState({nyomtatasiTipus: 'melleklet'}, this.generateUrls)}}/> Melleklet
                                        </label>
                                    </div>
                                    <div className="radio" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="radio"checked={this.state.nyomtatasiTipus === 'csekk'} onChange={()=>{this.setState({nyomtatasiTipus: 'csekk'}, this.generateUrls)}}/> Csekk
                                        </label>
                                    </div>
                                    <div className="radio" style={{marginLeft: "10px"}}>
                                        <label>
                                            <input type="radio" checked={this.state.nyomtatasiTipus === 'all'} onChange={()=>{this.setState({nyomtatasiTipus: 'all'}, this.generateUrls)}}/> Szamla+Melleklet
                                        </label>
                                    </div>
                                    <div className="form-group" style={{marginLeft: "10px"}}>
                                        <a href={this.state.printUrl} style={{cursor: "pointer", marginRight: "10px"}} target="_blank" className="btn btn-primary">Nyomtat</a>
                                    </div>
                                </form>
                            </div>
                            <div className="col-xs-6" style={{textAlign: "right"}}>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th><input type="checkbox" checked={this.state.selectAll} onChange={(event) => {this.selectAll(event)}}/></th>
                                    <th>Nev</th>
                                    <th>Email</th>
                                    <th>Szamla Sorszam</th>
                                    <th>Szamla Kelte</th>
                                    <th>Brutto Ár</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.szamlak.map(szamla => {
                                        return this.renderSzamla(szamla);
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    : 
                    <div>
                        <div><a style={{cursor: "pointer"}} onClick={() => {this.setState({detailedSzamla: null})}}> Vissza</a></div>
                        <SzamlaKep szamla={this.state.detailedSzamla} /> 
                    </div>    
                    }
                </div>
            </div>
        );
    }
}