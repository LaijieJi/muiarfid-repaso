# PEE U1 - Introducción

## 1.1 Predicción estructurada

### ¿Qué es la predicción no estructurada?
Es aquella en la que la salida $y$ es un único valor: una etiqueta de $\{1,\dots,K\}$ o un número real. La función de predicción $f:\mathcal{X}\to\mathbb{R}$ asigna una hipótesis $y=f(x)$ a cada observación $x$.

### ¿Qué tres tareas son predicción no estructurada y qué salida tiene cada una?
| Tarea | Salida |
|---|---|
| Clasificación binaria | $y\in\{-1,1\}$ |
| Clasificación multiclase | $y\in\{1,\dots,K\}$ |
| Regresión | $y\in\mathbb{R}$ |

### ¿Qué es la predicción estructurada?
Es la predicción en la que la hipótesis $y\in\mathcal{Y}$ es un objeto complejo con estructura, como una secuencia, un árbol de análisis o un grafo. La función $f:\mathcal{X}\to\mathcal{Y}$ asigna ese objeto a cada observación $x$.

### ¿Qué diferencia hay entre predicción estructurada y no estructurada si la entrada puede ser cualquier objeto en ambas?
La diferencia está solo en la salida. La observación $x\in\mathcal{X}$ puede ser texto, imagen o señal en los dos casos. En la no estructurada $y$ es un número o una etiqueta, mientras que en la estructurada $y$ es un objeto como una secuencia, un árbol o un grafo.

### ¿Por qué no basta con clasificadores como regresión logística, SVM o redes neuronales cuando la salida es un árbol?
Porque estos algoritmos predicen una salida no estructurada. Con árboles o grafos el espacio de salidas es mucho más grande y tiene estructura interna, así que hace falta un modelo que la aproveche.

### ¿Qué entrada y qué salida tienen la traducción automática y el análisis sintáctico?
| Tarea | Entrada | Salida |
|---|---|---|
| Traducción automática | Secuencia de texto | Secuencia de texto |
| Análisis sintáctico | Secuencia de texto | Árbol de análisis |

### ¿Qué entrada y qué salida tienen el reconocimiento automático del habla y el reconocimiento de texto manuscrito?
El reconocimiento del habla recibe una señal de voz y devuelve el texto transcrito, es decir, una secuencia. El reconocimiento de texto manuscrito recibe imágenes y también devuelve el texto transcrito.

### ¿Qué entrada y qué salida tienen el análisis de escenas y el reconocimiento de expresiones matemáticas?
Ambos reciben imágenes. El análisis de escenas devuelve un grafo con la disposición de los objetos de la escena. El reconocimiento de expresiones matemáticas devuelve grafos e hipergrafos que describen la expresión.

### ¿Qué estructuras de salida aparecen en las tareas de procesamiento del lenguaje natural?
Etiquetado de categorías gramaticales y extracción de información producen secuencias. El análisis sintáctico produce árboles. La traducción automática produce frases o grafos de palabras.

### ¿Qué estructuras de salida aparecen en visión, habla, bioinformática y robótica?
La visión produce frases o grafos de relaciones (análisis de escenas) y frases o grafos de palabras (texto manuscrito). El habla produce transcripciones, ya sean frases o grafos de palabras, y señal de audio en la síntesis. La bioinformática produce árboles o grafos (estructura de proteínas) y la robótica produce secuencias de acciones (planificación).

### ¿Por qué buscar $f(x)=y$ directamente en $\mathcal{Y}$ suele ser intratable?
Porque $\mathcal{Y}$ suele ser potencialmente infinito. No se puede recorrer ni evaluar todos los objetos de salida posibles para quedarse con el mejor.

### ¿Cuál es la solución estructural al problema de que $\mathcal{Y}$ sea enorme?
Suponer una estructura concreta en $\mathcal{Y}$ y definir un modelo $\mathcal{M}$ que la caracterice, de modo que el conjunto de hipótesis queda reducido a $\mathcal{Y}(\mathcal{M})\subseteq\mathcal{Y}$. La predicción pasa a ser $f(x)=y\in\mathcal{Y}(\mathcal{M})$.

### ¿Qué ventaja da restringir las hipótesis a un subconjunto $\mathcal{Y}(\mathcal{M})\subseteq\mathcal{Y}$ definido por un modelo?
Según el modelo $\mathcal{M}$ elegido, la solución se puede encontrar en tiempo polinómico. Por eso la elección del modelo es la decisión central de la predicción estructurada.

## 1.2 Predicción de secuencias

### ¿Qué es una secuencia en predicción de secuencias y qué ejemplos hay?
Un texto es una secuencia de palabras o incluso de letras. Una locución hablada es una secuencia de vectores de parámetros. Un vídeo es una secuencia de fotogramas.

### ¿Qué son los autómatas finitos aceptores y para qué se usan?
Son representaciones compactas de conjuntos regulares sobre las que se busca de forma eficiente. Se usan para localizar patrones, segmentar en unidades (tokenización) y comprimir.

### ¿Qué son los transductores de estados finitos y para qué se usan?
Son representaciones compactas de relaciones binarias racionales, que se pueden buscar y combinar de forma eficiente. Se usan, por ejemplo, en diccionarios y en reglas dependientes del contexto.

### ¿Qué añaden los autómatas ponderados a los autómatas finitos y qué ejemplos da el profesor?
Añaden pesos, que suelen codificar la incertidumbre (probabilidades). Los modelos de lenguaje de $n$-gramas y los modelos ocultos de Markov (HMM) son ejemplos.

### ¿En qué se distinguen autómata aceptor, transductor y autómata ponderado?
| Modelo | Qué representa | Ejemplo de uso |
|---|---|---|
| Aceptor | Conjunto regular de secuencias | Tokenización, búsqueda de patrones |
| Transductor | Relación binaria racional entre secuencias | Diccionarios, reglas dependientes del contexto |
| Autómata ponderado | Secuencias con peso (incertidumbre) | Modelos de $n$-gramas, HMM |

### ¿Cuáles son los siete componentes de un autómata ponderado?
$A=(\Sigma,Q,I,F,\delta,\lambda,\rho)$ con alfabeto de entrada finito $\Sigma$, conjunto de estados $Q$, estados iniciales $I\subseteq Q$, estados finales $F\subseteq Q$, función de transición $\delta$, función de peso inicial $\lambda$ y función de peso final $\rho$.

### ¿Qué dominio tienen la función de peso inicial $\lambda$ y la de peso final $\rho$?
$\lambda:I\to\mathbb{K}$ da un peso a cada estado inicial y $\rho:F\to\mathbb{K}$ da un peso a cada estado final. Los pesos son valores del conjunto $\mathbb{K}$.

### ¿Qué puede consumir una transición de un autómata ponderado?
Un símbolo del alfabeto $\Sigma$ o la cadena vacía $\epsilon$, porque $\delta$ se define sobre $Q\times(\Sigma\cup\{\epsilon\})\times\mathbb{K}\times Q$. Cada transición lleva además un peso de $\mathbb{K}$.

### ¿Se permite más de un estado inicial en un autómata ponderado?
Sí. La definición toma un conjunto de estados iniciales $I\subseteq Q$, y cada uno tiene su peso inicial $\lambda$. Lo mismo ocurre con los estados finales y $\rho$.

### En el dibujo de un autómata ponderado, ¿qué significan la etiqueta $a/1$ de un arco y la etiqueta $q/2$ de un estado?
El arco consume el símbolo $a$ con peso 1. Un estado con etiqueta $q/2$ es el estado $q$ con peso final 2, y se dibuja con doble círculo por ser final.

### ¿Qué es OpenFst?
Una biblioteca de código abierto en C++, desarrollada en Google, para transductores de estados finitos ponderados. Es el entorno que cita el profesor en esta introducción.

## 1.3 Análisis sintáctico

### ¿Qué es el análisis sintáctico visto como problema de búsqueda?
Dada una cadena $x\in\Sigma^*$ y una gramática $G$, hay que encontrar un árbol $t\in\mathcal{T}$ cuyo rendimiento sea $x$, es decir, $\mathrm{yield}(t)=x$. Solo se puede si $x\in L(G)$.

### ¿Qué es el rendimiento (yield) de un árbol de análisis?
Es la cadena que se obtiene al leer las hojas del árbol de izquierda a derecha. Cada árbol de análisis de $x$ tiene rendimiento $x$.

### ¿Qué tipo de salida produce un analizador sintáctico para una frase como «Pierre Vinken, 61 years old, will join the board…»?
Un árbol de análisis con etiquetas de categoría en las hojas y nodos internos que agrupan sintagmas como NP, VP o PP. El ejemplo de la clase es una frase del corpus de Marcus et al. (1993) que empieza por «Pierre Vinken, 61 years old, will join the board…».

### ¿Por qué se usan modelos gramaticales para predecir árboles?
Son el modelo más simple y natural para estructuras de árbol y tienen un marco formal bien conocido. Además, son compactos (pocos parámetros libres) y se comportan bien frente a la ambigüedad.

### ¿Qué ventaja tienen las gramáticas independientes del contexto para el lenguaje natural?
Representan bien las dependencias a largo plazo de las restricciones sintácticas y semánticas del lenguaje natural.

### ¿Cuál es la definición formal de una gramática independiente del contexto (CFG)?
$G=(\Sigma,N,S,P)$ con $\Sigma$ el conjunto de terminales, $N$ el de no terminales con $N\cap\Sigma=\emptyset$, $S\in N$ el símbolo inicial y $P$ el conjunto de reglas $A\to\alpha$ con $A\in N$ y $\alpha\in(N\cup\Sigma)^*$.

### ¿Qué significa "independiente del contexto" en una regla $A\to\alpha$?
Que el lado izquierdo es un único no terminal $A$. Por tanto, $A$ se puede reescribir por $\alpha$ sin importar qué símbolos tiene alrededor.

### ¿Cuándo se dice que $\delta A\gamma$ deriva directamente $\delta\alpha\gamma$?
Cuando existe una regla $(A\to\alpha)\in P$, con $\delta,\gamma\in(N\cup\Sigma)^*$. Se escribe $\delta A\gamma\Rightarrow\delta\alpha\gamma$ y consiste en aplicar una regla a un solo no terminal.

### ¿Qué significa que $\alpha$ deriva $\beta$, escrito $\alpha\overset{*}{\Rightarrow}\beta$?
Que existe una secuencia $\alpha=\alpha_0\Rightarrow\alpha_1\Rightarrow\dots\Rightarrow\alpha_m=\beta$ de derivaciones directas. Es la clausura de la derivación directa.

### ¿Cómo se define el lenguaje generado por una gramática $G$?
$L(G)=\{x\in\Sigma^*: S\overset{+}{\Rightarrow}x\}$, el conjunto de cadenas de terminales que se derivan del símbolo inicial en uno o más pasos.

### ¿Qué equivalencia hay entre derivación y árbol de análisis en una CFG?
Que son equivalentes: $x\in L(G)$ si y solo si $S\overset{+}{\Rightarrow}x$ si y solo si existe un árbol $t\in\mathcal{T}$ con $\mathrm{yield}(t)=x$. Por eso reconocer una cadena y encontrar su árbol son dos caras del mismo problema.

### ¿Qué significa que una gramática es ambigua?
Que alguna cadena de $L(G)$ tiene más de un árbol de análisis. En la gramática de «astronomers saw stars with telescopes» la cadena tiene dos árboles.

### Con las reglas $NP\to NP\ PP$ y $VP\to VP\ PP$, ¿qué dos lecturas tiene «astronomers saw stars with telescopes»?
En una, el sintagma preposicional se une a «stars» mediante $NP\to NP\ PP$, de modo que las estrellas son las que tienen telescopios. En la otra se une al verbo mediante $VP\to VP\ PP$, de modo que se usa el telescopio para ver. Es una ambigüedad de adjunción del sintagma preposicional.

### ¿Cuándo está una gramática en forma normal de Chomsky (FNC)?
Cuando toda regla es de la forma $A\to BC$, con $A,B,C\in N$, o de la forma $A\to b$, con $b\in\Sigma$. CKY exige esta forma.

### ¿Por qué el algoritmo CKY necesita la gramática en FNC?
Porque solo sabe combinar dos casillas (regla $A\to BC$) y rellenar la diagonal con terminales (regla $A\to b$). Una regla con tres símbolos o una regla unaria entre no terminales no encaja en sus bucles.

### ¿Qué calcula el algoritmo CKY?
Una tabla $t$ de análisis. Su invariante es $A\in t[i,i+l]$ si y solo si $A\overset{*}{\Rightarrow}x_{i+1}\dots x_{i+l}$, o sea, $A$ genera la subcadena de longitud $l$ que empieza tras la posición $i$.

### ¿Qué subcadena cubre la casilla $t[i,j]$ de CKY y cuál es su longitud?
Cubre $x_{i+1}\dots x_j$, y su longitud es $l=j-i$. Los índices empiezan en 0, así que la frase completa es $t[0,T]$.

### ¿Cómo se rellena la diagonal de la tabla CKY?
Para cada $i$ de $0$ a $T-1$ se pone en $t[i,i+1]$ todo no terminal $A$ con una regla $A\to x_{i+1}$. Es el caso base, con subcadenas de una palabra.

### ¿Cómo se rellena una casilla $t[i,i+l]$ con $l\ge 2$ en CKY?
Para cada punto de corte $k=1,\dots,l-1$ se añade todo $A$ con regla $A\to BC$ tal que $B\in t[i,i+k]$ y $C\in t[i+k,i+l]$. Se prueban todos los cortes y se acumulan los resultados.

### ¿En qué orden se recorren las casillas en CKY y por qué?
Por longitud $l$ creciente, de 2 a $T$, y dentro de cada longitud por $i$. Así, cuando se rellena una casilla, ya están completas las dos subcasillas más cortas que necesita.

### ¿Cuándo acepta CKY una frase?
Cuando $S\in t[0,T]$, es decir, el símbolo inicial genera la frase entera. Si en esa casilla hay otros no terminales pero no $S$, la frase no pertenece a $L(G)$.

### ¿Por qué el coste de CKY es cúbico en la longitud de la frase?
Por los tres bucles anidados: la longitud $l$, la posición $i$ y el corte $k$ recorren cada uno del orden de $T$ valores. Dentro de cada combinación hay que mirar además las reglas de la gramática.

### ¿Significa una casilla vacía en CKY que la frase no pertenece al lenguaje?
No. Una casilla vacía solo dice que ningún no terminal genera esa subcadena. La frase se rechaza únicamente si $S\notin t[0,T]$, y puede aceptarse aunque haya casillas vacías por el camino.

### ¿Puede una casilla de CKY contener varios no terminales?
Sí. Un mismo tramo puede ser generado por varios no terminales, por ejemplo $S$ y $A$ a la vez. Hay que guardar todos porque cualquiera puede ser el lado izquierdo de una regla en una casilla superior.

### En una tabla CKY que guarda punteros, ¿qué significa una entrada como $7:(S,1,5)$?
Es la entrada número 7, un $S$ construido con las entradas hijas 1 (izquierda) y 5 (derecha). Una entrada $1:(A,0,0)$ está en la diagonal y no tiene hijas (0). Siguiendo los punteros desde una entrada $S$ de $t[0,T]$ se recupera el árbol.

### ¿Qué indica que una casilla de CKY tenga dos entradas con el mismo no terminal?
Que hay dos análisis distintos del mismo tramo con ese no terminal. En el ejemplo de las transparencias, $t[0,3]$ contiene dos entradas $S$ (con cortes en $k=1$ y en $k=2$), de modo que `a a b` tiene dos árboles.

### ¿Cómo se pasa de reconocer a analizar con CKY?
Guardando, en cada entrada, la regla y las dos entradas hijas que la produjeron. Al terminar, se parte de una entrada $S$ de $t[0,T]$ y se desciende siguiendo los punteros. Si hay varias entradas $S$, hay varios árboles.

### ¿Cuántas reglas usa un árbol de análisis en FNC de una frase de $T$ palabras?
$2T-1$ reglas, porque hay $T$ reglas léxicas $A\to b$ y $T-1$ reglas binarias $A\to BC$. Es una comprobación útil del resultado de un análisis a mano.

### Problema: CKY con una gramática de oraciones simples en FNC
Sea la gramática en FNC con símbolo inicial $S$:

$$S\to NP\ VP,\quad VP\to V\ NP,\quad NP\to D\ N,\quad NP\to \texttt{dogs}$$
$$D\to \texttt{the},\quad N\to \texttt{cat},\quad V\to \texttt{saw}$$

Aplica CKY a la frase `dogs saw the cat` ($T=4$), escribe la tabla completa y decide si la frase pertenece al lenguaje.
#### Paso 1
Se numeran las palabras: $x_1=$ `dogs`, $x_2=$ `saw`, $x_3=$ `the`, $x_4=$ `cat`. Diagonal ($l=1$), con las reglas $A\to b$:

- $t[0,1]=\{NP\}$ porque $NP\to\texttt{dogs}$.
- $t[1,2]=\{V\}$ porque $V\to\texttt{saw}$.
- $t[2,3]=\{D\}$ porque $D\to\texttt{the}$.
- $t[3,4]=\{N\}$ porque $N\to\texttt{cat}$.

#### Paso 2
Longitud $l=2$, un solo corte $k=1$ en cada casilla:

- $t[0,2]$: se combinan $t[0,1]=\{NP\}$ y $t[1,2]=\{V\}$. No hay regla $A\to NP\ V$, así que $t[0,2]=\emptyset$.
- $t[1,3]$: se combinan $\{V\}$ y $\{D\}$. No hay regla $A\to V\ D$, así que $t[1,3]=\emptyset$.
- $t[2,4]$: se combinan $\{D\}$ y $\{N\}$. La regla $NP\to D\ N$ da $t[2,4]=\{NP\}$.

#### Paso 3
Longitud $l=3$, con cortes $k=1$ y $k=2$:

- $t[0,3]$: con $k=1$ se mira $t[0,1]=\{NP\}$ y $t[1,3]=\emptyset$, y con $k=2$ se mira $t[0,2]=\emptyset$ y $t[2,3]=\{D\}$. No se puede combinar nada, así que $t[0,3]=\emptyset$.
- $t[1,4]$: con $k=1$ se mira $t[1,2]=\{V\}$ y $t[2,4]=\{NP\}$, y la regla $VP\to V\ NP$ da $VP$. Con $k=2$ se mira $t[1,3]=\emptyset$ y no aporta nada. Resulta $t[1,4]=\{VP\}$.

#### Paso 4
Longitud $l=4$, casilla $t[0,4]$ con cortes $k=1,2,3$:

- $k=1$: $t[0,1]=\{NP\}$ y $t[1,4]=\{VP\}$. La regla $S\to NP\ VP$ da $S$.
- $k=2$: $t[0,2]=\emptyset$, no aporta nada.
- $k=3$: $t[0,3]=\emptyset$, no aporta nada.

Por tanto, $t[0,4]=\{S\}$.

#### Paso 5
Tabla completa (fila $i$, columna $j$):

| | $j=1$ | $j=2$ | $j=3$ | $j=4$ |
|---|---|---|---|---|
| $i=0$ | NP | ∅ | ∅ | **S** |
| $i=1$ | | V | ∅ | VP |
| $i=2$ | | | D | NP |
| $i=3$ | | | | N |

Como $S\in t[0,4]$, la frase `dogs saw the cat` pertenece al lenguaje. Aunque $t[0,2]$ y $t[0,3]$ están vacías, la frase se acepta.

#### Paso 6
El árbol sale de seguir el corte que produjo $S$: $S\to NP\ VP$ con $NP=t[0,1]$ y $VP=t[1,4]$. Ese $VP$ viene de $V\ NP$ con $V=t[1,2]$ y $NP=t[2,4]$, y ese $NP$ de $D\ N$. El árbol es $S(NP(\texttt{dogs}),\ VP(V(\texttt{saw}),\ NP(D(\texttt{the}),\ N(\texttt{cat}))))$. Usa 7 reglas, que es $2T-1$ con $T=4$.

### Problema: CKY que rechaza una frase con una gramática ambigua
Sea la gramática en FNC con símbolo inicial $S$:

$$S\to A\ S\mid b,\qquad A\to A\ S\mid A\ A\mid a$$

Aplica CKY a la frase `a b a` ($T=3$), escribe la tabla y decide si pertenece al lenguaje.
#### Paso 1
Diagonal con $A\to a$ y $S\to b$:

- $t[0,1]=\{A\}$ porque $x_1=a$.
- $t[1,2]=\{S\}$ porque $x_2=b$.
- $t[2,3]=\{A\}$ porque $x_3=a$.

#### Paso 2
Longitud $l=2$, un solo corte $k=1$:

- $t[0,2]$: se combinan $A$ (de $t[0,1]$) y $S$ (de $t[1,2]$). La regla $S\to A\ S$ da $S$ y la regla $A\to A\ S$ da $A$, de modo que $t[0,2]=\{S,A\}$.
- $t[1,3]$: se combinan $S$ y $A$. No hay ninguna regla con lado derecho $S\ A$, así que $t[1,3]=\emptyset$.

#### Paso 3
Longitud $l=3$, casilla $t[0,3]$ con cortes $k=1$ y $k=2$:

- $k=1$: $t[0,1]=\{A\}$ y $t[1,3]=\emptyset$, no aporta nada.
- $k=2$: $t[0,2]=\{S,A\}$ y $t[2,3]=\{A\}$. Hay dos pares posibles. El par $S\ A$ no tiene regla, pero el par $A\ A$ da $A$ con la regla $A\to A\ A$.

Por tanto, $t[0,3]=\{A\}$.

#### Paso 4
Tabla completa:

| | $j=1$ | $j=2$ | $j=3$ |
|---|---|---|---|
| $i=0$ | A | S, A | A |
| $i=1$ | | S | ∅ |
| $i=2$ | | | A |

$S\notin t[0,3]$, así que `a b a` no pertenece al lenguaje, aunque $A$ sí genere esa cadena.

#### Paso 5
Comprobación independiente: toda cadena derivada de $S$ acaba en $b$, porque $S\to A\ S$ deja $S$ en el extremo derecho y $S\to b$ lo cierra con $b$. Como `a b a` acaba en $a$, no puede estar en $L(G)$. Coincide con el resultado de la tabla.

### Demostración: un árbol de análisis en FNC de una frase de $T$ palabras usa $2T-1$ reglas
Demuestra que, con la gramática en FNC, cualquier árbol de análisis de una frase de $T$ palabras usa exactamente $2T-1$ reglas.
#### Paso 1
Cada palabra es la hoja de una regla léxica $A\to b$, y no hay otras reglas que produzcan terminales. Por tanto, hay exactamente $T$ reglas léxicas.

#### Paso 2
Si se quitan las palabras, queda un árbol binario cuyas hojas son los $T$ preterminales y cuyos nodos internos son reglas $A\to BC$. Se prueba por inducción sobre $T$ que ese árbol tiene $T-1$ nodos internos.

#### Paso 3
Base: con $T=1$ el árbol es una sola hoja y tiene $0$ nodos internos, que es $T-1$. Paso inductivo: la raíz de un árbol con $T$ hojas tiene dos subárboles con $T_1$ y $T_2$ hojas, con $T_1+T_2=T$ y ambos mayores o iguales que 1. Por hipótesis tienen $T_1-1$ y $T_2-1$ nodos internos, y con la raíz suman $(T_1-1)+(T_2-1)+1=T-1$.

#### Paso 4
En total, $T$ reglas léxicas y $T-1$ reglas binarias suman $2T-1$ reglas. En `dogs saw the cat` salen $2\cdot4-1=7$, y en la derivación de `a a b` de las transparencias salen $2\cdot3-1=5$.
