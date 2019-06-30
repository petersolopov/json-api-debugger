import {
  h,
  Component,
  render
} from "../../node_modules/preact/dist/preact.mjs";
import htm from "../../node_modules/htm/dist/htm.mjs";
import storageSync from "../utils/storageSync.mjs";

const html = htm.bind(h);

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {};
    storageSync.get("regexps").then(({ regexps }) => {
      this.setState({ regexps });
    });
  }

  addRegexp = () => {
    const { regexps = [] } = this.state;
    this.setState({ regexps: regexps.concat("") }, this.save);
  };

  save = () => {
    const regexps = this.state.regexps.filter(Boolean);
    chrome.storage.sync.set({ regexps });
  };

  handleInputChange = event => {
    const { name, value } = event.target;

    const index = Number(name.split(".")[1]);

    this.setState(
      ({ regexps }) => ({
        regexps: regexps.map((regexp, regexpIndex) => {
          if (index !== regexpIndex) {
            return regexp;
          }

          return value;
        })
      }),
      this.save
    );
  };

  render(props, { regexps = [] }) {
    // prettier-ignore
    return html`
      <div class="app">
        <${Header} />
        <form id="form">
          ${regexps.map(
            (regexp, index) => html`
              <div>
                <input
                  type="text"
                  placeholder="/(\d+)/jsonapi/"
                  value=${regexp}
                  name=${"regexp." + index}
                  onInput=${this.handleInputChange}
                />
              </div>
            `
          )}
        </form>
        <br />
        <button onClick=${this.addRegexp}>Add regexp</button>
      </div>
    `;
  }
}

const Header = () =>
  html`
    <div>
      <h1>Filter Network</h1>
      <p>It will debug requests filtered by regexp:</p>
    </div>
  `;

render(
  html`
    <${App} />
  `,
  document.querySelector("#app")
);
