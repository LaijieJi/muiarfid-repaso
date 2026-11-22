# SMA U1 - Capacidad social

## 1. Comunicar y compartir terminología

### ¿Qué es la capacidad social de un agente?
Es su capacidad de interactuar con otros agentes mediante cooperación, coordinación y negociación. Como mínimo, exige saber comunicarse.

### ¿Qué es la negociación entre agentes?
Como capacidad social, es la capacidad de alcanzar acuerdos sobre temas de interés común, con ofertas, contraofertas y compromisos de cada parte. Como concepto del tema de negociación, es el método o proceso que siguen las partes para llegar a un acuerdo. Si un test ofrece las dos redacciones, las claves de los exámenes de AIN dan por correcta la del método o proceso ❓ (la diapositiva de capacidad social usa «capacidad»).

### ¿Qué es una ontología y por qué la necesitan dos agentes que se comunican?
Es la especificación de un conjunto de términos que da una base común de comprensión sobre un dominio. Sin ella, palabras como «talla» o «comprar» podrían significar cosas distintas para cada agente. Una ontología no es un lenguaje, y para definirlas el Knowledge Sharing Effort propone Ontolingua.

### ¿Cuáles son los lenguajes de comunicación de agentes que presentan las transparencias?
KQML y FIPA ACL. KIF no es uno de ellos, porque sirve para intercambiar conocimiento, es decir, el contenido. Ontolingua define ontologías y SL describe el estado de los agentes dentro de FIPA ACL.

### ¿Qué lenguaje del Knowledge Sharing Effort cubre la sintaxis, cuál la semántica y cuál la pragmática?
| Nivel | Lenguaje |
|---|---|
| Sintaxis | KIF, para intercambiar conocimiento |
| Semántica | Ontolingua, para definir ontologías |
| Pragmática | KQML, para comunicar agentes |

Solo KQML es un lenguaje de mensajes entre agentes. En los ejemplos de KQML, KIF aparece en `:language`, como lenguaje del contenido.

## 2. Modelos de comunicación

### ¿De qué tres formas pueden interactuar los agentes?
Mediante acciones sobre el entorno, mediante una pizarra compartida o mediante paso de mensajes.

### ¿Cómo se comunican los agentes con una pizarra y qué inconveniente tiene?
Comparten una zona de trabajo común, sin comunicación directa entre ellos. Es un método flexible que no afecta a la arquitectura de los agentes. Sin embargo, la estructura central es un cuello de botella cuando los agentes están repartidos por una red.

### ¿Qué ventaja y qué exigencia tiene el paso de mensajes?
Ventaja: la comunicación es directa y permite muchas estrategias de interacción. Exigencia: hacen falta protocolos, y todos los agentes deben conocer la semántica del lenguaje.

## 3. Actos de habla

### ¿Cuáles son los cinco tipos de actos de habla de Searle?
| Tipo | Qué hace |
|---|---|
| Asertivo | da información sobre el mundo |
| Directivo | pide algo al destinatario |
| De promesa | compromete al locutor a hacer algo |
| Expresivo | muestra el estado mental del locutor |
| Declarativo | decir algo es ya hacerlo |

### ¿Qué tres componentes tiene un acto de habla?
La locución es producir la frase con una gramática y un léxico. La ilocución es el acto que se realiza sobre el destinatario al declarar. La perlocución son los efectos sobre su estado, sus creencias o sus acciones.

### ¿Qué es la perlocución y en qué se diferencia de la ilocución?
La perlocución son los efectos que el acto ilocutorio produce en el estado del destinatario, en sus acciones, creencias y juicios, como convencer o persuadir. La ilocución es el acto que realiza quien habla al declarar. Los efectos recaen en el destinatario y no en el emisor. En «Cierra la puerta», la ilocución es que quien habla quiere que se cierre y la perlocución es que quien escucha la cierra de verdad.

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

### ¿Qué parámetros pertenecen a un mensaje KQML y cuáles solo existen en FIPA ACL?
| Lenguaje | Parámetros |
|---|---|
| KQML | `:sender`, `:receiver`, `:content`, `:language`, `:ontology`, `:reply-with`, `:in-reply-to` |
| Solo FIPA ACL | `:envelope`, `:reply_by`, `:protocol`, `:conversation-id` |

`:language` es el lenguaje del contenido y `:ontology` es la ontología de sus términos. `:reply-with` etiqueta un mensaje cuando se espera respuesta y `:in-reply-to` repite esa etiqueta en la respuesta. Por tanto, `:conversation-id` no es un parámetro de KQML.

### ¿Qué diferencia hay entre `ask-if`, `ask-one` y `ask-about` en KQML?
`ask-if` pregunta si una expresión está en la base de conocimiento del receptor. `ask-one` pide que el receptor conteste a una pregunta. `ask-about` pide todo lo que el receptor sabe sobre la expresión.

### ¿Qué pide la performativa `achieve` de KQML?
Que el receptor haga verdadera la expresión en su base de conocimiento. Es la forma de delegarle un objetivo.

### ¿Qué hace la performativa `advertise` de KQML?
El emisor anuncia que está preparado para responder a una performativa. Es lo que hace un agente ante un facilitador para que lo encuentren.

### En KQML, ¿qué hace un facilitador y qué distingue al patrón `broker` de `recruit` y `recommend-one`?
El facilitador conecta a quien pregunta con el agente que sabe responder, que antes se ha anunciado con `advertise`.
| Patrón | Qué hace el facilitador | Quién contesta a quien preguntó |
|---|---|---|
| `broker` | pide él la respuesta al agente que sabe y la reenvía | el facilitador |
| `recruit` | reenvía la pregunta al agente que sabe | ese agente, directamente |
| `recommend-one` | solo da el nombre del agente | ese agente, cuando quien preguntó le consulta |

Lo que distingue al broker es que todas las comunicaciones pasan a través de él. Un facilitador que se limita a poner en contacto a solicitantes con proveedores no actúa como broker.

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

### ¿Qué diferencia hay entre `failure` y `not-understood` en FIPA ACL?
`not-understood` indica que el receptor no ha entendido el mensaje. `failure` indica que el receptor intentó la acción pedida y no pudo realizarla.

### ¿En qué se diferencian los protocolos FIPA-query y FIPA-request y cuál es la respuesta normal de cada uno?
| | FIPA-query | FIPA-request |
|---|---|---|
| Qué pide el iniciador | información, es decir, una acción de tipo `inform` | que el receptor realice una acción |
| Mensaje inicial | `query-if` (sí o no) o `query-ref` (un valor) | `request` |
| Respuesta normal | directamente un `inform`, sin `agree` | `agree` y, al terminar, `inform-done` o `inform-ref` |
| Otras respuestas | `not-understood`, `refuse`, `failure` | `not-understood`, `refuse`, `failure` |

### ¿Para qué sirve FIPA-contract-net y cómo es su secuencia?
Se usa cuando un agente quiere que se haga una acción, hay varios candidatos y se quiere minimizar una función de la tarea, como el precio. El iniciador manda `cfp` y cada candidato contesta `refuse`, `not-understood` o `propose` antes del plazo. Después el iniciador decide entre `reject-proposal` y `accept-proposal`, y el elegido termina con `failure`, `inform-done` o `inform-ref`.

### En la finalización normal de FIPA-contract-net, ¿qué manda el iniciador y a quién?
Manda `accept-proposal` al participante con cuya oferta se queda y `reject-proposal` al resto de los que hicieron `propose`. No manda `inform-done` a todos, porque lo envía el elegido al terminar. Tampoco manda `agree`, que no forma parte de este protocolo.

### ¿Qué añade FIPA-iterated-contract-net y qué puede responder el iniciador a un `propose`?
Añade varias rondas. Ante los `propose`, el iniciador puede aceptar una oferta con `accept-proposal`, rechazarlas todas con `reject-proposal` o emitir un `cfp` revisado, que abre otra ronda. Un `inform` no es una respuesta válida a un `propose`, porque lo envía el participante cuya oferta se acepta.

### ¿Qué diferencia hay entre FIPA-brokering y FIPA-recruiting?
En ambos, el broker envía la petición a un conjunto de agentes. En brokering el broker proporciona las respuestas, mientras que en recruiting los agentes las envían al iniciador. Es la misma diferencia que entre `broker` y `recruit` de KQML.

### Problema: traza una ronda de FIPA-contract-net y su versión iterada
Un iniciador `I` quiere contratar el transporte de un palé y minimizar el precio. Consulta a cuatro transportistas `P`, `Q`, `R` y `S`. `P` ofrece 48 euros, `Q` ofrece 52, `R` ofrece 45 y `S` rechaza porque no tiene camión libre. ¿A quién acepta `I` y qué manda al resto? Supón ahora que `I` usa en su lugar la versión iterada y, en vez de aceptar, emite un `cfp` revisado que pide menos de 45 euros. `P` ofrece 41, `Q` ofrece 44 y `R` contesta `refuse` porque no puede bajar de 45. ¿Cómo termina?
#### Paso 1
`I` manda un `cfp` a los cuatro. `P`, `Q` y `R` contestan `propose` con 48, 52 y 45. `S` contesta `refuse`.
#### Paso 2
Se minimiza el precio. La oferta mínima es 45, de `R`. `I` manda `accept-proposal` a `R` y `reject-proposal` a `P` y `Q`. `S` ya había rechazado, así que no recibe nada.
#### Paso 3
Con la versión iterada, `I` no cierra la ronda y emite un `cfp` revisado que pide menos de 45 euros. `P` y `Q` mejoran con `propose` de 41 y 44, mientras que `R` contesta `refuse`, de modo que ya no compite.
#### Paso 4
La mejor oferta de la segunda ronda es 41, de `P`. `I` manda `accept-proposal` a `P` y `reject-proposal` a `Q`. `R` no recibe nada, igual que `S` en la primera ronda. Al final, `P` informa de que ha entregado el palé o contesta `failure` si no puede.

## 6. Comunicación en Jason

### ¿Qué forma tiene un mensaje recibido en Jason y cómo se envía?
Tiene la forma ⟨emisor, fuerza ilocutoria, contenido⟩, que es el $F(P)$ de los actos de habla. Se envía con `.send(receptor, fuerza, contenido)` o con `.broadcast(fuerza, contenido)`.

### En Jason, ¿qué crea en el receptor un `.send(r, tell, c)` y qué crea un `.send(r, achieve, c)`?
| Fuerza | Qué crea en el receptor `r` |
|---|---|
| `tell` | la creencia `c[source(s)]` en su base de creencias, porque `s` pretende que `r` crea lo que `s` cree |
| `achieve` | el evento de objetivo `+!c[source(s)]`, porque `s` le delega el objetivo `c` |

`tell` no crea ningún objetivo ni cambia nada en el emisor. Con `achieve`, un plan del receptor puede mirar la anotación para decidir si actúa.

### En Jason, ¿cuándo es síncrono un `askOne`?
Cuando lleva un cuarto argumento, como en `.send(r, askOne, open(Door), Reply)`. La intención del emisor se suspende hasta recibir la respuesta, que se unifica con `Reply`. Sin ese cuarto argumento es asíncrono y la intención sigue.

### En Jason, ¿qué hacen `tellHow`, `untellHow` y `askHow`?
`tellHow` añade a la biblioteca de planes del receptor el plan que viaja en el contenido, como cadena de texto. `untellHow` quita el plan cuya etiqueta va en el contenido, de modo que conviene etiquetar el plan al enviarlo. `askHow` pide los planes relevantes para un disparador y se añaden a la biblioteca del emisor, sin cuarto argumento de respuesta.

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
Al final, `bob` tiene `puerta(abierta)[source(luz)]` y `temp(20)[source(ana)]`, y el evento `+!cerrar(puerta)[source(ana)]` pendiente de tratar, además del evento de adición de creencia que genera el `tell`.
