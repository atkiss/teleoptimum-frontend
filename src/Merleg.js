import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TeleoptimumMenu from './TeleoptimumMenu';


export default class Merleg extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            szamlak: [],
            from: moment().date(1),
			to: moment(),
            befizetesek: []
        }
        this.fetchSzamlak(this.state.from, this.state.to);
        this.fetchBefizetesek(this.state.from, this.state.to);
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

    fetchBefizetesek(from = null, to = null){
		let url = window.CONFIG.backend + '/bank';
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
			if (response.ok){
                return response.json();
			}else{
                throw new Error("Befizetesek letoltese nem sikerult");
            }
		})
		.then(json => {
			this.setState({befizetesek: json});
		})
		.catch((ex) => {
			console.log('fetch failed', ex)
            alert(ex.message);
		});
	}

    findBefizetes(szamlaSorszam){   
        let found = this.state.befizetesek.some(befizetes => {
            return !!befizetes.szamlaSorszamok ? befizetes.szamlaSorszamok.includes(szamlaSorszam) : false;
        });
        if (found){
            return (<span className="glyphicon glyphicon-ok"></span>);
        }
    }

    renderSzamla(szamla){
        let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
            return sum + tetel.bruttoar
        }, 0);
        return (
            <tr key={szamla.id}>
                <td>{szamla.nev}</td>
                <td>{szamla.szamlaSorszam}</td>
                <td>{szamla.kelte}</td>
                <td>{Math.round(brutto)}</td>
                <td>{this.findBefizetes(szamla.szamlaSorszam)}</td>
            </tr>
        );
    }

    render(){
        return (
            <div>
                <TeleoptimumMenu active='befizetesek'/>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-3">
                            Tol:
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.from}
                                onChange={this.handleFromChange.bind(this)} 
                            />
                        </div>
                        <div className="col-xs-3">
                            Ig:
                            <DatePicker
                                dateFormat="YYYY-MM-DD"
                                selected={this.state.to}
                                onChange={this.handleToChange.bind(this)} 
                            />
                        </div>
                        <div className="col-xs-1">
                            <button className="btn btn-success" onClick={() => this.fetchSzamlak(this.state.from, this.state.to)}>Keres</button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>Nev</th>
                                <th>Szamla Sorszam</th>
                                <th>Szamla Kelte</th>
                                <th>Brutto Ár</th>
                                <th>Befizetes</th>
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
            </div>
        );
    }
}