# SMA U1 - Capacidad social

## 1. Comunicar y compartir terminología

### ¿Qué es la capacidad social de un agente?
Es su capacidad de interactuar con otros agentes mediante cooperación, coordinación y negociación. Como mínimo, exige saber comunicarse.

### ¿Qué cuatro elementos intervienen en un acto de comunicación?
El código, que son los signos y reglas con que se forma el mensaje. El canal, que es el soporte físico o tecnológico. El mensaje, que es la información. Y el contexto, que es el lugar y el momento.

### ¿Qué es una ontología y por qué la necesitan dos agentes que se comunican?
Es la especificación de un conjunto de términos que da una base común para entender un dominio. Sin ella, palabras como «talla» o «comprar» podrían significar cosas distintas para cada agente.

### ¿Qué tres componentes pide el Knowledge Sharing Effort para que los agentes intercambien conocimiento?
Un lenguaje común, una comprensión común del conocimiento que se intercambia y la habilidad de intercambiar ambas cosas.

### ¿Qué lenguaje del Knowledge Sharing Effort cubre la sintaxis, cuál la semántica y cuál la pragmática?
| Nivel | Lenguaje |
|---|---|
| Sintaxis | KIF, para intercambiar conocimiento |
| Semántica | Ontolingua, para definir ontologías |
| Pragmática | KQML, para comunicar agentes |

## 2. Modelos de comunicación

### ¿Cuándo hay interacción entre agentes?
Cuando la dinámica de un agente se ve perturbada por la influencia de otros. Las interacciones son el motor de un sistema multiagente.

### ¿De qué tres formas pueden interactuar los agentes?
Mediante acciones sobre el entorno, mediante una pizarra compartida o mediante paso de mensajes.

### ¿Cómo se comunican los agentes con una pizarra?
Comparten una zona de trabajo común, sin comunicación directa entre ellos. Un moderador publica los subproblemas y decide a quién se asignan, y un despachador avisa de los cambios.

### ¿Qué inconveniente tiene el modelo de pizarra?
La estructura central es un cuello de botella cuando los agentes están repartidos por una red.

### ¿Qué ventaja y qué exigencia tiene el paso de mensajes?
Ventaja: la comunicación es directa y permite muchas estrategias de interacción. Exigencia: hacen falta protocolos, y todos los agentes deben conocer la semántica del lenguaje.

### ¿De qué depende el significado de un mensaje entre agentes?
Del estado mental del emisor y del receptor y de la relación entre ambos. Un mensaje cambia primero el estado mental del receptor y, eventualmente, el resto del entorno.

## 3. Actos de habla

### ¿Qué idea introduce Austin sobre el lenguaje?
Que hablar es actuar. Además de afirmar algo verdadero o falso (función denotativa), quien habla realiza actos como pedir, prometer o amenazar (función conativa).

### ¿Cuáles son los cinco tipos de actos de habla de Searle?
| Tipo | Qué hace |
|---|---|
| Asertivo | da información sobre el mundo |
| Directivo | pide algo al destinatario |
| De promesa | compromete al locutor a hacer algo |
| Expresivo | muestra el estado mental del locutor |
| Declarativo | decir algo es ya hacerlo |

### ¿Una pregunta es un acto asertivo o directivo?
Es directivo, porque pide una respuesta al destinatario. No da información sobre el mundo.

### ¿Qué es un acto declarativo?
Aquel en que decir algo es ya hacerlo, como «queda abierta la sesión» dicho por quien preside.

### ¿Qué tres componentes tiene un acto de habla?
La locución es producir la frase con una gramática y un léxico. La ilocución es el acto que se realiza sobre el destinatario al declarar. La perlocución son los efectos sobre su estado, sus creencias o sus acciones.

### En la orden «Cierra la puerta», ¿qué es la ilocución y qué es la perlocución?
La ilocución es que quien habla quiere que quien escucha cierre la puerta. La perlocución es que quien escucha la cierra de verdad.

### ¿Qué significa la hipótesis $F(P)$ de los actos de habla?
Que todo acto es una fuerza ilocutoria $F$ aplicada a un contenido proposicional $P$. La fuerza (afirmación, pregunta, petición, promesa u orden) se llama performativa.

### ¿Un acto de habla es verdadero o falso?
No, tiene éxito o fracasa. Puede fallar en la enunciación, en la interpretación por el destinatario o en la consecución final.

### Problema: clasifica actos de habla según Searle
Clasifica cada frase como asertivo, directivo, de promesa, expresivo o declarativo. Frases: (a) «El servidor está caído.» (b) «¿Cuántas peticiones llegaron ayer?» (c) «Entregaré el informe el lunes.» (d) «Lamento el retraso.» (e) «Quedas nombrado coordinador del equipo.»
#### Paso 1
(a) da información sobre el mundo, de modo que es asertivo. (b) es una pregunta, que pide una respuesta al destinatario, por tanto es directivo.
#### Paso 2
(c) compromete a quien habla a hacer algo, así que es de promesa. (d) muestra el estado mental de quien habla, de modo que es expresivo.
#### Paso 3
(e) hace lo que dice al decirlo, siempre que quien habla tenga autoridad para ello. Es declarativo.

## 4. KQML

### ¿Qué asume KQML sobre los agentes y qué es cada mensaje?
Asume agentes de alto nivel, con representación simbólica y base de conocimiento, descritos a nivel intencional. Cada mensaje es un acto de habla y sus primitivas se llaman performativas.

### ¿Qué diferencia hay entre protocolo de interacción, lenguaje de comunicación y protocolo de transporte?
El protocolo de interacción es la estrategia de alto nivel que controla la conversación, como una negociación. El lenguaje de comunicación, como KQML, indica si el contenido es información, respuesta o consulta. El protocolo de transporte es el mecanismo, como TCP, SMTP o HTTP.

### ¿Qué tres capas tiene un mensaje KQML?
La capa de contenido lleva el mensaje en cualquier lenguaje. La capa de mensaje es el núcleo y fija el protocolo, la ontología y el acto de habla. La capa de comunicación guarda los parámetros de bajo nivel, como emisor, receptor e identificador.

### ¿Para qué sirven `:reply-with` e `:in-reply-to` en KQML?
`:reply-with` pone una etiqueta a un mensaje cuando el emisor espera respuesta. `:in-reply-to` repite esa etiqueta en la respuesta, para saber a qué mensaje contesta.

### ¿Qué indican `:language` y `:ontology` en un mensaje KQML?
`:language` es el lenguaje en que se representa el contenido y `:ontology` es la ontología a la que pertenecen sus términos.

### ¿Qué diferencia hay entre `ask-if`, `ask-one` y `ask-about` en KQML?
`ask-if` pregunta si una expresión está en la base de conocimiento del receptor. `ask-one` pide que el receptor conteste a una pregunta. `ask-about` pide todo lo que el receptor sabe sobre la expresión.

### ¿Qué diferencia hay entre `tell` y `reply` en KQML?
Con `tell` el emisor comunica algo de su base de conocimiento. Con `reply` comunica una respuesta que el receptor esperaba.

### ¿Qué pide la performativa `achieve` de KQML?
Que el receptor haga verdadera la expresión en su base de conocimiento. Es la forma de delegarle un objetivo.

### ¿Qué hace la performativa `advertise` de KQML?
El emisor anuncia que está preparado para responder a una performativa. Es lo que hace un agente ante un facilitador para que lo encuentren.

### ¿Cómo es el protocolo `subscribe` de KQML?
El emisor manda un `subscribe` y el receptor contesta con varios `reply`, uno por cada novedad.

### ¿Cómo es el protocolo `query` de KQML con manejador?
El emisor manda un `query` y el receptor devuelve un manejador. Después se intercambian pares de `next` del emisor y `reply` del receptor, tantos como respuestas haya.

### ¿Qué es un facilitador en KQML?
Un agente intermediario que pone en contacto a quien pregunta con quien sabe responder, que antes se ha anunciado con `advertise`.

### En KQML, ¿cómo funciona el patrón `broker` y por dónde vuelve la respuesta?
El agente que sabe responder se anuncia al facilitador. Quien pregunta le pide al facilitador que intermedie, el facilitador consulta al agente que sabe, y la respuesta vuelve por el facilitador hasta quien preguntó.

### En KQML, ¿cómo funciona el patrón `recruit` y por dónde vuelve la respuesta?
El facilitador reenvía la pregunta al agente que sabe, pero este responde directamente a quien preguntó, sin pasar por el facilitador.

### En KQML, ¿cómo funciona el patrón `recommend-one`?
El facilitador solo da el nombre de un agente que sabe responder. Quien preguntó contacta después con ese agente y este le responde directamente.

### Problema: escribe un diálogo KQML de consulta y delegación
El agente `almacen` quiere saber qué producto hay en el estante 3 y, si es una caja, pedir a `robot` que la lleve a la salida. Escribe los mensajes en KQML.
#### Paso 1
Primero pregunta, con una etiqueta para reconocer la respuesta.
```
(ask-one
  :sender almacen
  :receiver robot
  :content (en estante3 ?x)
  :reply-with q1
  :language LPROLOG
  :ontology LOGISTICA)
```
#### Paso 2
El robot contesta con `reply` y repite la etiqueta en `:in-reply-to`.
```
(reply
  :sender robot
  :receiver almacen
  :content (en estante3 caja7)
  :in-reply-to q1
  :language LPROLOG
  :ontology LOGISTICA)
```
#### Paso 3
Como es una caja, el almacén delega con `achieve`, que le pide hacer verdadera la expresión en su base.
```
(achieve
  :sender almacen
  :receiver robot
  :content (en salida caja7)
  :reply-with q2
  :language LPROLOG
  :ontology LOGISTICA)
```
#### Paso 4
Cuando lo consigue, el robot informa con `tell` y la etiqueta de la delegación.
```
(tell
  :sender robot
  :receiver almacen
  :content (en salida caja7)
  :in-reply-to q2
  :language LPROLOG
  :ontology LOGISTICA)
```

### Problema: traza los patrones broker, recruit y recommend con un facilitador
Un agente `B` sabe responder a `ask(x)` y se ha anunciado a un facilitador `F`. Un agente `A` quiere ese dato. Escribe la secuencia de mensajes de cada patrón y di quién contesta a `A`.
#### Paso 1
Broker. `A` manda `broker(ask(x))` a `F`, `F` manda `ask(x)` a `B`, `B` responde `tell(x)` a `F` y `F` reenvía `tell(x)` a `A`. Contesta `F`, porque todo pasa por él.
#### Paso 2
Recruit. `A` manda `recruit(ask(x))` a `F` y `F` manda `ask(x)` a `B`. Después `B` responde `tell(x)` directamente a `A`. Contesta `B`.
#### Paso 3
Recommend. `A` manda `recommend-one(ask(x))` a `F` y `F` responde `reply(B)` con el nombre. Entonces `A` manda `ask(x)` a `B` y `B` responde `tell(x)` a `A`. Contesta `B`, y `A` ha preguntado tras saber quién es.

## 5. FIPA ACL

### ¿Qué caracteriza a FIPA ACL?
Es un lenguaje basado en actos de habla cuya semántica se define con actitudes mentales, como creencias e intenciones, y tiene semántica formal en lógica modal. El estado de los agentes se describe con el lenguaje SL.

### ¿Para qué sirven `:protocol` y `:conversation-id` en un mensaje FIPA ACL?
`:protocol` indica el protocolo de conversación que se sigue y `:conversation-id` identifica la conversación a la que pertenece el mensaje.

### ¿Qué tipos de mensaje de FIPA ACL se usan para negociar?
`cfp`, `propose`, `accept-proposal` y `reject-proposal`.

### ¿Qué diferencia hay entre `query-if` y `query-ref` en FIPA ACL?
`query-if` hace una pregunta de sí o no, y su respuesta es un `inform-if`. `query-ref` pide un valor, y su respuesta es un `inform-ref`.

### ¿Qué diferencia hay entre `failure` y `not-understood` en FIPA ACL?
`not-understood` indica que el receptor no ha entendido el mensaje. `failure` indica que el receptor intentó la acción pedida y no pudo realizarla.

### ¿Por qué un solo acto comunicativo no es una conversación?
Porque es el originador de una conversación o la consecuencia de otro acto previo. Un `request`, por ejemplo, espera saber si se acepta y, después, si la acción se ha hecho.

### ¿Cómo es la secuencia del protocolo FIPA-request?
El iniciador manda `request`. El receptor contesta `not-understood`, `refuse` o `agree`. Tras un `agree`, llega un `failure`, un `inform-done` o un `inform-ref`.

### ¿En qué se diferencia FIPA-request-when de FIPA-request?
En que el receptor espera a que se cumpla una precondición antes de realizar la acción, y solo entonces responde si la hace o falla.

### ¿Para qué sirve FIPA-contract-net y cómo es su secuencia?
Sirve cuando un agente quiere que se haga una acción, hay varios candidatos y se quiere minimizar una función de la tarea, como el precio. El iniciador manda `cfp` y cada candidato contesta `refuse`, `not-understood` o `propose` antes del plazo. Después manda `reject-proposal` a unos y `accept-proposal` a uno, y el elegido termina con `failure`, `inform-done` o `inform-ref`.

### ¿Qué añade FIPA-iterated-contract-net respecto a FIPA-contract-net?
Varias rondas. Tras recibir las ofertas, el iniciador puede aceptar una, rechazarlas todas o emitir un `cfp` revisado, que abre otra ronda.

### ¿Qué diferencia hay entre la subasta inglesa y la holandesa en FIPA?
La inglesa es al alza: cada vez que se emite una oferta, el iniciador genera un `cfp` con el precio nuevo. La holandesa es a la baja, y suele haber un precio mínimo por debajo del cual no se vende.

### ¿Qué diferencia hay entre FIPA-brokering y FIPA-recruiting?
En ambos, el broker envía la petición a un conjunto de agentes. En brokering el broker proporciona las respuestas, mientras que en recruiting los agentes las envían al iniciador. Es la misma diferencia que entre `broker` y `recruit` de KQML.

### ¿Cómo funciona FIPA-subscribe?
El iniciador manda un `subscribe` para que le avisen cada vez que se cumpla una condición. El receptor responde con un `inform` por cada vez que se cumple.

### Problema: traza una ronda de FIPA-contract-net y su versión iterada
Un iniciador `I` quiere contratar el transporte de un palé y minimizar el precio. Consulta a cuatro transportistas `P`, `Q`, `R` y `S`. `P` ofrece 48 euros, `Q` ofrece 52, `R` ofrece 45 y `S` rechaza porque no tiene camión libre. ¿A quién acepta `I` y qué manda al resto? Supón ahora que `I` usa en su lugar la versión iterada y, en vez de aceptar, emite un `cfp` revisado que pide menos de 45 euros. `P` ofrece 41, `Q` ofrece 44 y `R` no mejora su oferta. ¿Cómo termina?
#### Paso 1
`I` manda un `cfp` a los cuatro. `P`, `Q` y `R` contestan `propose` con 48, 52 y 45. `S` contesta `refuse`.
#### Paso 2
Se minimiza el precio. La oferta mínima es 45, de `R`. `I` manda `accept-proposal` a `R` y `reject-proposal` a `P` y `Q`. `S` ya había rechazado, así que no recibe nada.
#### Paso 3
Con la versión iterada, `I` no cierra la ronda y emite un `cfp` revisado que pide menos de 45 euros. `P` y `Q` mejoran con `propose` de 41 y 44, mientras que `R` no mejora la suya.
#### Paso 4
La mejor oferta de la segunda ronda es 41, de `P`. `I` manda `accept-proposal` a `P` y `reject-proposal` a `Q` y a `R`. Al final, `P` envía `inform-done` si entrega el palé o `failure` si no puede.

## 6. Comunicación en Jason

### ¿Qué forma tiene un mensaje recibido en Jason y cómo se envía?
Tiene la forma ⟨emisor, fuerza ilocutoria, contenido⟩, que es el $F(P)$ de los actos de habla. Se envía con `.send(receptor, fuerza, contenido)` o con `.broadcast(fuerza, contenido)`.

### En Jason, ¿qué efecto tiene `.send(r, tell, c)` ejecutado por `s`?
El receptor `r` añade la creencia `c[source(s)]`. Es decir, `s` pretende que `r` crea lo que `s` cree.

### En Jason, ¿qué efecto tiene `.send(r, untell, c)` ejecutado por `s`?
`r` quita de `c` solo la anotación `source(s)`. Las demás anotaciones de fuente de esa creencia se conservan.

### En Jason, ¿qué evento se genera en el receptor con `achieve`?
`+!c[source(s)]`, es decir, `s` delega el objetivo `c` en `r`. La anotación permite decidir en un plan si `r` actúa o no.

### En Jason, ¿qué hace `unachieve`?
Ejecuta `.drop_desire(c)` en el receptor, que abandona sus intenciones sobre `c` sin generar un evento de fallo.

### En Jason, ¿qué diferencia hay entre `askOne` y `askAll`?
`askOne` devuelve la primera instancia de `c` que cumple la base de creencias del receptor. `askAll` devuelve la lista de todas las instancias, y la lista es vacía si no cree nada que unifique.

### En Jason, ¿cuándo es síncrono un `askOne`?
Cuando lleva un cuarto argumento, como en `.send(r, askOne, open(Door), Reply)`. La intención del emisor se suspende hasta recibir la respuesta, que se unifica con `Reply`. Sin ese cuarto argumento es asíncrono y la intención sigue.

### En Jason, ¿cómo responde el receptor a un `askOne`?
Con un plan predefinido que usa un objetivo de prueba. Si la información no está en la base de creencias, el receptor puede ejecutar un plan que la obtenga.

### En Jason, ¿qué hacen `tellHow` y `untellHow`?
`tellHow` añade a la biblioteca de planes del receptor el plan que viaja en el contenido, como cadena de texto. `untellHow` quita el plan cuya etiqueta va en el contenido.

### En Jason, ¿para qué hay que etiquetar un plan que se envía con `tellHow`?
Para poder retirarlo después con `untellHow`, que identifica el plan por su etiqueta.

### En Jason, ¿qué hace `askHow`?
Pide al receptor sus planes relevantes para un disparador, y los que devuelve se añaden a la biblioteca de planes del emisor.

### ¿Por qué importa la anotación de fuente al comunicar agentes en Jason?
Porque distingue lo que el agente ha percibido, lo que le han comunicado y lo que se ha dicho a sí mismo. Es la base para decidir de quién fiarse.

### Problema: di qué efecto tiene cada `.send` de Jason en el receptor
El agente `bob` cree `puerta(abierta)[source(ana), source(luz)]`. Ana ejecuta, en este orden, `.send(bob, untell, puerta(abierta))`, `.send(bob, tell, temp(20))` y `.send(bob, achieve, cerrar(puerta))`. ¿Qué creencias y eventos hay en `bob` al final?
#### Paso 1
`untell` quita solo la anotación `source(ana)`. La creencia `puerta(abierta)` se conserva con `source(luz)`.
#### Paso 2
`tell` añade la creencia `temp(20)[source(ana)]`.
#### Paso 3
`achieve` crea el evento `+!cerrar(puerta)[source(ana)]`. Ana le delega ese objetivo y un plan de `bob` puede mirar la anotación para decidir si actúa.
#### Paso 4
Al final, `bob` tiene `puerta(abierta)[source(luz)]` y `temp(20)[source(ana)]`, y un evento pendiente de objetivo `cerrar(puerta)`.
