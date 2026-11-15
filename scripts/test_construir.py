import hashlib
import tempfile
import unicodedata
import unittest
from pathlib import Path

from construir import ErrorFormato, construir, leer_unidad

RUTA = "contenido/TA/U2 - Modelos estadísticos.md"
BASE = "# TA U2 - Modelos estadísticos\n\n## 2.3 Evaluación\n\n"


def escribir(raiz, ruta_relativa, texto):
    fichero = Path(raiz) / ruta_relativa
    fichero.parent.mkdir(parents=True, exist_ok=True)
    fichero.write_bytes(texto.encode("utf-8"))
    return fichero


class TestLeerUnidad(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.r = Path(self._tmp.name)

    def tearDown(self):
        self._tmp.cleanup()

    def leer(self, texto, ruta=RUTA):
        return leer_unidad(escribir(self.r, ruta, texto), self.r)

    def error(self, texto, ruta=RUTA):
        with self.assertRaises(ErrorFormato) as cm:
            self.leer(texto, ruta)
        return cm.exception.linea, cm.exception.mensaje

    def test_tarjeta_basica(self):
        [t] = self.leer(BASE + "### ¿Qué mide BLEU?\nPrecisión de n-gramas.\n")
        self.assertEqual(t["tipo"], "tarjeta")
        self.assertEqual(t["sigla"], "TA")
        self.assertEqual(t["unidad"], "U2")
        self.assertEqual(t["titulo_unidad"], "Modelos estadísticos")
        self.assertEqual(t["apartado"], "2.3 Evaluación")
        self.assertEqual(t["pregunta"], "¿Qué mide BLEU?")
        self.assertEqual(t["cuerpo"], "Precisión de n-gramas.")
        self.assertEqual(t["pasos"], [])
        self.assertEqual(t["fichero"], RUTA)
        self.assertEqual(t["id"], hashlib.sha1("TA|U2|¿Qué mide BLEU?".encode()).hexdigest()[:12])

    def test_problema_con_pasos(self):
        [t] = self.leer(BASE + "### Problema: calcula p1\nHipótesis: the the\n#### Paso 1\nCuenta.\n#### Paso 2\nRecorta.\n")
        self.assertEqual(t["tipo"], "problema")
        self.assertEqual(t["pregunta"], "calcula p1")
        self.assertEqual(t["cuerpo"], "Hipótesis: the the")
        self.assertEqual(t["pasos"], ["Cuenta.", "Recorta."])

    def test_demostracion(self):
        [t] = self.leer(BASE + "### Demostración: la suma converge\n#### Paso 1\nAcota.\n")
        self.assertEqual(t["tipo"], "demostracion")
        self.assertEqual(t["pregunta"], "la suma converge")
        self.assertEqual(t["cuerpo"], "")

    def test_almohadilla_en_codigo_no_es_encabezado(self):
        tarjetas = self.leer(BASE + "### ¿Comentario en Python?\n```python\n# esto es un comentario\n### tampoco\n```\n")
        self.assertEqual(len(tarjetas), 1)
        self.assertIn("# esto es un comentario", tarjetas[0]["cuerpo"])

    def test_almohadilla_en_codigo_con_virgulillas(self):
        tarjetas = self.leer(BASE + "### ¿Otro cercado?\n~~~\n## no es apartado\n~~~\n")
        self.assertEqual(len(tarjetas), 1)
        self.assertEqual(tarjetas[0]["apartado"], "2.3 Evaluación")

    def test_nombre_en_nfd(self):
        [t] = self.leer(BASE + "### ¿Hola?\nSí.\n", ruta=unicodedata.normalize("NFD", RUTA))
        self.assertEqual(t["fichero"], RUTA)

    def test_crlf(self):
        texto = BASE + "### ¿Qué mide BLEU?\nPrecisión de n-gramas.\n"
        self.assertEqual(self.leer(texto.replace("\n", "\r\n")), self.leer(texto))

    def test_cinco_almohadillas_son_cuerpo(self):
        [t] = self.leer(BASE + "### ¿Nota?\nSí.\n##### Nota\nMás.\n")
        self.assertEqual(t["cuerpo"], "Sí.\n##### Nota\nMás.")

    def test_texto_entre_apartado_y_tarjeta_se_ignora(self):
        [t] = self.leer(BASE.rstrip("\n") + "\nIntroducción suelta.\n\n### ¿Hola?\nSí.\n")
        self.assertEqual(t["cuerpo"], "Sí.")

    def test_primera_linea_mal(self):
        self.assertEqual(self.error("## 1. Algo\n"), (1, 'la primera línea debe ser "# SIGLA Un - Título"'))

    def test_sigla_desconocida(self):
        ruta = "contenido/XX/U2 - Modelos estadísticos.md"
        self.assertEqual(self.error("# XX U2 - Modelos estadísticos\n", ruta), (1, "sigla desconocida: XX"))

    def test_titulo_no_coincide(self):
        self.assertEqual(self.error("# TA U3 - Otra cosa\n"),
                         (1, 'el título no coincide con el fichero: se esperaba "# TA U2 - Modelos estadísticos"'))

    def test_dos_titulos(self):
        self.assertEqual(self.error(BASE + "# TA U2 - Modelos estadísticos\n"), (5, 'solo puede haber un "#" por fichero'))

    def test_tarjeta_fuera_de_apartado(self):
        self.assertEqual(self.error("# TA U2 - Modelos estadísticos\n\n### ¿Suelta?\nSí.\n"),
                         (3, 'la tarjeta no está dentro de ningún apartado "##"'))

    def test_tarjeta_sin_respuesta(self):
        self.assertEqual(self.error(BASE + "### ¿Vacía?\n\n### ¿Otra?\nSí.\n"), (5, "la tarjeta no tiene respuesta"))

    def test_tarjeta_sin_respuesta_al_final(self):
        self.assertEqual(self.error(BASE + "### ¿Vacía?\n\n"), (5, "la tarjeta no tiene respuesta"))

    def test_paso_en_tarjeta_normal(self):
        self.assertEqual(self.error(BASE + "### ¿Normal?\nSí.\n#### Paso 1\nNo.\n"),
                         (7, 'los pasos "####" solo van en un Problema o una Demostración'))

    def test_paso_fuera_de_tarjeta(self):
        self.assertEqual(self.error(BASE + "#### Paso 1\nNo.\n"),
                         (5, 'paso "####" fuera de un Problema o una Demostración'))

    def test_ejercicio_sin_pasos(self):
        self.assertEqual(self.error(BASE + "### Problema: sin pasos\nEnunciado.\n"),
                         (5, 'el ejercicio no tiene ningún paso "####"'))

    def test_paso_vacio(self):
        self.assertEqual(self.error(BASE + "### Problema: p\n#### Paso 1\n\n#### Paso 2\nBien.\n"),
                         (6, "el paso no tiene contenido"))

    def test_pregunta_repetida(self):
        self.assertEqual(self.error(BASE + "### ¿Hola?\nSí.\n### ¿Hola?\nOtra vez.\n"),
                         (7, "pregunta repetida (ya aparece en la línea 5)"))

    def test_bloque_de_codigo_sin_cerrar(self):
        self.assertEqual(self.error(BASE + "### ¿Q1?\n```\ncódigo\n### ¿Q2?\nA2\n"), (6, "bloque de código sin cerrar"))

    def test_str_del_error(self):
        e = ErrorFormato("contenido/TA/x.md", 3, "algo")
        self.assertEqual(str(e), "contenido/TA/x.md:3: algo")


class TestConstruir(unittest.TestCase):
    def test_construir_acumula_errores_de_varios_ficheros(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = Path(tmp)
            escribir(r, RUTA, BASE + "### ¿Vacía?\n")
            escribir(r, "contenido/SMA/U1 - Conceptos.md", "# SMA U1 - Conceptos\n\n### ¿Suelta?\nSí.\n")
            tarjetas, errores = construir(r)
            self.assertEqual(tarjetas, [])
            self.assertEqual(len(errores), 2)

    def test_construir_sin_contenido(self):
        with tempfile.TemporaryDirectory() as tmp:
            self.assertEqual(construir(Path(tmp)), ([], []))

    def test_construir_junta_ficheros_validos(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = Path(tmp)
            escribir(r, RUTA, BASE + "### ¿Uno?\nSí.\n")
            escribir(r, "contenido/SMA/U1 - Conceptos.md", "# SMA U1 - Conceptos\n\n## 1. Agentes\n\n### ¿Dos?\nSí.\n")
            tarjetas, errores = construir(r)
            self.assertEqual(errores, [])
            self.assertEqual([t["sigla"] for t in tarjetas], ["SMA", "TA"])


if __name__ == "__main__":
    unittest.main()
