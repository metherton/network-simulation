
class MeNetwork extends HTMLElement {

  constructor() {
    super();
    // private variables
    this._private1 = null;
    //create a shadow root
    this._root = this.attachShadow({"mode": "open"});
  }

  connectedCallback() {
    this._root.innerHTML = `
      <style>
        #container {
          display: flex;
          flex-direction: column;
        }
        #start-simulation {
          width: 100%;
          font-size: 2em;
          padding: 1em;
        }
        #start-simulation:hover {
          cursor: pointer;
        }
        #network-path {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        #packet-generator {
          width: 10%;
          background: lightgrey;
          padding: 1em 0 1em 0;
          z-index: 30;
          text-align: center;
        }
        #packet-consumer {  
          width: 10%;
          background: lightgrey;
          padding: 1em 0 1em 0;
          z-index: 30;
          text-align: center;
        }
        #packet-path-container {
          width: 100%;
          position: absolute;
        }
        #packet-path {
          width: 80%;
        }
        #button-container {
          width: 100%;
          display:flex;
        }
        #buffer {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-top: 2em;
        }
        #buffer div {
          width: 5%;
        }
        #network {
          margin-top: 1em;
        }
      </style>
      <script src="network-simulation.js"></script>
        
      <div id="container">
        <div id="button-container">
          <button id="start-simulation" type="button">Start Network Simulation</button>     
        </div>
        <div id="network">
          <div id="network-path">
            <div id="packet-generator">Packet generator</div>
            <div id="packet-path-container">
              <div id="packet-path">
                <!--<me-packet></me-packet>-->
              </div>      
            </div>
            <div id="packet-consumer">Packet consumer</div>
          </div>
        </div>
        
        <div id="buffer">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </div>
      </div>
    `;
    this._$startSimulationButton = this._root.querySelector('#start-simulation');
    this._$startSimulationButton.addEventListener('click', (event) => {
      const packets = packageProcessor().start();
      for (let i = 0; i < packets.length; i += 1) {
        console.log('packet: startTime: ' + packets[i].startTime() + ' processTime: ' + packets[i].processTime() + ' scheduledTime: ' + packets[i].scheduledTime() + ' dropped: ' + packets[i].dropped() + ' bufferId: ' + packets[i].bufferId() );
        const packet = document.createElement('me-packet');
        packet.setAttribute('id', 'packet' + i);
        packet.data = {
          id: i,
          startTime: packets[i].startTime(),
          processTime: packets[i].processTime(),
          scheduledTime: packets[i].scheduledTime(),
          bufferId: packets[i].bufferId(),
          dropped: packets[i].dropped(),
        };
        this._root.getElementById('packet-path').appendChild(packet);
        setTimeout(() => {
          packet.setAttribute('move', true);
        }, packets[i].scheduledTime() * 1000);
      }
   //   packet.classList.add('move');
    //  this._render();
    });
    // this._$move = this._root.querySelector('#move');
    // this._$move.addEventListener('click', (event) => {
    //   const packet = this._root.querySelector('me-packet');
    //   packet.setAttribute('move', true);
    // });
    //this._$text = this._root.querySelector('#text'); //store important elements for later use..prefixing DOM elements with $
  //  this._render();
  }

  _render() {
    //this._$text.innerText = '... is awesome !'; // selectively update only parts of the template which need to change
  }

  // observe attribute changes
  static get observedAttributes() {
    return ['an-important-attribute'];
  }

  // react to attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    // do stuff
  }

  // use setters and getters to create an API for the component
  set property1(data) {
    if (this._private1 === data) return;
    this._private1 = data;
  //  this._render();
  }

  get property1() {
    return this._private1;
  }

  disconnectedCallback() {
   // do stuff
  }


}

window.customElements.define('me-network', MeNetwork);
