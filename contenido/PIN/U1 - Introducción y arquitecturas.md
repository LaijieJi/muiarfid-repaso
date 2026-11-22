# PIN U1 - Introducción y arquitecturas

## 1. Introducción: qué es un plan

### ¿Cómo define Austin Tate un plan?
Como una representación del comportamiento futuro, normalmente un conjunto de acciones con restricciones temporales y de otro tipo, para que las ejecuten uno o varios agentes. Subraya que un plan es una representación, no la ejecución en sí.

### ¿Por qué un plan no tiene por qué ser una lista de acciones ordenada del primero al último?
Porque según la definición de Tate es un conjunto de acciones con restricciones, entre ellas temporales. Esas restricciones pueden fijar un orden total, pero también pueden dejar acciones sin ordenar entre sí.

## 3. Planificación frente a scheduling

### ¿Cuál es la diferencia esencial entre planificación y scheduling?
En scheduling las acciones ya están elegidas y falta ubicarlas en el tiempo y en los recursos. En planificación hay que decidir cuáles son esas acciones.

### ¿Cuál es la complejidad de la planificación en el peor caso?
Puede ser mucho peor que NP-completo, y en el peor caso es indecidible. Por eso la planificación es en general más difícil que el scheduling.

### Una fábrica ya sabe qué diez operaciones hay que hacer y solo debe repartirlas entre dos máquinas a lo largo del día. ¿Es planificación o scheduling?
Scheduling, porque las acciones están dadas y solo se decide cuándo y con qué recurso se ejecuta cada una. Sería planificación si además tuviera que decidir qué operaciones hacen falta para fabricar la pieza.

## 5. Modelo conceptual: entorno y sistema de transiciones

### ¿Qué es un sistema de transiciones de estados $\Sigma$ y qué componentes tiene?
Es el modelo del entorno: $\Sigma = (S, A, E, \gamma)$, con $S$ los estados, $A$ las acciones, $E$ los eventos exógenos y $\gamma$ la función de transición.

### ¿Cuál es la firma de la función de transición $\gamma$?
$$\gamma : S \times (A \cup E) \to S$$

Toma un estado y una acción o un evento exógeno, y devuelve el estado resultante.

## 6. Modelo conceptual: controlador, planificador y problema

### ¿Qué función cumple el controlador en el modelo conceptual?
Recibe una observación $o \in O$ y produce una acción $a \in A$ que se aplica al sistema $\Sigma$. Ejecuta lo que el planificador le indica.

## 7. Planes

### ¿Qué es un plan clásico?
Una secuencia de acciones. En el ejemplo, para ir de $s_0$ a $s_5$ en el dominio Dock Worker Robots: $\langle \text{take}, \text{move1}, \text{load}, \text{move2} \rangle$.

### ¿Qué es una política?
Una función parcial de $S$ en $A$ que dice qué acción ejecutar en cada estado. En el ejemplo: $\{(s_0, \text{take}), (s_1, \text{move1}), (s_3, \text{load}), (s_4, \text{move2})\}$.

### ¿En qué se diferencian un plan clásico y una política?
El plan es una secuencia fijada de antemano, mientras que la política decide la acción según el estado en que se esté. Si la ejecución se desvía, un plan se queda sin guía, y una política sigue indicando qué hacer en cada estado que cubra.

### Problema: otro plan y su política en el dominio Dock Worker Robots
Con el grafo de estados de la unidad (dominio Dock Worker Robots, estado inicial $s_0$, objetivo $s_5$), usa estas transiciones de la figura:

| Estado | Acción | Siguiente estado |
|---|---|---|
| $s_0$ | take | $s_1$ |
| $s_0$ | move1 | $s_2$ |
| $s_1$ | move1 | $s_3$ |
| $s_2$ | take | $s_3$ |
| $s_3$ | load | $s_4$ |
| $s_4$ | move2 | $s_5$ |

Encuentra un plan de $s_0$ a $s_5$ que no sea $\langle \text{take}, \text{move1}, \text{load}, \text{move2} \rangle$ y escribe su política. Después indica si se puede construir una sola política que contenga a la vez los dos planes.

#### Paso 1
Busca los caminos desde $s_0$ que no repiten estados, con las transiciones de la tabla. Hay dos: $s_0 \to s_1 \to s_3$ y $s_0 \to s_2 \to s_3$. Ambos llegan a $s_3$, y de $s_3$ solo se llega al objetivo por $s_3 \to s_4 \to s_5$.

#### Paso 2
El plan nuevo es el segundo camino: $\langle \text{move1}, \text{take}, \text{load}, \text{move2} \rangle$. Pasa por $s_0, s_2, s_3, s_4, s_5$ y tiene cuatro acciones, igual que el plan original.

#### Paso 3
Su política es $\{(s_0, \text{move1}), (s_2, \text{take}), (s_3, \text{load}), (s_4, \text{move2})\}$. Se obtiene emparejando cada estado visitado, salvo el final, con la acción que se ejecuta en él.

#### Paso 4
Una política que contuviera ambos planes tendría que asignar a $s_0$ las acciones take y move1 a la vez. Eso no es una función, de modo que no existe. Hay que elegir una de las dos políticas.

### Problema: comprobar si una secuencia de acciones es un plan
Con las mismas transiciones del problema anterior, decide si $\langle \text{move1}, \text{take}, \text{unload}, \text{move2} \rangle$ es un plan válido de $s_0$ a $s_5$ y, si no lo es, di en qué acción falla.

#### Paso 1
Aplica las acciones una a una desde $s_0$. Con move1 se pasa a $s_2$.

#### Paso 2
Con take desde $s_2$ se pasa a $s_3$.

#### Paso 3
Desde $s_3$ se pide unload. La tabla solo da load como acción que sale de $s_3$ hacia $s_4$, y unload es la acción contraria, que va de $s_4$ a $s_3$. La transición $\gamma(s_3, \text{unload})$ no existe en la figura, así que la secuencia falla en la tercera acción.

#### Paso 4
No es un plan válido. Para que lo fuera haría falta cambiar unload por load, que daría el plan del problema anterior.

## 8. Arquitectura integrada de planificación

### ¿Por qué el planificador solo no basta en una arquitectura real?
Porque el plan se ejecuta en un entorno que se percibe de forma parcial y que puede cambiar. Hay que percibirlo, ejecutar el plan, vigilar que se cumple y replanificar si se desvía. La arquitectura integrada junta todas esas fases.
