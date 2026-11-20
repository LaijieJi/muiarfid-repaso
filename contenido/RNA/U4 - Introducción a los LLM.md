# RNA U4 - Introducción a los LLM

## 1. Introduction

### ¿Qué es un modelo de lenguaje de gran tamaño (LLM)?
Es una red grande que genera secuencias de tokens y que se basa sobre todo en la arquitectura Transformer, en su variante solo decodificador (decoder-only).

### ¿Qué es un modelo fundacional (foundation model, FM)?
Es un modelo preentrenado con cantidades masivas de datos, de modo que se puede aplicar a muchos usos distintos sin entrenarlo desde cero para cada uno.

### ¿Qué diferencia hay entre un FM típico, uno avanzado y uno de frontera?
El típico responde a instrucciones en lenguaje natural generando texto, imagen, audio, vídeo o código. El avanzado es aquel que solo unos pocos laboratorios grandes tienen recursos para entrenar. El de frontera es un FM avanzado cuyas capacidades suponen riesgos para la seguridad pública.

### ¿Qué significan Software 1.0, 2.0 y 3.0?
Software 1.0 es el código escrito a mano, el 2.0 son los pesos de una red entrenada y el 3.0 son los prompts que se dan a un LLM.

## 2. Background

### ¿Qué es un modelo de lenguaje probabilístico?
Es una distribución de probabilidad sobre las secuencias de palabras (o de tokens) de un idioma.

### ¿Qué midió Shannon en 1951 con su experimento de adivinar la siguiente letra?
Estimó la entropía condicional del inglés, es decir, cuánta incertidumbre queda sobre una letra dadas las $n-1$ anteriores. Con $F_n$ la entropía con $n-1$ letras de contexto, obtuvo $F_0 = \log_2 26 \approx 4{,}7$ bits, $F_1 = 4{,}14$, $F_2 = 3{,}56$ y $F_3 = 3{,}31$.

### ¿Qué enseñan los valores $F_0 > F_1 > F_2 > F_3$ de Shannon?
Que cuanto más contexto se conoce, menos incertidumbre queda sobre la siguiente letra. Es la motivación de los modelos de lenguaje con contexto.

### ¿Cómo aproxima un modelo de $n$-gramas la probabilidad de una secuencia?
Aplica la regla de la cadena y supone que cada palabra solo depende de las $n-1$ anteriores (hipótesis markoviana de orden $n-1$):

$$p(x_{1:N}) = \prod_i p(x_i \mid x_{1:i-1}) \approx \prod_i p(x_i \mid x_{i-(n-1):i-1})$$

### ¿Cómo se factoriza $p(x_{1:N})$ con un modelo de unigramas, de bigramas y de trigramas?
Unigrama: $p(x_1)\,p(x_2)\cdots p(x_N)$. Bigrama: $p(x_1)\,p(x_2 \mid x_1)\cdots p(x_N \mid x_{N-1})$. Trigrama: $p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2)\cdots p(x_N \mid x_{N-2}, x_{N-1})$.

### ¿Para qué sirven los símbolos de inicio y de fin en un modelo de $n$-gramas?
Se añaden $n-1$ símbolos `<s>` al principio para poder modelar las primeras palabras de la frase. El símbolo `</s>` al final hace que el modelo asigne probabilidad a que la frase termine, de modo que suma uno sobre todas las frases.

### ¿Qué ocurre si el modelo no usa símbolo final `</s>`?
Hace falta un modelo de lenguaje distinto para cada longitud de frase, porque nada indica cuándo parar.

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

### ¿Qué perplejidad y qué entropía tiene un modelo con perplejidad mínima?
Un modelo que concentra toda la probabilidad en una sola frase $x_{1:N}$ asigna probabilidad 1 a cada palabra. Su perplejidad es $1^{-1/N} = 1$ y su entropía es 0, porque no necesita información extra para saber la palabra siguiente.

### ¿Qué perplejidad y qué entropía tiene un modelo con perplejidad máxima?
El que reparte la probabilidad por igual entre las $V$ palabras del vocabulario. Su perplejidad es $V$ aunque cambie la longitud $N$, y su entropía es $\log V$, que son los nats (o bits con $\log_2$) de información extra que necesita para determinar cada palabra.

### Un modelo uniforme sobre un vocabulario de 8 palabras, ¿qué perplejidad y qué entropía en bits tiene?
Cada palabra tiene probabilidad $1/8$, así que $\text{PPL} = (1/8)^{-1} = 8$ y $H = \log_2 8 = 3$ bits por palabra.

### ¿Cuál es el problema de la dimensionalidad de los modelos de $n$-gramas?
El número de parámetros crece como $V^n$. Con $V = 100\,000$ y $n = 10$ hacen falta del orden de $10^{50}$ parámetros, por lo que en la práctica no se puede pasar de los trigramas.

### ¿Qué defecto de representación tienen los modelos estadísticos de $n$-gramas respecto a la semejanza entre palabras?
No consideran la semejanza semántica. La palabra $k$ del vocabulario es un vector one-hot disperso, $\text{onehot}(k) \in \{0,1\}^V$, y equidista de cualquier otra palabra.

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

### ¿Qué aporta el término $\text{vec}(WE(X))\,W_4$ en la salida del FNN LM?
Es una conexión directa (residual) que lleva los embeddings a la capa de salida sin pasar por la capa oculta. De este modo el softmax recibe la salida de la FFN y los embeddings a la vez.

### ¿Qué ventaja tiene el FNN LM sobre un modelo de $n$-gramas con el mismo contexto?
Sus parámetros crecen de forma lineal con el contexto, $(n-1)\,d_{model}$, y no como $V^n$. Además los embeddings densos permiten que palabras parecidas reciban probabilidades parecidas.

### ¿Cómo se puede usar un Transformer como modelo de lenguaje?
El decodificador de un Transformer, con atención enmascarada, se usa directamente como modelo de lenguaje causal.

### Problema: calcula la perplejidad y la entropía de una frase con un modelo de bigramas
Un modelo de bigramas tiene $p(a \mid \langle s\rangle) = 0{,}6$ y $p(b \mid \langle s\rangle) = 0{,}4$. Tras $a$: $p(a \mid a) = 0{,}5$, $p(b \mid a) = 0{,}3$ y $p(\langle /s\rangle \mid a) = 0{,}2$. Tras $b$: $p(a \mid b) = 0{,}25$, $p(b \mid b) = 0{,}25$ y $p(\langle /s\rangle \mid b) = 0{,}5$. Calcula la perplejidad y la entropía en bits de la frase $b\,a\,b$.
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
| T5 | Google, 2019 | codificador y decodificador | masked LM y ajuste text-to-text |

### ¿Qué idea introdujo GPT-1 (Generative Pre-Training)?
Preentrenar un decodificador con secuencias largas de texto, para aprender de información lejana, y después ajustarlo (fine-tuning) a tareas como clasificación, continuación, similitud y opción múltiple.

### ¿Con qué dos tareas se preentrena BERT?
Con el modelo de lenguaje enmascarado (masked LM, MLM) y la predicción de la siguiente frase (next sentence prediction, NSP).

### ¿Qué tareas se usan para ajustar BERT?
Inferencia en lenguaje natural multigénero (MNLI), reconocimiento de entidades (NER) y preguntas y respuestas (SQuAD).

### ¿Qué significa que T5 sea text-to-text?
Que toda tarea, como traducción, resumen o similitud, se plantea como texto de entrada y texto de salida. Se entrena con masked LM y después con ajuste específico de cada tarea en ese formato.

### ¿Qué novedad aportó GPT-2 respecto a GPT-1?
Transferencia de tareas zero-shot: se evalúa en muchas tareas sin entrenar ni ajustar el modelo en ninguna. Su conjunto de entrenamiento, WebText, tiene 40 GB de texto de 45 millones de enlaces de Reddit hasta 2017.

### ¿En qué consiste la tarea LAMBADA?
En predecir la última palabra de una frase que exige al menos 50 tokens de contexto para acertarla. Mide si el modelo aprovecha el contexto lejano.

### ¿Cómo evalúa el Children's Book Test (CBT) a un modelo de lenguaje?
Dado un contexto, una pregunta y unas respuestas candidatas, se calcula la probabilidad de cada candidata y se elige la más probable. Se mide la exactitud en sustantivos comunes (CBT-CN) y en entidades nombradas (CBT-NE).

### ¿Qué es el aprendizaje en contexto (in-context learning) de GPT-3?
Es adaptar el modelo a una tarea poniendo en el prompt cero, uno o varios ejemplos (zero-shot, one-shot, few-shot) sin actualizar los pesos. Sustituye al ajuste fino.

### ¿Qué relación hay entre el rendimiento en SuperGLUE de GPT-3, el tamaño del modelo y los ejemplos en contexto?
Mejora al aumentar tanto el tamaño del modelo como el número de ejemplos en contexto.

### ¿Con qué datos se entrenó GPT-3?
Con unos 300 000 millones de tokens (300B) de Common Crawl filtrado, WebText2, Books1, Books2 y Wikipedia.

### ¿Qué dice la ley de potencias de la pérdida de validación en función del cómputo?
Que la pérdida cae como una ley de potencias del cómputo $C$, medido en PetaFLOP/s-días: $L = 2{,}57 \cdot C^{-0{,}048}$. En una gráfica log-log es una recta de pendiente $-0{,}048$.

### ¿Qué hiperparámetros tiene el GPT-3 de 175B?
96 capas, $d_{model} = 12\,288$, 96 cabezas, $d_{head} = 128$, lotes de 3,2 millones de tokens y tasa de aprendizaje $0{,}6 \cdot 10^{-4}$.

### ¿Por qué el coste de entrenar un modelo es de unos 6 FLOP por parámetro y por token?
Una pasada hacia delante cuesta 2 FLOP por parámetro activo y la pasada hacia atrás cuesta el doble que la de ida. Así el entrenamiento completo es $2 \cdot 3 = 6$ FLOP por parámetro y por token, y el cómputo total es $C \approx 6\,N\,D$ con $N$ parámetros y $D$ tokens.

### ¿Qué tres pasos tiene el alineamiento de InstructGPT?
1. Ajuste supervisado (SFT) del modelo con demostraciones de un anotador. 2. Entrenamiento de un modelo de recompensa (RM) con comparaciones. 3. Optimización de la política con aprendizaje por refuerzo (RL) y PPO, usando la recompensa del RM.

### ¿Cómo se obtiene el modelo de recompensa de InstructGPT?
Se muestrean varias salidas para un mismo prompt y un anotador las ordena de la mejor a la peor. Con esos órdenes se entrena el modelo de recompensa.

### ¿Qué relación hay entre ChatGPT (nov 2022) e InstructGPT?
ChatGPT es una versión refinada de InstructGPT: parte del mismo modelo y usa una metodología parecida, con datos conversacionales añadidos. Esos datos conversacionales tuvieron un efecto muy positivo.

### Problema: calcula el cómputo de entrenamiento de GPT-3 175B
El modelo tiene $N = 175 \cdot 10^9$ parámetros y se entrena con $D = 300 \cdot 10^9$ tokens. Usa 6 FLOP por parámetro y por token. Calcula los FLOP totales, los PetaFLOP/s-días y los días que tardaría un clúster que sostuviera $10^{17}$ FLOP/s en total.
#### Paso 1
$C = 6 \cdot 175 \cdot 10^9 \cdot 300 \cdot 10^9 = 3{,}15 \cdot 10^{23}$ FLOP, que coincide con el valor de la tabla del modelo, unos $3{,}14 \cdot 10^{23}$.
#### Paso 2
Un PetaFLOP/s-día son $10^{15} \cdot 86\,400 = 8{,}64 \cdot 10^{19}$ FLOP. Por tanto $C = 3{,}15 \cdot 10^{23} / 8{,}64 \cdot 10^{19} \approx 3646$ PetaFLOP/s-días, que es el $3{,}64 \cdot 10^3$ de la tabla.
#### Paso 3
Con $10^{17}$ FLOP/s sostenidos hacen falta $3{,}15 \cdot 10^{23} / 10^{17} = 3{,}15 \cdot 10^6$ segundos, es decir, $3{,}15 \cdot 10^6 / 86\,400 \approx 36{,}5$ días.

### Problema: estima los parámetros de GPT-3 175B a partir de su tabla
Con 96 capas y $d_{model} = 12\,288$, estima el número de parámetros de las capas del Transformer. Asume, como en el Transformer original, que $d_{ff} = 4\,d_{model}$ y que $h \cdot d_{head} = d_{model}$, y no cuentes sesgos ni embeddings.
#### Paso 1
Comprobación de las cabezas: $96 \cdot 128 = 12\,288 = d_{model}$, así que $W_Q, W_K, W_V$ y $W^O$ son cuadradas de $d_{model} \times d_{model}$.
#### Paso 2
Atención: $4\,d_{model}^2$. Red feed-forward con $d_{ff} = 4\,d_{model}$: $2 \cdot d_{model} \cdot 4\,d_{model} = 8\,d_{model}^2$. Una capa tiene $12\,d_{model}^2$ parámetros.
#### Paso 3
Con 96 capas: $12 \cdot 96 \cdot 12\,288^2 = 173\,946\,175\,488 \approx 174 \cdot 10^9$, muy cerca de los 175B nominales. La pequeña diferencia son los embeddings y los sesgos.

### Problema: aplica la ley de potencias del cómputo
Con $L = 2{,}57 \cdot C^{-0{,}048}$ ($C$ en PetaFLOP/s-días), calcula la pérdida para $C = 3640$, el factor en que cae $L$ al multiplicar el cómputo por 10 y el factor de cómputo necesario para dividir la pérdida por 2.
#### Paso 1
$L(3640) = 2{,}57 \cdot 3640^{-0{,}048}$. Como $\ln 3640 \approx 8{,}20$, $3640^{-0{,}048} = e^{-0{,}394} \approx 0{,}675$ y $L \approx 1{,}73$.
#### Paso 2
Al multiplicar $C$ por 10, $L$ se multiplica por $10^{-0{,}048} \approx 0{,}895$, es decir, cae un 10,5 %.
#### Paso 3
Para dividir $L$ por 2 hace falta $k^{-0{,}048} = 1/2$, es decir, $k = 2^{1/0{,}048} = 2^{20{,}83} \approx 1{,}9 \cdot 10^6$. Hay que multiplicar el cómputo por casi dos millones, de modo que las mejoras son lentas aunque constantes.

## 4. Pre-training

### ¿Cuál es el objetivo del preentrenamiento de un LLM?
Entrenar un modelo base para predecir el siguiente token a partir de un contexto.

### ¿Qué preprocesado se hace antes de preentrenar?
Primero, adquirir y filtrar (limpiar) el texto, por ejemplo quitando duplicados y contenido tóxico. Después, tokenizarlo con un vocabulario de tokens de tamaño adecuado.

### ¿Cómo funciona el algoritmo BPE (byte-pair encoding) para construir el vocabulario?
1. El vocabulario base son los caracteres individuales (en la versión estándar, bytes UTF-8). 2. Se fusiona el par de tokens adyacentes más frecuente en un token nuevo. 3. Se repite el paso 2 hasta alcanzar el tamaño de vocabulario deseado.

### ¿Cómo se tokeniza un texto nuevo con un BPE ya entrenado?
Se parte de los caracteres y se aplican las reglas de fusión en el mismo orden en que se aprendieron, no se busca el token más largo posible.

### ¿Qué conjunto de datos de preentrenamiento muestra la clase como ejemplo?
FineWeb2, con unos 20 TB de documentos en más de 1000 idiomas.

### ¿Qué tendencia tienen los datos de preentrenamiento de los modelos recientes?
Son decenas de billones de datos ($10^{12}$ cada billón) y la tendencia es creciente.

### ¿Qué coste de preentrenamiento tienen los modelos recientes?
Entre $10^{19}$ y $10^{27}$ FLOP, con tendencia creciente.

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

### ¿Cuál es el objetivo del posentrenamiento (post-training)?
Ajustar un modelo ya preentrenado para adaptarlo al uso que se quiere.

### ¿En qué se parece y en qué se diferencia el ajuste supervisado (SFT) del preentrenamiento?
El entrenamiento es muy parecido, pero los datos son conversaciones de un dominio concreto y no texto genérico. Se usa para que el modelo converse.

### ¿Qué es el aprendizaje por refuerzo con retroalimentación humana (RLHF)?
Es aprendizaje por refuerzo cuya recompensa la da un modelo de recompensa entrenado con preferencias humanas.

### ¿Qué es la optimización directa de preferencias (DPO)?
Una versión simplificada de RLHF.

### ¿Qué es la generación aumentada con recuperación (RAG)?
Condicionar la inferencia con información externa relevante recuperada para cada consulta.

### ¿Qué es el razonamiento en tiempo de inferencia (test-time prompting and reasoning)?
Condicionar al modelo durante la inferencia con prompts elaborados, como la cadena de pensamiento (chain-of-thought, CoT).

### ¿Para qué sirven la compresión, la cuantización, la poda y la destilación de conocimiento?
Para reducir el tamaño del modelo, algo necesario cuando los recursos son limitados.

### ¿Qué problemas atacan el aprendizaje continuo y la seguridad (safety) en el posentrenamiento?
El aprendizaje continuo actualiza el modelo con datos nuevos. La seguridad reduce comportamientos no deseados como la toxicidad, el sesgo o la filtración de datos.

## 6. Evaluation

### ¿Qué ofrece Epoch AI?
Es un instituto de investigación en IA que publica datos sobre modelos de aprendizaje automático (más de 3100), aceleradores, clústeres de GPU, empresas y evaluaciones, además de tendencias y proyecciones del estado del arte.

### ¿Qué ofrece Artificial Analysis?
Es una consultora de IA que compara modelos y proveedores en capacidades, velocidad, hardware y evaluaciones, con rankings de texto, imagen, vídeo, voz y música.

### ¿Cómo evalúa LMArena a los modelos?
Con preferencias humanas obtenidas de forma abierta y colaborativa (crowdsourcing). Tiene arenas por modalidad, como texto, desarrollo web, visión, imagen, búsqueda, vídeo y código (Copilot Arena), y un ranking global.

### ¿Qué es OpenCompass?
Una plataforma china de evaluación de LLM con benchmarks por categorías (CompassHub), rankings (CompassRank) y evaluación por preferencias (Compass Arena).

### ¿Qué diferencia hay entre evaluar con benchmarks y evaluar con arenas?
Los benchmarks puntúan modelos con tareas y métricas fijas, mientras que las arenas, como LMArena y Compass Arena, los comparan por las preferencias de usuarios.

## 7. Parameter Efficient Fine-Tuning

### ¿Qué es el ajuste fino eficiente en parámetros (PEFT)?
Es una familia de técnicas que adaptan un LLM a una tarea sin actualizar los parámetros del modelo base: se añade un conjunto pequeño de parámetros y solo se entrena ese.

### ¿Por qué se usa PEFT en lugar de ajustar todo el modelo?
Porque el ajuste fino completo de los parámetros $W \in \mathbb{R}^{d \times k}$ es muy costoso. PEFT entrena un $\Delta W \in \mathbb{R}^{d \times k}$ nuevo que es menos del 1 % del modelo base, y el modelo adaptado es $W' = W + \Delta W$.

### ¿Cuáles son las cuatro técnicas principales de PEFT?
Adaptadores, LoRA, prefix tuning y prompt tuning.

### ¿Cómo funciona un adaptador (adapter)?
Añade un conjunto nuevo de parámetros mediante una conexión residual: $\text{Adapter}(X) = X + \text{Layer}(X)$, donde por ejemplo $\text{Layer}(X) = \sigma(X W_1) W_2$.

### ¿Cómo funciona el prefix tuning?
Se añaden $m$ tokens virtuales a cada capa de atención, concatenados a las matrices $K$ y $V$: $K' = [P_K; K]$ y $V' = [P_V; V]$, con $P_K$ y $P_V$ entrenables.

### ¿Cómo funciona el prompt tuning y en qué se diferencia del prefix tuning?
Concatena $m$ tokens virtuales a la entrada como embeddings de palabra entrenables. Se diferencia en que el prefix tuning los añade en cada capa de atención y el prompt tuning solo a la entrada.

### ¿Qué hipótesis hace LoRA (low-rank adaptation) y cuál es su fórmula?
Supone que las transformaciones afines necesarias para la adaptación tienen baja dimensión. Por eso representa $\Delta W$ como producto de matrices de rango bajo:

$$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\ A \in \mathbb{R}^{r \times k},\ r \ll \min(d,k)$$

### ¿Qué parámetros se entrenan en LoRA y cómo se inicializan?
Solo $A$ y $B$ (el modelo base queda congelado). $A$ se inicializa con una gaussiana $\mathcal{N}(0, \sigma^2)$ y $B$ con ceros.

### ¿Por qué en LoRA se inicializa $B = 0$?
Porque así $BA = 0$ al empezar y el modelo adaptado coincide con el modelo base. El entrenamiento parte entonces del comportamiento original.

### ¿Por qué LoRA no añade coste de inferencia?
Porque el producto $BA$ ya entrenado se suma a los pesos del modelo, $W' = W + BA$, y se usa $W'$ como una única matriz.

### ¿A qué parámetros se suele aplicar LoRA?
A las matrices de la atención: $W_i^Q$, $W_i^K$, $W_i^V$ y $W^O$.

### ¿Qué ventajas de uso tiene LoRA?
Un único modelo base puede usar adaptaciones LoRA distintas para tareas distintas, y se puede combinar con otros métodos PEFT como el prefix tuning.

### ¿Qué controlan los hiperparámetros $r$ y $\alpha$ de LoRA?
La fórmula en la práctica es $W' = W + \frac{\alpha}{r} BA$. El rango $r$ de la descomposición tiene efecto normalizador y $\alpha$ es un factor de escala del peso de la adaptación. Ambos suelen tomar valores en $\{4, 8, 16, 32\}$ y la razón $\alpha/r$ suele ser 2.

### Nombra variantes de LoRA.
QLoRA (con cuantización), DoRA (con escalado) y AdaLoRA (con rango $r$ dinámico).

### Problema: cuenta los parámetros entrenables de LoRA
Una matriz $W$ de atención es de $4096 \times 4096$ y se adapta con LoRA de rango $r = 8$. Calcula los parámetros de $W$ y los de $B$ y $A$, y la fracción que suponen. Si se adapta $W^Q, W^K, W^V$ y $W^O$ en 32 capas, calcula los parámetros entrenables.
#### Paso 1
$W$ tiene $4096^2 = 16\,777\,216$ parámetros.
#### Paso 2
$B \in \mathbb{R}^{4096 \times 8}$ tiene $32\,768$ y $A \in \mathbb{R}^{8 \times 4096}$ también, en total $65\,536$ parámetros. La fracción es $65\,536 / 16\,777\,216 = 1/256 \approx 0{,}39\,\%$, menos del 1 % de PEFT.
#### Paso 3
Son $4$ matrices por capa y 32 capas: $4 \cdot 32 \cdot 65\,536 = 8\,388\,608$ parámetros entrenables, frente a $4 \cdot 32 \cdot 16\,777\,216 = 2\,147\,483\,648$ de esas mismas matrices.

### Problema: fusiona una adaptación LoRA en los pesos
Sea $W = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix}$, con LoRA de rango $r = 1$ y $\alpha = 2$, $B = \begin{pmatrix} 1 \\ 2 \end{pmatrix}$ y $A = \begin{pmatrix} 0{,}5 & -1 \end{pmatrix}$. Calcula $W'$ y la salida para $x = (1, 1)^t$ de dos formas.
#### Paso 1
El factor de escala es $\alpha / r = 2$. El producto es $BA = \begin{pmatrix} 0{,}5 & -1 \\ 1 & -2 \end{pmatrix}$, de rango 1, y $\Delta W = 2\,BA = \begin{pmatrix} 1 & -2 \\ 2 & -4 \end{pmatrix}$.
#### Paso 2
$W' = W + \Delta W = \begin{pmatrix} 2 & -2 \\ 2 & -3 \end{pmatrix}$ y $W' x = (2 - 2,\ 2 - 3)^t = (0, -1)^t$.
#### Paso 3
Comprobación sin fusionar: $W x = (1, 1)^t$ y $Ax = 0{,}5 - 1 = -0{,}5$. Entonces $2\,B(Ax) = 2 \cdot (-0{,}5)\,(1, 2)^t = (-1, -2)^t$ y la suma es $(0, -1)^t$, igual que antes.

## 8. Quantization

### ¿Qué es la cuantización de un modelo y para qué sirve?
Es convertir datos numéricos de FP32 o FP16 a menor precisión (INT8, INT4, INT2). Permite entrenar e inferir LLM con recursos limitados.

### ¿Qué coste tiene cuantizar y qué meta se persigue?
Menor precisión introduce errores de cálculo que se acumulan con el tiempo. La meta es que la pérdida de rendimiento tras cuantizar sea de alrededor del 1 %.

### ¿Cómo se formaliza la cuantización de un peso $w$?
Se aproxima como $\hat{w} = s\,q$, con $s \in \mathbb{R}$ un factor de escala y $q \in \mathbb{Z}$ un entero. Por ejemplo, con 4 bits, $w = 0{,}137$ se representa con $q = 7$ y $s = 0{,}02$, de modo que $\hat{w} = 0{,}140$.

### ¿Cuáles son las fórmulas de la cuantización afín?
Convierte el rango real $[w_{min}, w_{max}]$ en el entero $[q_{min}, q_{max}]$:

$$q = \text{round}\left(\frac{w}{s} + z\right), \quad \hat{w} = s\,(q - z), \quad s = \frac{w_{max} - w_{min}}{q_{max} - q_{min}}, \quad z = \text{round}\left(q_{min} - \frac{w_{min}}{s}\right)$$

### ¿Qué representan la escala $s$ y el punto cero $z$ en la cuantización afín?
La escala $s$ es el tamaño del paso entre dos enteros consecutivos, medido en unidades reales. El punto cero $z$ es el entero al que corresponde el cero real.

### ¿Por qué la cuantización afín suele representar el cero sin error?
Porque $z$ es un entero (se redondea) y $w = 0$ da $q = \text{round}(z) = z$ y $\hat{w} = s(z - z) = 0$. Los demás valores sí tienen error de reconstrucción.

### ¿Cuáles son las fórmulas de la cuantización simétrica?
Convierte el rango $[-w_{max}, w_{max}]$ en $[-q_{max}, q_{max}]$ con $z = 0$:

$$q = \text{round}\left(\frac{w}{s}\right), \quad \hat{w} = s\,q, \quad s = \frac{w_{max}}{q_{max}}$$

### ¿Qué diferencia hay entre la cuantización simétrica y la afín?
La simétrica no tiene punto cero, ya que el cero real es el entero 0, y solo necesita $s$. A cambio usa el rango de forma simétrica y puede dejar sin usar parte de los enteros si los pesos no están centrados.

### ¿Qué enteros usa la cuantización simétrica con 8 bits?
El rango $[-127, 127]$, con $q_{max} = 127$. Con 8 bits hay 256 valores, así que se desaprovecha uno.

### ¿Qué diferencia hay entre cuantizar por tensor y por canal?
Por tensor se usa una sola escala con $w_{max}$ igual al máximo del tensor entero. Por canal cada canal (por ejemplo, cada columna de la matriz de pesos) tiene su propio $w_{max}$ y su propia escala.

### ¿Por qué la cuantización por canal pierde menos que la cuantización por tensor?
Porque un canal con valores pequeños no comparte escala con otro de valores grandes. Con una sola escala los valores pequeños se redondean a cero.

### ¿Qué es la calibración en la cuantización?
Es determinar el rango $R$ de valores que se va a cuantizar. En la práctica hace falta recortar (clipping): $q = \text{clip}(\text{round}(w/s + z), l, u)$, con $l = \text{round}(w_{min}/s + z)$ y $u = \text{round}(w_{max}/s + z)$.

### ¿Qué compromiso hay al elegir el rango de calibración?
Un rango grande representa más valores pero aumenta el paso $s$ y con él el error de reconstrucción. Un rango pequeño reduce $s$ pero recorta los valores extremos.

### ¿Qué diferencia hay entre cuantización estática y dinámica de las activaciones?
En la estática el rango se estima antes con una pasada hacia delante de muestras representativas. En la dinámica se calcula sobre la marcha durante la ejecución, con un coste de cómputo adicional.

### ¿Qué técnicas de calibración se conocen?
Máximo (rango dado por el mínimo y el máximo), divergencia de Kullback-Leibler (rango que minimiza la divergencia entre los valores reconstruidos y los originales) y percentil (rango que contiene el percentil $p$ de los valores, típicamente $p = 99{,}9\,\%$).

### ¿Qué busca la cuantización posentrenamiento (PTQ)?
Cuantizar el modelo minimizando el efecto sobre la salida. Dado $Y = WX$, se busca $\hat{W} = S \cdot \text{round}(W/S)$ que minimice el error cuadrático de la salida:

$$\hat{W} = \arg\min_{W'} \lVert WX - W'X \rVert_F$$

### ¿Qué papel tiene el conjunto de calibración en la PTQ?
Con una matriz de entradas $X$ representativa se determinan la escala $S$, el rango que se cuantiza y el método de redondeo.

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

### Problema: compara la cuantización simétrica por tensor y por columna
Se cuantiza $W = \begin{pmatrix} 8 & 0{,}5 \\ 2 & 0{,}4 \end{pmatrix}$ con 4 bits simétricos ($q_{max} = 7$). Compara por tensor y por columna, y mide el error de la salida $WX$ con $X = (1, 1)^t$.
#### Paso 1
Por tensor, $w_{max} = 8$ y $s = 8/7 \approx 1{,}1429$. Entonces $W/s = \begin{pmatrix} 7 & 0{,}4375 \\ 1{,}75 & 0{,}35 \end{pmatrix}$, que redondea a $\hat{Q} = \begin{pmatrix} 7 & 0 \\ 2 & 0 \end{pmatrix}$ y $\hat{W} = \begin{pmatrix} 8 & 0 \\ 2{,}2857 & 0 \end{pmatrix}$. La segunda columna se pierde.
#### Paso 2
Por columna, la primera sigue con $s_1 = 8/7$ y la segunda tiene $w_{max} = 0{,}5$ y $s_2 = 0{,}5/7 \approx 0{,}07143$. Entonces $0{,}5/s_2 = 7$ y $0{,}4/s_2 = 5{,}6 \to 6$, de modo que $\hat{Q} = \begin{pmatrix} 7 & 7 \\ 2 & 6 \end{pmatrix}$ y $\hat{W} = \begin{pmatrix} 8 & 0{,}5 \\ 2{,}2857 & 0{,}4286 \end{pmatrix}$.
#### Paso 3
La salida real es $WX = (8{,}5,\ 2{,}4)^t$. Por tensor, $\hat{W}X = (8,\ 2{,}2857)^t$, con error $(0{,}5,\ 0{,}1143)$ y norma $\approx 0{,}513$. Por columna, $\hat{W}X = (8{,}5,\ 2{,}7143)^t$, con error $(0,\ -0{,}3143)$ y norma $\approx 0{,}314$.
#### Paso 4
La cuantización por columna da un error de salida menor (0,314 frente a 0,513), porque cada columna usa su propia escala. Con una sola escala, la columna de valores pequeños desaparece.

### Problema: memoria de los pesos de un modelo según la precisión
Un LLM tiene 7000 millones de parámetros. Calcula la memoria que ocupan sus pesos en FP32, FP16, INT8 e INT4.
#### Paso 1
Cada parámetro ocupa $b/8$ bytes. En FP32 son 4 bytes, así que $7 \cdot 10^9 \cdot 4 = 28$ GB. En FP16 son 2 bytes, es decir, 14 GB.
#### Paso 2
En INT8 es 1 byte, es decir, 7 GB, y en INT4 es medio byte, es decir, 3,5 GB.
#### Paso 3
Cada reducción de bits a la mitad reduce la memoria a la mitad. Es solo la memoria de los pesos, sin activaciones ni las escalas de la cuantización.
