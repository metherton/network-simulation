const request = (arrivalTime, processTime) => {
  return {
    arrivalTime: () => {
      return arrivalTime;
    },
    processTime: () => {
      return processTime;
    }
  };
};

const response = (dropped, startTime, bufferId) => {
  return {
    dropped: () => {
      return dropped;
    },
    startTime: () => {
      return startTime;
    },
    bufferId: () => {
      return bufferId;
    }
  };
};

const buffer = (bufferSize) => {
  let finishTimes = [];

  return {
    finishTimes: () => {
      return finishTimes;
    },
    process: (request) => {
      // if buffer is empty then just return the start time of this packet & store finish time for this packet
      let arrivalTime = request.arrivalTime();
      let processTime = request.processTime();
      if (finishTimes.length === 0) {
        finishTimes.push(arrivalTime + processTime);
        return response(false, arrivalTime, 0);
      }
      // lets check if we can remove finishTimes which have already been processed
      let i = 0;
      while (finishTimes[i] !== undefined) {
        if (finishTimes[i] <= arrivalTime) {
          finishTimes.splice(i, 1);
        } else {
          break;
        }
      }
      // lets check if buffer is full .. if it is then we class packet as dropped
      if (finishTimes.length === bufferSize) {
        return response(true, -1);
      } else {

        // lets figure out what the start time actually is for this packet
        let startTime;
        // if nothing in buffer then start time is the start time of the request
        if (finishTimes.length === 0) {
          startTime = arrivalTime;
        } else {
          // else start time is the latest finish time
          startTime = finishTimes[finishTimes.length - 1];
        }
        finishTimes.push(startTime + processTime);
        return response(false, startTime, finishTimes.length - 1);
      }
    }
  };
};

const packageProcessor = () => {

  let bufferSize, numberOfIncomingNetworkPackets;
  let listOfNetworkPackets = [];
  let lineNumber = 0;
  let packageBuffer;
  let responses = [];

  function readLine(line) {
    if (bufferSize === undefined) {
      const firstLine = line.toString().split(' ').map(strToInt);
      bufferSize = firstLine[0];
      packageBuffer = buffer(bufferSize);
      numberOfIncomingNetworkPackets = firstLine[1];
    } else {
      listOfNetworkPackets[lineNumber] = [];
      const packetLine = line.toString().split(' ').map(strToInt);
      listOfNetworkPackets[lineNumber] = request(packetLine[0], packetLine[1]);
      lineNumber += 1;
    }
    if (lineNumber === numberOfIncomingNetworkPackets) {
      run();
    }
  }

  function strToInt(item) {
    return parseInt(item, 10);
  }

  function run() {
    for (let i = 0; i < numberOfIncomingNetworkPackets; i += 1) {
      responses.push(packageBuffer.process(listOfNetworkPackets[i]));
    }
    processResponses();
  }

  function processResponses() {
    for (let i = 0; i < numberOfIncomingNetworkPackets; i += 1) {
      if (responses[i].dropped()) {
        console.log('-1');
      } else {

        console.log(responses[i].startTime() + ' : ' + responses[i].bufferId());
      }
    }
  }

  return {

    readInput: () => {
      const readline = require('readline');
      process.stdin.setEncoding('utf8');
      var rl = readline.createInterface({
        input: process.stdin,
        terminal: false,
      });
      rl.on('line', readLine);
    },

    start: () => {
      bufferSize = 5;
      packageBuffer = buffer(bufferSize);
      numberOfIncomingNetworkPackets = 18;
      listOfNetworkPackets.push(request(0, 1));
      listOfNetworkPackets.push(request(1, 2));
      listOfNetworkPackets.push(request(2, 3));
      listOfNetworkPackets.push(request(3, 1));
      listOfNetworkPackets.push(request(4, 4));
      listOfNetworkPackets.push(request(5, 3));
      listOfNetworkPackets.push(request(6, 1));
      listOfNetworkPackets.push(request(7, 2));
      listOfNetworkPackets.push(request(8, 3));
      listOfNetworkPackets.push(request(9, 1));
      listOfNetworkPackets.push(request(10, 2));
      listOfNetworkPackets.push(request(11, 3));
      listOfNetworkPackets.push(request(12, 1));
      listOfNetworkPackets.push(request(13, 4));
      listOfNetworkPackets.push(request(14, 3));
      listOfNetworkPackets.push(request(15, 1));
      listOfNetworkPackets.push(request(16, 2));
      listOfNetworkPackets.push(request(17, 3));
      run();
    }

  }
};


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
          padding: 1em;
        }
        #network-path {
          width: 100%;
          background: ghostwhite;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        #packet-generator {
          width: 10%;
          background: lightgrey;
          padding: 1em 0 1em 0;
        }
        #packet-consumer {
          width: 10%;
          background: lightgrey;
          padding: 1em 0 1em 0;
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
      </style>
      <script src="network-simulation.js"></script>
        
      <div id="container">
        <div id="button-container">
          <button id="start-simulation" type="button">Start Network Simulation</button>        
        </div>
        <div id="network">
          <div id="network-path">
            <div id="packet-generator">Packet generator</div>
            <div id="packet-path">
              <!--<me-packet></me-packet>-->
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
      packageProcessor().start();
    });
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
