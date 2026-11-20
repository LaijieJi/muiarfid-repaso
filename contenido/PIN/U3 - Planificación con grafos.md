# PIN U3 - Planificación con grafos

## 1. Motivación e historia

### ¿Qué fuente de ineficiencia de la búsqueda ataca GraphPlan?
El factor de ramificación. La búsqueda hacia atrás puede probar muchas acciones que no se alcanzan desde el estado inicial, y la búsqueda hacia delante puede probar muchas que no conducen a la meta.

### ¿Qué estrategia general sigue GraphPlan para reducir esa búsqueda?
Primero construye un problema relajado que se resuelve en tiempo polinómico. Después hace una versión de la búsqueda original restringida a las acciones que aparecen en ese problema relajado.

### ¿Por qué es seguro restringir la búsqueda a las acciones del problema relajado?
Porque la relajación quita restricciones, de modo que sus soluciones incluyen todas las del problema original. Por tanto, las acciones de cualquier solución real están en el grafo y no se pierde ninguna solución.

### ¿Qué devuelve cada enfoque de planificación: estados, espacio de planes y grafo de planificación?
| Enfoque | Salida |
|---|---|
| Espacio de estados | Una secuencia de acciones |
| Espacio de planes | Un conjunto de acciones parcialmente ordenado |
| Grafo de planificación | Una secuencia de conjuntos de acciones, como $\langle\{a_1,a_2\},\{a_3,a_4\},\{a_5\}\rangle$ |

### ¿En qué sentido GraphPlan es una solución intermedia entre la planificación de estados y la de espacio de planes?
Se compromete mucho en las acciones y en el tiempo: las acciones están totalmente instanciadas y asignadas a pasos concretos. Se compromete poco en el orden: dentro de un mismo paso las acciones no tienen orden entre sí.

### ¿Por qué fue importante GraphPlan cuando apareció y qué planificadores heredan sus ideas?
Fue mucho más rápido que los planificadores de espacio de planes (POP, SNLP, UCPOP) y causó sensación. Sus ideas aparecen en IPP, STAN, GraphHTN, SGP, Blackbox, Medic, TGP y LPG, y muchos de ellos son más rápidos que el GraphPlan original.

## 2. Análisis de alcanzabilidad

### ¿Cuándo es alcanzable un estado $s$ desde el estado inicial $s_0$?
Cuando existe una secuencia de acciones del conjunto $A$ que define un camino de $s_0$ a $s$.

### ¿En qué consiste el análisis de alcanzabilidad de un planificador?
En averiguar qué estados se pueden alcanzar desde $s_0$ en cierto número de pasos y cómo. Así el planificador se asegura de que las metas del problema son alcanzables.

### ¿Por qué GraphPlan no calcula la alcanzabilidad exacta y qué usa en su lugar?
Porque el árbol de alcanzabilidad exacto no se puede calcular de forma tratable. Usa el grafo de planificación, que aproxima la alcanzabilidad mediante una relajación.

## 3. El grafo de planificación

### ¿Cómo está organizado un grafo de planificación?
En capas que alternan literales (círculos) y acciones (cuadrados). Cada par de capas es un paso de tiempo. La primera capa es de literales y contiene los que son ciertos en el estado inicial. No hay variables, solo literales y acciones instanciados.

### ¿Qué aristas tiene un grafo de planificación?
Una arista de cada precondición de una acción a esa acción, y una arista de la acción a cada uno de sus efectos.

### ¿Qué representan los nodos del nivel de acciones $A_i$ y los del nivel de literales $P_i$?
$A_i$ contiene las acciones que quizá se puedan ejecutar en el tiempo $i$. $P_i$ contiene los literales que quizá sean ciertos en el tiempo $i$. Es un «quizá» porque el grafo es una relajación y no garantiza que todo eso ocurra a la vez.

### ¿Qué es una acción de mantenimiento (no-op) y para qué sirve?
Es una acción asociada a un literal $l$ que tiene $l$ como precondición y como efecto. Representa lo que ocurre si no se cambia $l$. Sirve para que un literal que sigue cierto aparezca en el nivel siguiente y pueda usarlo el plan.

### ¿Qué acciones entran en el nivel $A_i$?
Las acciones, y las no-op, cuyas precondiciones están todas en $P_{i-1}$ y no son mutex dos a dos. Por eso una acción puede faltar aunque cada una de sus precondiciones esté en $P_{i-1}$.

### ¿Qué literales entran en el nivel $P_i$?
Los efectos de todas las acciones de $A_i$, incluidas las no-op. Por tanto, $P_i$ contiene siempre a $P_{i-1}$.

### Si una acción borra un literal, ¿por qué el literal sigue apareciendo en el nivel siguiente del grafo?
Porque su no-op sigue en el grafo y vuelve a añadir el literal. El borrado solo se refleja en los mutex: la acción que borra el literal y su no-op son mutex, y eso puede hacer mutex a otros literales por soporte inconsistente.

## 4. Exclusión mutua (mutex)

### ¿Cuándo son mutex dos acciones del mismo nivel?
Cuando se da al menos una de tres condiciones: efectos inconsistentes, interferencia o necesidades en competencia. Si no se da ninguna, no se estorban y pueden aparecer las dos en un plan solución.

### ¿Qué son los efectos inconsistentes entre dos acciones?
Que un efecto de una acción niega un efecto de la otra. Por ejemplo, la acción que coge una caja borra «caja en la sala 1» y la no-op de ese literal lo añade.

### ¿Qué es la interferencia entre dos acciones?
Que una acción borra una precondición de la otra. Por ejemplo, ir de la sala 1 a la 2 borra «robot en la sala 1», que es precondición de coger una caja en la sala 1.

### ¿Qué son las necesidades en competencia entre dos acciones?
Que tienen precondiciones que son mutex entre sí en el nivel de literales anterior. Por ejemplo, si «robot en 1» y «robot en 2» son mutex, una acción que necesita lo primero y otra que necesita lo segundo son mutex.

### ¿Cuándo son mutex dos literales del mismo nivel?
Por soporte inconsistente: uno es la negación del otro, o todas las formas de lograrlos son mutex dos a dos. Basta una pareja de acciones no mutex, una que logre cada literal, para que los literales no sean mutex.

### ¿Por qué se dice que los mutex se propagan de forma recursiva?
Porque los mutex de acciones usan los mutex de literales del nivel anterior (necesidades en competencia), y los mutex de literales usan los mutex de acciones del nivel de acciones anterior (soporte inconsistente).

### ¿Cómo evolucionan los mutex al añadir niveles al grafo?
Solo disminuyen. Dos literales que no son mutex en un nivel no lo serán nunca en niveles posteriores, porque si pueden estar en el mismo estado siempre podrán estarlo.

### ¿Cómo puede dejar de ser mutex una pareja de literales en un nivel posterior?
Porque en ese nivel hay una pareja de acciones no mutex, una que logra cada literal. Puede ser una acción nueva, como la no-op de un literal recién aparecido, o una pareja que dejó de ser mutex porque sus precondiciones ya no lo son.

### ¿Encuentran las reglas de mutex todas las exclusiones que hay?
No. Determinar todas puede ser tan difícil como encontrar el plan. Las reglas encuentran muchas, pero solo las binarias, entre dos elementos.

## 5. El algoritmo GraphPlan

### ¿Cuáles son los pasos del bucle principal de GraphPlan?
Para $k = 0, 1, 2, \dots$ se hace la expansión del grafo hasta $k$ niveles y se comprueba una condición necesaria de existencia de plan. Si se cumple, se hace la extracción de la solución, que es una búsqueda hacia atrás restringida al grafo, y se devuelve el plan si se encuentra.

### ¿Qué condición necesaria, pero no suficiente, comprueba GraphPlan antes de extraer?
Que todos los literales de la meta aparezcan en un mismo nivel de literales y que ningún par de ellos sea mutex en ese nivel.

### ¿Por qué esa condición no es suficiente?
Porque los mutex binarios no detectan todas las exclusiones. Puede haber metas incompatibles entre tres o más literales aunque ningún par sea mutex. Además, la búsqueda de extracción puede fallar.

### ¿Qué parte de GraphPlan cuesta tiempo polinómico y cuál exponencial?
La expansión del grafo es polinómica. La extracción de la solución, una búsqueda hacia atrás, es exponencial.

### ¿Cómo cambian literales, acciones y mutex al añadir niveles, y qué garantiza eso?
Los literales y las acciones solo aumentan y los mutex solo disminuyen. Por tanto, el grafo se estabiliza en un número finito de pasos, es decir, dos niveles de literales consecutivos son idénticos.

### ¿Qué ocurre si el grafo se estabiliza y la meta no cumple la condición necesaria?
Que no la cumplirá nunca, porque más niveles no cambian nada, y por tanto no hay plan.

### ¿Qué relación hay entre el nivel en que la meta cumple la condición necesaria y la longitud del plan?
El número de niveles de acciones es una cota inferior del número de pasos del plan. El plan necesita al menos tantos pasos como niveles se han construido hasta que la meta cumple la condición.

## 6. Extracción de la solución

### ¿Cómo funciona la extracción de la solución?
Es una búsqueda hacia atrás desde el último nivel $j$ con un conjunto de metas $g$. Para cada literal de $g$ se elige una acción de $A_j$, real o no-op, que lo logre. Si dos acciones elegidas son mutex, se retrocede. Si no, las nuevas metas son las precondiciones de las acciones elegidas y se repite en el nivel $j-1$. Al llegar a $j = 0$ se devuelve el plan.

### ¿Por qué entre las acciones candidatas de la extracción hay no-op?
Porque un literal que ya era cierto y se mantiene se logra con su no-op. Entonces su meta pasa tal cual al nivel anterior, sin ninguna acción real.

### ¿Puede una misma acción lograr varias metas del nivel durante la extracción?
Sí. Una acción no es mutex consigo misma, así que si logra dos metas basta con elegirla una vez, y sus precondiciones pasan al nivel anterior.

### ¿Qué hace GraphPlan si todas las combinaciones de acciones para las metas de un nivel contienen pares mutex?
Retrocede y prueba otras elecciones en los niveles posteriores. Si agota todas las alternativas sin plan, expande el grafo con otro nivel de acciones y otro de literales y repite la extracción.

### ¿Qué plan devuelve la extracción y qué se hace con las no-op?
Una secuencia de conjuntos de acciones, uno por nivel de acciones, sin las no-op. Las acciones de un mismo conjunto no son mutex, así que se pueden ejecutar en cualquier orden.

### Problema: construir un grafo de planificación con mutex y extraer el plan
Un robot y una caja en dos salas, 1 y 2. Los literales son `r1` y `r2` (el robot está en esa sala), `c1` y `c2` (la caja está en esa sala) y `lleva` (el robot lleva la caja). Las acciones son estas:

| Acción | Precondiciones | Añade | Borra |
|---|---|---|---|
| `ir(1,2)` | `r1` | `r2` | `r1` |
| `ir(2,1)` | `r2` | `r1` | `r2` |
| `coger(1)` | `r1`, `c1` | `lleva` | `c1` |
| `coger(2)` | `r2`, `c2` | `lleva` | `c2` |
| `dejar(1)` | `r1`, `lleva` | `c1` | `lleva` |
| `dejar(2)` | `r2`, `lleva` | `c2` | `lleva` |

El estado inicial es $\{$`r1`, `c1`$\}$ y la meta es $\{$`r2`, `c2`$\}$. Construye el grafo con sus mutex hasta que la meta cumpla la condición necesaria y extrae el plan.
#### Paso 1
Nivel de literales $P_0 = \{$`r1`, `c1`$\}$. En $A_1$ entran las acciones con todas sus precondiciones en $P_0$, que son `ir(1,2)` y `coger(1)`, y las no-op de `r1` y `c1`. No entran `ir(2,1)`, `coger(2)` ni `dejar`, porque les falta `r2`, `c2` o `lleva`.
#### Paso 2
Mutex en $A_1$, tres de los seis pares. `coger(1)` y `ir(1,2)` son mutex por interferencia, porque `ir(1,2)` borra `r1`. `coger(1)` y no-op(`c1`) lo son por efectos inconsistentes, porque `coger(1)` borra `c1`. `ir(1,2)` y no-op(`r1`) lo son por el mismo motivo con `r1`. Los otros tres pares no son mutex.
#### Paso 3
$P_1 = \{$`r1`, `c1`, `r2`, `lleva`$\}$, con `r1` y `c1` por no-op, `r2` por `ir(1,2)` y `lleva` por `coger(1)`. Mutex por soporte inconsistente: `lleva`–`c1` (sus únicas formas de lograrlos, `coger(1)` y no-op(`c1`), son mutex), `lleva`–`r2` (`coger(1)` e `ir(1,2)`) y `r1`–`r2` (no-op(`r1`) e `ir(1,2)`). No son mutex `r1`–`c1`, `r1`–`lleva` y `c1`–`r2`. La meta pide `c2`, que no está en $P_1$, así que hay que seguir.
#### Paso 4
$A_2$ usa $P_1$. Entran `ir(1,2)`, `ir(2,1)`, `coger(1)` y `dejar(1)`, y las no-op de `r1`, `r2`, `c1` y `lleva`. `coger(2)` no entra porque falta `c2`. `dejar(2)` tampoco entra, aunque `r2` y `lleva` están en $P_1$, porque son mutex entre sí.
#### Paso 5
De los 28 pares de $A_2$, solo ocho no son mutex: `coger(1)`–no-op(`r1`), `dejar(1)`–no-op(`r1`), `ir(1,2)`–no-op(`c1`), `ir(1,2)`–no-op(`lleva`), `ir(2,1)`–no-op(`c1`), no-op(`c1`)–no-op(`r1`), no-op(`c1`)–no-op(`r2`) y no-op(`r1`)–no-op(`lleva`). Los demás son mutex. Por ejemplo, `coger(1)`–`dejar(1)` por efectos inconsistentes y no-op(`r2`)–no-op(`lleva`) por necesidades en competencia, ya que `r2` y `lleva` eran mutex en $P_1$.
#### Paso 6
$P_2 = \{$`r1`, `r2`, `c1`, `lleva`$\}$ y `c2` sigue sin aparecer. Mutex: `c1`–`lleva` (sus cuatro parejas de acciones son mutex) y `r1`–`r2`. El par `r2`–`lleva` deja de ser mutex, porque `ir(1,2)` y no-op(`lleva`) no lo son. Hay que añadir otro nivel.
#### Paso 7
En $A_3$ entra ahora `dejar(2)`, porque `r2` y `lleva` ya no son mutex en $P_2$. Entran también `ir(1,2)`, `ir(2,1)`, `coger(1)`, `dejar(1)` y las cuatro no-op. $P_3$ añade `c2`. Sus mutex son `c1`–`c2`, `c1`–`lleva`, `c2`–`r1`, `c2`–`lleva` y `r1`–`r2`. La meta $\{$`r2`, `c2`$\}$ está en $P_3$ y `r2`–`c2` no es mutex, así que se cumple la condición necesaria y se extrae.
#### Paso 8
Extracción en el nivel 3, con meta $\{$`r2`, `c2`$\}$. `c2` solo lo logra `dejar(2)`. Para `r2` se prueba primero `ir(1,2)`, pero es mutex con `dejar(2)` por necesidades en competencia (`r1` y `r2` son mutex en $P_2$), así que se retrocede. Con no-op(`r2`) no hay mutex. Las metas del nivel 2 son $\{$`r2`, `lleva`$\}$.
#### Paso 9
Extracción en el nivel 2, con meta $\{$`r2`, `lleva`$\}$. Hay cuatro combinaciones. no-op(`r2`) con no-op(`lleva`) es mutex porque `r2` y `lleva` eran mutex en $P_1$. no-op(`r2`) con `coger(1)` es mutex porque `r2` y `r1` lo son. `ir(1,2)` con `coger(1)` es mutex por interferencia. `ir(1,2)` con no-op(`lleva`) no es mutex, así que se elige. Las metas del nivel 1 son $\{$`r1`, `lleva`$\}$.
#### Paso 10
Extracción en el nivel 1. `r1` solo lo logra no-op(`r1`) y `lleva` solo `coger(1)`, y no son mutex. Las metas del nivel 0 son $\{$`r1`, `c1`$\}$, que están en $P_0$, y la extracción termina.
#### Paso 11
El plan, sin las no-op, es $\langle\{$`coger(1)`$\}, \{$`ir(1,2)`$\}, \{$`dejar(2)`$\}\rangle$. Se comprueba: $\{$`r1`, `c1`$\}$ pasa a $\{$`r1`, `lleva`$\}$, luego a $\{$`r2`, `lleva`$\}$ y por último a $\{$`r2`, `c2`$\}$. Tiene tres pasos, que coincide con los tres niveles de acciones que hubo que construir.

## 7. Mutex de orden superior

### ¿Qué limitación tienen los mutex binarios y cómo se llama la exclusión que no detectan?
Solo detectan exclusiones entre pares de elementos. Una exclusión entre tres literales sin que ningún par sea mutex es un mutex ternario, y es de orden superior, así que GraphPlan no lo ve.

### En un camión con dos paquetes (p1 en la ciudad B y p2 en la C, camión y meta en la ciudad A), ¿por qué GraphPlan empieza a buscar un nivel antes de poder encontrar plan?
El plan más corto tiene seis pasos. Los literales «paquete 1 en el camión», «paquete 2 en el camión» y «camión en A» no son mutex dos a dos hasta el nivel 4, aunque los tres a la vez sean imposibles todavía. Por tanto, la meta pasa la condición necesaria en el nivel 5 y la extracción falla hasta que se construye el nivel 6.

### En ese camión (p1 en B), ¿por qué «paquete 1 en el camión» y «camión en A» no son mutex pronto?
Porque hay un plan corto de tres pasos (ir a donde está el paquete, cargarlo y volver a A) que deja el camión cargado en A. Como los dos literales pueden darse en el mismo estado, no son mutex, y un par no mutex nunca vuelve a serlo.

## 8. Discusión

### ¿Qué ventaja tiene GraphPlan frente a los planificadores de espacio de planes?
Su búsqueda hacia atrás, que es la parte difícil, solo considera las acciones del grafo. El espacio de búsqueda es más pequeño que el de un planificador de espacio de planes, y por eso es más rápido en planificación clásica.

### ¿Qué desventaja tiene el grafo de planificación y cómo se alivia?
Para construirlo se generan muchísimos átomos instanciados y muchos pueden ser irrelevantes. Se alivia, aunque no se elimina, asignando tipos a las variables, de modo que solo se instancian con términos del mismo tipo.

## 9. Heurísticas derivadas de grafos de planificación

### ¿Por qué una heurística basada en el grafo de planificación usa solo la expansión del grafo y no la extracción?
La expansión del grafo cuesta tiempo polinómico y la extracción es exponencial. Por eso se usa solo el grafo, sin extraer ningún plan, para estimar cuánto cuesta lograr las metas desde un estado $s$.

### ¿Cómo se define $h(g)$ para un literal $g$ sobre un grafo construido desde el estado $s$?
Es el nivel de la primera capa en la que $g$ aparece, es decir, en la que «posiblemente» se logra. Un literal que ya está en $s$ vale 0.

### ¿Por qué el número de niveles de acciones es una cota inferior de las acciones del plan?
Porque un literal no se puede lograr antes del nivel donde aparece, y cada nivel de acciones es al menos un paso del plan. Por tanto, el plan tiene al menos tantos pasos como niveles, y como mínimo una acción por paso.

### ¿Cómo se define la heurística de nivel máximo $h_{max}$ y qué propiedades tiene?
$$h_{max}(G) = \max_{g \in G} h(g)$$
Es admisible, pero poco precisa, porque solo mira la meta más lejana.

### ¿Cómo se define la heurística de nivel suma $h_{sum}$ y qué propiedades tiene?
$$h_{sum}(G) = \sum_{g \in G} h(g)$$
No es admisible, porque una acción que sirve a varias metas se cuenta varias veces. Sin embargo, funciona bien en la práctica.

### ¿Qué mide $h_{max2}$ y qué hace falta para calcularla?
$$h_{max2}(G) = \max_{\{g_1, g_2\} \subseteq G} h(g_1 \wedge g_2)$$
Donde $h(g_1 \wedge g_2)$ es el primer nivel en el que los dos literales aparecen y no son mutex. Necesita, por tanto, calcular los mutex del grafo.

### ¿Qué es $h_{max^k}$ y cómo se compara $h_{max2}$ con $h_{max}$?
$h_{max^k}$ generaliza la anterior: toma el máximo, sobre los subconjuntos de $k$ metas, del primer nivel en que esas $k$ metas coexisten sin mutex. Un par solo puede coexistir cuando ya aparecen los dos literales, así que $h_{max2} \ge h_{max}$.

### ¿Por qué los planificadores hacia delante como FF no calculan la heurística con mutex?
Porque la heurística se evalúa en cada estado del árbol de búsqueda. Construir el grafo con el cálculo de mutex en cada estado es un proceso muy costoso. Por eso se usa un grafo relajado, sin mutex.

### Problema: calcular $h_{max}$, $h_{sum}$ y $h_{max2}$ con mutex
Se usa el robot con una caja en dos salas (`ir`, `coger` y `dejar` como en los grafos con mutex), con estado inicial $\{$`r1`, `c1`$\}$ y meta $G = \{$`r1`, `c2`$\}$. Del grafo ya construido se sabe que `c2` aparece por primera vez en $P_3$, que $P_3 = \{$`r1`, `r2`, `c1`, `c2`, `lleva`$\}$ y que sus mutex son `c1`–`c2`, `c1`–`lleva`, `c2`–`r1`, `c2`–`lleva` y `r1`–`r2`. Calcula $h_{max}$, $h_{sum}$ y $h_{max2}$ y compáralas con el plan óptimo.
#### Paso 1
Niveles de cada meta: $h($`r1`$) = 0$ porque está en el estado inicial, y $h($`c2`$) = 3$ porque aparece en $P_3$.
#### Paso 2
$h_{max}(G) = \max(0, 3) = 3$ y $h_{sum}(G) = 0 + 3 = 3$.
#### Paso 3
En $P_3$ los dos literales de la meta son mutex (`c2`–`r1`), así que $h_{max2}$ no puede valer 3. Se construye $A_4$ con las acciones de $P_3$ y se busca cómo lograr cada literal. `c2` se logra con `dejar(2)` o con no-op(`c2`), y `r1` con no-op(`r1`) o con `ir(2,1)`.
#### Paso 4
Las cuatro parejas. `dejar(2)` con no-op(`r1`) son mutex por necesidades en competencia, porque `r2` y `r1` son mutex en $P_3$. `dejar(2)` con `ir(2,1)` son mutex por interferencia, porque `ir(2,1)` borra `r2`. no-op(`c2`) con no-op(`r1`) son mutex porque `c2` y `r1` son mutex en $P_3$. no-op(`c2`) con `ir(2,1)` no lo son: sus precondiciones `c2` y `r2` no son mutex en $P_3$ y ninguna borra ni niega algo de la otra.
#### Paso 5
Por tanto, `c2` y `r1` no son mutex en $P_4$ y $h(\text{`c2`} \wedge \text{`r1`}) = 4$. Como la meta tiene un solo par, $h_{max2}(G) = 4$.
#### Paso 6
El plan óptimo es `coger(1)`, `ir(1,2)`, `dejar(2)`, `ir(2,1)`, de longitud 4. Así que $h_{max}$ y $h_{sum}$ valen 3 y se quedan cortas, mientras que $h_{max2}$ vale 4 y es exacta, porque los mutex detectan que la caja en la sala 2 y el robot en la sala 1 no se logran a la vez antes.

## 10. Grafo de planificación relajado y plan relajado

### ¿Qué simplificaciones tiene un grafo de planificación relajado (RPG)?
No tiene efectos negativos, no calcula mutex y no tiene no-op. Solo interesa la primera aparición de cada literal y de cada acción.

### ¿Por qué un grafo relajado no necesita no-op?
Porque sin efectos negativos un literal que aparece nunca desaparece. Una vez en un nivel, está en todos los siguientes, y solo importa en qué nivel apareció por primera vez.

### ¿Cómo se construye a mano un grafo de planificación relajado?
$P_0$ es el estado. En cada paso, $A_i$ son las acciones con todas sus precondiciones en $P_{i-1}$ (basta con que estén, sin mutex) y $P_i$ es $P_{i-1}$ más los efectos positivos de $A_i$. Se ignoran los efectos negativos. Se repite hasta que todas las metas aparecen.

### ¿Qué pasa si el RPG deja de añadir literales y faltan metas?
Que esas metas no se pueden alcanzar ni siquiera con la relajación, así que desde ese estado no hay plan. Basta construir el RPG hasta que se estabiliza.

### ¿Cómo se leen $h_{max}$ y $h_{sum}$ en un RPG?
$h(g)$ es el nivel $P_i$ donde aparece $g$ por primera vez. $h_{max}$ es el máximo de esos niveles sobre las metas y $h_{sum}$ es su suma.

### ¿Qué es la heurística del plan relajado y quién la usa?
Es el número de acciones de un plan extraído del RPG, es decir, un plan que logra las metas ignorando los efectos negativos. La usa el planificador FF. Se construye un RPG por cada estado que se evalúa, con ese estado como $P_0$.

### ¿Cómo se extrae el plan relajado de un RPG?
Hacia atrás. Cada meta en su nivel $i$ se logra con una acción de $A_i$ que la añade. Las precondiciones de esa acción pasan a ser metas en sus propios niveles. Se repite hasta el nivel 0, contando cada acción y cada literal una sola vez. La heurística es el número de acciones elegidas.

### ¿Por qué el plan relajado cuenta mejor que $h_{sum}$ las acciones compartidas?
Porque $h_{sum}$ suma el nivel de cada meta, de modo que una acción necesaria para varias metas se cuenta tantas veces como metas. El plan relajado la elige una sola vez.

### ¿Se puede decir que $h_{sum}$ siempre es mayor o menor que el plan relajado?
No. En un camión con dos paquetes en A que hay que llevar a B, las dos metas están en el nivel 2, así que $h_{sum} = 4$ y $h_{max} = 2$. El plan relajado es de 5 acciones: mover, dos cargas y dos descargas. Las acciones del mismo nivel no las ve la suma de niveles. En los bloques de clase, con meta on(A,C) y on(C,B), $h_{sum} = 5$ y el plan relajado vale 4. Con meta on(A,B) y on(B,C) los dos valen 5.

### ¿Cuál de $h_{max}$, $h_{sum}$ y el plan relajado es la más informada, y por qué?
Suele serlo el plan relajado: cuenta cada acción una sola vez, de modo que no se equivoca por acciones compartidas como $h_{sum}$, y cuenta las acciones del mismo nivel, que $h_{max}$ y $h_{sum}$ no ven. $h_{max}$ es la más floja porque solo mira la meta más lejana. En el camión con dos paquetes valen 2, 4 y 5, y en el RPG del camión A-B-C valen 3, 5 y 4 (en ese orden: $h_{max}$, $h_{sum}$ y plan relajado).

### ¿Por qué el plan relajado puede no ser ejecutable en el problema real?
Porque ignora los efectos negativos y puede reutilizar literales que la realidad ya habría borrado. Por eso es una estimación del coste y no un plan válido.

### Problema: construir un grafo relajado y calcular $h_{sum}$, $h_{max}$ y el plan relajado
Un camión con carreteras A–B y B–C, en ambos sentidos, y un paquete $p$. Literales: `en(c,X)`, `en(p,X)` con $X \in \{A, B, C\}$, y `dentro(p)`. Acciones: `mover(X,Y)` con precondición `en(c,X)` y efecto `en(c,Y)`, `cargar(X)` con precondiciones `en(c,X)` y `en(p,X)` y efecto `dentro(p)`, y `descargar(X)` con precondiciones `en(c,X)` y `dentro(p)` y efecto `en(p,X)`. En el problema real se borran el origen de `mover`, `en(p,X)` en `cargar` y `dentro(p)` en `descargar`, pero el RPG los ignora. Estado inicial $\{$`en(c,A)`, `en(p,B)`$\}$ y meta $G = \{$`en(p,C)`, `en(c,C)`$\}$. Calcula $h_{sum}$, $h_{max}$ y un plan relajado.
#### Paso 1
$P_0 = \{$`en(c,A)`, `en(p,B)`$\}$. En $A_1$ solo cabe `mover(A,B)`, porque `cargar(B)` necesita `en(c,B)`. $P_1 = P_0 \cup \{$`en(c,B)`$\}$.
#### Paso 2
$A_2$ contiene `mover(A,B)`, `mover(B,A)`, `mover(B,C)` y `cargar(B)`. Los literales nuevos son `en(c,C)` y `dentro(p)`. $P_2 = P_1 \cup \{$`en(c,C)`, `dentro(p)`$\}$.
#### Paso 3
$A_3$ añade `mover(C,B)`, `descargar(A)`, `descargar(B)` y `descargar(C)`. Los literales nuevos son `en(p,A)` y `en(p,C)`. `en(p,B)` ya estaba. $P_3 = P_2 \cup \{$`en(p,A)`, `en(p,C)`$\}$ y contiene la meta, así que se para.
#### Paso 4
Niveles de aparición:

| Literal | Nivel |
|---|---|
| `en(c,A)`, `en(p,B)` | 0 |
| `en(c,B)` | 1 |
| `en(c,C)`, `dentro(p)` | 2 |
| `en(p,A)`, `en(p,C)` | 3 |

Por tanto, $h(\text{`en(p,C)`}) = 3$ y $h(\text{`en(c,C)`}) = 2$.
#### Paso 5
$h_{max}(G) = \max(3, 2) = 3$ y $h_{sum}(G) = 3 + 2 = 5$.
#### Paso 6
Plan relajado, hacia atrás. `en(p,C)` (nivel 3) se logra con `descargar(C)`, cuyas precondiciones son `en(c,C)` y `dentro(p)`, ambas de nivel 2. `en(c,C)` ya era meta, y se logra con `mover(B,C)` (precondición `en(c,B)`, nivel 1). `dentro(p)` se logra con `cargar(B)` (precondiciones `en(c,B)`, nivel 1, y `en(p,B)`, nivel 0). `en(c,B)` se necesita dos veces y se logra una sola vez con `mover(A,B)`, que tiene `en(c,A)` en el nivel 0.
#### Paso 7
El plan relajado es $\{$`mover(A,B)`, `cargar(B)`, `mover(B,C)`, `descargar(C)`$\}$ y la heurística vale 4. Se cumple $h_{max} = 3 \le 4 \le h_{sum} = 5$.
#### Paso 8
$h_{sum}$ sobreestima en una unidad. Cuenta dos veces `mover(A,B)`, porque es la acción del nivel 1 en el camino de `en(c,C)` y también en el de `en(p,C)`. En cambio solo suma un nivel por meta, de modo que no ve que en el nivel 2 hacen falta dos acciones distintas, `cargar(B)` y `mover(B,C)`. Por eso da 5 frente a las 4 acciones del plan relajado. Aquí el plan relajado es además ejecutable y óptimo en el problema real, siempre que se ejecute en el orden `mover(A,B)`, `cargar(B)`, `mover(B,C)`, `descargar(C)`: `mover(B,C)` borra `en(c,B)`, que `cargar(B)` necesita antes. Ese orden lleva el paquete a C con el camión en C.
