import React from 'react';
import FileUpload from 'react-fileupload';
import TeleoptimumMenu from './TeleoptimumMenu';
import isEqual from 'lodash.isequal';
import BankEditor from './BankEditor';

export default class Befizetesek extends React.Component {

    constructor(props){
        super(props);
		this.state = {
			befizetesek: [],
			ugyfelek: [],
			editing: {},
			ugyfelDisplay: 'nev',
			selectedBefizetes: null
		};

		if (this.props.type === 'list'){
			this.fetchBefizetesek();
		}


		this.options={
			baseUrl: window.CONFIG.backend + '/bank',
			param:{
				fid:0
			},
			fileFieldName: 'file',
			requestHeaders: {
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
			},
			uploadSuccess : (resp) => {
				console.log('upload success..!');
				this.joinUgyfelek(resp);

			},
			uploadError : (err) => {
				alert(err.message)
			},
			uploadFail : (resp) => {
				alert(resp)
			}
		};
    }

	componentWillReceiveProps(nextProps) {
		if (nextProps.type === 'list'){
			this.fetchBefizetesek();
		}else{
			this.setState({befizetesek: []});
		}
	} 

	componentDidMount() {
		window.addEventListener('mouseup', this.lostFocus.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.lostFocus.bind(this));
	}

	lostFocus(event){
		if (!event.target.className.includes('editor')){
			this.setState({editing: {}, edditType: ''});
		}
	}

	cancel(reload = false){
        this.setState({selectedBefizetes: null});
    }

	saveEditing(befizetes){
		let befizetesek = this.state.befizetesek;
		let bef = befizetesek.find(it => {
			return (it.leiras === befizetes.leiras && it.datum === befizetes.datum);
		});
		bef.ugyfelKod = befizetes.ugyfelKod;
		if (bef.ugyfelKod){
			bef.ugyfel = this.state.ugyfelek.find(ugyfel => ugyfel.ugyfelKod === bef.ugyfelKod);
		}else{
			bef.ugyfel = {nev: ''};
		}
		bef.szamlaSorszamok = befizetes.szamlaSorszamok;
		bef.szamlaSorszamok ? bef.szamlaSorszamok.forEach(sorszam => {
			let szamla = this.state.szamlak.find(szamla => sorszam === szamla.szamlaSorszam);
			if (szamla){
				let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
					return sum + tetel.bruttoar
				}, 0);
				bef.szamla.push(szamla.szamlaSorszam + " - " + Math.round(brutto));
			}
		}) : null;
		this.setState({selectedBefizetes: null, befizetesek: this.state.befizetesek});
		this.updateBefizetesek([befizetes]);
	}

	fetchUgyfelek(){
		return fetch(window.CONFIG.backend + '/ugyfelek', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            return response.json()
        }).then((json) => {
            return json;
        }).catch((ex) => {
            console.log('parsing failed', ex)
        });
	}

	updateBefizetesek(befizetesek){
		return fetch(window.CONFIG.backend + '/bank', {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                'Content-Type': 'application/json'
            },
			body: JSON.stringify(befizetesek)
        })
        .then((response) => {
            if (response.ok){
				alert("A mentes sikerult");
			}else{
				alert("Hiba tortent mentes kozben")
			}
        }).catch((ex) => {
			alert(ex.message);
            console.log('parsing failed', ex)
        });
	}

	fetchSzamlak(from = null, to = null){
		let url = window.CONFIG.backend + '/szamlak';
		if (from && to){
			url += "?from=" + from + "&to=" + to;
		}
		return fetch(url, {
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
			return json;
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
	}

	joinUgyfelek(befizetesek){
		this.fetchUgyfelek()
			.then(ugyfelek => {
				befizetesek.forEach(befizetes => {
					befizetes.szamla = [];
					if (!!befizetes.ugyfelKod){
						befizetes.ugyfel = ugyfelek.find(ugyfel => ugyfel.ugyfelKod === befizetes.ugyfelKod);
					}else{
						befizetes.ugyfel = {nev: ''};
					}
				});
				this.setState({ugyfelek: ugyfelek});
				this.setState({befizetesek: befizetesek});
			})
			.then(() => this.fetchSzamlak())
			.then(szamlak => {
				befizetesek.forEach(befizetes => {
					befizetes.szamlaSorszamok ? befizetes.szamlaSorszamok.forEach(sorszam => {
						let szamla = szamlak.find(szamla => sorszam === szamla.szamlaSorszam);
						if (szamla){
							let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
								return sum + tetel.bruttoar
							}, 0);
							befizetes.szamla.push(szamla.szamlaSorszam + " - " + Math.round(brutto));
						}
					}) : null;					
				});
				this.setState({szamlak: szamlak})
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
			this.joinUgyfelek(json);
		})
		.catch((ex) => {
			console.log('fetch failed', ex)
		});
	}

	parseTimeStamp(timeStamp){
		let date = new Date(timeStamp);
		return `${date.getFullYear()}-${this.generateTwoDigitNumber(date.getMonth() + 1)}-${this.generateTwoDigitNumber(date.getDate())}`;
	}

	generateTwoDigitNumber(number){
		if (number.toString().length > 1){
			return number;
		}else{
			return '0' + number;
		}
	}

	updateUgyfelBefizetes(ugyfelKod, befizetes){
		befizetes.ugyfelKod = ugyfelKod;
		befizetes.ugyfel = this.state.ugyfelek.find(ugyfel => ugyfel.ugyfelKod == befizetes.ugyfelKod);
	}

	updateSzamlaBefizetes(szamlaSorszam, befizetes){
		befizetes.szamlaSorszamok = [szamlaSorszam];
		let szamla = this.state.szamlak.find(szamla => szamla.szamlaSorszam === szamlaSorszam);
		if (szamla){
			let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
				return sum + tetel.bruttoar
			}, 0);
			befizetes.szamla = [szamla.szamlaSorszam + " - " + Math.round(brutto)];
		}
	}

	getUgyfelOptionDisplay(ugyfel){
		if (this.state.ugyfelDisplay === 'befizetoAzonosito'){
			return ugyfel.befizetoAzonosito;
		}else{
			return ugyfel.nev;
		}
	}

	getSzamlaOptionDisplay(szamla){
		let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
			return sum + tetel.bruttoar
		}, 0);
		return szamla.szamlaSorszam + " - " + Math.round(brutto);
	}

	ugyfelCellRenderer(befizetes){
        if (isEqual(befizetes, this.state.editing) && this.state.editType === 'ugyfel'){
            return (<div>
                <select defaultValue={befizetes.ugyfelKod} className="editor form-control" style={{width: "inherit"}}
                        onChange={(event) => this.updateUgyfelBefizetes(event.target.value, befizetes)}>
					<option value=''></option>
                    {this.state.ugyfelek.map(ugyfel => {
                        return <option key={ugyfel.ugyfelKod} value={ugyfel.ugyfelKod}>{this.getUgyfelOptionDisplay(ugyfel)}</option>
                    })}
                </select>
            </div>);
        }else{
            return (<div>
                {befizetes.ugyfel ? this.state.ugyfelDisplay === 'befizetoAzonosito' ? befizetes.ugyfel.befizetoAzonosito : befizetes.ugyfel.nev : ""}
            </div>);
        }
    }

	szamlaCellRenderer(befizetes){
        if (isEqual(befizetes, this.state.editing) && this.state.editType === 'szamla'){
            return (<div>
                <select defaultValue={befizetes.szamlaSorszamok ? befizetes.szamlaSorszamok[0] : ''} className="editor form-control" style={{width: "inherit"}}
                        onChange={(event) => this.updateSzamlaBefizetes(event.target.value, befizetes)}>
					<option value=''></option>
                    {this.state.szamlak.filter(szamla => szamla.ugyfelKod === befizetes.ugyfelKod).map(szamla => {
                        return <option key={szamla.szamlaSorszam} value={szamla.szamlaSorszam}>{this.getSzamlaOptionDisplay(szamla)}</option>
                    })}
                </select>
				<a style={{cursor:'pointer'}} onClick={() => this.setState({selectedBefizetes: befizetes})}>
					<span className="glyphicon glyphicon-pencil"></span>
				</a>
            </div>);
        }else{
			return (<div>
			{befizetes.szamla.map((it, idx) => {
				return (<div key={idx}>{it}</div>)
			})}
			<a style={{cursor:'pointer'}} onClick={() => this.setState({selectedBefizetes: befizetes})}>
				<span className="glyphicon glyphicon-pencil"></span>
			</a>
			</div>);
        }
    }

	switchToEditor(befizetes, type){
		if (!befizetes.szamlaSorszamok || befizetes.szamlaSorszamok.length < 2){
			this.setState({editing: befizetes, editType: type});
		}
	}

    renderBefizetesek(){
		return this.state.befizetesek.map((befizetes, idx) => {
			return (
                <tr key={idx}>
                    <td className="col-md-1">
                        {this.parseTimeStamp(befizetes.datum)}
                    </td>
                    <td className="col-md-5">
                        {befizetes.leiras}
                    </td>
                    <td className="col-md-1">
                        {befizetes.osszeg}
                    </td>
					<td className="col-md-3" onClick={() => this.switchToEditor(befizetes, 'ugyfel')} style={{cursor: "pointer"}}>
                        {this.ugyfelCellRenderer(befizetes)}
                    </td>
					<td className="col-md-2" onClick={() => this.switchToEditor(befizetes, 'szamla')} style={{cursor: "pointer"}}>
                        {this.szamlaCellRenderer(befizetes)}
                    </td>
                </tr>
            );
		});		
	}

	renderHeader(){
		if (this.props.type !== 'list'){
			return (<div className="row">
						<div className="col-xs-6">
							<FileUpload options={this.options}>
								<button ref="chooseBtn">Banki xls kivalasztasa</button>
								<button ref="uploadBtn">Feltoltes</button>
							</FileUpload>
						</div>
						<div className="col-xs-6">
							<button className="btn btn-success" style={{float: 'right'}} onClick={() => {this.updateBefizetesek(this.state.befizetesek)}}>Valtozasok Mentese</button>
						</div>
					</div>);
		}else if (!this.state.selectedBefizetes){
			return(<div className="row">
						<div className="col-xs-2">
							<label className="radio-inline">
								<input type="radio" name="inlineRadioOptions" id="inlineRadio1" 
										value="nev" checked={this.state.ugyfelDisplay === 'nev'}
										onChange={() => this.setState({ugyfelDisplay : 'nev'})}/> Nev
							</label>
						</div>
						<div className="col-xs-3">
							<label className="radio-inline">
								<input type="radio" name="inlineRadioOptions" id="inlineRadio2" 
										value="befizetoAzonosito" checked={this.state.ugyfelDisplay === 'befizetoAzonosito'}
										onChange={() => this.setState({ugyfelDisplay : 'befizetoAzonosito'})}/> Befizeto azonosito
							</label>
						</div>
						<div className="col-xs-7">
							<button className="btn btn-success" style={{float: 'right'}} onClick={() => {this.updateBefizetesek(this.state.befizetesek)}}>Valtozasok Mentese</button>
						</div>
					</div>);
		}
	}

    render(){
        return (<div>
					<TeleoptimumMenu active='befizetesek'>
					</TeleoptimumMenu>
					<div className="container">
						{this.renderHeader()}
						{this.state.selectedBefizetes ? 
						<BankEditor cancel={this.cancel.bind(this)} 
									bank={this.state.selectedBefizetes}
									ugyfelek = {this.state.ugyfelek}
									szamlak = {this.state.szamlak}
									save = {this.saveEditing.bind(this)}/>
						:
						<div className="row">
							<div className="col-xs-12">
								<div className="table-responsive">	
									<table className="table table-bordered">
										<thead>
											<tr>
												<th>Datum</th>
												<th>Leiras</th>
												<th>Osszeg</th>
												<th>Ugyfel</th>	
												<th>Szamla Sorszam</th>					                
											</tr>				
											{this.renderBefizetesek()}		                
										</thead>
									</table>
								</div>                            
							</div>
						</div>
						}
					</div>
				</div>);
    }
}