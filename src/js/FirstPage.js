import React, { Component } from 'react';
import '../css/FirstPage.css';
import './EntryForm'
import EntryForm from "./EntryForm";
import Article from "./Article";


/*https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/#react-firebase-setup*/

class FirstPage extends Component {

    render() {
        if(localStorage.getItem("user") !== "" && localStorage.getItem("user") !== null){
            this.props.history.push('/home');
        }
        return (
            <div className="FirstPage">
                <header className="FirstPage-header" />
                <div className="FirstPage-welcomeImages">
                    <img src={ require('../images/sample.png') } id="img1" alt="First"/>
                    <img src={ require('../images/sample.png') } id="img2" alt="Second"/>
                    <img src={ require('../images/sample.png') } id="img3" alt="Third"/>
                </div>

                <EntryForm/>

                <section id="welcomeText">
                    <Article title={"Deti"} text={"Lienka zaručí, aby aj najmenší používatelia sa vedeli zabaviť pri používaní aplikácie. Vyklikaním postupností jednoduchých príkazov (šípka hore, dole, vľavo, vpravo, zvukový signál, svetelný signál, atď.) sa dá odsimulovať robotickú Lienku online alebo otestovať príkazy priamo na Lienke. V prípade robotickej Lienky sa príkazy posielajú cez Wifi technológiu do hardvéru Lienky, ktorá následne tieto príkazy spracuje a vykoná. Takýmto štýlom sa budú môcť zahrať, pričom sa aj niečo naučia."} />
                    <Article title={"Mladí študenti programovania"} text={"Pre tých, ktorý práve začínajú získavať prvé skúsenosti v oblasti programovania, Lienka bude najlepším učiteľom. Aby sa naučili úplne základy programovania, táto aplikácia obsahuje časť s knižnicou Blockly. Pomocou Blockly vedia vyskladať jednoduché programy ťahaním blokov, ako napríklad cykly (for, while), podmienené príkazy (if), atď. Následne tieto programy sa dajú odsimulované online alebo pomocou robotickej Lienky."} />
                </section>

                <footer>
                    <p>© 2018 Adam Halász.  All rights reserved.</p>
                </footer>
            </div>
        );
    }
}

export default FirstPage;
