import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraPasatiempos
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksDis,
  guardaProducto,
} from "./productos.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoProducto = getFirestore().
  collection("Producto");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.
  querySelector("img");
/** @type {HTMLUListElement} */
const listaDis = document.
  querySelector("#listaDis");
getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(usuario) {
  if (tieneRol(usuario,
    ["Administrador"])) {
    busca();
  }
}

async function busca() {
  try {
    const doc = await daoProducto.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      forma.producto.value = id || "";
      img.src =
        await urlStorage(id);
      checksDis(
        listaDis, data.rolIds2);
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraPasatiempos();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaProducto(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoProducto.
        doc(id).delete();
      await eliminaStorage(id);
      muestraPasatiempos();
    }
  } catch (e) {
    muestraError(e);
  }
}
