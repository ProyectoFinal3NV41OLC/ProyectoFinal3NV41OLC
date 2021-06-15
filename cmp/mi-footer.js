class MiFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = /* html */
            `Copyright &copy; 2021 Oliver López Cerón.`;
    }
}
customElements.define("mi-footer", MiFooter);
