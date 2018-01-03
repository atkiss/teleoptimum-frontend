import React, { Component } from 'react';
import TeleoptimumMenu from './TeleoptimumMenu';

export default class Telefonszamok extends Component {

    constructor(props){
        super(props)
        this.getTelefonszamok();
        this.state = {
            telefonszamok: [],
            ugyfelek: []
        };
        this.highestId = -1;
    }

    getTelefonszamok(){
        let fetchedTelefonszamok;
        fetch(window.CONFIG.backend + '/telefonszamok', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        }).then((telefonszamok) => {
            fetchedTelefonszamok = telefonszamok;
            return fetch(window.CONFIG.backend + '/ugyfelek', {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
                    'Content-Type': 'application/json'
                }
            });
        }).then((response) => {
            return response.json();
        }).then((ugyfelek) => {
            fetchedTelefonszamok.forEach(telefonszam => {
                if (this.highestId < telefonszam.id){
                    this.highestId = telefonszam.id;
                }
                telefonszam.ugyfel = ugyfelek.find(ugyfel => ugyfel.id === telefonszam.ugyfelId)
            });
            this.setState({ ugyfelek: ugyfelek, telefonszamok: fetchedTelefonszamok });
            this.telefonszamok = fetchedTelefonszamok;
        }).catch((ex) => {
            console.log('parsing failed', ex)
        });
    }

    addNewTelefonszam(){
        let telefonszamok = this.state.telefonszamok;
        let telefonszam = [{
            editMode: "new",
            id: this.highestId + 1,
            telefonszam: '',
            ugyfelId: -1
        }];
        let newTelefonszamok = telefonszam.concat(telefonszamok);
        this.setState({telefonszamok: newTelefonszamok});
        this.telefonszamok = newTelefonszamok;
    }

    updateUgyfel(value, telefonszam){
        telefonszam.ugyfelId = parseInt(value);
        telefonszam.ugyfel = this.state.ugyfelek.find(ugyfel => ugyfel.id === parseInt(value));
        if(telefonszam.editMode === true){
            telefonszam.editMode = "modified";
        }
        this.forceUpdate();
    }

    updateTelefonszam(value, telefonszam){
        telefonszam.telefonszam = value;
        if(telefonszam.editMode === true){
            telefonszam.editMode = "modified";
        }
        this.forceUpdate();
    }

    ugyfelCellRenderer(telefonszam){
        if (telefonszam.editMode){
            return (<div>
                <select defaultValue={telefonszam.ugyfelId} className="form-control" style={{width: "inherit"}}
                        onChange={(event) => this.updateUgyfel(event.target.value, telefonszam)}>
                    {this.state.ugyfelek.map(ugyfel => {
                        return <option key={ugyfel.id} value={ugyfel.id}>{ugyfel.nev}</option>
                    })}
                </select>
            </div>);
        }else{
            return (<div>
                {telefonszam.ugyfel ? telefonszam.ugyfel.nev : ""}
            </div>);
        }
    }

    telefonszamCellRenderer(telefonszam){
        if (telefonszam.editMode){
            return (<div>
                <input type="text" className="form-control" defaultValue={telefonszam.telefonszam}
                                   onChange={(event) => this.updateTelefonszam(event.target.value, telefonszam)}/>
                </div>);
        }else{
            return (<div>{telefonszam.telefonszam}</div>)
        }
    }

    switchEditor(telefonszam){
        this.state.telefonszamok.forEach(telefonszam => {
            if (telefonszam.editMode && telefonszam.editMode === true){
                delete telefonszam.editMode;
            }
        });
        if (!telefonszam.editMode){
            telefonszam.editMode = true;
        }
        this.setState({telefonszamok: this.state.telefonszamok});
    }

    deleteTelefonszam(telefonszam){
        telefonszam.editMode = "deleted";
        this.setState({telefonszamok: this.state.telefonszamok});
    }

    filterTelefonszamok(toFilter){
        if (toFilter.trim() === ""){
            this.setState({telefonszamok: this.telefonszamok});
        }else {
            let filtered = this.telefonszamok.filter(telefonszam => {
                return (telefonszam.telefonszam.indexOf(toFilter) > -1 || telefonszam.ugyfel.nev.toLowerCase().indexOf(toFilter.toLowerCase()) > -1)
            });
            this.setState({telefonszamok: filtered});
        }
    }

    persistChanges(){
        let changes = this.telefonszamok.filter(telefonszam => telefonszam.editMode !== undefined);
        let url = window.CONFIG.backend + '/telefonszamok';
        let toDelete = changes.filter(telefonszam => telefonszam.editMode === "deleted");
        toDelete.forEach(telefonszam => {
            delete telefonszam.editMode;
            delete telefonszam.ugyfel;
        });
        if (toDelete.length > 0){
            this.remoteCall(toDelete, "DELETE");
        }

        let toUpdate = changes.filter(telefonszam => telefonszam.editMode === "modified");
        toUpdate.forEach(telefonszam => {
            delete telefonszam.editMode;
            delete telefonszam.ugyfel;
        });
        if (toUpdate.length > 0){
            this.remoteCall(toUpdate, "PUT");
        }

        let toInsert = changes.filter(telefonszam => telefonszam.editMode === "new");
        toInsert.forEach(telefonszam => {
            delete telefonszam.editMode;
            delete telefonszam.ugyfel;
        });
        if (toInsert.length > 0){
            this.remoteCall(toInsert, "POST");
        }
        console.log("changed: " + changes);
    }

    remoteCall(body, type){
        let url = window.CONFIG.backend + '/telefonszamok';
        fetch(url, {
			method: type,
			headers: {
				'Authorization': 'Basic '+btoa(this.props.user.username + ":" + this.props.user.password),
				'Content-Type': 'application/json'
			},
            body: JSON.stringify(body)
		})
		.then((response) => {
			if (response.ok){
				this.getTelefonszamok();
			}else{
                let error = new Error('hiba tortent mentes kozben');
                error.response = response.json();
                throw error;
            }
		})
		.catch((ex) => {
			console.log('hiba tortent mentes kozben', ex);
            let alertMessage = ex.message + " ";
            if (ex.response){
                ex.response.then(resp => {
                    alertMessage += resp.message();
                    alert('hiba tortent mentes kozben' + ex);
                    this.getTelefonszamok();
                });
            }
            
		});
    }

    renderTelefonszamok(){
        return this.state.telefonszamok.filter(telefonszam => telefonszam.editMode !== "deleted").map((telefonszam, idx) => {
            return (
                <tr key={idx}>
                    <td onClick={() => this.switchEditor(telefonszam)} style={{cursor: "pointer"}}>
                        {this.telefonszamCellRenderer(telefonszam)}
                    </td>
                    <td onClick={() => this.switchEditor(telefonszam)} style={{cursor: "pointer"}}>
                        {this.ugyfelCellRenderer(telefonszam)}
                    </td>
                    <td><a style={{cursor: "pointer"}} onClick={() => {this.deleteTelefonszam(telefonszam);}}>torol</a></td>
                </tr>
            );
        });
    }

    render(){
        return (
            <div>
                <TeleoptimumMenu active='telefonszamok'>
            	</TeleoptimumMenu>
                <div className="container">
                    <div className="row">
                        <div className="col-xs-6" style={{textAlign: "left"}}>
                            <button style={{marginBottom: "10px", marginRight: "10px"}} className="btn btn-primary" 
									  onClick={this.addNewTelefonszam.bind(this)}>Uj telefonszam</button>
                            <button style={{marginBottom: "10px"}} className="btn btn-success" 
									  onClick={this.persistChanges.bind(this)}>Mentes</button>
                        </div>
                        <div className="col-xs-6" style={{textAlign: "right"}}>
                             <input type="text" className="form-control" 
                                   onChange={(event) => this.filterTelefonszamok(event.target.value)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="table-responsive">	
                                <table className="table table-bordered">
						            <thead>
						                <tr>
						                    <th>Telefonszam</th>
						                    <th>Ugyfel</th>
                                            <th>Commands</th>					                
						                </tr>				
                                        {this.renderTelefonszamok()}		                
						            </thead>
                                </table>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}