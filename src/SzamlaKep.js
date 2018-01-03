import React, { Component } from 'react';


export default class SzamlaKep extends Component {
    formatTelefonszam(telefonszam){
		return telefonszam.replace(/(\d{2})(\d{3})(\d{4})/, '($1) $2-$3');
	}

    render(){
        let szamla = this.props.szamla; 
        return (<div className="container szamla">
                    <div className="row">
                    <div className="col-xs-2">
                        <h2>SZÁMLA</h2>
                    </div>
                    <div className="col-xs-5">
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
                    {this.renderReszletezo(szamla)}
                </div>               
            );
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
}