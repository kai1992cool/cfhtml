import { LitElement, css } from "lit";
import { nghtml } from "./nghtml";

interface Item {
  name: string;
}

export class HelloWorld extends LitElement {
  static styles = css`
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .fade-in {
      animation: fade-in 300ms ease-out both;
    }

    .fade-out {
      animation: fade-out 300ms ease-in both;
    }
  `;

  static properties = {
    name: { type: String },
    showGreeting: { type: Boolean },
    items: { type: Array },
    count: { type: Number },
    active: { type: Boolean },
    panelStyles: { type: Object },
    panelWidth: { type: Number },
  };

  declare name: string;
  declare showGreeting: boolean;
  declare items: Item[];
  declare count: number;
  declare active: boolean;
  declare panelStyles: Record<string, string>;
  declare panelWidth: number;

  constructor() {
    super();
    this.name = "world";
    this.showGreeting = true;
    this.items = [{ name: "Lit" }, { name: "web components" }];
    this.count = 0;
    this.active = true;
    this.panelStyles = {
      borderRadius: "4px",
      backgroundColor: "lightyellow",
    };
    this.panelWidth = 12;
  }

  render() {
    return nghtml`
      @let greeting = ${this.name};
      @if (${this.showGreeting}; as visibleGreeting) {
        <p [class.featured]=${this.active} [style.width.px]=${this.panelWidth}
           [style]=${this.panelStyles}>Hello, {{ greeting }}!</p>
        <p animate.enter="fade-in" animate.leave="fade-out">Animated paragraph</p>
      } @else if (${this.name === "Angular"}) {
        <p>Hello from Angular syntax.</p>
      } @else {
        <p>The greeting is hidden.</p>
      }
      <ul>
        @for (item of ${this.items}; track item.name; let first = $first, idx = $index) {
          <li>{{ item.name }}</li>
        } @empty {
          <li>There are no items.</li>
        }
      </ul>
      @switch (${this.count}) {
        @case (0) { 
          <p [attr.data-state]="idle">Ready</p> 
        }
        @default { <p [attr.data-state]="active">Updated</p> }
      }
      @defer (on immediate) {
        <p [attr.data-deferred]=${true}>Deferred content</p>
      } @placeholder {
        <p>Preparing deferred content</p>
      }
      <button @click=${() => this.count++}>Clicked ${this.count} times</button>
    `;
  }
}

if (!customElements.get("hello-world")) {
  customElements.define("hello-world", HelloWorld);
}
