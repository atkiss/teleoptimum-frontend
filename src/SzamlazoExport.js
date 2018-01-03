import React, { Component } from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';

export default class SzamlazoExport extends Component {

    constructor(props){
        super(props);
        this.state = {
            ugyfelek: [],
            rows:[],
            converted:''
        }
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
            this.setState({ ugyfelek: json })
        }).catch((ex) => {
            console.log('parsing failed', ex)
        });

    }

    handleFileUpload(event){
        let f = event.target.files[0]
        let reader = new FileReader();
        reader.onloadend = () => {
            let rows = reader.result.split("\n").map((row, idx) => {
                if (idx === 0){
                    return null;
                }
                let columns = row.split("\t");
                return {
                    sorszam: parseInt(columns[0].substring(1, columns[0].length)),
                    megnevezes: columns[1],
                    egysegar: columns[5],
                    afakulcs: columns[6],
                    netto: parseFloat(columns[7]),
                    afa: parseFloat(columns[8]),
                    brutto: parseFloat(columns[9]),
                    kelt: columns[10],
                    hatarido: columns[11],
                    ugyfel: columns[15]
                }
            }).filter(item => item !== null);
            this.setState({rows: rows});
            let converted = this.convertData(this.reduceData(rows));
            this.setState({converted: converted});
        };
        reader.readAsText(f);
    }

    reduceData(rows){
        let reduced = [];
        rows.forEach(row => {
            let data = reduced.find(data => row.sorszam === data.sorszam && row.afakulcs === data.afakulcs);
            if (data){
                data.afa += row.afa;
                data.netto += row.netto;
                data.brutto += row.brutto;
            }else{
                reduced.push(row);
            }
        });
        return reduced;
    }

    convertData(rows){
        let data = "konto\tgkto\tbelegnr\tbuchdat\tleistdat\tbucod\tsteucod\tbetrag\tmwst\tsteuer\ttext\tzziel\tsymbol\tgegenbuchkz\tverbuchkz\tperiode\topbetrag\n";
        rows.forEach(row => {
            let ugyfel = this.state.ugyfelek.find(ugyfel => ugyfel.nev.trim().toLowerCase() === row.ugyfel.trim().toLowerCase());
            if (!ugyfel){
                ugyfel = {
                    ugyfelKod: row.ugyfel
                };
            }
            let period = row.kelt.split('.')[1];
            let description = "egyeb";
            if (row.megnevezes.indexOf("Távközlési szolgáltatás dija") > -1 && row.afakulcs === "18"){
                description = "internet";
            }else if (row.megnevezes.indexOf("Távközlési szolgáltatás dija") > -1 && row.afakulcs === "27"){
                description = "távközlési díj";
            }
            data += `${ugyfel.ugyfelKod}\t911100\t${row.sorszam}\t${row.kelt}\t${row.hatarido}\t1\t01\t${row.brutto}\t${row.afakulcs}\t${row.afa}\t${description}\t${row.hatarido}\tKI\tE\tA\t${period}\t${row.brutto}\n`;
        });
        return data;
    }

    render(){
        return (
            <div>
                <TeleoptimumMenu active='export'/>
                <div className="container" style={{width: '80%'}}>
                    <div className="row">
                        <div className="col-xs-12">
                            <form>
                                <div className="form-group" style={{float:"left"}}>
                                    <label htmlFor="szamlaInput">Szamlazo Export</label>
                                    <input type="file" id="szamlaInput" onChange={this.handleFileUpload.bind(this)}/>
                                </div>
                                <div className="form-group">
                                    <textarea className="form-control" rows="10" value={this.state.converted}></textarea>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}