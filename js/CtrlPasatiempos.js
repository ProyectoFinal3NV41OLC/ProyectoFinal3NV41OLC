import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  urlStorage
} from "../lib/storage.js";
import {
  cod,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";

/** @type {HTMLUListElement} */
const lista = document.
  querySelector("#lista");
const firestore = getFirestore();
const daoDis = firestore.
  collection("Disponibilidad");
const daoProducto = firestore.
  collection("Producto");

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador","Cliente"])) {
    consulta();
  }
}

function consulta() {
  daoProducto.onSnapshot(
    htmlLista, errConsulta);
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    QuerySnapshot} snap */
async function htmlLista(snap) {
  let html = "";
  if (snap.size > 0) {
    /** @type {
          Promise<string>[]} */
    let productos = [];
    snap.forEach(doc => productos.
      push(htmlFila(doc)));
    const htmlFilas =
      await Promise.all(productos);
    /* Junta el todos los
     * elementos del arreglo en
     * una cadena. */
    html += htmlFilas.join("");
  } else {
    html += /* html */
      `<li class="vacio">
        -- No hay productos
        registrados. --
      </li>`;
  }
  lista.innerHTML = html;
}

/**
 * @param {import(
    "../lib/tiposFire.js").
    DocumentSnapshot} doc */
async function htmlFila(doc) {
  /**
   * @type {import("./tipos.js").
                      Producto} */
  const data = doc.data();
  const img = cod(
    await urlStorage(doc.id));
  const dis =
    await buscaDis(data.rolIds2);
  const parámetros =
    new URLSearchParams();
  parámetros.append("id", doc.id);
  return (/* html */
    `<li>
      <a class="fila conImagen"
          href=
    "usuario.html?${parámetros}">
        <span class="marco">
          <img src="${img}"
            alt="Falta el Avatar">
        </span>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
            ${dis}
          </span>
        </span>
      </a>
    </li>`);
}

/** Recupera el html de los
 * roles en base a sus id
 * @param {string[]} ids */
async function buscaDis(ids) {
  let html = "";
  if (ids && ids.length > 0) {
    for (const id of ids) {
      const doc = await daoDis.
        doc(id).
        get();
      /**
       * @type {
      import("./tipos.js").Disponibilidad} */
      const data = doc.data();
      html += /* html */
        `<em>${cod(doc.id)}</em>
        <br>
        ${cod(data.descripción)}
        <br>`;
    }
    return html;
  } else {
    return "-- Sin Disponibilidad --";
  }
}

/** @param {Error} e */
function errConsulta(e) {
  muestraError(e);
  consulta();
}
