# Repaso MUIARFID

Flashcards, problemas y demostraciones del Máster en IA, Reconocimiento de Formas e Imagen Digital (UPV), para repasar desde el móvil.

**Web:** https://laijieji.github.io/muiarfid-repaso/

Cada tarjeta indica de qué asignatura, unidad y apartado sale, por ejemplo "TA, U2 Modelos estadísticos, 4. Evaluación". La web recuerda en tu navegador qué tarjetas sabes y te las vuelve a preguntar cada vez más espaciadas. No hay cuentas ni se envía nada a ningún servidor.

## Contribuir

Si una tarjeta está mal o falta algo, pulsa "Proponer un cambio" en la propia tarjeta o lee [CONTRIBUTING.md](CONTRIBUTING.md).

## Probarla en local

```bash
python3 scripts/construir.py
python3 -m http.server -d web 8000
```

Después abre http://localhost:8000. Los tests se lanzan con `python3 -m unittest discover -s scripts` y `node --test "web/*.test.js"`.

## Licencias

El contenido de `contenido/` se publica bajo CC BY-SA 4.0 y el código bajo MIT.
