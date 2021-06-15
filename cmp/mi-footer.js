class MiFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /* html */
            `Copyright &copy; 2021 Ricardo Armando Machorro Reyes.`;
    }
}
customElements.define("mi-footer", MiFooter);
