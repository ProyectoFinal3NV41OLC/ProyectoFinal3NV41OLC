import {
    getFirestore
  } from "../lib/fabrica.js";
  import {
    subeStorage
  } from "../lib/storage.js";
  import {
    cod, muestraError
  } from "../lib/util.js";
  import {
    muestraProductos
  } from "./navegacion.js";
  
  
  const firestore = getFirestore();
  const daoDis = firestore.
    collection("Disponibilidad");
  const daoProducto = firestore.
    collection("Producto");
  
  /**
   * @param {HTMLElement} elemento
   * @param {string[]} valor */
  export function
    checksDis(elemento, valor) {
    const set =
      new Set(valor || []);
    daoDis.onSnapshot(
      snap => {
        let html = "";
        if (snap.size > 0) {
          snap.forEach(doc =>
            html +=
            checkDis(doc, set));
        } else {
          html += /* html */
            `<li class="vacio">
                -- No se ha seleccionado ninguna disponibilidad. --
              </li>`;
        }
        elemento.innerHTML = html;
      },
      e => {
        muestraError(e);
        checksDis(
          elemento, valor);
      }
    );
  }
  
  /**
   * @param {
      import("../lib/tiposFire.js").
      DocumentSnapshot} doc
   * @param {Set<string>} set */
  export function
    checkDis(doc, set) {
    /**
     * @type {
        import("./tipos.js").Disponibilidad} */
    const data = doc.data();
    const checked =
      set.has(doc.id) ?
        "checked" : "";
    return (/* html */
      `<li>
        <label class="fila">
          <input type="checkbox"
              name="rolIds2"
              value="${cod(doc.id)}"
            ${checked}>
          <span class="texto">
            <strong
                class="primario">
              ${cod(doc.id)}
            </strong>
            <span
                class="secundario">
            ${cod(data.descripción)}
            </span>
          </span>
        </label>
      </li>`);
  }
  
  /**
   * @param {Event} evt
   * @param {FormData} formData
   * @param {string} id  */
  export async function
    guardaProducto(evt, formData,
      id) {
    try {
      evt.preventDefault();
      const rolIds2 =
        formData.getAll("rolIds2");
      await daoProducto.
        doc(id).
        set({
          rolIds2
        });
      const avatar =
        formData.get("avatar");
      await subeStorage(id, avatar);
      muestraProductos();
    } catch (e) {
      muestraError(e);
    }
  }