# PIN U2 - Representación y PDDL

## 1. Por qué representar los estados con rasgos

### ¿Por qué no se enumeran explícitamente los estados s0, s1, s2... de un problema de planificación?
Porque en casi cualquier problema hay demasiados. Cada estado se describe con rasgos, es decir, con un vector de valores de variables o con un conjunto de átomos base de un lenguaje de primer orden.

### ¿Qué hay que dar como entrada para que un planificador genere todos los estados necesarios?
Solo el estado inicial y un conjunto de operadores. Los demás estados se generan aplicando operadores cuando hacen falta.

## 2. Representación clásica

### ¿Qué ocho supuestos restrictivos exige la planificación clásica?
Conjunto de estados finito, entorno totalmente observable, determinista y estático, objetivos de consecución, planes secuenciales, tiempo implícito y planificación offline. En las transparencias van de A0 a A7.

### ¿Qué restricción tiene el lenguaje de primer orden de la representación clásica?
No tiene símbolos de función. Solo hay un número finito de símbolos de predicado y de constante, y con ello el número de átomos base posibles es finito.

### ¿Qué diferencia hay entre una relación fija y una relación dinámica? Pon un ejemplo de cada una en el dominio de transporte (DWR).
Una relación fija nunca cambia durante el plan, como `adjacent(loc1,loc2)` o `belong(crane1,loc1)`. Una dinámica sí cambia, como `at(r1,loc2)` o `holding(crane1,c3)`. Ambas se escriben como átomos.

### ¿Cuándo una expresión es base (*ground*) y cuándo no lo es?
Es base si no contiene ningún símbolo de variable, como `in(c1,p3)`. Si tiene al menos una variable, como `in(c1,x)`, no es base.

### ¿Qué es una sustitución y qué es una instancia de una expresión?
Una sustitución $\theta = \{x_1 \leftarrow v_1, \dots, x_n \leftarrow v_n\}$ asigna un término a cada variable. La instancia de una expresión $e$ es el resultado de aplicarle $\theta$.

### ¿Por qué las variables de una sustitución se reemplazan a la vez y no una tras otra?
Porque un reemplazo secuencial puede contaminar el resultado. Con $\theta = \{x \leftarrow y, y \leftarrow c1\}$, la expresión `on(x,y)` da `on(y,c1)` de golpe. Si se hiciera en dos pasadas, el primer paso daría `on(y,y)` y el segundo `on(c1,c1)`.

### ¿Qué es un estado en la representación clásica?
Un conjunto de átomos base: los que son ciertos en ese estado. Como hay finitos átomos base, también hay finitos estados.

### Si el lenguaje tiene $n$ átomos base posibles, ¿cuántos estados distintos puede haber como máximo?
$2^n$, porque cada átomo está o no está en el conjunto. La mayoría no son alcanzables desde el estado inicial, pero el número es finito.

### ¿Qué es un literal y qué dos tipos hay?
Un átomo base, positivo o negado. Positivo, como `in(c1,p1)`, y negativo, como `¬occupied(loc1)`. En ambos casos representa algo que es cierto en el estado.

### ¿Qué significa escribir un estado solo con literales positivos?
Que se aplica negación por fallo: todo lo que no aparece en el estado es falso. Es el convenio de PDDL. Si el estado incluye también literales negativos, la información falsa se escribe de forma explícita.

## 3. Operadores y acciones

### ¿De qué tres partes consta un operador de planificación clásica?
Es una terna $o = (\text{name}(o), \text{precond}(o), \text{effects}(o))$. La precondición son los literales que deben ser ciertos para usarlo, y los efectos son los literales que el operador hace ciertos.

### ¿Qué forma tiene el nombre de un operador y por qué debe llevar todas las variables?
Tiene la forma $n(x_1, \dots, x_k)$, con $n$ único para cada operador y con todas las variables que aparecen en él. Así cada instancia se identifica sin ambigüedad, por ejemplo `take(crane1,loc1,c3,c1,p1)`.

### ¿Qué diferencia hay entre un operador y una acción?
Una acción es una instancia base de un operador, obtenida con una sustitución. El operador tiene variables, mientras que la acción tiene todos sus argumentos fijados.

### ¿Qué es un dominio de planificación?
Un lenguaje junto con un conjunto de operadores. Corresponde a un conjunto de sistemas de transiciones de estados, porque cada problema concreto, con sus objetos, instancia los mismos operadores y da un sistema distinto. El estado inicial no forma parte del dominio.

### ¿Qué significan $\text{precond}^+(a)$, $\text{precond}^-(a)$, $\text{effects}^+(a)$ y $\text{effects}^-(a)$?
Los átomos que aparecen en positivo y en negativo en la precondición, y los que aparecen en positivo y en negativo en los efectos. Por ejemplo, $\text{effects}^+(\text{take}(k,l,c,d,p)) = \{\text{holding}(k,c), \text{top}(d,p)\}$.

### ¿Cuándo es aplicable una acción $a$ en un estado $s$?
Cuando $\text{precond}^+(a) \subseteq s$ y $\text{precond}^-(a) \cap s = \emptyset$. Es decir, todos los átomos positivos de la precondición están en $s$ y ninguno de los negativos.

### ¿Cómo se calcula el estado que resulta de ejecutar una acción aplicable $a$ en $s$?
$$\gamma(s, a) = (s - \text{effects}^-(a)) \cup \text{effects}^+(a)$$
Se quitan los átomos de los efectos negativos y después se añaden los de los efectos positivos.

### Si un átomo está a la vez en $\text{effects}^+(a)$ y en $\text{effects}^-(a)$, ¿queda en el estado resultante?
Sí. La fórmula primero lo quita y después lo añade, de modo que gana el efecto positivo. Es una trampa típica de modelado, y conviene no escribir el mismo átomo en los dos sentidos.

### ¿Qué pasa con los átomos del estado que no aparecen en los efectos de la acción?
Se conservan sin cambios. Un operador solo describe lo que cambia, y todo lo demás queda igual en el estado nuevo.

### En el dominio DWR, ¿qué tres precondiciones tiene `move(r,l,m)` y qué papel tiene `¬occupied(m)`?
Exige `adjacent(l,m)`, `at(r,l)` y `¬occupied(m)`. La negativa impide que un robot entre en una localización donde ya hay otro robot.

### En DWR, ¿qué efectos tiene `move(r,l,m)`?
Añade `at(r,m)` y `occupied(m)`, y quita `at(r,l)` y `occupied(l)`. Los dos últimos efectos son los que mantienen coherente el predicado `occupied`.

### En DWR, ¿por qué `put(k,l,c,d,p)` tiene el efecto `¬top(d,p)`?
Porque tras apilar `c` sobre `d`, el contenedor de arriba de la pila ya es `c` y no `d`. Si `top(d,p)` siguiera en el estado, la pila tendría dos contenedores arriba y `take` o `put` darían resultados erróneos.

### En el DWR, si se quita la precondición `¬occupied(m)` de `move(r,l,m)` pero se dejan sus efectos, ¿qué estado incoherente puede aparecer?
Si dos robots comparten la localización `l`, cuando uno sale el efecto `¬occupied(l)` la marca como libre aunque el otro siga dentro. Por eso, para admitir varios robots, hay que quitar también los efectos `occupied(m)` y `¬occupied(l)`.

### En el dominio DWR, ¿por qué la precondición `¬top(c,p)`, con `c` como parámetro del operador, no sirve para decir que la pila `p` está vacía?
Porque `c` queda ligado a un contenedor concreto, de modo que solo afirma que ese contenedor no está arriba. Decir que ninguno lo está requeriría cuantificar sobre todos los contenedores, algo que una conjunción de literales no permite.

### Al modificar una precondición de un operador, ¿qué otros elementos del mismo operador hay que revisar y por qué?
Los efectos que mantienen los mismos predicados. Una precondición nueva con los efectos antiguos puede dejar estados incoherentes, como un `occupied` falso.

### ¿Qué precondiciones y efectos tienen `load(k,l,c,r)` y `unload(k,l,c,r)` en el DWR?
`load` tiene precondición `belong(k,l)`, `holding(k,c)`, `at(r,l)` y `unloaded(r)`, y efectos `empty(k)`, `¬holding(k,c)`, `loaded(r,c)` y `¬unloaded(r)`. `unload` es el inverso: precondición `belong(k,l)`, `at(r,l)`, `loaded(r,c)` y `empty(k)`, y efectos `¬empty(k)`, `holding(k,c)`, `unloaded(r)` y `¬loaded(r,c)`.

### ¿Qué precondiciones y efectos tiene `take(k,l,c,d,p)` en el DWR?
Precondición: `belong(k,l)`, `attached(p,l)`, `empty(k)`, `top(c,p)` y `on(c,d)`. Efectos: `holding(k,c)` y `top(d,p)`, y quita `empty(k)`, `in(c,p)`, `top(c,p)` y `on(c,d)`. Es el inverso de `put`.

### Problema: decidir qué acciones son aplicables en un estado del DWR y ejecutarlas
Sea el estado $s$ con tres localizaciones en fila, dos robots y una grúa:

`s = {adjacent(l1,l2), adjacent(l2,l1), adjacent(l2,l3), adjacent(l3,l2), belong(k1,l2), at(r1,l2), occupied(l2), unloaded(r1), at(r2,l3), occupied(l3), unloaded(r2), holding(k1,c5)}`

Usa los operadores `move` y `load` del DWR. Se pide (a) decir cuáles de estas acciones son aplicables en $s$: `move(r1,l2,l1)`, `move(r1,l2,l3)`, `move(r2,l3,l2)`, `load(k1,l2,c5,r1)` y `load(k1,l2,c5,r2)`. (b) Ejecutar `load(k1,l2,c5,r1)` y luego `move(r1,l2,l1)`. (c) Decidir si ese plan es solución para $g = \{\text{loaded}(r1,c5), \text{at}(r1,l1)\}$ y si lo sería con las dos acciones en orden contrario. Operadores: `move(r,l,m)` tiene precondición `adjacent(l,m)`, `at(r,l)` y `¬occupied(m)`, y efectos `at(r,m)`, `occupied(m)`, `¬occupied(l)` y `¬at(r,l)`. `load(k,l,c,r)` tiene precondición `belong(k,l)`, `holding(k,c)`, `at(r,l)` y `unloaded(r)`, y efectos `empty(k)`, `¬holding(k,c)`, `loaded(r,c)` y `¬unloaded(r)`.
#### Paso 1
Se comprueba cada acción contra $s$. Las precondiciones de `move(r,l,m)` son `adjacent(l,m)`, `at(r,l)` y `¬occupied(m)`, y las de `load(k,l,c,r)` son `belong(k,l)`, `holding(k,c)`, `at(r,l)` y `unloaded(r)`.

| Acción | Qué falla o qué se cumple | Aplicable |
|---|---|---|
| `move(r1,l2,l1)` | `adjacent(l2,l1)` y `at(r1,l2)` están en $s$, y `occupied(l1)` no está | sí |
| `move(r1,l2,l3)` | `occupied(l3)` está en $s$, así que $\text{precond}^- \cap s \neq \emptyset$ | no |
| `move(r2,l3,l2)` | `occupied(l2)` está en $s$ | no |
| `load(k1,l2,c5,r1)` | `belong(k1,l2)`, `holding(k1,c5)`, `at(r1,l2)` y `unloaded(r1)` están en $s$ | sí |
| `load(k1,l2,c5,r2)` | `at(r2,l2)` no está en $s$, porque r2 está en l3 | no |

#### Paso 2
Se ejecuta `load(k1,l2,c5,r1)`. Sus efectos negativos son `holding(k1,c5)` y `unloaded(r1)`, y los positivos son `empty(k1)` y `loaded(r1,c5)`. Se obtiene

`s1 = {adjacent(l1,l2), adjacent(l2,l1), adjacent(l2,l3), adjacent(l3,l2), belong(k1,l2), at(r1,l2), occupied(l2), at(r2,l3), occupied(l3), unloaded(r2), empty(k1), loaded(r1,c5)}`
#### Paso 3
`move(r1,l2,l1)` sigue siendo aplicable en $s_1$, porque `load` no toca `at(r1,l2)` ni `occupied(l1)`. Quita `at(r1,l2)` y `occupied(l2)`, y añade `at(r1,l1)` y `occupied(l1)`:

`s2 = {adjacent(l1,l2), adjacent(l2,l1), adjacent(l2,l3), adjacent(l3,l2), belong(k1,l2), at(r1,l1), occupied(l1), at(r2,l3), occupied(l3), unloaded(r2), empty(k1), loaded(r1,c5)}`

Ahora `move(r2,l3,l2)` sí es aplicable, porque `occupied(l2)` ha desaparecido. Una acción puede dejar de ser aplicable o pasar a serlo según lo que ejecutemos antes.
#### Paso 4
$g = \{\text{loaded}(r1,c5), \text{at}(r1,l1)\}$ está contenido en $s_2$, de modo que el plan `load` y `move` es ejecutable y alcanza $g$: es una solución. En el orden contrario, `move(r1,l2,l1)` deja a r1 en l1. Entonces `load(k1,l2,c5,r1)` exige `at(r1,l2)`, que ya no está en el estado, y el plan no es ejecutable. El orden importa.

## 4. Problemas, planes y soluciones

### ¿Qué es el enunciado de un problema de planificación clásica?
Una terna $P = (O, s_0, g)$: los operadores, el estado inicial y la fórmula objetivo $g$, que es un conjunto de literales.

### ¿Cómo se define un problema de planificación en función del sistema de transiciones?
Como $P=(\Sigma, s_0, S_g)$, con $\Sigma=(S,A,\gamma)$ el sistema de transiciones determinado por los operadores, $s_0$ el estado inicial y $S_g$ el conjunto de estados que satisfacen $g$. A menudo se dice "problema" para referirse al enunciado $P=(O,s_0,g)$.

### ¿Qué es un plan y cuándo es una solución?
Un plan es cualquier secuencia de acciones $a_1, \dots, a_n$, cada una instancia de un operador. Es solución si es ejecutable desde $s_0$ y el estado final satisface $g$.

### ¿Qué dos condiciones debe cumplir un plan para ser solución?
Que sea ejecutable, es decir, que cada acción sea aplicable en el estado donde se ejecuta, y que el último estado satisfaga el objetivo. Un plan puede fallar por cualquiera de las dos.

### ¿Por qué un problema de planificación clásica suele tener infinitas soluciones?
Porque se pueden añadir acciones que se anulan entre sí, como ir y volver con el robot, sin estropear la ejecución ni el objetivo. Cada una de esas variantes es otra solución.

### ¿Qué es un plan redundante, uno irredundante y uno mínimo?
Redundante es el que sigue siendo solución al quitarle algunas acciones. Irredundante es el que no admite quitar ninguna. Mínimo es el que no tiene ninguna solución más corta.

### ¿Un plan irredundante es siempre un plan mínimo?
No. Puede haber una ruta larga en la que no sobra ninguna acción y otra ruta corta que resuelve lo mismo. Por ejemplo, ir de una sala a otra dando un rodeo por tres salas es irredundante, pero ir directo es más corto.

### Problema: ejecutar un plan del mundo de bloques paso a paso y comprobar si es solución
Con el dominio de bloques en PDDL (`pickup`, `putdown`, `stack` y `unstack`, con los predicados `clear`, `on-table`, `arm-empty`, `holding` y `on`), el estado inicial es

`s0 = {on-table a, on-table b, on-table c, clear a, clear b, clear c, arm-empty}`

y el objetivo es `g = {on a b, on b c}`. Se pide ejecutar el plan `pickup(b)`, `stack(b,c)`, `pickup(a)`, `stack(a,b)` estado a estado y decir si es solución. Después, comprobar el plan `pickup(a)`, `stack(a,b)`, `pickup(b)`, `stack(b,c)`.
#### Paso 1
`pickup(b)` exige `clear b`, `on-table b` y `arm-empty`, que están en $s_0$. Quita `clear b`, `on-table b` y `arm-empty`, y añade `holding b`:

`s1 = {on-table a, on-table c, clear a, clear c, holding b}`

En PDDL los predicados se llaman `on-table` y `arm-empty`, mientras que la representación clásica usa `ontable` y `handempty`.
#### Paso 2
`stack(b,c)` exige `clear c` y `holding b`, que están en $s_1$. Quita `holding b` y `clear c`, y añade `clear b`, `arm-empty` y `on b c`:

`s2 = {on-table a, on-table c, clear a, clear b, arm-empty, on b c}`
#### Paso 3
`pickup(a)` exige `clear a`, `on-table a` y `arm-empty`, que están en $s_2$. Se llega a

`s3 = {on-table c, clear b, on b c, holding a}`
#### Paso 4
`stack(a,b)` exige `clear b` y `holding a`, que están en $s_3$. Quita `holding a` y `clear b`, y añade `clear a`, `arm-empty` y `on a b`:

`s4 = {on-table c, on b c, clear a, arm-empty, on a b}`

Como `on a b` y `on b c` están en $s_4$, el plan es ejecutable y alcanza $g$, es decir, es solución.
#### Paso 5
En el segundo plan, `pickup(a)` y `stack(a,b)` funcionan, pero después `clear b` ya no está en el estado, porque `stack(a,b)` lo quitó. Entonces `pickup(b)` no es aplicable y el plan no es ejecutable. La regla práctica es construir la torre empezando por abajo.

## 5. Representación de variables de estado

### ¿Cómo se representa lo que cambia y lo que no cambia en la representación de variables de estado?
Lo que no cambia sigue siendo un átomo, como `adjacent(loc1,loc2)`. Lo que cambia se convierte en una variable de estado con un valor, como un campo de un registro, por ejemplo `rloc(r1)=loc2` o `holding(crane1)=nil`.

### ¿Qué ventaja tiene que `rloc(r1)` sea una variable con un solo valor, frente a un predicado `at(r1,l)` por cada localización?
Un robot solo puede estar en una localización a la vez, y esa restricción queda incorporada: cambiar el valor sustituye al anterior. Con átomos hay que quitar `at(r1,l)` de forma explícita.

### ¿Qué relación hay entre la representación clásica y la de variables de estado en poder expresivo y en tamaño?
Tienen el mismo poder expresivo, y cada una se traduce a la otra en tiempo polinómico de orden bajo. Ocupan una cantidad de espacio parecida.

### ¿Cuándo se prefiere cada una de las dos representaciones?
La clásica es la más popular en planificación clásica, en parte por razones históricas, y resulta más natural para los lógicos. La de variables de estado es más natural para los ingenieros y sirve para manejar números, funciones y tiempo en planificación no clásica.

### En la representación de variables de estado del mundo de bloques, ¿qué valores puede tomar `pos(x)` y `clear(x)`?
`pos(x)` vale otro bloque `y`, `table` si está sobre la mesa o `nil` si lo sostiene la pinza. `clear(x)` vale 1 si no tiene nada encima y 0 si tiene algo encima o está sostenido.

### Problema: ejecutar acciones del mundo de bloques con variables de estado
Estado: el bloque c está sobre a, y a y b están sobre la mesa. La pinza está libre. Con la representación de variables de estado, escribe el estado, ejecuta `unstack(c,a)` y después `stack(c,b)`, y compara el resultado con la forma clásica.
#### Paso 1
El estado inicial es

`pos(c)=a, pos(a)=table, pos(b)=table, clear(c)=1, clear(a)=0, clear(b)=1, holding=nil`

En forma clásica sería `{on c a, ontable a, ontable b, clear c, clear b, handempty}`.
#### Paso 2
`unstack(c,a)` exige `pos(c)=a`, `clear(a)=0`, `clear(c)=1` y `holding=nil`. Se cumplen las cuatro. Sus efectos son `pos(c)=nil`, `clear(c)=0`, `holding=c` y `clear(a)=1`, de modo que

`pos(c)=nil, pos(a)=table, pos(b)=table, clear(c)=0, clear(a)=1, clear(b)=1, holding=c`
#### Paso 3
`stack(c,b)` exige `holding=c`, `clear(c)=0` y `clear(b)=1`. Se cumplen las tres. Sus efectos son `holding=nil`, `clear(b)=0`, `pos(c)=b` y `clear(c)=1`, de modo que

`pos(c)=b, pos(a)=table, pos(b)=table, clear(c)=1, clear(a)=1, clear(b)=0, holding=nil`
#### Paso 4
En forma clásica es `{on c b, ontable a, ontable b, clear c, clear a, handempty}`. Es el mismo estado: cada valor de una variable sustituye al anterior, mientras que con átomos hay que quitar y añadir cada uno de forma explícita.

## 6. Mundo de bloques

### ¿Qué supuestos se hacen en el mundo de bloques?
Una mesa infinitamente ancha y un número finito de bloques, y no importa en qué punto de la mesa está un bloque. Un bloque está sobre la mesa o sobre otro, y la pinza sostiene como mucho un bloque a la vez.

### ¿Cómo se relaciona el mundo de bloques con el dominio DWR?
Es un caso particular del DWR con una localización, una grúa, contenedores como bloques y muchas más pilas de las necesarias.

### ¿Qué cinco predicados tiene la representación clásica del mundo de bloques?
`ontable(x)`, `on(x,y)`, `clear(x)`, `holding(x)` y `handempty`. El último no tiene argumentos.

### ¿Qué precondición y qué efectos tienen `pickup(x)` y `unstack(x,y)` en la representación clásica?
`pickup(x)` exige `ontable(x)`, `clear(x)` y `handempty`, quita esos tres y añade `holding(x)`. `unstack(x,y)` exige `on(x,y)`, `clear(x)` y `handempty`, quita esos tres y añade `holding(x)` y `clear(y)`.

### ¿Para qué hacen falta tanto `pickup` como `unstack` si ambos dejan un bloque en la pinza?
Porque parten de situaciones distintas. `pickup(x)` recoge un bloque de la mesa y `unstack(x,y)` lo recoge de encima de otro bloque `y`, que además queda libre.

### ¿Cuál es la precondición y cuáles son los efectos de `stack(x,y)` en la representación clásica?
Precondición: `holding(x)` y `clear(y)`. Efectos: se quitan `holding(x)` y `clear(y)`, y se añaden `on(x,y)`, `clear(x)` y `handempty`.

### ¿Por qué `stack(x,y)` añade `clear(x)` y quita `clear(y)`?
Porque `x` queda encima de la torre, sin nada sobre él, mientras que `y` ya tiene un bloque encima y deja de estar libre.

### ¿Qué precondición y qué efectos tiene `putdown(x)`?
Precondición: solo `holding(x)`. Efectos: se quita `holding(x)`, y se añaden `ontable(x)`, `clear(x)` y `handempty`.

## 7. PDDL: dominio, problema y tipos

### ¿Qué dos ficheros hacen falta para describir un problema de planificación en PDDL y qué contiene cada uno?
El de dominio, que declara los predicados y los operadores (acciones), y el de problema, que declara los objetos, el estado inicial y el objetivo.

### ¿Cómo se escribe un operador en PDDL?
Con `(:action nombre :parameters (...) :precondition (and ...) :effect (and ...))`. Los parámetros son variables que empiezan por `?`, y un efecto negativo se escribe `(not (predicado ...))`.

### ¿Cómo se interpreta el estado inicial `:init` de un problema PDDL?
Es una lista de átomos base positivos, y todo lo que no aparece se considera falso por negación por fallo. Por eso no se escriben los átomos falsos.

### ¿Qué cuatro cosas se declaran en el fichero de problema de PDDL?
El nombre del dominio con `(:domain ...)`, los objetos con `(:objects ...)`, el estado inicial con `(:init ...)` y el objetivo con `(:goal ...)`.

### ¿Qué aporta `:typing` en PDDL?
Permite declarar tipos con `(:types ...)` y escribir los parámetros y los objetos con su tipo, como `?ob - block`. Una variable tipada solo se liga a objetos de ese tipo, lo cual reduce las acciones posibles.

### ¿Qué dos errores de nombres impiden que un dominio y un problema PDDL se carguen juntos aunque cada uno sea correcto por separado?
Que el nombre de `(:domain ...)` en el problema no coincida con el de `(define (domain ...))`, como `blockword` y `blocksworld` en las transparencias. Y que las acciones usen predicados con otro nombre del declarado, como `arm-empty` y `on-table` en las acciones cuando `:predicates` declara `handempty` y `ontable`. Además, en `?ob – block` el guion largo no es el guion que PDDL espera.

### En la codificación de Hanoi con tres operadores, ¿cómo se evita poner el disco mediano sobre el pequeño?
`move-medium` lleva la precondición `(not (= ?y S))`, que usa `:equality`. `move-large` solo acepta varillas como destino, de modo que nunca se apila sobre un disco. `move-small` no necesita restricción.

### En las torres de Hanoi, ¿cómo evita la codificación de un solo operador `move-disk` mover un disco grande sobre uno pequeño?
Con el predicado estático `smaller`, que el problema lista en `:init` para cada par permitido, y con la precondición `(smaller ?disk ?new-below)`. No hace falta un operador por disco ni comparar nombres.

### ¿Qué es un predicado estático y dónde se declara su valor?
Es un predicado que ningún efecto modifica, como `adjacent` o `smaller`. Sus átomos se escriben una vez en `:init` y las precondiciones los consultan.

### ¿Qué ventaja tiene la codificación de Hanoi con `smaller` frente a tener un operador por disco?
Con $n$ discos no hace falta cambiar el dominio: solo se añaden objetos y hechos `smaller` al problema. Con un operador por disco habría que escribir uno nuevo por cada disco.

### ¿Por qué `move` del DWR hay que reescribirlo para el subconjunto STRIPS de PDDL?
Porque `¬occupied(m)` es una precondición negativa y las acciones STRIPS del subconjunto solo admiten átomos positivos. Se sustituye por un predicado positivo, como `(free ?m)`, que `move` quita en el destino y añade en el origen. Las transparencias de Hanoi usan `:negative-preconditions`, que el subconjunto no incluye.

### Problema: Hanoi con dos discos y un solo operador
Dominio de un solo operador con el predicado estático `smaller`. Hay dos discos, S (pequeño) y L (grande), y tres varillas P1, P2 y P3. El estado inicial es `at S L`, `at L P1`, `clear S`, `clear P2`, `clear P3`, más los hechos `smaller S L`, `smaller S P1`, `smaller S P2`, `smaller S P3`, `smaller L P1`, `smaller L P2` y `smaller L P3`. El objetivo es `at S L` y `at L P3`. El operador `move-disk(?disk, ?from, ?new-below)` exige `at ?disk ?from`, `clear ?disk`, `clear ?new-below` y `smaller ?disk ?new-below`. Añade `at ?disk ?new-below` y `clear ?from`, y quita `clear ?new-below` y `at ?disk ?from`. Da un plan de tres movimientos y compruébalo.
#### Paso 1
`move-disk(S, L, P2)` es aplicable: `at S L`, `clear S`, `clear P2` y `smaller S P2` están en el estado. Añade `at S P2` y `clear L`, y quita `at S L` y `clear P2`. El estado tiene ahora `at S P2`, `at L P1`, `clear S`, `clear L` y `clear P3`.
#### Paso 2
`move-disk(L, P1, P3)` es aplicable: `at L P1`, `clear L`, `clear P3` y `smaller L P3` están en el estado. Añade `at L P3` y `clear P1`, y quita `at L P1` y `clear P3`. El estado tiene ahora `at S P2`, `at L P3`, `clear S`, `clear L` y `clear P1`.
#### Paso 3
`move-disk(S, P2, L)` es aplicable: `at S P2`, `clear S`, `clear L` y `smaller S L` están en el estado. Añade `at S L` y `clear P2`, y quita `at S P2` y `clear L`. El estado final tiene `at S L` y `at L P3`, de modo que el objetivo se cumple. No existe un plan más corto, porque cada disco tiene que cambiar de lugar al menos una vez y el pequeño tiene que apartarse para mover el grande.

### Problema: modelar en PDDL un robot mensajero con una mano
Un robot se mueve por salas conectadas con pasillos y lleva como mucho un paquete. Escribe el dominio con `:strips` y `:typing` y solo precondiciones positivas, y el problema con salas a, b y c, pasillos a-b y b-c, en ambos sentidos. El robot parte de a. El paquete x está en a y el paquete y está en b. El objetivo es que x esté en c e y en a. Da un plan y compruébalo.
#### Paso 1
Predicados. `connected` es fijo, porque ningún efecto lo cambia. `hand-free` es dinámico y limita al robot a un paquete. El resto describe dónde está el robot y qué hace con los paquetes.

```
(define (domain mensajeria)
  (:requirements :strips :typing)
  (:types room parcel)
  (:predicates (connected ?a - room ?b - room)
               (robot-at ?r - room)
               (parcel-at ?p - parcel ?r - room)
               (carrying ?p - parcel)
               (hand-free))
```
#### Paso 2
Acciones, que continúan el dominio del paso anterior y lo cierran con el último paréntesis. `go` mueve al robot por un pasillo, y `pick` y `drop` cogen y sueltan un paquete. Cada acción borra lo que deja de ser cierto y añade lo que pasa a serlo. La precondición `hand-free` es lo que limita a un paquete.

```
  (:action go
    :parameters (?from - room ?to - room)
    :precondition (and (robot-at ?from) (connected ?from ?to))
    :effect (and (robot-at ?to) (not (robot-at ?from))))
  (:action pick
    :parameters (?p - parcel ?r - room)
    :precondition (and (robot-at ?r) (parcel-at ?p ?r) (hand-free))
    :effect (and (carrying ?p) (not (parcel-at ?p ?r)) (not (hand-free))))
  (:action drop
    :parameters (?p - parcel ?r - room)
    :precondition (and (robot-at ?r) (carrying ?p))
    :effect (and (parcel-at ?p ?r) (hand-free) (not (carrying ?p)))))
```
#### Paso 3
Fichero de problema. Los pasillos se escriben en los dos sentidos, porque `connected` no es simétrico por sí solo.

```
(define (problem entrega)
  (:domain mensajeria)
  (:objects a b c - room x y - parcel)
  (:init (connected a b) (connected b a) (connected b c) (connected c b)
         (robot-at a) (parcel-at x a) (parcel-at y b) (hand-free))
  (:goal (and (parcel-at x c) (parcel-at y a))))
```
#### Paso 4
Un plan es `pick(x,a)`, `go(a,b)`, `go(b,c)`, `drop(x,c)`, `go(c,b)`, `pick(y,b)`, `go(b,a)` y `drop(y,a)`. Tras `pick(x,a)` el estado tiene `carrying x` y no tiene `hand-free` ni `parcel-at x a`. Tras `drop(x,c)` vuelven `hand-free` y `parcel-at x c`. Después `pick(y,b)` es aplicable porque `robot-at b`, `parcel-at y b` y `hand-free` están en el estado. El estado final contiene `robot-at a`, `parcel-at x c`, `parcel-at y a` y `hand-free`, de modo que el objetivo se cumple.

Si el robot intentara `pick(y,b)` antes de soltar x, no sería aplicable: falta `hand-free`.

## 8. El subconjunto de PDDL de la competición AIPS-2000

### ¿En qué orden aparecen las secciones de un dominio en el subconjunto de PDDL?
Nombre del dominio, `:requirements`, `:types`, `:constants`, `:predicates` y por último las acciones. Se pueden omitir, pero no cambiar de orden.

### ¿Qué diferencia hay entre `:constants` y `:objects`?
`:constants` se declara en el dominio y son objetos que existen en todos los problemas. `:objects` se declara en el problema, es obligatorio, y puede incluir objetos que no aparecen en el estado inicial.

### ¿Qué banderas de requisitos admite el subconjunto y cuál es el valor por defecto?
El texto habla de dos banderas, `:strips` y `:adl`, aunque la gramática también lista `:typing` y el documento lo usa. Si no se declara ninguna, se asume `:strips`. Declarar `:adl` hace redundante `:strips`, porque ADL es un superconjunto.

### ¿Qué diferencia hay entre una acción STRIPS y una acción ADL en las precondiciones?
En STRIPS la precondición es una conjunción de átomos positivos. En ADL puede ser una fórmula de primer orden con `not`, `and`, `or`, `imply`, `exists` y `forall`.

### ¿Qué efectos añade ADL respecto a STRIPS?
Efectos condicionales con `(when <fórmula> <efectos>)` y efectos universales con `(forall (variables) ...)`. No se pueden anidar `when`.

### ¿Por qué las precondiciones negativas no están en las acciones STRIPS del subconjunto?
Porque una revisión del borrador, del 14 de febrero, las quitó de STRIPS, y para usarlas hay que pedir `:adl`. Un modelo STRIPS debe expresar lo negativo con un predicado positivo complementario.

### ¿Qué regla deben cumplir las variables libres de una precondición o de un efecto?
Todas deben aparecer en la lista `:parameters`. Una variable que aparece en la precondición y no está entre los parámetros es un error de sintaxis.

### ¿Qué declara la lista tipada `integer float - number physob`?
`integer` y `float` son subtipos de `number`, y `physob` es subtipo de `object`, que es el tipo por defecto cuando no sigue ningún tipo. Cada elemento toma el primer tipo que le sigue tras el guion.

### ¿Qué hace `(either t1 t2)` en una declaración de tipo?
Declara la unión de tipos: el parámetro puede ser de cualquiera de ellos. Se usa en Hanoi para decir que algo puede estar sobre un disco o sobre una varilla.

### ¿Cómo define el subconjunto que un plan es solución de un problema?
Es una secuencia de acciones factible desde el estado inicial tal que el objetivo es cierto en el estado resultante.

### ¿Qué tres reglas sobre los nombres impone el subconjunto de PDDL?
Empiezan por una letra y solo llevan letras, dígitos, guiones y guiones bajos. No distinguen mayúsculas. Son únicos: un mismo nombre no se define dos veces.

### Problema: encontrar y corregir los errores de un dominio PDDL
Este fragmento del dominio del robot mensajero se rechaza o produce planes absurdos. Encuentra los errores y corrígelos para que sea una acción STRIPS correcta:

```
(:action go
  :parameters (?from - room ?to - room)
  :precondition (and (robot-at ?from) (connected ?from ?to))
  :effect (robot-at ?to))
(:action pick
  :parameters (?p - parcel)
  :precondition (and (robot-at ?r) (parcel-at ?p ?r) (not (carrying ?p)))
  :effect (and (carrying ?p) (not (parcel-at ?p ?r)) (not (hand-free))))
```
#### Paso 1
En `go` falta borrar el origen. Con el efecto `(robot-at ?to)` solo, tras `go(a,b)` el estado contiene `robot-at a` y `robot-at b` a la vez. Entonces `pick(x,a)` sigue siendo aplicable aunque el robot ya haya salido de a, y `go(a,c)` también si hubiera pasillo. Se corrige con el efecto `(and (robot-at ?to) (not (robot-at ?from)))`.
#### Paso 2
En `pick` la variable `?r` aparece en la precondición y en el efecto, pero no está en `:parameters`. Es un error de sintaxis, porque todas las variables libres deben ser parámetros. Se corrige con `:parameters (?p - parcel ?r - room)`.
#### Paso 3
La precondición `(not (carrying ?p))` es negativa, y en STRIPS solo se admiten átomos positivos. Además sobra: si `parcel-at ?p ?r` es cierto, el paquete no está siendo llevado, porque `pick` borra `parcel-at`. Se elimina.
#### Paso 4
Falta la precondición `(hand-free)`, aunque el efecto ya quita `hand-free`. Sin ella el robot podría coger un segundo paquete con la mano ocupada. Con las correcciones, `pick` queda así:

```
(:action pick
  :parameters (?p - parcel ?r - room)
  :precondition (and (robot-at ?r) (parcel-at ?p ?r) (hand-free))
  :effect (and (carrying ?p) (not (parcel-at ?p ?r)) (not (hand-free))))
```
