# TA U2 - Modelos estadísticos

## 1. Aprender de datos

### ¿Qué tipos de datos se distinguen para aprender a traducir?
Monolingües (un solo idioma), multilingües (varios idiomas sin emparejar) y paralelos (pares que son traducción mutua). Los paralelos pueden ser de texto a texto, de voz a texto, de texto a voz o de voz a voz.

### ¿Qué tipo de datos hace falta para aprender un modelo de traducción?
Datos paralelos, porque el modelo necesita ver qué frase de un idioma corresponde a qué frase del otro.

### Si se conociera el alineamiento de palabras de un corpus paralelo, ¿cómo se obtendría el diccionario probabilístico?
Contando cuántas veces cada palabra origen está alineada con cada palabra destino y normalizando. Como el alineamiento no se conoce, hay que aprenderlo de los datos.

### ¿Puede EM distinguir dos palabras que aparecen exactamente en las mismas frases del corpus?
No. La verosimilitud es la misma si se intercambian, así que EM les da la misma probabilidad. El corpus no contiene esa información: con pocos datos, EM aprende coocurrencia y no traducción.

## 2. Modelos basados en palabras

### ¿Qué es el alineamiento $a$ en los modelos basados en palabras?
Una secuencia $a = a_1 \dots a_I$ que asigna a cada posición destino $i$ una posición origen $a_i \in \{0, \dots, J\}$.

### ¿Qué representa la posición 0 del alineamiento?
La palabra NULL del origen, para las palabras destino que no corresponden a ninguna palabra origen. Es una posición del origen, no del destino.

### ¿Por qué un alineamiento de palabras no puede unir una palabra destino con dos palabras origen?
Porque $a$ es una función: asigna una sola posición origen a cada posición destino. Esta limitación motiva los modelos basados en frases.

### ¿Por qué se suma sobre todos los alineamientos para calcular $P(y \mid x)$?
Porque el alineamiento es una variable oculta: no se observa en los datos.

### ¿Qué dos suposiciones hace el modelo IBM 1?
1. La palabra destino depende solo de la palabra origen con la que está alineada, $p(y_i \mid x_{a_i})$.
2. Todas las posiciones origen, incluida NULL, son igual de probables: $\frac{1}{J+1}$.

### ¿Cuál es la expresión de $P(y \mid x)$ en el modelo IBM 1?
$$\begin{aligned}&P(y \mid x) \\ &\approx \frac{1}{(J+1)^I} \prod_{i=1}^{I} \sum_{j=0}^{J} p(y_i \mid x_j)\end{aligned}$$

### ¿Por qué el modelo IBM 1 no tiene en cuenta el orden de las palabras?
Porque la probabilidad de alinear es uniforme y no depende de la posición $i$ ni de lo ya alineado. Por tanto, dos traducciones con las mismas palabras en distinto orden reciben la misma probabilidad.

### ¿Qué calcula el paso E del entrenamiento del modelo IBM 1?
La probabilidad de que la palabra destino $i$ de la frase $n$ venga de la palabra origen $j$:

$$a_{nij} = \frac{p(y_{ni} \mid x_{nj})}{\sum_{j'} p(y_{ni} \mid x_{nj'})}$$

### ¿Qué calcula el paso M del entrenamiento del modelo IBM 1?
La cuenta esperada de cada par (palabra origen $v$, palabra destino $u$), sumando $a_{nij}$ en todas las frases. Después normaliza para que $\sum_u p(u \mid v) = 1$.

### ¿Qué cambia el modelo IBM 2 respecto al 1?
Que la probabilidad de alineamiento depende de la posición: $p(a_i \mid i, J, I)$ en lugar de ser uniforme. Se entrena con el mismo EM y una tabla más.

### ¿Qué añaden los modelos IBM 3 a 5?
La fertilidad, es decir, cuántas palabras destino genera cada palabra origen, entre otras cosas.

### ¿Qué añade el modelo de alineamiento HMM?
Una dependencia de primer orden: el alineamiento de una palabra depende del alineamiento de la anterior.

### ¿Qué herramienta se usa para entrenar los modelos IBM?
GIZA++, de Och. Los modelos IBM se publicaron en Brown et al. (1993).

### Demostración: en el modelo IBM 1 la suma sobre alineamientos se convierte en un producto de sumas
#### Paso 1
Con las dos suposiciones del modelo:

$$\sum_a \prod_{i=1}^{I} \frac{1}{J+1}\, p(y_i \mid x_{a_i})$$

#### Paso 2
Cada $a_i$ varía de forma independiente entre $0$ y $J$. Al desarrollar el producto de sumas $\prod_i \sum_j f_i(j)$ salen exactamente todas las combinaciones $\sum_a \prod_i f_i(a_i)$. Con $I = 2$ y $J = 1$:

$$\begin{aligned}&(f_1(0) + f_1(1))(f_2(0) + f_2(1)) \\ &= f_1(0)f_2(0) + f_1(0)f_2(1) \\ &\quad + f_1(1)f_2(0) + f_1(1)f_2(1)\end{aligned}$$

#### Paso 3
Por tanto:

$$\begin{aligned}&\sum_a \prod_{i} \frac{p(y_i \mid x_{a_i})}{J+1} \\ &= \frac{1}{(J+1)^I} \prod_{i} \sum_{j=0}^{J} p(y_i \mid x_j)\end{aligned}$$

El lado izquierdo tiene $(J+1)^I$ términos y el derecho solo $I(J+1)$ sumandos. Esa diferencia es lo que hace calculable el modelo.

### Problema: escribe el alineamiento $a$ de dos pares de frases
Origen $x$ = «el gato negro duerme» y destino $y$ = «the black cat sleeps». Después, origen $x$ = «gatos duermen» y destino $y$ = «the cats sleep».
#### Paso 1
Para cada palabra destino, en orden, se anota la posición origen de la que viene. En el primer par: the viene de el (1), black de negro (3), cat de gato (2) y sleeps de duerme (4). Por tanto, $a = (1, 3, 2, 4)$.
#### Paso 2
En el segundo par, the no corresponde a ninguna palabra origen y va a NULL (0). cats viene de gatos (1) y sleep de duermen (2). Por tanto, $a = (0, 1, 2)$.

### Problema: aplica un paso de EM del modelo IBM 1 a un corpus de dos pares
Pares (origen y destino): «green house» y «casa verde», y «house» y «casa». El vocabulario destino es {casa, verde} y se empieza con $p(u \mid v) = 1/2$ para todo par. Incluye NULL como palabra origen. Calcula $p(\text{casa} \mid \text{house})$ tras la primera iteración.
#### Paso 1
Paso E en el primer par. Las palabras origen son NULL, green y house, y todas tienen la misma $p$. Por tanto, cada palabra destino (casa y verde) reparte su masa a partes iguales: $a_{nij} = 1/3$.
#### Paso 2
Paso E en el segundo par. Las palabras origen son NULL y house, así que casa reparte $1/2$ a cada una.
#### Paso 3
Paso M para house. Cuenta esperada de casa: $1/3 + 1/2 = 5/6$. Cuenta esperada de verde: $1/3$. Total: $7/6$.
#### Paso 4
Se normaliza:

$$p(\text{casa} \mid \text{house}) = \frac{5/6}{7/6} = \frac{5}{7} \approx 0{,}71$$

$$p(\text{verde} \mid \text{house}) = \frac{2}{7} \approx 0{,}29$$

En una sola iteración, house ya se inclina hacia casa, porque es la única palabra destino que aparece en las dos frases con house.

## 3. Modelos basados en frases

### ¿Qué motiva los modelos basados en frases?
Capturar correspondencias de muchas palabras a muchas palabras, lo que incluye contexto. Los modelos de palabras solo permiten que cada palabra destino venga de una palabra origen.

### ¿Qué dos familias de modelos basados en frases hay?
Generativos, con variables ocultas de segmentación y alineamiento, y heurísticos, que simetrizan el alineamiento y estiman por frecuencias relativas.

### ¿Cuáles son los pasos de la extracción heurística de frases?
1. Entrenar un alineamiento de palabras en cada dirección.
2. Tomar la intersección de los dos y añadir de forma heurística enlaces de la unión.
3. Extraer todos los pares de frases consistentes con ese alineamiento.

### ¿Cuándo es consistente un par de frases con un alineamiento?
Cuando ninguna palabra del par está alineada con una palabra de fuera del par. Las palabras sin alinear sí pueden quedar dentro.

### ¿Por qué un mal alineamiento de palabras estropea la tabla de frases?
Porque un enlace erróneo hace inconsistentes pares que serían correctos. Por ejemplo, si «the» y «blue» se alinean las dos con «azul», el par «blue / azul» no se puede extraer, porque «azul» está unida también a una palabra de fuera.

### ¿Cómo se estima $p(\bar{y} \mid \bar{x})$ en el enfoque heurístico?
Por frecuencias relativas de los pares extraídos:

$$p(\bar{y} \mid \bar{x}) = \frac{N(\bar{x}, \bar{y})}{N(\bar{x})}$$

### ¿Qué regla de decisión usa un sistema basado en frases en la práctica?
Una combinación log-lineal de características:

$$\hat{y} \approx \arg\max_y \sum_m \lambda_m\, h_m(x, y)$$

### ¿Qué características $h_m$ combina un sistema log-lineal basado en frases?
Modelos de frases en las dos direcciones, modelos de palabras en las dos direcciones, el modelo de lenguaje del destino, un modelo de reordenación y una penalización por número de frases.

### ¿Qué algoritmo de búsqueda usan los sistemas basados en frases?
Decodificación multipila, un A* basado en programación dinámica, con poda de hipótesis.

### En la decodificación multipila, ¿qué guarda una hipótesis?
La cobertura de la frase origen (qué palabras se han traducido ya), el prefijo destino generado y su puntuación.

### ¿Qué diferencia hay entre la poda por haz y la poda por histograma?
La poda por haz descarta las hipótesis que se alejan demasiado de la mejor, o que quedan bajo un umbral. La poda por histograma limita el número de hipótesis de cada pila.

### Problema: decide qué pares de frases son consistentes con un alineamiento
Origen «the red car» y destino «el coche rojo», con los enlaces the–el, red–rojo y car–coche. ¿Son consistentes «red car / coche rojo», «the / el» y «the red / el coche rojo»?
#### Paso 1
«red car / coche rojo»: los dos enlaces de esas palabras (red–rojo y car–coche) quedan dentro del par. Es consistente, y el cruce de orden no importa.
#### Paso 2
«the / el»: su único enlace queda dentro. Es consistente.
#### Paso 3
«the red / el coche rojo»: para cubrir rojo hay que incluir coche, que está alineada con car, fuera del par por el lado inglés. No es consistente. Tampoco existe un par «the red / el … rojo» sin coche, porque las frases son secuencias contiguas.

## 4. Evaluación

### ¿Por qué es difícil evaluar la traducción automática?
Porque no hay una única traducción correcta: hay muchas aceptables y nunca se dispone de todas.

### ¿Qué ventajas e inconvenientes tiene la evaluación automática frente a la manual?
La automática es objetiva y rápida y permite comparar sistemas, pero solo aproxima la calidad. La manual refleja la calidad real, pero es subjetiva y cara en tiempo y dinero.

### Cita métricas automáticas que usan una traducción de referencia.
WER, BLEU, METEOR y COMET. También TER, chrF y MetricX-23.

### ¿Cuál es la fórmula de BLEU?
$$\text{BLEU} = BP \cdot \exp\left(\sum_{n=1}^{N} w_n \log p_n\right)$$

con $N = 4$, pesos uniformes $w_n = 1/N$ y $p_n$ la precisión modificada de n-gramas.

### ¿Qué es la precisión modificada de n-gramas de BLEU?
La fracción de n-gramas de la hipótesis que aparecen en la referencia, con el recuento de cada n-grama recortado al número de veces que aparece en la referencia. El recorte evita premiar la repetición.

### Con varias referencias, ¿cómo se recorta el recuento de un n-grama en BLEU?
Al máximo número de veces que aparece en cualquiera de las referencias.

### ¿Qué castiga la penalización por brevedad (BP) de BLEU y cuánto vale?
Castiga las hipótesis más cortas que la referencia, que de otro modo tendrían una precisión alta con muy pocas palabras. Con $r$ la longitud de la referencia y $c$ la de la hipótesis:

$$BP = \begin{cases} 1 & \text{si } c > r \\ e^{1 - r/c} & \text{si } c \le r \end{cases}$$

### ¿Por qué BLEU se calcula sobre el corpus y no frase a frase?
Porque en una frase suelta basta con que un $p_n$ sea 0 para que el logaritmo anule todo y BLEU valga 0, aunque la traducción sea casi perfecta. Sobre el corpus se suman aciertos y totales de todas las frases antes de dividir.

### ¿Qué limitación tiene BLEU con los sinónimos?
Solo cuenta coincidencias exactas de n-gramas. Un sinónimo correcto, como «home» por «house», cuenta como un fallo completo.

### ¿Qué ve COMET que no ve BLEU?
La frase origen. COMET es una métrica neuronal que compara origen, hipótesis y referencia, y se entrena para imitar juicios humanos (DA, HTER y MQM).

### ¿Qué codificador usa COMET?
Un codificador multilingüe basado en XLM-RoBERTa, aplicado a la frase origen, la hipótesis y la referencia.

### ¿Qué diferencia hay entre el modelo estimador y el modelo de ranking de COMET?
El estimador es un regresor que predice una puntuación de calidad y minimiza el error cuadrático medio contra juicios humanos. El de ranking aprende a dejar la hipótesis peor más lejos del ancla que la mejor, con una pérdida de tripleta.

### ¿Se pueden comparar directamente las puntuaciones de COMET y de BLEU?
No. Tienen escalas distintas, y COMET tiende a dar valores comprimidos cerca de 1.

### ¿Qué es la estimación de calidad (QE)?
Estimar la calidad de una traducción sin referencia, solo con la frase origen y la hipótesis. Un ejemplo es COMET-Kiwi.

### ¿Para qué se usa la estimación de calidad?
Para decidir si una traducción se publica tal cual o va a post-edición, avisar al lector de si fiarse, marcar las palabras que hay que editar, elegir el mejor de varios sistemas y filtrar datos paralelos mal alineados.

### ¿Cómo funciona la evaluación de adecuación y fluidez?
Con dos escalas independientes de 5 puntos. La adecuación mide cuánto significado se conserva y la fluidez, la gramática, la naturalidad y el estilo. Su problema es la varianza entre anotadores.

### ¿Cómo se convierte una evaluación por pares en un ranking de sistemas?
Con modelos como TrueSkill o Bradley-Terry, que convierten las preferencias A contra B en un ranking global. No dan una calidad absoluta.

### ¿Qué es la evaluación directa (DA)?
Una escala continua de 0 a 100, estándar en WMT desde 2017. Cada puntuación se normaliza por anotador con la puntuación z, $z = (x - \mu) / \sigma$, para quitar su sesgo de escala.

### ¿Qué es MQM?
Un protocolo de evaluación humana en el que el anotador identifica cada error, lo clasifica y le asigna una gravedad. Necesita traductores profesionales.

### ¿Qué categorías de error tiene la taxonomía MQM?
Precisión (mala traducción, omisión o adición, contenido sin traducir), fluidez (gramática, ortografía, registro), terminología, y estilo y localización (fechas, monedas, unidades).

### ¿Qué pesos tienen los errores en la puntuación MQM?
Un error menor pesa 1, uno mayor 5 y uno crítico entre 10 y 25.

### ¿Qué sesgo tienen los anotadores no profesionales frente a los profesionales?
Sobrevaloran la fluidez y pueden dar una falsa paridad con la traducción humana. Con profesionales y MQM, la correlación de BLEU con las personas cae y la de COMET se mantiene.

### ¿Con qué se mide el acuerdo entre anotadores?
Con el alfa de Krippendorff y la kappa de Cohen.

### ¿Qué ventaja tiene evaluar a nivel de documento?
Permite juzgar la correferencia, los marcadores del discurso y la coherencia terminológica, que no se ven en una frase suelta.

### Problema: calcula $p_1$, $p_2$ y la penalización por brevedad
Hipótesis «the cat sat on mat» y referencia «the cat sat on the mat».
#### Paso 1
Unigramas de la hipótesis: the, cat, sat, on y mat. Los cinco están en la referencia, así que $p_1 = 5/5 = 1$.
#### Paso 2
Bigramas de la hipótesis: «the cat», «cat sat», «sat on» y «on mat». La referencia tiene los tres primeros, pero no «on mat». Por tanto, $p_2 = 3/4$.
#### Paso 3
La hipótesis es más corta: $c = 5$ y $r = 6$. Por tanto:

$$BP = e^{1 - 6/5} = e^{-0{,}2} \approx 0{,}82$$

### Problema: calcula la precisión de unigramas con recorte
Hipótesis «the the the cat» y referencia «the cat sat on the mat».
#### Paso 1
En la hipótesis, the aparece 3 veces, pero en la referencia solo 2. Su recuento se recorta a 2.
#### Paso 2
cat aparece una vez en cada una y cuenta 1. Por tanto, $p_1 = (2 + 1)/4 = 3/4$.

### Problema: calcula la puntuación MQM de un segmento
Un segmento de 20 palabras tiene dos errores menores y uno mayor. La puntuación es $\text{MQM} = 100 - \frac{\sum \text{pesos}}{L} \cdot 100$, con $L$ la longitud del segmento.
#### Paso 1
Suma de pesos: $1 + 1 + 5 = 7$.
#### Paso 2
$$\text{MQM} = 100 - \frac{7}{20} \cdot 100 = 65$$
