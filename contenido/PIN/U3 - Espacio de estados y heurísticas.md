# PIN U3 - Espacio de estados y heurísticas

## 1. Introduction

### ¿Qué dos espacios de búsqueda se distinguen al planificar?
El espacio de estados, donde cada nodo es un estado del mundo y un plan es un camino, y el espacio de planes, donde cada nodo es un conjunto de operadores parcialmente instanciados con restricciones. Esta unidad trata el primero y el segundo es el de la planificación de orden parcial.

### En la planificación en el espacio de estados, ¿qué es un nodo, qué es un arco y qué es un plan?
Un nodo es un estado del mundo, un arco es una acción que lleva de un estado a otro y un plan es un camino desde el estado inicial hasta un estado que cumple el objetivo.

### ¿Cómo avanza la búsqueda en el espacio de planes, a diferencia de la del espacio de estados?
Parte de un plan parcial y le añade restricciones cada vez más fuertes, hasta que el conjunto de operadores y restricciones forma un plan. No recorre estados del mundo.

## 2. Forward search

### ¿Cuándo es aplicable una acción $a$ en un estado $s$ y cómo se calcula el estado resultante $\gamma(s, a)$?
Es aplicable cuando $\text{PRE}(a) \subseteq s$. El resultado es
$$\gamma(s, a) = (s \setminus \text{EFF}^-(a)) \cup \text{EFF}^+(a)$$
Es decir, se borran los efectos negativos y se añaden los positivos. Esta operación es la progresión.

### ¿Qué comprueba la búsqueda hacia delante en cada iteración antes de expandir un estado?
Primero, si la lista de estados pendientes está vacía, y entonces devuelve fallo. Después de elegir un estado $s$, comprueba si el objetivo se cumple en él ($g \subseteq s$), y entonces devuelve el plan asociado. Si no, genera un sucesor por cada acción aplicable en $s$.

### ¿Qué decide la función «choose» de la búsqueda hacia delante?
Qué estado de la lista de estados pendientes se expande a continuación. Esa elección es la estrategia de búsqueda: anchura, profundidad, profundidad iterativa, voraz, A* o IDA*. El esquema general es el mismo para todas.

### ¿Qué significa que la búsqueda hacia delante sea correcta (sound) y completa?
Correcta significa que todo plan que devuelve es de verdad una solución. Completa significa que devuelve una solución siempre que exista alguna.

### ¿Cuándo es completa la búsqueda en anchura y cuándo la búsqueda en profundidad?
La anchura es completa si el número de acciones es finito. La profundidad lo es si el espacio de estados es finito y el algoritmo detecta los estados repetidos (los bucles).

### ¿Por qué la búsqueda en anchura y A* se usan poco en planificación, aunque sean correctas y completas?
Porque necesitan memoria exponencial en la longitud de la solución. En la práctica se prefiere la búsqueda en profundidad, cuyo peor caso de memoria es lineal en esa longitud.

### ¿Por qué la búsqueda hacia delante puede ramificar tanto?
Porque en cada estado hay muchas acciones aplicables que no acercan al objetivo, y el algoritmo pierde tiempo probando acciones irrelevantes. Con 50 bloques sobre la mesa hay 50 acciones de recoger aplicables al principio, y la mayoría no sirve.

### ¿Qué dos formas hay de reducir la ramificación de la búsqueda hacia delante?
Con conocimiento del dominio, mediante reglas de control de la búsqueda y heurísticas escritas a mano. O con heurísticas independientes del dominio, que se calculan solas a partir de la descripción PDDL de la tarea.

### Problema: progresión de un estado con una acción
Operadores del mundo de bloques: $\text{unstack}(x,y)$ tiene $\text{PRE} = \{on(x,y), clear(x), handempty\}$, $\text{EFF}^+ = \{holding(x), clear(y)\}$ y $\text{EFF}^- = \{on(x,y), clear(x), handempty\}$. $\text{pickup}(x)$ tiene $\text{PRE} = \{ontable(x), clear(x), handempty\}$, $\text{EFF}^+ = \{holding(x)\}$ y $\text{EFF}^- = \{ontable(x), clear(x), handempty\}$. Estado $s = \{on(a,b), clear(a), ontable(b), handempty\}$. Calcula $\gamma(s, \text{unstack}(a,b))$ y di si después es aplicable $\text{pickup}(b)$.
#### Paso 1
Se comprueba la aplicabilidad. $\text{PRE}(\text{unstack}(a,b)) = \{on(a,b), clear(a), handempty\}$ y los tres literales están en $s$. Por tanto, la acción es aplicable.
#### Paso 2
Se borran los efectos negativos:
$$s \setminus \text{EFF}^- = \{on(a,b), clear(a), ontable(b), handempty\} \setminus \{on(a,b), clear(a), handempty\} = \{ontable(b)\}$$
#### Paso 3
Se añaden los efectos positivos:
$$s' = \{ontable(b)\} \cup \{holding(a), clear(b)\} = \{ontable(b), holding(a), clear(b)\}$$
#### Paso 4
Para $\text{pickup}(b)$ hace falta $\{ontable(b), clear(b), handempty\} \subseteq s'$. Están $ontable(b)$ y $clear(b)$, pero no $handempty$, porque la acción anterior lo borró. Por tanto, $\text{pickup}(b)$ no es aplicable en $s'$. Si el objetivo fuera $g = \{holding(a), clear(b)\}$, ya se cumpliría, porque $g \subseteq s'$.

## 3. Backward search (regression planning)

### ¿Qué representa cada nodo en la búsqueda hacia atrás?
Un estado objetivo, es decir, un conjunto de literales que hay que conseguir. La búsqueda empieza en $g$ y cada acción lleva de un estado objetivo $g$ a otro, $\gamma^{-1}(g, a)$.

### ¿Qué diferencia hay entre lo que representa un nodo en la búsqueda hacia delante y en la búsqueda hacia atrás?
Hacia delante, un nodo es un estado del mundo completo, alcanzado desde $s_0$. Hacia atrás, es un conjunto de literales que deben cumplirse antes del resto del plan, y puede describir muchos estados del mundo.

### ¿Cuándo es relevante una acción $a$ para un estado objetivo $g$?
Cuando cumple dos condiciones. Hace cierto al menos un literal de $g$, es decir, $g \cap \text{EFF}^+(a) \neq \emptyset$. Y no hace falso ninguno, es decir, $g^+ \cap \text{EFF}^-(a) = \emptyset$.

### ¿Por qué una acción que logra un literal de $g$ pero borra otro no es relevante?
Porque al ejecutarla se perdería un literal que ya hacía falta, y esa regresión no llevaría a un plan válido. La acción puede ser útil en otro momento, pero no como último paso para este $g$.

### ¿Cómo se calcula la regresión $\gamma^{-1}(g, a)$ de una acción relevante?
$$\gamma^{-1}(g, a) = (g \setminus \text{EFF}^+(a)) \cup \text{PRE}(a)$$
Se quita lo que la acción consigue y se añade lo que necesita para poder ejecutarse. Si la acción no es relevante, $\gamma^{-1}$ no está definida.

### ¿Por qué en la regresión se quitan los efectos positivos de $g$ y se añaden las precondiciones?
Porque lo que la acción consigue ya no hay que lograrlo antes, y en cambio sus precondiciones sí deben cumplirse justo antes de ejecutarla.

### ¿En qué lado del plan se añade cada acción en la búsqueda hacia atrás, y cuándo termina?
Se añade por delante, $\pi \leftarrow a.\pi$, porque la acción elegida es la última que se ejecuta de lo que falta. Termina cuando el estado inicial $s_0$ satisface el estado objetivo actual.

### ¿Por qué la regresión puede llegar a un estado objetivo imposible?
Porque solo comprueba la relevancia de la acción y no la coherencia del conjunto de literales resultante. Por ejemplo, regresar $\{on(b_1,b_2), on(b_2,b_3)\}$ con $\text{stack}(b_2,b_3)$ da $\{on(b_1,b_2), holding(b_2), clear(b_3)\}$. En él $b_1$ está sobre $b_2$ mientras la pinza sostiene $b_2$, y no se alcanza desde ningún estado real.

### ¿Por qué la búsqueda hacia atrás también puede tener un factor de ramificación muy grande?
Porque un operador relevante para $g$ puede tener muchas instancias base y el estado desde el que parte cada una puede ser inalcanzable desde $s_0$. Con el objetivo $holding(b_1)$ y 50 bloques en la mesa, son relevantes $\text{pickup}(b_1)$ y los 49 $\text{unstack}(b_1, y)$.

### Problema: regresión de un estado objetivo con varias acciones
Operadores: $\text{stack}(x,y)$ tiene $\text{PRE} = \{holding(x), clear(y)\}$, $\text{EFF}^+ = \{on(x,y), clear(x), handempty\}$ y $\text{EFF}^- = \{holding(x), clear(y)\}$. $\text{putdown}(x)$ tiene $\text{PRE} = \{holding(x)\}$, $\text{EFF}^+ = \{ontable(x), clear(x), handempty\}$ y $\text{EFF}^- = \{holding(x)\}$. $\text{unstack}(x,y)$ tiene $\text{EFF}^- = \{on(x,y), clear(x), handempty\}$ y $\text{pickup}(x)$ tiene $\text{EFF}^+ = \{holding(x)\}$ y $\text{EFF}^- = \{ontable(x), clear(x), handempty\}$. Estado objetivo $g = \{on(a,b), handempty\}$ y estado inicial $s_0 = \{holding(a), clear(b), ontable(b)\}$. Decide cuáles de estas cuatro acciones son relevantes para $g$: $\text{stack}(a,b)$, $\text{putdown}(c)$ con $c$ un bloque cualquiera distinto de $a$ y $b$, $\text{unstack}(a,b)$ y $\text{pickup}(a)$. Calcula las regresiones de las relevantes y comprueba si alguna cierra el plan desde $s_0$.
#### Paso 1
$\text{stack}(a,b)$. Interseca con $g$ en $on(a,b)$ y $handempty$, de modo que $g \cap \text{EFF}^+ \neq \emptyset$. Sus efectos negativos son $holding(a)$ y $clear(b)$, ninguno está en $g$. Por tanto, es relevante.
#### Paso 2
$\text{putdown}(c)$. Su $\text{EFF}^+$ contiene $handempty$, que está en $g$. Su $\text{EFF}^-$ es $\{holding(c)\}$, que no toca $g$. Por tanto, también es relevante.
#### Paso 3
$\text{unstack}(a,b)$ borra $on(a,b)$ y $handempty$, que están en $g$, así que no es relevante. $\text{pickup}(a)$ no logra ningún literal de $g$ y además borra $handempty$, así que tampoco lo es.
#### Paso 4
Regresión con $\text{stack}(a,b)$:
$$\gamma^{-1}(g, \text{stack}(a,b)) = (\{on(a,b), handempty\} \setminus \{on(a,b), clear(a), handempty\}) \cup \{holding(a), clear(b)\} = \{holding(a), clear(b)\}$$
Regresión con $\text{putdown}(c)$:
$$\gamma^{-1}(g, \text{putdown}(c)) = (\{on(a,b), handempty\} \setminus \{ontable(c), clear(c), handempty\}) \cup \{holding(c)\} = \{on(a,b), holding(c)\}$$
#### Paso 5
Se comprueba si $s_0$ satisface cada nuevo estado objetivo. Para $\{holding(a), clear(b)\}$, $s_0$ contiene los dos literales, así que el plan termina y es $\pi = (\text{stack}(a,b))$. Para $\{on(a,b), holding(c)\}$, $s_0$ no contiene ninguno, de modo que habría que seguir regresando por esa rama, que es peor.

## 4. Lifted backward search

### ¿Qué es la regresión lifted y qué problema resuelve?
Es la búsqueda hacia atrás con operadores parcialmente instanciados. Reduce el factor de ramificación: en vez de una rama por cada instancia base ($\text{unstack}(b_1,b_2)$, $\dots$, $\text{unstack}(b_1,b_{50})$), hay una sola, $\text{unstack}(b_1, y)$, con $y$ sin fijar.

### ¿Qué precio se paga por la regresión lifted?
Es más complicada, porque hay que llevar la cuenta de las sustituciones de variables que se van haciendo. A cambio, el factor de ramificación es mucho menor.

### ¿Por qué la regresión lifted no basta para que la búsqueda hacia atrás sea eficiente?
Porque el espacio sigue siendo demasiado grande y se prueban muchas secuencias de acciones desde las que no hay camino al estado inicial.

## 5. STRIPS

### ¿Qué es STRIPS?
Un planificador de Fikes y Nilsson (SRI, 1971). Su nombre se usó después para el lenguaje formal de entrada de los planificadores. El planificador hace una búsqueda hacia atrás lifted con una poda del espacio de búsqueda.

### ¿Cuál es la idea básica del planificador STRIPS?
Dado un objetivo compuesto $g = \{g_1, g_2, \dots\}$, resolver cada $g_i$ por separado, uno detrás de otro. Funciona si los objetivos son serializables.

### ¿Qué significa que los objetivos sean serializables?
Que se pueden resolver uno tras otro en algún orden lineal, de modo que lograr uno no obliga a deshacer los que ya están conseguidos.

### ¿En qué se diferencia el STRIPS de la regresión normal al formar los nuevos subobjetivos?
En la regresión, el nuevo estado objetivo es $\gamma^{-1}(g, a)$. En STRIPS, el nuevo conjunto de subobjetivos es solo $\text{PRE}(a)$.

### ¿Qué hace STRIPS en cuanto una acción es ejecutable en el estado actual?
La ejecuta, avanza por el camino actual todo lo que puede y la añade al plan. Se compromete con esa ejecución y no vuelve atrás sobre ella.

### ¿Por qué STRIPS es incompleto?
Por dos podas. En cada llamada solo trabaja sobre las precondiciones de la última acción añadida, y se compromete a ejecutar una acción en cuanto es aplicable sin retroceder. Ambas reducen mucho el espacio, pero pueden descartar todas las soluciones.

### ¿Qué problema plantea la anomalía de Sussman?
Con $c$ sobre $a$ y $b$ en la mesa, y el objetivo $\{on(a,b), on(b,c)\}$, STRIPS no encuentra una solución irredundante. Logra $on(a,b)$ y, al trabajar en $on(b,c)$, tiene que deshacerlo y rehacerlo.

### ¿Por qué los dos objetivos de la anomalía de Sussman no son serializables?
Si se empieza por $on(a,b)$, lograr $on(b,c)$ obliga a desmontar esa torre. Si se empieza por $on(b,c)$, queda $b$ sobre $c$ sobre $a$, y para liberar $a$ hay que deshacer $on(b,c)$. En los dos órdenes un objetivo estorba al otro.

### ¿Cuántas acciones tiene el plan que halla STRIPS en la anomalía de Sussman frente al plan óptimo?
Diez acciones frente a seis. El óptimo es $\text{unstack}(c,a)$, $\text{putdown}(c)$, $\text{pickup}(b)$, $\text{stack}(b,c)$, $\text{pickup}(a)$, $\text{stack}(a,b)$. En el plan de STRIPS sobran las que consiguen $on(a,b)$ y luego lo deshacen.

### Problema: ejecutar el plan que halla STRIPS en la anomalía de Sussman
Estado inicial `{on(c,a), ontable(a), ontable(b), clear(c), clear(b), handempty}` y objetivo $\{on(a,b), on(b,c)\}$. STRIPS devuelve el plan $\text{unstack}(c,a)$, $\text{putdown}(c)$, $\text{pickup}(a)$, $\text{stack}(a,b)$, $\text{unstack}(a,b)$, $\text{putdown}(a)$, $\text{pickup}(b)$, $\text{stack}(b,c)$, $\text{pickup}(a)$, $\text{stack}(a,b)$. Ejecútalo estado a estado, comprueba que es solución y encuentra un plan más corto quitándole acciones.
#### Paso 1
Con $\text{unstack}(c,a)$ y $\text{putdown}(c)$ se llega a $\{clear(a), clear(b), clear(c), handempty, ontable(a), ontable(b), ontable(c)\}$. Es lo que hace falta para poder recoger $a$.
#### Paso 2
Con $\text{pickup}(a)$ y $\text{stack}(a,b)$ se llega a $\{clear(a), clear(c), handempty, on(a,b), ontable(b), ontable(c)\}$. Ya está $on(a,b)$, el primer objetivo.
#### Paso 3
Para $on(b,c)$ hace falta $b$ libre, de modo que $\text{unstack}(a,b)$ y $\text{putdown}(a)$ deshacen $on(a,b)$ y devuelven los tres bloques a la mesa: $\{clear(a), clear(b), clear(c), handempty, ontable(a), ontable(b), ontable(c)\}$.
#### Paso 4
Con $\text{pickup}(b)$ y $\text{stack}(b,c)$ se llega a $\{clear(a), clear(b), handempty, on(b,c), ontable(a), ontable(c)\}$. Con $\text{pickup}(a)$ y $\text{stack}(a,b)$ se llega a $\{clear(a), handempty, on(a,b), on(b,c), ontable(c)\}$, que contiene el objetivo. El plan de 10 acciones es solución.
#### Paso 5
Las acciones $\text{pickup}(a)$, $\text{stack}(a,b)$, $\text{unstack}(a,b)$ y $\text{putdown}(a)$ de los Pasos 2 y 3 se anulan entre sí. Sin ellas queda $\text{unstack}(c,a)$, $\text{putdown}(c)$, $\text{pickup}(b)$, $\text{stack}(b,c)$, $\text{pickup}(a)$, $\text{stack}(a,b)$, que sigue siendo ejecutable y llega al objetivo. El plan de STRIPS era redundante, y el de 6 acciones es el óptimo.

## 6. Heuristics for state-space planning

### ¿Qué dos decisiones definen a un planificador de estados hacia delante?
La estrategia de búsqueda y la función de selección de nodo, que es la evaluación heurística. Fast Forward (FF) es un planificador de este tipo.

### ¿Qué coste tienen los operadores en este tema y qué es entonces la calidad de un plan?
Cada operador cuesta 1, de modo que el coste de un plan es su longitud, es decir, su número de acciones.

### En A*, ¿qué significan $g(s)$, $h^*(s)$ y $f^*(s)$?
$g(s)$ es el coste del camino de $s_0$ a $s$. $h^*(s)$ es el menor coste de $s$ a un estado objetivo. $f^*(s) = g(s) + h^*(s)$ es el menor coste de un camino de $s_0$ a un objetivo que pasa por $s$.

### ¿Qué es la función heurística $h(s)$ y qué se pretende al diseñarla?
Una estimación de $h^*(s)$, no negativa (puede valer $\infty$). Se diseña para acercarse lo más posible a $h^*(s)$.

### ¿Qué diferencia hay entre un algoritmo de tipo A y A*?
Con $f(s) = g(s) + h(s)$, cualquier $h$ da un algoritmo de tipo A. Si además $h$ es admisible, el algoritmo es A*.

### ¿Cuándo es admisible una heurística?
Cuando no sobreestima nunca el coste real: $0 \le h(s) \le h^*(s)$ para todo estado $s$. Entonces $f$ es una cota inferior de $f^*$.

### ¿Qué estado elige A* para expandir y cuándo se detiene?
Elige el estado de la frontera con menor $f = g + h$. Se detiene cuando el estado que va a expandir cumple el objetivo, y devuelve su camino.

### ¿Qué garantiza A* si $h$ es admisible?
Que, si existe solución y se cumplen ciertas condiciones adicionales que las transparencias no detallan, encuentra una solución óptima.

### ¿Qué efecto tiene que una heurística admisible esté más informada, es decir, más cerca de $h^*$?
Que A* expande menos nodos para encontrar la solución óptima.

### Si $h(s) \le h^*(s) + c$ para todo $s$, ¿qué garantiza A*?
Que encuentra una solución cuyo coste está a lo sumo $c$ por encima del óptimo. Es una heurística que se pasa como máximo en $c$.

### ¿Qué hace falta añadir a A* en búsqueda en grafo, a diferencia de en árbol?
Un tratamiento de los caminos múltiples hacia un mismo nodo, para no expandirlo repetidamente ni quedarse con un camino peor.

### ¿Cómo funciona el hill-climbing en planificación?
Desde el estado actual $s$ genera los sucesores y se mueve al de menor $h$, siempre que mejore a $h(s)$. Es una búsqueda local voraz: toma la mejor opción inmediata sin mirar el problema entero.

### ¿Qué diferencia hay entre el hill-climbing y A* en la forma de elegir el siguiente nodo?
A* elige entre toda la frontera el nodo de menor $f = g + h$ y puede volver a nodos antiguos. El hill-climbing solo mira los hijos del estado actual, usa solo $h$ y no retrocede.

### ¿Cuándo falla el hill-climbing?
Cuando ningún sucesor del estado actual mejora $h(s)$, por ejemplo en un mínimo local o en una meseta. Entonces no tiene a dónde moverse.

### ¿Cómo funciona el enforced hill-climbing de FF?
Mientras $h(s) \neq 0$, hace una búsqueda en anchura desde $s$ hasta encontrar un sucesor $s'$ con $h(s') < h(s)$. Añade al plan las acciones del camino de $s$ a $s'$ y continúa desde $s'$. Falla si la anchura se agota sin hallar ese estado.

### ¿Qué ventaja tiene el enforced hill-climbing sobre el hill-climbing simple?
Que no se queda atascado cuando ningún hijo directo mejora $h$, porque busca en anchura más allá de los hijos hasta encontrar un estado mejor. A cambio, no garantiza planes óptimos y puede fallar si la anchura se agota sin hallar ese estado.

### ¿Por qué un planificador como FF no garantiza planes óptimos?
Porque usa enforced hill-climbing, que se queda con el primer estado que mejora $h$ y no explora el resto, de modo que el plan que devuelve no tiene por qué ser el más corto.

### ¿En qué consiste la heurística de conteo de objetivos?
$h(s)$ es el número de literales de $G$ que no están en $s$. Es muy simple de calcular.

### ¿Qué es $\Delta^*(s, p)$ y qué estima $\Delta(s, p)$?
$\Delta^*(s,p)$ es el mínimo número de acciones necesarias para llegar desde $s$ a un estado que contiene la proposición $p$. $\Delta(s,p)$ es una estimación de ese valor.

### ¿Cómo se define $\Delta(s, p)$ de forma recursiva?
Vale 0 si $p \in s$, vale $\infty$ si ninguna acción tiene $p$ en sus efectos positivos, y en otro caso
$$\Delta(s, p) = \min_a \{ 1 + \Delta(s, \text{PRE}(a)) \mid p \in \text{EFF}^+(a) \}$$
Es decir, la mejor acción que consigue $p$, más lo que cuesta cumplir sus precondiciones.

### ¿Cómo se pasa de $\Delta$ sobre una proposición a $\Delta$ sobre un conjunto, como $G$ o $\text{PRE}(a)$?
En la heurística suma se suman las $\Delta$ de cada proposición y en la heurística máximo se toma el máximo, tanto sobre $G$ como sobre $\text{PRE}(a)$.

### ¿Cómo se definen las heurísticas suma y máximo del objetivo $G$?
$$h_{sum}(s) = \sum_{i=1}^{k} \Delta(s, g_i) \qquad h_{max}(s) = \max_{i} \Delta(s, g_i)$$

### ¿Qué ignora $\Delta$ al estimar el coste de lograr una proposición?
Los efectos negativos: no comprueba que lo que ya se consiguió siga siendo cierto cuando se logra lo demás. Por eso es una estimación y no la distancia real.

### ¿Cuál de las heurísticas $h_{sum}$ y $h_{max}$ es admisible y por qué?
$h_{max}$ es admisible: hay que lograr al menos el objetivo más caro, y tomar el máximo no sobreestima. $h_{sum}$ no lo es, porque una misma acción puede lograr varios objetivos y la suma la cuenta varias veces.

### ¿Por qué la heurística de conteo de objetivos no es admisible en general?
Porque una acción puede lograr dos objetivos a la vez. Con $G = \{on(a,b), clear(a)\}$ y $s = \{holding(a), clear(b)\}$, $\text{stack}(a,b)$ logra los dos, de modo que $h^* = 1$, pero el conteo vale 2.

### ¿Qué significa que una heurística sea consistente (monótona)?
Que para todo estado $n$ y todo sucesor $n'$ por una acción de coste $c(n,n')$ se cumple $h(n) \le c(n,n') + h(n')$. Con esa condición, $f$ no decrece a lo largo de un camino.

### ¿Qué relación hay entre consistencia y admisibilidad?
Toda heurística consistente con $h(\text{objetivo}) = 0$ es admisible, pero una heurística admisible puede no ser consistente.

### ¿Cómo se comprueba a mano la admisibilidad frente a la consistencia?
La admisibilidad se comprueba nodo a nodo, comparando $h(n)$ con $h^*(n)$, que exige calcular el coste óptimo restante. La consistencia se comprueba arista a arista, con $h(n) \le c + h(n')$, y no necesita $h^*$.

### Problema: A* y búsqueda voraz sobre el mismo grafo
Grafo dirigido con costes: $S \to A$ (4), $S \to B$ (1), $A \to G$ (5), $B \to C$ (1), $B \to D$ (2), $C \to G$ (2), $D \to G$ (3). Heurística: $h(S)=4$, $h(A)=1$, $h(B)=3$, $h(C)=2$, $h(D)=2$, $h(G)=0$. Parte de $S$, el objetivo es $G$. Ejecuta A* con $f = g + h$ y la búsqueda voraz con $f = h$, y compara.
#### Paso 1
A* expande $S$. Los hijos son $A$ con $g=4$ y $f=4+1=5$, y $B$ con $g=1$ y $f=1+3=4$. La frontera es $\{A:5,\ B:4\}$.
#### Paso 2
A* expande $B$, que tiene la menor $f$. Los hijos son $C$ con $g=2$ y $f=2+2=4$, y $D$ con $g=3$ y $f=3+2=5$. La frontera es $\{A:5,\ C:4,\ D:5\}$.
#### Paso 3
A* expande $C$. Su hijo es $G$ con $g=2+2=4$ y $f=4+0=4$. La frontera es $\{A:5,\ D:5,\ G:4\}$.
#### Paso 4
A* elige $G$ (con $f=4$), que cumple el objetivo, y se detiene sin expandirlo. El camino es $S, B, C, G$ y cuesta 4. Ha expandido $S$, $B$ y $C$, y nunca ha expandido $A$ ni $D$, aunque sí los ha generado. El camino es óptimo.
#### Paso 5
Búsqueda voraz. Expande $S$ y los hijos tienen $h(A)=1$ y $h(B)=3$. Elige $A$ porque su $h$ es menor. Su único hijo es $G$ con $h=0$, y lo elige. El camino es $S, A, G$ y cuesta $4+5=9$.
#### Paso 6
La voraz expande dos nodos ($S$ y $A$) frente a los tres de A*, pero se deja engañar por $h(A)=1$ y devuelve un camino de coste 9, más del doble del óptimo. A* tiene en cuenta el coste ya pagado $g$ y por eso encuentra el camino de coste 4.

### Problema: comprobar si una heurística es admisible y consistente
Con el mismo grafo del problema anterior, considera la heurística $h'$ con $h'(S)=4$, $h'(A)=1$, $h'(B)=3$, $h'(C)=0$, $h'(D)=2$, $h'(G)=0$. Decide si $h'$ es admisible y si es consistente.
#### Paso 1
Se calcula el coste óptimo restante $h^*$ de cada nodo. $h^*(G)=0$. $h^*(C)=2$. $h^*(D)=3$. $h^*(A)=5$. $h^*(B)=\min(1+2,\ 2+3)=3$. $h^*(S)=\min(4+5,\ 1+3)=4$.
#### Paso 2
Admisibilidad: se compara $h'(n) \le h^*(n)$ en cada nodo. Se cumple $4 \le 4$, $1 \le 5$, $3 \le 3$, $0 \le 2$, $2 \le 3$ y $0 \le 0$. Por tanto, $h'$ es admisible.
#### Paso 3
Consistencia: se comprueba $h'(n) \le c(n,n') + h'(n')$ en cada arista.
| Arista | $h'(n)$ | $c + h'(n')$ | ¿Cumple? |
|---|---|---|---|
| $S \to A$ | 4 | $4+1=5$ | Sí |
| $S \to B$ | 4 | $1+3=4$ | Sí |
| $A \to G$ | 1 | $5+0=5$ | Sí |
| $B \to C$ | 3 | $1+0=1$ | **No** |
| $B \to D$ | 3 | $2+2=4$ | Sí |
| $C \to G$ | 0 | $2+0=2$ | Sí |
| $D \to G$ | 2 | $3+0=3$ | Sí |
#### Paso 4
La arista $B \to C$ falla, porque $3 > 1$. Por tanto, $h'$ es admisible pero no consistente. Se ve en que $f$ baja al pasar de $B$ a $C$: $f(B)=1+3=4$ y $f(C)=2+0=2$. Esto confirma que la consistencia es más fuerte que la admisibilidad. Si se cambiara $h'(C)$ a 4, no sería admisible, ya que $4 > h^*(C)=2$.

### Problema: Δ, heurística suma y heurística máximo en un estado
Acciones, todas con un único efecto positivo. $\text{move}_{AB}$ tiene $\text{PRE} = \{at(r,A)\}$ y logra $at(r,B)$. $\text{move}_{BC}$ tiene $\text{PRE} = \{at(r,B)\}$ y logra $at(r,C)$. $\text{load}$ tiene $\text{PRE} = \{at(r,A), at(p,A)\}$ y logra $in(p)$. $\text{unload}$ tiene $\text{PRE} = \{at(r,C), in(p)\}$ y logra $at(p,C)$. Estado $s = \{at(r,A), at(p,A)\}$ y objetivo $G = \{at(r,C), at(p,C)\}$. Calcula el conteo de objetivos, $h_{sum}$, $h_{max}$ y el valor real $h^*$, y di cuáles son admisibles en este estado.
#### Paso 1
Las proposiciones que ya están en $s$ valen 0: $\Delta(at(r,A)) = 0$ y $\Delta(at(p,A)) = 0$.
#### Paso 2
$\Delta(at(r,B)) = 1 + \Delta(at(r,A)) = 1$. $\Delta(at(r,C)) = 1 + \Delta(at(r,B)) = 2$. Es igual con suma y con máximo, porque cada precondición es una sola.
#### Paso 3
$\Delta(in(p))$ tiene como precondiciones $at(r,A)$ y $at(p,A)$, ambas de coste 0. Con suma vale $1+0+0=1$ y con máximo $1+\max(0,0)=1$.
#### Paso 4
$\Delta(at(p,C))$ tiene como precondiciones $at(r,C)$ (coste 2) e $in(p)$ (coste 1). Con suma vale $1+(2+1)=4$. Con máximo vale $1+\max(2,1)=3$.
#### Paso 5
Heurísticas del estado $s$. El conteo vale 2, porque ninguno de los dos objetivos está en $s$. $h_{sum} = \Delta(at(r,C)) + \Delta(at(p,C)) = 2 + 4 = 6$. $h_{max} = \max(2, 3) = 3$.
#### Paso 6
El plan óptimo es $\text{load}$, $\text{move}_{AB}$, $\text{move}_{BC}$, $\text{unload}$, de longitud 4, así que $h^*(s) = 4$.
#### Paso 7
El conteo (2) y $h_{max}$ (3) no pasan de 4, así que son admisibles aquí. $h_{sum}$ vale 6 y sobreestima, de modo que no es admisible. La causa es que cuenta dos veces el desplazamiento del robot a $C$: una vez como objetivo y otra dentro de la precondición de $\text{unload}$.

### Problema: hill-climbing simple y enforced hill-climbing sobre el mismo grafo
Grafo dirigido: $S \to A$, $S \to B$, $A \to C$, $B \to D$, $C \to G$, $D \to G$. Heurística: $h(S)=3$, $h(A)=3$, $h(B)=4$, $h(C)=3$, $h(D)=4$, $h(G)=0$. Parte de $S$ y el objetivo es $G$. Ejecuta el hill-climbing simple y el enforced hill-climbing.
#### Paso 1
Hill-climbing simple. Los sucesores de $S$ son $A$ ($h=3$) y $B$ ($h=4$). El mejor es $A$, pero $h(A)=3$ no es menor que $h(S)=3$. No hay ningún sucesor que mejore $h$, de modo que se detiene sin plan: es una meseta.
#### Paso 2
Enforced hill-climbing. Busca en anchura desde $S$ un estado con $h<3$. En el nivel 1 están $A$ ($h=3$) y $B$ ($h=4$). En el nivel 2, $C$ ($h=3$) y $D$ ($h=4$). Ninguno mejora.
#### Paso 3
En el nivel 3 aparece $G$ con $h=0<3$. Se añaden al plan las acciones del camino de $S$ a $G$ (con empate, el primero generado): $S \to A \to C \to G$. Como $h(G)=0$ el bucle termina.
#### Paso 4
El enforced hill-climbing sale de la meseta porque busca más allá de los hijos directos. A cambio, el plan tiene tres acciones, que no tiene por qué ser el óptimo, y fallaría si la búsqueda en anchura agotara el espacio sin encontrar un estado con $h$ menor.
