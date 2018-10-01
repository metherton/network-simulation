class MePacket extends HTMLElement {

  constructor() {
    super();
    // private variables
    this._private1 = null;
    this._data = null;
    this._$packet = null;
    this._$info = null;
    //create a shadow root
    this._root = this.attachShadow({"mode": "open"});
  }

  connectedCallback() {
    this._root.innerHTML = `
      <style>
        .packet {
          position: absolute;
          left: -5%;
          height: 80px;
          width: 80px;
          background-color: mediumseagreen;
          /*border-radius: 50%;*/
          transition: left 5s;
          z-index: 10;
          font-size: 0.5em;
          padding-left: 0.5em;
        }
        .move {
          left: 105%;
        }
      </style>
      <div class="packet"><div class="info"></div></div>
      
    `;
    this._$text = this._root.querySelector('#text'); //store important elements for later use..prefixing DOM elements with $
  //  this._render();
    this._$packet = this._root.querySelector('.packet');
    this._$info = this._root.querySelector('.info');
    this._render();
  }

  _render() {
   // this._$text.innerText = '... is awesome !'; // selectively update only parts of the template which need to change
    if (this._$info) {
      this._$info.innerHTML = 'ID: ' + this._data.id + ' startTime: ' + this._data.startTime + ' procTime: ' + this._data.processTime + ' dueTime: ' + this._data.scheduledTime;
    }
  }

  // observe attribute changes
  static get observedAttributes() {
    return ['an-important-attribute', 'move'];
  }

  // react to attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    // do stuff
    if (name === 'move' && newValue) {
      const packet = this._root.querySelector('.packet');
      packet.classList.add('move');
    }
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

  // use setters and getters to create an API for the component
  set data(data) {
    if (this._data === data) return;
    this._data = data;
    this._render();
  }

  get data() {
    return this._data;
  }

  disconnectedCallback() {
   // do stuff
  }


}

window.customElements.define('me-packet', MePacket);
