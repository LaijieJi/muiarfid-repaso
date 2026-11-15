# Cómo contribuir

No hace falta instalar nada. Todo se hace desde la web de GitHub.

1. Abre el fichero de la unidad en `contenido/<SIGLA>/`, o pulsa "Proponer un cambio" en una tarjeta de la web.
2. Pulsa el lápiz, edita y elige "Propose changes". GitHub crea una copia en tu cuenta y abre un pull request.
3. Una comprobación automática revisa el formato. Si falla, el mensaje dice el fichero y la línea del error.
4. El mantenedor revisa el contenido y lo acepta o te comenta qué cambiar.

## Formato

Hay un fichero por unidad, en `contenido/<SIGLA>/U<n> - <Título>.md`:

```markdown
# TA U2 - Modelos estadísticos

## 2.3 Evaluación

### ¿Por qué BLEU recorta los conteos de n-gramas?
Para que una hipótesis que repite una palabra correcta no infle la precisión…

### Problema: calcula la precisión modificada de unigramas de esta hipótesis…
#### Paso 1
Cuenta cada unigrama de la hipótesis…
#### Paso 2
Recorta cada conteo al máximo que aparece en una referencia…
```

| Nivel | Significado |
|---|---|
| `#` | Sigla, unidad y título. Debe coincidir con el nombre del fichero. |
| `##` | Apartado, con el número y el nombre que usa el profesor. Es lo que se muestra como referencia. |
| `###` | Una tarjeta. El texto del encabezado es la pregunta y el cuerpo es la respuesta. |
| `### Problema:` o `### Demostración:` | Un ejercicio. Cada `####` es un paso que se revela en orden. |

El cuerpo admite Markdown con tablas y fórmulas entre `$…$` (en línea) o `$$…$$` (en bloque).

## Reglas

1. Se redacta con palabras propias, sin copiar transparencias ni figuras.
2. No se publican enunciados de examen del profesor, solo problemas propios o reformulados.
3. Cada tarjeta va dentro de un apartado real del temario.

Al contribuir aceptas que tu aportación se publique bajo CC BY-SA 4.0.
