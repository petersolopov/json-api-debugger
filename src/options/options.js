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
    storageSync.get(["regexps", "turnedOn"]).then(({ regexps, turnedOn }) => {
      this.setState({ regexps, turnedOn });
    });
  }

  addRegexp = () => {
    const { regexps = [] } = this.state;
    this.setState({ regexps: regexps.concat("") }, this.save);
  };

  save = () => {
    const { turnedOn } = this.state;
    const regexps = this.state.regexps.filter(Boolean);

    chrome.storage.sync.set({
      regexps,
      turnedOn
    });
  };

  handleRegexpChange = event => {
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

  handleTurnedOnChange = event => {
    const { checked } = event.target;
    this.setState({ turnedOn: checked }, this.save);
  };

  render(props, { regexps = [], turnedOn }) {
    // prettier-ignore
    return html`
      <div class="app">
        <h1>Options</h1>
        <form id="form">
          <input type="checkbox" id="listen" checked=${turnedOn} onChange=${this.handleTurnedOnChange}/>
          <label for="listen">Listen Network</label>
          <${Header} />
          ${regexps.map(
            (regexp, index) => html`
              <div>
                <input
                  type="text"
                  placeholder="/(\d+)/jsonapi/"
                  value=${regexp}
                  name=${"regexp." + index}
                  onInput=${this.handleRegexpChange}
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
      <h3>Filter Network</h3>
      <p>It will debug requests filtered by regexp:</p>
    </div>
  `;

render(
  html`
    <${App} />
  `,
  document.querySelector("#app")
);
