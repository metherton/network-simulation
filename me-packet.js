class MePacket extends HTMLElement {

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
        .circle {
          position: relative;
          left: -5%;
          height: 20px;
          width: 20px;
          background-color: mediumseagreen;
          border-radius: 50%;
          transition: left 2s;
          z-index: 10;
        }
        .move {
          left: 105%;
        }
      </style>
      <div id='packet' class="circle"></div>
      
    `;
    this._$text = this._root.querySelector('#text'); //store important elements for later use..prefixing DOM elements with $
  //  this._render();
  }

  _render() {
    this._$text.innerText = '... is awesome !'; // selectively update only parts of the template which need to change
  }

  // observe attribute changes
  static get observedAttributes() {
    return ['an-important-attribute', 'move'];
  }

  // react to attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    // do stuff
    if (name === 'move' && newValue) {
      const packet = this._root.getElementById('packet');
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

  disconnectedCallback() {
   // do stuff
  }


}

window.customElements.define('me-packet', MePacket);
