# PIN U2 - Representación y PDDL

## 2. Representación clásica

### ¿Qué ocho supuestos restrictivos exige la planificación clásica?
Conjunto de estados finito, entorno totalmente observable, determinista y estático, objetivos de consecución, planes secuenciales, tiempo implícito y planificación offline. En las transparencias van de A0 a A7.

### ¿Qué diferencia hay entre una relación fija y una relación dinámica? Pon un ejemplo de cada una en el dominio de transporte (DWR).
Una relación fija nunca cambia durante el plan, como `adjacent(loc1,loc2)` o `belong(crane1,loc1)`. Una dinámica sí cambia, como `at(r1,loc2)` o `holding(crane1,c3)`. Ambas se escriben como átomos.

### ¿Qué es un estado en la representación clásica?
Un conjunto de átomos base: los que son ciertos en ese estado. Como hay finitos átomos base, también hay finitos estados.

## 3. Operadores y acciones

### ¿De qué tres partes consta un operador de planificación clásica?
Es una terna $o = (\text{name}(o), \text{precond}(o), \text{effects}(o))$. La precondición son los literales que deben ser ciertos para usarlo, y los efectos son los literales que el operador hace ciertos.

### ¿Qué diferencia hay entre un operador y una acción?
Una acción es una instancia base de un operador, obtenida con una sustitución. El operador tiene variables, mientras que la acción tiene todos sus argumentos fijados.

### ¿Qué es un dominio de planificación?
Un lenguaje junto con un conjunto de operadores. Corresponde a un conjunto de sistemas de transiciones de estados, porque cada problema concreto, con sus objetos, instancia los mismos operadores y da un sistema distinto. El estado inicial no forma parte del dominio.

### ¿Cuándo es aplicable una acción $a$ en un estado $s$?
Cuando $\text{precond}^+(a) \subseteq s$ y $\text{precond}^-(a) \cap s = \emptyset$. Es decir, todos los átomos positivos de la precondición están en $s$ y ninguno de los negativos.

### ¿Cómo se calcula el estado que resulta de ejecutar una acción aplicable $a$ en $s$?
$$\gamma(s, a) = (s - \text{effects}^-(a)) \cup \text{effects}^+(a)$$
Se quitan los átomos de los efectos negativos y después se añaden los de los efectos positivos.

### Si un átomo está a la vez en $\text{effects}^+(a)$ y en $\text{effects}^-(a)$, ¿queda en el estado resultante?
Sí. La fórmula primero lo quita y después lo añade, de modo que gana el efecto positivo. Es una trampa típica de modelado, y conviene no escribir el mismo átomo en los dos sentidos.

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

### ¿Qué es un plan y cuándo es una solución?
Un plan es cualquier secuencia de acciones $a_1, \dots, a_n$, cada una instancia de un operador. Es solución si es ejecutable desde $s_0$ y el estado final satisface $g$.

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

### ¿Qué cinco predicados tiene la representación clásica del mundo de bloques?
`ontable(x)`, `on(x,y)`, `clear(x)`, `holding(x)` y `handempty`. El último no tiene argumentos.

### ¿Qué precondición y qué efectos tienen `pickup(x)` y `unstack(x,y)` en la representación clásica?
`pickup(x)` exige `ontable(x)`, `clear(x)` y `handempty`, quita esos tres y añade `holding(x)`. `unstack(x,y)` exige `on(x,y)`, `clear(x)` y `handempty`, quita esos tres y añade `holding(x)` y `clear(y)`.

### ¿Cuál es la precondición y cuáles son los efectos de `stack(x,y)` en la representación clásica?
Precondición: `holding(x)` y `clear(y)`. Efectos: se quitan `holding(x)` y `clear(y)`, y se añaden `on(x,y)`, `clear(x)` y `handempty`.

### ¿Qué precondición y qué efectos tiene `putdown(x)`?
Precondición: solo `holding(x)`. Efectos: se quita `holding(x)`, y se añaden `ontable(x)`, `clear(x)` y `handempty`.

## 7. PDDL: dominio, problema y tipos

### ¿Qué dos ficheros hacen falta para describir un problema de planificación en PDDL y qué contiene cada uno?
El de dominio, que declara los predicados y los operadores (acciones), y el de problema, que declara los objetos, el estado inicial y el objetivo.

### ¿Cómo se escribe un operador en PDDL?
Con `(:action nombre :parameters (...) :precondition (and ...) :effect (and ...))`. Los parámetros son variables que empiezan por `?`, y un efecto negativo se escribe `(not (predicado ...))`.

### ¿Cómo se interpreta el estado inicial `:init` de un problema PDDL?
Es una lista de átomos base positivos, y todo lo que no aparece se considera falso por negación por fallo. Por eso no se escriben los átomos falsos.

### ¿Qué aporta `:typing` en PDDL?
Permite declarar tipos con `(:types ...)` y escribir los parámetros y los objetos con su tipo, como `?ob - block`. Una variable tipada solo se liga a objetos de ese tipo, lo cual reduce las acciones posibles.

### En las torres de Hanoi, ¿cómo evita la codificación de un solo operador `move-disk` mover un disco grande sobre uno pequeño?
Con el predicado estático `smaller`, que el problema lista en `:init` para cada par permitido, y con la precondición `(smaller ?disk ?new-below)`. No hace falta un operador por disco ni comparar nombres.

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

### ¿Qué diferencia hay entre `:constants` y `:objects`?
`:constants` se declara en el dominio y son objetos que existen en todos los problemas. `:objects` se declara en el problema, es obligatorio, y puede incluir objetos que no aparecen en el estado inicial.

### ¿Qué diferencia hay entre una acción STRIPS y una acción ADL en las precondiciones?
En STRIPS la precondición es una conjunción de átomos positivos. En ADL puede ser una fórmula de primer orden con `not`, `and`, `or`, `imply`, `exists` y `forall`.

### ¿Qué efectos añade ADL respecto a STRIPS?
Efectos condicionales con `(when <fórmula> <efectos>)` y efectos universales con `(forall (variables) ...)`. No se pueden anidar `when`.

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
