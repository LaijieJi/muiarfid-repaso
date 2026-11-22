# TA U3 - Modelos neuronales

## 3.1 Fundamentos y evolución de seq2seq

### ¿Qué limitaciones de la traducción estadística motivan el paso a la neuronal?
1. Los componentes se entrenan por separado y los errores se propagan.
2. Las tablas de frases exigen coincidencias exactas y no generalizan a frases nuevas ni a morfología rica.
3. Los decodificadores solo ven ventanas cortas de unos 3 a 7 elementos, de modo que reordenan mal a larga distancia (por ejemplo, el verbo al final en alemán).
4. Encontrar la mejor traducción con frases y límite de distorsión es NP-difícil en general, de modo que solo se aproxima con la búsqueda en haz.

### ¿Por qué la traducción neuronal sustituye las tablas de frases por vectores continuos?
Porque en un espacio denso las palabras con significado parecido quedan cerca (similitud coseno cercana a 1) y el modelo generaliza. Además, todos los parámetros (embeddings, capas ocultas y proyecciones) se optimizan a la vez por retropropagación, y el codificador captura el contexto global de la frase.

### ¿Qué función de pérdida se minimiza al entrenar un sistema de traducción neuronal?
La log-verosimilitud negativa del corpus paralelo $\mathcal{D}$:

$$\theta^* = \arg\min_\theta \sum_{(X,Y) \in \mathcal{D}} -\log P(Y \mid X; \theta)$$

### ¿Cómo funciona el modelo codificador-decodificador recurrente de Sutskever y Cho?
El codificador recorre la frase origen con $h^{(e)}_t = \text{RNN}_{enc}(x_t, h^{(e)}_{t-1})$ y se queda con el último estado como vector de contexto $c = h^{(e)}_{T_x}$. El decodificador genera de forma autorregresiva con $h^{(d)}_i = \text{RNN}_{dec}(y_{i-1}, h^{(d)}_{i-1}, c)$, y una capa softmax da $p(y_i \mid y_{<i}, x)$.

### ¿Cuál es el cuello de botella de información del modelo codificador-decodificador recurrente?
Toda la frase origen, de longitud variable, se comprime en un único vector $c$ de tamaño fijo. Al crecer la frase, $c$ pierde capacidad y la calidad (BLEU) cae rápidamente en frases de más de unos 20 elementos.

### ¿Por qué las RNN simples sufren gradientes que se desvanecen o explotan?
Porque la retropropagación a través del tiempo multiplica una y otra vez por la matriz de pesos $W$. Si su mayor autovalor es menor que 1, el gradiente se desvanece y el contexto lejano se olvida. Si es mayor que 1, explota y hay inestabilidad numérica.

### ¿Cómo mitigan LSTM y GRU el desvanecimiento del gradiente?
Con compuertas que crean atajos para el gradiente. La GRU tiene una compuerta de actualización y otra de reinicio. La LSTM mantiene un estado de celda $C_t$ que se actualiza por sumas lineales, $C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$, con $f_t$ la compuerta de olvido y $i_t$ la de entrada. Alargan la secuencia útil de unos 10 a unos 30 o 40 elementos, pero no eliminan el cuello de botella del vector fijo.

### ¿Cómo evita la atención de Bahdanau el cuello de botella del vector fijo?
Calcula un vector de contexto distinto $c_i$ para cada paso del decodificador, como suma ponderada de todos los estados del codificador:

$$c_i = \sum_{j=1}^{T_x} \alpha_{ij}\, h^{(e)}_j$$

Así el decodificador mira a la parte de la frase origen que necesita en cada palabra.

### ¿Cómo se calculan las puntuaciones y los pesos de la atención aditiva de Bahdanau?
$$e_{ij} = v_a^T \tanh\!\left(W_a h^{(d)}_{i-1} + U_a h^{(e)}_j\right), \qquad \alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{k=1}^{T_x} \exp(e_{ik})}$$

La puntuación compara el estado previo del decodificador con cada estado del codificador, y el softmax las convierte en pesos que suman 1.

### ¿Qué tres funciones de alineamiento propone la atención multiplicativa de Luong?
Producto escalar, $h^{(d)T}_i h^{(e)}_j$, general, $h^{(d)T}_i W_a h^{(e)}_j$, y concatenación, $v_a^T \tanh(W_a [h^{(d)}_i; h^{(e)}_j])$. Usan el estado de la capa superior del decodificador, $h^{(d)}_i$, mientras que Bahdanau usa el estado previo $h^{(d)}_{i-1}$.

### ¿Qué limitación tiene la atención por producto escalar de Luong y cómo la resuelve la general?
El producto escalar exige que el decodificador y el codificador tengan la misma dimensión, $d_d = d_e$. La versión general introduce una matriz $W_a \in \mathbb{R}^{d_d \times d_e}$ que adapta las dimensiones.

### ¿Por qué no se puede buscar la mejor traducción $\hat{y} = \arg\max_y p(y \mid x)$ por enumeración?
Porque el espacio de secuencias crece exponencialmente, como $|\mathcal{V}|^I$ para vocabulario $\mathcal{V}$ y longitud $I$. Por eso se usan aproximaciones como la búsqueda voraz (greedy) y la búsqueda en haz (beam search).

### ¿Qué hace la búsqueda en haz con tamaño $B$ en cada paso?
Conserva $B$ hipótesis parciales. Expande cada una con sus mejores continuaciones, puntúa los $B \times |\mathcal{V}|$ candidatos con la suma de log-probabilidades y retiene solo los $B$ mejores.

### ¿Qué ventaja tiene la búsqueda en haz sobre la voraz?
La voraz elige en cada paso el símbolo más probable y puede quedarse en un óptimo local, porque un símbolo menos probable ahora puede llevar a una continuación mucho mejor. El haz mantiene alternativas vivas, pero tampoco garantiza el óptimo global, porque puede podar pronto la hipótesis que acabaría siendo la mejor.

### ¿Qué problemas tiene un vocabulario de caracteres?
Los caracteres dan un vocabulario de unos 100 símbolos sin palabras desconocidas, pero secuencias muy largas, con más coste y caminos de gradiente más largos. Las subpalabras (subwords) ocupan el punto intermedio.

### ¿Cómo construye el vocabulario el algoritmo BPE (byte-pair encoding)?
De abajo arriba. Parte de los caracteres y, de forma iterativa, cuenta los pares de símbolos adyacentes en el corpus y fusiona el más frecuente en un símbolo nuevo. Se detiene al llegar al tamaño de vocabulario deseado.

### ¿En qué se diferencian BPE, WordPiece y el modelo unigrama como tokenizadores?
BPE fusiona el par más frecuente. WordPiece fusiona el par que más aumenta la verosimilitud de los datos, con puntuación $\text{Count}(AB) / (\text{Count}(A)\,\text{Count}(B))$. El modelo unigrama (Kudo) va de arriba abajo: parte de muchas subpalabras candidatas y elimina las que menos aumentan la pérdida del modelo de lenguaje unigrama.

### ¿Qué aporta SentencePiece frente a un tokenizador de subpalabras que trabaja sobre palabras ya separadas?
Trata el texto crudo como una secuencia de símbolos, sin preprocesar por espacios (la diapositiva dice «bytes»), así que sirve para idiomas sin espacios (chino, japonés, tailandés). Es reversible porque conserva el espacio con el símbolo «▁» (U+2581).

### Problema: probabilidad de una traducción con la regla de la cadena
Un modelo da para el origen «a black horse» las probabilidades $p(\text{un}) = 0{,}6$, $p(\text{caballo} \mid \text{un}) = 0{,}5$, $p(\text{negro} \mid \text{un caballo}) = 0{,}4$ y $p(\texttt{<eos>} \mid \text{un caballo negro}) = 0{,}9$. Calcula $p(y \mid x)$, su log-probabilidad y la log-probabilidad media por símbolo.
#### Paso 1
Por la regla de la cadena, $p(y \mid x) = \prod_i p(y_i \mid y_{<i}, x)$:

$$0{,}6 \cdot 0{,}5 \cdot 0{,}4 \cdot 0{,}9 = 0{,}108$$

#### Paso 2
La log-probabilidad es la suma de logaritmos naturales:

$$\ln 0{,}6 + \ln 0{,}5 + \ln 0{,}4 + \ln 0{,}9 = -0{,}511 - 0{,}693 - 0{,}916 - 0{,}105 = -2{,}226$$

#### Paso 3
Con 4 símbolos (el fin de frase cuenta), la media es $-2{,}226 / 4 = -0{,}556$.

### Problema: atención de Luong por producto escalar y por forma general
Con los mismos $h_1 = (1,0)$, $h_2 = (0,1)$ y $h_3 = (1,1)$, el estado del decodificador es $h^{(d)}_i = (1, 2)$. Calcula los pesos y el contexto con el producto escalar. Después, con $W_a = \text{diag}(1, 2)$, calcula las puntuaciones de la forma general.
#### Paso 1
Producto escalar: $e = (1\cdot1 + 2\cdot0,\ 0 + 2,\ 1 + 2) = (1, 2, 3)$. Los pesos son $\alpha = (0{,}090;\ 0{,}245;\ 0{,}665)$.
#### Paso 2
$$c_i = 0{,}090\,(1,0) + 0{,}245\,(0,1) + 0{,}665\,(1,1) = (0{,}755;\ 0{,}910)$$

#### Paso 3
Forma general: $h^{(d)T}_i W_a = (1, 2)\,\text{diag}(1,2) = (1, 4)$. Las puntuaciones son $(1, 4, 5)$, así que la matriz $W_a$ separa más las puntuaciones y aguza la atención hacia $h_3$ (peso $0{,}721$).

### Problema: búsqueda voraz y en haz con $B = 2$
Un modelo da $p(a) = 0{,}5$, $p(b) = 0{,}3$ y $p(c) = 0{,}2$ en el primer paso. En el segundo paso, tras $a$ da $(0{,}4;\ 0{,}3;\ 0{,}3)$ para $(a, b, c)$, tras $b$ da $(0{,}05;\ 0{,}05;\ 0{,}9)$ y tras $c$ da $(0{,}5;\ 0{,}25;\ 0{,}25)$. Compara la voraz con el haz $B = 2$ en dos pasos.
#### Paso 1
Voraz: elige $a$ (0,5) y después $a$ (0,4). La secuencia es $aa$ con probabilidad $0{,}5 \cdot 0{,}4 = 0{,}20$.
#### Paso 2
Haz: tras el primer paso conserva $a$ (0,5) y $b$ (0,3), y descarta $c$. Los candidatos son $aa = 0{,}20$, $ab = 0{,}15$, $ac = 0{,}15$, $ba = 0{,}015$, $bb = 0{,}015$ y $bc = 0{,}3 \cdot 0{,}9 = 0{,}27$.
#### Paso 3
Se retienen $bc$ (0,27) y $aa$ (0,20). La mejor es $bc$ con $0{,}27 > 0{,}20$. El haz encuentra una traducción más probable que la voraz porque mantuvo viva $b$, que parecía peor tras el primer símbolo.

### Problema: la longitud cambia la hipótesis ganadora
Hay tres hipótesis completas con estas probabilidades por símbolo, incluido el fin de frase. $H_1$ tiene 2 símbolos: $(0{,}5;\ 0{,}8)$. $H_2$ tiene 4: $(0{,}6;\ 0{,}7;\ 0{,}8;\ 0{,}9)$. $H_3$ tiene 3: $(0{,}7;\ 0{,}5;\ 0{,}7)$. Elige la mejor por log-probabilidad y por log-probabilidad media por símbolo.
#### Paso 1
Probabilidades: $H_1 = 0{,}400$, $H_2 = 0{,}3024$ y $H_3 = 0{,}245$. Log-probabilidades: $-0{,}916$, $-1{,}196$ y $-1{,}406$.
#### Paso 2
Por log-probabilidad total gana $H_1$, la más corta.
#### Paso 3
Medias por símbolo: $H_1 = -0{,}916/2 = -0{,}458$, $H_2 = -1{,}196/4 = -0{,}299$ y $H_3 = -1{,}406/3 = -0{,}469$. Normalizando gana $H_2$. Es el sesgo hacia lo corto que corrige la normalización por longitud.

### Problema: aprende fusiones BPE y tokeniza una palabra nueva
Corpus con frecuencias: low (1), lowest (3), newer (3), wider (2). Cada palabra termina con el marcador de fin `</w>` (convención del artículo original de BPE, que la diapositiva no usa) y se parte en caracteres. Aprende 3 fusiones y tokeniza «lower».
#### Paso 1
Fusión 1. El par más frecuente es (w, e) con $3 + 3 = 6$ apariciones (en lowest y newer). Se convierte en el símbolo «we».
#### Paso 2
Fusión 2. Ahora el par más frecuente es (r, `</w>`) con $3 + 2 = 5$ (newer y wider), que forma «r`</w>`».
#### Paso 3
Fusión 3. El par (l, o) aparece $1 + 3 = 4$ veces (low y lowest) y forma «lo».
#### Paso 4
«lower» parte de l o w e r `</w>`. Se aplican las fusiones en orden: w e da «we», r `</w>` da «r`</w>`» y l o da «lo». El resultado es lo, we, r`</w>`.

## 3.2 Arquitecturas Transformer para traducción

### ¿Para qué sirve la atención de producto escalar escalada en un traductor?
Cada posición del destino calcula una media ponderada de los valores del origen o del propio destino, con pesos $\text{softmax}(QK^T / \sqrt{d_k})$. Las proyecciones $Q = XW_Q$, $K = XW_K$ y $V = XW_V$ salen de la misma entrada $X$ mediante matrices aprendidas.

### ¿Qué calcula la atención cruzada (cross-attention) en el decodificador de un traductor?
Las consultas (queries) vienen de la capa anterior del decodificador, y las claves y valores salen de la salida de la última capa del codificador. Cada palabra destino consulta todas las palabras origen, lo que cumple el papel del alineamiento aunque el orden de las palabras difiera.

### ¿Por qué la atención propia no distingue el orden de los elementos y cómo se arregla?
Calcula operaciones por pares, de modo que permutar la entrada permuta la salida de la misma forma (es equivariante a la permutación), y no usa el orden. Se arregla sumando una codificación posicional a los embeddings.

### ¿Cómo es la codificación posicional sinusoidal y qué propiedad útil tiene?
Para la posición $pos$ y frecuencias $w_i = 1 / 10000^{2i/d_{model}}$, cada par de componentes es $(\sin(w_i\, pos),\ \cos(w_i\, pos))$. La codificación de $pos + k$ es una función lineal (una rotación) de la de $pos$, de modo que el modelo puede aprender posiciones relativas.

### ¿Qué limitación tienen las codificaciones posicionales absolutas aprendidas y qué las sustituye en los LLM de traducción?
Mapean cada posición a una fila de una matriz entrenable $E \in \mathbb{R}^{L_{max} \times d_{model}}$ y no generalizan a longitudes mayores que $L_{max}$. Los modelos modernos (Llama 3, Qwen 2.5) usan RoPE, que rota consultas y claves de modo que su producto escalar depende solo de la distancia relativa.

### ¿Cómo es la red feed-forward por posición y qué activaciones modernas la sustituyen?
Se aplica igual a cada posición, $\text{FFN}(X) = \text{ReLU}(XW_1 + b_1)W_2 + b_2$, y expande la dimensión interna a $d_{ff} = 4\, d_{model}$. Los modelos recientes cambian la ReLU por GELU, $x \cdot P(\mathcal{N}(0,1) \le x)$, o por SwiGLU, que multiplica por una compuerta con $\text{SiLU}(a) = a\,\sigma(a)$.

### ¿Qué diferencia hay entre normalización Post-LN y Pre-LN?
Post-LN normaliza tras la suma residual, $X_{l+1} = \text{LN}(X_l + \text{SubLayer}(X_l))$, y exige calentamiento (warmup) de la tasa de aprendizaje y es inestable en redes muy profundas. Pre-LN normaliza la entrada de la subcapa, $X_{l+1} = X_l + \text{SubLayer}(\text{LN}(X_l))$, y deja un camino directo para el gradiente, de modo que se puede entrenar sin calentamiento.

### ¿En qué se diferencia RMSNorm de LayerNorm?
RMSNorm no resta la media, solo divide por la raíz de la media de cuadrados, $\bar{a}_i = \frac{a_i}{\text{RMS}(a)}\gamma_i$, con $\text{RMS}(a) = \sqrt{\frac{1}{d}\sum_i a_i^2 + \epsilon}$. Es más rápida y es la elección habitual en los LLM actuales.

### ¿Para qué sirve la máscara causal en el decodificador y por qué no hay máscara en el codificador?
En el entrenamiento se procesa toda la frase destino en paralelo, y la máscara (con $-\infty$ en las posiciones futuras antes del softmax) impide que la posición $i$ vea los símbolos $i' > i$. El codificador ve todo el origen, que está completo, y no necesita máscara.

### ¿Qué es el teacher forcing y qué sesgo introduce (exposure bias)?
En el entrenamiento, el decodificador recibe como prefijo los símbolos reales de la referencia, $y^*_{<t}$. En la inferencia recibe los que él mismo predice. Esa diferencia es el sesgo de exposición, y hace que un error temprano se acumule y produzca alucinaciones o paradas prematuras.

### ¿Cómo reduce el muestreo programado (scheduled sampling) el sesgo de exposición?
Sustituye de forma gradual, con probabilidad $\epsilon_i$, el prefijo real por el predicho por el modelo durante el entrenamiento. Su limitación es que muestrear símbolos discretos no es diferenciable, y por eso hacen falta técnicas de aprendizaje por refuerzo.

### ¿Qué optimiza el entrenamiento de riesgo mínimo (MRT)?
El riesgo esperado de la métrica sobre un conjunto de traducciones muestreadas $S(X)$:

$$\mathcal{L}_{MRT} = \sum_{(X,Y^*)} \sum_{Y \in S(X)} P(Y \mid X; \theta)\, \Delta(Y, Y^*), \qquad \Delta = 1 - \text{Metric}$$

Optimiza directamente BLEU o COMET en lugar de la verosimilitud por símbolo. En la práctica, $P(Y \mid X; \theta)$ se renormaliza dentro del conjunto $S(X)$ para que sume 1.

### ¿Por qué es útil el suavizado de etiquetas (label smoothing) en traducción neuronal?
La entropía cruzada empuja el logit del símbolo correcto hacia $+\infty$ y los demás hacia $-\infty$, y el modelo queda sobreconfiado y mal calibrado. Con un objetivo suavizado, $1 - \epsilon$ para el símbolo correcto y $\epsilon / (|\mathcal{V}| - 1)$ para cada uno de los demás, el modelo deja de confiar en una forma exacta. En esta definición, $1-\epsilon$ es la masa del símbolo correcto y $\epsilon$ se reparte solo entre los incorrectos. Mejora BLEU y COMET y la generalización fuera del dominio.

### Problema: atención cruzada con dos palabras destino y tres palabras origen
Con $d_k = 4$, las consultas son $Q = \begin{pmatrix}2&2&0&0\\0&0&2&2\end{pmatrix}$, las claves $K = \begin{pmatrix}1&1&0&0\\0&0&1&1\\1&0&1&0\end{pmatrix}$ y los valores $V = \begin{pmatrix}1&0\\0&1\\1&1\end{pmatrix}$. Calcula la salida.
#### Paso 1
$QK^T = \begin{pmatrix}4&0&2\\0&4&2\end{pmatrix}$ y, dividiendo por $\sqrt{d_k} = 2$, las puntuaciones son $\begin{pmatrix}2&0&1\\0&2&1\end{pmatrix}$.
#### Paso 2
Softmax por filas. Fila 1: $e^2 = 7{,}389$, $e^0 = 1$ y $e^1 = 2{,}718$, con suma $11{,}107$, que da $(0{,}665;\ 0{,}090;\ 0{,}245)$. Fila 2 es simétrica: $(0{,}090;\ 0{,}665;\ 0{,}245)$.
#### Paso 3
Fila 1 de la salida: $0{,}665\,(1,0) + 0{,}090\,(0,1) + 0{,}245\,(1,1) = (0{,}910;\ 0{,}335)$. Fila 2: $(0{,}335;\ 0{,}910)$. Cada palabra destino se centra en la palabra origen cuya clave se parece a su consulta.

### Problema: aplica la máscara causal a una matriz de puntuaciones
La matriz de puntuaciones del decodificador con tres símbolos es $S = \begin{pmatrix}1&2&3\\0&1&2\\2&1&0\end{pmatrix}$. Calcula los pesos de atención con máscara causal.
#### Paso 1
La máscara pone $-\infty$ por encima de la diagonal, de modo que la fila 1 solo conserva $1$, la fila 2 conserva $(0, 1)$ y la fila 3 conserva $(2, 1, 0)$.
#### Paso 2
Fila 1: el único elemento da $(1, 0, 0)$. Fila 2: $e^0 = 1$ y $e^1 = 2{,}718$, con suma $3{,}718$, que da $(0{,}269;\ 0{,}731;\ 0)$.
#### Paso 3
Fila 3: $e^2 = 7{,}389$, $e^1 = 2{,}718$ y $e^0 = 1$, con suma $11{,}107$, que da $(0{,}665;\ 0{,}245;\ 0{,}090)$. Cada fila suma 1 y la parte superior es cero.

### Problema: pérdida con y sin suavizado de etiquetas
El vocabulario tiene 5 símbolos y el correcto es el primero. El modelo da $p = (0{,}7;\ 0{,}1;\ 0{,}1;\ 0{,}05;\ 0{,}05)$. Calcula la entropía cruzada con la etiqueta dura y con suavizado $\epsilon = 0{,}1$ (con la definición de esta unidad).
#### Paso 1
Con etiqueta dura: $-\ln 0{,}7 = 0{,}357$.
#### Paso 2
El objetivo suavizado es $q = (0{,}9;\ 0{,}025;\ 0{,}025;\ 0{,}025;\ 0{,}025)$, porque $\epsilon / (5 - 1) = 0{,}025$.
#### Paso 3
$$-\sum_k q_k \ln p_k = 0{,}9\,(0{,}357) + 0{,}025\,(2{,}303 + 2{,}303 + 2{,}996 + 2{,}996) = 0{,}321 + 0{,}265 = 0{,}586$$

La pérdida sube porque ahora el modelo debe repartir probabilidad entre los símbolos incorrectos. El mínimo se alcanza cuando $p = q$, y no con $p$ igual a un vector de unos y ceros.

## 3.3 Traducción automática neuronal multilingüe

### ¿Por qué se pasa de un modelo por par de idiomas a un modelo multilingüe?
Para $M$ idiomas, los modelos de un solo par exigen $M(M - 1)$ redes. Con $M = 100$ son 9.900 modelos que entrenar, mantener y desplegar. Un modelo universal usa un único conjunto de parámetros $\theta$ y permite transferencia entre idiomas, de modo que los de pocos recursos aprovechan los de muchos.

### ¿Qué tres escenarios cubre la traducción neuronal multilingüe?
Traducción multidireccional (multi-way), con un solo sistema para uno a muchos, muchos a uno o muchos a muchos. Idiomas de pocos recursos, que se apoyan en un par de muchos recursos, a veces con un idioma pivote. Y traducción multifuente, que traduce documentos en varios idiomas a uno solo.

### ¿Cómo sabe un decodificador compartido a qué idioma debe traducir?
Se antepone a la frase una etiqueta del idioma destino (language tag), que la representación del decodificador aprovecha muy bien. El inconveniente del decodificador compartido es el vocabulario común mayor, que agranda la capa softmax y ralentiza la inferencia.

### ¿Cómo se evitan las palabras desconocidas en un modelo multilingüe con un vocabulario común?
Se seleccionan palabras de todos los idiomas y se aprende un vocabulario de subpalabras (BPE o SentencePiece) compartido, de modo que cualquier palabra se descompone en trozos conocidos.

### ¿Cómo se entrena un modelo compartido cuando los idiomas tienen cantidades de datos muy distintas?
Cada lote mezcla pares de varios idiomas y se sobremuestrean (oversampling) los corpus pequeños y, en el extremo, hasta igualar al mayor, que es el muestreo uniforme (la temperatura lo suaviza). También se puede usar destilación de conocimiento (knowledge distillation), que entrena un modelo grande y destila su conocimiento en uno menor.

### ¿Qué técnicas ayudan a los idiomas de pocos recursos?
La retrotraducción (back-translation) y el autoentrenamiento (self-training) aumentan los datos. Un modelo padre entrenado con un idioma de muchos recursos se ajusta después (fine-tuning) al par de pocos recursos. La transferencia funciona mejor en el lado origen que en el destino, y un padre emparentado ayuda más que uno no emparentado. También se pueden entrenar a la vez cuando comparten el idioma destino.

### ¿Cómo funciona la traducción pivote y qué problemas tiene?
Si no hay corpus entre dos idiomas pero sí con un tercero (el pivote), se encadena un sistema origen a pivote con otro pivote a destino. Propaga los errores de la primera etapa y duplica el tiempo de decodificación. La reordenación de las mejores hipótesis (n-best) puede mejorarla.

### ¿Qué es la traducción zero-shot en un modelo multilingüe?
Traducir un par de idiomas que el sistema no vio nunca emparejados en el entrenamiento. Es posible porque el modelo comparte parámetros, y hace falta la etiqueta del idioma destino para forzar la salida. Su calidad suele ser inferior a la de la traducción pivote.

### ¿En qué se distinguen mBART y mT5?
Ambos son Transformers codificador-decodificador multilingües. mBART es un autocodificador de eliminación de ruido (denoising) que reconstruye texto con tramos enmascarados y frases permutadas (la diapositiva dice «tramos permutados») en 50 idiomas, y se ajusta después para traducir. mT5 predice tramos enmascarados (span corruption) en 101 idiomas con el corpus mC4, y sirve para varias tareas multilingües, entre ellas la traducción.

### ¿Qué problema tiene el muestreo empírico y el uniforme de pares de idiomas, y cómo lo suaviza la temperatura de muestreo de idiomas?
El empírico sobreajusta los pares de muchos recursos y nunca aprende los de pocos. El uniforme sobreajusta los pares pequeños y degrada los grandes. La temperatura $T$ interpola con $p_l = D_l^{1/T} / \sum_k D_k^{1/T}$, donde $D_l$ es el tamaño del corpus del par $l$. $T = 1$ es el muestreo empírico y $T \to \infty$ el uniforme, y se suele usar $T \in [2, 5]$.

## 3.4 Los LLM en la traducción automática

### ¿Qué son las habilidades emergentes y cuáles dan los LLM para traducir?
Capacidades que no aparecen en modelos pequeños y surgen en los grandes. El aprendizaje en contexto (in-context learning, ICL) permite completar la tarea con una instrucción y unos ejemplos en el texto de entrada, sin actualizar pesos. El seguimiento de instrucciones permite hacer tareas nuevas descritas en lenguaje natural.

### ¿Qué tipos de arquitectura Transformer se usan en los LLM y para qué sirve cada uno?
Codificador-decodificador (T5, BART, NLLB), pensado para generar texto. Solo codificador (BERT), para clasificación. Decodificador causal (GPT, Llama, Gemma), con máscara unidireccional y también para generar texto. Existe además el decodificador con prefijo (GLM-130B), con atención bidireccional sobre el prefijo y unidireccional sobre lo generado.

### ¿Qué objetivos de preentrenamiento no supervisado se usan y en qué se diferencian?
El modelado de lenguaje maximiza $\sum_j \log p(x_j \mid x_{<j})$. El autocodificador de eliminación de ruido (DAE) corrompe parte de los símbolos y maximiza la log-verosimilitud de los corrompidos dado el texto dañado. Sus variantes son el estilo BERT (máscara y sustitución aleatoria), la reordenación (deshuffling), el estilo MASS (tramos enmascarados) y la corrupción de tramos de T5 (el decodificador produce solo los tramos eliminados, cada uno precedido de un símbolo centinela).

### ¿Qué estrategias de decodificación se usan con los LLM además de voraz y haz?
Muestreo aleatorio según la distribución, para dar diversidad. Top-$k$, que muestrea entre los $k$ símbolos más probables. Top-$p$, que muestrea entre los símbolos que acumulan masa de probabilidad $p$. Y muestreo $\eta$, búsqueda contrastiva y muestreo típico. La búsqueda voraz y la búsqueda en haz con penalización por longitud completan la lista y son las que se usan en tareas condicionales como traducir.

### ¿Cómo se configura típicamente la optimización del preentrenamiento de un LLM?
Lotes muy grandes (unos 4 millones de símbolos) con un calendario que los aumenta, calentamiento lineal de la tasa de aprendizaje durante el 0,1 % a 0,5 % de los pasos hasta un valor entre $5 \cdot 10^{-5}$ y $1 \cdot 10^{-4}$, y decaimiento en coseno hasta cerca del 10 % del máximo. Los optimizadores habituales son Adam, AdamW y Adafactor.

### ¿Qué es el ajuste por instrucciones (instruction tuning) y qué efecto tiene en traducción?
Ajustar un LLM preentrenado con ejemplos escritos como instrucciones: descripción de la tarea, demostraciones opcionales, entrada opcional y salida. Mejora la generalización a tareas nuevas, incluso en otro idioma, y un modelo pequeño ajustado puede superar a uno mayor sin ajustar. Quitar la descripción de la tarea baja mucho el rendimiento.

### ¿Qué busca el ajuste de alineamiento (alignment tuning) y cómo se hace?
Alinear la salida con las preferencias humanas (ser útil, honesto e inofensivo) para evitar información falsa, objetivos erróneos y contenido dañino o sesgado. Requiere feedback humano (rankings de salidas, preguntas con varias opciones o grado de cumplimiento de reglas), y se aplica sobre todo con aprendizaje por refuerzo con feedback humano (RLHF) basado en PPO.

### ¿Qué cuatro métodos de ajuste eficiente en parámetros (PEFT) existen?
Adaptadores (una red de dos capas con cuello de botella tras la atención o la feed-forward), prefix tuning (vectores de prefijo entrenables antepuestos a claves y valores de cada capa de atención), prompt tuning (vectores entrenables antepuestos a la entrada) y LoRA (matrices de bajo rango sumadas a los pesos). La biblioteca PEFT implementa prefix tuning, P-Tuning, prompt tuning y LoRA o AdaLoRA (la diapositiva no cita los adaptadores).

### Problema: muestreo top-$k$ y top-$p$
Un modelo da probabilidades $(0{,}40;\ 0{,}30;\ 0{,}15;\ 0{,}10;\ 0{,}05)$ a cinco símbolos. Calcula la distribución de muestreo con $k = 2$ y con $p = 0{,}8$.
#### Paso 1
Top-$k$ con $k = 2$: se quedan $0{,}40$ y $0{,}30$, con suma $0{,}70$. Se renormaliza: $(0{,}571;\ 0{,}429)$.
#### Paso 2
Top-$p$ con $p = 0{,}8$: las probabilidades acumuladas son $0{,}40$, $0{,}70$ y $0{,}85$. Se necesitan tres símbolos para llegar a $0{,}8$.
#### Paso 3
Se renormaliza entre los tres: $(0{,}40;\ 0{,}30;\ 0{,}15)/0{,}85 = (0{,}471;\ 0{,}353;\ 0{,}176)$. Con una distribución más concentrada, top-$p$ dejaría menos símbolos, y con una más plana, más.

## 3.5 Ajuste fino, eficiencia de parámetros y alineamiento

### ¿Qué limitaciones tiene un LLM base con ICL y cómo se resuelven con ajuste fino supervisado (SFT)?
Un LLM sin ajustar tiene alta varianza, charla de más y cambia de estilo, y le cuesta respetar la terminología, los idiomas de pocos recursos y el formato. El ajuste fino supervisado con pares de traducción lo convierte en un motor especializado más determinista y preciso.

### ¿Qué dos opciones hay para adaptar un LLM y cuál es el riesgo de la primera?
El ajuste completo actualiza todos los pesos, es muy costoso y puede causar olvido catastrófico (catastrophic forgetting) del conocimiento general. El ajuste eficiente (PEFT) congela los pesos base $W_0$ y entrena módulos auxiliares pequeños o matrices de bajo rango.

### ¿Cómo se parametriza la actualización de LoRA?
Los pesos $W_0 \in \mathbb{R}^{d \times k}$ quedan congelados y la actualización se factoriza en dos matrices de bajo rango:

$$h = W_0 x + \tfrac{\alpha}{r} B A x, \qquad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll \min(d, k)$$

El rango $r$ suele ser 8, 16 o 32.

### ¿Qué ventajas de eficiencia da LoRA?
Reduce los parámetros entrenables en más de un 99 %. No añade latencia de inferencia porque $\Delta W = BA$ se puede fusionar en los pesos base antes del despliegue.

### ¿Qué aporta QLoRA frente a LoRA?
Cuantiza los pesos base $W_0$ a 4 bits con el formato NormalFloat (NF4), comprime también las constantes de cuantización (doble cuantización) y usa optimizadores paginados para evitar picos de memoria en la retropropagación. Permite ajustar un LLM de 70 mil millones de parámetros en una sola GPU (la diapositiva dice «de consumo», pero solo los pesos en 4 bits ocupan 35 GB, de modo que hace falta una GPU de 48 GB).

### ¿Por qué la entropía cruzada no basta para alinear con la calidad de traducción?
Porque optimiza la coincidencia exacta del símbolo, de modo que penaliza igual una paráfrasis válida (por ejemplo, «accord» por «agreement») que una mala traducción. Se necesitan objetivos que optimicen preferencias a nivel de secuencia, como la optimización directa de preferencias (DPO), la optimización contrastiva de preferencias (CPO) y la de Kahneman y Tversky (KTO).

### ¿Qué hace la optimización directa de preferencias (DPO) en traducción?
Reformula el aprendizaje por refuerzo de forma directa sobre la política del LLM, sin entrenar un modelo de recompensa:

$$\mathcal{L}_{DPO} = -\mathbb{E}\left[\log \sigma\!\left(\beta \log\frac{\pi_\theta(y_w \mid x)}{\pi_{ref}(y_w \mid x)} - \beta \log\frac{\pi_\theta(y_l \mid x)}{\pi_{ref}(y_l \mid x)}\right)\right]$$

Aquí $y_w$ es la traducción preferida (la referencia o la de mejor COMET) e $y_l$ la rechazada (por ejemplo, una alucinación). Además, $x$ es la frase origen, $\pi_{ref}$ el modelo de referencia congelado (el modelo antes de este ajuste) y $\beta$ controla cuánto puede alejarse la política de la referencia.

### Problema: parámetros entrenables de LoRA frente al ajuste completo
Una matriz $W_0$ es de $1024 \times 4096$. Calcula sus parámetros, los de LoRA con $r = 8$ y el porcentaje de reducción.
#### Paso 1
$W_0$ tiene $1024 \cdot 4096 = 4.194.304$ parámetros.
#### Paso 2
$B$ es de $1024 \times 8$ y $A$ de $8 \times 4096$, de modo que LoRA entrena $8\,(1024 + 4096) = 40.960$.
#### Paso 3
Fracción: $40.960 / 4.194.304 = 0{,}98\%$. La reducción es del $99{,}02\%$, coherente con el «más del 99 %» de la clase. Tras el entrenamiento se calcula $W_0 + \tfrac{\alpha}{r} BA$ y no queda coste extra de inferencia.

### Problema: pérdida de DPO con datos pequeños
Con $\beta = 0{,}5$, la política da $\pi_\theta(y_w \mid x) = 0{,}30$ y $\pi_\theta(y_l \mid x) = 0{,}10$, y el modelo de referencia da $0{,}20$ a las dos. Calcula la pérdida de DPO.
#### Paso 1
Razones logarítmicas: $\ln(0{,}30/0{,}20) = 0{,}405$ para $y_w$ y $\ln(0{,}10/0{,}20) = -0{,}693$ para $y_l$.
#### Paso 2
El argumento del sigmoide es $\beta\,(0{,}405 - (-0{,}693)) = 0{,}5 \cdot 1{,}099 = 0{,}549$ y $\sigma(0{,}549) = 0{,}634$.
#### Paso 3
$$\mathcal{L}_{DPO} = -\ln 0{,}634 = 0{,}456$$

La pérdida baja si la política sube la probabilidad de $y_w$ o baja la de $y_l$ respecto a la referencia. Con $\pi_\theta = \pi_{ref}$ el argumento es 0, el sigmoide vale $0{,}5$ y la pérdida es $\ln 2 = 0{,}693$.
