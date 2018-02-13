import React, {Component} from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import SzamlaDisplay from './components/SzamlaDisplay';

export default class GenerateSzamla extends Component {
    constructor(props) {
        super(props);
        this.telefonszamok = [];
        this.state = {
            szamla: this.createEmptySzamla(),
            ugyfelek: [],
            telefonszamok: []
        }
        this.getUgyfelek()
            .then((json) => {
                this.setState({ ugyfelek: json })
            })
            .then(() => {
                return this.getTelefonszamok();
            })
            .then(json => {
                this.telefonszamok = json;
            })
            .catch((ex) => {
                console.log('parsing failed', ex)
            });
    }

    createEmptySzamla(){
        return {
            szamlaSorszam: 'P000001',
            fizetesiMod: 'ATUTALAS',
            teljesites: moment().add(10, 'days'),
            kelte: moment(),
            hatarido: moment().add(10, 'days'),
            nev: '',
            adoszam: '',
            cim: {
                iranyitoszam: '',
                varos: '',
                kozterulet: '',
                kozterulet_tipus: 'utca',
                haz_szam: ''
            },
            szamlaTetelek: [
                {
                    id: 0,
                    telefonszam: -1,
                    megnevezes: '',
                    mennyiseg: 0,
                    egyseg: '',
                    nettoegysegar: 0,
                    afakulcs: 0,
                    nettoar: 0,
                    bruttoar: 0,
                    updateValues() {
                        this.nettoar = (this.nettoegysegar * this.mennyiseg);
                        this.bruttoar = (this.nettoegysegar * this.mennyiseg * (100 + this.afakulcs) / 100);
                    }
                }
            ] 
        }
    }

    addNewTetel(){
        const maxId = this.state.szamla.szamlaTetelek.reduce((max, tetel) => {
            return tetel.id > max ? tetel.id : max
        }, 0);
        const newTetel = {
            id: maxId+1,
            telefonszam: 0,
            megnevezes: '',
            mennyiseg: 0,
            egyseg: '',
            nettoegysegar: 0,
            afakulcs: 0,
            nettoar: 0,
            bruttoar: 0,
            updateValues() {
                this.nettoar = (this.nettoegysegar * this.mennyiseg);
                this.bruttoar = (this.nettoegysegar * this.mennyiseg * (100 + this.afakulcs) / 100);
            }
        }
        this.state.szamla.szamlaTetelek.push(newTetel);
        this.setState({szamla: this.state.szamla});
    }

    removeTetel(idx){
        this.state.szamla.szamlaTetelek.splice(idx, 1);
        this.setState({szamla: this.state.szamla});
    }

    getUgyfelek(){
        return fetch(window.CONFIG.backend + '/ugyfelek', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            return response.json()
        });
    }

    getTelefonszamok(){
        return fetch(window.CONFIG.backend + '/telefonszamok', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            return response.json()
        });
    }

    updateUgyfel(ugyfelId){
        let ugyfel = this.state.ugyfelek.find(ugyfel => ugyfel.id == ugyfelId);
        this.state.szamla.nev = ugyfel.nev;
        let cim = ugyfel.cimek.find(cim => cim.tipus === 'LEVELEZESI');
        this.state.szamla.cim = cim;
        this.state.szamla.adoszam = ugyfel.adoszam;
        let selectedTelefonszamok = this.telefonszamok.filter(it => it.ugyfelId == ugyfelId);
        this.setState({szamla: this.state.szamla, telefonszamok: selectedTelefonszamok});
    }

    updateFizetesiMod(mod){
        this.state.szamla.fizetesiMod = mod;
        this.setState({szamla: this.state.szamla});
    }

    updateDatum(date, field){
        this.state.szamla[field] = date;
        this.setState({szamla: this.state.szamla});
    }

    renderForm(){
        return (
            <div>
                <div className="tetel-editor">
                    <div>Ugyfel</div>
                    <select id="ugyfel" className="form-control" style={{width: "inherit"}}
                            onChange={(event) => this.updateUgyfel(event.target.value)}>
                            <option value="">Choose...</option>
                        {this.state.ugyfelek.map(ugyfel => {
                            return <option key={ugyfel.id} value={ugyfel.id}>{ugyfel.nev}</option>
                        })}
                    </select>
                </div>
                <div className="tetel-editor">
                    <div>Fizetesi Mod</div>
                    <select id="fizetesiMod" className="form-control" style={{width: "inherit"}}
                            onChange={(event) => this.updateFizetesiMod(event.target.value)}>
                            <option value="">Choose...</option>
                            <option value="ATUTALAS">Atutalas</option>
                            <option value="POSTAI_CSEKK">Csekkes</option>
                    </select>
                </div>
                <div className="tetel-editor">
                    <div>Teljesítés</div>
                    <DatePicker id='teljesites' className="form-control"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.szamla.teljesites}
                        onChange={(date) => this.updateDatum(date, 'teljesites')} 
                    />
                </div>
                <div className="tetel-editor">
                    <div>Kelte</div>
                    <DatePicker id='teljesites' className="form-control"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.szamla.kelte}
                        onChange={(date) => this.updateDatum(date, 'kelte')} 
                    />
                </div>
                <div className="tetel-editor">
                    <div>Határideje</div>
                    <DatePicker id='teljesites' className="form-control"
                        dateFormat="YYYY-MM-DD"
                        selected={this.state.szamla.hatarido}
                        onChange={(date) => this.updateDatum(date, 'hatarido')} 
                    />
                </div>
            </div>
        );
    }

    updateTetel(prop, value, idx){
        this.state.szamla.szamlaTetelek[idx][prop]=value;
        this.state.szamla.szamlaTetelek[idx].updateValues();
        this.setState({szamla: this.state.szamla});
    }

    renderTetelForm(szamlaTetel, idx){
        return (
            <div className="row" key={idx}>
                    <div className="tetel-editor">
                        <div>Telefonszam</div>
                        <select id="telefonszam" className="form-control" 
                                value={szamlaTetel.telefonszam}
                                onChange={(event) => this.updateTetel("telefonszam", event.target.value, idx)}>
                                <option value="-1">Choose...</option>
                                {this.state.telefonszamok.map(telefonszam => {
                                    return <option key={telefonszam.telefonszam} value={telefonszam.telefonszam}>{telefonszam.telefonszam}</option>
                                })}
                        </select>
                    </div>
                    <div className="tetel-editor">
                        <div>Megnevezes</div>
                        <input type="text" id="tetel megnevezes" 
                               className="form-control" value={szamlaTetel.megnevezes}
                               onChange={(event) => this.updateTetel("megnevezes", event.target.value, idx)}/>
                    </div>
                    <div className="tetel-editor">
                        <div>Mennyiseg</div>
                        <input type="text" id="tetel megnevezes" 
                               className="form-control" value={szamlaTetel.mennyiseg}
                               onChange={(event) => this.updateTetel("mennyiseg", event.target.value, idx)}/>
                    </div>
                    <div className="tetel-editor">
                        <div>Egyseg</div>
                        <input type="text" id="tetel megnevezes" 
                               className="form-control" value={szamlaTetel.egyseg}
                               onChange={(event) => this.updateTetel("egyseg", event.target.value, idx)}/>
                    </div>
                    <div className="tetel-editor">
                        <div>Netto Ar</div>
                        <input type="text" id="tetel megnevezes" 
                               className="form-control" value={szamlaTetel.nettoegysegar}
                               onChange={(event) => this.updateTetel("nettoegysegar", parseInt(event.target.value), idx)}/>
                    </div>
                    <div className="tetel-editor">
                        <div>Afakulcs</div>
                        <input type="text" id="tetel megnevezes" 
                               className="form-control" value={szamlaTetel.afakulcs}
                               onChange={(event) => this.updateTetel("afakulcs", parseInt(event.target.value), idx)}/>
                    </div>
                    <div className="tetel-editor">
                    <button type="button" className="btn btn-info" onClick={() => this.removeTetel(idx)}>
                        <span className="glyphicon glyphicon-minus"></span> Eltavolit
                    </button>
                    </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <TeleoptimumMenu active='szamlak'/>
                <div className="container szamla">
                    <form>
                        <div className="row">
                            {this.renderForm()}
                        </div>
                        <h3>Tetelek</h3>
                        {this.state.szamla.szamlaTetelek.map((tetel, idx) => {
                            return this.renderTetelForm(tetel, idx);
                        })}
                        <button type="button" className="btn btn-info" onClick={this.addNewTetel.bind(this)}>
                            <span className="glyphicon glyphicon-plus"></span> Uj Tetel
                        </button>
                    </form>
                    <SzamlaDisplay szamla={this.state.szamla}/>
                </div>
            </div>
        );
    }
}