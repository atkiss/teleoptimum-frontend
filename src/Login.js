import React from 'react';

export default class Login extends React.Component {

    setCredentials(){
         this.props.setUser(this.username, this.password);
         window.location.hash = '#/';
    }

    render(){
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <form>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Felhasznalo</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Felhasznalo" onChange={(e) => {this.username = e.target.value}}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Jelszo</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Jelszo" onChange={(e) => {this.password = e.target.value}}/>
                            </div>
                            <a type="submit" onClick={this.setCredentials.bind(this)} className="btn btn-default">Submit</a>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}