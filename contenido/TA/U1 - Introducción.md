# TA U1 - Introducción

## 1. Motivación

### ¿Qué es la post-edición (PE)?
Corregir a mano la salida de un sistema de traducción automática. Es un uso de la TA que crece porque abarata la traducción profesional: la máquina produce un borrador y una persona lo revisa.

### ¿Qué tipo de contenido impulsa la demanda de traducción de voz y simultánea?
El contenido audiovisual en streaming, como la televisión, las conferencias y las reuniones en línea.

### Cita tres fuentes de demanda de traducción automática, además de la post-edición.
El marketing multimodal, el contenido multilingüe de las plataformas de e-learning y el contenido audiovisual en streaming.

## 2. Breve historia

### ¿En qué tres eras se divide la historia de la traducción automática?
1. Enfoques basados en conocimiento o reglas.
2. Modelos estadísticos, primero basados en palabras y después en frases.
3. Traducción automática neuronal (NMT).

### ¿Qué conclusión sacó el informe ALPAC sobre la traducción automática?
Que no tenía mercado y que sus resultados no servían. Se publicó en 1966 y frenó la financiación de la investigación durante años.

### ¿Qué objeción planteó Chomsky en 1957 que afecta a la traducción estadística?
Que el lenguaje natural no se rige por la estadística.

### ¿Quién planteó en 1947 la posibilidad de traducir con un ordenador?
Warren Weaver.

### ¿A qué era pertenece SYSTRAN?
A la de los enfoques basados en conocimiento (reglas), entre 1960 y 2000 aproximadamente.

### ¿A qué era pertenecen los modelos IBM y GIZA++?
A la estadística basada en palabras. Los modelos IBM son de 1989 a 1995 y GIZA++ es la herramienta que los entrena, de la etapa de 1995 a 2005.

### ¿A qué era pertenece Moses?
A la estadística basada en frases, entre 2005 y 2015 aproximadamente.

### ¿Qué idea dio lugar a la traducción automática neuronal?
Representar las palabras y las frases en un espacio continuo, entre 2010 y 2015. Desde mediados de la década la NMT se usa en la industria, primero con redes recurrentes y desde 2017 con el Transformer.

### ¿Qué tipo de modelos se usan para traducir desde 2019?
Grandes modelos preentrenados, tanto de codificador y decodificador como solo de decodificador.

### ¿Hay una fecha de corte limpia entre la traducción estadística y la neuronal?
No. Las eras se solapan: los modelos basados en frases se usaron hasta 2015 y la NMT empieza hacia 2010.

## 3. Marco estadístico

### En el marco estadístico, ¿qué textos del idioma destino son traducciones posibles de una frase $x$?
Todos. No hay traducciones correctas e incorrectas, sino más y menos probables según $P(y \mid x)$.

### ¿Cuál es la regla de decisión de la traducción estadística?
Elegir la traducción más probable:

$$\hat{y} = \arg\max_y P(y \mid x)$$

### ¿De qué se aprende $P(y \mid x)$?
De texto paralelo, es decir, de pares de frases que son traducción mutua.

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

### Para traducir de $x$ a $y$ con el enfoque generativo, ¿en qué dirección va el modelo de traducción?
Al revés, de destino a origen: es $P(x \mid y)$ y no $P(y \mid x)$.

### ¿Qué ventaja práctica tiene el enfoque generativo?
Que $P(y)$ se estima con texto monolingüe, mucho más abundante y barato que el texto paralelo.

### Si los tres enfoques son la misma regla, ¿por qué dan sistemas distintos?
Porque cada uno estima cosas distintas con modelos aproximados, y cada aproximación comete errores distintos. Con modelos exactos darían la misma traducción.

### ¿Por qué la búsqueda del argmax es difícil?
Porque hay infinitas frases $y$ posibles y no se pueden enumerar. Hace falta una búsqueda aproximada.

### Demostración: el enfoque generativo da la misma regla de decisión que el directo
#### Paso 1
Se aplica el teorema de Bayes dentro del argmax:

$$P(y \mid x) = \frac{P(x \mid y)\,P(y)}{P(x)}$$

#### Paso 2
$x$ es fija, porque es la frase que se quiere traducir. Por tanto, el denominador $P(x)$ no depende de $y$ y no cambia qué $y$ maximiza:

$$\hat{y} = \arg\max_y P(x \mid y)\,P(y)$$

### Demostración: el enfoque conjunto da la misma regla de decisión que el directo
#### Paso 1
Se factoriza la probabilidad conjunta:

$$P(x, y) = P(y \mid x)\,P(x)$$

#### Paso 2
Igual que en el generativo, $P(x)$ no depende de $y$ y sale del argmax:

$$\begin{aligned}&\arg\max_y P(y \mid x)\,P(x) \\ &= \arg\max_y P(y \mid x)\end{aligned}$$

### Problema: elige la traducción de «el perro negro» con el enfoque generativo
Candidatas: $y_1$ = «the black dog» y $y_2$ = «the dog black». El modelo de traducción no tiene en cuenta el orden de las palabras y da $P(x \mid y_1) = P(x \mid y_2) = 0{,}05$. El modelo de lenguaje da $P(y_1) = 2 \cdot 10^{-5}$ y $P(y_2) = 4 \cdot 10^{-9}$.
#### Paso 1
Se calcula el producto $P(x \mid y)\,P(y)$ de cada candidata:

$$y_1: 0{,}05 \cdot 2 \cdot 10^{-5} = 10^{-6}$$

$$y_2: 0{,}05 \cdot 4 \cdot 10^{-9} = 2 \cdot 10^{-10}$$

#### Paso 2
Gana $y_1$, por un factor de 5000. El modelo de traducción empata y es el modelo de lenguaje, que mide la fluidez, el que decide.
