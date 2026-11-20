# PEE U3 - Decodificación e inferencia

## 3. Hacer predicciones: decodificación e inferencia

### ¿Qué diferencia hay entre decodificar y hacer inferencia en un modelo estructurado?
Decodificar es encontrar la mejor estructura para una entrada, la secuencia de estados o el árbol más probables. Hacer inferencia es calcular una cantidad total, como la probabilidad de la cadena o la constante de normalización. La primera usa el operador máximo y la segunda el operador suma.

### ¿Qué tres preguntas contesta un mismo esquema de programación dinámica según el operador que se use?
Con unión (o lógico) responde si la cadena se puede generar. Con máximo da la probabilidad del mejor análisis (Viterbi). Con suma da la probabilidad total sobre todos los análisis (Forward en secuencias, Inside en árboles).

### ¿Qué algoritmo corresponde a cada pareja estructura y operador?
| Estructura | Máximo | Suma |
|---|---|---|
| Secuencias (PFSA, HMM, CRF) | Viterbi | Forward (y Backward) |
| Árboles (PCFG en forma normal de Chomsky) | Viterbi de PCFG | Inside |

Para saber si existe algún análisis, en árboles se usa CKY.

### ¿Cuál es la trampa típica al cambiar de Viterbi a Forward o al revés?
Dejar el operador equivocado en la recursión. Si se pone máximo donde va suma se obtiene la probabilidad del mejor camino y no la de la cadena, y viceversa. El resto de la recursión es idéntico.

### ¿Por qué no se calcula la probabilidad de una cadena enumerando todos los caminos del autómata?
Porque el número de caminos crece exponencialmente con la longitud de la cadena. La programación dinámica sobre el trellis reutiliza los resultados parciales de cada estado y cada instante, y deja el coste en una cantidad proporcional a la longitud por el cuadrado del número de estados.

## 3.1 Modelos generativos lineales: PFSA

### ¿Cómo se calcula la probabilidad de un camino $\pi$ que genera la cadena $x$ en un PFSA?
Se multiplica la probabilidad inicial del primer estado, la probabilidad de cada arco recorrido y la probabilidad final del último estado:

$$P_A(x, \pi) = I(s_0) \prod_{i=1}^{k} P(s_{i-1}, x_i, s_i)\; F(s_k)$$

### ¿En qué se diferencian $P_A(x)$ y $\hat P_A(x)$ en un PFSA?
$P_A(x)$ suma $P_A(x,\pi)$ sobre todos los caminos que generan $x$. $\hat P_A(x)$ toma solo el máximo de esos caminos. Por tanto $\hat P_A(x) \le P_A(x)$, y la igualdad se da solo si un único camino tiene probabilidad no nula.

### ¿Qué significa $\gamma_x(t, q)$ en el algoritmo de Viterbi para un PFSA?
Es la probabilidad del mejor camino que genera el prefijo $x_1 \dots x_t$ y termina en el estado $q$. Se define para cada estado y cada instante de 0 a $|x|$.

### ¿Cuál es la inicialización de Viterbi en un PFSA y por qué no es siempre 1?
$\gamma_x(0, q) = I(q)$ para todo estado. No es 1 porque el autómata puede tener varios estados iniciales con distinta probabilidad, o estados que no pueden ser iniciales (probabilidad 0).

### ¿Cuál es la recursión de Viterbi en un PFSA?
$$\gamma_x(t, q) = \max_{q' \in Q} \{ \gamma_x(t-1, q') \cdot P(q', x_t, q) \}$$

Para cada estado destino se prueban todos los estados origen y se queda el mejor. El símbolo leído en el instante $t$ es $x_t$.

### ¿Cómo se obtiene el resultado final de Viterbi en un PFSA?
$$\hat P_A(x) = \max_{q \in Q} \{ \gamma_x(|x|, q) \cdot F(q) \}$$

Se multiplica por la probabilidad final $F(q)$ antes de tomar el máximo. Olvidar $F$ es un error típico, porque el mejor estado al llegar al final puede no ser el que mejor termina.

### ¿Cómo se recupera el camino óptimo de Viterbi y no solo su probabilidad?
Guardando en cada celda el estado origen que dio el máximo (puntero hacia atrás). Al final se parte del estado que maximiza $\gamma \cdot F$ y se retrocede siguiendo los punteros hasta el instante 0.

### ¿Por qué en Viterbi no basta quedarse en cada instante con el estado de mayor $\gamma$?
Porque un estado con $\gamma$ menor puede tener mejores arcos después, y además el camino debe acabar en un estado con buena probabilidad final. Hay que conservar el mejor valor de todos los estados en cada instante y decidir solo al final.

### ¿Qué significa $\alpha_x(t, q)$ en el algoritmo Forward?
Es la probabilidad de generar el prefijo $x_1 \dots x_t$ llegando al estado $q$, sumada sobre todos los caminos que lo consiguen. Es la misma definición que $\gamma$ cambiando el máximo por la suma.

### ¿Cuál es la recursión de Forward en un PFSA?
$$\alpha_x(t, q) = \sum_{q' \in Q} \alpha_x(t-1, q') \cdot P(q', x_t, q)$$

Con la inicialización $\alpha_x(0,q) = I(q)$. Es la recursión de Viterbi con el operador suma.

### ¿Cómo se obtiene $P_A(x)$ con Forward?
$$P_A(x) = \sum_{q \in Q} \alpha_x(|x|, q) \cdot F(q)$$

Se pondera cada estado final por su probabilidad final y se suma.

### ¿Qué significa $\beta_x(t, q)$ en el algoritmo Backward?
Es la probabilidad de generar el sufijo $x_{t+1} \dots x_{|x|}$ partiendo del estado $q$ y terminando con la probabilidad final de un estado de aceptación. Mira hacia el futuro mientras que $\alpha$ mira hacia el pasado.

### ¿Cuál es la inicialización y la recursión de Backward en un PFSA?
Inicialización: $\beta_x(|x|, q) = F(q)$. Recursión, de $t = |x|-1$ hasta 0:

$$\beta_x(t, q) = \sum_{q' \in Q} \beta_x(t+1, q') \cdot P(q, x_{t+1}, q')$$

El estado $q$ es el origen del arco y $q'$ el destino, al revés que en Forward.

### ¿Cómo se obtiene $P_A(x)$ con Backward?
$$P_A(x) = \sum_{q \in Q} I(q) \cdot \beta_x(0, q)$$

Debe dar el mismo valor que Forward. Coincidir es la comprobación habitual de que la tabla está bien calculada.

### ¿Qué se obtiene al multiplicar $\alpha_x(t,q)$ por $\beta_x(t,q)$ y sumar sobre los estados?
Se obtiene $P_A(x)$ para cualquier instante $t$, porque todo camino pasa por exactamente un estado en el instante $t$. Cada término $\alpha_x(t,q)\,\beta_x(t,q)$ es la probabilidad de los caminos que generan $x$ y están en $q$ en el instante $t$.

### ¿Cómo se calcula la probabilidad de que el camino pase por el estado $q$ en el instante $t$, dada la cadena?
$$P(s_t = q \mid x) = \frac{\alpha_x(t,q)\,\beta_x(t,q)}{P_A(x)}$$

Es la probabilidad a posteriori del estado. No coincide en general con la que da el camino de Viterbi, que es un único camino.

### ¿Qué coste tiene Viterbi (o Forward) frente a enumerar caminos?
Es proporcional a $|x| \cdot |Q|^2$ operaciones, porque en cada instante se rellena una celda por estado combinando todos los estados anteriores. Enumerar caminos cuesta del orden de $|Q|^{|x|}$.

### Problema: Viterbi en un PFSA de 3 estados con la cadena aba
Sea un PFSA con estados $q_0, q_1, q_2$, alfabeto $\{a, b\}$, $I(q_0)=1$ y los demás estados con $I=0$. Los arcos y las probabilidades finales son:

| Estado | Arcos (símbolo, destino) probabilidad | $F$ |
|---|---|---|
| $q_0$ | (a, $q_0$) 0,3 y (a, $q_1$) 0,4 y (b, $q_1$) 0,2 | 0,1 |
| $q_1$ | (a, $q_1$) 0,1 y (a, $q_2$) 0,2 y (b, $q_0$) 0,2 y (b, $q_2$) 0,5 | 0 |
| $q_2$ | (a, $q_0$) 0,1 y (b, $q_2$) 0,3 | 0,6 |

Calcula con Viterbi la probabilidad del mejor camino para $x = aba$ y el camino.

#### Paso 1
Instante 0: $\gamma(0, \cdot) = (q_0{:}\,1,\; q_1{:}\,0,\; q_2{:}\,0)$, que es $I$.

#### Paso 2
Instante 1, símbolo a. Solo $q_0$ tiene probabilidad no nula y sus arcos con a llevan a $q_0$ (0,3) y a $q_1$ (0,4). Resulta $\gamma(1, \cdot) = (0{,}3;\; 0{,}4;\; 0)$.

#### Paso 3
Instante 2, símbolo b. Cada celda tiene una sola entrada con valor no nulo.
- $q_0$ viene de $q_1$: $0{,}4 \times 0{,}2 = 0{,}08$.
- $q_1$ viene de $q_0$: $0{,}3 \times 0{,}2 = 0{,}06$.
- $q_2$ viene de $q_1$ por 0,5: $0{,}4 \times 0{,}5 = 0{,}2$ (la entrada desde $q_2$ vale $0 \times 0{,}3 = 0$).

Resulta $\gamma(2, \cdot) = (0{,}08;\; 0{,}06;\; 0{,}2)$.

#### Paso 4
Instante 3, símbolo a. Aquí hay que elegir máximo:
- $q_0$: desde $q_0$ vale $0{,}08 \times 0{,}3 = 0{,}024$ y desde $q_2$ vale $0{,}2 \times 0{,}1 = 0{,}02$. Máximo 0,024, puntero a $q_0$.
- $q_1$: desde $q_0$ vale $0{,}08 \times 0{,}4 = 0{,}032$ y desde $q_1$ vale $0{,}06 \times 0{,}1 = 0{,}006$. Máximo 0,032, puntero a $q_0$.
- $q_2$: solo desde $q_1$, $0{,}06 \times 0{,}2 = 0{,}012$, puntero a $q_1$.

#### Paso 5
Se multiplica por $F$: $q_0$ da $0{,}024 \times 0{,}1 = 0{,}0024$, $q_1$ da 0 y $q_2$ da $0{,}012 \times 0{,}6 = 0{,}0072$. Por tanto $\hat P_A(aba) = 0{,}0072$, terminando en $q_2$.

#### Paso 6
Se retrocede por los punteros: $q_2$ (instante 3) viene de $q_1$ (instante 2), que viene de $q_0$ (instante 1), que viene de $q_0$ (instante 0). El camino es $q_0 \xrightarrow{a} q_0 \xrightarrow{b} q_1 \xrightarrow{a} q_2$. Comprobación: $0{,}3 \times 0{,}2 \times 0{,}2 \times 0{,}6 = 0{,}0072$. Obsérvese que en el instante 2 el mayor $\gamma$ era el de $q_2$ (0,2), pero el mejor camino final pasa por $q_1$ (0,06).

### Problema: Forward en el mismo PFSA con la cadena aba
Sea un PFSA con estados $q_0, q_1, q_2$, $I(q_0)=1$ y $I(q_1)=I(q_2)=0$. Sus arcos y probabilidades finales son:

| Estado | Arcos (símbolo, destino) probabilidad | $F$ |
|---|---|---|
| $q_0$ | (a, $q_0$) 0,3 y (a, $q_1$) 0,4 y (b, $q_1$) 0,2 | 0,1 |
| $q_1$ | (a, $q_1$) 0,1 y (a, $q_2$) 0,2 y (b, $q_0$) 0,2 y (b, $q_2$) 0,5 | 0 |
| $q_2$ | (a, $q_0$) 0,1 y (b, $q_2$) 0,3 | 0,6 |

Calcula $P_A(aba)$ con Forward y compárala con la probabilidad del mejor camino, 0,0072.

#### Paso 1
Instantes 0 y 1 coinciden con Viterbi, porque cada celda tiene una sola entrada: $\alpha(0, \cdot) = (1, 0, 0)$ y $\alpha(1, \cdot) = (0{,}3;\; 0{,}4;\; 0)$.

#### Paso 2
Instante 2, símbolo b: $\alpha(2, q_0) = 0{,}4 \times 0{,}2 = 0{,}08$, $\alpha(2, q_1) = 0{,}3 \times 0{,}2 = 0{,}06$ y $\alpha(2, q_2) = 0{,}4 \times 0{,}5 + 0 \times 0{,}3 = 0{,}2$.

#### Paso 3
Instante 3, símbolo a, ahora con sumas:
- $\alpha(3, q_0) = 0{,}08 \times 0{,}3 + 0{,}2 \times 0{,}1 = 0{,}024 + 0{,}02 = 0{,}044$.
- $\alpha(3, q_1) = 0{,}08 \times 0{,}4 + 0{,}06 \times 0{,}1 = 0{,}032 + 0{,}006 = 0{,}038$.
- $\alpha(3, q_2) = 0{,}06 \times 0{,}2 = 0{,}012$.

#### Paso 4
Resultado: $P_A(aba) = 0{,}044 \times 0{,}1 + 0{,}038 \times 0 + 0{,}012 \times 0{,}6 = 0{,}0044 + 0{,}0072 = 0{,}0116$.

#### Paso 5
El mejor camino pesa 0,0072, es decir, $0{,}0072 / 0{,}0116 \approx 62\%$ de la probabilidad total. Los demás caminos que generan aba aportan el 0,0044 restante. Viterbi y Forward solo se separan en las celdas con más de una entrada no nula, aquí las del instante 3.

### Problema: Backward en el mismo PFSA y comprobación con Forward
Sea un PFSA con estados $q_0, q_1, q_2$, $I(q_0)=1$ y $I(q_1)=I(q_2)=0$. Sus arcos y probabilidades finales son:

| Estado | Arcos (símbolo, destino) probabilidad | $F$ |
|---|---|---|
| $q_0$ | (a, $q_0$) 0,3 y (a, $q_1$) 0,4 y (b, $q_1$) 0,2 | 0,1 |
| $q_1$ | (a, $q_1$) 0,1 y (a, $q_2$) 0,2 y (b, $q_0$) 0,2 y (b, $q_2$) 0,5 | 0 |
| $q_2$ | (a, $q_0$) 0,1 y (b, $q_2$) 0,3 | 0,6 |

Calcula la tabla $\beta$ para $x = aba$, obtén $P_A(x)$ y calcula la probabilidad a posteriori del estado en el instante 2. Usa que $\alpha(2,\cdot) = (0{,}08;\; 0{,}06;\; 0{,}2)$.

#### Paso 1
Inicialización, instante 3: $\beta(3, \cdot) = F = (0{,}1;\; 0;\; 0{,}6)$.

#### Paso 2
Instante 2, símbolo $x_3 = a$. Se suman los arcos con a que salen de cada estado:
- $\beta(2, q_0) = 0{,}3 \times 0{,}1 + 0{,}4 \times 0 = 0{,}03$.
- $\beta(2, q_1) = 0{,}1 \times 0 + 0{,}2 \times 0{,}6 = 0{,}12$.
- $\beta(2, q_2) = 0{,}1 \times 0{,}1 = 0{,}01$.

#### Paso 3
Instante 1, símbolo $x_2 = b$:
- $\beta(1, q_0) = 0{,}2 \times \beta(2, q_1) = 0{,}2 \times 0{,}12 = 0{,}024$.
- $\beta(1, q_1) = 0{,}2 \times 0{,}03 + 0{,}5 \times 0{,}01 = 0{,}006 + 0{,}005 = 0{,}011$.
- $\beta(1, q_2) = 0{,}3 \times 0{,}01 = 0{,}003$.

#### Paso 4
Instante 0, símbolo $x_1 = a$:
- $\beta(0, q_0) = 0{,}3 \times 0{,}024 + 0{,}4 \times 0{,}011 = 0{,}0072 + 0{,}0044 = 0{,}0116$.
- $\beta(0, q_1) = 0{,}1 \times 0{,}011 + 0{,}2 \times 0{,}003 = 0{,}0017$.
- $\beta(0, q_2) = 0{,}1 \times 0{,}024 = 0{,}0024$.

#### Paso 5
$P_A(aba) = \sum_q I(q)\,\beta(0,q) = 1 \times 0{,}0116 = 0{,}0116$, igual que con Forward. La comprobación en el instante 2 también cuadra: $0{,}08 \times 0{,}03 + 0{,}06 \times 0{,}12 + 0{,}2 \times 0{,}01 = 0{,}0024 + 0{,}0072 + 0{,}002 = 0{,}0116$.

#### Paso 6
Posteriores del estado en el instante 2, dividiendo cada término anterior entre 0,0116: $q_0$ vale $0{,}0024/0{,}0116 = 6/29 \approx 0{,}21$, $q_1$ vale $0{,}0072/0{,}0116 = 18/29 \approx 0{,}62$ y $q_2$ vale $0{,}002/0{,}0116 = 5/29 \approx 0{,}17$. Suman 1, y el más probable es $q_1$, que es el estado por el que pasaba el camino de Viterbi.

## 3.2 Modelos discriminativos lineales: CRF

### ¿Cómo se define la probabilidad de una secuencia de etiquetas $y$ en un CRF lineal?
$$p(y \mid x; \theta) = \frac{\exp\left\{ \sum_{t=1}^{T} \sum_{k=1}^{K} \theta_k f_k(y_{t-1}, y_t, x_t) \right\}}{Z(x;\theta)}$$

Es el exponente de una suma ponderada de características a lo largo de la secuencia, normalizado por $Z$.

### ¿Qué es $Z(x;\theta)$ en un CRF y por qué es costosa de calcular directamente?
Es la suma de la puntuación exponenciada de todas las secuencias de etiquetas posibles para $x$. Tiene $|\mathcal{Y}|^T$ términos, así que enumerarla es exponencial en la longitud.

### ¿Qué es un factor $\Psi_t$ en un CRF visto como grafo de factores?
$\Psi_t(y_{t-1}, y_t, x_t) = \exp\{\sum_k \theta_k f_k(y_{t-1}, y_t, x_t)\}$. Con él el CRF queda como $p(y \mid x) = \frac{1}{Z} \prod_t \Psi_t(y_{t-1}, y_t, x_t)$, un producto de factores locales.

### ¿Qué papel juega $\Psi_t$ respecto a $P(q', x_t, q)$ del PFSA?
Ocupa el mismo lugar en las recursiones. La diferencia es que $\Psi_t$ no es una probabilidad: no está normalizada localmente, de modo que la normalización global se hace con $Z$.

### ¿Hace falta calcular $Z(x;\theta)$ para decodificar con un CRF?
No. $Z$ no depende de $y$, así que $\arg\max_y p(y \mid x) = \arg\max_y \prod_t \Psi_t$. Solo se necesita $Z$ cuando se quiere la probabilidad de una secuencia concreta o para entrenar.

### ¿Cómo se define y se inicializa el Viterbi de un CRF?
$\gamma_t(s)$ es la mayor puntuación de una secuencia de etiquetas que termina en $s$ en el instante $t$. Se inicializa con $\gamma_1(s) = \Psi_1(y_0 = \text{null}, y_1 = s, x_1)$, donde la etiqueta anterior es una marca especial de inicio.

### ¿Cuál es la recursión de Viterbi en un CRF y cuál es su resultado?
$$\gamma_t(s) = \max_{s'} \{ \gamma_{t-1}(s') \cdot \Psi_t(y_{t-1}=s', y_t=s, x_t) \}$$

El resultado es $\max_s \gamma_T(s)$, que es la puntuación (no normalizada) de la mejor secuencia. Con punteros hacia atrás se recupera $\hat y$.

### ¿Cuál es la recursión de Forward en un CRF y qué se obtiene al final?
$\alpha_t(s) = \sum_{s'} \alpha_{t-1}(s') \cdot \Psi_t(s', s, x_t)$, con $\alpha_1(s) = \Psi_1(\text{null}, s, x_1)$. Al final, $\sum_s \alpha_T(s) = Z(x;\theta)$.

### ¿Es $\sum_s \alpha_T(s)$ una probabilidad en un CRF?
No, es la constante de normalización $Z(x;\theta)$, que puede ser mucho mayor que 1. Para obtener la probabilidad de una secuencia se divide su puntuación entre $Z$.

### Problema: Viterbi y Forward en un CRF con dos etiquetas
Un CRF tiene etiquetas $\{A, B\}$ y una entrada de longitud $T=3$. Los factores ya evaluados son: $\Psi_1(A)=2$ y $\Psi_1(B)=1$ (la etiqueta anterior es la marca de inicio), y para $t=2$ y $t=3$ las tablas $\Psi_t(y_{t-1}, y_t)$:

| $\Psi_2$ | $y_2 = A$ | $y_2 = B$ |
|---|---|---|
| $y_1 = A$ | 1 | 3 |
| $y_1 = B$ | 3 | 1 |

| $\Psi_3$ | $y_3 = A$ | $y_3 = B$ |
|---|---|---|
| $y_2 = A$ | 2 | 1 |
| $y_2 = B$ | 2 | 3 |

Calcula $Z$, la mejor secuencia y su probabilidad.

#### Paso 1
Instante 1: $\alpha_1 = \gamma_1 = (A{:}\,2,\; B{:}\,1)$.

#### Paso 2
Instante 2. Forward: $\alpha_2(A) = 2 \cdot 1 + 1 \cdot 3 = 5$ y $\alpha_2(B) = 2 \cdot 3 + 1 \cdot 1 = 7$. Viterbi: $\gamma_2(A) = \max(2 \cdot 1,\ 1 \cdot 3) = 3$ con puntero a $B$, y $\gamma_2(B) = \max(2 \cdot 3,\ 1 \cdot 1) = 6$ con puntero a $A$.

#### Paso 3
Instante 3. Forward: $\alpha_3(A) = 5 \cdot 2 + 7 \cdot 2 = 24$ y $\alpha_3(B) = 5 \cdot 1 + 7 \cdot 3 = 26$. Viterbi: $\gamma_3(A) = \max(3 \cdot 2,\ 6 \cdot 2) = 12$ con puntero a $B$, y $\gamma_3(B) = \max(3 \cdot 1,\ 6 \cdot 3) = 18$ con puntero a $B$.

#### Paso 4
$Z = 24 + 26 = 50$ y la mejor puntuación es $\max(12, 18) = 18$, terminando en $B$. Retrocediendo, $y_3 = B$ viene de $y_2 = B$, que viene de $y_1 = A$. La mejor secuencia es $ABB$.

#### Paso 5
Su probabilidad es $18/50 = 0{,}36$. Comprobación enumerando las 8 secuencias: AAA 4, AAB 2, ABA 12, ABB 18, BAA 6, BAB 3, BBA 2, BBB 3, que suman 50.

## 3.3 Modelos generativos no lineales: PCFG

### ¿Cómo se calcula la probabilidad conjunta $P_\theta(x, t_x)$ en una PCFG?
Es el producto de las probabilidades de todas las reglas $r_1, \dots, r_m$ que usa el árbol de derivación $t_x$ para generar $x$.

### ¿En qué se diferencian $P_\theta(x)$ y $\hat P_\theta(x)$ en una PCFG?
$P_\theta(x)$ suma la probabilidad de todos los árboles que generan $x$. $\hat P_\theta(x)$ es la probabilidad del árbol más probable. Una gramática ambigua da $P_\theta(x) > \hat P_\theta(x)$.

### ¿Qué significa $\hat e(A, i, i+l)$ en el Viterbi de una PCFG?
Es la probabilidad del mejor árbol que, partiendo del no terminal $A$, genera las palabras $x_{i+1} \dots x_{i+l}$. El par $(i, i+l)$ marca el segmento por sus bordes, así que contiene $l$ palabras.

### ¿Por qué estos algoritmos de PCFG suponen una gramática en forma normal de Chomsky?
Porque entonces cada regla es $A \to BC$ o $A \to b$. Así cada celda se rellena partiendo el segmento en solo dos trozos y el punto de corte $k$ es la única elección extra.

### ¿Cuál es la inicialización del Viterbi (y del Inside) de una PCFG?
Para segmentos de una palabra: $\hat e(A, i, i+1) = p(A \to x_{i+1})$. Es la probabilidad de la regla léxica. Es idéntica en Viterbi e Inside, porque con una sola regla no hay nada que maximizar ni sumar.

### ¿Cuál es la recursión de Viterbi en una PCFG?
$$\hat e(A, i, i+l) = \max_{B,C} \Big\{ p(A \to BC) \cdot \max_{k=1,\dots,l-1} \hat e(B, i, i+k)\, \hat e(C, i+k, i+l) \Big\}$$

Se prueban todas las reglas binarias de $A$ y todos los puntos de corte, y se queda el mejor producto.

### ¿Cuál es la recursión del algoritmo Inside y qué cambia respecto a Viterbi?
$$e(A, i, i+l) = \sum_{B,C} p(A \to BC) \sum_{k=1}^{l-1} e(B, i, i+k)\, e(C, i+k, i+l)$$

Cambian los dos máximos por sumas. Todo lo demás, incluida la inicialización, es igual.

### ¿Cuál es el resultado final de Viterbi y de Inside en una PCFG?
Viterbi da $\hat P_\theta(x) = \hat e(S, 0, T)$ y Inside da $P_\theta(x) = e(S, 0, T)$, ambos en la celda del símbolo inicial que cubre toda la cadena.

### ¿En qué orden se rellenan las celdas en Viterbi e Inside de una PCFG?
Por longitud $l$ creciente, de 2 a $T$, y para cada longitud por todas las posiciones de inicio $i$. Así, cuando se necesita una celda más corta, ya está calculada.

### ¿Cómo se recupera el mejor árbol en Viterbi de PCFG?
Guardando en cada celda la regla $A \to BC$ y el punto de corte $k$ que dieron el máximo. Se parte de $(S, 0, T)$ y se expande recursivamente cada hijo con su propia celda.

### ¿Qué relación hay entre CKY, Viterbi de PCFG e Inside?
Los tres recorren la misma tabla con la misma estructura de bucles. CKY guarda si un no terminal genera el segmento, Viterbi guarda la mejor probabilidad y Inside guarda la probabilidad total.

### ¿En qué celdas coinciden Viterbi e Inside de una PCFG?
En las que solo tienen una derivación posible (una regla y un corte con valor no nulo), porque máximo y suma de un único término son iguales. Se separan solo donde dos o más análisis compiten por la misma celda.

### Problema: Viterbi e Inside en una PCFG ambigua
Sea la PCFG en forma normal de Chomsky con símbolo inicial $S$:

| Regla | Probabilidad |
|---|---|
| $S \to A\,B$ | 1,0 |
| $A \to A\,A$ | 0,3 |
| $A \to a$ | 0,7 |
| $B \to A\,B$ | 0,4 |
| $B \to b$ | 0,6 |

Calcula con Viterbi y con Inside la cadena $x = a\,a\,b$ y compara los resultados.

#### Paso 1
Longitud 1 (inicialización). Se aplican las reglas léxicas: $e(A,0,1) = 0{,}7$, $e(A,1,2) = 0{,}7$ y $e(B,2,3) = 0{,}6$. El resto de celdas de longitud 1 vale 0. Viterbi e Inside coinciden.

#### Paso 2
Longitud 2. Segmento (0,2) con corte $k=1$: $e(A,0,2) = 0{,}3 \times 0{,}7 \times 0{,}7 = 0{,}147$. Para $S$ y $B$ se necesitaría un $e(B,1,2)$, que vale 0, así que son 0. Segmento (1,3), también con un solo corte: $e(B,1,3) = 0{,}4 \times e(A,1,2) \times e(B,2,3) = 0{,}4 \times 0{,}7 \times 0{,}6 = 0{,}168$ y $e(S,1,3) = 1{,}0 \times 0{,}7 \times 0{,}6 = 0{,}42$. Hay un único corte, de modo que máximo y suma dan lo mismo.

#### Paso 3
Longitud 3, símbolo $S$ en el segmento (0,3), con $e(S,0,3)$, con la regla $S \to AB$ y dos cortes:
- $k=1$: $e(A,0,1) \cdot e(B,1,3) = 0{,}7 \times 0{,}168 = 0{,}1176$.
- $k=2$: $e(A,0,2) \cdot e(B,2,3) = 0{,}147 \times 0{,}6 = 0{,}0882$.

La regla $S \to AB$ vale 1,0, así que no cambia nada.

#### Paso 4
Con el operador máximo, $\hat e(S, 0, 3) = \max(0{,}1176,\ 0{,}0882) = 0{,}1176$, y el puntero marca el corte $k=1$.

#### Paso 5
Con el operador suma, $e(S, 0, 3) = 0{,}1176 + 0{,}0882 = 0{,}2058$.

#### Paso 6
Interpretación. El mejor árbol es $S \to A\,B$ con $A \to a$ y $B \to A\,B$ (que genera a, b), de probabilidad 0,1176. El otro árbol es $S \to A\,B$ con $A \to A\,A$ y $B \to b$, de probabilidad 0,0882. La probabilidad de la cadena, 0,2058, es la suma de ambos. La relación es $\hat P / P = 0{,}1176 / 0{,}2058 \approx 57\%$.

### ¿Qué coste tienen Viterbi e Inside de una PCFG en forma normal de Chomsky?
Son cúbicos en la longitud $T$ de la cadena, como CKY: tres bucles anidados sobre la longitud, la posición de inicio y el corte, y en cada combinación se recorren las reglas binarias de la gramática. Es una consecuencia de los bucles de las transparencias, no un dato escrito en ellas.

## 3.4 Grafos de palabras y búsqueda N-best

### ¿Por qué se usan grafos de palabras en lugar de decodificar directamente sobre el trellis?
Porque la búsqueda sobre el trellis completo es muy cara en tiempo y espacio, incluso con podas. El grafo de palabras reduce el espacio de búsqueda a las hipótesis más probables.

### ¿Qué es un grafo de palabras?
Un grafo acíclico dirigido con etiquetas y pesos. Representa de forma compacta un conjunto grande y finito de secuencias de palabras, y en concreto las interpretaciones con mayor probabilidad a posteriori.

### ¿Qué relación hay entre un grafo de palabras y el trellis de Viterbi?
El grafo de palabras es una versión podada del trellis de búsqueda de Viterbi que se obtiene durante el reconocimiento. Los nodos son pares (instante, estado) que sobreviven y los pesos de los arcos son los de las transiciones del autómata.

### ¿Por qué el grafo obtenido tras la búsqueda no es probabilístico ni consistente?
Porque la poda elimina caminos, así que los pesos de los arcos que salen de un nodo ya no suman 1 y la suma de los caminos que quedan no es 1. Para operaciones que lo necesitan hay que normalizarlo.

### ¿Cuál es el peso normalizado $\psi(q', q)$ de un arco de un grafo de palabras?
$$\psi(q', q) = \frac{P(q', q) \cdot \beta(q)}{\beta(q')}$$

Se multiplica el peso original por la probabilidad de completar desde el nodo destino y se divide entre la probabilidad de completar desde el nodo origen.

### ¿Qué papel tiene la función backward $\beta$ al normalizar un grafo de palabras?
Mide cuánta probabilidad hay desde un nodo hasta el final. Es la suma de las probabilidades de todos los caminos que salen de él, y se calcula hacia atrás empezando por $\beta = F$ en el nodo final.

### ¿Qué propiedad garantiza que los pesos normalizados de los arcos de un nodo sumen 1?
La propiedad de buena formación. Para todo nodo $q'$ que no es final, $\sum_q \psi(q', q) = 1$, porque $\beta(q')$ es justamente la suma de $P(q', q)\,\beta(q)$ sobre los arcos que salen de $q'$.

### ¿Qué propiedad garantiza que el grafo normalizado es consistente?
La suma de las probabilidades de todos los caminos del grafo vale 1. Se cumple porque, tras normalizar, cada nodo reparte probabilidad 1 entre sus arcos de salida.

### ¿Cambia la normalización el reparto de probabilidad entre las frases del grafo?
No, conserva la distribución relativa. Cada camino se multiplica por el mismo factor, $1/\beta(\text{inicio})$, así que el orden entre frases no cambia.

### ¿Qué convierte la normalización de un grafo de palabras en términos de probabilidad conjunta y posterior?
Convierte la conjunta $P(x, \pi)$ de cada camino en la posterior $P(\pi \mid x)$, porque divide entre $\beta(\text{inicio}) = P(x)$. El camino de mayor peso antes y después de normalizar es el mismo.

### En reconocimiento de texto manuscrito, ¿qué se maximiza y con qué se busca?
Se busca $\arg\max_w P(w)\,P(x \mid w)$, el modelo de lenguaje por la verosimilitud de la imagen dada la transcripción. El motor de búsqueda es Viterbi, a menudo con poda por haz.

### ¿Cómo se integran los modelos morfológico, léxico y sintáctico en un único PFSA para reconocimiento de texto?
Cada nivel se modela con un PFSA y se componen en una sola red enorme. Los modelos de carácter, el diccionario de pronunciación y el modelo de lenguaje se combinan como transductores y la red resultante se determiniza y minimiza.

### En la búsqueda N-best sobre un grafo de palabras, ¿qué es $\Phi[q]$ y cómo se calcula?
Es la probabilidad del mejor camino desde el nodo $q$ hasta un nodo final, incluido el peso final: $\Phi[q] = \max_{\pi \in P(q,f)} P(\pi)\,\rho(f)$. Se calcula hacia atrás, tomando en cada nodo el máximo de peso del arco por $\Phi$ del destino.

### ¿Qué guarda la cola de prioridad $S$ en el algoritmo N-best y cómo se ordena?
Guarda pares $(q, p)$ con un nodo y la probabilidad acumulada del camino parcial que llega a él. Va primero el par con mayor $p \cdot \Phi[q]$, es decir, el que tiene la mejor probabilidad posible de camino completo.

### ¿Por qué ordenar la cola por $p \cdot \Phi[q]$ y no solo por $p$?
Porque $p \cdot \Phi[q]$ es la probabilidad del mejor camino completo que se puede formar a partir de ese camino parcial. Así los caminos completos salen de la cola en orden decreciente de probabilidad. Con solo $p$ saldrían primero los caminos parciales más cortos, aunque no puedan completarse bien, y los caminos completos no saldrían en orden decreciente de probabilidad.

### ¿Para qué sirve el contador $r[q]$ en el algoritmo N-best?
Cuenta cuántos pares con primer elemento $q$ se han extraído de la cola. Mientras $r[q] \le N$ se expande el par, y cuando $r[q] > N$ ya no puede pertenecer a ninguno de los $N$ mejores caminos y se descarta sin expandir.

### ¿Cuándo termina el algoritmo N-best?
Cuando se extrae por $N$-ésima vez un nodo final, es decir, cuando $r[f] = N$ para un nodo final $f$. En ese momento ya se han extraído los $N$ mejores caminos completos.

### ¿Cómo se recupera una de las $N$ mejores cadenas en el algoritmo N-best?
Con el predecesor $\pi[(q,p)]$ de cada par. Desde el par final extraído se sigue la cadena de predecesores hasta $(\text{inicio}, 1)$ y se lee el camino al revés.

### ¿Por qué un mismo nodo puede extraerse de la cola varias veces con probabilidades distintas?
Porque a un nodo se llega por varios caminos parciales, cada uno con su propia probabilidad acumulada $p$. Cada uno es un par $(q, p)$ distinto en la cola. Por eso hace falta el contador $r[q]$ y no una marca de visitado.

### ¿Qué relación hay entre el primer resultado de N-best y Viterbi?
El primer camino extraído es el de mayor probabilidad, es decir, la solución de Viterbi. Los siguientes son el segundo, tercero y sucesivos mejores caminos.

### Problema: normaliza un grafo de palabras pequeño
Un grafo de palabras tiene nodos 0, 1, 2 y 3, con el nodo 0 como inicio y el 3 como final (peso final 1). Los arcos son: $0 \to 1$ con 0,4, $0 \to 2$ con 0,3, $1 \to 2$ con 0,1, $1 \to 3$ con 0,5 y $2 \to 3$ con 0,2. Calcula $\beta$, los pesos normalizados $\psi$ y comprueba las propiedades.

#### Paso 1
Se calcula $\beta$ hacia atrás. $\beta(3) = 1$. $\beta(2) = 0{,}2 \times \beta(3) = 0{,}2$. $\beta(1) = 0{,}1 \times \beta(2) + 0{,}5 \times \beta(3) = 0{,}02 + 0{,}5 = 0{,}52$. $\beta(0) = 0{,}4 \times \beta(1) + 0{,}3 \times \beta(2) = 0{,}208 + 0{,}06 = 0{,}268$.

#### Paso 2
Pesos normalizados $\psi(q', q) = P(q', q)\,\beta(q) / \beta(q')$:
- $\psi(0,1) = 0{,}4 \times 0{,}52 / 0{,}268 = 0{,}208 / 0{,}268 = 52/67 \approx 0{,}776$.
- $\psi(0,2) = 0{,}3 \times 0{,}2 / 0{,}268 = 0{,}06 / 0{,}268 = 15/67 \approx 0{,}224$.
- $\psi(1,2) = 0{,}1 \times 0{,}2 / 0{,}52 = 1/26 \approx 0{,}038$.
- $\psi(1,3) = 0{,}5 \times 1 / 0{,}52 = 25/26 \approx 0{,}962$.
- $\psi(2,3) = 0{,}2 \times 1 / 0{,}2 = 1$.

#### Paso 3
Buena formación: en el nodo 0, $52/67 + 15/67 = 1$. En el nodo 1, $1/26 + 25/26 = 1$. En el nodo 2, el único arco vale 1.

#### Paso 4
Consistencia y relación con la posterior. El camino $0 \to 1 \to 3$ pesaba $0{,}4 \times 0{,}5 = 0{,}2$ y ahora pesa $52/67 \times 25/26 = 50/67 \approx 0{,}746$, que es $0{,}2 / 0{,}268$. Los otros caminos pesan $0{,}4 \times 0{,}1 \times 0{,}2 = 0{,}008$ para $0 \to 1 \to 2 \to 3$ y $0{,}3 \times 0{,}2 = 0{,}06$ para $0 \to 2 \to 3$. Sus normalizados son $0{,}008/0{,}268 = 2/67$ y $0{,}06/0{,}268 = 15/67$. Suman $(50 + 2 + 15)/67 = 1$, y el orden de los caminos no ha cambiado.

### Problema: N-best con N=3 en un grafo de palabras
Un grafo de palabras tiene nodos 0 a 5, con inicio 0 y final 5 (peso final 1). Los arcos son: $0 \to 1$ con 0,6, $0 \to 2$ con 0,4, $1 \to 3$ con 0,5, $1 \to 4$ con 0,5, $2 \to 3$ con 0,9, $2 \to 4$ con 0,1, $3 \to 4$ con 0,3, $3 \to 5$ con 0,7 y $4 \to 5$ con 1. Obtén las 3 mejores cadenas con el algoritmo de la cola de prioridad.

#### Paso 1
Se calcula $\Phi$ hacia atrás con máximos: $\Phi[5] = 1$, $\Phi[4] = 1$, $\Phi[3] = \max(0{,}3 \times 1,\ 0{,}7 \times 1) = 0{,}7$, $\Phi[2] = \max(0{,}9 \times 0{,}7,\ 0{,}1 \times 1) = 0{,}63$, $\Phi[1] = \max(0{,}5 \times 0{,}7,\ 0{,}5 \times 1) = 0{,}5$ y $\Phi[0] = \max(0{,}6 \times 0{,}5,\ 0{,}4 \times 0{,}63) = \max(0{,}3;\ 0{,}252) = 0{,}3$.

#### Paso 2
Se inicializa $r[q]=0$ para todo nodo y $S = \{(0, 1)\}$. Cada extracción saca el par con mayor $p \cdot \Phi[q]$, suma 1 a $r[q]$ y encola los sucesores con $p' = p \times$ peso del arco.

| Extracción | Par $(q,p)$ | $p \cdot \Phi[q]$ | $r[q]$ | Se encolan (con $p'\cdot\Phi$) |
|---|---|---|---|---|
| 1 | $(0,\ 1)$ | 0,3 | 1 | $(1,\ 0{,}6)$ 0,3 y $(2,\ 0{,}4)$ 0,252 |
| 2 | $(1,\ 0{,}6)$ | 0,3 | 1 | $(3,\ 0{,}3)$ 0,21 y $(4,\ 0{,}3)$ 0,3 |
| 3 | $(4,\ 0{,}3)$ | 0,3 | 1 | $(5,\ 0{,}3)$ 0,3 |
| 4 | $(5,\ 0{,}3)$ | 0,3 | 1 | nada, nodo final |
| 5 | $(2,\ 0{,}4)$ | 0,252 | 1 | $(3,\ 0{,}36)$ 0,252 y $(4,\ 0{,}04)$ 0,04 |
| 6 | $(3,\ 0{,}36)$ | 0,252 | 1 | $(4,\ 0{,}108)$ 0,108 y $(5,\ 0{,}252)$ 0,252 |
| 7 | $(5,\ 0{,}252)$ | 0,252 | 2 | nada, nodo final |
| 8 | $(3,\ 0{,}3)$ | 0,21 | 2 | $(4,\ 0{,}09)$ 0,09 y $(5,\ 0{,}21)$ 0,21 |
| 9 | $(5,\ 0{,}21)$ | 0,21 | 3 | fin, $r[5] = N$ |

#### Paso 3
Las extracciones 4, 7 y 9 sacan el nodo final por primera, segunda y tercera vez, y cada una es una cadena de la lista N-best.

#### Paso 4
Se siguen los predecesores. Extracción 4: $(5,\ 0{,}3) \leftarrow (4,\ 0{,}3) \leftarrow (1,\ 0{,}6) \leftarrow (0,\ 1)$, camino 0-1-4-5 con 0,3. Extracción 7: $(5,\ 0{,}252) \leftarrow (3,\ 0{,}36) \leftarrow (2,\ 0{,}4) \leftarrow (0,\ 1)$, camino 0-2-3-5 con 0,252. Extracción 9: $(5,\ 0{,}21) \leftarrow (3,\ 0{,}3) \leftarrow (1,\ 0{,}6) \leftarrow (0,\ 1)$, camino 0-1-3-5 con 0,21.

#### Paso 5
Comprobación enumerando los 6 caminos del grafo: 0,3 (0-1-4-5), 0,252 (0-2-3-5), 0,21 (0-1-3-5), 0,108 (0-2-3-4-5), 0,09 (0-1-3-4-5) y 0,04 (0-2-4-5). Suman 1 y los tres primeros son los extraídos. Los pares que quedaban en la cola, $(4,\ 0{,}04)$, $(4,\ 0{,}108)$ y $(4,\ 0{,}09)$, tenían prioridad menor que 0,21 y son los de los tres peores caminos. El primero de la lista, 0,3, es la solución de Viterbi.
