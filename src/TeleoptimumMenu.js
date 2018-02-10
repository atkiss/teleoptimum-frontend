import React, { Component } from 'react';
export default class TeleoptimumMenu extends Component {

	constructor(props){
		super(props);
	}

	logout(){
		localStorage.removeItem("user");
		location.reload(true);
	}

	render(){
		return (
			<nav className="navbar navbar-default">
				<ul className="nav nav-pills">
					<li role="presentation" className={this.props.active == "telefonszamok" ? 'active' : ''}><a href="#/telefonszamok">Telefonszámok</a></li>
				    <li role="presentation" className={this.props.active == "ugyfelek" ? 'active' : ''}><a href="#/ugyfelek">Ügyfelek</a></li>
					<li role="presentation" className={this.props.active == "export" ? 'active' : ''}><a href="#/export">Számlázó export</a></li>
					<li role="presentation" className={this.props.active == "szamlak" ? 'active dropdown' : 'dropdown'}>
						<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
							Számlázás <span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							<li><a href="#/upload">Feltöltés</a></li>
				            <li><a href="#/browse">Böngészés</a></li>
							<li><a href="#/szamlak">Szamlak</a></li>
							<li><a href="#/generate_szamla">Szamla Keszites</a></li>
							<li><a href="#/email">Küldés emailben</a></li>
						</ul>
					</li>
					{this.props.children}
					<li role="presentation" className={this.props.active == "befizetesek" ? 'active dropdown' : ''}>
						
						<a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
							Befizetések <span className="caret"></span>
						</a>
						<ul className="dropdown-menu">
							<li><a href="#/befizetesek">Feltöltés</a></li>
				            <li><a href="#/befizetesek_list">Böngészés</a></li>
							<li><a href="#/merleg">Merleg</a></li>
						</ul>	
					</li>
					<li role="presentation" style={{float: "right"}}><a style={{cursor: "pointer"}} onClick={this.logout.bind(this)}>Kijelentkezés</a></li>
				</ul>			   
    		</nav>
		);
	}
}