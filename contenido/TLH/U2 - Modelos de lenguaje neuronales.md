# TLH U2 - Modelos de lenguaje neuronales

## 1. Del n-grama al modelo neuronal

### ¿Qué hace un modelo de lenguaje?
Asigna una probabilidad a una secuencia de tokens. Con la regla de la cadena:

$$p(X) = p(x_1) \prod_{t=2}^{T} p(x_t \mid x_1 \dots x_{t-1})$$

### ¿Qué limitación de contexto tienen los n-gramas?
La asunción de Markov: solo miran los $k$ tokens anteriores. Un modelo neuronal que maneja secuencias puede usar toda la historia.

### ¿Por qué los n-gramas necesitan suavizado y los modelos neuronales no?
Porque la inmensa mayoría de n-gramas posibles nunca aparece en el entrenamiento y recibiría probabilidad cero. Un modelo neuronal generaliza a contextos no vistos por similitud con los vistos, y con subwords casi no quedan palabras fuera del vocabulario.

### ¿Por qué un modelo neuronal puede dar una probabilidad razonable a «feed the dog» si solo vio «feed the cat»?
Porque «dog» y «cat» aparecen en contextos parecidos y tienen representaciones parecidas. Para un n-grama son símbolos sin relación, y el no visto recibe una probabilidad casi nula.

### ¿Qué desventaja tienen los modelos neuronales frente a los n-gramas?
Son más lentos de entrenar y de desplegar.

### ¿Qué tres objetivos de modelado de lenguaje se distinguen?
Causal, $p(x_t \mid x_{<t})$. Condicional, $p(y \mid x)$. Enmascarado, $p(x_{\text{mask}} \mid x_{\text{resto}})$.

### Problema: calcula la probabilidad de una frase con un modelo de bigramas
Con un modelo de Markov de orden 1 se conocen $p(\text{el}) = 0{,}2$, $p(\text{gato} \mid \text{el}) = 0{,}1$ y $p(\text{duerme} \mid \text{gato}) = 0{,}3$. Calcula $p(\text{el gato duerme})$.
#### Paso 1
Con la regla de la cadena y la asunción de Markov, cada token depende solo del anterior:

$$\begin{aligned}&p(\text{el gato duerme}) \\ &= p(\text{el})\, p(\text{gato} \mid \text{el}) \\ &\quad \cdot p(\text{duerme} \mid \text{gato})\end{aligned}$$

#### Paso 2
$$0{,}2 \cdot 0{,}1 \cdot 0{,}3 = 0{,}006$$

## 2. Modelos causales

### ¿Cómo se entrena un NNLM?
Con ventanas deslizantes de tamaño $k+1$ sobre un texto. Los $k$ primeros tokens, con sus embeddings concatenados, son la entrada y se maximiza $p(x_t \mid x_{t-k} \dots x_{t-1})$. Los embeddings y el predictor se aprenden a la vez.

### ¿Cómo ve el contexto el NNLM de Bengio (2003)?
Concatena los embeddings de los $k$ tokens anteriores y los pasa por un perceptrón multicapa. Sigue siendo un modelo de Markov, con contexto fijo.

### ¿Cómo ve el contexto el RNNLM de Mikolov (2010)?
Con un estado recurrente que resume toda la historia y se actualiza con cada token. No hace la asunción de Markov.

### ¿Qué objetivo de entrenamiento tiene un RNNLM?
Maximizar $p(x_t \mid x_1 \dots x_{t-1})$, y el embedding contextual de un token es la salida de la RNN para ese token.

### ¿Qué problema tienen las RNN simples como modelos de lenguaje?
No aprenden bien dependencias largas. Por eso se usan LSTM.

### ¿Cómo evita un Transformer causal ver el futuro?
Con self-attention enmascarada: cada posición solo atiende a sí misma y a las anteriores, nunca a las posteriores.

### ¿Por qué los Transformers sustituyeron a las RNN en los modelos de lenguaje?
Porque no procesan la secuencia paso a paso, no necesitan backpropagation through time y se paralelizan. Eso permite redes más profundas, contextos más largos y muchísimos más datos.

### ¿Para qué sirve la atención multicabeza?
Una sola self-attention capta un patrón de relación entre tokens. Varias cabezas captan varios patrones a la vez.

## 3. Modelos concretos

### ¿Qué diferencia hay entre zero-shot y few-shot en un modelo de lenguaje?
En zero-shot el modelo resuelve una tarea nueva solo con una instrucción. En few-shot la resuelve viendo unos pocos ejemplos en el prompt. En ninguno de los dos casos se reentrena.

### ¿Qué demostró GPT-3 (2020)?
Que escalar el modelo mejora el aprendizaje few-shot: resolver tareas con unos pocos ejemplos en el prompt, sin reentrenar. Fue el primer modelo de lenguaje con signos de zero-shot y few-shot. Tiene 175B parámetros y se entrenó con 570 GB de texto.

### ¿Por qué InstructGPT (2022) introdujo RLHF?
Porque escalar no mejora la capacidad de seguir instrucciones. Hace falta alinear el modelo con las intenciones humanas mediante aprendizaje por refuerzo con retroalimentación humana.

### ¿Qué es ChatGPT según la clase?
La interfaz de chat para dialogar con un modelo GPT (GPT-3.5) entrenado con RLHF sobre diálogos.

### ¿Con qué técnica se alineó LLaMA 3.1, además del ajuste supervisado?
Con DPO (Direct Preference Optimization).

### Cita tres características de arquitectura de LLaMA 3.1.
RoPE como codificación de posición, Grouped-Query Attention y un contexto de 128k tokens. Tiene tamaños de 8B, 70B y 405B y se preentrenó con 15T de tokens multilingües.

### ¿Qué nueva ley de escala abrió GPT-o1?
La del tiempo de cómputo en inferencia: el modelo razona con una cadena de pensamiento antes de responder, y pensar más mejora el resultado. Así nacen los Large Reasoning Models (LRM).

### ¿Qué aportó DeepSeek-R1?
La primera receta pública de entrenamiento de un modelo de razonamiento (LRM). Su variante R1-Zero se entrena sin datos supervisados, solo con aprendizaje por refuerzo.

## 4. Subwords

### ¿Por qué no se usan palabras completas como vocabulario de un LLM?
Porque es intratable: hay cientos de miles de palabras sin contar erratas, lo que da matrices y un softmax enormes. Además, el token de palabra desconocida pierde información.

### ¿Por qué no se usan caracteres como vocabulario de un LLM?
Porque un carácter no tiene significado propio y las secuencias se vuelven varias veces más largas.

### ¿Cómo tokenizan las subwords?
Las palabras frecuentes se quedan enteras y las raras se parten en trozos con significado, como «token» más «ización». Los vocabularios rondan los 30 000 tokens.

### Cita dos algoritmos de tokenización en subwords.
BPE (Byte Pair Encoding) y WordPiece.

## 5. Decodificación

### En un modelo causal de generación abierta, ¿por qué se muestrea en lugar de buscar la secuencia más probable?
Porque la secuencia más probable suele ser un texto soso y repetitivo. Las personas no maximizan la probabilidad: buscan sorpresa, con un texto coherente y diverso.

### ¿Cómo se aplica la temperatura $T$ al softmax?
$$p_i = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$

Con $T < 1$ la distribución se vuelve más puntiaguda, y con $T > 1$, más plana.

### ¿Qué ocurre con el softmax cuando $T \to 0$ y cuando $T \to \infty$?
Con $T \to 0$ tiende a dar toda la probabilidad al logit mayor, como un argmax. Con $T \to \infty$ tiende a la distribución uniforme.

### Cita estrategias de muestreo además de la temperatura.
Top-k, top-p, min-p y contrastive search.

### En un modelo condicional, ¿se muestrea o se busca la secuencia más probable?
Se busca la más probable, porque hay una entrada $X$ que fija lo que se espera. Como la búsqueda exacta es intratable, se aproxima.

### ¿Qué diferencia hay entre la decodificación greedy y beam search?
Greedy elige en cada paso el token más probable. Beam search mantiene las $k$ mejores hipótesis parciales y al final se queda con la más probable de las que terminan en el token de fin.

### ¿Qué es la selección de hipótesis (hypothesis selection)?
Se mantienen las $k$ mejores hipótesis de beam search y se combinan (se reordenan) con un modelo de lenguaje causal.

### Problema: aplica softmax con temperatura a unos logits
Logits $z = [3, 1, 0]$. Calcula las probabilidades con $T = 1$ y con $T = 2$.
#### Paso 1
Con $T = 1$: $e^3 \approx 20{,}09$, $e^1 \approx 2{,}72$ y $e^0 = 1$, que suman $23{,}80$. Las probabilidades son $[0{,}844;\ 0{,}114;\ 0{,}042]$.
#### Paso 2
Con $T = 2$ los logits pasan a $[1{,}5;\ 0{,}5;\ 0]$. $e^{1{,}5} \approx 4{,}48$, $e^{0{,}5} \approx 1{,}65$ y $e^0 = 1$, que suman $7{,}13$. Las probabilidades son $[0{,}629;\ 0{,}231;\ 0{,}140]$.
#### Paso 3
Subir la temperatura aplana la distribución: el token más probable pierde peso y los otros dos lo ganan.

### Problema: compara greedy y beam search con $k = 2$
En el primer paso, $p(A) = 0{,}5$, $p(B) = 0{,}3$ y $p(C) = 0{,}2$. Tras A, $p(D) = 0{,}4$, $p(E) = 0{,}3$ y $p(F) = 0{,}3$. Tras B, $p(G) = 0{,}8$ y $p(H) = 0{,}2$. Las secuencias tienen dos tokens.
#### Paso 1
Greedy elige A (0,5) y después D (0,4). Probabilidad: $0{,}5 \cdot 0{,}4 = 0{,}20$.
#### Paso 2
Beam search con $k = 2$ conserva A y B tras el primer paso y expande las dos: AD = 0,20, AE = 0,15, AF = 0,15, BG = 0,24 y BH = 0,06.
#### Paso 3
La mejor es BG con 0,24, que greedy no encuentra porque descartó B en el primer paso.

### Demostración: el softmax con temperatura tiende a un argmax cuando $T \to 0$
#### Paso 1
Sea $T > 0$ y $z_m$ el mayor logit, que se supone único. Se divide numerador y denominador entre $e^{z_m / T}$:

$$p_i = \frac{e^{(z_i - z_m)/T}}{\sum_j e^{(z_j - z_m)/T}}$$

#### Paso 2
Para $j \neq m$, $z_j - z_m < 0$ y $e^{(z_j - z_m)/T} \to 0$ cuando $T \to 0$. El término $j = m$ vale siempre $e^0 = 1$.
#### Paso 3
Por tanto, $p_m = \dfrac{1}{1 + \sum_{j \neq m} e^{(z_j - z_m)/T}} \to 1$ y $p_i \to 0$ para $i \neq m$: toda la probabilidad va al logit mayor.

## 6. Leyes de escala

### ¿Qué predicen las leyes de escala de los modelos de lenguaje?
Que la pérdida (o la perplejidad) sigue una ley de potencias del número de parámetros, de tokens de entrenamiento y del cómputo.

### ¿Qué conclusión sacó Kaplan (2020) sobre las leyes de escala?
Que el factor clave es el número de parámetros.

### ¿Qué corrigió Chinchilla (Hoffmann, 2022) respecto a Kaplan?
Que parámetros y tokens deben crecer en proporciones parecidas. En consecuencia, casi todos los modelos de entonces tenían demasiados parámetros para los datos con que se entrenaban.

## 7. Evaluación y agentes

### ¿Por qué la perplejidad ya no basta para evaluar un LLM?
Porque no mide sus capacidades, sus riesgos ni sus límites en tareas concretas. Por eso se usan baterías de pruebas como HELM.

### ¿Qué riesgo tiene evaluar un LLM con benchmarks públicos?
La contaminación: que los datos de prueba hayan entrado en el entrenamiento y la puntuación sea engañosa.

### ¿Cómo evalúa Chatbot Arena a los LLM?
Con personas que comparan las respuestas de dos modelos elegidos al azar. Con esas comparaciones se calcula un ranking ELO.

### ¿Qué es un agente basado en LLM?
Un LLM que interactúa con el entorno, más un harness: el bucle que llama a herramientas, la gestión del contexto (resumen, truncado), las skills (cómo comportarse en ciertos escenarios), MCP (servidores que definen y ejecutan herramientas), los sandboxes para ejecutar código, el prompt de sistema y los subagentes.

## 8. Modelos condicionales

### ¿Cómo funciona un modelo encoder-decoder?
Estima $p(Y \mid X)$. El encoder procesa la entrada $x$ y el decoder predice cada $y_t$ a partir de $y_{<t}$ y de la representación del encoder.

### ¿Qué es el teacher forcing?
Entrenar el decoder dándole el token correcto anterior, en lugar del que él mismo generó.

### ¿Cómo se preentrenan modelos como BART y T5?
Con denoising: reconstruir un texto al que se han enmascarado, permutado o borrado partes. Después se ajustan para tareas como traducción o resumen.

### ¿Por qué han caído en desuso los modelos encoder-decoder?
El denoising calcula la pérdida en pocos tokens, lo que escala peor. El campo ha girado a modelos masivos multitarea. Además, frente a un decoder-only de $N$ parámetros, un encoder-decoder usa $2N$ y la mitad (el encoder) no contribuye directamente a generar.

## 9. Embeddings de palabras

### ¿Qué dice la hipótesis distribucional?
Que dos palabras son similares si aparecen en contextos similares (Firth, 1957). Por eso se puede intuir el significado de una palabra desconocida por su entorno.

### ¿Qué diferencia hay entre representaciones dispersas y densas de palabras?
Las dispersas tienen tantas dimensiones como el vocabulario (decenas de miles) y casi todo ceros. Las densas, o embeddings, tienen unos cientos de dimensiones y casi ningún cero.

### ¿Por qué se usa PPMI en lugar de la frecuencia cruda en una matriz palabra-palabra?
Porque la frecuencia cruda es una mala medida de asociación: palabras muy frecuentes como «the» aparecen con todo. PPMI (información mutua puntual positiva) mide cuánto más aparecen juntas dos palabras de lo esperable por azar y se queda con los valores positivos.

### ¿Qué es un embedding incontextual?
Una fila de una matriz $M \in \mathbb{R}^{\lvert V \rvert \times d}$, con $d$ la dimensión del embedding, entrenada como primera capa de una red. Tras entrenar se guarda $M$ y se descarta la red, y cada palabra tiene un único vector.

### ¿Qué diferencia hay entre CBOW y Skip-gram?
CBOW predice la palabra central a partir de su contexto. Skip-gram predice el contexto a partir de la palabra central. Los dos son de word2vec.

### ¿Qué es un embedding?
Un vector que representa un token, de modo que tokens parecidos quedan cerca en el espacio. Es incontextual si sale de la primera capa y siempre es el mismo para un token. Es contextual si sale de las capas intermedias o de la última y depende del contexto.

### ¿Cómo se obtiene un embedding contextual?
Se sustituye la matriz de embeddings por una red neuronal que procesa secuencias y se usan las salidas de sus capas ocultas, típicamente la última, como embedding de cada token.

### ¿Qué es la aritmética semántica de los embeddings?
Que las diferencias entre vectores capturan relaciones, como $\text{rey} - \text{hombre} + \text{mujer} \approx \text{reina}$.

### ¿Por qué funciona la aritmética semántica de los embeddings?
Porque cada dimensión actúa como una propiedad abstracta, como «femineidad» o «juventud», y sumar y restar vectores cambia esas propiedades. Sin embargo, no se sabe a priori qué propiedad codifica cada dimensión.

### ¿Qué problema de los embeddings incontextuales resuelven los contextuales?
La polisemia: «banco» de dinero y «banco» de la plaza tienen el mismo vector incontextual, pero un embedding contextual depende de la frase.

### ¿Con qué objetivos se preentrena BERT?
Masked language modeling, que enmascara en torno al 15 % de los tokens y los predice, y Next Sentence Prediction (NSP). Es un encoder Transformer bidireccional.

### ¿Qué es el paradigma de preentrenamiento y ajuste fino de BERT?
Transfer learning: se preentrena con mucho texto sin etiquetar y después se añaden capas encima y se reentrena con un corpus etiquetado para la tarea.

### ¿Qué cambia RoBERTa respecto a BERT?
Usa enmascarado dinámico y lotes mucho mayores, y elimina NSP sin perder resultados.

### ¿Qué cambia ALBERT respecto a BERT?
Factoriza la matriz de embeddings, comparte parámetros entre capas y sustituye NSP por Sentence Order Prediction.

### ¿Qué cambia ModernBERT respecto a BERT?
Moderniza BERT con técnicas nuevas como GeGLU, RoPE, Pre-Norm y atención alternante, y admite contextos largos.

### Problema: escribe los ejemplos de entrenamiento de CBOW y Skip-gram
Frase «el perro come pienso seco», palabra central «come» y ventana de 2 palabras a cada lado.
#### Paso 1
El contexto son las dos palabras a cada lado: el, perro, pienso y seco.
#### Paso 2
CBOW produce un ejemplo: entrada {el, perro, pienso, seco} y objetivo «come».
#### Paso 3
Skip-gram produce cuatro pares (entrada, objetivo): (come, el), (come, perro), (come, pienso) y (come, seco).

## 10. Embeddings de textos

### ¿Por qué no basta con promediar los embeddings de los tokens para representar un texto?
Porque en textos largos la media se diluye. Tampoco el token [CLS] de BERT sirve como representación sin entrenarlo para ello.

### ¿Cómo se entrenan los modelos de embeddings de textos?
Como dual encoders con aprendizaje contrastivo, para que los textos parecidos queden cerca y los distintos, lejos.

### ¿Cómo se entrena Sentence-BERT?
Como un encoder BERT siamés con datos de inferencia en lenguaje natural (NLI): si una hipótesis se sigue de la premisa, sus embeddings deben acercarse.

### ¿Qué tiene de particular Instructor como modelo de embeddings?
El embedding depende de la tarea, que se describe en el prompt.

### ¿Qué son los embeddings Matryoshka?
Representaciones que se pueden truncar a pocas dimensiones sin perder mucha calidad.

### ¿Qué es la interacción tardía de ColBERT?
Representar cada texto con una matriz de embeddings de tokens y compararlos al final. Para cada token de la consulta se toma su máxima similitud con los tokens del documento, y la puntuación es la suma de esos máximos.

### ¿Qué hace LLM2Vec?
Convierte un LLM causal en un encoder de textos, haciéndolo bidireccional y entrenándolo con un objetivo nuevo.

### ¿Cómo se hace clasificación zero-shot con embeddings?
Se verbalizan las etiquetas como texto y se asigna a cada ejemplo la etiqueta cuyo embedding es más parecido, sin ajuste fino.

### ¿Qué es el label tuning para clasificación few-shot?
Congelar el encoder y ajustar solo los embeddings de las etiquetas. Reentrenar el encoder entero con pocas muestras sobreajusta y obliga a guardar un modelo completo por tarea.

### ¿Cómo se entrena E5 y por qué no usa solo datos de NLI?
Se genera y cura un conjunto de pares débilmente supervisados a partir de C4: post y comentarios de Reddit, pregunta y respuesta de StackExchange, título y primer párrafo de Wikipedia, y título y resumen de artículos y periódicos. Así hay muchos más datos que con NLI.

### ¿Qué es Sentence-T5?
La misma idea que Sentence-BERT con T5 como encoder. Muestra que también se pueden producir embeddings de textos con modelos encoder-decoder.

### ¿Qué combina el modelo M3?
Representación densa, léxica y multivector (al estilo de ColBERT) a la vez, y es multilingüe.

### Cita aplicaciones de los embeddings de textos.
Recuperación de información, RAG, entrada a clasificadores, clustering, visualización y clasificación zero-shot y few-shot.
