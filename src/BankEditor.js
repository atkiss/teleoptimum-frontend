import React, { Component } from 'react';

export default class BankEditor extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            selectedUgyfelKod: props.bank.ugyfelKod,
            additionalSzamlak: this.collectAdditionalSzamlaUgyfel(props)
        };

    }

    update(){
        let befizetes = this.props.bank;
        befizetes.ugyfelKod = this.state.additionalSzamlak[0].ugyfelKod;
        befizetes.szamlaSorszamok = this.state.additionalSzamlak.map(it => it.szamlaSorszam);
        this.props.save(befizetes);
    }

    collectAdditionalSzamlaUgyfel(props){
        if (!props.bank.szamlaSorszamok){
            props.bank.szamlaSorszamok = [];
        }
        return props.bank.szamlaSorszamok.map((szamlaSorszam, idx) => {
            return {
                id: idx,
                ugyfelKod: this.props.szamlak.find(it => it.szamlaSorszam === szamlaSorszam).ugyfelKod,
                szamlaSorszam: szamlaSorszam
            }
        });
    }

    updateUgyfelBefizetes(ugyfelKod){
        this.setState({selectedUgyfelKod: ugyfelKod});
    }

    getSzamlaOptionDisplay(szamla){
		let brutto = szamla.szamlaTetelek.reduce((sum, tetel) =>{
			return sum + tetel.bruttoar
		}, 0);
		return szamla.szamlaSorszam + " - " + Math.round(brutto);
	}

    maxId(){
        return this.state.additionalSzamlak.reduce((maxId, szamla) => Math.max(maxId, szamla.id), 0);
    }

    addNewSzamla(){
        let szamla = {
            id: this.maxId() + 1,
            ugyfelKod: '',
            szamlaSorszam: ''
        }
        let additionalSzamlak = JSON.parse(JSON.stringify(this.state.additionalSzamlak));
        additionalSzamlak.push(szamla);
        this.setState({additionalSzamlak: additionalSzamlak})
    }

    setUgyfel(szamla, ugyfelKod){
        szamla.ugyfelKod = ugyfelKod;   
        this.setState({additionalSzamlak: this.state.additionalSzamlak});
    }

    setSzamla(ugyfelSzamla, szamla){
        szamla = szamla.split('_');
        ugyfelSzamla.szamlaSorszam = szamla[0];  
        ugyfelSzamla.ugyfelKod = szamla[1];
        this.setState({additionalSzamlak: this.state.additionalSzamlak});
    }

    removeSzamla(szamla){
        let index = this.state.additionalSzamlak.indexOf(szamla);
        this.state.additionalSzamlak.splice(index, 1);
        this.setState({additionalSzamlak: this.state.additionalSzamlak});
    }

    szamlaComparator(a, b){
        return  a.szamlaSorszam.localeCompare(b.szamlaSorszam);
    }

    renderSzamlaSorszamComponent(ugyfelSzamla){
        let szamlak = []
        if (ugyfelSzamla.ugyfelKod){
            szamlak = this.props.szamlak.filter(szamla => szamla.ugyfelKod === ugyfelSzamla.ugyfelKod).sort(this.szamlaComparator);
        }else{
            szamlak = this.props.szamlak.sort(this.szamlaComparator);
        }
        return (
            <div>
                <div className="form-group" style={{float: 'left', paddingRight: '20px'}}>
                    <label htmlFor="szamla">Szamla</label>
                    <select value={`${ugyfelSzamla.szamlaSorszam}_${ugyfelSzamla.ugyfelKod}`} className="editor form-control" style={{width: "inherit"}}
                            onChange={(event) => this.setSzamla(ugyfelSzamla, event.target.value)}>
                        <option value=''></option>
                        {szamlak.map(szamla => {
                            return <option key={`${szamla.szamlaSorszam}_${szamla.ugyfelKod}`} value={`${szamla.szamlaSorszam}_${szamla.ugyfelKod}`}>{this.getSzamlaOptionDisplay(szamla)}</option>
                        })}
                    </select>
                </div>
                <div className="form-group" style={{paddingTop: '26px'}}>
                    <button onClick={() => {this.removeSzamla(ugyfelSzamla)}} className="btn btn-warning">-</button>
                </div>
            </div> 
        );
    }

    render(){
        return (
            <div className="row">
                <div className="col-xs-2"/>                
                <div className="col-xs-7">
                    <form>
                        <a style={{cursor: "pointer"}} onClick={this.props.cancel}> Vissza</a>
                        <button className="btn btn-success" style={{float: 'right'}} onClick={this.update.bind(this)}>Ment</button>
                        <div className="form-group">
                            <label htmlFor="datum">Datum</label>
                            <input type="text" disabled="disabled" className="form-control" id="datum" value={this.props.bank.datum}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="leiras">Leiras</label>
                            <textarea className="form-control" disabled="disabled" rows="6" cols="50" id="leiras" value={this.props.bank.leiras}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="osszeg">Osszeg</label>
                            <input type="text" disabled="disabled" className="form-control" id="osszeg" name="osszeg" value={this.props.bank.osszeg}/>
                        </div>
                        {this.state.additionalSzamlak.map((item, idx) => {
                            return(
                                <div key={idx} >
                                    <div className="form-group" style={{float: 'left', paddingRight: '20px'}}>
                                        <label htmlFor="ugyfel">Ugyfel</label>
                                        <select value={item.ugyfelKod} className="editor form-control" style={{width: "inherit"}}
                                                onChange={(event) => this.setUgyfel(item, event.target.value)}>
                                            <option value=''></option>
                                            {this.props.ugyfelek.map(ugyfel => {
                                                return <option key={ugyfel.ugyfelKod} value={ugyfel.ugyfelKod}>{ugyfel.nev}</option>
                                            })}
                                        </select>
                                    </div>
                                    {this.renderSzamlaSorszamComponent(item)}
                                </div>
                            );
                        })}
                        <div className="form-group">
                            <button onClick={() => this.addNewSzamla()} className="btn btn-primary">+</button>
                        </div>
                    </form>
                </div>
                <div className="col-xs-3"/>
            </div> 
        );
    }
}