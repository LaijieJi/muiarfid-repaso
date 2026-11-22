# RNA U3 - Transformer

## 1. Introduction

### ¿Qué dos bloques grandes forman el Transformer original?
Un codificador (encoder), que convierte la secuencia de entrada en una secuencia de vectores, y un decodificador (decoder), que genera la secuencia de salida consultando al codificador. Ambos son pilas de $N$ capas idénticas.

## 2. Architecture

### ¿Qué valores de hiperparámetros usa el artículo original?
$d_{model} = 512$, $N = 6$ capas en codificador y en decodificador, $h = 8$ cabezas de atención y probabilidad de dropout $P_{drop} = 0{,}1$.

### ¿Qué tamaño tiene la capa oculta de la red feed-forward de cada capa?
$d_{ff} = 4\, d_{model}$. En el modelo de juguete de clase con $d_{model} = 2$ la capa oculta tiene 8 neuronas, y en el original con $d_{model} = 512$ tiene 2048.

## 3. Neural Machine Translation

### ¿Qué hace el generador al final del modelo?
Aplica una transformación lineal sin sesgo de $d_{model}$ a $|V|$ (tamaño del vocabulario de salida) sobre el vector del decodificador, y después un log-softmax. El resultado es el log de la probabilidad de cada token como siguiente token.

### ¿Cómo genera el Transformer una traducción token a token en inferencia?
Codifica la entrada una sola vez (la salida del codificador se llama memory). Después parte de una salida con un solo token, el 0, y repite: decodifica toda la salida generada hasta ahora con máscara causal, aplica el generador al último vector, elige el token (por ejemplo, el de mayor probabilidad) y lo añade a la salida.

### Problema: del vector del decodificador al siguiente token
El decodificador entrega, en la última posición, el vector $h = (1, -1)$ con $d_{model} = 2$. El generador tiene un vocabulario de 3 tokens y matriz de pesos (una fila por token) $W_g = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix}$. Calcula las probabilidades, el log-softmax y el token elegido por la regla greedy.
#### Paso 1
Cada logit es el producto escalar de $h$ con una fila de $W_g$ (sin sesgo):

$$z = W_g h = (1\cdot 1 + 0\cdot(-1),\; 0\cdot 1 + 1\cdot(-1),\; 1\cdot 1 + 1\cdot(-1)) = (1, -1, 0)$$

#### Paso 2
Softmax. Los exponenciales son $e^{1} = 2{,}7183$, $e^{-1} = 0{,}3679$ y $e^{0} = 1$, con suma $4{,}0862$:

$$p = (0{,}6652,\; 0{,}0900,\; 0{,}2447)$$

#### Paso 3
El log-softmax es $\log p = (-0{,}4076,\; -2{,}4076,\; -1{,}4076)$, es decir, $z$ menos $\log 4{,}0862 = 1{,}4076$. La regla greedy elige el token 0, que tiene la mayor probabilidad.

## 4. Positional encoding

### ¿Para qué se añade una codificación posicional al embedding?
La atención compara contenidos y no distingue el orden de los tokens por sí sola. La codificación posicional suma a cada vector una señal que depende de su posición absoluta en la secuencia.

### ¿Cuál es la fórmula de la codificación posicional del Transformer?
Sea $X \in \mathbb{R}^{n \times d_{model}}$ el embedding del texto. Se calcula $PE(X) = X\sqrt{d_{model}} + P$, con la matriz $P$ de posiciones definida por:

$$P_{pos,2i} = \sin\!\left(\frac{pos}{10000^{2i/d_{model}}}\right), \quad P_{pos,2i+1} = \cos\!\left(\frac{pos}{10000^{2i/d_{model}}}\right)$$

### ¿Qué hay que multiplicar antes de sumar la codificación posicional?
El embedding se multiplica por $\sqrt{d_{model}}$. Es un error típico sumar $P$ directamente a $X$ sin escalar.

### Problema: suma la codificación posicional a un embedding
Con $d_{model} = 4$, el embedding de dos tokens es $X = \begin{pmatrix} 0{,}25 & -0{,}5 & 0{,}5 & 0 \\ 0 & 0{,}5 & -0{,}25 & 0{,}75 \end{pmatrix}$. Calcula $PE(X)$.
#### Paso 1
Se escala por $\sqrt{d_{model}} = 2$:

$$X\sqrt{4} = \begin{pmatrix} 0{,}5 & -1 & 1 & 0 \\ 0 & 1 & -0{,}5 & 1{,}5 \end{pmatrix}$$

#### Paso 2
Hay dos pares de columnas. Para $i = 0$ el denominador es $10000^0 = 1$ y para $i = 1$ es $10000^{2/4} = 100$. La fila 0 es $(\sin 0, \cos 0, \sin 0, \cos 0) = (0, 1, 0, 1)$. La fila 1 es $(\sin 1, \cos 1, \sin 0{,}01, \cos 0{,}01) = (0{,}8415,\; 0{,}5403,\; 0{,}0100,\; 1{,}0000)$.
#### Paso 3
Se suman las dos matrices:

$$PE(X) = \begin{pmatrix} 0{,}5 & 0 & 1 & 1 \\ 0{,}8415 & 1{,}5403 & -0{,}4900 & 2{,}5000 \end{pmatrix}$$

## 5. Scaled Dot-Product Attention

### ¿Qué papel tienen las queries, las keys y los values en la atención?
Cada query $q_i$ es un token cuyo valor se quiere predecir. Cada par $(k_j, v_j)$ es una referencia: la key sirve para medir la similitud con la query y el value es la información que aporta. Se asume que los tokens parecidos aportan valores relevantes.

### ¿Qué dimensiones tienen $Q$, $K$ y $V$ en la atención?
$Q, K \in \mathbb{R}^{n \times d_k}$ y $V \in \mathbb{R}^{n \times d_v}$. Queries y keys deben compartir $d_k$ para poder hacer el producto escalar, mientras que $d_v$ puede ser distinta.

### ¿Por qué se divide por $\sqrt{d_k}$ en la atención?
Si $q_i$ y $k_j$ son vectores independientes con distribución $\mathcal{N}(0, I)$, su producto escalar tiene media cero y varianza $d_k$. Dividir por $\sqrt{d_k}$ devuelve la varianza a 1 y evita que el softmax reciba valores enormes y se parezca a un one-hot.

### ¿Cuál es la fórmula de la atención escalada por producto escalar?
$$\mathrm{Attention}(Q, K, V) = \mathrm{Softmax}\!\left(\frac{QK^t}{\sqrt{d_k}}\right) V \in \mathbb{R}^{n \times d_v}$$

### ¿Sobre qué eje se aplica el softmax en la atención?
Sobre cada fila de la matriz de puntuaciones, es decir, sobre las keys de cada query. Cada fila de pesos suma 1, mientras que las columnas no suman nada concreto.

### ¿Qué es la autoatención (self-attention)?
Es el caso en que las queries, las keys y los values salen de la misma secuencia: $\mathrm{SelfAttention}(X) = \mathrm{MultiHead}(X, X, X)$.

### Problema: calcula la atención escalada de tres tokens
Con $d_k = 4$ y $d_v = 2$, sean $Q = K = \begin{pmatrix} 1 & 1 & 0 & 0 \\ 0 & 0 & 1 & 1 \\ 1 & 1 & 1 & 1 \end{pmatrix}$ y $V = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & 1 \end{pmatrix}$. Calcula $\mathrm{Attention}(Q, K, V)$.
#### Paso 1
Puntuaciones $QK^t$ (producto escalar de cada fila de $Q$ con cada fila de $K$, con 4 elementos cada una):

$$QK^t = \begin{pmatrix} 2 & 0 & 2 \\ 0 & 2 & 2 \\ 2 & 2 & 4 \end{pmatrix}$$

#### Paso 2
Se divide por $\sqrt{d_k} = 2$:

$$\frac{QK^t}{2} = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}$$

#### Paso 3
Softmax por filas, con $e^0 = 1$, $e^1 = 2{,}718$ y $e^2 = 7{,}389$. Fila 1: $(2{,}718,\, 1,\, 2{,}718)$ con suma $6{,}437$. Fila 3: $(2{,}718,\, 2{,}718,\, 7{,}389)$ con suma $12{,}825$.

$$W = \begin{pmatrix} 0{,}4223 & 0{,}1554 & 0{,}4223 \\ 0{,}1554 & 0{,}4223 & 0{,}4223 \\ 0{,}2119 & 0{,}2119 & 0{,}5761 \end{pmatrix}$$

#### Paso 4
Se multiplica por $V$. Por ejemplo, la fila 1 es $0{,}4223\,(1,0) + 0{,}1554\,(0,1) + 0{,}4223\,(1,1) = (0{,}8446,\; 0{,}5777)$.

$$WV = \begin{pmatrix} 0{,}8446 & 0{,}5777 \\ 0{,}5777 & 0{,}8446 \\ 0{,}7881 & 0{,}7881 \end{pmatrix}$$

## 6. Multi-head attention

### ¿Qué idea hay detrás de la atención multicabeza?
Se ejecutan $h$ atenciones en paralelo, cada una con sus propias proyecciones lineales de $Q$, $K$ y $V$, y se concatenan sus resultados. Así cada cabeza puede fijarse en relaciones distintas entre tokens.

### ¿Cuál es la fórmula de la atención multicabeza?
$$\mathrm{MultiHead}(Q,K,V) = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)\, W^O$$

con $\mathrm{head}_i = \mathrm{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$.

### ¿Qué dimensión tienen las matrices de proyección de la atención multicabeza?
$W_i^Q, W_i^K \in \mathbb{R}^{d_{model} \times d_k}$, $W_i^V \in \mathbb{R}^{d_{model} \times d_v}$ y $W^O \in \mathbb{R}^{h d_v \times d_{model}}$. La salida es $n \times d_{model}$.

### ¿Cómo se eligen $d_k$ y $d_v$ en el Transformer original?
$d_k = d_v = d_{model}/h$. Con $d_{model} = 512$ y $h = 8$ sale 64. De esta forma la concatenación de las $h$ cabezas tiene $h\, d_v = d_{model}$ columnas.

### Problema: dimensiones de cada tensor en la atención multicabeza
Con $d_{model} = 512$, $h = 8$ y una secuencia de $n = 10$ tokens, calcula la forma de todos los tensores de la autoatención.
#### Paso 1
Entrada: $X \in \mathbb{R}^{10 \times 512}$, con $Q = K = V = X$. Cabeza: $d_k = d_v = 512/8 = 64$.
#### Paso 2
Proyecciones por cabeza: $W_i^Q, W_i^K, W_i^V \in \mathbb{R}^{512 \times 64}$, de modo que $QW_i^Q$, $KW_i^K$ y $VW_i^V$ son $10 \times 64$.
#### Paso 3
Puntuaciones $\frac{(QW_i^Q)(KW_i^K)^t}{\sqrt{64}}$: $(10 \times 64)(64 \times 10) = 10 \times 10$. Los pesos de atención (softmax por filas) tienen también forma $10 \times 10$. La cabeza $\mathrm{head}_i = \mathrm{pesos} \cdot VW_i^V$ es $(10 \times 10)(10 \times 64) = 10 \times 64$.
#### Paso 4
Concatenación de 8 cabezas: $10 \times 512$. Con $W^O \in \mathbb{R}^{512 \times 512}$ la salida es $10 \times 512$, la misma forma que la entrada.

### Problema: calcula una atención de dos cabezas
Con $d_{model} = 4$, $h = 2$ y dos tokens, sea $X = \begin{pmatrix} 1 & 0 & 1 & 1 \\ 1 & 1 & 0 & 1 \end{pmatrix}$. Toma $Q = K = V = X$, las matrices $W^Q_i = W^K_i = W^V_i$ como las porciones de la identidad que seleccionan las columnas de cada cabeza y $W^O = I_4$ (sin sesgos). Calcula la salida.
#### Paso 1
Cada cabeza tiene $d_k = 4/2 = 2$. La cabeza 1 usa las columnas 1 y 2, que son $\begin{pmatrix} 1 & 0 \\ 1 & 1 \end{pmatrix}$. La cabeza 2 usa las columnas 3 y 4, que son $\begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}$.
#### Paso 2
Puntuaciones $QK^t$ de cada cabeza. Cabeza 1: $\begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}$. Cabeza 2: $\begin{pmatrix} 2 & 1 \\ 1 & 1 \end{pmatrix}$. Se divide por $\sqrt{2} = 1{,}4142$.
#### Paso 3
Softmax por filas con las puntuaciones ya divididas por $\sqrt{2}$. Una fila $(a, b)$ da pesos $\mathrm{sigmoid}(a-b)$ y su complementario. En la fila 2 de la cabeza 1, $a - b = (1-2)/\sqrt{2} = -0{,}7071$. Cabeza 1: $\begin{pmatrix} 0{,}5 & 0{,}5 \\ 0{,}3302 & 0{,}6698 \end{pmatrix}$. Cabeza 2: $\begin{pmatrix} 0{,}6698 & 0{,}3302 \\ 0{,}5 & 0{,}5 \end{pmatrix}$.
#### Paso 4
Cada cabeza multiplica sus pesos por sus values. Cabeza 1: $\begin{pmatrix} 1 & 0{,}5 \\ 1 & 0{,}6698 \end{pmatrix}$. Cabeza 2: $\begin{pmatrix} 0{,}6698 & 1 \\ 0{,}5 & 1 \end{pmatrix}$.
#### Paso 5
Se concatenan por columnas y, como $W^O = I_4$, ya es la salida:

$$\mathrm{MultiHead} = \begin{pmatrix} 1 & 0{,}5 & 0{,}6698 & 1 \\ 1 & 0{,}6698 & 0{,}5 & 1 \end{pmatrix}$$

## 7. Residual connections

### ¿Qué hace una conexión residual (Add)?
Suma la entrada de una capa a su salida: $\mathrm{Add}(X, \mathrm{Layer}(X)) = X + \mathrm{Layer}(X)$. Se usa para facilitar el entrenamiento de modelos muy profundos. (Complemento: el atajo deja pasar el gradiente sin atenuarlo, porque la derivada de $X+\mathrm{Layer}(X)$ respecto a $X$ es $I+\partial\,\mathrm{Layer}/\partial X$, y por eso reduce su desvanecimiento en redes profundas. T03 solo habla de facilitar el entrenamiento.)

### ¿Qué condición de forma impone una conexión residual?
La entrada y la salida de la subcapa deben tener la misma forma, porque se suman elemento a elemento. Por eso todas las subcapas del Transformer devuelven $n \times d_{model}$.

## 10. Position-wise Feed-Forward Networks

### ¿Qué es la red feed-forward por posición (PWFFN)?
Es un MLP de una capa oculta con ReLU, de $\mathbb{R}^{d_{model}}$ a $\mathbb{R}^{d_{model}}$, con $d_{ff} = 4\, d_{model}$ neuronas ocultas. Se aplica por separado a cada vector de la secuencia.

### ¿Cuál es la fórmula de la PWFFN?
$$\mathrm{PWFFN}(X) = \mathrm{ReLU}(X W_1 + \mathbf{1}_n b_1^t)\, W_2 + \mathbf{1}_n b_2^t$$

con $W_1 \in \mathbb{R}^{d_{model} \times d_{ff}}$ y $W_2 \in \mathbb{R}^{d_{ff} \times d_{model}}$.

### ¿Qué significa «por posición» en la PWFFN?
Que cada fila de $X$ (cada token) se transforma de forma independiente con los mismos pesos. La PWFFN no mezcla información entre tokens, y eso lo hace solo la atención.

### Problema: calcula la PWFFN de un token
Con $d_{model} = 2$ y, para simplificar, $d_{ff} = 4$ en vez de 8, el token es $x = (1, -1)$ y $W_1 = \begin{pmatrix} 1 & 0 & -1 & 2 \\ 0 & 1 & 1 & -1 \end{pmatrix}$, $b_1 = (0, -1, 0, 1)$, $W_2 = \begin{pmatrix} 1 & 0 \\ 0 & 1 \\ 1 & -1 \\ 2 & 0 \end{pmatrix}$, $b_2 = (0{,}5, -0{,}5)$. Calcula $\mathrm{PWFFN}(x)$.
#### Paso 1
Primera capa: $xW_1 = (1, -1, -2, 3)$. Sumando $b_1$ se obtiene $(1, -2, -2, 4)$.
#### Paso 2
ReLU deja los positivos y anula los negativos: $(1, 0, 0, 4)$.
#### Paso 3
Segunda capa: $(1, 0, 0, 4) W_2 = 1\cdot(1,0) + 4\cdot(2,0) = (9, 0)$. Sumando $b_2$ queda $(9{,}5,\; -0{,}5)$.

## 11. Encoder

### ¿Qué subcapas tiene una capa del codificador?
Dos: autoatención multicabeza y PWFFN. Cada una va con una conexión residual, un LayerNorm y un dropout.

### ¿Qué hace LayerNorm en el Transformer?
Normaliza cada vector de la secuencia (cada token) por separado, a lo largo de $d_{model}$. En los ejemplos de clase, con $d_{model} = 2$, cada fila sale como $(-0{,}7071,\; 0{,}7071)$ o su opuesta.

### Problema: cuenta los parámetros de una capa del codificador
Con $d_{model} = 4$, $h = 2$ y $d_{ff} = 4\, d_{model} = 16$, y con sesgos en todas las capas lineales, calcula los parámetros de una capa del codificador sin contar LayerNorm.
#### Paso 1
Una capa lineal $a \to b$ con sesgo tiene $ab + b$ parámetros. En la atención hay cuatro capas $4 \to 4$ (proyecciones $Q$, $K$, $V$ y de salida):

$$4\,(4\cdot 4 + 4) = 80$$

Este valor no depende del número de cabezas $h$, porque las $h$ cabezas se reparten las mismas matrices $d_{model} \times d_{model}$. Tampoco depende de la longitud $n$ de la secuencia.
#### Paso 2
La PWFFN tiene una capa $4 \to 16$ y otra $16 \to 4$:

$$(4\cdot 16 + 16) + (16\cdot 4 + 4) = 80 + 68 = 148$$

#### Paso 3
Total de una capa del codificador:

$$80 + 148 = 228$$

#### Paso 4
Con la fórmula general, la atención da $4(d_{model}^2 + d_{model})$ y la PWFFN $2\, d_{model} d_{ff} + d_{ff} + d_{model}$. Con $d_{model} = 512$ y $d_{ff} = 2048$ son $1\,050\,624$ y $2\,099\,712$, es decir, $3\,150\,336$ parámetros por capa.

## 12. Decoder

### ¿Qué es la atención cruzada (cross-attention)?
Es la atención en que las queries vienen del decodificador y las keys y values vienen del codificador: $\mathrm{CrossAttention}(X, Y) = \mathrm{MultiHead}(Y, X, X)$, con $X$ la salida del codificador y $Y$ la salida parcial.

### ¿Qué subcapas tiene una capa del decodificador?
Tres: autoatención con máscara causal sobre la salida, atención cruzada con la salida del codificador y PWFFN. Cada una va con LayerNorm, dropout y conexión residual.

### ¿Cómo se aplica la máscara a las puntuaciones antes del softmax?
Las puntuaciones de las posiciones prohibidas se sustituyen por $-\infty$, de modo que tras el softmax su peso es 0 y cada fila sigue sumando 1. Multiplicar la puntuación por $M$ es un error, porque un 0 no anula el peso: $e^0 = 1$ sigue aportando. (Aclaración propia, no está en las transparencias.)

### ¿Qué es la máscara causal y por qué se necesita?
Es una máscara triangular inferior: el token $i$ solo puede atender a las posiciones $j \le i$. Cancela el peso de los tokens que aún no se han generado, así que el modelo no ve el futuro y mantiene la propiedad autorregresiva.

### Problema: aplica la máscara causal a la atención
Con los mismos $Q$, $K$ y $V$ del problema de la atención escalada de tres tokens, usa la máscara causal y calcula los pesos y la salida.
#### Paso 1
Las puntuaciones escaladas eran $\begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}$. La máscara causal permite $j \le i$:

$$M = \begin{pmatrix} 1 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 1 & 1 \end{pmatrix}$$

#### Paso 2
Las puntuaciones de las posiciones prohibidas se sustituyen por $-\infty$ antes del softmax, de modo que su peso es 0 y cada fila reparte su peso solo entre las posiciones permitidas. Fila 1: $(1, -\infty, -\infty)$ da peso $(1, 0, 0)$. Fila 2: $(0, 1, -\infty)$ con $e^0 = 1$ y $e^1 = 2{,}718$ da $(0{,}2689,\; 0{,}7311,\; 0)$. Fila 3: no cambia, $(0{,}2119,\; 0{,}2119,\; 0{,}5761)$.

$$W = \begin{pmatrix} 1 & 0 & 0 \\ 0{,}2689 & 0{,}7311 & 0 \\ 0{,}2119 & 0{,}2119 & 0{,}5761 \end{pmatrix}$$

#### Paso 3
Con $V$ del problema original: la fila 1 es $(1, 0)$ y la fila 2 es $0{,}2689\,(1,0) + 0{,}7311\,(0,1) = (0{,}2689,\; 0{,}7311)$. La fila 3 no cambia respecto a la atención sin máscara.

$$WV = \begin{pmatrix} 1 & 0 \\ 0{,}2689 & 0{,}7311 \\ 0{,}7881 & 0{,}7881 \end{pmatrix}$$

#### Paso 4
Comprobación: la salida del token 1 y la del token 2 no dependen de los tokens posteriores. Cambiar $V_3$ no las modifica.

### Problema: dimensiones de la atención cruzada
El decodificador lleva $m = 2$ tokens y la entrada tiene $n = 5$, con $d_{model} = 4$ y $h = 2$. Calcula la forma de los tensores de la atención cruzada.
#### Paso 1
$Y \in \mathbb{R}^{2 \times 4}$ (salida parcial) y $X \in \mathbb{R}^{5 \times 4}$ (salida del codificador). Por cabeza, $d_k = d_v = 4/2 = 2$.
#### Paso 2
$Q_i = Y W_i^Q$ es $2 \times 2$, $K_i = X W_i^K$ es $5 \times 2$ y $V_i = X W_i^V$ es $5 \times 2$.
#### Paso 3
Puntuaciones $Q_i K_i^t$: $(2 \times 2)(2 \times 5) = 2 \times 5$. Los pesos tienen la misma forma, y cada fila suma 1. La cabeza es $(2 \times 5)(5 \times 2) = 2 \times 2$.
#### Paso 4
Concatenación $2 \times 4$ y $W^O \in \mathbb{R}^{4 \times 4}$ dan una salida $2 \times 4$. Solo la longitud del decodificador ($m$) aparece en la salida, y la de la entrada ($n$) desaparece al multiplicar por $V_i$.

## 13. Transformer

### ¿Qué es el atado de pesos (weight tying) en el Transformer?
La matriz de la proyección final del generador se comparte con la matriz de embedding de la salida (y, si los vocabularios coinciden, también con la de la entrada). Reduce los parámetros y exige que el generador no tenga sesgo.

### Problema: cuenta los parámetros del modelo de juguete
El modelo de clase tiene `src_vocab_size = 3`, `tgt_vocab_size = 3`, $d_{model} = 2$, $N = 1$ capa, $h = 1$ y $d_{ff} = 8$. El generador comparte los pesos con el embedding de salida. Cuenta los parámetros sin LayerNorm.
#### Paso 1
Embeddings: el de entrada tiene $3 \times 2 = 6$ y el de salida otros $6$. El generador no añade nada porque comparte el del decodificador. Total: $12$.
#### Paso 2
Capa del codificador: atención $4(2\cdot 2 + 2) = 24$ y PWFFN $(2\cdot 8 + 8) + (8\cdot 2 + 2) = 24 + 18 = 42$. Total: $66$.
#### Paso 3
Capa del decodificador: autoatención $24$, atención cruzada $24$ y PWFFN $42$. Total: $90$.
#### Paso 4
Suma: $12 + 66 + 90 = 168$ parámetros, sin contar los LayerNorm.

## 14. Training

### ¿Por qué se entrena en paralelo todas las posiciones del decodificador?
Porque se le da al decodificador la salida correcta completa (teacher forcing) y la máscara causal impide que cada posición vea las siguientes. Una sola pasada calcula así las predicciones de todos los tokens.

### ¿En qué consiste el suavizado de etiquetas (label smoothing)?
Sustituye el objetivo one-hot $y$ por $\tilde{y} = (1-\epsilon)\, y + \epsilon \frac{1}{C} \mathbf{1}_C$, con $C$ clases. En el código de clase $\epsilon = 0{,}1$.

### Problema: calcula la pérdida con suavizado de etiquetas
Con $C = 3$ clases, la predicción es $\hat{y} = (0{,}7,\; 0{,}2,\; 0{,}1)$ y la clase correcta es la 1, $y = (1, 0, 0)$. Calcula $H(\hat{y}, y)$ y $H(\hat{y}, \tilde{y})$ con $\epsilon = 0{,}1$.
#### Paso 1
Sin suavizado, solo cuenta la clase correcta:

$$H(\hat{y}, y) = -\log 0{,}7 = 0{,}3567$$

#### Paso 2
El objetivo suavizado es $\tilde{y} = 0{,}9\,(1, 0, 0) + \frac{0{,}1}{3}(1, 1, 1) = (0{,}9333,\; 0{,}0333,\; 0{,}0333)$.
#### Paso 3
Con $\tilde{y}$:

$$H(\hat{y}, \tilde{y}) = 0{,}9333\cdot 0{,}3567 + 0{,}0333\cdot 1{,}6094 + 0{,}0333\cdot 2{,}3026 = 0{,}4633$$

La pérdida sube porque $\hat{y}$ da poca probabilidad a las clases incorrectas. Se cumple $H(\hat{y}, \tilde{y}) = 0{,}9 \cdot 0{,}3567 + 0{,}1 \cdot 1{,}4229 = 0{,}4633$, donde $1{,}4229$ es la media de $-\log \hat{y}_c$ y es mayor que $0{,}3567$. Con un $\hat{y}$ más repartido, la pérdida podría bajar.

### ¿Qué optimizador se usa para entrenar el Transformer actual?
AdamW, que es Adam con decaimiento de pesos desacoplado. El artículo usó Adam con $\beta_1 = 0{,}9$, $\beta_2 = 0{,}98$ y $\epsilon = 10^{-9}$.

### ¿Cuáles son los pasos de una iteración de AdamW?
Con gradiente $g_i = \nabla_\theta f_i(\theta_{i-1})$: actualiza $m_i = \beta_1 m_{i-1} + (1-\beta_1) g_i$ y $v_i = \beta_2 v_{i-1} + (1-\beta_2) g_i^2$. Corrige el sesgo con $\hat{m}_i = m_i/(1-\beta_1^i)$ y $\hat{v}_i = v_i/(1-\beta_2^i)$. Aplica el decaimiento $\theta \leftarrow \theta - \gamma\lambda\theta$ y, por último, $\theta_i = \theta - \gamma\, \hat{m}_i/(\sqrt{\hat{v}_i} + \epsilon)$.

### Problema: ejecuta la primera iteración de AdamW
Con $\theta_0 = (1, 1)$, gradiente $g_1 = (0{,}5, -2)$, $\gamma = 0{,}1$, $\lambda = 0{,}01$, $\beta_1 = 0{,}9$, $\beta_2 = 0{,}98$ y $\epsilon = 10^{-9}$, calcula $\theta_1$.
#### Paso 1
Momentos: $m_1 = 0{,}1\, g_1 = (0{,}05, -0{,}2)$ y $v_1 = 0{,}02\, g_1^2 = (0{,}005, 0{,}08)$.
#### Paso 2
Corrección de sesgo en la iteración 1: $\hat{m}_1 = m_1 / 0{,}1 = (0{,}5, -2)$ y $\hat{v}_1 = v_1 / 0{,}02 = (0{,}25, 4)$.
#### Paso 3
Decaimiento de pesos: $\theta \leftarrow \theta - \gamma\lambda\theta = (1,1)(1 - 0{,}001) = (0{,}999, 0{,}999)$.
#### Paso 4
Actualización: $\hat{m}_1/(\sqrt{\hat{v}_1} + \epsilon) = (0{,}5/0{,}5,\; -2/2) = (1, -1)$ (el $\epsilon$ no se nota). Por tanto, $\theta_1 = (0{,}999 - 0{,}1,\; 0{,}999 + 0{,}1) = (0{,}899,\; 1{,}099)$. En la primera iteración el paso vale $\gamma$ en cada coordenada, con el signo contrario al del gradiente.

### ¿Cómo es el planificador de tasa de aprendizaje original del Transformer?
Crece linealmente durante `warmup_steps` y luego decrece de forma proporcional a la inversa de la raíz del paso:

$$lrate = d_{model}^{-0{,}5} \min\!\left(step^{-0{,}5},\; step\cdot warmup^{-1{,}5}\right)$$

## 15. Activation functions in PWFFN

### ¿Qué es SiLU?
$\mathrm{SiLU}(a) = a\,\sigma(a)$, con $\sigma$ la sigmoide. Se conoce también como Swish (2017).

### ¿Qué es una unidad lineal con puerta (GLU)?
$\mathrm{GLU}(a, b) = a\,\sigma(b)$, con $b = a w_g + b_g$. Con $w_g = 1$ y $b_g = 0$ es SiLU. La PWFFN con GLU necesita tres matrices: $\mathrm{GLU}(XW_1 + \mathbf{1}_n b_1^t, XW_2 + \mathbf{1}_n b_2^t)W_3 + \mathbf{1}_n b_3^t$.

### ¿Qué es SwiGLU?
Una variante de GLU en que la puerta usa SiLU en lugar de la sigmoide: $\mathrm{SwiGLU}(a, b) = a \cdot \mathrm{SiLU}(b)$, con $b = a w_g + b_g$.

### Problema: calcula GLU y SwiGLU en un punto
Con $a = 2$ y $b = 2$ (puerta ya calculada), calcula $\mathrm{GLU}(a, b)$ y $\mathrm{SwiGLU}(a, b)$.
#### Paso 1
$\sigma(2) = 1/(1 + e^{-2}) = 0{,}8808$.
#### Paso 2
$\mathrm{GLU}(2, 2) = 2\cdot 0{,}8808 = 1{,}7616$.
#### Paso 3
$\mathrm{SiLU}(2) = 2\cdot 0{,}8808 = 1{,}7616$, de modo que $\mathrm{SwiGLU}(2, 2) = 2\cdot 1{,}7616 = 3{,}5232$.

## 16. Attention mechanisms

### ¿Qué es la atención multiconsulta (multi-query)?
Todas las cabezas comparten las mismas proyecciones de $K$ y $V$ ($W^K$ y $W^V$) y solo las de $Q$ son distintas por cabeza. Reduce los parámetros de las proyecciones de $K$ y $V$ en un factor $h$.

### ¿Qué es la atención por grupos de consultas (grouped-query)?
Generaliza la multiconsulta: hay $g$ grupos de proyecciones $W_j^K$ y $W_j^V$, y cada cabeza $i$ usa el grupo $\gamma(i)$. Con $g = 1$ es multiconsulta y con $g = h$ es multicabeza.

### Problema: compara los pesos de $K$ y $V$ en multicabeza, multiconsulta y grupos
Con $d_{model} = 512$, $h = 8$ y $d_k = d_v = 64$, calcula cuántos pesos tienen las proyecciones de $K$ y $V$ (sin sesgos) en multicabeza, multiconsulta y grouped-query con $g = 2$.
#### Paso 1
Cada grupo tiene una $W^K$ y una $W^V$ de $512 \times 64 = 32\,768$ pesos, es decir, $65\,536$ por grupo.
#### Paso 2
Multicabeza ($g = 8$): $8 \cdot 65\,536 = 524\,288$. Multiconsulta ($g = 1$): $65\,536$. Grouped-query ($g = 2$): $2 \cdot 65\,536 = 131\,072$.
#### Paso 3
Las proyecciones de $Q$ ($8 \cdot 32\,768$) y $W^O$ no cambian en ninguno de los tres casos.

## 17. Mixture of experts (MoE)

### ¿Qué es una mezcla de expertos (MoE)?
Un conjunto de $n$ expertos (redes neuronales) $E_k$ y una red de puerta $G$ cuya salida es un vector disperso de dimensión $n$. La salida es $\mathrm{MoE}(x) = \sum_{k=1}^{n} G(x)_k\, E_k(x)$.

### ¿Qué diferencia hay entre la puerta densa y la puerta dispersa?
La densa es $G(x) = \mathrm{Softmax}(xW_G)$, que reparte peso entre todos los expertos. La dispersa con ruido es $G(x) = \mathrm{Softmax}(\mathrm{TopK}(xW_G + \epsilon))$ con $\epsilon \sim \mathcal{N}(0, \mathrm{Softplus}(xW_\epsilon))$, y solo $k$ expertos reciben peso distinto de cero.

### Problema: calcula la salida de una MoE con puerta dispersa
Una MoE tiene 4 expertos. Para cierto $x$, $xW_G = (2, 1, 0, -1)$ (se ignora el ruido) y los expertos dan los escalares $E(x) = (10, 20, 30, 40)$. Calcula la salida con $k = 2$.
#### Paso 1
TopK mantiene los dos mayores, los expertos 1 y 2, y deja a los otros con peso 0.
#### Paso 2
Softmax sobre $(2, 1)$: $e^2 = 7{,}389$ y $e^1 = 2{,}718$ con suma $10{,}107$, de modo que $G(x) = (0{,}7311,\; 0{,}2689,\; 0,\; 0)$.
#### Paso 3
$\mathrm{MoE}(x) = 0{,}7311\cdot 10 + 0{,}2689\cdot 20 = 12{,}689$. Solo se evalúan los expertos 1 y 2, y ahí está el ahorro de cálculo.

## 18. Rotatory Positional Encoding

### ¿Cuál es la fórmula de RoPE?
Para cada par de componentes $(2i, 2i+1)$ de la fila en la posición $pos$:

$$\mathrm{RoPE}\begin{pmatrix} X_{pos,2i} \\ X_{pos,2i+1} \end{pmatrix} = \begin{pmatrix} X_{pos,2i} & X_{pos,2i+1} \end{pmatrix}\begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix}, \quad \theta_{pos,i} = \frac{pos}{10000^{2i/d_{model}}}$$

### ¿Qué ventaja tiene RoPE sobre la codificación posicional absoluta?
La puntuación de atención depende directamente de la posición relativa entre query y key. Sea $q$ la query sin rotar y $R(pos)$ la matriz de rotaciones por bloques. La puntuación entre la query en la posición $pos$ y la key en $pos + j$ es $(R(pos)\,q)^t R(pos+j)\,k = q^t R(-pos) R(pos+j) k = q^t R(j) k$, que solo depende de $j$.

### Problema: aplica RoPE a un vector en varias posiciones
Con $d_{model} = 4$ y el mismo vector $x = (1, 0, 1, 0)$ en las posiciones 0, 1 y 2, calcula $\mathrm{RoPE}(x)$ en cada una.
#### Paso 1
Hay dos pares. Los ángulos son $\theta_{pos,0} = pos/10000^0 = pos$ y $\theta_{pos,1} = pos/10000^{2/4} = pos/100$.
#### Paso 2
Con la fórmula de fila por matriz, el par $(a, b)$ pasa a $(a\cos\theta + b\sin\theta,\; -a\sin\theta + b\cos\theta)$. Para $(1, 0)$ queda $(\cos\theta, -\sin\theta)$.
#### Paso 3
Posición 0: los ángulos son 0 y 0, así que $x$ queda $(1, 0, 1, 0)$. Posición 1: $\theta = 1$ y $0{,}01$, que dan $(0{,}5403,\; -0{,}8415,\; 1{,}0000,\; -0{,}0100)$.
#### Paso 4
Posición 2: $\theta = 2$ y $0{,}02$, que dan $(-0{,}4161,\; -0{,}9093,\; 0{,}9998,\; -0{,}0200)$. Los pares de frecuencia baja giran poco entre posiciones vecinas.
