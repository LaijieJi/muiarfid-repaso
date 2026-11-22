# RNA U4 - Introducción a los LLM

## 2. Background

### ¿Cómo aproxima un modelo de $n$-gramas la probabilidad de una secuencia?
Aplica la regla de la cadena y supone que cada palabra solo depende de las $n-1$ anteriores (hipótesis markoviana de orden $n-1$):

$$p(x_{1:N}) = \prod_i p(x_i \mid x_{1:i-1}) \approx \prod_i p(x_i \mid x_{i-(n-1):i-1})$$

### ¿Cómo se factoriza $p(x_{1:N})$ con un modelo de unigramas, de bigramas y de trigramas?
Unigrama: $p(x_1)\,p(x_2)\cdots p(x_N)$. Bigrama: $p(x_1)\,p(x_2 \mid x_1)\cdots p(x_N \mid x_{N-1})$. Trigrama: $p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2)\cdots p(x_N \mid x_{N-2}, x_{N-1})$.

### ¿Para qué sirven los símbolos de inicio y de fin en un modelo de $n$-gramas?
Se añaden $n-1$ símbolos `<s>` al principio para poder modelar las primeras palabras de la frase. El símbolo `</s>` al final hace que el modelo asigne probabilidad a que la frase termine, de modo que suma uno sobre todas las frases.

### ¿Cuál es la fórmula de la perplejidad (perplexity) de una secuencia?
Es la inversa de la media geométrica de la probabilidad por palabra:

$$\text{PPL}(x_{1:N}) = p(x_{1:N})^{-1/N} = \left(\prod_i p(x_i \mid x_{i-(n-1):i-1})\right)^{-1/N} \geq 1$$

En el recuento de $N$ se incluye el símbolo `</s>`.

### ¿Cómo se interpreta la perplejidad de un modelo de lenguaje?
Como el factor de ramificación medio, es decir, el número medio de palabras que podrían seguir a otra según el modelo. Una perplejidad menor indica un modelo menos sorprendido por el texto.

### ¿Qué relación hay entre la entropía por palabra y la perplejidad?
La entropía por palabra es la media aritmética de $-\log p(x_i \mid \cdot)$, y coincide con el logaritmo de la perplejidad:

$$H(x_{1:N}) = -\frac{1}{N}\sum_i \log p(x_i \mid \cdot) = \log \text{PPL}(x_{1:N})$$

Con $\log_2$ se mide en bits y con $\ln$ en nats.

### ¿Qué perplejidad y qué entropía tiene un modelo uniforme sobre $V$ palabras?
El que reparte la probabilidad por igual entre las $V$ palabras del vocabulario. Su perplejidad es $V$ aunque cambie la longitud $N$, y su entropía es $\log V$, que son los nats (o bits con $\log_2$) de información extra que necesita para determinar cada palabra. Es la perplejidad de un modelo que no sabe nada del texto, la referencia con la que se comparan los demás.

### ¿Cuál es el problema de la dimensionalidad de los modelos de $n$-gramas?
El número de parámetros crece como $V^n$. Con $V = 100\,000$ y $n = 10$ hacen falta del orden de $10^{50}$ parámetros, por lo que en la práctica no se puede pasar de los trigramas.

### ¿Cómo codifica la entrada el modelo de lenguaje neuronal feed-forward de 2003 (FNN LM)?
La entrada $X \in \{0,1\}^{(n-1) \times V}$ apila las codificaciones one-hot de las $n-1$ palabras previas, una por fila. Una primera capa de embeddings de palabras la transforma de manera afín:

$$WE(X) = X W_1 + \mathbf{1}_{n-1}\, b_1^t, \qquad W_1 \in \mathbb{R}^{V \times d_{model}},\ b_1 \in \mathbb{R}^{d_{model}}$$

### ¿Qué hace la capa oculta del FNN LM?
Aplana los embeddings con $\text{vec}$, que convierte una matriz en un vector fila por filas, y aplica una tangente hiperbólica:

$$\text{FFN}(X) = \tanh(\text{vec}(WE(X))\, W_2 + b_2^t), \qquad W_2 \in \mathbb{R}^{(n-1)d_{model} \times d_{ff}}$$

### ¿Cómo calcula el FNN LM la distribución de la siguiente palabra?
Con un softmax sobre una capa afín que suma la salida de la FFN y una conexión directa desde los embeddings:

$$p(x_i \mid x_{i-(n-1):i-1}) = \text{Softmax}(\text{FFN}(X) W_3 + \text{vec}(WE(X)) W_4 + b^t)$$

con $W_3 \in \mathbb{R}^{d_{ff} \times V}$, $W_4 \in \mathbb{R}^{(n-1)d_{model} \times V}$ y $b \in \mathbb{R}^V$.

### Problema: calcula la perplejidad y la entropía de una frase con un modelo de bigramas
Un modelo de bigramas tiene $p(a \mid \langle s\rangle) = 0{,}6$ y $p(b \mid \langle s\rangle) = 0{,}4$. Tras $a$: $p(a \mid a) = 0{,}5$, $p(b \mid a) = 0{,}3$ y $p(\langle /s\rangle \mid a) = 0{,}2$. Tras $b$: $p(a \mid b) = 0{,}25$, $p(b \mid b) = 0{,}25$ y $p(\langle /s\rangle \mid b) = 0{,}5$. Calcula la perplejidad y la entropía en bits de la frase $b\,a\,b$. Cuenta el símbolo final $\langle /s\rangle$ en $N$.
#### Paso 1
La frase con símbolo final es $b\,a\,b\,\langle /s\rangle$, así que $N = 4$. La probabilidad es el producto de bigramas:

$$p = p(b \mid \langle s\rangle)\,p(a \mid b)\,p(b \mid a)\,p(\langle /s\rangle \mid b) = 0{,}4 \cdot 0{,}25 \cdot 0{,}3 \cdot 0{,}5 = 0{,}015$$
#### Paso 2
La perplejidad es $\text{PPL} = 0{,}015^{-1/4} \approx 2{,}857$. Se interpreta como un factor de ramificación medio de unas 2,9 palabras posibles por posición.
#### Paso 3
La entropía en bits es $H = \log_2 2{,}857 \approx 1{,}515$. Comprobación con las probabilidades por palabra: $(1{,}322 + 2 + 1{,}737 + 1)/4 = 6{,}059/4 \approx 1{,}515$ bits.

### Problema: cuenta los parámetros de un FNN LM pequeño
Un FNN LM tiene vocabulario $V = 10$, contexto de $n-1 = 2$ palabras, $d_{model} = 4$ y $d_{ff} = 5$. Calcula la forma de cada matriz y el número total de parámetros.
#### Paso 1
La entrada $X$ es $2 \times 10$ y $WE(X)$ es $2 \times 4$. Tras $\text{vec}$ queda un vector de $2 \cdot 4 = 8$ componentes. Capa de embeddings: $W_1 \in \mathbb{R}^{10 \times 4}$ tiene 40 parámetros y $b_1$ tiene 4, en total 44.
#### Paso 2
Capa oculta: $W_2 \in \mathbb{R}^{8 \times 5}$ tiene 40 parámetros y $b_2$ tiene 5, en total 45.
#### Paso 3
Capa de salida: $W_3 \in \mathbb{R}^{5 \times 10}$ tiene 50, $W_4 \in \mathbb{R}^{8 \times 10}$ tiene 80 y $b$ tiene 10, en total 140.
#### Paso 4
El total es $44 + 45 + 140 = 229$ parámetros. Un modelo de trigramas con el mismo vocabulario necesitaría una tabla de $V^3 = 1000$ probabilidades, y la diferencia se dispara al crecer $V$ y el contexto.

## 3. GPT, BERT, T5 y ChatGPT

### ¿Qué arquitectura de Transformer usan GPT, BERT y T5?
GPT usa solo decodificador (decoder-only), BERT solo codificador (encoder-only) y T5 codificador y decodificador (encoder-decoder).

| Modelo | Origen | Arquitectura | Preentrenamiento |
|---|---|---|---|
| GPT-1 | OpenAI, 2018 | solo decodificador | predecir el siguiente token en secuencias largas |
| BERT | Google, 2018 | solo codificador | masked LM y next sentence prediction |
| T5 | Google, 2019 | codificador y decodificador | masked LM |

### ¿Con qué dos tareas se preentrena BERT?
Con el modelo de lenguaje enmascarado (masked LM, MLM) y la predicción de la siguiente frase (next sentence prediction, NSP).

### ¿Qué es el aprendizaje en contexto (in-context learning) de GPT-3?
Es adaptar el modelo a una tarea poniendo en el prompt cero, uno o varios ejemplos (zero-shot, one-shot, few-shot) sin actualizar los pesos. Sustituye al ajuste fino.

### ¿Qué dice la ley de potencias de la pérdida de validación en función del cómputo?
Que la pérdida cae como una ley de potencias del cómputo $C$, medido en PetaFLOP/s-días: $L = 2{,}57 \cdot C^{-0{,}048}$. En una gráfica log-log es una recta de pendiente $-0{,}048$.

### ¿Por qué el coste de entrenar un modelo es de unos 6 FLOP por parámetro y por token?
Una pasada hacia delante cuesta 2 FLOP por parámetro activo y la pasada hacia atrás cuesta el doble que la de ida. Así el entrenamiento completo es $2 \cdot 3 = 6$ FLOP por parámetro y por token, y el cómputo total es $C \approx 6\,N\,D$ con $N$ parámetros y $D$ tokens.

### ¿Qué tres pasos tiene el alineamiento de InstructGPT?
1. Ajuste supervisado (SFT) del modelo con demostraciones de un anotador. 2. Entrenamiento de un modelo de recompensa (RM) con comparaciones. 3. Optimización de la política con aprendizaje por refuerzo (RL) y PPO, usando la recompensa del RM.

### Problema: calcula el cómputo de entrenamiento de GPT-3 175B
El modelo tiene $N = 175 \cdot 10^9$ parámetros y se entrena con $D = 300 \cdot 10^9$ tokens. Usa 6 FLOP por parámetro y por token. Calcula los FLOP totales, los PetaFLOP/s-días y los días que tardaría un clúster que sostuviera $10^{17}$ FLOP/s en total.
#### Paso 1
$C = 6 \cdot 175 \cdot 10^9 \cdot 300 \cdot 10^9 = 3{,}15 \cdot 10^{23}$ FLOP, que se acerca al valor de la tabla del modelo, $3{,}14 \cdot 10^{23}$, calculado con 174,6B parámetros.
#### Paso 2
Un PetaFLOP/s-día son $10^{15} \cdot 86\,400 = 8{,}64 \cdot 10^{19}$ FLOP. Por tanto $C = 3{,}15 \cdot 10^{23} / 8{,}64 \cdot 10^{19} \approx 3646$ PetaFLOP/s-días. La tabla da $3{,}64 \cdot 10^3$ porque usa 174,6B parámetros: $6 \cdot 174{,}6 \cdot 10^9 \cdot 300 \cdot 10^9 = 3{,}14 \cdot 10^{23}$.
#### Paso 3
Con $10^{17}$ FLOP/s sostenidos hacen falta $3{,}15 \cdot 10^{23} / 10^{17} = 3{,}15 \cdot 10^6$ segundos, es decir, $3{,}15 \cdot 10^6 / 86\,400 \approx 36{,}5$ días.

### Problema: estima los parámetros de GPT-3 175B a partir de su tabla
Con 96 capas y $d_{model} = 12\,288$, estima el número de parámetros de las capas del Transformer. Asume, como en el Transformer original, que $d_{ff} = 4\,d_{model}$ y que $h \cdot d_{head} = d_{model}$, y no cuentes sesgos ni embeddings.
#### Paso 1
Comprobación de las cabezas: $96 \cdot 128 = 12\,288 = d_{model}$, así que $W_Q, W_K, W_V$ y $W^O$ son cuadradas de $d_{model} \times d_{model}$.
#### Paso 2
Atención: $4\,d_{model}^2$. Red feed-forward con $d_{ff} = 4\,d_{model}$: $2 \cdot d_{model} \cdot 4\,d_{model} = 8\,d_{model}^2$. Una capa tiene $12\,d_{model}^2$ parámetros.
#### Paso 3
Con 96 capas: $12 \cdot 96 \cdot 12\,288^2 = 173\,946\,175\,488 \approx 173{,}9 \cdot 10^9$. La tabla de la transparencia da 174 600 M. La diferencia son sobre todo los embeddings (unos $0{,}64 \cdot 10^9$) y, en mucho menor medida, los sesgos y las normalizaciones.

## 4. Pre-training

### ¿Cómo funciona el algoritmo BPE (byte-pair encoding) para construir el vocabulario?
1. El vocabulario base son los caracteres individuales (en la versión estándar, bytes UTF-8). 2. Se fusiona el par de tokens adyacentes más frecuente en un token nuevo. 3. Se repite el paso 2 hasta alcanzar el tamaño de vocabulario deseado.

### Problema: aprende un vocabulario BPE y tokeniza un texto nuevo
Entrena un BPE con 3 fusiones sobre el texto `ababcabcabc` (vocabulario base `a`, `b`, `c`) y tokeniza después `cabcabab`.
#### Paso 1
Pares adyacentes: `ab` aparece 4 veces, `bc` 3, `ca` 2 y `ba` 1. Fusión 1: `a b` pasa a ser `ab`. El texto queda `ab ab c ab c ab c`.
#### Paso 2
Pares: (`ab`,`c`) aparece 3 veces, (`c`,`ab`) 2 y (`ab`,`ab`) 1. Fusión 2: `ab c` pasa a ser `abc`. El texto queda `ab abc abc abc`.
#### Paso 3
Pares: (`abc`,`abc`) aparece 2 veces y (`ab`,`abc`) 1. Fusión 3: `abc abc` pasa a ser `abcabc`. El texto queda `ab abcabc abc` y el vocabulario tiene $3 + 3 = 6$ tokens.
#### Paso 4
Tokenización de `cabcabab` con las reglas en orden. Caracteres: `c a b c a b a b`. Regla 1: `c ab c ab ab`. Regla 2: `c abc ab ab`. La regla 3 no encuentra dos `abc` seguidos. El resultado es `c abc ab ab`, con 4 tokens.

## 5. Post-training

### ¿En qué se parece y en qué se diferencia el ajuste supervisado (SFT) del preentrenamiento?
El entrenamiento es muy parecido, pero los datos son conversaciones de un dominio concreto y no texto genérico. Se usa para que el modelo converse.

### ¿Qué es el aprendizaje por refuerzo con retroalimentación humana (RLHF)?
Es aprendizaje por refuerzo cuya recompensa la da un modelo de recompensa entrenado con preferencias humanas.

### ¿Qué es la generación aumentada con recuperación (RAG)?
Condicionar la inferencia con información externa relevante recuperada para cada consulta.

## 6. Evaluation

### ¿Qué diferencia hay entre evaluar con benchmarks y evaluar con arenas?
Los benchmarks puntúan modelos con tareas y métricas fijas, mientras que las arenas, como LMArena y Compass Arena, los comparan por las preferencias de usuarios.

## 7. Parameter Efficient Fine-Tuning

### ¿Qué es el ajuste fino eficiente en parámetros (PEFT)?
Es una familia de técnicas que adaptan un LLM a una tarea sin actualizar los parámetros del modelo base: se añade un conjunto pequeño de parámetros y solo se entrena ese.

### ¿Cómo funciona un adaptador (adapter)?
Añade un conjunto nuevo de parámetros mediante una conexión residual: $\text{Adapter}(X) = X + \text{Layer}(X)$, donde por ejemplo $\text{Layer}(X) = \sigma(X W_1) W_2$.

### ¿Cómo funciona el prefix tuning?
Se añaden $m$ tokens virtuales a cada capa de atención, concatenados a las matrices $K$ y $V$: $K' = [P_K; K]$ y $V' = [P_V; V]$, con $P_K$ y $P_V$ entrenables.

### ¿Qué hipótesis hace LoRA (low-rank adaptation) y cuál es su fórmula?
Supone que las transformaciones afines necesarias para la adaptación tienen baja dimensión. Por eso representa $\Delta W$ como producto de matrices de rango bajo:

$$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll \min(d,k)$$

### ¿Qué parámetros se entrenan en LoRA y cómo se inicializan?
Solo $A$ y $B$ (el modelo base queda congelado). $A$ se inicializa con una gaussiana $\mathcal{N}(0, \sigma^2)$ y $B$ con ceros.

### ¿Cuántos parámetros entrena LoRA de rango $r$ para una matriz $W \in \mathbb{R}^{d \times k}$?
$B$ tiene $d\,r$ y $A$ tiene $r\,k$, en total $r\,(d + k)$, frente a $d\,k$ de la matriz completa. Con $r \ll \min(d, k)$ es una fracción pequeña.

### ¿Por qué LoRA no añade coste de inferencia?
Porque el producto $BA$ ya entrenado se suma a los pesos del modelo, $W' = W + BA$, y se usa $W'$ como una única matriz.

### ¿Qué controlan los hiperparámetros $r$ y $\alpha$ de LoRA?
La fórmula en la práctica es $W' = W + \frac{\alpha}{r} BA$. El rango $r$ es la dimensión de la descomposición y $\alpha$ es el factor de escala del peso de la adaptación. El cociente $\alpha/r$ normaliza el efecto de $r$. Ambos suelen tomar valores en $\{4, 8, 16, 32\}$ y la razón $\alpha/r$ suele ser 2.

### Problema: cuenta los parámetros entrenables de LoRA
Una capa de atención tiene $W^Q$, $W^K$, $W^V$ y $W^O$, todas de $4096 \times 4096$ (con las cabezas concatenadas), y cada una se adapta con LoRA de rango $r = 8$. Calcula los parámetros de una matriz $W$, los de $B$ y $A$ y la fracción que suponen. Después calcula los parámetros entrenables en 32 capas.
#### Paso 1
$W$ tiene $4096^2 = 16\,777\,216$ parámetros.
#### Paso 2
$B \in \mathbb{R}^{4096 \times 8}$ tiene $32\,768$ y $A \in \mathbb{R}^{8 \times 4096}$ también, en total $65\,536$ parámetros. La fracción es $65\,536 / 16\,777\,216 = 1/256 \approx 0{,}39\,\%$, menos del 1 % de PEFT.
#### Paso 3
Son $4$ matrices por capa y 32 capas: $4 \cdot 32 \cdot 65\,536 = 8\,388\,608$ parámetros entrenables, frente a $4 \cdot 32 \cdot 16\,777\,216 = 2\,147\,483\,648$ de esas mismas matrices.

## 8. Quantization

### ¿Qué es la cuantización de un modelo y para qué sirve?
Es convertir datos numéricos de FP32 o FP16 a menor precisión (INT8, INT4, INT2). Permite entrenar e inferir LLM con recursos limitados.

### ¿Cómo se formaliza la cuantización de un peso $w$?
Se aproxima como $\hat{w} = s\,q$, con $s \in \mathbb{R}$ un factor de escala y $q \in \mathbb{Z}$ un entero. Por ejemplo, con 4 bits, $w = 0{,}137$ se representa con $q = 7$ y $s = 0{,}02$, de modo que $\hat{w} = 0{,}140$.

### ¿Cuáles son las fórmulas de la cuantización afín?
Convierte el rango real $[w_{min}, w_{max}]$ en el entero $[q_{min}, q_{max}]$:

$$q = \text{round}\left(\frac{w}{s} + z\right), \quad \hat{w} = s\,(q - z), \quad s = \frac{w_{max} - w_{min}}{q_{max} - q_{min}}, \quad z = \text{round}\left(q_{min} - \frac{w_{min}}{s}\right)$$

### ¿Cuáles son las fórmulas de la cuantización simétrica?
Convierte el rango $[-w_{max}, w_{max}]$ en $[-q_{max}, q_{max}]$ con $z = 0$:

$$q = \text{round}\left(\frac{w}{s}\right), \quad \hat{w} = s\,q, \quad s = \frac{w_{max}}{q_{max}}$$

### ¿Qué diferencia hay entre cuantizar por tensor y por canal?
Por tensor se usa una sola escala con $w_{max}$ igual al máximo del tensor entero. Por canal cada canal (por ejemplo, cada columna de la matriz de pesos) tiene su propio $w_{max}$ y su propia escala. En el ejemplo de clase el canal es la columna de $W$.

### ¿Qué es la calibración en la cuantización?
Es determinar el rango $R$ de valores que se va a cuantizar. En la práctica hace falta recortar (clipping): $q = \text{clip}(\text{round}(w/s + z), l, u)$, con $l = \text{round}(w_{min}/s + z)$ y $u = \text{round}(w_{max}/s + z)$.

### ¿Qué busca la cuantización posentrenamiento (PTQ)?
Cuantizar el modelo minimizando el efecto sobre la salida. Dado $Y = WX$, se busca $\hat{W} = S \cdot \text{round}(W/S)$ que minimice el error de la salida, medido con la norma de Frobenius:

$$\hat{W} = \arg\min_{W'} \lVert WX - W'X \rVert_F$$

### ¿Cuánta memoria ocupan los pesos de un modelo con $N$ parámetros a $b$ bits?
$N \cdot b / 8$ bytes. Es solo la memoria de los pesos, sin activaciones ni escalas de cuantización.

### Problema: cuantiza con la fórmula afín
Los pesos están en $[-2, 6]$ y se cuantizan con 8 bits sin signo, $q \in [0, 255]$. Calcula $s$ y $z$, y cuantiza y reconstruye $w = -2, 0, 1, 6$.
#### Paso 1
$s = \dfrac{6 - (-2)}{255 - 0} = \dfrac{8}{255} \approx 0{,}031373$ y $z = \text{round}(0 + 2/s) = \text{round}(63{,}75) = 64$.
#### Paso 2
Para $w = 0$: $q = \text{round}(0 + 64) = 64$ y $\hat{w} = s(64 - 64) = 0$, sin error. Para $w = -2$: $q = \text{round}(-63{,}75 + 64) = \text{round}(0{,}25) = 0$ y $\hat{w} = s(0 - 64) \approx -2{,}0078$.
#### Paso 3
Para $w = 1$: $q = \text{round}(31{,}875 + 64) = \text{round}(95{,}875) = 96$ y $\hat{w} = s \cdot 32 \approx 1{,}0039$. Para $w = 6$: $q = \text{round}(191{,}25 + 64) = 255$ y $\hat{w} = s \cdot 191 \approx 5{,}9922$.
#### Paso 4
Los errores de reconstrucción son de unas milésimas ($0{,}0078$, $0{,}0039$ y $0{,}0078$), por debajo de $s/2 \approx 0{,}016$. El cero queda exacto.

### Problema: cuantiza de forma simétrica con 8 bits
Los pesos están en $[-4, 4]$ y se cuantizan con 8 bits simétricos, $q \in [-127, 127]$. Calcula $s$ y cuantiza y reconstruye $w = -4, -1, 0, 1$.
#### Paso 1
$s = w_{max}/q_{max} = 4/127 \approx 0{,}031496$.
#### Paso 2
Para $w = -4$: $q = \text{round}(-127) = -127$ y $\hat{w} = s \cdot (-127) = -4$, sin error. Para $w = 0$: $q = 0$ y $\hat{w} = 0$.
#### Paso 3
Para $w = 1$: $q = \text{round}(31{,}75) = 32$ y $\hat{w} = 32 \cdot 4/127 \approx 1{,}0079$. Para $w = -1$: $q = -32$ y $\hat{w} \approx -1{,}0079$.
#### Paso 4
El error máximo es $s/2 \approx 0{,}0157$ y aquí el mayor es $0{,}0079$. A diferencia de la afín, no hay punto cero, y el rango $[-4, 4]$ está centrado, así que se usan todos los enteros salvo $-128$.

### Problema: elige el rango de calibración con y sin recorte
Los pesos $0{,}1,\ -0{,}2,\ 0{,}3,\ 0{,}25$ y $1{,}0$ se cuantizan con 4 bits simétricos, $q_{max} = 7$. Compara usar el máximo ($R = 1$) con recortar en $R = 0{,}3$.
#### Paso 1
Con $R = 1$: $s = 1/7 \approx 0{,}1429$. Los cocientes $w/s$ son $0{,}7,\ -1{,}4,\ 2{,}1,\ 1{,}75,\ 7$, que redondean a $1,\ -1,\ 2,\ 2,\ 7$. Reconstruidos: $0{,}143,\ -0{,}143,\ 0{,}286,\ 0{,}286,\ 1{,}0$. Los errores de los cuatro pesos pequeños son de $0{,}043,\ 0{,}057,\ 0{,}014$ y $0{,}036$, y el grande es exacto.
#### Paso 2
Con $R = 0{,}3$: $s = 0{,}3/7 \approx 0{,}0429$. Los cocientes son $2{,}33,\ -4{,}67,\ 7,\ 5{,}83$ y $23{,}3$. Los cuatro primeros redondean a $2,\ -5,\ 7,\ 6$ y el último se recorta a 7. Reconstruidos: $0{,}086,\ -0{,}214,\ 0{,}3,\ 0{,}257$ y $0{,}3$. Los errores pequeños bajan a $0{,}014,\ 0{,}014,\ 0$ y $0{,}007$, pero el peso $1{,}0$ pasa a $0{,}3$, con error $0{,}7$.
#### Paso 3
El error cuadrático total es $0{,}0066$ con $R = 1$ y $0{,}490$ con $R = 0{,}3$. Aquí conviene el rango grande porque el peso extremo importa. El recorte compensa solo cuando los valores extremos son raros y poco relevantes.

### Problema: compara la cuantización simétrica por tensor y por columna
Se cuantiza $W = \begin{pmatrix} 8 & 0{,}5 \\ 2 & 0{,}4 \end{pmatrix}$ con 4 bits simétricos ($q_{max} = 7$). Compara por tensor y por columna, y mide el error de la salida $WX$ con $X = (1, 1)^t$.
#### Paso 1
Por tensor, $w_{max} = 8$ y $s = 8/7 \approx 1{,}1429$. Entonces $W/s = \begin{pmatrix} 7 & 0{,}4375 \\ 1{,}75 & 0{,}35 \end{pmatrix}$, que redondea a $\hat{Q} = \begin{pmatrix} 7 & 0 \\ 2 & 0 \end{pmatrix}$ y $\hat{W} = \begin{pmatrix} 8 & 0 \\ 2{,}2857 & 0 \end{pmatrix}$. La segunda columna se pierde.
#### Paso 2
Por columna, la primera sigue con $s_1 = 8/7$ y la segunda tiene $w_{max} = 0{,}5$ y $s_2 = 0{,}5/7 \approx 0{,}07143$. Entonces $0{,}5/s_2 = 7$ y $0{,}4/s_2 = 5{,}6 \to 6$, de modo que $\hat{Q} = \begin{pmatrix} 7 & 7 \\ 2 & 6 \end{pmatrix}$ y $\hat{W} = \begin{pmatrix} 8 & 0{,}5 \\ 2{,}2857 & 0{,}4286 \end{pmatrix}$.
#### Paso 3
La salida real es $WX = (8{,}5,\ 2{,}4)^t$. Por tensor, $\hat{W}X = (8,\ 2{,}2857)^t$, con error $(0{,}5,\ 0{,}1143)$ y norma $\approx 0{,}513$. Por columna, $\hat{W}X = (8{,}5,\ 2{,}7143)^t$, con error $(0,\ -0{,}3143)$ y norma $\approx 0{,}314$.
#### Paso 4
La cuantización por columna da un error de salida menor (0,314 frente a 0,513), porque cada columna usa su propia escala. Con una sola escala, la columna de valores pequeños desaparece. Medido en los pesos, el error de Frobenius baja de 0,701 (por tensor) a 0,287 (por columna). El error de salida depende de $X$, y con $X = (1, 1)^t$ parte de los errores se compensa.
