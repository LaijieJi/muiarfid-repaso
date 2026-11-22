# SMA U2 - Negociación, votaciones y subastas

## 1. ¿Qué es la negociación?

### ¿Qué es la negociación entre agentes: una capacidad de los agentes o un proceso?
Es un proceso, es decir, el método por el que dos o más partes llegan juntas a un acuerdo. No se define como una capacidad de las partes. Si una pregunta ofrece "capacidad de..." frente a "método o proceso para...", la segunda opción es la que sigue las transparencias.

### ¿Qué rasgos definen una negociación en este tema?
Hay cuatro. Existe un conflicto, porque las partes tienen preferencias distintas y, si no, no hay nada que negociar. Hay interacción entre dos o más partes. Es una búsqueda conjunta de un acuerdo satisfactorio para todas. Y tiene naturaleza dual, con cooperación y competición a la vez.

### ¿Por qué la negociación tiene naturaleza dual?
Porque mezcla cooperación y competición. Las partes quieren llegar a un acuerdo, pero cada una intenta quedarse con la mejor parte posible.

### ¿Cómo se relacionan coordinación, cooperación y negociación en el esquema del tema?
La coordinación es el concepto general y se divide en cooperación y negociación. La cooperación pone el acento en un objetivo global compartido, mientras que la negociación lo pone en el objetivo individual de cada agente, con su parte competitiva. Por tanto, lo correcto es decir que la coordinación puede ser cooperativa o competitiva. Las formulaciones que hacen a la cooperación o a la competición subdivisiones de otra cosa leen el esquema al revés.

### ¿Qué es un acuerdo Pareto eficiente?
Un acuerdo en el que no se puede mejorar la utilidad de una parte sin empeorar la de otra. No es lo mismo que maximizar la utilidad conjunta, porque ese máximo sí es Pareto eficiente pero hay acuerdos Pareto eficientes que no lo alcanzan. Tampoco basta con que una parte obtenga su máximo, ya que quizá se pueda mejorar a la otra sin tocar a la primera. No se confunde con el criterio de Pareto de las votaciones, que habla de órdenes sociales.

## 2. Introducción al Social Choice

### ¿Cuál es el objetivo del social choice?
Tomar una decisión conjunta en un grupo cuyos miembros tienen preferencias propias. Para lograrlo estudia cómo agregar esas preferencias individuales en un resultado social. El ejemplo clásico son las votaciones.

## 3. Nociones básicas del Social Choice

### ¿Qué diferencia hay entre una función de bienestar social y una función de elección social?
La de bienestar social (SWF) devuelve un orden de preferencia social completo, por ejemplo en un concurso de belleza, y se escribe $F_N : \Pi(O)^n \to \Pi(O)$. La de elección social devuelve solo un candidato, como en una elección presidencial, y se escribe $F_N : \Pi(O)^n \to O$. La entrada son los $n$ órdenes de los votantes. Arrow habla de las primeras y Muller-Satterthwaite de las segundas.

### ¿Qué es un ganador Condorcet?
Un candidato $o$ que, frente a cualquier otro $o'$, tiene al menos tantos votantes con $o \succ o'$ como con $o' \succ o$. Las transparencias escriben "mayor o igual", de modo que un empate en un duelo no descalifica. Con mayoría estricta hay como mucho uno.

### ¿Qué es un perdedor Condorcet?
Un candidato que, frente a cualquier otro, tiene al menos tantos votantes en contra como a favor. Con mayoría estricta pierde todos sus duelos. Un atajo es que el candidato al que más de la mitad de los votantes pone en último lugar es perdedor Condorcet.

### ¿Cuándo es Condorcet una regla de votación y cuándo cumple el criterio del perdedor Condorcet?
Una regla es Condorcet si, cuando existe un ganador Condorcet, lo elige siempre. Cumple el criterio del perdedor Condorcet si nunca elige al perdedor Condorcet como ganador.

### ¿Qué es la paradoja de Condorcet?
Que las mayorías pueden formar un ciclo: $a$ vence a $b$, $b$ vence a $c$ y $c$ vence a $a$. Entonces no hay ganador Condorcet, y sea cual sea el resultado, una mayoría de votantes prefiere a otro candidato.

### ¿Qué dice el criterio de Pareto en social choice?
Si todos los votantes prefieren $o$ a $o'$, entonces $o'$ no puede ganar y $o$ debe quedar por delante de $o'$ en el orden social.

### ¿Qué exige el criterio de consistencia?
Si se parte a los votantes en dos grupos y ambos eligen al menos un candidato en común, la elección del grupo entero debe ser exactamente esos candidatos comunes. Dividir al electorado no debe cambiar el resultado.

### ¿Qué exige la independencia de alternativas irrelevantes (IIA)?
Que el orden social entre $o_i$ y $o_j$ dependa solo de cómo los votantes ordenan esos dos candidatos entre sí. Lo que ocurra con un tercer candidato no debe afectar.

### ¿Qué exige la monotonía?
Si $o$ gana con un perfil $P$ y se pasa a un perfil $P'$ en el que solo mejora la posición de $o$ en las preferencias de algunos votantes, $o$ debe seguir ganando.

### Problema: comprueba si hay ganador Condorcet en este perfil de tres votantes
Ana ordena $x \succ y \succ z$, Biel ordena $y \succ z \succ x$ y Cris ordena $z \succ x \succ y$. Busca el ganador Condorcet y mira qué hacen pluralidad y Borda.
#### Paso 1
$x$ contra $y$: prefieren $x$ Ana y Cris, o sea 2 contra 1. Gana $x$.
#### Paso 2
$y$ contra $z$: prefieren $y$ Ana y Biel. Gana $y$ por 2 contra 1. $z$ contra $x$: prefieren $z$ Biel y Cris. Gana $z$ por 2 contra 1.
#### Paso 3
Hay un ciclo $x \to y \to z \to x$ y cada candidato vence a uno y pierde contra otro. No hay ganador ni perdedor Condorcet: es la paradoja de Condorcet.
#### Paso 4
Pluralidad da un empate a 1 voto. Borda da $x$: $2 + 0 + 1 = 3$, $y$: $1 + 2 + 0 = 3$ y $z$: $0 + 1 + 2 = 3$, otro empate. Hace falta una regla de desempate.

## 4. Votaciones

### ¿Qué cuatro familias de reglas de votación distingue el tema?
Las de comparación por pares (Dodgson, Copeland), las posicionales (pluralidad, Borda), las que combinan posiciones y pares (pluralidad a dos rondas, Hare) y las basadas en agenda (enmienda, sucesivo).

### ¿Cómo funciona la pluralidad y por qué produce anomalías?
Cada candidato recibe un punto por cada votante que lo pone en primer lugar, y gana el que más puntos tiene. Hace falta una regla de desempate y solo se necesita la mejor opción de cada votante. Como ignora el resto del orden, con 40, 30 y 30 por ciento de primeros puestos gana el primero aunque el 60 por ciento prefiera a otro.

### ¿Cómo se calcula el conteo de Borda?
Con $m$ candidatos, cada votante da $m-1$ puntos a su primero, $m-2$ al segundo y así hasta 0 al último. Se suman los puntos de todos los votantes y gana el candidato con más. Usa el orden completo, de modo que obliga a revelar todas las preferencias.

### ¿Cómo se comprueba que un conteo de Borda está bien hecho?
Los puntos totales deben sumar $n \cdot m(m-1)/2$, porque cada votante reparte siempre $0 + 1 + \dots + (m-1)$ puntos. Con 15 votantes y 4 candidatos suman $15 \cdot 6 = 90$.

### ¿Hay un atajo para calcular pluralidad, Borda y Condorcet con tres candidatos?
Sí, con $n$ votantes y grupos de órdenes iguales. Pluralidad: se suman los votantes de los grupos que ponen al candidato primero. Borda: puntos $= n + \text{primeros} - \text{últimos}$, porque los puntos son $2f + s$ y el número de segundos es $s = n - f - l$. Condorcet: el que es primero para más de la mitad es ganador y el que es último para más de la mitad es perdedor. Si no, se cuentan los duelos con una mayoría de más de $n/2$ votantes, que son 11 si $n = 21$.

### ¿Qué calcula la regla de Copeland?
El índice de Copeland de un candidato, que es el número de candidatos a los que vence por mayoría en comparación por pares. En el tema un empate cuenta 0. Gana el índice más alto.

### ¿Qué hace el método de Dodgson?
Elige el ganador Condorcet si existe. Si no, elige al candidato al que le bastan menos intercambios de candidatos contiguos en las preferencias de los votantes para convertirse en ganador Condorcet. Es un problema NP-duro y exige conocer los órdenes completos.

### ¿Cómo funciona la pluralidad a dos rondas?
Se vota por el mejor candidato y pasan a una segunda votación los dos con más votos. En la segunda, cada votante vota al que prefiera de esos dos, y el resto queda eliminado.

### ¿Cómo funciona el sistema de Hare?
Cada votante vota a su mejor candidato. Si alguien tiene mayoría gana, y si no se elimina el candidato con menos votos y se repite, con cada voto pasando al siguiente candidato vivo de su orden.

### ¿En qué se diferencian la pluralidad a dos rondas y Hare?
En dos rondas se eliminan todos menos dos de golpe. Hare elimina de uno en uno al último y recuenta en cada paso, así que con cuatro o más candidatos pueden dar ganadores distintos.

### ¿Qué es una votación basada en agenda?
Una votación por pares donde alguien fija el orden de los candidatos, la agenda, y ese orden determina quién se enfrenta a quién.

### ¿Cómo funciona el proceso de enmienda?
Los dos primeros de la agenda se enfrentan y el ganador se enfrenta al siguiente, y así hasta el final. Con la agenda $a \to b \to c \to d$, juegan $a$ contra $b$, luego el ganador contra $c$, luego el ganador contra $d$.

### ¿Cómo funciona el proceso sucesivo?
En el orden de la agenda, cada candidato se enfrenta al conjunto de los restantes. Si obtiene mayoría gana, y si no queda eliminado y se pasa al siguiente. El último paso es un enfrentamiento entre dos.

### Problema: ganador y perdedor Condorcet cuando Borda elige a otro
Siete votantes ordenan tres candidatos. Cuatro tienen $b \succ c \succ a$, dos tienen $c \succ a \succ b$ y uno tiene $c \succ b \succ a$. Calcula el ganador por pluralidad, el de Borda y el ganador y el perdedor Condorcet.
#### Paso 1
Pluralidad. Los primeros puestos son $b$ con 4, $c$ con 3 y $a$ con 0. Gana $b$.
#### Paso 2
Borda, con 2 puntos al primero, 1 al segundo y 0 al tercero. Para $b$: $4 \cdot 2 + 2 \cdot 0 + 1 \cdot 1 = 9$. Para $c$: $4 \cdot 1 + 2 \cdot 2 + 1 \cdot 2 = 10$. Para $a$: $4 \cdot 0 + 2 \cdot 1 + 1 \cdot 0 = 2$. Los puntos suman $21 = 7 \cdot 3$, que es lo esperado. Gana $c$.
#### Paso 3
Comparación por pares. $b$ contra $c$: $b \succ c$ lo dicen los 4 primeros, mientras que $c \succ b$ lo dicen $2 + 1 = 3$. Gana $b$. $b$ contra $a$: $b \succ a$ lo dicen $4 + 1 = 5$ y $a \succ b$ lo dicen 2. Gana $b$.
#### Paso 4
$b$ gana a los dos, así que es ganador Condorcet. Borda elige a $c$ aunque $b$ lo vence 4 a 3 en directo, de modo que Borda no cumple el criterio Condorcet. El perdedor es $a$, porque pierde 2 a 5 contra $b$ y 0 a 7 contra $c$.

### Problema: tres ganadores distintos con 21 votantes
Veintiún votantes ordenan tres candidatos. Cinco tienen $a \succ c \succ b$, tres tienen $a \succ b \succ c$, dos tienen $b \succ a \succ c$, cinco tienen $b \succ c \succ a$ y seis tienen $c \succ b \succ a$. Calcula el ganador por pluralidad, el de Borda y el ganador y el perdedor Condorcet, usando el atajo de $n + \text{primeros} - \text{últimos}$ para Borda.
#### Paso 1
Pluralidad. $a$ es primero para $5 + 3 = 8$, $b$ para $2 + 5 = 7$ y $c$ para 6. Suman $8 + 7 + 6 = 21$. Gana $a$.
#### Paso 2
Últimos puestos. $a$ es último para $5 + 6 = 11$ votantes ($b \succ c \succ a$ y $c \succ b \succ a$). $b$ es último para 5 ($a \succ c \succ b$). $c$ es último para $3 + 2 = 5$ ($a \succ b \succ c$ y $b \succ a \succ c$). Suman $11 + 5 + 5 = 21$.
#### Paso 3
Borda $= 21 + \text{primeros} - \text{últimos}$. Para $a$: $21 + 8 - 11 = 18$. Para $b$: $21 + 7 - 5 = 23$. Para $c$: $21 + 6 - 5 = 22$. Suman $63 = 21 \cdot 3$. Comprobación directa de $b$: $7 \cdot 2 + (3 + 6) \cdot 1 = 23$, porque es segundo con $a \succ b \succ c$ y con $c \succ b \succ a$. Gana $b$.
#### Paso 4
Condorcet, con 11 votos de mayoría. $c$ contra $a$: $c \succ a$ lo dicen $5 + 6 = 11$ y $a \succ c$ lo dicen $5 + 3 + 2 = 10$. Gana $c$. $c$ contra $b$: $c \succ b$ lo dicen $5 + 6 = 11$ y $b \succ c$ lo dicen $3 + 2 + 5 = 10$. Gana $c$. Por tanto $c$ es ganador Condorcet.
#### Paso 5
$a$ es último para 11 votantes, de modo que pierde contra los dos rivales. Comprobación: contra $b$ pierde 8 a 13 y contra $c$ pierde 10 a 11. Es el perdedor Condorcet.
#### Paso 6
Las tres reglas dan resultados distintos: pluralidad elige a $a$, Borda a $b$ y Condorcet a $c$. Además la pluralidad elige al perdedor Condorcet.

### Problema: pluralidad elige al perdedor Condorcet con 19 votantes
Diecinueve votantes ordenan tres candidatos. Ocho tienen $p \succ q \succ r$, seis tienen $q \succ r \succ p$ y cinco tienen $r \succ q \succ p$. Calcula el ganador por pluralidad, el de Borda y el ganador y el perdedor Condorcet.
#### Paso 1
Pluralidad. $p$ tiene 8, $q$ tiene 6 y $r$ tiene 5. Suman 19. Gana $p$.
#### Paso 2
Últimos puestos. $p$ es último para $6 + 5 = 11$ votantes, $q$ para ninguno y $r$ para 8. Suman $11 + 0 + 8 = 19$.
#### Paso 3
Borda $= 19 + \text{primeros} - \text{últimos}$. Para $p$: $19 + 8 - 11 = 16$. Para $q$: $19 + 6 - 0 = 25$. Para $r$: $19 + 5 - 8 = 16$. Suman $57 = 19 \cdot 3$. Gana $q$.
#### Paso 4
Condorcet, con 10 votos de mayoría. $q$ contra $p$: $q \succ p$ lo dicen $6 + 5 = 11$ y $p \succ q$ lo dicen 8. Gana $q$. $q$ contra $r$: $q \succ r$ lo dicen $8 + 6 = 14$ y $r \succ q$ lo dicen 5. Gana $q$. Es el ganador Condorcet.
#### Paso 5
$p$ es último para 11 votantes, más de la mitad, así que es el perdedor Condorcet. Comprobación: $p$ pierde 8 a 11 contra $q$ y 8 a 11 contra $r$.
#### Paso 6
La pluralidad elige a $p$, que es el perdedor Condorcet, mientras que Borda elige al ganador Condorcet $q$. Esto concuerda con la tabla del tema, en la que Borda cumple el criterio del perdedor Condorcet y la pluralidad no.

### Problema: pluralidad, Borda y Copeland con quince votantes
Quince votantes ordenan cuatro candidatos. Tres tienen $c \succ d \succ b \succ a$, dos tienen $d \succ c \succ b \succ a$, seis tienen $a \succ d \succ c \succ b$ y cuatro tienen $b \succ d \succ c \succ a$. Calcula el ganador por pluralidad, por Borda y por Copeland.

#### Paso 1
Pluralidad. $a$ tiene 6, $b$ tiene 4, $c$ tiene 3 y $d$ tiene 2. Gana $a$.
#### Paso 2
Borda con 3, 2, 1 y 0 puntos. Para $a$: $6 \cdot 3 = 18$. Para $b$: $3 \cdot 1 + 2 \cdot 1 + 4 \cdot 3 = 17$. Para $c$: $3 \cdot 3 + 2 \cdot 2 + 6 \cdot 1 + 4 \cdot 1 = 23$. Para $d$: $3 \cdot 2 + 2 \cdot 3 + 6 \cdot 2 + 4 \cdot 2 = 32$. Suman $90 = 15 \cdot 6$. Gana $d$.
#### Paso 3
Pares con 15 votantes. $d$ vence a $a$ por 9 a 6, a $b$ por 11 a 4 y a $c$ por 12 a 3. $c$ vence a $a$ (9 a 6) y a $b$ (11 a 4). $b$ vence a $a$ (9 a 6).
#### Paso 4
Los índices de Copeland son $d = 3$, $c = 2$, $b = 1$ y $a = 0$. Gana $d$, que es además el ganador Condorcet.

### Problema: pluralidad a dos rondas y Hare con el mismo perfil
Los mismos 15 votantes: tres con $c \succ d \succ b \succ a$, dos con $d \succ c \succ b \succ a$, seis con $a \succ d \succ c \succ b$ y cuatro con $b \succ d \succ c \succ a$. Calcula el ganador con pluralidad a dos rondas y con Hare.
#### Paso 1
Dos rondas. En la primera, $a$ tiene 6, $b$ tiene 4, $c$ tiene 3 y $d$ tiene 2. Pasan $a$ y $b$.
#### Paso 2
En la segunda, $a$ contra $b$. Solo los 6 votantes con $a$ primero prefieren $a$. Los otros 9 prefieren $b$, porque en sus órdenes $b$ va antes que $a$. Gana $b$ por 9 a 6.
#### Paso 3
Hare. La mayoría son 8 votos y nadie la tiene. Se elimina $d$, que tiene 2, y sus dos votantes ($d \succ c \succ b \succ a$) pasan a $c$. Ahora $a$ tiene 6, $b$ tiene 4 y $c$ tiene 5.
#### Paso 4
Tampoco hay mayoría. Se elimina $b$, con 4, y sus votantes ($b \succ d \succ c \succ a$) pasan a $c$, porque $d$ ya está eliminado. Quedan $a = 6$ y $c = 9$, así que gana $c$.
#### Paso 5
Con el mismo perfil, pluralidad da $a$, Borda y Copeland dan $d$, Hare da $c$ y dos rondas dan $b$. Cuatro reglas dan cuatro ganadores.

## 5. ¿Por qué tantos sistemas de elección social?

### ¿Qué criterios cumple cada regla según la tabla del tema?
Los cinco criterios son ganador Condorcet, perdedor Condorcet, monotonía, Pareto y consistencia. Ninguna regla de las vistas los cumple todos.

| Regla | Ganador Condorcet | Perdedor Condorcet | Monotonía | Pareto | Consistencia |
|---|---|---|---|---|---|
| Enmienda | sí | sí | sí | no | no |
| Sucesivo | no | sí | sí | no | no |
| Copeland | sí | sí | sí | sí | no |
| Dodgson | sí | no | no | sí | no |
| Pluralidad | no | no | sí | sí | sí |
| Borda | no | sí | sí | sí | sí |
| Dos rondas | no | sí | no | sí | no |
| Hare | no | sí | no | sí | no |

### ¿Qué dice el teorema de Arrow?
Habla de funciones de bienestar social, que devuelven un orden. Con más de dos candidatos, toda función de bienestar social que cumple Pareto e IIA es dictatorial, es decir, el orden social lo fija siempre un solo votante. Por tanto, no existe una que sea a la vez Pareto, IIA y no dictatorial, y no hay una forma exacta de determinar la voluntad colectiva.

### ¿Una función de bienestar social dictatorial cumple Pareto y la IIA?
Sí, cumple las dos. Su orden social copia el del dictador. Si todos prefieren $o$ a $o'$, también lo prefiere el dictador y se cumple Pareto. El orden entre dos candidatos depende solo de cómo los ordena el dictador, así que se cumple la IIA. Por eso es falso decir que una dictadura incumple alguna de las dos, y el teorema de Arrow dice que Pareto más IIA obliga a ser dictatorial.

### ¿En qué se distinguen el teorema de Arrow y el de Muller-Satterthwaite?
Los dos concluyen que la función es dictatorial cuando hay más de dos candidatos, pero parten de funciones y propiedades distintas.

| | Arrow | Muller-Satterthwaite |
|---|---|---|
| Función | bienestar social (devuelve un orden) | elección social (devuelve un ganador) |
| Propiedades | Pareto e IIA | Pareto y monotonía |
| Dictador | el orden social lo fija un votante | siempre elige el mejor candidato de un mismo votante |

### ¿Qué es el voto táctico?
Un votante mejora su resultado declarando unas preferencias que no son las verdaderas. Es una manipulación estratégica del voto.

### ¿Qué dice el teorema de Gibbard-Satterthwaite y qué papel tiene la complejidad?
Con más de dos candidatos, el único método de votación no manipulable que cumple Pareto es una dictadura, de modo que todo método realista se puede manipular. Sin embargo, el teorema no dice cómo se manipula. Bartholdi, Tovey y Trick demostraron que en algunas elecciones, como el voto único transferible, manipular es NP-duro.

### Problema: demuestra con números que Borda viola la IIA
Primer perfil: tres votantes con $a \succ b \succ c$ y dos con $b \succ c \succ a$. Segundo perfil: tres con $a \succ c \succ b$ y dos con $c \succ b \succ a$. Calcula el ganador de Borda en cada uno y mira cómo ordena cada votante $a$ y $b$.
#### Paso 1
Perfil 1 con 2, 1 y 0 puntos. $a$: $3 \cdot 2 + 2 \cdot 0 = 6$. $b$: $3 \cdot 1 + 2 \cdot 2 = 7$. $c$: $3 \cdot 0 + 2 \cdot 1 = 2$. Gana $b$, y $b$ queda por delante de $a$.
#### Paso 2
Perfil 2. $a$: $3 \cdot 2 + 2 \cdot 0 = 6$. $b$: $3 \cdot 0 + 2 \cdot 1 = 2$. $c$: $3 \cdot 1 + 2 \cdot 2 = 7$. Gana $c$, y ahora $a$ queda por delante de $b$.
#### Paso 3
En los dos perfiles, los tres primeros votantes prefieren $a$ a $b$ y los dos últimos prefieren $b$ a $a$. Solo cambia dónde está $c$.
#### Paso 4
El orden social entre $a$ y $b$ se invierte aunque nadie cambió su opinión sobre ellos. Esto incumple la IIA, porque el resultado entre $a$ y $b$ depende de un tercer candidato.

### Problema: voto táctico con pluralidad
Doce votantes ordenan tres candidatos. Tres tienen $x \succ y \succ z$, cuatro tienen $y \succ x \succ z$ y cinco tienen $z \succ y \succ x$. Los tres primeros quieren evitar que gane $z$. Calcula el resultado con voto sincero y si pueden mejorarlo votando otra cosa.
#### Paso 1
Con voto sincero: $x$ tiene 3, $y$ tiene 4 y $z$ tiene 5. Gana $z$, que es lo peor para los tres votantes de $x$.
#### Paso 2
Si los tres votan a $y$ aunque no sea su favorito, $y$ tiene $4 + 3 = 7$, $z$ tiene 5 y $x$ tiene 0. Gana $y$, su segunda opción.
#### Paso 3
Han mejorado su resultado mintiendo sobre sus preferencias. Eso es votar tácticamente, y la pluralidad es manipulable.

## 6. Subastas: conceptos y tipos

### ¿Qué es una subasta?
Un protocolo en el que los agentes indican su interés por uno o más recursos, y a partir de esas indicaciones se decide cómo se asignan los recursos y qué pagos hace cada agente. Participan el subastador y los postores, y el subastador y el postor ganador quedan obligados a cerrar el trato.

### ¿Qué es una subasta inversa?
La que compra en lugar de vender: un comprador y varios vendedores que compiten ofreciendo el precio más bajo. Un ejemplo es el e-procurement. La misma teoría sirve cambiando el sentido de los precios.

## 7. Subastas de un solo bien

### ¿Qué es una estrategia dominante en una subasta?
La que resulta más provechosa para un postor sea cual sea lo que hagan los demás.

### ¿Cómo se clasifican las cinco subastas de un solo bien según el precio, la apertura y el desarrollo?
| Subasta | Precio que paga el ganador | Ofertas | Desarrollo |
|---|---|---|---|
| Inglesa | su propia oferta (primer precio) | abiertas | ascendente |
| Japonesa | precio de la ronda anterior, cercano a la segunda valoración | abiertas | ascendente |
| Holandesa | primer precio | abiertas | descendente |
| Sobre cerrado de primer precio | primer precio | cerradas | una sola ronda |
| Vickrey | segundo precio | cerradas | una sola ronda |

### ¿Qué estrategia dominante tiene cada una de las cinco subastas de un solo bien?
| Subasta | Estrategia dominante |
|---|---|
| Inglesa | pujar el incremento mínimo hasta que el resto alcance su máximo |
| Japonesa | seguir mientras el precio no supere el límite propio, y decir la verdad si el valor no depende de los demás |
| Holandesa | no tiene |
| Sobre cerrado de primer precio | no tiene |
| Vickrey | decir la verdad y pujar el propio precio límite |

La trampa habitual es atribuir "decir la verdad" a la holandesa o al primer precio. Solo es dominante en Vickrey.

### ¿Cómo funciona la subasta inglesa y cuál es su estrategia dominante?
El subastador propone un precio de reserva y los postores van superando la oferta más alta, a la vista de todos. Cuando nadie sube, gana la oferta más alta y se paga lo ofertado. La estrategia dominante es pujar el incremento mínimo mientras el precio no supere el límite propio, con lo que gana quien más valora.

### ¿Qué es la maldición del ganador?
Que el ganador se pregunta por qué nadie más valoraba el bien tanto como él y teme haber pagado de más. Aparece en la inglesa y en la holandesa.

### ¿Cómo funciona la subasta japonesa y qué paga el ganador?
Es de precio ascendente. El vendedor indica un precio inicial y en cada paso todos los compradores dicen en público si aceptan el precio, y quien no acepta abandona. El vendedor sube el precio hasta que queda un solo comprador. Ese ganador paga el precio de la ronda anterior, que es el último al que aún había rival, y no el de la ronda en que quedó solo ni su propio límite.

### ¿En qué se diferencian la subasta inglesa y la japonesa, si las dos son ascendentes?
En la inglesa los postores ofertan cuando quieren y el ganador paga su oferta. En la japonesa el vendedor sube el precio por pasos, los compradores aceptan o abandonan en público y el ganador paga el precio de la ronda anterior, de modo que paga casi la segunda valoración.

### ¿Cómo funciona la subasta holandesa y qué estrategia dominante tiene?
Es de precio descendente y de ofertas abiertas. El subastador empieza con un valor inicial artificialmente alto, muy por encima del esperado, y lo baja poco a poco hasta que un agente acepta el precio actual, y ese agente paga lo que ofertó. No tiene estrategia dominante, porque el mejor momento de aceptar depende de lo que se crea que harán los demás. Por tanto, no es dominante decir la verdad (eso es Vickrey) ni pujar el incremento mínimo (eso es la inglesa). También sufre la maldición del ganador.

### ¿Cómo funciona el sobre cerrado de primer precio?
Una sola ronda: cada postor envía su oferta en privado, el subastador elige la más alta y el ganador paga lo que ofertó. No tiene estrategia dominante.

### ¿Cómo funciona la subasta de segundo precio de Vickrey?
Una sola ronda con ofertas en privado. Gana la oferta más alta, pero se paga el valor de la segunda oferta más alta. Su estrategia dominante es decir la verdad y pujar el propio precio límite.

### ¿Por qué en Vickrey conviene pujar la valoración verdadera?
Porque el precio lo fija la mejor oferta de los demás, no la propia. Subir la puja por encima del valor solo puede hacer ganar con un precio superior al valor, es decir, con pérdida. Bajarla solo puede hacer perder una subasta con beneficio.

### ¿Qué dice el teorema de equivalencia de ingresos y qué condiciones exige?
Que el precio medio al que se vende el bien es el mismo en los tipos de subasta analizados. Exige jugadores neutrales al riesgo, valoraciones privadas e independientes que cada uno conoce, jugadores simétricos (misma información y mismas estimaciones sobre los demás) y pago que depende solo de las pujas.

### ¿Qué manipulaciones afectan a las subastas de un solo bien y cómo se evitan?
Un subastador mentiroso afecta a Vickrey pero no a las abiertas ni al primer precio, los cómplices suben el precio de forma artificial, como en la inglesa, y los postores pueden hacer colusión. En la inglesa todos pujan a la baja, y en Vickrey todos pujan a la baja salvo el ganador designado. En la holandesa y en el primer precio es menos común, porque alguien puede romper el pacto en su beneficio. Frente a la colusión sirve que los postores no se conozcan, y frente al subastador mentiroso sirven las subastas abiertas o gestionadas por un tercero.

### Problema: simula una subasta japonesa y compárala con Vickrey
Cuatro postores valoran un objeto en 35, 52, 47 y 20 euros. Una subasta japonesa empieza en 10 euros y sube de 5 en 5. Un postor sigue mientras el precio no supere su valoración. Calcula quién gana, qué paga y qué pagaría en una subasta de Vickrey.
#### Paso 1
Con 10, 15 y 20 siguen los cuatro. Con 25 abandona el de 20. Con 30 y 35 siguen tres. Con 40 abandona el de 35.
#### Paso 2
Con 45 siguen el de 47 y el de 52. Con 50 abandona el de 47 y queda solo el de 52.
#### Paso 3
Gana el de 52 y paga el precio de la ronda anterior, que es 45. Ese es el último precio al que aún había otro postor, y es justo inferior a la segunda valoración, que es 47.
#### Paso 4
En Vickrey, si todos pujan su valoración, gana el de 52 y paga la segunda oferta más alta, 47. Los dos formatos asignan al de mayor valoración y lo hacen pagar casi la segunda valoración, salvo el redondeo del incremento.

### Problema: por qué en el primer precio no hay estrategia dominante
Un postor valora un objeto en 80 euros y puja en un sobre cerrado de primer precio. Compara su beneficio si el mejor rival puja 50 y si puja 75, con las pujas 45, 51, 76 y 80.
#### Paso 1
Rival en 50. Con 45 pierde y gana 0. Con 51 gana y paga 51, de modo que su beneficio es $80 - 51 = 29$. Con 76 gana y paga 76, de modo que su beneficio es $80 - 76 = 4$. Con 80 gana y su beneficio es $80 - 80 = 0$.
#### Paso 2
Rival en 75. Con 45 pierde y gana 0. Con 51 pierde y gana 0. Con 76 gana y paga 76, así que su beneficio es $80 - 76 = 4$. Con 80 gana con beneficio 0.
#### Paso 3
Entre las pujas probadas, contra 50 la mejor es 51 (beneficio 29) y contra 75 la mejor es 76 (beneficio 4). Pujar 51 contra el rival en 75 pierde. No hay una puja mejor en todos los casos, así que no hay estrategia dominante.

### Problema: comprueba que decir la verdad es dominante en Vickrey
Un postor valora un objeto en 65 euros y puja en una subasta de Vickrey. Calcula su beneficio con las pujas 45, 65 y 90 si la mejor oferta de los demás es 50 y si es 80.
#### Paso 1
Mejor rival en 50. Con 45 pierde y gana 0. Con 65 gana y paga la segunda oferta, 50, así que gana $65 - 50 = 15$. Con 90 gana y paga 50, con beneficio 15.
#### Paso 2
Mejor rival en 80. Con 45 pierde y gana 0. Con 65 pierde y gana 0. Con 90 gana y paga 80, con beneficio $65 - 80 = -15$.
#### Paso 3
Pujar 65 nunca es peor que otra puja. Cuando el rival está por debajo de 65, la puja 65 gana con el mismo beneficio que subir y mejor que bajar a 45. Cuando está por encima, la puja 65 pierde sin coste y subir a 90 da pérdida.

## 8. Subastas multi-unidad y lenguajes de ofertas

### ¿Qué significa en completo una oferta XOR como $(\{m,n\}, 6)\ \mathrm{XOR}\ (\{p,q\}, 9)$?
Hay tres casos. Se pagarían 6 por un lote que contenga $m$ y $n$ pero no $p$ y $q$. Se pagarían 9 por un lote que contenga $p$ y $q$ pero no $m$ y $n$. Y se pagarían 9 por el lote que contiene los cuatro, porque las ofertas no se suman sino que se paga una sola, la mejor, de modo que el valor es $\max\{6, 9\} = 9$ y no 15. Una redacción que omita el lote completo es incompleta.

### ¿Cómo se calcula la valoración de un lote con una oferta XOR?
$u_\beta(g') = 0$ si $g'$ no contiene ningún lote $g_i$ de la oferta, y $u_\beta(g') = \max\{p_i \mid g_i \subseteq g'\}$ en caso contrario. Se toma el precio más alto entre los lotes ofertados que quedan contenidos en $g'$.

### ¿Qué expresividad tienen las ofertas XOR?
Son totalmente expresivas: pueden expresar cualquier función de valoración sobre un conjunto de mercancías. Pueden necesitar un número exponencial de ofertas atómicas, aunque la valoración de un lote se calcula en tiempo polinómico.

### ¿Qué permiten las ofertas con alternativas en una subasta multi-unidad?
Que un mismo postor ofrezca varias alternativas, como 12 manzanas por 4 euros o 6 manzanas por 3. La transparencia las escribe con OR, pero se interpretan como XOR: se acepta como mucho una de las alternativas.

### ¿Cómo se plantea como problema de la mochila la asignación óptima de una subasta multi-unidad con ofertas todo o nada?
Con una variable binaria $x_i$ por oferta, que vale 1 si se acepta. Se maximiza $\sum_i p_i x_i$ con la restricción $\sum_i q_i x_i \le Q$, donde $p_i$ y $q_i$ son el precio y la cantidad de la oferta $i$ y $Q$ el stock. Elegir por mejor precio unitario puede no dar el óptimo, porque las ofertas son indivisibles y llenar el stock con ofertas pequeñas puede dejar fuera una grande que encajaba mejor.

### Problema: calcula valoraciones a partir de una oferta XOR
Una oferta es $(\{a,b\}, 4)\ \mathrm{XOR}\ (\{c\}, 3)\ \mathrm{XOR}\ (\{a,b,c\}, 6)$. Calcula $u(\{a\})$, $u(\{a,b\})$, $u(\{b,c\})$ y $u(\{a,b,c,d\})$.
#### Paso 1
$\{a\}$ no contiene ninguno de los tres lotes ofertados. Por tanto, $u(\{a\}) = 0$.
#### Paso 2
$\{a,b\}$ contiene $\{a,b\}$ (precio 4). Por tanto, $u(\{a,b\}) = 4$.
#### Paso 3
$\{b,c\}$ contiene $\{c\}$ (precio 3) pero no $\{a,b\}$ ni $\{a,b,c\}$. Por tanto, $u(\{b,c\}) = 3$.
#### Paso 4
$\{a,b,c,d\}$ contiene los tres lotes, con precios 4, 3 y 6. Se toma el máximo, $u(\{a,b,c,d\}) = 6$, y no la suma $13$.

## 9. Subastas combinatorias

### ¿Qué es una subasta combinatoria y cuándo interesa?
Una en la que se comercian varios bienes distintos a la vez y los postores pueden ofertar por lotes. Interesa cuando las valoraciones no son aditivas, con bienes complementarios (juntos valen más) o sustituibles (tener uno reduce el valor del otro). También evita el problema de la exposición, que es ganar solo parte del lote en subastas secuenciales o paralelas y pagar por algo que sin el resto vale poco.

### ¿Qué es el problema de determinación del ganador (WDP)?
Encontrar la asignación válida que maximiza los ingresos del subastador, es decir, el bienestar social $\sum_i u_i(g_i)$. Una asignación es válida si los lotes de los agentes son disjuntos, de modo que ningún bien se vende a dos postores. Es un problema NP-completo.

## 10. Algoritmo de subasta de Bertsekas

### ¿Qué idea tiene el algoritmo de subasta de Bertsekas?
Resuelve la asignación de $n$ agentes a $m \ge n$ tareas minimizando el coste total, con una tarea por agente. Los agentes pujan por la tarea que les sale menos costosa, y cada tarea tiene un precio que sube cuando varios agentes la quieren. El coste real de una tarea para un agente es su coste estimado más el precio de la tarea.

### ¿Cómo se calcula la puja de un agente en Bertsekas y qué ocurre después?
El agente calcula $coste_a(t_j) = c(a, t_j) + precio(t_j)$. Si $t_k$ es la tarea de menor coste y $t_s$ la segunda, puja por $t_k$ el valor $coste_a(t_s) - coste_a(t_k)$. Cada tarea con pujas se asigna al agente de puja más alta, se deshace su asignación anterior y su precio sube en esa puja. Se repite hasta que todos los agentes tienen tarea.
