# SMA U2 - Coordinación y cooperación

## 2. El problema de la asignación de tareas (Task Allocation)

### ¿Qué pide el problema de asignación de tareas (task allocation)?
Repartir tareas entre un conjunto de agentes para lograr el máximo número de tareas realizadas con éxito. Tanto los agentes como las tareas pueden entrar y salir del sistema con el tiempo.

### ¿Qué diferencia hay entre asignar tareas de forma centralizada y de forma distribuida?
| Enfoque | Cómo se asigna | Ventaja | Inconveniente |
|---|---|---|---|
| Centralizado | Un planificador central reparte las tareas | Más fácil | Menos robusto |
| Distribuido | Las tareas llegan a cualquier agente y estos se comunican para completar la asignación | Más robusto | Más difícil |

### ¿Cómo se define la utilidad $U_{a,t}$ de que el agente $a$ ejecute la tarea $t$?
$$U_{a,t} = \begin{cases} Q_{a,t} - C_{a,t} & \text{si } a \text{ puede ejecutar } t \text{ y } Q_{a,t} > C_{a,t} \\ 0 & \text{en otro caso} \end{cases}$$

Por eso la utilidad nunca es negativa.

### Problema: calcula utilidades y compara la asignación óptima con la voraz
Tres agentes y tres tareas, con un agente por tarea y una tarea por agente. Los beneficios $Q$ y los costes $C$ esperados (filas $a_1, a_2, a_3$, columnas $t_1, t_2, t_3$) son:

| | $Q$ $t_1$ | $Q$ $t_2$ | $Q$ $t_3$ | $C$ $t_1$ | $C$ $t_2$ | $C$ $t_3$ |
|---|---|---|---|---|---|---|
| $a_1$ | 10 | 9 | 5 | 2 | 2 | 5 |
| $a_2$ | 9 | 4 | 5 | 2 | 3 | 2 |
| $a_3$ | 5 | 6 | 8 | 3 | 2 | 2 |

Calcula la matriz de utilidades. Halla la asignación óptima probando todas las permutaciones. Aplica después el algoritmo iterado que elige en cada paso el par agente-tarea de mayor utilidad, y compara los dos totales.
#### Paso 1
Se aplica $U = Q - C$ si $Q > C$ y 0 en otro caso. La fila de $a_1$ da $10-2=8$, $9-2=7$ y $5-5=0$, este último porque $Q$ no supera a $C$. La fila de $a_2$ da $7$, $1$ y $3$. La fila de $a_3$ da $2$, $4$ y $6$.

| | $t_1$ | $t_2$ | $t_3$ |
|---|---|---|---|
| $a_1$ | 8 | 7 | 0 |
| $a_2$ | 7 | 1 | 3 |
| $a_3$ | 2 | 4 | 6 |

#### Paso 2
Hay $3! = 6$ asignaciones y sus totales son:

| Asignación ($a_1, a_2, a_3$) | Cuenta | Total |
|---|---|---|
| $t_1, t_2, t_3$ | $8+1+6$ | 15 |
| $t_1, t_3, t_2$ | $8+3+4$ | 15 |
| $t_2, t_1, t_3$ | $7+7+6$ | 20 |
| $t_2, t_3, t_1$ | $7+3+2$ | 12 |
| $t_3, t_1, t_2$ | $0+7+4$ | 11 |
| $t_3, t_2, t_1$ | $0+1+2$ | 3 |

La óptima es $a_1 \to t_2$, $a_2 \to t_1$, $a_3 \to t_3$, con utilidad 20.
#### Paso 3
La versión iterada busca primero el mayor valor de toda la matriz, que es 8 en $(a_1, t_1)$. Asigna ese par y quita $a_1$ y $t_1$. Entre lo que queda, el mayor es 6 en $(a_3, t_3)$, y se asigna. Solo queda $(a_2, t_2)$, con 1.
#### Paso 4
El total de la versión iterada es $8+6+1 = 15$, frente a 20 de la óptima. Elegir en cada paso lo mejor ocupa pronto a $a_1$ con $t_1$ y deja a $a_2$ sin su mejor tarea. Por tanto, la versión iterada es rápida pero no garantiza el óptimo.

## 3. Taxonomía de problemas de asignación de tareas

### ¿Qué tres características definen la taxonomía de problemas de asignación de tareas?
Si el agente es de una sola tarea (ST) o de múltiples tareas (MT). Si la tarea requiere un solo agente (SA) o múltiples agentes (MA). Y si la asignación es instantánea (IA) o extendida en el tiempo (TA).

### ¿Qué es la asignación iterada y qué algoritmo usa?
Es la variante de ST-SA-IA donde cada tarea llega en un momento distinto. Mientras queden agentes sin asignar, elige el par agente-tarea de mayor utilidad, los asigna y los retira, y repite. En versión distribuida se usa el Contract Net Protocol.

### ¿Cómo se llama en la comunidad multiagente el problema con agentes de una sola tarea, tareas de varios agentes y asignación instantánea (ST-MA-IA)?
Formación de coaliciones. Las tareas exigen el esfuerzo combinado de varios agentes y las utilidades de un grupo no son, en general, la suma de las utilidades individuales.

## 5. Formación de coaliciones: definición formal

### ¿Qué es la formación de coaliciones?
El problema de formar grupos de agentes para conseguir de forma eficiente los objetivos individuales y colectivos. Se estudia en microeconomía, teoría de juegos e informática, en particular en SMA.

### En un conjunto $A$ de $n$ agentes, ¿qué es una coalición?
Cualquier subconjunto no vacío de $A$. Con $n$ agentes hay $2^n - 1$ coaliciones posibles.

### ¿Qué es una estructura de coaliciones?
Una colección de coaliciones disjuntas. Una estructura sobre una coalición $C$ es un conjunto $CS = \{C_1, \dots, C_k\}$ tal que su unión es $C$ y $C_i \cap C_j = \emptyset$ para $i \neq j$.

### ¿Por qué la estructura de coalición óptima no es siempre la coalición con todos los agentes y qué dificultad tiene hallarla?
Porque el valor no es siempre superaditivo y unir dos coaliciones puede valer menos que mantenerlas separadas. Entonces la estructura óptima puede ser una partición. Encontrarla es un problema NP-completo, que se aborda con programación dinámica, algoritmos anytime, metaheurísticas o teoría de juegos.

## 7. Formación de coaliciones como asignación de tareas

### ¿Cuándo puede una coalición realizar una tarea?
Cuando su vector de capacidades, que es la suma de los de sus miembros, cubre en cada componente lo que la tarea requiere: $b_k^j \le b_k^C$ para todo $k$ de 1 a $r$.
