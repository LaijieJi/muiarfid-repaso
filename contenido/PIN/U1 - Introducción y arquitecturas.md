# PIN U1 - Introducción y arquitecturas

## 1. Introducción: qué es un plan

### ¿Qué es un plan en el sentido que usa la inteligencia artificial?
Un esquema o método pensado de antemano para lograr un objetivo, es decir, un curso de acción propuesto. De todas las acepciones del diccionario, solo esta y la de "proyecto o curso de acción tentativo" son las que se usan en IA. Las de "disposición ordenada de elementos" o "dibujo a escala" no lo son.

### ¿Cómo define Austin Tate un plan?
Como una representación del comportamiento futuro, normalmente un conjunto de acciones con restricciones temporales y de otro tipo, para que las ejecuten uno o varios agentes. Subraya que un plan es una representación, no la ejecución en sí.

### ¿Por qué un plan no tiene por qué ser una lista de acciones ordenada del primero al último?
Porque según la definición de Tate es un conjunto de acciones con restricciones, entre ellas temporales. Esas restricciones pueden fijar un orden total, pero también pueden dejar acciones sin ordenar entre sí.

### En la definición de plan de Tate, ¿puede haber más de un agente ejecutor?
Sí. La definición habla de "algún agente o agentes", de modo que la planificación no se limita a un único ejecutor.

## 2. Generar planes de acción automáticamente

### ¿Qué tipo de ayuda a la planificación existe sin generar planes automáticamente?
Programas que asisten a un planificador humano: gestión de proyectos, almacenamiento y recuperación de planes (por ejemplo, la planificación de procesos por variantes en fabricación) y generación automática de horarios con técnicas de investigación operativa y de IA.

### ¿Por qué se quiere generar planes (o trozos de plan) de forma automática?
Porque para algunos problemas interesa que sea el programa quien decida las acciones, no solo que ayude a un humano a organizarlas. Es mucho más difícil que lo anterior, pero la investigación en planificación automática ha empezado a dar resultados.

### ¿Qué es un plan de proceso de fabricación?
Una lista detallada de operaciones sobre máquinas concretas (orientar la pieza, taladrar, fresar, soldar, inspeccionar...) con sus tiempos de preparación y de ejecución. Sirve en el tema como ejemplo de plan real, con acciones, orden y tiempos.

## 3. Planificación frente a scheduling

### ¿Qué decide el scheduling?
Cuándo y cómo ejecutar un conjunto dado de acciones, teniendo en cuenta restricciones de tiempo y de recursos y funciones objetivo.

### ¿Qué decide la planificación?
Qué acciones usar para lograr un conjunto de objetivos. Elegir las acciones es parte del problema.

### ¿Cuál es la diferencia esencial entre planificación y scheduling?
En scheduling las acciones ya están elegidas y falta ubicarlas en el tiempo y en los recursos. En planificación hay que decidir cuáles son esas acciones.

### ¿Cuál es la complejidad típica del scheduling?
Suele ser NP-completo.

### ¿Cuál es la complejidad de la planificación en el peor caso?
Puede ser mucho peor que NP-completo, y en el peor caso es indecidible. Por eso la planificación es en general más difícil que el scheduling.

### Una fábrica ya sabe qué diez operaciones hay que hacer y solo debe repartirlas entre dos máquinas a lo largo del día. ¿Es planificación o scheduling?
Scheduling, porque las acciones están dadas y solo se decide cuándo y con qué recurso se ejecuta cada una. Sería planificación si además tuviera que decidir qué operaciones hacen falta para fabricar la pieza.

## 4. Aplicaciones

### ¿Qué experimentos de la NASA se citan como ejemplo de planificación, scheduling y control autónomos?
El Remote Agent Experiment (RAX) en la nave Deep Space 1 y los vehículos de exploración de Marte (Mars Exploration Rover, MER), con trabajo del JPL y del centro Ames.

### ¿Qué hace el software de planificación en las máquinas plegadoras de chapa de Amada?
Planifica la secuencia de plegados que hay que dar a la chapa. Es un ejemplo de planificación en fabricación.

## 5. Modelo conceptual: entorno y sistema de transiciones

### ¿Qué es un sistema de transiciones de estados $\Sigma$ y qué componentes tiene?
Es el modelo del entorno: $\Sigma = (S, A, E, \gamma)$, con $S$ los estados, $A$ las acciones, $E$ los eventos exógenos y $\gamma$ la función de transición.

### ¿Qué es un evento exógeno?
Un evento que cambia el estado del sistema sin que lo haya ordenado el agente. Pertenece al conjunto $E$ y, junto con las acciones, provoca transiciones.

### ¿Cuál es la firma de la función de transición $\gamma$?
$$\gamma : S \times (A \cup E) \to S$$

Toma un estado y una acción o un evento exógeno, y devuelve el estado resultante.

### ¿Qué significa que $E = \{\}$ en el ejemplo de los Dock Worker Robots?
Que en ese dominio no hay eventos exógenos: el estado solo cambia cuando el controlador ordena una acción.

### En el dominio Dock Worker Robots, ¿cuáles son los conjuntos $S$ y $A$?
$S = \{s_0, \dots, s_5\}$ y $A = \{\text{move1}, \text{move2}, \text{put}, \text{take}, \text{load}, \text{unload}\}$. Las flechas del grafo de estados son la función $\gamma$.

### ¿Qué situaciones representan los estados del dominio Dock Worker Robots?
Una grúa, un robot con ruedas y un contenedor repartidos entre dos localizaciones. Cada estado dice dónde está el contenedor (en la pila, en la grúa o cargado en el robot), dónde está el robot y si la grúa sostiene algo.

### ¿Qué transiciones tiene el grafo de estados del Dock Worker Robots entre $s_0$ y $s_5$?
| Estado | Transiciones |
|---|---|
| $s_0$ | take a $s_1$, move1 a $s_2$ |
| $s_1$ | put a $s_0$, move1 a $s_3$ |
| $s_2$ | take a $s_3$, move2 a $s_0$ |
| $s_3$ | put a $s_2$, move2 a $s_1$, load a $s_4$ |
| $s_4$ | unload a $s_3$, move2 a $s_5$ |
| $s_5$ | move1 a $s_4$ |

Los estados son el contenedor en la pila ($s_0$, $s_2$), en la grúa ($s_1$, $s_3$) o en el robot ($s_4$, $s_5$), y el robot en la localización 2 ($s_0$, $s_1$, $s_5$) o en la 1 ($s_2$, $s_3$, $s_4$).

### ¿Qué hacen las acciones put y take, y qué hacen load y unload en el dominio Dock Worker Robots?
Take y put llevan el contenedor entre la pila y la grúa, mientras que load y unload lo llevan entre la grúa y el robot. Move1 y move2 desplazan el robot a la localización 1 y a la 2.

## 6. Modelo conceptual: controlador, planificador y problema

### ¿Qué función cumple el controlador en el modelo conceptual?
Recibe una observación $o \in O$ y produce una acción $a \in A$ que se aplica al sistema $\Sigma$. Ejecuta lo que el planificador le indica.

### ¿Qué es la función de observación $h$?
Una función $h : S \to O$ que a cada estado le asocia lo que el controlador observa de él. El controlador no ve el estado directamente, sino a través de $h$.

### ¿Qué recibe el planificador como entrada?
La descripción del sistema $\Sigma$ y el problema de planificación, que a su vez incluye el estado inicial (o un conjunto de estados iniciales) y el objetivo. Si la planificación es online, también recibe el estado de ejecución desde el controlador.

### ¿Cuándo se usa el estado de ejecución como entrada del planificador?
Solo cuando la planificación es online, es decir, cuando el planificador sigue la ejecución. En otro caso se omite.

### ¿Qué formas puede tomar el objetivo de un problema de planificación?
Un estado objetivo, un conjunto de estados objetivo, un conjunto de tareas, una "trayectoria" de estados o una función objetivo. El objetivo de alcanzar un estado es solo el caso más sencillo.

### ¿Qué dos elementos describen un problema de planificación en el ejemplo de los Dock Worker Robots?
El estado inicial, que es $s_0$, y el objetivo, que es el estado $s_5$ (el robot lleva el contenedor a la localización 2).

### ¿Qué produce el planificador y para quién?
Instrucciones para el controlador, que son un plan o una política. El planificador no ejecuta nada, es el controlador quien las lleva a cabo sobre el sistema $\Sigma$.

## 7. Planes

### ¿Qué es un plan clásico?
Una secuencia de acciones. En el ejemplo, para ir de $s_0$ a $s_5$ en el dominio Dock Worker Robots: $\langle \text{take}, \text{move1}, \text{load}, \text{move2} \rangle$.

### ¿Qué es una política?
Una función parcial de $S$ en $A$ que dice qué acción ejecutar en cada estado. En el ejemplo: $\{(s_0, \text{take}), (s_1, \text{move1}), (s_3, \text{load}), (s_4, \text{move2})\}$.

### ¿Por qué una política se llama función parcial?
Porque no tiene que dar una acción para todos los estados de $S$, solo para los que el controlador va a encontrar al ejecutarla. En el ejemplo, $s_2$ y $s_5$ no tienen acción asignada.

### ¿En qué se diferencian un plan clásico y una política?
El plan es una secuencia fijada de antemano, mientras que la política decide la acción según el estado en que se esté. Si la ejecución se desvía, un plan se queda sin guía, y una política sigue indicando qué hacer en cada estado que cubra.

### ¿Por qué la política $\{(s_0, \text{take}), (s_1, \text{move1}), (s_3, \text{load}), (s_4, \text{move2})\}$ no incluye $s_5$?
Porque $s_5$ es el estado objetivo y ya no hace falta ninguna acción. Tampoco tiene acción $s_2$, que esta política nunca visita.

### Si una política asignara dos acciones distintas al mismo estado, ¿seguiría siendo una política?
No. Una política es una función, así que a cada estado le corresponde como máximo una acción. Dos planes alternativos que pasan por el mismo estado con acciones distintas no caben en una sola política.

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

### ¿Qué reúne la arquitectura integrada de planificación?
Todo el espectro de tecnologías relacionadas con planificar: percepción (sensing), planificación, ejecución, monitorización, replanificación e incluso aprendizaje a partir de experiencias pasadas.

### ¿Por qué el planificador solo no basta en una arquitectura real?
Porque el plan se ejecuta en un entorno que se percibe de forma parcial y que puede cambiar. Hay que percibirlo, ejecutar el plan, vigilar que se cumple y replanificar si se desvía. La arquitectura integrada junta todas esas fases.

### ¿Qué distingue una acción de alto nivel de una de bajo nivel en el ejemplo del robot?
La de alto nivel es simbólica y la usa el planificador, como "MOVE ROBOT1 A B". La de bajo nivel es la que ejecuta el robot físico, como girar el robot 90 grados a la derecha. Entre una y otra hay que traducir.
