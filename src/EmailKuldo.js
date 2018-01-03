import React, { Component } from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class EmailKuldo extends Component {

    constructor(props){
        super(props);
        var szamlak = [];

        this.state = {
        	szamlak: szamlak,
        	csakReszletezo: false,
			from: moment().date(1),
			to: moment(),
			kuldesAlatt: false
        }
    }

	sendEmail(from, to, reallySend = false){
		if (!reallySend){
			return;
		}
		this.setSate({kuldesAlatt: true});
		let url = window.CONFIG.backend + '/szamlak/email/' + this.state.from + '/' + this.state.to;
		if (from && to){
			url += "?from=" + from + "&to=" + to;
		}
		fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
				'Content-Type': 'application/json'
			},
		})
		.then((response) => {
			this.setState({kuldesAlatt:false});
			if (response.ok){
				alert("sikeres email kuldes");
			}else{
				alert("sikertelen email kuldes");
			}
		})
		.catch((ex) => {
			console.log('parsing failed', ex);
			alert("sikertelen kuldes" + ex);
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

    render(){
        return (
            <div>
            	<TeleoptimumMenu active='szamlak'>
            	</TeleoptimumMenu>
				<div className="container">
					<div className="row">
						<div className="col-xs-12" style={{textAlign: "left"}}>
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
							<div style={{float:'left'}}>
								<button className="btn btn-success" onClick={() => this.sendEmail(this.state.from, this.state.to)}>Kuldes</button>
							</div>
						</div>
					</div>
				</div>
            </div>
        );
    }
}