# TA U1 - Introducción

## 1. Motivación

### ¿Qué es la post-edición (PE)?
Corregir a mano la salida de un sistema de traducción automática. La máquina produce un borrador y una persona lo revisa. La diapositiva señala que su uso crece cada año.

## 2. Breve historia

### ¿En qué tres eras se divide la historia de la traducción automática?
1. Enfoques basados en conocimiento o reglas.
2. Modelos estadísticos, primero basados en palabras y después en frases.
3. Traducción automática neuronal (NMT).

## 3. Marco estadístico

### En el marco estadístico, ¿qué textos del idioma destino son traducciones posibles de una frase $x$?
Todos. No hay traducciones correctas e incorrectas, sino más y menos probables según $P(y \mid x)$.

### En traducción automática estadística, con $x$ la frase origen e $y$ una frase destino, ¿cuál es la regla de decisión?
Elegir la traducción más probable:

$$\hat{y} = \arg\max_y P(y \mid x)$$

### ¿Qué diferencia hay entre traducción automática (TA) y traducción de voz (ST)?
La entrada $x$. En TA es texto y en ST es una señal de voz.

### ¿Qué modela el enfoque directo y qué ejemplos tiene?
Modela $P(y \mid x)$ directamente. Ejemplos: los modelos log-lineales y los modelos neuronales.

### ¿Qué modela el enfoque generativo y qué ejemplos tiene?
Modela $P(x \mid y)$ y $P(y)$ por separado y elige $\hat{y} = \arg\max_y P(x \mid y)\,P(y)$. Ejemplos: los modelos basados en palabras y algunos basados en frases.

### ¿Qué modela el enfoque conjunto y qué ejemplo tiene?
Modela $P(x, y)$ y elige $\hat{y} = \arg\max_y P(x, y)$. Ejemplo: los transductores de estados finitos.

### Un sistema NMT estándar, ¿sigue el enfoque directo, generativo o conjunto?
Directo, porque modela $P(y \mid x)$.

### En el enfoque generativo, ¿qué mide $P(x \mid y)$ y de qué se aprende?
La fidelidad: si $y$ dice lo mismo que $x$. Es el modelo de traducción y se aprende de texto paralelo.

### En el enfoque generativo, ¿qué mide $P(y)$ y de qué se aprende?
La fluidez: si $y$ es una frase natural del idioma destino. Es el modelo de lenguaje y se aprende de texto monolingüe.

### ¿Qué ventaja práctica tiene el enfoque generativo?
Que $P(y)$ se estima con texto monolingüe, mucho más abundante y barato que el texto paralelo.

### Si los tres enfoques son la misma regla, ¿por qué dan sistemas distintos?
Porque cada uno estima cosas distintas con modelos aproximados, y cada aproximación comete errores distintos. Con modelos exactos darían la misma traducción.

### Demostración: el enfoque generativo da la misma regla de decisión que el directo
Parte de la regla directa $\hat{y} = \arg\max_y P(y \mid x)$ y demuestra que equivale a la regla generativa.
#### Paso 1
Se aplica el teorema de Bayes dentro del argmax, de modo que $\hat{y} = \arg\max_y \frac{P(x \mid y)\,P(y)}{P(x)}$. Es decir:

$$P(y \mid x) = \frac{P(x \mid y)\,P(y)}{P(x)}$$

#### Paso 2
$x$ es fija, porque es la frase que se quiere traducir. Por tanto, el denominador $P(x)$ no depende de $y$ y no cambia qué $y$ maximiza:

$$\hat{y} = \arg\max_y P(x \mid y)\,P(y)$$

### Problema: elige la traducción de «el perro negro» con el enfoque generativo
Candidatas: $y_1$ = «the black dog» y $y_2$ = «the dog black». El modelo de traducción no tiene en cuenta el orden de las palabras y da $P(x \mid y_1) = P(x \mid y_2) = 0{,}05$. El modelo de lenguaje da $P(y_1) = 2 \cdot 10^{-5}$ y $P(y_2) = 4 \cdot 10^{-9}$.
#### Paso 1
Se calcula el producto $P(x \mid y)\,P(y)$ de cada candidata:

$$y_1: 0{,}05 \cdot 2 \cdot 10^{-5} = 10^{-6}$$

$$y_2: 0{,}05 \cdot 4 \cdot 10^{-9} = 2 \cdot 10^{-10}$$

#### Paso 2
Gana $y_1$, por un factor de 5000. El modelo de traducción empata y es el modelo de lenguaje, que mide la fluidez, el que decide.
