"""Valida contenido/<SIGLA>/U<n> - <Título>.md y genera web/tarjetas.json.

Uso: python3 scripts/construir.py
Sale con 1 y una línea "fichero:línea: mensaje" por error si el formato falla.
"""
import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path

SIGLAS = {
    "RFA", "TMH", "LC", "GPC",
    "PEE", "RNA", "TA", "TLH", "SMA", "PIN",
    "VPC", "SR", "HAIA", "ARA", "ALC", "RES",
}
ENCABEZADO = re.compile(r"^(#{1,4}) (.+?)\s*$")
TITULO = re.compile(r"^(\S+) (U\d+) - (.+)$")
EJERCICIOS = {"Problema:": "problema", "Demostración:": "demostracion"}
PRIMERA_LINEA = 'la primera línea debe ser "# SIGLA Un - Título"'


def nfc(texto):
    return unicodedata.normalize("NFC", texto)


class ErrorFormato(Exception):
    def __init__(self, ruta, linea, mensaje):
        super().__init__(f"{ruta}:{linea}: {mensaje}")
        self.ruta = ruta
        self.linea = linea
        self.mensaje = mensaje


def leer_unidad(fichero, raiz):
    ruta = nfc(fichero.relative_to(raiz).as_posix())
    esperado = f"{nfc(fichero.parent.name)} {nfc(fichero.stem)}"
    lineas = fichero.read_text(encoding="utf-8").replace("\r", "").split("\n")

    tarjetas = []
    vistas = {}  # pregunta -> línea donde aparece
    titulo = None  # (sigla, unidad, título de la unidad)
    apartado = None
    actual = None  # tarjeta o ejercicio que se está leyendo
    cercado = None  # "```" o "~~~" mientras se está dentro de un bloque de código

    def fallo(linea, mensaje):
        raise ErrorFormato(ruta, linea, mensaje)

    def anadir(linea):
        if actual is not None:
            destino = actual["pasos"][-1][1] if actual["pasos"] else actual["cuerpo"]
            destino.append(linea)

    def cerrar():
        if actual is None:
            return
        cuerpo = "\n".join(actual["cuerpo"]).strip()
        if actual["tipo"] == "tarjeta" and not cuerpo:
            fallo(actual["linea"], "la tarjeta no tiene respuesta")
        if actual["tipo"] != "tarjeta" and not actual["pasos"]:
            fallo(actual["linea"], 'el ejercicio no tiene ningún paso "####"')
        pasos = []
        for linea, texto in actual["pasos"]:
            paso = "\n".join(texto).strip()
            if not paso:
                fallo(linea, "el paso no tiene contenido")
            pasos.append(paso)
        sigla, unidad, titulo_unidad = titulo
        pregunta = actual["pregunta"]
        vistas[pregunta] = actual["linea"]
        tarjetas.append({
            "id": hashlib.sha1(f"{sigla}|{unidad}|{pregunta}".encode()).hexdigest()[:12],
            "sigla": sigla,
            "unidad": unidad,
            "titulo_unidad": titulo_unidad,
            "apartado": apartado,
            "tipo": actual["tipo"],
            "pregunta": pregunta,
            "cuerpo": cuerpo,
            "pasos": pasos,
            "fichero": ruta,
        })

    for n, linea in enumerate(lineas, start=1):
        linea = nfc(linea)
        if cercado:
            anadir(linea)
            if linea.lstrip().startswith(cercado):
                cercado = None
            continue
        if linea.lstrip().startswith(("```", "~~~")):
            cercado, apertura = linea.lstrip()[:3], n
            anadir(linea)
            continue

        m = ENCABEZADO.match(linea)
        if titulo is None:
            if not linea.strip():
                continue
            if not m or len(m[1]) != 1 or not TITULO.match(m[2]):
                fallo(n, PRIMERA_LINEA)
            sigla, unidad, titulo_unidad = TITULO.match(m[2]).groups()
            if sigla not in SIGLAS:
                fallo(n, f"sigla desconocida: {sigla}")
            if f"{sigla} {unidad} - {titulo_unidad}" != esperado:
                fallo(n, f'el título no coincide con el fichero: se esperaba "# {esperado}"')
            titulo = (sigla, unidad, titulo_unidad)
            continue

        if not m:
            anadir(linea)
            continue

        nivel, texto = len(m[1]), m[2]
        if nivel == 1:
            fallo(n, 'solo puede haber un "#" por fichero')
        elif nivel == 2:
            cerrar()
            actual = None
            apartado = texto
        elif nivel == 3:
            cerrar()
            actual = None
            if apartado is None:
                fallo(n, 'la tarjeta no está dentro de ningún apartado "##"')
            tipo, pregunta = "tarjeta", texto
            for prefijo, tipo_ejercicio in EJERCICIOS.items():
                if texto.startswith(prefijo):
                    tipo, pregunta = tipo_ejercicio, texto[len(prefijo):].strip()
            if pregunta in vistas:
                fallo(n, f"pregunta repetida (ya aparece en la línea {vistas[pregunta]})")
            actual = {"linea": n, "tipo": tipo, "pregunta": pregunta, "cuerpo": [], "pasos": []}
        else:
            if actual is None:
                fallo(n, 'paso "####" fuera de un Problema o una Demostración')
            if actual["tipo"] == "tarjeta":
                fallo(n, 'los pasos "####" solo van en un Problema o una Demostración')
            actual["pasos"].append((n, []))

    if titulo is None:
        fallo(1, PRIMERA_LINEA)
    if cercado:
        fallo(apertura, "bloque de código sin cerrar")
    cerrar()
    return tarjetas


def construir(raiz):
    tarjetas, errores = [], []
    for fichero in sorted((raiz / "contenido").glob("*/*.md")):
        try:
            tarjetas.extend(leer_unidad(fichero, raiz))
        except ErrorFormato as e:
            errores.append(e)
    return tarjetas, errores


def main():
    raiz = Path(__file__).resolve().parent.parent
    tarjetas, errores = construir(raiz)
    for e in errores:
        print(e, file=sys.stderr)
    if errores:
        return 1
    salida = raiz / "web" / "tarjetas.json"
    salida.parent.mkdir(exist_ok=True)
    salida.write_text(json.dumps(tarjetas, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(tarjetas)} tarjetas en {salida.relative_to(raiz)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
