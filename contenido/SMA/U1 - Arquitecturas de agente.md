# SMA U1 - Arquitecturas de agente

## 1. Qué es un agente

### ¿Cómo define Wooldridge un agente?
Un sistema informático capaz de actuar de forma autónoma en un entorno para alcanzar los objetivos que se le han delegado. Su ciclo es percibir, decidir y actuar.

### ¿Qué significa que un agente sea flexible según Wooldridge?
Que es reactivo, proactivo y social: interactúa con su entorno de forma flexible y robusta para cumplir sus objetivos.

### ¿Qué diferencia a un agente inteligente de un agente software cualquiera?
Que funciona de forma fiable en un entorno que cambia deprisa y de forma impredecible.

### ¿Por qué un termostato es un agente sin interés?
Porque sus decisiones son triviales. Lo mismo pasa con el programa `biff` de UNIX, que avisa de que ha llegado correo.

### ¿Qué es la reactividad de un agente?
Responder a tiempo a los cambios del entorno.

### ¿Qué es la proactividad de un agente?
Generar y perseguir objetivos propios y reconocer oportunidades, sin limitarse a reaccionar a eventos.

### ¿Qué cuatro propiedades forman el concepto débil de agente?
Autonomía, proactividad, reactividad y sociabilidad. Un agente siempre las tiene.

### ¿Qué propiedades añade el concepto fuerte de agente?
Movilidad, veracidad, benevolencia, racionalidad, y aprendizaje y adaptación. Un agente puede tenerlas o no.

### ¿Qué significan la veracidad y la benevolencia de un agente?
Veracidad: no comunica información falsa a sabiendas. Benevolencia: no tiene objetivos contradictorios e intenta hacer lo que se le pide.

### ¿Qué significa la racionalidad de un agente en el concepto fuerte?
Que tiene objetivos concretos e intenta siempre alcanzarlos.

### ¿Cómo describe Van Parunak a un agente?
Como un objeto activo con piezas opcionales, igual que una navaja suiza: puede viajar, aprender, representar a una persona, planificar, negociar o comunicarse en un lenguaje de agentes, entre otras.

### ¿Qué es un sistema intencional según Dennett?
Un sistema cuyo comportamiento se explica atribuyéndole creencias y deseos.

### ¿Qué diferencia hay entre un sistema intencional de primer y de segundo orden?
El de primer orden tiene creencias y deseos, pero no sobre creencias y deseos. El de segundo orden los tiene sobre los suyos y sobre los de otros, como «Juan cree que Lola cree que llueve».

### Según McCarthy, ¿cuándo es más útil atribuir cualidades mentales a una máquina?
Cuando no se conoce del todo su estructura. En una máquina sencilla y conocida, como un termostato, es posible pero aporta poco.

### ¿Qué diferencia hay entre la resolución distribuida de problemas y los SMA?
En la resolución distribuida, los nodos tienen tareas y conducta fijas y el diseño se centra en el comportamiento global. En un SMA, los agentes son autónomos, tienen información incompleta y deciden dinámicamente qué hacer y quién lo hace, sin control global.

## 2. Entornos

### ¿Cuándo es observable un entorno?
Cuando el agente obtiene información completa, exacta y actualizada de su estado.

### ¿Cuándo es determinista un entorno?
Cuando cada acción tiene un único efecto garantizado.

### ¿Cuándo es episódico un entorno?
Cuando la elección de la acción depende solo del episodio actual, sin tener en cuenta los anteriores.

### ¿Cuándo es estático un entorno?
Cuando solo cambia por las acciones del propio agente.

### ¿Cuándo es discreto un entorno?
Cuando hay un número fijo y finito de acciones y percepciones.

### ¿Cómo es el mundo real según las seis propiedades de los entornos?
Parcialmente observable, estocástico, secuencial, dinámico, continuo y multiagente. Es el caso más difícil en las seis.

### ¿Cómo clasifica el tema el entorno de la compra por Internet?
No observable, parcialmente determinista, secuencial, semiestático, discreto y multiagente, salvo en las subastas.

### ¿Cómo clasifica el tema el entorno del backgammon?
Observable, no determinista, secuencial, semiestático, discreto y multiagente.

### Problema: clasifica el entorno de un crucigrama
Un agente resuelve un crucigrama en papel. Clasifícalo según las seis propiedades.
#### Paso 1
Observable: ve todo el tablero y las definiciones. Determinista: escribir una palabra tiene un único efecto.
#### Paso 2
Secuencial y no episódico: cada palabra condiciona las casillas de las que se cruzan con ella.
#### Paso 3
Estático: nada cambia salvo lo que escribe el agente. Discreto: hay casillas y letras finitas. Agente individual: no hay nadie más.

## 3. Arquitecturas reactivas

### ¿Qué diferencia hay entre un agente reactivo puro y uno reactivo con estado?
El puro va directamente de la percepción a la acción, sin historia. El que tiene estado guarda la secuencia de percepciones como estado interno y decide con ella, aunque tampoco planifica.

### ¿Qué tipo de reglas usa un agente reactivo?
Reglas situación-acción: en un bucle, interpreta la percepción, busca la regla que corresponde y ejecuta su acción.

### ¿Qué es una conducta en la formalización de la arquitectura reactiva?
Un par $(c, a)$, donde $c$ es un conjunto de percepciones y $a$ una acción. La conducta se dispara cuando la percepción actual pertenece a $c$.

### ¿Qué acción elige el algoritmo de selección de la arquitectura reactiva?
La de una conducta disparada a la que no inhibe ninguna otra conducta disparada. Si no hay ninguna, no hace nada.

### En la arquitectura de subsunción, ¿qué capas inhiben a cuáles?
Las capas bajas, las más básicas, inhiben a las altas. Por ejemplo, evitar un obstáculo tiene prioridad sobre explorar.

### ¿Qué diferencia hay entre suprimir e inhibir en la subsunción de Brooks?
Un nodo supresor actúa sobre las entradas de un módulo. Un nodo inhibidor actúa sobre sus salidas.

### ¿Cuál es la tesis de Brooks sobre la inteligencia?
Que el comportamiento inteligente se puede generar sin un modelo simbólico del mundo y que la inteligencia es una propiedad emergente de sistemas complejos.

### ¿Cómo se comunican los robots de Steels que recogen piedras?
A través del entorno, sin comunicación directa. Siguen el gradiente de la señal de la nave nodriza y dejan y recogen partículas radiactivas que marcan el camino.

### En los robots de Steels, ¿por qué un robot cargado echa dos partículas y uno sin carga recoge una?
Para que el rastro hacia las piedras se refuerce mientras haya robots que lo recorren cargados y desaparezca cuando se agota la fuente.

### ¿Qué estudia la simulación MANTA?
La emergencia del reparto de trabajo en una colonia de hormigas. Cada tarea tiene un peso, un umbral y un nivel de activación, y las tareas compiten entre sí. A nivel de sistema surgen especializaciones.

### ¿Qué ventajas tienen las arquitecturas reactivas?
Respuesta inmediata, sin problema de representación simbólica, sencillez, robustez y tolerancia a fallos.

### ¿Qué inconvenientes tienen las arquitecturas reactivas?
Les cuesta aprender de la experiencia, solo usan información local y a corto plazo, las interacciones entre muchas conductas son difíciles de entender y no hay metodología: se diseñan por prueba y error.

### Problema: aplica el algoritmo de selección de la arquitectura reactiva
Conductas: $b_1$ (batería baja: volver a la base), $b_2$ (obstáculo delante: girar) y $b_3$ (siempre: explorar). Inhibición: $b_1 <_r b_2 <_r b_3$, donde $b_i <_r b_j$ significa que $b_i$ inhibe a $b_j$. ¿Qué hace el agente si percibe un obstáculo con batería normal, y si percibe un obstáculo con la batería baja?
#### Paso 1
Obstáculo con batería normal: se disparan $b_2$ y $b_3$. $b_2$ no está inhibida por ninguna conducta disparada, porque $b_1$ no se ha disparado. El agente gira.
#### Paso 2
Obstáculo con batería baja: se disparan las tres. $b_1$ inhibe a las otras dos y nadie la inhibe a ella. El agente vuelve a la base.
#### Paso 3
La prioridad la fija el orden de inhibición, no el orden en que se disparan las conductas.

## 4. Arquitecturas deliberativas y BDI

### ¿Qué caracteriza a un agente deliberativo?
Tiene un modelo simbólico explícito del mundo y decide mediante razonamiento lógico, normalmente con un sistema de planificación.

### ¿Qué dos procesos forman el razonamiento práctico?
La deliberación, que decide qué objetivos perseguir, y el razonamiento de medios y fines, que decide cómo alcanzarlos.

### ¿Qué funciones cumplen las intenciones en un agente BDI?
Dirigen el razonamiento de medios y fines, restringen las deliberaciones futuras, persisten en el tiempo e influyen en las creencias del razonamiento posterior.

### ¿Por qué tres motivos abandona un agente BDI una intención?
Porque ya la ha alcanzado, porque no la va a poder alcanzar o porque ha desaparecido la razón por la que la tenía.

### ¿Qué hacen las funciones `Brf`, `Opciones`, `Filtro` y `Ejecutar` de la formalización BDI?
`Brf` revisa las creencias con la percepción. `Opciones` genera deseos a partir de creencias e intenciones. `Filtro` elige las intenciones a partir de creencias, deseos e intenciones. `Ejecutar` elige la acción a partir de las intenciones.

### ¿Qué estructura construye la generación de opciones en un agente BDI?
Una jerarquía de planes: en cada paso se generan intenciones más concretas hasta llegar a acciones ejecutables.

### ¿Qué sistemas y autores están en el origen de la arquitectura BDI?
IRMA (Bratman, 1988) como precursor, PRS (Georgeff y Lansky, 1987) como sistema, y las lógicas BDI de Rao y Georgeff.

## 5. Arquitecturas híbridas

### ¿Qué combina una arquitectura híbrida?
Un subsistema deliberativo, con modelo simbólico y planes, y otro reactivo, para los estímulos que no necesitan deliberar. Se organiza en capas.

### ¿Qué diferencia hay entre las capas horizontales y las verticales de una arquitectura híbrida?
En las horizontales todas las capas están conectadas a sensores y actuadores y cada una sugiere acciones. En las verticales solo una capa tiene entrada y salida, y cada capa pasa el control a la siguiente.

### ¿Qué ventaja e inconveniente tienen las capas horizontales?
Ventaja: simplicidad conceptual, una capa por comportamiento. Inconveniente: el comportamiento global puede ser incoherente y hace falta una función mediadora, que se convierte en cuello de botella.

### ¿Qué ventaja e inconveniente tienen las capas verticales?
Ventaja: menos interacciones entre capas. Inconveniente: para decidir hay que pasar por todas las capas, así que el fallo de una rompe el agente.

### ¿Qué tres capas tiene InterRaP?
Comportamiento (reactiva, con la información del entorno), planificación (proactiva, con los planes del agente) y cooperación (social, con los planes de otros agentes). Su base de conocimiento también se organiza en esas tres capas.

### Cita ejemplos de arquitecturas híbridas.
InterRaP, AuRA, RAP y Touring Machines.

## 6. Jason

### ¿Qué es Jason?
Un intérprete de una extensión de AgentSpeak, un lenguaje para agentes BDI. Es de código abierto y funciona sobre varias infraestructuras.

### ¿Qué eventos disparadores existen en Jason?
`+L` y `-L` añaden o borran una creencia. `+!L` y `-!L` añaden o borran un objetivo de logro. `+?L` y `-?L` añaden o borran un objetivo de prueba.

### En Jason, ¿qué diferencia hay entre `~L` y `not L` en el contexto de un plan?
`~L` significa que el agente cree que L es falso. `not L` significa que no cree que L sea cierto, que puede ser porque no sabe nada de L.

### En Jason, ¿qué diferencia hay entre un plan relevante y un plan aplicable?
Un plan es relevante si su evento disparador unifica con el evento. Es aplicable si, además, su contexto es consecuencia lógica de las creencias.

### En el cuerpo de un plan de Jason, ¿qué diferencia hay entre `!g` y `!!g`?
`!g` suspende el plan hasta lograr `g`. `!!g` lanza el objetivo y el plan sigue sin esperar.

### ¿Qué son las notas mentales en Jason?
Cambios en las creencias desde el cuerpo de un plan: `+b` añade, `-b` borra y `-+b` modifica.

### ¿Qué son las acciones internas en Jason?
Acciones que empiezan por un punto, como `.print` o `.send`, y que no modifican el entorno.

### ¿Por qué falla un plan en Jason?
Porque no hay planes relevantes o aplicables para un objetivo de logro, porque falla un objetivo de prueba o porque falla una acción.

### ¿Qué ocurre en Jason cuando falla un objetivo `g`?
Se genera el evento `-!g`. Si hay un plan para él, se ejecuta encima de la intención que falló. Si no lo hay, el fallo sube al objetivo padre.

### ¿Por qué se ejecuta un plan `+inicio` si `inicio.` es una creencia inicial?
Porque las creencias iniciales generan su evento de adición al arrancar el agente.

### ¿Qué hace `.send(robot, achieve, g)` en Jason?
Delega en el agente `robot` el objetivo `g`. Con `tell` en lugar de `achieve`, le informaría de una creencia.

### ¿Para qué sirve la anotación `[source(Ag)]` en un evento disparador de Jason?
Para saber de qué agente viene una creencia u objetivo y filtrar de quién se acepta.

### En Jason, ¿cómo se unifica la lista `[1,2,3]` con `[H|T]`?
`H = 1` y `T = [2,3]`.

### Problema: traza un programa de Jason con recursión por creencias
Creencia inicial `suma(0,0).` y planes `+suma(X,S) : X < 4 <- +suma(X+1, S+X+1).` y `+suma(X,S) : X = 4 <- .print("suma 4 == ", S).` ¿Qué escribe y qué creencias `suma` quedan al final?
#### Paso 1
La creencia inicial genera el evento `+suma(0,0)`. Como 0 < 4, se añade `suma(1,1)`, que dispara el mismo plan.
#### Paso 2
Se encadenan `suma(2,3)`, `suma(3,6)` y `suma(4,10)`, cada una disparada por la anterior.
#### Paso 3
Con `suma(4,10)` se aplica el segundo plan y escribe `suma 4 == 10`.
#### Paso 4
Ningún plan borra creencias, así que al final hay cinco: de `suma(0,0)` a `suma(4,10)`.

### Problema: traza el fallo de un objetivo en Jason
```
!a.
+!a <- !b; .print("fin a").
+!b <- !c; .print("fin b").
+!c <- .fail.
-!b <- .print("recupero b").
```
¿Qué escribe el agente?
#### Paso 1
`!a` lanza `!b`, que lanza `!c`. El plan de `c` ejecuta `.fail` y el objetivo `c` falla.
#### Paso 2
No hay plan para `-!c`, así que el fallo sube a `b`. Para `-!b` sí hay plan, que escribe `recupero b`.
#### Paso 3
El plan de `b` quedó abortado, así que nunca escribe `fin b`. Tras tratar el fallo, el plan padre continúa y escribe `fin a`.
