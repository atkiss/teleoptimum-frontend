import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/react-datepicker/dist/react-datepicker.min.css'
import '../node_modules/react-datepicker/dist/react-datepicker-cssmodules.min.css'

import SzamlaUpload from './SzamlaUpload';
import SzamlaGenerator from './SzamlaGenerator';
import EmailKuldo from './EmailKuldo';
import Login from './Login';
import Ugyfelek from './Ugyfelek';
import Telefonszamok from './Telefonszamok';
import SzamlazoExport from './SzamlazoExport';
import Befizetesek from './Befizetesek';
import Szamlak from './Szamlak';
import Merleg from './Merleg';

class App extends Component {

  constructor(props){
    super(props);
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  setUser(username, password){    
    this.user = {
      username: username,
      password: password
    }
    localStorage.setItem('user', JSON.stringify(this.user));
  }

  render() {
    if (!this.user){
      return <Login setUser={this.setUser.bind(this)} />;
    }
    switch (this.props.location[0])  {
    case '':
    case 'upload':
      return <SzamlaUpload user={this.user}/>;
    case 'generate':
      return <SzamlaGenerator type="generate" user={this.user}/>
    case 'browse':
      return <SzamlaGenerator type="browse" user={this.user}/>
    case 'szamlak':
      return <Szamlak user={this.user}/>
    case 'email':
      return <EmailKuldo user={this.user}/>
    case 'ugyfelek':
      return <Ugyfelek user={this.user}/>
    case 'telefonszamok':
      return <Telefonszamok user={this.user}/>
    case 'export':
      return <SzamlazoExport user={this.user}/>
    case 'befizetesek':
      return <Befizetesek user={this.user}/>
    case 'befizetesek_list':
      return <Befizetesek type="list" user={this.user}/>
    case 'merleg':
      return <Merleg user={this.user}/>
    default:
      return <div><h1>Not Found</h1></div>;
    }
  }
}

export default App;

// Split location into `/` separated parts, then render `Application` with it
function handleNewHash() {
  var location = window.location.hash.replace(/^#\/?|\/$/g, '').split('/');
  console.log(location);
  var application = <App location={location} />;
  ReactDOM.render(application, document.getElementById('root'));
}

// Handle the initial route and browser navigation events
handleNewHash()
window.addEventListener('hashchange', handleNewHash, false);
