# SMA U1 - Arquitecturas de agente

## 1. Qué es un agente

### Según Wooldridge, ¿qué es un agente?
Un proceso computacional dirigido por objetivos y capaz de interactuar con su entorno de forma flexible y robusta. Dicho de otro modo, es un sistema informático que actúa de forma autónoma en un entorno para alcanzar los objetivos que se le han delegado. Su ciclo es percibir, decidir y actuar.

### ¿Qué significa que la interacción de un agente con su entorno sea flexible, según Wooldridge?
Que el agente es reactivo (responde a tiempo a los cambios del entorno), proactivo (persigue sus objetivos con iniciativa) y social (interactúa con otros agentes). No significa recuperarse bien de los fallos ni comunicarse con agentes de otra arquitectura.

### ¿Qué es la proactividad de un agente?
Generar y perseguir objetivos propios, tomando la iniciativa y reconociendo oportunidades, sin limitarse a reaccionar a eventos. Guiarse solo por eventos es ser reactivo. Explicar su conducta con creencias y deseos es lo propio de un sistema intencional, que es otra idea.

### ¿Qué cuatro propiedades forman el concepto débil de agente y cuáles añade el concepto fuerte?
El concepto débil son autonomía, proactividad, reactividad y sociabilidad, y un agente siempre las tiene. El fuerte añade movilidad, veracidad, benevolencia, racionalidad, y aprendizaje y adaptación, y un agente puede tenerlas o no.

### ¿Qué significan la veracidad, la benevolencia y la racionalidad de un agente?
Veracidad: no comunica información falsa a sabiendas. Benevolencia: no tiene objetivos contradictorios e intenta hacer lo que se le pide. Racionalidad: tiene objetivos concretos e intenta siempre alcanzarlos.

### ¿Qué es un sistema intencional según Dennett?
Un sistema cuyo comportamiento se puede predecir atribuyéndole creencias, deseos y perspicacia racional. No se define por la lista de intenciones que puede llegar a tener ni por un conjunto de planes que modelan su conducta.

### ¿Qué diferencia hay entre un sistema intencional de primer y de segundo orden?
El de primer orden tiene creencias y deseos, pero no sobre creencias y deseos. El de segundo orden los tiene sobre los suyos y sobre los de otros, como «Juan cree que Lola cree que llueve».

## 2. Entornos

### ¿Cuándo es accesible (observable) un entorno?
Cuando los sensores del agente le dan información completa, exacta y actualizada del estado del entorno. Los entornos moderadamente complejos, como el mundo físico diario o Internet, son inaccesibles. No debe confundirse con un entorno estático, que es otra propiedad.

### ¿Cuándo es estático un entorno?
Cuando se puede asumir que solo cambia por las acciones del propio agente. Su contrario, el entorno dinámico, tiene otros procesos que provocan cambios fuera del control del agente.

### ¿Cuándo es determinista un entorno?
Cuando cada acción tiene un único efecto garantizado.

### ¿Cuándo es episódico un entorno?
Cuando la elección de la acción depende solo del episodio actual, sin tener en cuenta los anteriores.

### Problema: clasifica el entorno de un crucigrama
Un agente resuelve un crucigrama en papel. Clasifícalo según las seis propiedades.
#### Paso 1
Observable: ve todo el tablero y las definiciones. Determinista: escribir una palabra tiene un único efecto.
#### Paso 2
Secuencial y no episódico: cada palabra condiciona las casillas que comparte con las palabras que la cruzan.
#### Paso 3
Estático: nada cambia salvo lo que escribe el agente. Discreto: hay casillas y letras finitas. Agente individual: no hay nadie más.

## 3. Arquitecturas reactivas

### ¿Qué diferencia hay entre un agente reactivo puro y uno reactivo con estado?
El puro va directamente de la percepción a la acción, sin historia. El que tiene estado guarda la secuencia de percepciones como estado interno y decide con ella, aunque tampoco planifica.

### ¿Qué es un comportamiento (conducta) en la arquitectura de subsunción?
Un par $(c, a)$, es decir, una condición y una acción. La condición $c$ es un conjunto de percepciones, y el comportamiento se dispara cuando la percepción actual pertenece a $c$. Es una regla condición-acción, no una intención como las de un agente BDI.

### ¿Qué acción elige el algoritmo de selección de la arquitectura reactiva?
La de una conducta disparada a la que no inhibe ninguna otra conducta disparada. Si no hay ninguna, no hace nada.

### En la arquitectura de subsunción, ¿qué capas inhiben a cuáles?
Las capas bajas, las más básicas, inhiben a las altas, que son más abstractas. Por ejemplo, evitar un obstáculo tiene prioridad sobre explorar. Una capa social al tope es propia de las arquitecturas híbridas, no de la subsunción.

### ¿Qué diferencia hay entre suprimir e inhibir en la subsunción de Brooks?
Un nodo supresor actúa sobre las entradas de un módulo. Un nodo inhibidor actúa sobre sus salidas.

### ¿Cuál es la tesis de Brooks sobre la inteligencia?
Que el comportamiento inteligente se puede generar sin el razonamiento simbólico explícito de la IA clásica y sin un modelo simbólico del mundo. Es producto de la interacción con el entorno y emerge de comportamientos simples, de modo que la inteligencia es una propiedad emergente de sistemas complejos. Por eso los agentes reactivos no se basan en dividir el conocimiento en creencias, deseos e intenciones, que es la idea de un sistema intencional.

### ¿Qué ventajas e inconvenientes tienen las arquitecturas reactivas?
Ventajas: respuesta inmediata, sin problema de representación simbólica, sencillez, robustez y tolerancia a fallos. Inconvenientes: les cuesta aprender de la experiencia, solo usan información local y a corto plazo, las interacciones entre muchas conductas son difíciles de entender y no hay metodología, así que se diseñan por prueba y error.

### Problema: aplica el algoritmo de selección de la arquitectura reactiva
Conductas: $b_1$ (batería baja: volver a la base), $b_2$ (obstáculo delante: girar) y $b_3$ (siempre: explorar). Inhibición: $b_1 <_r b_2$ y $b_2 <_r b_3$, y la relación es transitiva, donde $b_i <_r b_j$ significa que $b_i$ inhibe a $b_j$. ¿Qué hace el agente si percibe un obstáculo con batería normal, y si percibe un obstáculo con la batería baja?
#### Paso 1
Obstáculo con batería normal: se disparan $b_2$ y $b_3$. $b_2$ no está inhibida por ninguna conducta disparada, porque $b_1$ no se ha disparado. El agente gira.
#### Paso 2
Obstáculo con batería baja: se disparan las tres. Nadie inhibe a $b_1$, de modo que gana. El agente vuelve a la base.
#### Paso 3
La prioridad la fija el orden de inhibición, no el orden en que se disparan las conductas.

## 4. Arquitecturas deliberativas y BDI

### ¿Qué caracteriza a un agente deliberativo?
Tiene un modelo simbólico explícito del mundo y decide mediante razonamiento lógico, normalmente con un sistema de planificación.

### ¿Qué dos procesos forman el razonamiento práctico?
La deliberación, que decide qué objetivos perseguir, y el razonamiento de medios y fines, que decide cómo alcanzarlos.

### ¿Qué son las creencias, los deseos y las intenciones en un agente BDI?
Las creencias son el conocimiento del agente sobre el entorno. Los deseos son sus metas. Las intenciones son los deseos a los que se compromete: dirigen el razonamiento de medios y fines, restringen las deliberaciones futuras, persisten en el tiempo e influyen en las creencias.

### ¿Qué produce el proceso de deliberación de un agente BDI?
Intenciones. La deliberación decide qué objetivos perseguir, y la función `Filtro` elige las intenciones a partir de creencias, deseos e intenciones previas. Las creencias salen de la revisión con la percepción (`Brf`) y los deseos de la generación de opciones.

### ¿Qué funciones cumplen `Brf`, `Opciones`, `Filtro` y `Ejecutar` en la formalización BDI?
`Brf` revisa las creencias con la percepción. `Opciones` genera deseos a partir de creencias e intenciones. `Filtro` elige las intenciones a partir de creencias, deseos e intenciones. `Ejecutar` elige la acción a partir de las intenciones.

### ¿En qué tres casos abandona un agente BDI una intención?
Porque ya la ha alcanzado, porque no la va a poder alcanzar o porque ha desaparecido la razón por la que la tenía.

### ¿Qué tipos de compromiso con una intención distingue el razonamiento práctico?
| Compromiso | Mantiene la intención hasta que |
|---|---|
| Ciego (también llamado fanático) | crea que la ha logrado |
| De mente cerrada (el «inquebrantable» de los exámenes) | crea que la ha logrado o que ya no es posible lograrla |
| De mente abierta | crea que la ha logrado o deje de ser uno de sus objetivos |

La frase «hasta creer que se ha logrado o que es imposible» describe el de mente cerrada, no el ciego. Las transparencias no definen estos tipos: la tabla es la de Rao y Georgeff y la de Wooldridge. En los exámenes de AIN, el compromiso «inquebrantable» es el que se mantiene hasta creer que la intención se ha logrado o que ya no es posible, y ciego y fanático se dan por iguales.

### En un agente BDI, ¿en qué se diferencian el compromiso ciego y el fanático, y qué estrategia es la del compromiso inquebrantable?
El ciego y el fanático no se diferencian: son el mismo y mantienen la intención hasta creer que la han logrado. El compromiso inquebrantable es otro: mantiene la intención hasta creer que la ha logrado o que ya no es posible lograrla (es el de mente cerrada). La opción «mientras la crea posible» es un distractor.

## 5. Arquitecturas híbridas

### ¿Qué combina una arquitectura híbrida?
Un subsistema deliberativo, con modelo simbólico y planes, y otro reactivo, para los estímulos que no necesitan deliberar. Se organiza en capas.

### ¿Qué diferencia hay entre las capas horizontales y las verticales de una arquitectura híbrida?
En las horizontales todas las capas están conectadas a sensores y actuadores y cada una sugiere acciones. En las verticales solo una capa tiene entrada y salida, y el control pasa de una capa a la siguiente en una pasada o en dos. En una horizontal nunca es una sola capa la que conecta con los sensores y los actuadores.

### ¿Qué ventaja e inconveniente tienen las capas horizontales?
Ventaja: simplicidad conceptual, una capa por comportamiento. Inconveniente: el comportamiento global puede ser incoherente y hace falta una función mediadora, que se convierte en cuello de botella.

### ¿Qué ventaja e inconveniente tienen las capas verticales?
Ventaja: menos interacciones entre capas. Inconveniente: para decidir hay que pasar por todas las capas, así que el fallo de una rompe el agente.

### ¿Qué estructura tiene InterRaP?
Es vertical, con tres capas y dos pasadas: la activación sube y la ejecución baja. Las capas son comportamiento (reactiva, con la información del entorno), planificación (proactiva, con los planes del agente) y cooperación (social, con los planes de otros agentes). Su base de conocimiento también está en tres capas. No hay función mediadora que elija la capa, porque eso es propio de las horizontales.

### ¿Qué tipo de capas tienen las Touring Machines y en qué se distinguen de InterRaP?
Son un ejemplo de arquitectura horizontal, con tres capas (reactiva, de planificación y de modelado) que reciben la percepción y proponen acciones, y un subsistema de control que decide cuál actúa. InterRaP, en cambio, es vertical y no tiene ese control.

## 6. Jason

### ¿Qué eventos disparadores existen en Jason?
`+L` y `-L` añaden o borran una creencia. `+!L` y `-!L` añaden o borran un objetivo de logro. `+?L` y `-?L` añaden o borran un objetivo de prueba.

### En Jason, ¿qué diferencia hay entre `~L` y `not L` en el contexto de un plan?
`~L` significa que el agente cree que L es falso. `not L` significa que no cree que L sea cierto, que puede ser porque no sabe nada de L.

### En Jason, ¿qué diferencia hay entre un plan relevante y un plan aplicable?
Un plan es relevante si su evento disparador unifica con el evento. Es aplicable si, además, su contexto es consecuencia lógica de las creencias.

### En el cuerpo de un plan de Jason, ¿qué diferencia hay entre `!g` y `!!g`?
`!g` suspende el plan hasta lograr `g`. `!!g` lanza el objetivo y el plan sigue sin esperar.

### ¿Qué son las notas mentales en Jason?
Cambios en las creencias desde el cuerpo de un plan: `+b` añade, `-b` borra y `-+b` modifica. Las creencias creadas así llevan la anotación `source(self)`.

### ¿Qué son las acciones internas en Jason?
Acciones que empiezan por un punto, como `.print`, `.send`, `.nth` o `.at`, y que no modifican el entorno. Las acciones del entorno no llevan punto.

### ¿Por qué falla un plan en Jason y qué ocurre cuando falla un objetivo `g`?
Falla si no hay planes relevantes o aplicables para un objetivo de logro, si falla un objetivo de prueba o si falla una acción. Entonces se genera el evento `-!g`. Si hay un plan para él, se ejecuta encima de la intención que falló. Si no, el fallo sube al objetivo padre.

### En Jason, ¿qué hace el objetivo de prueba `?pos(X,Y,Z)` y en qué se diferencia de `!pos(X,Y,Z)` y de `+pos(X,Y,Z)`?
Consulta la base de creencias y, si hay una creencia `pos` que unifica, instancia X, Y y Z con sus valores. No crea ninguna creencia, que es lo que hace `+pos(...)` en el cuerpo de un plan, y tampoco lanza un plan, a diferencia del objetivo de logro `!pos(...)`, que expresa un estado que se quiere conseguir. Si ninguna creencia unifica, el objetivo falla.

### En Jason, ¿qué valores puede tomar la anotación `source` de una creencia?
`source(percept)` si viene de la percepción del entorno, `source(self)` si es una nota mental del propio agente y `source(nombre_del_agente)` si se la comunicó otro agente. Un identificador de conversación o el nombre de un plan no son fuentes válidas. La misma anotación sirve en un evento, como en `+!order(P)[source(Ag)]`, para saber quién lo envió.

### ¿Qué hace `.send(r, tell, c)` en Jason y qué cambia con `achieve`?
El primer argumento es el receptor, el segundo la fuerza ilocutoria y el tercero el contenido. Con `tell`, el receptor añade a sus creencias el literal `c` con la anotación `source(emisor)`. Con `achieve`, recibe `c` como objetivo, de modo que el emisor le delega esa meta. `order` no es una de las fuerzas ilocutorias de Jason.

### En Jason, ¿qué hace la acción interna `.nth(1, L, T)`?
Toma la lista `L` y unifica `T` con su elemento de posición 1. La lista es el segundo argumento y el resultado, el tercero. Los índices empiezan en 0, de modo que con `L = [a,b,c,d]` la llamada `.nth(2, L, X)` deja `X = c`.

### En Jason, ¿qué hace la acción interna `.at("now +1 m", {+!g})`?
Programa un evento: pasado un minuto desde ahora se genera el evento `+!g`, que dispara los planes relevantes para ese objetivo. El primer argumento es el momento y el segundo, el evento entre llaves. No crea ninguna creencia ni ejecuta un plan por su cuenta.

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

### Problema: usa un objetivo de prueba de Jason sobre una creencia que existe y otra que no
```
temp(21)[source(percept)].
!revisar.
+!revisar <- ?temp(T); .print("temperatura ", T); ?humedad(H); .print("humedad ", H).
```
No hay ningún plan para `+?humedad(H)`. ¿Qué escribe el agente y qué evento se genera al final?
#### Paso 1
`?temp(T)` consulta la base de creencias, encuentra `temp(21)` y unifica `T = 21`. La anotación `source(percept)` no impide la unificación y no se crea ninguna creencia.
#### Paso 2
Se escribe `temperatura 21`.
#### Paso 3
`?humedad(H)` no encuentra ninguna creencia que unifique y no hay plan que la resuelva, así que el objetivo de prueba falla y con él el plan de `!revisar`.
#### Paso 4
Nunca se escribe `humedad`. Se genera el evento `-!revisar`, y como no hay plan para él, el objetivo queda fallido.
