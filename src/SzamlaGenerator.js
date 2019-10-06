import React, { Component } from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';
import DatePicker from 'react-datepicker';
import moment from 'moment';

export default class SzamlaGenerator extends Component{

    constructor(props){
        super(props);
		var szamlak = [];
		var saveSuccess = false;
		if (this.props.type === 'generate'){
			let ugyfelek = [];
			let telefonszamok = JSON.parse(localStorage.getItem('telefonszamok'));
			let rows = JSON.parse(localStorage.getItem('rows'))
			let idoszak = localStorage.getItem('idoszak').split('-')
			let telenorSzamlaSorszam = localStorage.getItem('sorszam');
			let currentDate = new Date();
			for (let p in telefonszamok){
				let ujUgyfel = telefonszamok[p].ugyfel;
				if(!ugyfelek.find(ugyfel => ugyfel.nev == ujUgyfel.nev)){
					ugyfelek.push(ujUgyfel);        		
				}
			}
			let hatarIdo = new Date();
			hatarIdo.setDate(hatarIdo.getDate() + 8);
			let szamlaTempId = 0;
			for (let ugyfel of ugyfelek){
				if (ugyfel.needsSpecialInvoice === 1){
					continue;
				}
				let szamla = {
					id: ++szamlaTempId,
					nev: ugyfel.nev,
					ugyfelKod: ugyfel.ugyfelKod,
					email: ugyfel.email,
					adoszam: ugyfel.adoszam,
					fizetesiMod: ugyfel.fizetesiMod,
					teljesites: hatarIdo.getFullYear() + '-' + (hatarIdo.getMonth() + 1) + '-' + (hatarIdo.getDate()),
					kelte: currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate(),
					hatarido: hatarIdo.getFullYear() + '-' + (hatarIdo.getMonth() + 1) + '-' + (hatarIdo.getDate()),
					cim: ugyfel.cimek.find(cim => cim.tipus.includes("LEVELEZESI")),
					szamlaTetelek: [],
					idoszakKezdete: idoszak[0].substring(0, idoszak[0].lastIndexOf(".")).trim().replace(new RegExp("\\.", 'g'), "-"),
					idoszakVege: idoszak[1].substring(0, idoszak[1].lastIndexOf(".")).trim().replace(new RegExp("\\.", 'g'), "-"),
					telenorSzamlaSorszam: telenorSzamlaSorszam,
					szamlaSorszam: 'P00000' + szamlaTempId
				}
				szamla.telefonszamok = ugyfel.telefonszamok;
				// //adminisztracios dij
				// if (ugyfel.fizetesiMod !== 'ATUTALAS'){
				// 	let tetel = {
				// 		telefonszam: Math.random()*10,
				// 		nettoar: 3150,
				// 		afakulcs: 27,
				// 		bruttoar: 3150*1.27,
				// 		nettoegysegar: 3150,
				// 		megnevezes: 'Adminisztrációs dij',
				// 		egyseg: 'Darab',
				// 		mennyiseg: 1
				// 	}
				// 	szamla.szamlaTetelek.push(tetel);
				// }
				szamla.telefonszamok.forEach(telefonszam => {
					telefonszam.rows = rows.filter(row => {
						if (!row.tovabbszamlazva){
							return false;
						}
						if (row.telefonszam.replace(new RegExp('-', 'g'), '') == telefonszam.telefonszam){
							row.tipus2 =  (row.tipus == 'MOBIL_VASARLAS' ? 'MOBIL_VASARLAS' : 'TAVKOZLESI');
							return true;
						}
						return false;
					});
					let szamlaTetelek = telefonszam.rows.reduce((osszesito, row) => {
						let tetel = osszesito.find(elem => elem.afakulcs == row.afakulcs && elem.tipus == row.tipus2);
						if (tetel){
							tetel.nettoar += row.nettoar; 
							tetel.bruttoar += row.bruttoar;   
							tetel.nettoegysegar += row.nettoar;        		            	
						}else{
							let megnevezes = this.formatTelefonszam(telefonszam.telefonszam);
							if (row.tipus == 'MOBIL_VASARLAS'){
								megnevezes += " Mobilvásárlás szolgáltatás dija";
							}else{
								megnevezes += ' Távközlési szolgáltatás dija';
							}
							osszesito.push({telefonszam: telefonszam.telefonszam + row.tipus + row.afakulcs,
											tipus: row.tipus2,
											megnevezes: megnevezes,
											nettoar: row.nettoar, 
											nettoegysegar: row.nettoar,
											afakulcs: row.afakulcs,
											bruttoar: row.bruttoar,
											egyseg: 'honap',
											mennyiseg: '1'})
						}
						return osszesito;
					}, []);
					szamla.szamlaTetelek = szamla.szamlaTetelek.concat(szamlaTetelek);	            
				});
				szamla.telefonszamok = szamla.telefonszamok.filter((telefonszam) => telefonszam.rows.length > 0)
				szamlak.push(szamla);
			}
		}else if (this.props.type === 'browse'){	
			this.fetchSzamlak(moment().date(1), moment());
		}
        
        this.state = {
        	szamlak: szamlak,
        	csakReszletezo: false,
			saveSuccess: saveSuccess,
			from: moment().date(1),
			to: moment(),
			sum: this.collectSum(szamlak),
			printType: "ALL"
        };
    }

	collectSum(szamlak){
		return szamlak.reduce((sum1, szamla) => {
				return sum1 + szamla.szamlaTetelek.reduce((sum2, szamlaTetel) => {
					return sum2 + szamlaTetel.bruttoar;
				}, 0)
			}, 0);
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
			if (response.ok){
				this.setState({saveSuccess:true});
			}
			return response.json()
		})
		.then(json => {
			this.setState({szamlak: json, sum: this.collectSum(json)})
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
	}
	
	formatTelefonszam(telefonszam){
		return telefonszam.replace(/(\d{2})(\d{3})(\d{4})/, '($1) $2-$3');
	}

    postSzamlak(){
    	fetch(window.CONFIG.backend + '/szamlak', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password)
			},
			body: JSON.stringify(this.state.szamlak)
		})
		.then((response) => {
			if (response.ok){
				this.setState({saveSuccess: true});
			}
			return response.json()
		})
		.then(json => {
			this.setState({szamlak: json})
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
    }

	generateSzamlaKep(szamla){
		let body;
		if (szamla){
			body = JSON.stringify([szamla])
		}else{
			body = JSON.stringify(this.state.szamlak);
		}
		fetch(window.CONFIG.backend + '/szamlak/generate', {
			method: 'POST',
			headers: {
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
				'Content-Type': 'application/json'
			},
			body: body
		})
		.then((response) => {
			if (response.ok){
				return response.json();
			}else{
				throw Error("Szamla genrealas nem sikerult: " + response.text());
			}
		})
		.then(json => {
			this.setState({szamlak: json})
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
	}

	szamlakUrl(){
		return window.CONFIG.backend + '/szamlak/pdf/szamla/' + this.state.from + '/' + this.state.to + "/" + this.state.printType;
	}

	csekkekUrl(){
		return window.CONFIG.backend + '/szamlak/pdf/csekk/' + this.state.from + '/' + this.state.to + "/" + this.state.printType;
	}

	mellekletekUrl(){
		return window.CONFIG.backend + '/szamlak/pdf/melleklet/' + this.state.from + '/' + this.state.to + "/" + this.state.printType;
	}

	nyomtatUrl(ugyfelId){
		return window.CONFIG.backend + '/szamlak/pdf/' + ugyfelId;
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


	renderCommandButton(){
		if (this.props.type == 'generate'){
			if (this.state.saveSuccess){
				return <li role="presentation"><a  onClick={() => {this.generateSzamlaKep()}} style={{cursor: "pointer"}}>Szamlak Generalasa</a></li>
			}else{
				return <li role="presentation"><a  onClick={this.postSzamlak.bind(this)} style={{cursor: "pointer"}}>Szamlak Mentese</a></li>
			}
		}else{
			return (<li role="presentation" className={this.props.active == "szamlak" ? 'active dropdown' : 'dropdown'}>
						<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
							Nyomtatas <span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							<li><a  href={this.szamlakUrl()} style={{cursor: "pointer"}} target="_blank">Szamlak</a></li>
				            <li><a  href={this.mellekletekUrl()} style={{cursor: "pointer"}} target="_blank">Melleklet</a></li>
							<li><a  href={this.csekkekUrl()} style={{cursor: "pointer"}} target="_blank">Csekk</a></li>
						</ul>
					</li>);
		}
		
	}

    renderSzamla(){
    	let fejlecek = [];
        fejlecek.push(this.state.szamlak.map(szamla => {
        		return (
		        	  <div key={szamla.id}>		        	  	
		        	  	<div className="container szamla">
			        		<div className="row">
			                <div className="col-xs-2">
			                  <h2>SZÁMLA</h2>
			                </div>
							<div className="col-xs-5">
								{this.props.type !== 'generate' &&
			                  		<a style={{marginTop: "18px", marginRight: "10px"}} className="btn btn-primary" href={this.nyomtatUrl(szamla.id)} target="_blank">Nyomtat</a>
								}
								{!szamla.szamlaSorszam &&
			                  		<button style={{marginTop: "18px"}} className="btn btn-primary" 
									  onClick={() => {this.generateSzamlaKep(szamla)}}>Szamlat general</button>
								}
			                </div>
			                <div className="col-xs-5">
			                  <span className="sorszam">{szamla.szamlaSorszam}</span>
			                  <span className="sorszam-title">Sorszám: </span>
			                </div>
			              </div>
			              <div className="row" style={{border: "1px solid black"}}>
			                  <div className="col-xs-6" style={{borderRight: "1px solid black"}}>
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
			                      <b>{szamla.nev}</b><br/>
			                      <br/>
			                      {szamla.cim.iranyitoszam} {szamla.cim.varos}<br/>
			                      {szamla.cim.kozterulet} {szamla.cim.kozterulet_tipus} {szamla.cim.hazszam}<br/>
			                      <br/>
			                      Adószám: {szamla.adoszam}<br/>
			                  </div>
			              </div>
			              <div className="row" style={{fontSize: "12px", borderBottom: "1px solid black"}}>
			                  <div className="col-xs-2">
			                      <b>A fizetés módja:</b><br/>
			                      {szamla.fizetesiMod}
			                  </div>
			                  <div className="col-xs-3">
			                      <b>Teljesítés dátuma:</b><br/>
			                      {szamla.teljesites}
			                  </div>
			                  <div className="col-xs-2">
			                      <b>Számla kelte:</b><br/>
			                      {szamla.kelte}
			                  </div>
			                  <div className="col-xs-3">
			                      <b>Fizetés határideje:</b><br/>
			                      {szamla.hatarido}
			                  </div>
			                  <div className="col-xs-2 right-align">
			                      <b>Pénznem:</b><br/>
			                      <span style={{fontSize: "20px"}}><b>HUF</b></span>
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
			              {szamla.szamlaTetelek.map(tetel => {
			              		return (
					              	<div key={tetel.telefonszam}>		              		
									    <div className="row" style={{fontSize: "12px"}}>
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
									                    {tetel.nettoegysegar.toFixed(2)}
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
					        <div className="col-xs-6 right-align" style={{fontSize: "32px", fontWeight: "bold"}}>
					            {szamla.szamlaTetelek.reduce((prev, current) => prev + current.bruttoar, 0).toFixed(2)}
					        </div>
					    </div>
					</div>
					{this.renderReszletezo(szamla)}
		        </div>
		        
        		);
        	}));
        return fejlecek;
    }

    renderReszletezo(szamla){
    	return (
    		<div className="container reszletezo">
			    <div className="row">
			        <div className="col-xs-12 reszletezo-title">
			          {szamla.nev} melléklete a {szamla.szamlaSorszam} sorszámú számlához:
			        </div>
			    </div>
			    <div className="table-responsive">			           
	            	{szamla.telefonszamok.filter(telefonszam => telefonszam.rows.length > 0).map(telefonszam => {
	            		return (	            				
	            				<table key={telefonszam.telefonszam} className="table table-bordered">
						            <thead>
						            	<tr>
		            						<th colSpan="8"><b>Telefonszám: {this.formatTelefonszam(telefonszam.telefonszam)}</b></th>		            						
		            					</tr>
										<tr>
		            						<th colSpan="4"><b>Időszak: {szamla.idoszakKezdete} - {szamla.idoszakVege}</b></th>	
											<th colSpan="4"><b>Ügyfélkód: {szamla.ugyfelKod}</b></th>	            						
		            					</tr>
						                <tr>
						                    <th>Terméknév</th>
						                    <th>Egység</th>
						                    <th>Mennyiség</th>
						                    <th>Egység Ár</th>
						                    <th>Áfakulcs</th>
						                    <th>Nettó Ár</th>
						                    <th>Áfa</th>
						                    <th>Brutto Ár</th>
						                </tr>						                
						            </thead>
						            <tfoot>
							            <tr>
						                	<td colSpan="6"></td>
						                	<td colSpan="2"><b>Összesen: {telefonszam.rows.reduce((prev, curr) => prev += curr.bruttoar, 0).toFixed(2)}</b></td>
					                	</tr>
					                </tfoot>
	            					<tbody>
	            					
	            				{telefonszam.rows.map(row => {
	            					return (
	            						<tr key={row.id}>
						                    <td>{row.termeknev}</td>
						                    <td>{row.egyseg}</td>
						                    <td>{row.mennyiseg.toFixed(2)}</td>
						                    <td>{row.nettoegysegar.toFixed(2)}</td>
						                    <td>{row.afakulcs}</td>
						                    <td>{row.nettoar.toFixed(2)}</td>
						                    <td>{(row.bruttoar - row.nettoar).toFixed(2)}</td>
						                    <td>{row.bruttoar.toFixed(2)}</td>
						                </tr>
	            					);
	            				})}
				                </tbody>
				            </table>);
	            	})}			                
			    </div>
			  </div>
    	);
    }

    render(){
        return (
            <div>
            	<TeleoptimumMenu active='szamlak'>
					{this.renderCommandButton()}
            	</TeleoptimumMenu>
				{this.props.type !== 'generate' &&
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
							<div className="col-xs-2">
								<select value={this.state.printType} className="form-control"
										onChange={(event) => {this.setState({printType: event.target.value})}}>
									<option value="ALL">mind</option>
									<option value="POSTAI_CSEKK">csekk</option>
									<option value="ATUTALAS">utalas</option>
								</select>
							</div>
							<div className="col-xs-3">
								Brutto: {this.state.sum}
							</div>
						</div>
					</div>
				}
				
              	{this.renderSzamla()}
            </div>
        );
    }
}
