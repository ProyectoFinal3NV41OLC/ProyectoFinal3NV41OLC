class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        Oliver López Cerón
      </p>`;
  }
}

customElements.define(
  "mi-footer", MiFooter);
