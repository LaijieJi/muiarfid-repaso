# PIN U4 - Aprendizaje por refuerzo

## 1. Problemas de control con decisiones secuenciales

### ¿Qué es un problema de control?
Es un problema en el que un sistema se describe con variables de estado y se controla tomando decisiones que modifican esas variables. Una decisión es un curso de acción elegido a propósito, a lo largo del tiempo, para alcanzar unos objetivos.

### ¿Qué tres tipos de objetivo aparecen en un problema de control?
Objetivo de alcance (llegar a un estado o condición), objetivo de mantenimiento (conservar una condición a lo largo del tiempo) y maximizar una puntuación. Las transparencias solo los enumeran. El refuerzo optimiza la recompensa acumulada, que es el tercero.

### ¿Qué tiene en común un agente planificador y un agente de aprendizaje por refuerzo?
Los dos son agentes con capacidad de actuar. En cada estado deciden qué acción ejecutar, y esa acción cambia las variables de estado del problema. Se diferencian en cómo obtienen la decisión.

## 2. Planificar para resolver un problema de control

### ¿Qué significa planificación offline?
Calcular el plan completo antes de actuar. El control se sintetiza a partir de un modelo del problema y después se ejecuta el plan.

### ¿Qué modelo del mundo necesita un planificador para resolver un problema de control?
Las variables de estado, el modelo de acciones, el estado inicial y el estado objetivo. En PDDL, las dos primeras cosas van en el dominio y las dos últimas en el problema.

### ¿Qué ventajas tiene resolver un problema de control con un planificador?
El solver es flexible e independiente del dominio, razona sobre estados y acciones y su resultado es interpretable, al contrario que un modelo de caja negra. Es adecuado para tareas de satisfacción, es decir, alcanzar un objetivo.

### ¿Qué inconvenientes tiene resolver un problema de control con un planificador?
Exige que un experto especifique el modelo. La solución es propia de una instancia, así que no generaliza. Además, el cálculo es intratable: con lenguaje proposicional la planificación es PSPACE-completa.

### En el control con planificación mediante FF, ¿qué se hace con los estados sucesores?
Desde el estado actual se generan los sucesores con las acciones aplicables y se evalúa cada uno con una heurística $h$. La búsqueda decide con esa estimación y necesita simular cómo evoluciona el problema con el modelo.

## 3. Aprender para resolver un problema de control

### ¿En qué se diferencia aprender de planificar para resolver un problema de control?
Aprender es decidir y actuar, sin simular la evolución del problema. El agente aprende el control a partir de la experiencia con el entorno, mientras que el planificador calcula el control a partir de un modelo antes de actuar.

### ¿Por qué se necesita aprendizaje cuando no hay modelo del mundo?
Porque no siempre se dispone de una especificación del mundo. El enfoque model-free permite aprender el control directamente de la interacción, sin conocer las transiciones ni las recompensas.

### ¿Qué intercambian el agente y el entorno en cada paso del aprendizaje por refuerzo?
El agente recibe el estado $s_t$ y elige una acción $a_t$. El entorno responde con el siguiente estado $s_{t+1}$ y una recompensa. La solución que busca el agente es una política $\pi: S \to A$.

### ¿Qué es una política?
Una función que dice qué acción tomar en cada estado. Es lo que aprende el agente de refuerzo y determina su comportamiento. Puede ser determinista, $\pi: S \to A$, o estocástica, $\pi(a \mid s)$.

### ¿Cómo aprende un agente de aprendizaje por refuerzo?
Por prueba y error. Parte de una política aleatoria y la refina de forma iterativa para obtener la mayor recompensa posible a lo largo del tiempo, dando más peso a las recompensas cercanas en el tiempo.

### ¿Por qué se usan MDP en entornos estocásticos?
Porque el resultado de las acciones del agente es incierto (el modelo de transición no es determinista). Los modelos más usados para tratar esta incertidumbre se basan en la suposición de Markov, y los MDP son uno de ellos.

## 4. Proceso de decisión de Markov (MDP)

### ¿Qué dice la propiedad de Markov en un MDP?
La recompensa y el siguiente estado en el instante $t+1$ dependen probabilísticamente solo del par estado-acción del instante $t$. No hace falta conocer la historia anterior para predecir el futuro.

### ¿Qué componentes tiene un MDP?
Una tupla $M = (S, A, T, R)$. $S$ es el conjunto de estados, $A$ el de acciones, $T$ el modelo de transición y $R: S \times A \to \mathbb{R}$ la recompensa al tomar la acción $a$ en el estado $s$.

### ¿Qué representa $p(s' \mid s, a)$?
La probabilidad de llegar al estado $s'$ al tomar la acción $a$ en el estado $s$. La transición es $T: S \times A \to Pr(S)$, es decir, una distribución de probabilidad sobre los estados.

### ¿Cómo se diferencia un MDP determinista de uno estocástico?
En el determinista, $T: S \times A \to S$ y $p(s' \mid s, a) = 1$ para un único $s'$. En el estocástico, la misma acción puede llevar a estados distintos con probabilidades que suman 1.

### En una cuadrícula de 3 filas y 4 columnas con una casilla bloqueada, con $s_0$ en la esquina inferior izquierda y $s_4$ encima, ¿qué significan las probabilidades 0,8, 0,1 y 0,1 de la acción "up" en $s_0$?
Con probabilidad 0,8 el agente sube a $s_4$. Con 0,1 se desliza a la derecha y llega a $s_1$, y con 0,1 se desliza a la izquierda, choca con el borde y se queda en $s_0$.

### ¿Qué es una política estocástica $\pi(a \mid s)$?
La probabilidad de tomar la acción $a$ en el estado $s$. Para cada estado las probabilidades de todas las acciones suman 1. Por ejemplo, $\pi(\text{up} \mid s_0) = 0{,}95$ y $\pi(\text{right} \mid s_0) = 0{,}05$.

### ¿Cuál es el objetivo al resolver un MDP?
Obtener la política óptima, la que maximiza la recompensa acumulada esperada.

### En esa cuadrícula de MDP (+1 en la esquina superior derecha y -1 debajo de ella) con recompensa $-0{,}04$ por casilla normal, ¿qué hace la política óptima ante el estado de $-1$?
Se aleja de él y da un rodeo, porque el coste por paso es pequeño. En la fila inferior las flechas apuntan hacia la izquierda, hacia el inicio, y la ruta sube por la columna izquierda y cruza la fila superior hasta $+1$, de modo que se evita el riesgo de deslizarse a $-1$.

### En esa cuadrícula de MDP, ¿cómo cambia la política óptima si cada paso cuesta $-2$ en lugar de $-0{,}04$?
Pasa a terminar el episodio lo antes posible, incluso entrando en el estado de $-1$, porque cada paso extra cuesta más que esa penalización. Una recompensa por paso grande y negativa empuja a acabar rápido.

### En esa cuadrícula de MDP, ¿cómo cambia la política óptima si cada paso da $+2$?
El agente evita los estados terminales y se mueve sin acabar, porque seguir en la cuadrícula acumula recompensa positiva. Esto muestra que la política óptima depende de la recompensa y no solo de la meta.

## 5. Aprendizaje por refuerzo

### ¿Por qué el agente necesita medir la utilidad de una secuencia de estados y no solo la recompensa inmediata?
Para que su visión del futuro no se limite a la recompensa de la siguiente acción. Así puede avanzar hacia direcciones de recompensa positiva y alejarse de las negativas.

### ¿Qué es el factor de descuento $\gamma$ y qué rango tiene?
Un número $0 \le \gamma \le 1$ que pondera las recompensas futuras. Favorece las inmediatas y resta peso a las lejanas, porque en un entorno estocástico no se sabe si se llegará a los estados futuros. Si $\gamma$ está cerca de 1, el futuro importa más.

### ¿Cómo se define el retorno $G_t$?
Como la suma descontada de recompensas desde el instante $t$:

$$G_t = \sum_{k=0}^{\infty} \gamma^k R_{t+k}$$

Es una variable aleatoria. El objetivo del aprendizaje por refuerzo es refinar la política para maximizar su esperanza en el instante inicial.

### Problema: calcula el retorno de una secuencia de recompensas
Un agente recibe las recompensas 1, 0 y 4 en tres pasos consecutivos y $\gamma = 0{,}5$. Calcula $G_0$ y cuánto valdría con $\gamma = 1$.

#### Paso 1
$G_0 = 1 + 0{,}5 \cdot 0 + 0{,}5^2 \cdot 4 = 1 + 0 + 1 = 2$.

#### Paso 2
Con $\gamma = 1$ no hay descuento y $G_0 = 1 + 0 + 4 = 5$. Con $\gamma = 0{,}5$ la recompensa de 4, que llega dos pasos después, solo aporta 1.

### ¿Qué es el valor de un estado $V^\pi(s)$?
El retorno esperado al partir de $s$ y seguir la política $\pi$:

$$V^\pi(s) = \mathbb{E}_\pi\left[\sum_{k=0}^{\infty} \gamma^k R_{t+k} \mid s_t = s\right]$$

### ¿Qué es el valor de una acción $Q^\pi(s, a)$ y en qué se diferencia de $V^\pi(s)$?
Es el retorno esperado al tomar la acción $a$ en el estado $s$ y seguir después $\pi$. $V^\pi(s)$ solo fija el estado, mientras que $Q^\pi(s,a)$ fija también la primera acción.

### ¿Qué relación hay entre $V^*$, $Q^*$ y la política óptima?
$V^*(s) = \max_\pi V^\pi(s) = \max_a Q^*(s, a)$. La política óptima es la codiciosa respecto a $Q^*$: $\pi^*(s) = \arg\max_a Q^*(s, a)$.

### ¿Qué dice la ecuación de Bellman para $V^\pi$?
El valor de un estado es la recompensa inmediata más el valor descontado del estado siguiente, promediando sobre las acciones de la política y las transiciones:

$$V^\pi(s) = \sum_a \pi(a \mid s) \Big[ R(s,a) + \gamma \sum_{s'} p(s' \mid s, a)\, V^\pi(s') \Big]$$

### ¿Qué forma tiene la ecuación de Bellman de optimalidad para $Q^*$?
$$Q^*(s,a) = R(s,a) + \gamma \sum_{s'} p(s' \mid s, a) \max_{a'} Q^*(s', a')$$

La política ya no promedia, porque en el estado siguiente se toma la mejor acción.

### ¿Por qué la ecuación de Bellman da un método recursivo para calcular valores?
Porque el valor de un estado se expresa con el valor de sus sucesores, de modo que los valores se pueden calcular de forma iterativa a partir de los de los estados siguientes.

### Si se conoce el modelo de transición, ¿cómo se calcula una política óptima?
Con programación dinámica, mediante iteración de valores o iteración de políticas. Se basan en las ecuaciones de Bellman, convergen en el límite y dan políticas tan precisas como se quiera. Se detienen cuando la diferencia entre dos iteraciones es menor que un $\theta$ pequeño.

### ¿Qué limitación tienen la iteración de valores y la iteración de políticas?
Usan directamente el sistema de transiciones del MDP, así que $p(s' \mid s, a)$ tiene que ser conocido. Si no lo es, hacen falta métodos sin modelo como Q-learning.

### Problema: valor de una política en un MDP pequeño
Un MDP tiene los estados $A$, $B$ y un estado final $T$ con $V(T) = 0$, y $\gamma = 0{,}5$. En $B$ la única acción, "avanzar", lleva a $T$ con probabilidad 1 y recompensa 4. En $A$ hay dos acciones. "Avanzar" lleva a $B$ con probabilidad 0,8 y deja en $A$ con probabilidad 0,2, con recompensa 2. "Esperar" deja en $A$ con probabilidad 1 y recompensa 1. Calcula $V^\pi(A)$ y $V^\pi(B)$ para tres políticas en $A$: siempre avanzar, siempre esperar, y avanzar con probabilidad 0,25 y esperar con 0,75. Después, con $V^\pi$ de la primera política, elige la acción codiciosa en $A$.

#### Paso 1
El valor de $B$ no depende de la política en $A$:

$$V(B) = 4 + 0{,}5 \cdot V(T) = 4.$$

#### Paso 2
Con "siempre avanzar", la ecuación de Bellman en $A$ es:

$$V(A) = 2 + 0{,}5\,(0{,}8 \cdot 4 + 0{,}2\,V(A)) = 3{,}6 + 0{,}1\,V(A).$$

Despejando, $0{,}9\,V(A) = 3{,}6$ y por tanto $V(A) = 4$.

#### Paso 3
Con "siempre esperar", $V(A) = 1 + 0{,}5\,V(A)$, así que $V(A) = 2$.

#### Paso 4
Con la política mixta se promedian las dos ramas con sus probabilidades:

$$V(A) = 0{,}25\,(3{,}6 + 0{,}1\,V(A)) + 0{,}75\,(1 + 0{,}5\,V(A)) = 1{,}65 + 0{,}4\,V(A).$$

Despejando, $0{,}6\,V(A) = 1{,}65$ y por tanto $V(A) = 2{,}75$.

#### Paso 5
Con los valores de la primera política ($V(A) = 4$, $V(B) = 4$), los valores de acción en $A$ son:

- $Q(A, \text{avanzar}) = 2 + 0{,}5\,(0{,}8 \cdot 4 + 0{,}2 \cdot 4) = 4$.
- $Q(A, \text{esperar}) = 1 + 0{,}5 \cdot 4 = 3$.

La política codiciosa elige "avanzar" en $A$. Es coherente con los valores de los pasos 2 a 4, donde avanzar da más (4) que esperar (2) o que mezclar (2,75).

## 6. Métodos sin modelo

### ¿Qué es el aprendizaje por refuerzo sin modelo (model-free)?
Aprender una política directamente desde las observaciones del estado, sin construir explícitamente un modelo del entorno. Se usa cuando no se conoce la función de transición $T: S \times A \to Pr(S)$.

### ¿De dónde sacan los métodos sin modelo la información para estimar la política óptima?
De la experiencia generada al interactuar con el entorno, que se recoge en forma de trayectorias. Con ellas se actualiza el valor de los pares $(s_t, a_t)$.

### ¿Qué diferencia hay entre Monte-Carlo y diferencia temporal (TD)?
Monte-Carlo actualiza el valor con la suma de recompensas de la trayectoria completa (el episodio entero), mientras que TD actualiza con transiciones individuales, paso a paso dentro del episodio.

### ¿Qué es Q-learning?
Un algoritmo TD estándar sin modelo que aprende la función $Q^*(s,a)$ de forma iterativa con las ecuaciones de optimalidad de Bellman. Estima la política óptima con información en línea, es decir, con los pasos dentro de un episodio.

### ¿Cómo se obtiene la política óptima a partir de la tabla Q?
Eligiendo en cada estado la acción de mayor valor, $\pi^*(s) = \arg\max_a Q^*(s, a)$. Esta es la política codiciosa respecto a $Q$.

### ¿Cuál es la regla de actualización de Q-learning?
Tras ejecutar $a_t$ en $s_t$, recibir $r_t$ y llegar a $s_{t+1}$:

$$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha\big(r_t + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t)\big)$$

La tabla se actualiza en cada paso con una diferencia sencilla.

### ¿Cómo se escribe la actualización de Q-learning como media ponderada?
$Q(s,a) \leftarrow (1-\alpha)\,Q(s,a) + \alpha\,(R + \gamma \max_{a'} Q(s',a'))$. Es la misma regla, vista como mezcla del valor antiguo y el objetivo nuevo.

### ¿Qué papel tiene la tasa de aprendizaje $\alpha$ en la actualización?
Mide cuánto se acerca $Q(s,a)$ al objetivo $r + \gamma \max_{a'} Q(s',a')$. Con $\alpha = 0$ no se aprende nada y con $\alpha = 1$ el valor antiguo se sustituye por el objetivo. Un valor intermedio, como 0,2, avanza una fracción de la diferencia.

### En Q-learning, ¿cómo se calcula el objetivo del siguiente estado?
Con el máximo de $Q(s_{t+1}, a')$ sobre todas las acciones $a'$, independientemente de qué acción vaya a elegir el agente a continuación. Si $s_{t+1}$ es final, su valor es 0 y el objetivo es solo la recompensa.

### ¿Qué hace falta para que Q-learning converja?
Visitar cada estado, o cada par estado-acción, un número grande de veces. Si una zona de la tabla no se visita, sus valores no se aprenden.

### ¿Por qué Q-learning no necesita conocer $p(s' \mid s, a)$?
Porque usa la transición $s_{t+1}$ que observa realmente al actuar. Con muchas visitas, el promedio de esos objetivos reproduce la esperanza sobre transiciones que la ecuación de Bellman escribe con $p$.

## 7. Ejemplo de Q-learning

### En una cuadrícula con tabla Q inicial a cero, ¿por qué una actualización con recompensa 0 deja el valor en 0?
Porque el objetivo es $0 + \gamma \max_{a'} Q(s',a') = 0$ si el estado siguiente aún tiene Q igual a cero, y la diferencia con el valor actual es 0. Hace falta que antes se haya aprendido algo en el estado siguiente.

### ¿Cómo se propaga hacia atrás una recompensa final grande en Q-learning?
Primero se actualiza el par que cobra la recompensa. En episodios posteriores, el par anterior toma como objetivo el máximo de ese estado y también sube. Cada episodio propaga la información un paso más hacia el inicio.

### En una cuadrícula de 2 filas y 3 columnas, con seis estados $s_0$ a $s_5$ (posición del agente, de arriba abajo y de izquierda a derecha), $s_5$ final con +10 al llegar, $\alpha = 0{,}2$ y $\gamma = 1$, ¿por qué $Q(s_4, \text{right})$ pasa de 2 a 3,6 al repetirse la transición?
La recompensa es 10 y el estado siguiente es final (Q igual a 0). Por tanto $Q = 2 + 0{,}2\,(10 + 0 - 2) = 3{,}6$. En cada visita el valor avanza el 20 % de la distancia que le falta hasta 10.

### En esa cuadrícula de 2x3, ¿por qué $Q(s_1, \text{down})$ vale 0,4 tras visitarlo en el episodio 3?
Porque en el episodio 2 se aprendió $Q(s_4, \text{right}) = 2$, que es el máximo de $s_4$. Entonces $Q(s_1, \text{down}) = 0 + 0{,}2\,(0 + 1 \cdot 2 - 0) = 0{,}4$.

### Problema: dos actualizaciones de Q-learning y la política codiciosa
Hay tres estados en línea, $s_0$, $s_1$ y $s_2$, con $s_2$ final (sus valores $Q$ son 0), y dos acciones, $L$ y $R$. Se usa $\alpha = 0{,}5$ y $\gamma = 0{,}9$. La tabla inicial es $Q(s_0, L) = 0$, $Q(s_0, R) = 1$, $Q(s_1, L) = 2$ y $Q(s_1, R) = 0$. El agente vive esta experiencia, en este orden: en $s_0$ ejecuta $R$, recibe 0 y llega a $s_1$. Después, en $s_1$ ejecuta $R$, recibe 10 y llega a $s_2$. Aplica las dos actualizaciones y escribe la política codiciosa. Comprueba también qué ocurre si las dos transiciones se procesan en orden inverso.

#### Paso 1
Primera transición, con $\max_{a'} Q(s_1, a') = \max(2, 0) = 2$:

$$Q(s_0, R) = 1 + 0{,}5\,(0 + 0{,}9 \cdot 2 - 1) = 1 + 0{,}5 \cdot 0{,}8 = 1{,}4.$$

#### Paso 2
Segunda transición, con $s_2$ final y $\max_{a'} Q(s_2, a') = 0$:

$$Q(s_1, R) = 0 + 0{,}5\,(10 + 0 - 0) = 5.$$

#### Paso 3
La tabla queda $Q(s_0, L) = 0$, $Q(s_0, R) = 1{,}4$, $Q(s_1, L) = 2$ y $Q(s_1, R) = 5$. La política codiciosa elige $R$ en $s_0$ (1,4 contra 0) y $R$ en $s_1$ (5 contra 2).

#### Paso 4
En orden inverso se actualiza primero $Q(s_1, R) = 5$. Después, con $\max_{a'} Q(s_1, a') = 5$:

$$Q(s_0, R) = 1 + 0{,}5\,(0 + 0{,}9 \cdot 5 - 1) = 1 + 0{,}5 \cdot 3{,}5 = 2{,}75.$$

La política codiciosa no cambia, pero $Q(s_0, R)$ es mayor (2,75 en lugar de 1,4). Procesar primero la transición que cobra la recompensa propaga antes la información hacia atrás.

### Problema: el objetivo de Q-learning usa el máximo, no la acción siguiente
En un estado $A$, la tabla Q tiene $Q(A, a_1) = 1$ y $Q(A, a_2) = 1{,}2$. En un estado $B$ tiene $Q(B, x) = 3$ y $Q(B, y) = -2$. Con $\alpha = 0{,}2$ y $\gamma = 0{,}9$, el agente ejecuta $a_1$ en $A$, recibe $-1$ y llega a $B$. Allí explora y elige la acción $y$. Actualiza $Q(A, a_1)$ y di cuál es la política codiciosa en $A$ después de la actualización.

#### Paso 1
El objetivo usa el máximo en $B$, que es $Q(B, x) = 3$, aunque el agente vaya a ejecutar $y$:

$$r + \gamma \max_{a'} Q(B, a') = -1 + 0{,}9 \cdot 3 = 1{,}7.$$

#### Paso 2
$$Q(A, a_1) = 1 + 0{,}2\,(1{,}7 - 1) = 1 + 0{,}14 = 1{,}14.$$

La acción elegida después en $B$ no interviene. Usar $Q(B, y) = -2$ sería un error.

#### Paso 3
Tras la actualización, $Q(A, a_1) = 1{,}14$ y $Q(A, a_2) = 1{,}2$. La política codiciosa en $A$ es $a_2$, aunque $a_1$ ha subido.

## 8. Exploración y explotación

### ¿Qué diferencia hay entre política objetivo y política de comportamiento?
La política objetivo es la que el agente aprende con las recompensas recibidas, y con ella se actualizan los valores (en Q-learning). La política de comportamiento es la que usa mientras aprende para elegir acciones, por ejemplo aleatoria, codiciosa o $\epsilon$-greedy.

### ¿En qué consiste el dilema entre exploración y explotación?
Explorar es probar caminos nuevos y de momento peores para descubrir mejores soluciones. Explotar es seguir los mejores caminos conocidos para refinar la solución actual. No existe una regla general para decidir cuándo hacer cada cosa.

### ¿Para qué sirve explorar, aparte de conocer el entorno?
Para escapar de máximos locales: sin exploración el agente puede quedarse con una solución buena y no descubrir una mejor.

### ¿Cómo evoluciona normalmente el equilibrio entre explorar y explotar durante el aprendizaje?
Al principio el agente no sabe nada del entorno y conviene que explore. A medida que acumula información, la probabilidad de explotar aumenta.

### ¿Cómo funciona una política $\epsilon$-greedy?
Con probabilidad $\epsilon \in [0, 1]$ elige una acción al azar entre todas, que puede coincidir con la mejor (exploración). Con probabilidad $1-\epsilon$ elige la mejor acción actual (explotación).

### ¿Cómo se comporta una política $\epsilon$-greedy según el valor de $\epsilon$?
Con $\epsilon$ cercano a 1 se parece a una política aleatoria. Con $\epsilon$ cercano a 0 se parece a una codiciosa.

### ¿Qué ventaja da $\epsilon$-greedy en Q-learning durante el entrenamiento y la inferencia?
En el entrenamiento mejora la exploración del espacio de estados. En la inferencia se explota por completo la política aprendida.

### ¿Qué variantes de $\epsilon$-greedy y otras estrategias se mencionan?
$\epsilon$-greedy con decaimiento (lineal, exponencial o por intervalos discretos) e inicialización optimista, entre otras. El decaimiento reduce $\epsilon$ con los episodios.

### Problema: probabilidades de una política $\epsilon$-greedy
En un estado hay cuatro acciones con $Q(\text{up}) = 1{,}2$, $Q(\text{down}) = 0{,}4$, $Q(\text{left}) = -0{,}5$ y $Q(\text{right}) = 0{,}9$. El agente usa $\epsilon$-greedy con $\epsilon = 0{,}2$, y la acción aleatoria se elige entre las cuatro con igual probabilidad. Calcula la probabilidad de elegir cada acción y la política codiciosa.

#### Paso 1
La acción de mayor valor es $\text{up}$ (1,2), así que la política codiciosa es $\text{up}$.

#### Paso 2
La acción aleatoria también puede ser $\text{up}$, de modo que:

$$P(\text{up}) = (1 - 0{,}2) + 0{,}2 \cdot \tfrac{1}{4} = 0{,}8 + 0{,}05 = 0{,}85.$$

#### Paso 3
Cada una de las otras tres acciones solo se elige por exploración: $P = 0{,}2 \cdot \tfrac{1}{4} = 0{,}05$. La suma es $0{,}85 + 3 \cdot 0{,}05 = 1$.

## 9. Práctica 2: aprendizaje con PDDLGym

### ¿Qué pasos hay que seguir para crear un entorno PDDLGym para una tarea de planificación?
Copiar el dominio (en minúscula) en `pddlgym/pddl`, crear una carpeta con el mismo nombre del dominio sin la extensión, copiar dentro el problema de planificación y modificar `__init__.py` para registrar el nuevo entorno. Después se genera el entorno con `pddlgym.make("PDDLEnv<Nombre-dominio>-v0")`.

### ¿Cómo se define el número de columnas de la tabla Q en la práctica?
Como el número total de acciones que se pueden instanciar en el problema. Se obtienen con `env.action_space.all_ground_literals(state)` o con `env.action_space._all_ground_literals`.

### ¿Qué parámetros se exploran en la práctica 2?
El número de episodios, el número de pasos, el $\epsilon$-greedy (con decaimiento) y el reward shaping para superar las recompensas dispersas.

### ¿Para qué sirve el reward shaping en la práctica?
Para superar el problema de las recompensas dispersas (sparse rewards): si el agente solo cobra al llegar al objetivo, apenas recibe señal de aprendizaje, y el reward shaping le da señal intermedia.
