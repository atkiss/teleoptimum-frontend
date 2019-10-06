import React, { Component } from 'react';

export const Enums = {
  //EGYCSOPORT_HIVAS: {id: 'EGYCSOPORT_HIVAS', text: 'EGYCSOPORT_HIVAS', value: 'EGYCSOPORT_HIVAS', title: 'EGYCSOPORT_HIVAS', tovabbszamlazva: true},
  TELENOR_MOBIL: {id: 'TELENOR_MOBIL', value: 'TELENOR_MOBIL', text: 'TELENOR_MOBIL', title: 'TELENOR_MOBIL', tovabbszamlazva: {sima: true, korlatlan: false}},
  TESCO_MOBIL: {id: 'TESCO_MOBIL', value: 'TESCO_MOBIL', text: 'TESCO_MOBIL', title: 'TESCO_MOBIL', tovabbszamlazva: {sima: true, korlatlan: false}},
  TMOBILE_MOBIL: {id: 'TMOBILE_MOBIL', value: 'TMOBILE_MOBIL', text: 'TMOBILE_MOBIL', title: 'TMOBILE_MOBIL', tovabbszamlazva: {sima: true, korlatlan: false}},
  VODAFON_MOBIL: {id: 'VODAFON_MOBIL', value: 'VODAFON_MOBIL', text: 'VODAFON_MOBIL', title: 'VODAFON_MOBIL', tovabbszamlazva: {sima: true, korlatlan: false}},
  AUTOSKARTYA: {id: 'AUTOSKARTYA', value: 'AUTOSKARTYA', text: 'AUTOSKARTYA', title: 'AUTOSKARTYA', tovabbszamlazva: {sima: true, korlatlan: true}},
  MOBIL_INTERNET: {id: 'MOBIL_INTERNET', value: 'MOBIL_INTERNET', text: 'MOBIL_INTERNET', title: 'MOBIL_INTERNET', tovabbszamlazva: {sima: true, korlatlan: true}},
  INTERNET_HAVIDIJKEDVEZMENY: {id: 'INTERNET_HAVIDIJKEDVEZMENY', value: 'INTERNET_HAVIDIJKEDVEZMENY', text: 'INTERNET_HAVIDIJKEDVEZMENY', title: 'INTERNET_HAVIDIJKEDVEZMENY', tovabbszamlazva: {sima: false, korlatlan: false}},
  SMS: {id: 'SMS', value: 'SMS', text: 'SMS', title: 'SMS', tovabbszamlazva: {sima: true, korlatlan: true}},
  KEDVEZMENY: {id: 'KEDVEZMENY', value: 'KEDVEZMENY', text: 'KEDVEZMENY', title: 'KEDVEZMENY', tovabbszamlazva: {sima: false, korlatlan: false}},
  HAVIDIJ: {id: 'HAVIDIJ', value: 'HAVIDIJ', text: 'HAVIDIJ', title: 'HAVIDIJ', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  //ELOFIZETES: {id: 'ELOFIZETES', value: 'ELOFIZETES', text: 'ELOFIZETES', title: 'ELOFIZETES', tovabbszamlazva: {sima: true, korlatlan: true}},
  BELFOLDI_VEZETEKES: {id: 'BELFOLDI_VEZETEKES', value: 'BELFOLDI_VEZETEKES', text: 'BELFOLDI_VEZETEKES', title: 'BELFOLDI_VEZETEKES', tovabbszamlazva: {sima: true, korlatlan: false}},
  //KEDVENC_VEZETEKES: {id: 'KEDVENC_VEZETEKES', value: 'KEDVENC_VEZETEKES', text: 'KEDVENC_VEZETEKES', title: 'KEDVENC_VEZETEKES', tovabbszamlazva: {sima: true, korlatlan: false}},
  MOBIL_VASARLAS: {id: 'MOBIL_VASARLAS', value: 'MOBIL_VASARLAS', text: 'MOBIL_VASARLAS', title: 'MOBIL_VASARLAS', tovabbszamlazva: {sima: true, korlatlan: true}},
  EGYEB: {id: 'EGYEB', value: 'EGYEB', text: 'EGYEB', title: 'EGYEB', tovabbszamlazva: {sima: true, korlatlan: true}},
  HANGPOSTA: {id: 'HANGPOSTA', value: 'HANGPOSTA', text: 'HANGPOSTA', title: 'HANGPOSTA', tovabbszamlazva: {sima: true, korlatlan: false}},
  MOBIL_INTERNET_100M: {id: 'MOBIL_INTERNET_100M', value: 'MOBIL_INTERNET_100M', text: 'MOBIL_INTERNET_100M', title: 'MOBIL_INTERNET_100M', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_500M: {id: 'MOBIL_INTERNET_500M', value: 'MOBIL_INTERNET_500M', text: 'MOBIL_INTERNET_500M', title: 'MOBIL_INTERNET_500M', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_1G: {id: 'MOBIL_INTERNET_1G', value: 'MOBIL_INTERNET_1G', text: 'MOBIL_INTERNET_1G', title: 'MOBIL_INTERNET_1G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_2G: {id: 'MOBIL_INTERNET_2G', value: 'MOBIL_INTERNET_2G', text: 'MOBIL_INTERNET_2G', title: 'MOBIL_INTERNET_2G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_4G: {id: 'MOBIL_INTERNET_4G', value: 'MOBIL_INTERNET_4G', text: 'MOBIL_INTERNET_4G', title: 'MOBIL_INTERNET_4G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_7G: {id: 'MOBIL_INTERNET_7G', value: 'MOBIL_INTERNET_7G', text: 'MOBIL_INTERNET_7G', title: 'MOBIL_INTERNET_7G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_13G: {id: 'MOBIL_INTERNET_13G', value: 'MOBIL_INTERNET_13G', text: 'MOBIL_INTERNET_13G', title: 'MOBIL_INTERNET_13G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_24G: {id: 'MOBIL_INTERNET_24G', value: 'MOBIL_INTERNET_24G', text: 'MOBIL_INTERNET_24G', title: 'MOBIL_INTERNET_24G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_50G: {id: 'MOBIL_INTERNET_50G', value: 'MOBIL_INTERNET_50G', text: 'MOBIL_INTERNET_50G', title: 'MOBIL_INTERNET_50G', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},
  MOBIL_INTERNET_UNLIMITED: {id: 'MOBIL_INTERNET_UNLIMITED', value: 'MOBIL_INTERNET_UNLIMITED', text: 'MOBIL_INTERNET_UNLIMITED', title: 'MOBIL_INTERNET_UNLIMITED', tovabbszamlazva: {sima: true, korlatlan: true}, egyseg: 'honap', mennyiseg: 1},

  asArrays: (obj) => {
    let ret = [];
    Object.keys(obj).forEach((prop)=>{
      if (typeof obj[prop] !== 'function'){
        ret.push(prop);
      }
    });
    return ret;
  }
}

export class TarifaTipusSelector {

  static getTarifaTipusok(){
    return Enums.asArrays(Enums);
  }

  static findTipus(tarifaCsomag){
    tarifaCsomag = tarifaCsomag.toLowerCase();
    if (tarifaCsomag == "egycsoport mobilhívás") {
      return Enums.EGYCSOPORT_HIVAS.value;
    }
    if (tarifaCsomag == "mobilhívás"){
      return Enums.TELENOR_MOBIL.value;
    }
    if (tarifaCsomag == "belföldi hívás tesco mobile hálózatba") {
      return Enums.TESCO_MOBIL.value;
    }
    if (tarifaCsomag == "autoskártya") {
      return Enums.AUTOSKARTYA.value;
    }
    if (tarifaCsomag == "pannon internet éjjel-nappal üzleti"){
      return Enums.MOBIL_INTERNET.value;
    }
    if (tarifaCsomag.search(/vállalati mobil online\b(.*)/) >= 0){
        if (tarifaCsomag == "vállalati mobil online 100 mb"){
          return Enums.MOBIL_INTERNET_100M.value;
        }
        if (tarifaCsomag == "vállalati mobil online 500 mb"){
          return Enums.MOBIL_INTERNET_500M.value;
        }
        if (tarifaCsomag == "vállalati mobil online 1 gb"){
          return Enums.MOBIL_INTERNET_1G.value;
        }
        if (tarifaCsomag == "vállalati mobil online 2 gb"){
          return Enums.MOBIL_INTERNET_2G.value;
        }
    }
    if (tarifaCsomag.search(/vállalati hipernet\b(.*)/) >= 0){
        if (tarifaCsomag == "vállalati hipernet start"){
          return Enums.MOBIL_INTERNET_4G.value;
        }
        if (tarifaCsomag == "vállalati hipernet active"){
          return Enums.MOBIL_INTERNET_7G.value;
        }
        if (tarifaCsomag == "vállalati hipernet medium"){
          return Enums.MOBIL_INTERNET_13G.value;
        }
        if (tarifaCsomag == "vállalati hipernet heavy"){
          return Enums.MOBIL_INTERNET_24G.value;
        }
        if (tarifaCsomag == "vállalati hipernet pro"){
          return Enums.MOBIL_INTERNET_50G.value;
        }
        if (tarifaCsomag == "vállalati hipernet unlimited"){
          return Enums.MOBIL_INTERNET_UNLIMITED.value;
        }
    }

    if (tarifaCsomag == 'hangpostahívás'){
        return Enums.HANGPOSTA.value;
    }
    if (tarifaCsomag == "internet havidíjkedvezmény"){
      return Enums.INTERNET_HAVIDIJKEDVEZMENY.value;
    }
    if (tarifaCsomag  == "szöveges üzenet" || tarifaCsomag  == "sms a t-mobile hálózatába" || tarifaCsomag == "sms a vodafone hálózatába" || tarifaCsomag == "sms hálózaton belül") {
      return Enums.SMS.value;
    }
    if (tarifaCsomag.startsWith("pannon internet")) {
      return Enums.MOBIL_INTERNET.value;
    }
    if (tarifaCsomag.search(/(.*)kedvezmény\b(.*)/) >= 0) {
      return Enums.KEDVEZMENY.value;
    }
    if (tarifaCsomag.search(/(.*)\belõfizetés(.*)havidíj\b(.*)/) >= 0) {
      return Enums.HAVIDIJ.value;
    }
    if (tarifaCsomag.search(/(.*)\belõfizetés\b(.*)/) >= 0) {
      return Enums.HAVIDIJ.value;
    }
    if (tarifaCsomag.search(/(.*)\bmobilhívás\b(.*)/) >= 0){
      if (tarifaCsomag.search(/(.*)\bmagyar telekom\b(.*)/) >= 0){
        return Enums.TMOBILE_MOBIL.value;
      }else if (tarifaCsomag.search(/(.*)\bvodafone\b(.*)/) >= 0){
        return Enums.VODAFON_MOBIL.value;
      }else if (tarifaCsomag.search(/(.*)\btelenor\b(.*)/) >= 0){
        return Enums.TELENOR_MOBIL.value;
      }
    }
    if (tarifaCsomag.search(/(.*)\bkedvenc\b(.*)/) >= 0){
      return Enums.KEDVENC_VEZETEKES.value;
    }
    if (tarifaCsomag.search(/(.*)\bhívás\b(.*)/) >= 0 && tarifaCsomag.search(/(.*)\bbelföldi\b(.*)/) >= 0 && tarifaCsomag.search(/tudakozó/) < 0){
      return Enums.BELFOLDI_VEZETEKES.value;
    }
    return Enums.EGYEB.value;
  }

  static isKedvezmenyes(tipus){
      if (tipus == Enums.TELENOR_MOBIL.value ||
          tipus == Enums.TESCO_MOBIL.value ||  
          tipus == Enums.TMOBILE_MOBIL.value ||
          tipus == Enums.VODAFON_MOBIL.value ||
          tipus == Enums.BELFOLDI_VEZETEKES.value){
          return true;
      }
      return false;
  }

}
