# PIN U3 - Planificación en el espacio de planes

## 1. Motivación

### ¿Qué defecto de la búsqueda en el espacio de estados corrige la planificación en el espacio de planes?
En el espacio de estados se pueden probar muchas ordenaciones distintas de las mismas acciones antes de descubrir que no hay solución. Cada ordenación es una rama aparte aunque las acciones sean las mismas. La planificación en el espacio de planes evita decidir el orden hasta que hace falta.

### ¿Qué es una estrategia de mínimo compromiso en planificación?
No fijar ordenaciones ni instanciaciones de variables hasta que sean necesarias. Un plan parcial deja abiertas todas las decisiones que todavía no hacen falta.

### ¿Qué diferencia hay entre el orden en que se planifica en el espacio de estados y en el espacio de planes?
En el espacio de estados las acciones se planifican en el mismo orden en que se ejecutarán, de modo que el plan es secuencial (orden total). En el espacio de planes no hay compromiso con un orden concreto, así que el plan puede tener acciones en paralelo. Por eso se llama planificación de orden parcial (POP).

## 2. Estructura de un plan parcial

### ¿Qué es un plan parcial?
Un grafo de acciones formado por pasos y restricciones entre ellos. Los pasos son operadores total o parcialmente instanciados, y las restricciones dicen qué orden y qué ligaduras de variables se han decidido ya.

### ¿Qué representan los pasos Start y Finish de un plan parcial?
Start es un paso sin precondiciones cuyos efectos son el estado inicial. Finish es un paso sin efectos cuyas precondiciones son los objetivos del problema. Gracias a ellos, el estado inicial y la meta se tratan como una acción más.

### ¿Qué tres tipos de restricciones puede haber entre los pasos de un plan parcial?
Los enlaces causales, las restricciones de precedencia y las restricciones de ligadura. Los tres se añaden poco a poco al refinar el plan.

### ¿Qué significa el enlace causal $\langle a, p, b \rangle$?
El paso $a$ se usa para establecer la precondición $p$ del paso $b$. Implica que $a$ añade $p$, que $a$ va antes que $b$ y que nadie debe borrar $p$ entre ambos.

### ¿Qué hace una restricción de precedencia $a < b$?
Obliga a que el paso $a$ se ejecute antes que el paso $b$. No dice que sean consecutivos, solo que $a$ va antes en cualquier orden total del plan.

### ¿Qué clases de restricciones de ligadura hay?
De desigualdad ($v_1 \neq v_2$ o $v \neq c$) y de igualdad o sustitución ($v_1 = v_2$ o $v = c$). Fijan cómo se instancian las variables de los operadores.

### ¿Qué es refinar un plan parcial?
Escoger un fallo del plan y ramificar por todas las formas de resolverlo. Cada forma de resolverlo da un plan parcial nuevo más completo.

### ¿Qué tres tipos de fallo puede tener un plan parcial?
Un subobjetivo pendiente (open goal) sin resolver, una variable sin instanciar (fallo de ligadura) y una amenaza sobre un enlace causal. Cuando no queda ninguno, el plan es una solución.

### ¿Cuándo es solución un plan parcial?
Cuando no tiene ningún fallo: ningún subobjetivo pendiente, ninguna amenaza y ninguna variable por instanciar. Entonces cualquier orden total compatible con las restricciones consigue la meta.

### ¿Cuándo está completo un plan parcial y cuándo está lograda una precondición?
Un plan está completo si todas sus precondiciones están logradas. Una precondición está lograda si es efecto de un paso anterior y ningún paso que pueda quedar entre medias la deshace.

### ¿Qué es un subobjetivo pendiente?
Una precondición $p$ de un paso $a$ para la cual todavía no se ha decidido qué paso la establece. Las precondiciones de Finish y de cada paso nuevo entran en la agenda como subobjetivos pendientes.

### ¿Cómo se resuelve un subobjetivo pendiente $p$ del paso $a$?
Se busca un paso $b$ que produzca $p$ y pueda ir antes que $a$. Puede ser un paso que ya está en el plan o un paso nuevo, incluido Start. Se instancian las variables si hace falta y se crea el enlace causal $\langle b, p, a \rangle$ con la precedencia $b < a$.

### ¿Qué ocurre con las precondiciones de un paso que se añade para resolver un subobjetivo pendiente?
Entran en la agenda como nuevos subobjetivos pendientes. Por eso, añadir un paso resuelve un fallo pero suele crear otros.

### ¿Qué es una amenaza sobre un enlace causal?
Una interacción de condición borrada. Dado el enlace $\langle a, p, b \rangle$, un tercer paso $c$ lo amenaza si uno de sus efectos borra $p$ y el orden actual permite que $c$ caiga entre $a$ y $b$.

### ¿Cuáles son las tres condiciones para que $c$ amenace el enlace $\langle a, p, b \rangle$?
1. $c$ es distinto de $a$ y de $b$ y tiene un efecto que borra $p$.
2. El orden actual no obliga a $c$ a ir antes de $a$.
3. El orden actual no obliga a $c$ a ir después de $b$.

Si se cumplen las tres, $c$ puede quedar entre $a$ y $b$.

### ¿Un paso que añade $p$ amenaza el enlace $\langle a, p, b \rangle$?
No. Solo amenaza quien borra $p$. Un paso que vuelve a añadir $p$ no estropea el enlace.

### ¿Qué tres maneras hay de resolver una amenaza de $c$ sobre $\langle a, p, b \rangle$?
Promoción ($c < a$), democión ($b < c$) y separación (restringir variables para que $c$ no borre $p$). La separación solo existe si el paso tiene variables.

### ¿Qué ordenación impone la promoción y cuál la democión?
La promoción pone la amenaza antes del productor: $c < a$. La democión la pone después del consumidor: $b < c$.

### ¿Por qué no se puede resolver por promoción una amenaza sobre un enlace que sale de Start?
Porque la promoción exige $c < \text{Start}$ y Start va antes que todos los demás pasos. Solo queda la democión. De forma simétrica, si el consumidor es Finish no cabe la democión, porque nada puede ir después de Finish.

### ¿Qué pasa si una amenaza no tiene ni promoción ni democión ni separación posibles?
Ese plan parcial es un callejón sin salida. El planificador lo descarta y vuelve atrás a la decisión anterior para probar otro resolutor.

### ¿Cómo se resuelve por separación la amenaza de `clobber(y)`, que borra $pq(y)$, sobre el enlace $\langle foo(x), pq(x), baz(x) \rangle$?
Con la restricción de desigualdad $x \neq y$. Así `clobber(y)` no borra $pq(x)$ y la amenaza desaparece sin imponer ningún orden.

### ¿Por qué hay que volver a buscar amenazas cada vez que se añade un paso o un enlace?
Porque un paso nuevo puede borrar condiciones de enlaces que ya existían, y un enlace nuevo puede estar amenazado por pasos que ya estaban. Una amenaza resuelta en el nodo anterior no garantiza que el nuevo plan esté libre de ellas.

### ¿Cuántos órdenes totales válidos tiene un plan con los pasos $A$, $B$, $C$ si solo se exige $A < C$ y $B < C$?
Dos: $A\,B\,C$ y $B\,A\,C$. Un plan parcial representa a la vez todas sus linearizaciones, y cualquiera de ellas ejecuta la meta.

### Problema: reconoce los fallos de un plan parcial del robot de una mano
Dominio del robot con una mano y dos piezas $P$ y $Q$. Las acciones son:

| Acción | Precondición | Efectos |
|---|---|---|
| Coger(x) | mano-libre | en-mano(x), no mano-libre |
| Soltar(x) | en-mano(x) | mano-libre, no en-mano(x) |
| Taladrar(x) | en-mano(x) | taladrada(x) |

Estado inicial: mano-libre. Meta: taladrada(P) y taladrada(Q).

Plan parcial actual, con $x$ tomando los valores $P$ y $Q$:

- Pasos: Start, Coger(P), Taladrar(P), Coger(Q), Taladrar(Q), Finish.
- Orden: Start < Coger(x) < Taladrar(x) < Finish para cada pieza $x$.
- Enlaces causales: $\langle \text{Start}, \text{mano-libre}, \text{Coger(P)} \rangle$, $\langle \text{Coger(x)}, \text{en-mano(x)}, \text{Taladrar(x)} \rangle$ y $\langle \text{Taladrar(x)}, \text{taladrada(x)}, \text{Finish} \rangle$.

Contesta:
1. ¿Qué subobjetivos están pendientes?
2. ¿Qué amenazas hay ya?
3. ¿Cómo se resuelven?
4. ¿Qué opciones hay para el subobjetivo pendiente, y cuál sirve?

#### Paso 1
Subobjetivos pendientes. Coger(P) ya tiene su mano-libre desde Start. Las demás precondiciones y las dos del Finish tienen enlace. Solo queda sin enlace la precondición mano-libre de Coger(Q). Hay un único subobjetivo pendiente.

#### Paso 2
Amenazas. Coger(Q) borra mano-libre. El enlace $\langle \text{Start}, \text{mano-libre}, \text{Coger(P)} \rangle$ pasa por esa condición. Coger(Q) está después de Start y no está ordenado con Coger(P), de modo que puede caer entre ambos. Es una amenaza. Ningún otro paso borra algo que esté en un enlace.

#### Paso 3
Resolución de la amenaza. La promoción exigiría Coger(Q) < Start, que es imposible. Queda la democión: Coger(P) < Coger(Q). Se añade esa precedencia. Se comprueba que el orden sigue siendo consistente.

#### Paso 4
Opciones para mano-libre de Coger(Q). Pueden producirlo Start o un Soltar nuevo, de P o de Q.

- Start: el enlace $\langle \text{Start}, \text{mano-libre}, \text{Coger(Q)} \rangle$ queda amenazado por Coger(P), que ahora va entre Start y Coger(Q) y borra mano-libre. No hay promoción ni democión. Callejón sin salida.
- Soltar(Q): necesita en-mano(Q), que solo da Coger(Q) con un enlace que obliga a Coger(Q) < Soltar(Q). Pero Soltar(Q) también debe ir antes que Coger(Q) para darle mano-libre. Es un ciclo y se descarta. Un Coger(Q) adicional pediría otro mano-libre y repetiría el mismo problema.
- Soltar(P): es la opción correcta. Se crea el enlace $\langle \text{Soltar(P)}, \text{mano-libre}, \text{Coger(Q)} \rangle$.

#### Paso 5
Se termina con Soltar(P). Su precondición en-mano(P) se enlaza con Coger(P), así que Coger(P) < Soltar(P). Soltar(P) borra en-mano(P), que está en el enlace $\langle \text{Coger(P)}, \text{en-mano(P)}, \text{Taladrar(P)} \rangle$. La promoción exigiría Soltar(P) < Coger(P), que es imposible. Se aplica la democión: Taladrar(P) < Soltar(P).

El plan final es Coger(P), Taladrar(P), Soltar(P), Coger(Q), Taladrar(Q), todo en orden total.

### Problema: diagnostica tres planes parciales del dominio café y té
Dominio con las acciones HacerCafé (precondición agua, efectos café y no agua), HacerTé (precondición agua, efectos té y no agua) y Llenar (sin precondición, efecto agua). Estado inicial: agua. Meta: café y té.

Para cada plan, indica cuál es el defecto y si tiene arreglo:

- Plan A: contiene el enlace $\langle \text{HacerTé}, \text{agua}, \text{HacerCafé} \rangle$.
- Plan B: tiene las precedencias HacerCafé < Llenar, Llenar < HacerTé y HacerTé < HacerCafé.
- Plan C: tiene los enlaces $\langle \text{Start}, \text{agua}, \text{HacerCafé} \rangle$ y $\langle \text{Start}, \text{agua}, \text{HacerTé} \rangle$, y HacerCafé y HacerTé no están ordenados entre sí.

#### Paso 1
Plan A. El enlace es inválido, porque HacerTé no produce agua, sino que la borra. Ningún refinamiento lo arregla. Hay que eliminar el enlace y buscar el productor de agua entre Start y Llenar.

#### Paso 2
Plan B. Las tres precedencias forman un ciclo, así que el conjunto de restricciones es inconsistente y ningún orden total las cumple. El plan no se puede refinar y se descarta.

#### Paso 3
Plan C. HacerTé borra agua y puede caer entre Start y HacerCafé. Simétricamente, HacerCafé borra agua y puede caer entre Start y HacerTé. Para el primer enlace hace falta HacerCafé < HacerTé y para el segundo, HacerTé < HacerCafé. Las promociones son imposibles porque el productor es Start. Las dos demociones son contradictorias, así que el plan es un callejón sin salida. Solo se arregla en otra rama, donde uno de los dos pasos reciba agua de un Llenar nuevo.

## 3. Árbol POP (búsqueda en el espacio de planes)

### ¿Qué es un nodo del árbol de búsqueda POP?
Un plan parcial, es decir, un conjunto de acciones parcialmente instanciadas más sus restricciones. La raíz es el plan inicial, con solo Start y Finish.

### ¿En qué dirección busca un planificador POP?
Hacia atrás desde la meta. Parte de las precondiciones de Finish y va añadiendo pasos que las producen. Cada refinamiento acerca el plan a uno sin fallos.

### ¿Por qué el espacio de búsqueda de POP es un árbol Y/O?
Los fallos de un plan forman las ramas Y: hay que resolverlos todos. Los resolutores de un fallo concreto son las ramas O: basta con que uno lleve a una solución. Cada resolutor genera un plan parcial distinto.

### ¿Qué decisión es un punto de retroceso en POP, elegir el fallo o elegir el resolutor?
Elegir el resolutor, porque hay que probar los distintos y volver atrás si falla. El fallo se elige sin retroceso, ya que todos acabarán resueltos en cualquier solución.

### ¿Qué significa serializar el árbol Y/O?
Convertirlo en un árbol de espacio de planes decidiendo qué fallo se expande ahora. En cada rama Y se elige un hijo que se expande primero y se retrasa el resto.

### ¿Por qué da lo mismo, para la corrección, el fallo que se elige primero?
Porque todos los fallos se deben resolver. Cambia el tamaño del árbol serializado, no el conjunto de soluciones. Por eso la elección del fallo es solo una cuestión de eficiencia.

## 4. El procedimiento PSP

### ¿Cuál es la idea del procedimiento PSP (Plan-Space Planning)?
Mientras el plan tenga fallos, elige uno, calcula sus resolutores, escoge uno de forma no determinista y refina el plan con él. Si el plan no tiene fallos, lo devuelve. Si un fallo no tiene resolutores, devuelve fallo y se retrocede.

### ¿Qué dos conjuntos de fallos se calculan en cada llamada a PSP?
Los subobjetivos pendientes (open goals) y las amenazas. Se unen en una sola agenda de la que se elige el fallo a resolver. El pseudocódigo de las transparencias solo calcula estos dos conjuntos, aunque en otra transparencia también se cuenta como fallo una variable sin instanciar.

### ¿Qué garantías da PSP?
Es correcto y completo. Devuelve un plan de orden parcial, de modo que cualquier orden total suyo consigue la meta y las acciones sin orden se pueden ejecutar en paralelo si el entorno lo permite.

### ¿Cuál es el plan inicial de PSP?
Un plan con solo los pasos Start y Finish, con Start < Finish y sin enlaces causales. Su agenda contiene un subobjetivo pendiente por cada precondición de Finish.

### ¿Cuántos resolutores hay para una amenaza sobre un enlace con productor y consumidor ordinarios?
Hasta tres: promoción, democión y separación (esta última si hay variables). Cada uno que no contradiga el orden actual da un plan nuevo.

### Problema: ejecuta a mano PSP en el dominio café y té
Dominio: HacerCafé (precondición agua, efectos café y no agua), HacerTé (precondición agua, efectos té y no agua) y Llenar (sin precondición, efecto agua). Estado inicial: agua. Meta: café y té.

Aplica PSP. Las amenazas se resuelven en cuanto aparecen y, entre los subobjetivos pendientes, se resuelve el más antiguo. Cuando un fallo se pueda resolver de varias formas, prueba primero Start. Anota la agenda, los enlaces causales, las amenazas y su resolución.

#### Paso 1
Plan inicial. Pasos: Start (efecto agua) y Finish (precondiciones café y té). Orden: Start < Finish. Agenda: café de Finish y té de Finish.

#### Paso 2
Se resuelve café. Solo HacerCafé lo produce, así que se añade ese paso. Enlace $\langle \text{HacerCafé}, \text{café}, \text{Finish} \rangle$ y orden Start < HacerCafé < Finish. Agenda: té de Finish y agua de HacerCafé.

Se resuelve té con HacerTé de la misma forma. Enlace $\langle \text{HacerTé}, \text{té}, \text{Finish} \rangle$. Agenda: agua de HacerCafé y agua de HacerTé. Todavía no hay amenazas.

#### Paso 3
Agua de HacerCafé. Pueden producirla Start o un Llenar nuevo. Se prueba Start y se crea $\langle \text{Start}, \text{agua}, \text{HacerCafé} \rangle$. HacerTé borra agua y no está ordenado con HacerCafé, así que puede caer entre ambos: hay una amenaza.

Resolutores: la promoción HacerTé < Start es imposible, y la democión es HacerCafé < HacerTé. Se añade esa precedencia.

#### Paso 4
Agua de HacerTé, primera opción con Start: el enlace $\langle \text{Start}, \text{agua}, \text{HacerTé} \rangle$. Ahora HacerCafé está entre Start y HacerTé y borra agua. La promoción HacerCafé < Start es imposible y la democión HacerTé < HacerCafé contradice la precedencia del paso 3. La rama no tiene solución y se vuelve atrás.

#### Paso 5
Agua de HacerTé, segunda opción: un Llenar nuevo, con Start < Llenar < HacerTé y el enlace $\langle \text{Llenar}, \text{agua}, \text{HacerTé} \rangle$. Llenar no tiene precondiciones, así que no aparecen subobjetivos nuevos.

HacerCafé borra agua y no está ordenado con Llenar, de modo que amenaza el enlace nuevo. La democión HacerTé < HacerCafé contradice HacerCafé < HacerTé. La promoción HacerCafé < Llenar es consistente y se aplica.

#### Paso 6
La agenda está vacía. Orden final: Start < HacerCafé < Llenar < HacerTé < Finish. Es un orden total, solo hay una linearización.

Comprobación sobre los estados: Start da agua. HacerCafé gasta el agua y da café. Llenar repone el agua. HacerTé gasta el agua y da té. Al final hay café y té, que es la meta.

## 5. Ejemplo de transporte

### ¿Cuál es el problema de transporte que sirve de ejemplo de planificación en el espacio de planes?
Un camión t1 y un paquete p1. Estado inicial: (at p1 cA) y (at t1 cA). Meta: (at p1 cB). Operadores: `unload p1 ?tr cB` (precondiciones (at ?tr cB) e (in p1 ?tr), efectos (at p1 cB) y no (in p1 ?tr)), `load p1 t1 ?city` (precondiciones (at t1 ?city) y (at p1 ?city), efectos (in p1 t1) y no (at p1 ?city)) y `move t1 ?c cB` (precondición (at t1 ?c), efectos (at t1 cB) y no (at t1 ?c)).

### En el ejemplo de transporte, ¿por qué al añadir `unload p1 ?tr cB` aparece una variable pendiente?
Porque el camión es una variable del operador sin instanciar. El plan tiene un fallo de ligadura: hay que fijar `?tr`. Como en el ejemplo solo hay un camión, `t1`, el fallo se resuelve con `?tr = t1`.

### ¿Qué dos subobjetivos pendientes aparecen al instanciar `unload p1 t1 cB`?
(at t1 cB) e (in p1 t1), que son sus precondiciones. El paquete tiene que estar dentro del camión y el camión tiene que estar en cB.

### ¿Qué operador puede producir (in p1 t1) en el ejemplo?
Solo `load p1 t1 ?city`, porque ni Start ni otro paso lo dan. Al añadirlo aparece la variable `?city`, que puede valer cA o cB.

### ¿Cómo se resuelve el subobjetivo (at t1 cA) de `load p1 t1 cA` en el ejemplo?
De dos formas, que dan dos nodos hermanos: con el paso Start, que ya lo da, o con un paso nuevo `move t1 ?city3 cA`. En el ejemplo se exploran las dos.

### ¿Qué amenaza aparece cuando se usa `move t1 cA cB` en el ejemplo?
`move t1 cA cB` borra (at t1 cA), que `load p1 t1 cA` recibe de Start. El movimiento puede quedar entre ambos pasos y deshacer la condición.

### ¿Cómo se resuelve esa amenaza y por qué solo hay una opción?
Con democión: `load` antes que `move`. La promoción exigiría que `move` fuera antes que Start, lo cual es imposible. Una vez cargado el paquete, el camión ya puede irse.

## 6. POP y la anomalía de Sussman

### ¿Qué es la anomalía de Sussman?
Un problema de bloques con dos metas, A sobre B y B sobre C, empezando con C sobre A y B en la mesa. Un planificador que resuelve un objetivo y luego el otro, con orden fijo, acaba deshaciendo el primero para conseguir el segundo.

### ¿Por qué un planificador de espacio de estados sufre con Sussman?
Porque tiene que comprometer el orden en que atiende las metas. Si empieza por A sobre B, tiene que desmontarlo para poner B sobre C. Si empieza por poner B sobre C tal como está, A queda enterrada bajo la torre. Los dos órdenes obligan a rehacer trabajo.

### ¿Cómo evita POP el problema de Sussman?
Con mínimo compromiso. Construye los pasos de cada meta por separado, sin ordenarlos entre sí, y solo ordena cuando un enlace causal o una amenaza lo exige. El orden correcto sale de resolver esos fallos y no de adivinarlo de antemano.

### En el ejercicio de Sussman con POP, ¿qué pasos quedan en el plan para conseguir la meta?
Quitar C de encima de A y dejarlo en la mesa, coger B y ponerlo sobre C, y coger A y ponerlo sobre B. Los pasos de B quedan antes que los de A.

### En la anomalía de Sussman con POP, ¿por qué `stack A B` tiene que ir después de `stack B C`?
Operadores: `pickup x` (precondiciones handempty, clear x y ontable x, efectos holding x y borra handempty, ontable x y clear x) y `stack x y` (precondiciones holding x y clear y, efectos on x y, clear x y handempty, y borra holding x y clear y). `stack A B` borra clear B, que `pickup B` necesita de Start, así que `pickup B` va antes que `stack A B`. Entonces Start ya no puede dar clear B a `stack A B`, porque `pickup B` lo borraría entre medias y no hay ni promoción ni democión. La otra fuente es `stack B C`, que añade clear B, y su enlace causal fuerza `stack B C` antes que `stack A B`.

### Problema: analiza el plan parcial de la anomalía de Sussman
Estado inicial: clear C, clear B, on C A, handempty, ontable A y ontable B. Meta: on A B y on B C. Operadores: `pickup x` (precondiciones handempty, clear x y ontable x, efectos holding x y borra handempty, ontable x y clear x) y `stack x y` (precondiciones holding x y clear y, efectos on x y, clear x y handempty, y borra holding x y clear y). El plan parcial tiene los pasos Start, `pickup A`, `stack A B`, `pickup B`, `stack B C` y Finish, con las precedencias `pickup A` < `stack A B`, `pickup B` < `stack B C`, y todos entre Start y Finish. Contesta: 1. Escribe los enlaces causales. 2. ¿Qué subobjetivos están pendientes? 3. ¿Qué opciones hay para clear B de `pickup B`? 4. ¿Hay alguna amenaza una vez resuelto ese subobjetivo? 5. ¿Cómo se resuelve?

#### Paso 1
Enlaces causales (los cinco ya establecidos): $\langle \text{Start}, \text{ontable A}, \text{pickup A} \rangle$, $\langle \text{pickup A}, \text{holding A}, \text{stack A B} \rangle$, $\langle \text{pickup B}, \text{holding B}, \text{stack B C} \rangle$, $\langle \text{stack A B}, \text{on A B}, \text{Finish} \rangle$ y $\langle \text{stack B C}, \text{on B C}, \text{Finish} \rangle$.

#### Paso 2
Subobjetivos pendientes, uno por precondición sin enlace: handempty y clear A de `pickup A`, clear B de `stack A B`, handempty, clear B y ontable B de `pickup B`, y clear C de `stack B C`. Son siete.

#### Paso 3
Opciones para clear B de `pickup B`. Start lo da. `stack B C` también lo añade, pero su enlace obliga a `pickup B` < `stack B C`, así que un enlace desde él cerraría un ciclo y se descarta. Cualquier paso nuevo que añada clear B (`putdown B` o un `stack B z`) necesita holding B, que solo da `pickup B`, y también cierra ese ciclo. Se elige Start y se crea $\langle \text{Start}, \text{clear B}, \text{pickup B} \rangle$.

#### Paso 4
Amenazas. `stack A B` borra clear B y no está ordenado con `pickup B`, de modo que puede caer entre Start y `pickup B`. Es la única amenaza: `pickup A` borra clear A y ontable A, pero ningún enlace usa clear A, y el enlace de ontable A termina en el propio `pickup A`.

#### Paso 5
Resolución. La promoción exigiría `stack A B` < Start, que es imposible. Queda la democión: `pickup B` < `stack A B`. No hay separación, porque no hay variables. Consecuencia: clear B de `stack A B` ya no puede venir de Start, porque `pickup B` lo borraría entre medias y no habría ni promoción ni democión. La fuente es `stack B C`, que añade clear B, y obliga a `stack B C` < `stack A B`.

## 7. Resumen

### ¿Por qué no sirve la detección de bucles de la búsqueda de estados en un plan parcial?
Porque se basa en reconocer estados ya vistos, y en un plan parcial no se conocen los estados, ya que el orden no está fijado.

### ¿Se puede podar un plan parcial por repetir la misma acción?
No. A veces la misma acción hace falta varias veces en distintos estados del mundo, como ir de b a a y volver. Podar por repetición perdería soluciones.

### ¿Qué problema queda abierto en PSP según el resumen?
Cómo podar los caminos infinitos. Sin estados no hay detección de bucles, y repetir una acción no es motivo suficiente de poda. Hacen falta buenos heurísticos para elegir fallos y resolutores.

## 8. Heurísticas en planificación en el espacio de planes

### ¿Por qué importa en qué orden se resuelven los fallos?
Porque distintas estrategias dan árboles serializados de distinto tamaño. En el peor caso el planificador recorre todo el árbol, así que cuanto más pequeño sea, más eficiente es.

### ¿Cuál es el factor de ramificación efectivo de PSP para un objetivo?
$B_g = B \cdot m^a$, con $B$ resolutores del objetivo, $a$ amenazas en cada plan resultante y $m$ resolutores por amenaza.

### Calcula $B_g$ para un objetivo con 2 resolutores, 2 amenazas en cada plan y 2 resolutores por amenaza.
$B_g = 2 \cdot 2^2 = 8$. Cada resolutor del objetivo genera planes con amenazas, y cada amenaza se multiplica por sus resolutores.

### ¿Por qué PSP necesita buenos heurísticos de selección?
Porque con $n$ pasos y $p$ precondiciones por paso la complejidad en tiempo es exponencial, del orden de $B_g$ elevado a $n p$. Sin heurísticos de fallos y resolutores solo sería eficiente en problemas muy pequeños.

### ¿Qué es la heurística Fewest Alternatives First (FAF)?
Elegir el fallo que tiene menos resolutores. Con pocos resolutores se ramifica menos, y un fallo sin resolutores corta la rama de inmediato.

### ¿Qué otras heurísticas de selección de fallos nombra la asignatura además de FAF?
LIFO (el último fallo generado primero), retrasar las amenazas potenciales y ZLIFO. Retrasar las amenazas potenciales evita fijar un orden que luego puede resultar innecesario.

### ¿Qué criterio general se usa para elegir el resolutor?
Elegir el plan parcial de menor coste con un algoritmo A*, con $f(\pi) = g(\pi) + h(\pi)$. Aquí $g$ es el coste desde el plan inicial hasta $\pi$ y $h$ estima el coste que falta hasta un plan solución.

### ¿Qué elementos de un plan $\pi$ pueden entrar en $f = g + h$?
El número de pasos $N(\pi)$, el número de subobjetivos pendientes $OP(\pi)$ y el número de amenazas $T(\pi)$. Lo habitual es $f(\pi) = N(\pi) + OP(\pi)$.

### ¿Garantiza $f = N + OP$ una solución óptima?
No, porque $OP$ no es admisible. Un subobjetivo pendiente se puede cerrar sin pasos nuevos, por ejemplo con Start, y un solo paso nuevo puede cerrar varios a la vez. En ambos casos $OP$ sobreestima lo que falta.

### Problema: resuelve con FAF el dominio de la mano del robot
Una pieza $P$ y tres acciones: Coger (precondición mano-libre, efectos en-mano y no mano-libre), Taladrar (precondición en-mano, efecto taladrada) y Soltar (precondición en-mano, efectos mano-libre y no en-mano). Estado inicial: mano-libre. Meta: taladrada y mano-libre.

Resuelve con POP eligiendo en cada paso el fallo con menos alternativas. Si hay empate, el más antiguo. Cuenta como alternativa cada paso distinto que produce el literal, y el paso ya existente cuenta como una. En una amenaza, cada resolutor que no contradice el orden actual cuenta como una alternativa.

#### Paso 1
Agenda inicial: taladrada de Finish, con una alternativa (Taladrar), y mano-libre de Finish, con dos (Start y Soltar). FAF elige taladrada. Se añade Taladrar con el enlace $\langle \text{Taladrar}, \text{taladrada}, \text{Finish} \rangle$.

#### Paso 2
Agenda: mano-libre de Finish (2 alternativas) y en-mano de Taladrar (1, Coger). FAF elige en-mano. Se añade Coger con el enlace $\langle \text{Coger}, \text{en-mano}, \text{Taladrar} \rangle$ y orden Coger < Taladrar.

#### Paso 3
Agenda: mano-libre de Finish (Start o Soltar, 2) y mano-libre de Coger (Start o Soltar, 2). Hay empate y se elige el más antiguo, mano-libre de Finish.

Primera opción, Start, con $\langle \text{Start}, \text{mano-libre}, \text{Finish} \rangle$. Coger borra mano-libre y está entre Start y Finish. La promoción es imposible porque el productor es Start, y la democión es imposible porque el consumidor es Finish. Callejón sin salida, se vuelve atrás.

Segunda opción, un Soltar nuevo, con $\langle \text{Soltar}, \text{mano-libre}, \text{Finish} \rangle$. Su precondición en-mano entra en la agenda. Además, Soltar borra en-mano y todavía puede caer entre Coger y Taladrar, así que amenaza el enlace del paso 2. Por otro lado, Coger borra mano-libre y puede caer entre Soltar y Finish, así que amenaza el enlace $\langle \text{Soltar}, \text{mano-libre}, \text{Finish} \rangle$.

#### Paso 4
Agenda: en-mano de Soltar (1, Coger), mano-libre de Coger (2), la amenaza de Soltar sobre el enlace de Taladrar (2, promoción o democión) y la amenaza de Coger sobre el enlace de Finish (1, solo la promoción Coger < Soltar, porque la democión exigiría Finish < Coger). Hay empate entre en-mano de Soltar y la amenaza de Coger, y se elige el más antiguo, en-mano de Soltar. Se crea $\langle \text{Coger}, \text{en-mano}, \text{Soltar} \rangle$ con Coger < Soltar. Esa precedencia deja resuelta también la amenaza de Coger sobre el enlace de Finish.

#### Paso 5
Ahora mano-libre de Coger solo tiene una alternativa, porque Soltar va después de Coger y no puede producirlo. La amenaza también tiene una, porque la promoción Soltar < Coger contradice Coger < Soltar. Hay empate y se resuelve primero el más antiguo, mano-libre de Coger, con $\langle \text{Start}, \text{mano-libre}, \text{Coger} \rangle$. Nadie borra mano-libre entre Start y Coger.

Después se resuelve la amenaza con la democión: Taladrar < Soltar.

Plan final: Coger < Taladrar < Soltar, un único orden total. La mano acaba libre y la pieza taladrada.
