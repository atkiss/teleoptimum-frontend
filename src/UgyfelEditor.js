import React, { Component } from 'react';

export default class UgyfelEditor extends Component {
    constructor(props){
        super(props);
        let ugyfel = JSON.parse(JSON.stringify(this.props.ugyfel));
        this.state = {
            ugyfel: ugyfel,
            open: []
        };
    }

    save(){
        fetch(window.CONFIG.backend + '/ugyfelek', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password)
			},
			body: JSON.stringify(this.state.ugyfel)
		})
		.then((response) => {
			if (response.ok){
				this.props.cancel(true);
			}
		})
		.catch((ex) => {
			console.log('parsing failed', ex)
		});
    }

    toggleCimEditor(tipus){
        let open = this.state.open;
        let found = false;
        for(let i=0;i<open.length;i++){
            if (open[i] === tipus){
                open.splice(i, 1);
                found = true;
                break;
            }
        }
        if (!found){
            open.push(tipus);
        }      
        this.setState({open: open});
    }

    calcDisplay(tipus){
        return this.state.open.find(item => item === tipus) ? 'block' : 'none';
    }

    buttonText(tipus){
        return this.state.open.find(item => item === tipus) ? 'Elrejt' : 'Szerkeszt';
    }

    cimetMasol(ugyfel, tipus){
        let toCopy = ugyfel.cimek.find(cim => cim.tipus === tipus);
        ugyfel.cimek.forEach(cim => {
            if (cim.tipus !== tipus){
                cim.kozterulet = toCopy.kozterulet;
                cim.kozterulet_tipus = toCopy.kozterulet_tipus;
                cim.haz_szam = toCopy.haz_szam;
                cim.emelet = toCopy.emelet;
                cim.ajto = toCopy.ajto;
                cim.varos = toCopy.varos;
                cim.iranyitoszam = toCopy.iranyitoszam;
            }
        });
        this.setState({updateUgyfel: ugyfel});
    }

    updateCim(event, cim, prop){
        cim[prop] = event.target.value;
        this.setState({ugyfel: this.state.ugyfel});
    }

    updateUgyfel(value, prop){
        let ugyfel = this.state.ugyfel;
        ugyfel[prop] = value;
        this.setState({ugyfel: ugyfel});
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-3"/>                
                <div className="col-xs-6">
                    <form>
                        <a style={{cursor: "pointer"}} onClick={this.props.cancel}> Vissza</a>
                        <div className="form-group">
                            <label htmlFor="ugyfelTipus">Ügyfél tipus</label>
                            <select value={this.state.ugyfel.ugyfelTipus} className="form-control"
                                    onChange={(event) => this.updateUgyfel(event.target.value, "ugyfelTipus")}>
                                <option value="magan">magán</option>
                                <option value="ceges">céges</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="nev">Név</label>
                            <input type="text" className="form-control" id="nev" value={this.state.ugyfel.nev}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "nev")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" id="email" value={this.state.ugyfel.email}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "email")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ugyfelKod">Ugyfelkód</label>
                            <input type="text" className="form-control" id="ugyfelKod" defaultValue={this.state.ugyfel.ugyfelKod} disabled="disabled"/>
                        </div>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={this.state.ugyfel.needsSpecialInvoice == 3}
                                        onClick={(event) => {
                                            let val = event.target.checked ? 3 : 0
                                            this.updateUgyfel(val, "needsSpecialInvoice")
                                        }}/> Speciális számla</label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="adoszam">Adószám</label>
                            <input type="text" className="form-control" id="adoszam"  value={this.state.ugyfel.adoszam}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "adoszam")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fizetesiMod">Fizetési mód</label>
                            <select value={this.state.ugyfel.fizetesiMod} className="form-control"
                                    onChange={(event) => this.updateUgyfel(event.target.value, "fizetesiMod")}>
                                <option value="POSTAI_CSEKK">POSTAI_CSEKK</option>
                                <option value="ATUTALAS">ATUTALAS</option>
                            </select>
                        </div>
                        {this.state.ugyfel.cimek.map((cim, idx) => {
                            return (<div className="form-group" key={idx}>
                                <label htmlFor={cim.tipus}>{cim.tipus}</label>
                                <input type="text" style={{width: "70%"}} className="form-control" disabled="disabled" id="cim" 
                                       value={this.props.cimToString(cim)}/>

                                <a style={{float: "right", marginTop: "-33px"}} onClick={() => this.toggleCimEditor(cim.tipus)} 
                                        type="submit" className="btn btn-primary">{this.buttonText(cim.tipus)}</a> 
                                <span style={{width: "10px", float: "right"}}>&nbsp;</span>
                                <a style={{float: "right", marginTop: "-33px", display: this.calcDisplay(cim.tipus)}} className="btn btn-primary"
                                        onClick={() => this.cimetMasol(this.state.ugyfel, cim.tipus)}>Másol</a>

                                <div style={{padding: "20px", display: this.calcDisplay(cim.tipus)}}>
                                    <label htmlFor="kozterulet">Közterület</label>
                                    <input type="text" className="form-control" id="kozterulet" value={cim.kozterulet} onChange={(event) => this.updateCim(event, cim, "kozterulet")}/>
                                    <label htmlFor="kozterulet_tipus">Tipus</label>
                                    <input type="text" className="form-control" id="kozterulet_tipus" value={cim.kozterulet_tipus} onChange={(event) => this.updateCim(event, cim, "kozterulet_tipus")}/>
                                    <label htmlFor="haz_szam">Házszám</label>
                                    <input type="text" className="form-control" id="haz_szam" value={cim.haz_szam} onChange={(event) => this.updateCim(event, cim, "haz_szam")}/>
                                    <label htmlFor="emelet">Emelet</label>
                                    <input type="text" className="form-control" id="emelet" value={cim.emelet} onChange={(event) => this.updateCim(event, cim, "emelet")}/>
                                    <label htmlFor="ajto">Ajtó</label>
                                    <input type="text" className="form-control" id="ajto" value={cim.ajto} onChange={(event) => this.updateCim(event, cim, "ajto")}/>
                                    <label htmlFor="varos">Város</label>
                                    <input type="text" className="form-control" id="varos" value={cim.varos} onChange={(event) => this.updateCim(event, cim, "varos")}/>
                                    <label htmlFor="iranyitoszam">Irányitoszám</label>
                                    <input type="text" className="form-control" id="iranyitoszam" value={cim.iranyitoszam} onChange={(event) => this.updateCim(event, cim, "iranyitoszam")}/>
                                </div>
                            </div>)
                        })}

                        <div className="form-group">
                            <label htmlFor="ceg_jegyzek_szam">Cégjegyzek szám</label>
                            <input type="text" className="form-control" id="ceg_jegyzek_szam" value={this.state.ugyfel.ceg_jegyzek_szam}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "ceg_jegyzek_szam")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="kapcsolat_tarto_nev">Kapcsolattartó neve</label>
                            <input type="text" className="form-control" id="kacsolat_tarto_nev" value={this.state.ugyfel.kacsolat_tarto_nev}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "kacsolat_tarto_nev")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="kapcsolat_tarto_sz_ig_szam">Kapcsolattartó személyi száma</label>
                            <input type="text" className="form-control" id="kapcsolat_tarto_sz_ig_szam" value={this.state.ugyfel.kapcsolat_tarto_sz_ig_szam}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "kapcsolat_tarto_sz_ig_szam")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="kapcsolat_tarto_tsz">Kapcsolattartó telefonszáma</label>
                            <input type="text" className="form-control" id="kapcsolat_tarto_tsz" value={this.state.ugyfel.kapcsolat_tarto_tsz}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "kapcsolat_tarto_tsz")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="anyja_neve">Anyja neve</label>
                            <input type="text" className="form-control" id="anyja_neve" value={this.state.ugyfel.anyja_neve}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "anyja_neve")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="egyeb_telefonszam">Egyéb telefonszám</label>
                            <input type="text" className="form-control" id="egyeb_telefonszam" value={this.state.ugyfel.egyeb_telefonszam}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "egyeb_telefonszam")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sz_hely_ido">Születési hely/idő</label>
                            <input type="text" className="form-control" id="sz_hely_ido" value={this.state.ugyfel.sz_hely_ido}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "sz_hely_ido")}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="szem_ig_szam">Személyi szám</label>
                            <input type="text" className="form-control" id="szem_ig_szam" value={this.state.ugyfel.szem_ig_szam}
                                   onChange={(event) => this.updateUgyfel(event.target.value, "szem_ig_szam")}/>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-warning" onClick={this.props.cancel}>Megsem</button>
                            <button className="btn btn-primary" onClick={this.save.bind(this)}>Ment</button>
                        </div>

                    </form>
                </div>
                <div className="col-xs-3"/>
            </div> 
        );
    }
}