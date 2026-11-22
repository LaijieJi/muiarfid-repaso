# PEE U2 - Modelos

## 2.1 Introducción: modelos estadísticos

### ¿Qué diferencia hay entre un modelo generativo y uno discriminativo en predicción estructurada?
Un modelo generativo aprende la probabilidad conjunta $P(x, y)$ y predice con $\arg\max_y P(x \mid y)\,P(y)$. Un modelo discriminativo aprende directamente la condicional $P(y \mid x)$ y predice con $\arg\max_y P(y \mid x)$.

### ¿Cuál es la regla de decisión de la teoría estadística de la decisión para predecir $y$ a partir de $x$?
Elegir la hipótesis más probable dada la observación: $\hat{y} = f(x) = \arg\max_{y \in \mathcal{Y}(M)} P(y \mid x)$. Todo lo demás del tema es cómo modelar y calcular esa probabilidad.

### ¿Por qué en un modelo generativo basta maximizar $P(x \mid y)\,P(y)$ y no hace falta $P(x)$?
Porque $P(y \mid x) = P(x, y)/P(x)$ y el denominador $P(x)$ no depende de $y$. Maximizar sobre $y$ da el mismo resultado con o sin él.

### ¿Qué tres condiciones cumple un lenguaje probabilístico $(L, \phi)$?
Si $x \notin L$ entonces $\phi(x) = 0$. Si $x \in L$ entonces $0 < \phi(x) \le 1$. Y la suma $\sum_{x \in L} \phi(x)$ vale 1.

### ¿Qué modelos de predicción no estructurada son generativos y cuáles discriminativos?
Es generativo Naive Bayes. Son discriminativos la regresión logística, el perceptrón, las SVM y las redes neuronales. En predicción estructurada los equivalentes son PFSA, HMM y PCFG (generativos) y CRF, perceptrón estructurado, SVM estructurada y redes recurrentes codificador-decodificador (discriminativos).

## 2.2 Modelos generativos: PFSA y HMM

### ¿Qué componentes tiene un autómata finito probabilístico (PFSA)?
Una tupla $A = (\Sigma, Q, \delta, I, F, P)$: alfabeto, estados, transiciones, probabilidad inicial $I$ de cada estado, probabilidad final $F$ de cada estado y probabilidad $P$ de cada transición.

### ¿Qué condiciones de normalización debe cumplir un PFSA?
Las probabilidades iniciales suman 1: $\sum_q I(q) = 1$. Y para cada estado, su probabilidad final más las de todas sus transiciones salientes suman 1: $F(q) + \sum_{a, q'} P(q, a, q') = 1$.

### ¿Cómo se calcula la probabilidad de aceptar una cadena $x$ por un camino concreto $\pi$ en un PFSA?
Se multiplica la probabilidad inicial del primer estado, las probabilidades de las transiciones del camino y la probabilidad final del último estado: $P_A(x, \pi) = I(s_0)\prod_{i} P(s_{i-1}, x_i, s_i)\,F(s_k)$.

### ¿Cómo se pasa de la probabilidad de un camino a la probabilidad de una cadena en un PFSA?
Sumando sobre todos los caminos que aceptan la cadena: $P_A(x) = \sum_{\pi \in \Pi_A(x)} P_A(x, \pi)$. Se suma porque el autómata puede ser no determinista y varios caminos dan la misma cadena.

### ¿En qué se diferencian la probabilidad de una cadena y la probabilidad de su mejor camino en un PFSA?
La de la cadena suma las probabilidades de todos los caminos y la del mejor camino toma solo el máximo: $\hat{P}_A(x) = \max_\pi P_A(x, \pi)$. Por tanto, $\hat{P}_A(x) \le P_A(x)$, con igualdad solo si hay un único camino con probabilidad positiva.

### ¿Qué lenguaje acepta un PFSA?
El de las cadenas con probabilidad positiva: $L(A) = \{x \mid P_A(x) > 0\}$.

### ¿Qué es un HMM según la definición de PEE y qué lo distingue de un PFSA?
Es una tupla $M = (\Sigma, Q, F, I, T, E)$ con un estado final especial $q_f$ que no emite. Las probabilidades de emisión $E(q, a)$ van asociadas a los estados y no a las transiciones, mientras que en el PFSA los símbolos salen en las transiciones y hay probabilidad final $F(q)$.

### ¿Qué condiciones de normalización cumple un HMM?
$\sum_q I(q) = 1$ sobre los estados distintos de $q_f$. Para cada estado $q \ne q_f$, las transiciones salientes suman 1, $\sum_{q'} T(q, q') = 1$, y las emisiones también, $\sum_a E(q, a) = 1$.

### ¿Cómo se calcula la probabilidad conjunta de una cadena y un camino en un HMM?
Se multiplica la probabilidad inicial, las transiciones entre estados consecutivos y la emisión de cada símbolo por el estado donde se emite: $P_M(x, \pi) = I(s_1)\prod_{i \ge 2} T(s_{i-1}, s_i)\prod_{i} E(s_i, x_i)$. En los ejemplos de clase se incluye además la transición final hacia $q_f$.

### En un HMM con estado final $q_f$, ¿por qué el camino tiene un estado más que símbolos tiene la cadena?
Porque $q_f$ no emite. Cada símbolo lo emite un estado, y el último estado emisor pasa a $q_f$ mediante una transición, que también se multiplica.

### ¿Qué relación hay entre los HMM y los PFSA en poder de representación?
Dado un HMM existe un PFSA con la misma probabilidad para todas las cadenas, $P_M(x) = P_A(x)$. Por tanto, los HMM no representan más lenguajes probabilísticos que los PFSA.

### ¿Cuál es la trampa típica al calcular un camino de un HMM?
Mezclar qué se multiplica en cada paso. Cada estado aporta su emisión $E(q, x_i)$ del símbolo que emite en ese instante, y cada paso entre estados aporta una transición $T$. Olvidar la última transición hacia $q_f$ o la emisión de un estado da un resultado erróneo.

### Problema: probabilidad de una cadena y su mejor camino en un PFSA
Un PFSA tiene tres estados con $I(q_0) = 1$ y $I(q_1) = I(q_2) = 0$. Sus probabilidades finales son $F(q_0) = 0{,}1$, $F(q_1) = 0{,}2$ y $F(q_2) = 0{,}6$. Las transiciones son $(q_0, a, q_1)$ con 0,5, $(q_0, a, q_2)$ con 0,4, $(q_1, a, q_1)$ con 0,3, $(q_1, b, q_2)$ con 0,5 y $(q_2, b, q_2)$ con 0,4. Calcula $P_A(a)$, $P_A(ab)$ y el mejor camino de $ab$.
#### Paso 1
Comprueba que es un PFSA. En $q_0$: $0{,}1 + 0{,}5 + 0{,}4 = 1$. En $q_1$: $0{,}2 + 0{,}3 + 0{,}5 = 1$. En $q_2$: $0{,}6 + 0{,}4 = 1$. Como $I(q_0) = 1$, todos los caminos empiezan en $q_0$.
#### Paso 2
Caminos de $a$. Por $q_0 q_1$: $1 \cdot 0{,}5 \cdot F(q_1) = 0{,}5 \cdot 0{,}2 = 0{,}10$. Por $q_0 q_2$: $1 \cdot 0{,}4 \cdot F(q_2) = 0{,}4 \cdot 0{,}6 = 0{,}24$. Suma: $P_A(a) = 0{,}34$.
#### Paso 3
Caminos de $ab$. Por $q_0 q_1 q_2$: $1 \cdot 0{,}5 \cdot 0{,}5 \cdot F(q_2) = 0{,}25 \cdot 0{,}6 = 0{,}150$. Por $q_0 q_2 q_2$: $1 \cdot 0{,}4 \cdot 0{,}4 \cdot 0{,}6 = 0{,}096$. No hay más, porque desde $q_1$ la $b$ solo va a $q_2$ y desde $q_0$ la $a$ va a $q_1$ o $q_2$.
#### Paso 4
$P_A(ab) = 0{,}150 + 0{,}096 = 0{,}246$. El mejor camino es $q_0 q_1 q_2$, con $\hat{P}_A(ab) = 0{,}150$. Es menor que $P_A(ab)$ porque la cadena tiene dos caminos y el máximo solo recoge uno.

### Problema: probabilidad de una cadena en un HMM con estado final
Un HMM tiene estados $q_1$, $q_2$ y el final $q_3 = q_f$. Inicial: $I(q_1) = 0{,}6$ y $I(q_2) = 0{,}4$. Transiciones: $T(q_1, q_1) = 0{,}5$, $T(q_1, q_2) = 0{,}3$, $T(q_1, q_3) = 0{,}2$, $T(q_2, q_1) = 0{,}2$, $T(q_2, q_2) = 0{,}5$, $T(q_2, q_3) = 0{,}3$. Emisiones: $E(q_1, a) = 0{,}8$, $E(q_1, b) = 0{,}2$, $E(q_2, a) = 0{,}1$, $E(q_2, b) = 0{,}9$. Calcula $P_M(ab)$ y el mejor camino.
#### Paso 1
La cadena tiene dos símbolos, así que los caminos son $s_1 s_2 q_3$ con $s_1, s_2 \in \{q_1, q_2\}$. Cada uno vale $I(s_1)\,E(s_1, a)\,T(s_1, s_2)\,E(s_2, b)\,T(s_2, q_3)$. Son cuatro caminos.
#### Paso 2
Camino $q_1 q_1$: $0{,}6 \cdot 0{,}8 \cdot 0{,}5 \cdot 0{,}2 \cdot 0{,}2 = 0{,}0096$. Camino $q_1 q_2$: $0{,}6 \cdot 0{,}8 \cdot 0{,}3 \cdot 0{,}9 \cdot 0{,}3 = 0{,}03888$.
#### Paso 3
Camino $q_2 q_1$: $0{,}4 \cdot 0{,}1 \cdot 0{,}2 \cdot 0{,}2 \cdot 0{,}2 = 0{,}00032$. Camino $q_2 q_2$: $0{,}4 \cdot 0{,}1 \cdot 0{,}5 \cdot 0{,}9 \cdot 0{,}3 = 0{,}0054$.
#### Paso 4
$P_M(ab) = 0{,}0096 + 0{,}03888 + 0{,}00032 + 0{,}0054 = 0{,}0542$. El mejor camino es $q_1 q_2$, con $0{,}03888$, que aporta casi el 72 % de la probabilidad total.

## 2.2 Modelos generativos: PCFG y consistencia

### ¿Qué es una gramática independiente del contexto probabilística (PCFG)?
Un par $G_\theta = (G, P)$ formado por una gramática $G = (\Sigma, N, S, \mathcal{P})$ y una función $P$ que da a cada regla una probabilidad en $(0, 1]$.

### ¿Qué condición de normalización cumplen las probabilidades de las reglas de una PCFG?
Para cada no terminal $A_i$, las probabilidades de todas las reglas con $A_i$ en la parte izquierda suman 1: $\sum_j P(A_i \to \alpha_j) = 1$.

### ¿Cómo se calcula la probabilidad de un árbol de análisis en una PCFG?
Como el producto de las probabilidades de las reglas usadas: $P_\theta(x, t_x) = \prod_j P(r_j)$. Si una regla se usa varias veces, su probabilidad se multiplica una vez por cada uso.

### ¿Cómo se calculan en una PCFG la probabilidad de una cadena y la de su mejor árbol?
La de la cadena suma los árboles que la generan, $P_\theta(x) = \sum_{t_x} P_\theta(x, t_x)$, y la del mejor árbol toma el máximo, $\max_{t_x} P_\theta(x, t_x)$. Es la misma pareja suma y máximo que en los PFSA.

### ¿Cuándo es consistente una PCFG?
Cuando las probabilidades de todas las cadenas del lenguaje suman 1: $\sum_{x \in L(G)} P_\theta(x) = 1$. Si suman menos, la gramática pierde masa de probabilidad y no define una distribución completa.

### Problema: probabilidad de los árboles y de la cadena en una PCFG ambigua
La PCFG tiene las reglas $S \to NP\ VP$ (1), $VP \to V\ NP$ (0,6), $VP \to VP\ PP$ (0,4), $NP \to NP\ PP$ (0,3), $NP \to n$ (0,7), $PP \to P\ NP$ (1), $V \to v$ (1) y $P \to p$ (1). Calcula la probabilidad de cada árbol de la cadena $n\,v\,n\,p\,n$, la de la cadena y cuál es el mejor árbol.
#### Paso 1
Comprueba la normalización. Para $S$: 1. Para $VP$: $0{,}6 + 0{,}4 = 1$. Para $NP$: $0{,}3 + 0{,}7 = 1$. Para $PP$, $V$ y $P$: 1. La cadena tiene dos análisis, según dónde se una $PP = p\,n$.
#### Paso 2
Árbol 1, con $PP$ unido al $NP$ del objeto. Reglas: $S \to NP\,VP$ (1), $NP \to n$ para el sujeto (0,7), $VP \to V\,NP$ (0,6), $V \to v$ (1), $NP \to NP\,PP$ (0,3), $NP \to n$ (0,7), $PP \to P\,NP$ (1), $P \to p$ (1), $NP \to n$ (0,7). Producto: $0{,}7 \cdot 0{,}6 \cdot 0{,}3 \cdot 0{,}7 \cdot 0{,}7 = 0{,}343 \cdot 0{,}18 = 0{,}06174$.
#### Paso 3
Árbol 2, con $PP$ unido al $VP$. Reglas: $S \to NP\,VP$ (1), $NP \to n$ (0,7), $VP \to VP\,PP$ (0,4), $VP \to V\,NP$ (0,6), $V \to v$ (1), $NP \to n$ (0,7), $PP \to P\,NP$ (1), $P \to p$ (1), $NP \to n$ (0,7). Producto: $0{,}7^3 \cdot 0{,}4 \cdot 0{,}6 = 0{,}343 \cdot 0{,}24 = 0{,}08232$.
#### Paso 4
La cadena suma ambos árboles: $P_\theta(x) = 0{,}06174 + 0{,}08232 = 0{,}14406$. El mejor árbol es el segundo, con $0{,}08232$. Los dos usan tres veces $NP \to n$, de modo que la diferencia sale solo del resto: $0{,}6 \cdot 0{,}3 = 0{,}18$ en el árbol 1 frente a $0{,}4 \cdot 0{,}6 = 0{,}24$ en el árbol 2.

### Problema: consistencia de una PCFG con $S \to S\,S$ y $S \to a$
La gramática tiene dos reglas: $S \to S\,S$ con probabilidad $p$ y $S \to a$ con probabilidad $q = 1 - p$. Sea $t$ la suma de las probabilidades de todos los árboles finitos. Decide si es consistente para $p = 0{,}6$ y para $p = 0{,}4$.
#### Paso 1
Un árbol finito empieza con una de las dos reglas. Con $S \to a$ el árbol termina y aporta $q$. Con $S \to S\,S$ hay que construir dos árboles finitos independientes, que aportan $p\,t^2$. Por tanto, $t = q + p\,t^2$.
#### Paso 2
Con $p = 0{,}6$ y $q = 0{,}4$: $0{,}6\,t^2 - t + 0{,}4 = 0$. Las raíces son $t = \frac{1 \pm \sqrt{1 - 0{,}96}}{1{,}2} = \frac{1 \pm 0{,}2}{1{,}2}$, es decir, $t = 1$ y $t = \frac{2}{3}$.
#### Paso 3
La suma de los árboles finitos es la menor raíz. Se ve iterando desde $t_0 = 0$ con $t_{n+1} = 0{,}4 + 0{,}6\,t_n^2$, que da $0{,}4$, $0{,}496$, $0{,}548$, $0{,}580$, $0{,}602$, y se acerca a $\frac{2}{3}$ sin llegar a 1. Por tanto, $\sum_x P_\theta(x) = \frac{2}{3} < 1$ y la gramática es inconsistente. El tercio restante queda en derivaciones que no terminan.
#### Paso 4
Con $p = 0{,}4$ y $q = 0{,}6$: $0{,}4\,t^2 - t + 0{,}6 = 0$, con raíces $t = \frac{1 \pm 0{,}2}{0{,}8}$, es decir, $1$ y $1{,}5$. La menor es 1, de modo que $\sum_x P_\theta(x) = 1$ y la gramática es consistente. Con $S \to S\,S$ la frontera está en $p = 0{,}5$.

## 2.3 Modelos gráficos probabilísticos: redes bayesianas

### ¿Qué es una red bayesiana?
Un modelo gráfico que representa un conjunto de variables aleatorias y sus dependencias condicionales mediante un grafo dirigido acíclico (DAG). Los nodos son variables y las aristas son dependencias estadísticas.

### ¿Cómo factoriza una red bayesiana la distribución conjunta?
Como el producto de cada variable condicionada a sus padres en el grafo: $p(x_1, \dots, x_T) = \prod_{t=1}^{T} p(x_t \mid \phi(x_t))$, donde $\phi(x_t)$ son las dependencias asociadas al nodo $x_t$.

### Si $p(A, B, C, D, E) = p(A)\,p(B)\,p(C \mid A, B)\,p(D \mid B, C)\,p(E \mid C, D)$, ¿qué padres tiene cada nodo?
$A$ y $B$ no tienen padres. $C$ tiene a $A$ y $B$. $D$ tiene a $B$ y $C$. $E$ tiene a $C$ y $D$.

### ¿Cuándo son $a$ y $b$ independientes y cuándo son condicionalmente independientes dado $c$?
Son independientes si $p(a, b) = p(a)\,p(b)$, o equivalentemente $p(a \mid b) = p(a)$. Son condicionalmente independientes dado $c$ si $p(a \mid b, c) = p(a \mid c)$, o equivalentemente $p(a, b \mid c) = p(a \mid c)\,p(b \mid c)$.

### ¿Qué tres casos de independencia condicional distingue una red bayesiana en un camino $a - c - b$?
| Caso | Forma | $a \perp b$ | $a \perp b \mid c$ |
|---|---|---|---|
| Cabeza a cola (dirección causal) | $a \to c \to b$ | no | sí |
| Cola a cola (padre común) | $a \leftarrow c \to b$ | no | sí |
| Cabeza a cabeza (estructura en V) | $a \to c \leftarrow b$ | sí | no |

### En la estructura en V $a \to c \leftarrow b$, ¿por qué $a$ y $b$ son independientes sin condicionar?
Porque al sumar sobre $c$ se obtiene $P(a, b) = \sum_c P(a)\,P(b)\,P(c \mid a, b) = P(a)\,P(b)$, ya que $\sum_c P(c \mid a, b) = 1$. Ninguna de las dos es causa de la otra.

### En la estructura en V, ¿qué pasa si se observa el nodo $c$ donde confluyen las flechas?
Que $a$ y $b$ dejan de ser independientes: $P(a, b \mid c) \ne P(a \mid c)\,P(b \mid c)$. Es el caso contrario a los otros dos, donde observar $c$ crea independencia.

### ¿Qué calcula la inferencia en una red bayesiana?
La probabilidad posterior de una variable $x$ dada una evidencia $y$, sin importar el valor de las demás variables $z$: $P(x \mid y) = P(x, y)/P(y)$, con $P(x, y) = \sum_z P(x, y, z)$ y $P(y) = \sum_{x, z} P(x, y, z)$.

### ¿Cómo factoriza una red bayesiana el clasificador Naive Bayes?
Como $p(x_1, \dots, x_T, y) = p(y)\prod_{t=1}^{T} p(x_t \mid y)$. La suposición es que, conocida la clase $y$, todas las características son independientes entre sí.

### ¿Cómo se escribe un HMM de bigramas como red bayesiana?
Con una cadena de estados ocultos $y_t$ y una observación $x_t$ colgando de cada uno: $P(x_1^T, y_1^T) = \prod_{t=1}^{T} q(y_t \mid y_{t-1})\,e(x_t \mid y_t)$. Una cadena de Markov simple es el caso sin observaciones, $p(x_1)\prod_t p(x_t \mid x_{t-1})$.

### Problema: factorización y número de parámetros de una red en diamante
Una red bayesiana con variables binarias tiene las aristas $A \to B$, $A \to C$, $B \to D$ y $C \to D$. Escribe la factorización, cuenta los parámetros y decide cuáles de estas independencias son ciertas: (i) $B \perp C \mid A$, (ii) $B \perp C \mid \{A, D\}$, (iii) $A \perp D \mid \{B, C\}$, (iv) $A \perp D \mid B$.
#### Paso 1
Factorización: $p(A, B, C, D) = p(A)\,p(B \mid A)\,p(C \mid A)\,p(D \mid B, C)$. Cada variable binaria con $k$ padres necesita $2^k$ parámetros: $1 + 2 + 2 + 4 = 9$. Sin independencias harían falta $2^4 - 1 = 15$.
#### Paso 2
Los tres tipos de triple aparecen en el grafo. $A \to B \to D$ es cabeza a cola, con $B$ en el medio. $B \leftarrow A \to C$ es cola a cola, con $A$ en el medio. $B \to D \leftarrow C$ es cabeza a cabeza, con $D$ en el medio.
#### Paso 3
(i) Cierto. El camino $B \leftarrow A \to C$ queda bloqueado al observar $A$, y el camino $B \to D \leftarrow C$ está bloqueado porque no se observa $D$. (ii) Falso. Observar $D$ abre el camino cabeza a cabeza, de modo que $B$ y $C$ pasan a depender.
#### Paso 4
(iii) Cierto. Los dos caminos de $A$ a $D$, que pasan por $B$ y por $C$, son cabeza a cola y ambos medios están observados. (iv) Falso. Observar solo $B$ bloquea $A \to B \to D$, pero el camino $A \to C \to D$ sigue abierto.

### Problema: independencia y dependencia en una estructura en V con números
Sean $a$ y $b$ binarias con $P(a = 1) = P(b = 1) = 0{,}5$ e independientes, y $c = 1$ si $a = 1$ o $b = 1$ y $c = 0$ en otro caso (es decir, $P(c = 1 \mid a, b) = 1$ salvo para $a = b = 0$, donde vale 0). Comprueba que $a \perp b$ pero que $a$ y $b$ no son independientes dado $c = 1$.
#### Paso 1
Como $P(a, b) = P(a)\,P(b)$ por construcción, $a \perp b$. Es la propiedad de la estructura en V sin observar $c$.
#### Paso 2
Calcula $P(c = 1)$. Falla solo si $a = 0$ y $b = 0$, que tiene probabilidad $0{,}5 \cdot 0{,}5 = 0{,}25$. Por tanto, $P(c = 1) = 0{,}75$.
#### Paso 3
$P(a = 1 \mid c = 1) = P(a = 1, c = 1)/P(c = 1)$. Si $a = 1$ entonces $c = 1$, de modo que $P(a = 1, c = 1) = 0{,}5$. El resultado es $0{,}5/0{,}75 = \frac{2}{3}$.
#### Paso 4
Ahora se añade $b = 1$ a la evidencia. Si $b = 1$ entonces $c = 1$ siempre, así que $c$ no aporta nada y $P(a = 1 \mid b = 1, c = 1) = P(a = 1) = 0{,}5$. Como $0{,}5 \ne \frac{2}{3}$, conocer $b$ cambia lo que se sabe de $a$ una vez fijado $c$: $a \not\perp b \mid c$.

### Problema: inferencia en una red bayesiana de tres variables
Sea la red $R \to S$, $R \to G$ y $S \to G$ con $P(R = y) = 0{,}3$. Aspersor: $P(S = r \mid R = n) = 0{,}5$ y $P(S = r \mid R = y) = 0{,}1$. Hierba mojada: $P(G = w \mid R, S) = 0{,}05$ para $(n, s)$, $0{,}8$ para $(n, r)$, $0{,}7$ para $(y, s)$ y $0{,}95$ para $(y, r)$. Calcula $P(S = r \mid R = y, G = w)$ y $P(R = y \mid G = w)$.
#### Paso 1
La conjunta es $P(R, S, G) = P(R)\,P(S \mid R)\,P(G \mid R, S)$. Aquí $r$ significa aspersor funcionando, $s$ parado, $y$ llueve y $n$ no llueve.
#### Paso 2
Con $R = y$ como evidencia, $P(R)$ es común a los dos valores de $S$ y se cancela. Numerador: $P(S = r \mid y)\,P(w \mid y, r) = 0{,}1 \cdot 0{,}95 = 0{,}095$. Denominador: $0{,}9 \cdot 0{,}7 + 0{,}095 = 0{,}63 + 0{,}095 = 0{,}725$. El resultado es $P(S = r \mid R = y, G = w) = 0{,}095/0{,}725 \approx 0{,}131$.
#### Paso 3
Para $P(R = y \mid G = w)$ hay que sumar sobre $S$ las cuatro combinaciones con $G = w$. Para $(n, s)$: $0{,}7 \cdot 0{,}5 \cdot 0{,}05 = 0{,}0175$. Para $(n, r)$: $0{,}7 \cdot 0{,}5 \cdot 0{,}8 = 0{,}28$. Para $(y, s)$: $0{,}3 \cdot 0{,}9 \cdot 0{,}7 = 0{,}189$. Para $(y, r)$: $0{,}3 \cdot 0{,}1 \cdot 0{,}95 = 0{,}0285$.
#### Paso 4
$P(G = w) = 0{,}0175 + 0{,}28 + 0{,}189 + 0{,}0285 = 0{,}515$. Las que tienen $R = y$ suman $0{,}189 + 0{,}0285 = 0{,}2175$. Por tanto, $P(R = y \mid G = w) = 0{,}2175/0{,}515 \approx 0{,}422$, más alto que el a priori $0{,}3$, porque la hierba mojada es indicio de lluvia.

## 2.3 Modelos gráficos probabilísticos: campos aleatorios de Markov

### ¿Qué representan los nodos y las aristas de un MRF?
Los nodos son variables aleatorias. Las aristas indican qué variables interaccionan probabilísticamente con sus vecinas, o sea, de cuáles depende cada una.

### ¿Cómo se leen las independencias condicionales en un MRF (propiedad global de Markov)?
Por separación en el grafo: $A \perp B \mid C$ si y solo si el conjunto $C$ separa $A$ de $B$, es decir, todo camino de $A$ a $B$ pasa por algún nodo de $C$.

### ¿Qué es un clique y qué es un clique maximal en un grafo no dirigido?
Un clique es un subgrafo completamente conectado, donde todos los nodos están unidos entre sí. Un clique maximal es un clique que no está contenido en ningún otro clique mayor.

### ¿Cómo factoriza un MRF la distribución conjunta?
Como $P_G(X_1, \dots, X_T) = \frac{1}{Z}\prod_{C \in Q}\psi_C(V_C)$, donde $Q$ es el conjunto de cliques maximales, $V_C$ las variables del clique $C$ y $\psi_C > 0$ su función de potencial.

### ¿Para qué sirve la constante $Z$ en un MRF y cómo se calcula?
Para normalizar: los potenciales son positivos pero no son probabilidades. Se calcula sumando el producto de potenciales sobre todas las asignaciones posibles: $Z = \sum_{X_1, \dots, X_T}\prod_C \psi_C(V_C)$. Esa suma es lo costoso de los MRF.

### Problema: factorización por cliques y constante $Z$ de un MRF pequeño
Un MRF binario tiene las aristas $\{X_1, X_2\}$, $\{X_1, X_3\}$, $\{X_2, X_3\}$ y $\{X_3, X_4\}$. Sea $\psi_1(X_1, X_2, X_3) = 2$ si las tres variables son iguales y 1 en otro caso, y $\psi_2(X_3, X_4) = 3$ si $X_3 = X_4$ y 1 en otro caso. Escribe la factorización, calcula $Z$, $P(0, 0, 0, 0)$ y $P(X_3 = X_4)$, e indica qué separa a $X_4$ del resto.
#### Paso 1
Los cliques maximales son $\{X_1, X_2, X_3\}$ y $\{X_3, X_4\}$. Por tanto, $P(x) = \frac{1}{Z}\,\psi_1(x_1, x_2, x_3)\,\psi_2(x_3, x_4)$.
#### Paso 2
Para un valor fijo de $x_3$, la suma de $\psi_1$ sobre $(x_1, x_2)$ vale $2 + 1 + 1 + 1 = 5$, porque solo una de las cuatro combinaciones tiene las tres variables iguales. Para un valor fijo de $x_3$, la suma de $\psi_2$ sobre $x_4$ vale $3 + 1 = 4$.
#### Paso 3
Como $x_1, x_2$ y $x_4$ solo interactúan a través de $x_3$, $Z = \sum_{x_3} 5 \cdot 4 = 2 \cdot 20 = 40$. Para $P(0, 0, 0, 0)$: $\psi_1 = 2$ y $\psi_2 = 3$, así que $P = 2 \cdot 3/40 = 0{,}15$.
#### Paso 4
$P(X_3 = X_4)$: para cada valor de $x_3$ se suma $5 \cdot 3 = 15$, luego $30/40 = 0{,}75$. Además, $X_3$ separa $X_4$ de $\{X_1, X_2\}$, porque toda arista hacia $X_4$ pasa por $X_3$. Por la propiedad global de Markov, $X_4 \perp \{X_1, X_2\} \mid X_3$, y se ve en la factorización porque cada factor mezcla a $X_4$ solo con $X_3$.

## 2.4 Modelos discriminativos: CRF

### ¿Qué modela un campo aleatorio condicional (CRF) y de qué tipo de modelo es?
Modela directamente la probabilidad condicional $p(y \mid x; \theta)$ de una secuencia de salida $y$ dada la de entrada $x$, de modo que es un modelo discriminativo. Se debe a Lafferty, McCallum y Pereira (2001).

### ¿Cómo se define la probabilidad condicional de un CRF?
Como $p(y \mid x; \theta) = \frac{\exp\{\varphi(x, y; \theta)\}}{Z(x; \theta)}$, donde $\varphi$ es una función de compatibilidad que da puntuaciones altas a los pares $(x, y)$ compatibles.

### ¿Qué suma incluye la constante $Z(x; \theta)$ de un CRF y por qué depende de $x$?
Suma $\exp\{\varphi(x, y'; \theta)\}$ sobre todas las secuencias de salida posibles $y'$ para esa $x$. Depende de $x$ porque se normaliza por entrada, no sobre todos los pares $(x, y)$ como haría un modelo generativo.

### ¿Cómo se factoriza la función de compatibilidad de un CRF de bigramas?
Como suma sobre las posiciones de un producto de pesos por características: $\varphi(x, y; \theta) = \sum_{t=1}^{T}\sum_{k=1}^{K}\theta_k\,f_k(y_{t-1}, y_t, x_t)$, con $y_0 = \text{null}$ para que el bigrama esté definido en $t = 1$.

### ¿Cuáles son los tres problemas que se plantean en un CRF?
Inferencia: calcular $p(y \mid x; \theta)$ de una secuencia dada. Decodificación: hallar la mejor secuencia $\arg\max_y p(y \mid x; \theta)$. Estimación de parámetros: aprender $\theta$ a partir de pares $(x^{(n)}, y^{(n)})$.

### ¿Por qué la decodificación de un CRF no necesita calcular $Z(x; \theta)$?
Porque $Z$ no depende de $y$ y es la misma para todas las secuencias candidatas. Basta maximizar $\prod_t \exp\{\sum_k \theta_k f_k\}$, o lo que es lo mismo, $\varphi(x, y; \theta)$. En cambio, la inferencia sí lo necesita.

### ¿Qué diferencia hay entre un CRF y un HMM como modelos de secuencias?
El HMM es generativo y modela $P(x, y)$ con transiciones y emisiones normalizadas localmente. El CRF es discriminativo, modela $P(y \mid x)$ con pesos sobre características arbitrarias y normaliza globalmente con $Z(x)$.

### ¿Qué son las características de etiqueta con etiqueta (label-label) en un CRF de reconocimiento de entidades?
Indicadoras binarias $f^{LL}_{ij}(y_{t-1}, y_t, x_t)$ que valen 1 si $y_{t-1} = i$ e $y_t = j$ y 0 en otro caso. Con 9 etiquetas hay $9 \cdot 9 = 81$ características de este tipo.

### Problema: probabilidad de una secuencia y decodificación en un CRF con características
Un CRF etiqueta la frase $x = (\text{dogs}, \text{run})$ con etiquetas $\{N, V\}$ y $y_0 = \text{null}$. Los pesos distintos de cero son: etiqueta-etiqueta $\theta(\text{null}, N) = 0{,}5$, $\theta(N, V) = 1$, $\theta(V, N) = 0{,}5$, $\theta(V, V) = -1$. Etiqueta-palabra $\theta(N, \text{dogs}) = 2$, $\theta(V, \text{run}) = 1{,}5$, $\theta(N, \text{run}) = 0{,}5$. Calcula $p(NV \mid x)$ y la mejor secuencia.
#### Paso 1
Hay cuatro secuencias posibles. La puntuación es $\varphi = \sum_t [\theta_{LL}(y_{t-1}, y_t) + \theta_{LW}(y_t, x_t)]$, donde cada característica activa suma su peso y las demás suman 0.
#### Paso 2
Secuencia $NN$: $t = 1$ da $0{,}5 + 2 = 2{,}5$ y $t = 2$ da $0 + 0{,}5 = 0{,}5$, luego $\varphi = 3$. Secuencia $NV$: $t = 1$ da $2{,}5$ y $t = 2$ da $1 + 1{,}5 = 2{,}5$, luego $\varphi = 5$.
#### Paso 3
Secuencia $VN$: $t = 1$ da $0 + 0 = 0$ y $t = 2$ da $0{,}5 + 0{,}5 = 1$, luego $\varphi = 1$. Secuencia $VV$: $t = 1$ da 0 y $t = 2$ da $-1 + 1{,}5 = 0{,}5$, luego $\varphi = 0{,}5$.
#### Paso 4
$Z(x) = e^{3} + e^{5} + e^{1} + e^{0{,}5} \approx 20{,}09 + 148{,}41 + 2{,}72 + 1{,}65 = 172{,}87$. Por tanto, $p(NV \mid x) = 148{,}41/172{,}87 \approx 0{,}859$.
#### Paso 5
Para decodificar no hace falta $Z$, porque basta comparar puntuaciones. La mayor es $\varphi(NV) = 5$, así que la mejor secuencia es $NV$. Por ejemplo, $p(NV)/p(NN) = e^{5-3} = e^2 \approx 7{,}39$ sin calcular $Z$.
