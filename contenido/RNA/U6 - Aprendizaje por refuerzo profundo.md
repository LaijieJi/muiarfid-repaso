# RNA U6 - Aprendizaje por refuerzo profundo

## 1. Introduction

### ¿Qué busca el aprendizaje por refuerzo (RL, reinforcement learning)?
Agentes autónomos que aprenden estrategias óptimas de decisión secuencial interactuando con un entorno. El agente descubre la conducta óptima por prueba y error, a partir de una recompensa escalar y sin ejemplos etiquetados de la acción correcta.

### ¿En qué se diferencia la señal de aprendizaje del RL de la del aprendizaje supervisado?
En supervisado, cada entrada trae su salida correcta. En RL solo hay una recompensa escalar que dice cuánto ha valido lo ocurrido, pero no qué acción habría sido la buena.

### ¿Qué es el dilema entre exploración y explotación?
El agente debe equilibrar probar acciones nuevas, que pueden descubrir algo mejor, con ejecutar las acciones que ya sabe que dan buena recompensa. Si solo explota, puede quedarse en una estrategia mediocre.

### ¿Qué es el problema de la asignación de crédito con recompensas retardadas?
Una acción ejecutada en el paso $t$ puede influir en recompensas que llegan muchos pasos después. Por tanto, al recibir una recompensa no está claro a cuál de las acciones anteriores se debe.

### ¿Por qué en RL los datos de entrenamiento no son estacionarios?
Porque la política del agente decide qué estados visita y, por tanto, qué datos observa. Al cambiar la política durante el aprendizaje, cambia también la distribución de los datos con los que se entrena.

### ¿Qué ocurre en cada paso entre el agente y el entorno?
El agente ejecuta una acción $a_t \sim \pi_\theta(\cdot)$ según el estado $s_t$. El entorno produce una recompensa $r_t$ y pasa al estado $s_{t+1}$ según la función de transición $p(s_{t+1} \mid s_t, a_t)$.

### ¿Cómo se obtiene la política en DQN, si $\pi_\theta$ aparece en la notación del RL?
DQN no tiene una red de política. Aprende una red de valor $Q(s,a;\theta)$ y la política es voraz: se escoge la acción de mayor valor. La notación $\pi_\theta$ del inicio del tema describe el marco general, y los métodos que optimizan una red de política directamente no se desarrollan.

## 2. Markov Decision Process

### ¿Qué componentes tiene un proceso de decisión de Markov (MDP)?
Una tupla $M = (S, A, P, R, \rho_0, \gamma)$: estados, acciones, modelo de transición $P(s_{t+1} \mid s_t, a_t)$, función de recompensa $R(s_t, a_t, s_{t+1})$, distribución del estado inicial $\rho_0 = p(s_0)$ y factor de descuento $\gamma \in [0,1)$.

### ¿Qué dice la propiedad de Markov?
Que el futuro depende solo del estado y la acción actuales y no de la historia anterior:

$$p(s_{t+1} \mid s_t, a_t, s_{t-1}, a_{t-1}, \dots, s_0, a_0) = p(s_{t+1} \mid s_t, a_t).$$

### ¿Qué papel tiene el estado inicial $\rho_0$ en un MDP?
Es la distribución de probabilidad de la que se sortea $s_0$ al empezar cada episodio. El objetivo del agente se promedia sobre ella.

### ¿Cómo se define el retorno $G_t$ en un MDP?
Es la suma descontada de las recompensas futuras desde el paso $t$:

$$G_t = \sum_{k=0}^{\infty} \gamma^k r(s_{t+k}, a_{t+k}) = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \dots$$

El exponente es $k$, el número de pasos hacia el futuro, y no $t$.

### ¿Qué relación recursiva cumple el retorno?
$G_t = r_t + \gamma G_{t+1}$. El retorno de ahora es la recompensa inmediata más el retorno del paso siguiente descontado una vez. Esta igualdad es el punto de partida de las ecuaciones de Bellman.

### ¿Para qué sirve el factor de descuento $\gamma$ y por qué se exige $\gamma < 1$?
Pondera menos las recompensas lejanas y hace que el retorno de un horizonte infinito sea finito. Si $\lvert r\rvert \le r_{\max}$, entonces $\lvert G_t\rvert \le r_{\max}/(1-\gamma)$ por la suma geométrica.

### ¿Cómo cambia la conducta del agente con $\gamma$ cercano a 0 y con $\gamma$ cercano a 1?
Con $\gamma$ cerca de 0 solo importa la recompensa inmediata y el agente es miope. Con $\gamma$ cerca de 1 las recompensas lejanas pesan casi igual que las próximas y el agente planifica a largo plazo.

### ¿Cuál es el objetivo del agente en un MDP?
Encontrar la política óptima $\pi^*$ que maximiza el retorno esperado:

$$\pi^* = \arg\max_\pi \mathbb{E}_{\tau \sim \pi}[G_t].$$

### ¿Qué es una trayectoria $\tau$ y por qué el retorno se promedia con una esperanza?
Es la secuencia $\tau = (s_t, a_t, s_{t+1}, a_{t+1}, \dots)$ generada al seguir la política en el entorno. Es aleatoria porque lo son la política $\pi(a \mid s)$, las transiciones y el estado inicial, de modo que se maximiza el retorno medio y no el de una trayectoria concreta.

### Problema: retorno descontado de una trayectoria corta
Un episodio da las recompensas $r_0 = 2$, $r_1 = -1$, $r_2 = 3$ y $r_3 = 4$, y después termina. Con $\gamma = 0{,}9$, calcula $G_0$ con la definición y de nuevo con la recursión $G_t = r_t + \gamma G_{t+1}$. Calcula también $G_0$ con $\gamma = 1$.

#### Paso 1
Con la definición:

$$G_0 = 2 + 0{,}9(-1) + 0{,}9^2(3) + 0{,}9^3(4) = 2 - 0{,}9 + 2{,}43 + 2{,}916 = 6{,}446.$$

#### Paso 2
Con la recursión, de atrás hacia delante, con $G_4 = 0$ porque el episodio termina:

$$G_3 = 4,\quad G_2 = 3 + 0{,}9 \cdot 4 = 6{,}6,\quad G_1 = -1 + 0{,}9 \cdot 6{,}6 = 4{,}94,\quad G_0 = 2 + 0{,}9 \cdot 4{,}94 = 6{,}446.$$

#### Paso 3
Con $\gamma = 1$ no hay descuento y $G_0 = 2 - 1 + 3 + 4 = 8$. Con $\gamma = 0{,}9$ pesan menos las recompensas lejanas y el retorno baja a 6,446.

## 3. Value Function Algorithms

### ¿Qué es la función de valor de estado $V^\pi(s)$?
El retorno esperado al partir del estado $s$ en el paso $t$ y seguir la política $\pi$:

$$V^\pi(s) = \mathbb{E}_{\tau \sim \pi}[G_t \mid s_t = s].$$

### ¿Qué paso permite pasar de la definición de $V^\pi(s)$ a su ecuación de Bellman?
Sustituir $G_t = r_t + \gamma G_{t+1}$ dentro de la esperanza y descomponer esta según la acción $a$ y el estado siguiente $s'$. Dado $s_{t+1}=s'$, el término $\mathbb{E}[G_{t+1}]$ es $V^\pi(s')$, y queda $\gamma V^\pi(s')$ dentro de la suma.

### ¿Cuál es la ecuación de Bellman de esperanza para $V^\pi$?
$$V^\pi(s) = \sum_{a \in A} \pi(a \mid s) \sum_{s' \in S} P(s' \mid s, a)\left[R(s,a,s') + \gamma V^\pi(s')\right].$$

### ¿Qué significan las dos sumas de la ecuación de Bellman de $V^\pi$?
La primera promedia sobre las acciones según la política $\pi(a \mid s)$. La segunda promedia, para cada acción, sobre los estados siguientes según el modelo $P(s' \mid s, a)$. Dentro va la recompensa inmediata más el valor descontado del estado siguiente.

### ¿Qué es $R(s,a,s')$ cuando se escribe la ecuación de Bellman?
La recompensa esperada de la transición, $R(s,a,s') = \mathbb{E}[r(s,a) \mid s_t = s, a_t = a, s_{t+1} = s']$. Con ella se colapsa la suma sobre las recompensas posibles.

### ¿Qué es la función de valor de acción $Q^\pi(s,a)$?
El retorno esperado al partir de $s$, ejecutar la acción $a$ de inmediato y seguir después la política $\pi$:

$$Q^\pi(s,a) = \mathbb{E}_{\tau \sim \pi}[G_t \mid s_t = s, a_t = a].$$

### ¿Cómo se obtiene $V^\pi(s)$ a partir de $Q^\pi(s,a)$?
Promediando $Q^\pi$ sobre las acciones con las probabilidades de la política:

$$V^\pi(s) = \sum_{a} \pi(a \mid s)\, Q^\pi(s,a).$$

### ¿Cómo se obtiene $Q^\pi(s,a)$ a partir de $V^\pi$?
Con la recompensa inmediata más el valor descontado del estado siguiente, promediado con el modelo de transición:

$$Q^\pi(s,a) = \sum_{s'} P(s' \mid s, a)\left[R(s,a,s') + \gamma V^\pi(s')\right].$$

### ¿Cuál es la ecuación de Bellman de esperanza para $Q^\pi$?
$$Q^\pi(s,a) = \sum_{s'} P(s' \mid s, a)\left[R(s,a,s') + \gamma \sum_{a'} \pi(a' \mid s')\, Q^\pi(s',a')\right].$$

Es la de $V^\pi$ con la acción $a$ ya fijada. Se obtiene sustituyendo $V^\pi(s') = \sum_{a'}\pi(a'\mid s')Q^\pi(s',a')$ en $Q^\pi(s,a) = \sum_{s'}P(s'\mid s,a)[R + \gamma V^\pi(s')]$.

### ¿Qué ventaja tiene $Q^\pi(s,a)$ frente a $V^\pi(s)$ para decidir qué hacer?
Permite comparar las acciones de un estado directamente, sin necesitar el modelo de transición. Con $V^\pi$ habría que mirar los estados siguientes de cada acción, y para eso hace falta $P$.

### Problema: $V^\pi$ y $Q^\pi$ en un estado con dos acciones
Desde un estado $s$ hay dos acciones y la política es $\pi(a_1 \mid s) = 0{,}6$ y $\pi(a_2 \mid s) = 0{,}4$. La acción $a_1$ lleva a $s_1$ con probabilidad 0,5 y recompensa 2, o a $s_2$ con probabilidad 0,5 y recompensa 0. La acción $a_2$ lleva a $s_2$ con probabilidad 1 y recompensa 1. Se conoce $V^\pi(s_1) = 4$ y $V^\pi(s_2) = 0$, con $\gamma = 0{,}9$. Calcula $Q^\pi(s, a_1)$, $Q^\pi(s, a_2)$ y $V^\pi(s)$. ¿Qué acción es mejor en $s$?

#### Paso 1
Para la acción $a_1$:

$$Q^\pi(s,a_1) = 0{,}5\,(2 + 0{,}9 \cdot 4) + 0{,}5\,(0 + 0{,}9 \cdot 0) = 0{,}5 \cdot 5{,}6 + 0 = 2{,}8.$$

#### Paso 2
Para la acción $a_2$:

$$Q^\pi(s,a_2) = 1\,(1 + 0{,}9 \cdot 0) = 1.$$

#### Paso 3
El valor del estado promedia con la política:

$$V^\pi(s) = 0{,}6 \cdot 2{,}8 + 0{,}4 \cdot 1 = 1{,}68 + 0{,}4 = 2{,}08.$$

#### Paso 4
La acción $a_1$ vale más ($2{,}8 > 1$), así que es la mejor en $s$. Aun así $V^\pi(s) = 2{,}08$ queda por debajo de $Q^\pi(s,a_1)$, porque la política $\pi$ elige $a_2$ el 40 % de las veces.

### Demostración: ecuación de Bellman de esperanza para $V^\pi$
Parte de $V^\pi(s) = \mathbb{E}_{\tau\sim\pi}[G_t \mid s_t = s]$ y llega a $V^\pi(s) = \sum_a \pi(a\mid s)\sum_{s'}P(s'\mid s,a)[R(s,a,s') + \gamma V^\pi(s')]$.

#### Paso 1
Se escribe $G_t = r_t + \gamma G_{t+1}$ y se saca el factor: $V^\pi(s) = \mathbb{E}[r_t + \gamma G_{t+1} \mid s_t = s]$.

#### Paso 2
Se condiciona en la acción y en el estado siguiente: $p(a, s' \mid s) = \pi(a\mid s)\,P(s'\mid s,a)$, de modo que $V^\pi(s) = \sum_a \pi(a\mid s)\sum_{s'}P(s'\mid s,a)\,\mathbb{E}[r_t + \gamma G_{t+1} \mid s, a, s']$.

#### Paso 3
Con $R(s,a,s') = \mathbb{E}[r_t \mid s,a,s']$ y la propiedad de Markov, $\mathbb{E}[G_{t+1}\mid s,a,s'] = \mathbb{E}[G_{t+1}\mid s_{t+1}=s'] = V^\pi(s')$. Sustituyendo queda la ecuación buscada.

## 4. Optimal Policy

### ¿Qué son $V^*$, $Q^*$ y $\pi^*$?
$V^*(s) = \max_\pi V^\pi(s)$ y $Q^*(s,a) = \max_\pi Q^\pi(s,a)$ son los mayores valores alcanzables por cualquier política. La política óptima $\pi^*$ alcanza el máximo retorno esperado desde todos los estados a la vez.

### ¿Qué relación hay entre $V^*$ y $Q^*$?
$V^*(s) = \max_{a} Q^*(s,a)$. Bajo la política óptima, el valor de un estado es el de su mejor acción.

### ¿Cuál es la ecuación de Bellman de optimalidad para $Q^*$?
$$Q^*(s,a) = \sum_{s'} P(s' \mid s, a)\left[R(s,a,s') + \gamma \max_{a'} Q^*(s',a')\right].$$

### ¿Qué cambia entre la ecuación de Bellman de esperanza y la de optimalidad?
En la de esperanza, $Q^\pi(s,a)=\sum_{s'}P(s'\mid s,a)[R+\gamma\sum_{a'}\pi(a'\mid s')Q^\pi(s',a')]$, se promedia sobre $a'$ con la política. En la de optimalidad el promedio se sustituye por $\max_{a'}$, porque la política óptima elige siempre la mejor acción.

### ¿Cómo se obtiene la política óptima a partir de $Q^*$?
Con la política voraz (greedy): $\pi^*(s) = \arg\max_{a} Q^*(s,a)$. No hace falta conocer las probabilidades de transición $P(s' \mid s, a)$.

### ¿Por qué conviene aprender $Q^*$ y no $V^*$ para obtener la política sin modelo?
Con $Q^*$ basta mirar el valor de cada acción en el estado actual y quedarse con el mayor. Con $V^*$ habría que predecir a qué estado lleva cada acción, y eso exige el modelo $P$, que el agente no conoce.

### Problema: valores óptimos en una cadena determinista
Una cadena tiene los estados $s_0, s_1, s_2, s_3$ con $s_3$ final. En cada estado la acción $R$ avanza al siguiente y la acción $L$ retrocede (en $s_0$ se queda). Solo da recompensa la transición $s_2 \to s_3$, que vale 10. Con $\gamma = 0{,}9$, calcula $Q^*(s_2,R)$, $Q^*(s_1,R)$ y $Q^*(s_0,R)$, suponiendo que avanzar es lo óptimo en los tres estados. Comprueba además que $Q^*(s_1,L) < Q^*(s_1,R)$.

#### Paso 1
Desde $s_2$ se llega al estado final con recompensa 10 y no queda futuro:

$$Q^*(s_2,R) = 10 + 0{,}9 \cdot 0 = 10.$$

#### Paso 2
Desde $s_1$ se llega a $s_2$ con recompensa 0, y allí lo mejor vale $\max_{a'} Q^*(s_2,a') = 10$:

$$Q^*(s_1,R) = 0 + 0{,}9 \cdot 10 = 9.$$

#### Paso 3
De la misma forma, desde $s_0$:

$$Q^*(s_0,R) = 0 + 0{,}9 \cdot 9 = 8{,}1.$$

El valor de la recompensa final se multiplica por $\gamma$ una vez por cada transición con recompensa 0 que queda antes de cobrarla: $Q^*(s_k,R)=10\,\gamma^{\,2-k}$ para $k=0,1,2$.

#### Paso 4
Retroceder desde $s_1$ lleva a $s_0$, cuyo mejor valor es 8,1. Por tanto $Q^*(s_1,L) = 0 + 0{,}9 \cdot 8{,}1 = 7{,}29 < 9 = Q^*(s_1,R)$, y avanzar es óptimo en $s_1$.

## 5. Q-Learning Algorithm

### ¿Qué idea tiene Q-learning para aprender $Q^*$?
Se ve como descenso de gradiente estocástico sobre un error cuadrático. Para cada par $(s,a)$ se quiere que $Q(s,a)$ se acerque al objetivo que dicta la ecuación de Bellman de optimalidad.

### ¿Qué es el objetivo $Y^*(s,a)$ de Q-learning?
El valor que $Q^*(s,a)$ debería tener según Bellman:

$$Y^*(s,a) = \mathbb{E}\left[r(s,a) + \gamma\,(1 - \text{goal}(s'))\max_{a'} Q^*(s',a') \mid s,a\right].$$

### ¿Para qué sirve el factor $(1 - \text{goal}(s'))$ en el objetivo?
Vale 0 si $s'$ es un estado final y 1 en caso contrario. Así, al llegar a la meta no se suma valor futuro, porque ya no hay más recompensas después.

### ¿Qué pérdida minimiza Q-learning y por qué lleva un factor $\tfrac{1}{2}$?
$J(Q(s,a)) = \tfrac{1}{2}\left(Y^*(s,a) - Q(s,a)\right)^2$. El factor $\tfrac{1}{2}$ cancela el 2 que aparece al derivar y deja un gradiente más limpio.

### ¿Cuál es el gradiente de la pérdida de Q-learning respecto a $Q(s,a)$?
$$\frac{\partial J}{\partial Q(s,a)} = -\left(Y^*(s,a) - Q(s,a)\right).$$

Se trata el objetivo como constante y solo se deriva respecto a $Q(s,a)$. Con el objetivo de una muestra, que usa la propia tabla en $s_{t+1}$, no se deriva a través de ese término (semigradiente), de modo que la regla no es el gradiente exacto de una pérdida fija.

### ¿Por qué no se puede calcular $Y^*(s,a)$ de forma exacta y qué se hace?
Porque la esperanza usa $P(s' \mid s, a)$, que el agente no conoce. Se sustituye por la muestra observada en el paso $t$:

$$Y(s_t,a_t,s_{t+1}) = R + \gamma\,(1 - \text{goal}(s_{t+1}))\max_{a_{t+1}} Q(s_{t+1},a_{t+1}).$$

### ¿Cuál es la regla de actualización de Q-learning?
Se avanza en sentido contrario al gradiente:

$$Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha\left[R + \gamma(1 - \text{goal}(s_{t+1}))\max_{a_{t+1}} Q(s_{t+1},a_{t+1}) - Q(s_t,a_t)\right].$$

### ¿Qué papel tiene $\alpha$ en la regla de Q-learning?
Es la tasa de aprendizaje del descenso de gradiente. Con $\alpha = 1$ la estimación pasa a valer el objetivo de golpe, y con $\alpha$ pequeño se acerca a él solo una fracción de la distancia.

### ¿Qué es el bootstrapping en Q-learning y qué consecuencia tiene?
El objetivo se construye con la propia tabla $Q$ en el estado siguiente, es decir, se actualiza una estimación con otra estimación. Por tanto el objetivo cambia a medida que cambia la tabla, y el valor de la recompensa se propaga hacia atrás un paso cada vez que se visita el estado anterior.

### ¿Por qué el objetivo de Q-learning usa el máximo y no el valor de la acción que el agente ejecutará a continuación?
Porque aprende $Q^*$, el valor de la política óptima, y esa política elige la mejor acción en $s_{t+1}$. El agente puede explorar con $\epsilon$-greedy y ejecutar otra acción, pero el objetivo sigue usando el máximo.

### ¿Cómo se elige la acción durante el entrenamiento de Q-learning?
Con una política $\epsilon$-greedy. Con probabilidad $1-\epsilon$ se explota la acción $\arg\max_a Q(s,a)$ y con probabilidad $\epsilon$ se explora con una acción al azar.

### Con la tabla $Q$ a ceros y recompensa 0 en la primera transición, ¿por qué la actualización de Q-learning no cambia la tabla?
Porque la transición de $s=0$ a $s=1$ da recompensa 0 y todos los valores $Q$ valen 0 al empezar. El objetivo es $0 + 0{,}9 \cdot 0 = 0$, de modo que no hay nada que corregir.

### En una cadena $0 \to 1 \to 2$ ($2$ final, recompensa 10 al pasar de $1$ a $2$, $\alpha=0{,}5$, $\gamma=0{,}9$, tabla a ceros), ¿cómo llega la recompensa a $Q(0,R)$?
La información llega a $Q(0,R)$ a través de $\max_{a'} Q(1,a')$. Primero $Q(1,R)$ pasa de 0 a $0{,}5\,(10) = 5$. En una iteración posterior, $Q(0,R) = 0{,}5\,(0 + 0{,}9 \cdot 5 - 0) = 2{,}25$ y después $Q(1,R) = 5 + 0{,}5\,(10 - 5) = 7{,}5$.

### En esa misma cadena $0 \to 1 \to 2$ con $\gamma=0{,}9$, ¿a qué valores converge la tabla y qué política da?
A $Q^*(0,R) = 9$ y $Q^*(1,R) = 10$, que son los valores descontados de la recompensa de 10. La política voraz elige $R$ en los dos estados.

### Problema: una actualización de Q-learning y el efecto del estado final
Hay estados $0, 1, 2$ con $2$ final, acciones $L$ y $R$, $\alpha = 0{,}5$ y $\gamma = 0{,}9$. La tabla es $Q(0,R) = 3$, $Q(1,L) = 2$ y $Q(1,R) = 4$. El agente hace $R$ en $0$, recibe 1 y llega a $1$. Después hace $R$ en $1$, recibe 10 y llega a $2$. Aplica las dos actualizaciones. Para ver el papel de $(1 - \text{goal})$, repite la segunda suponiendo, por error, que $\max_{a'} Q(2,a') = 5$ y que no se multiplica por $(1-\text{goal})$.

#### Paso 1
Primera transición. El estado $1$ no es final, así que $\max_{a'} Q(1,a') = \max(2,4) = 4$:

$$Q(0,R) = 3 + 0{,}5\,(1 + 0{,}9 \cdot 4 - 3) = 3 + 0{,}5 \cdot 1{,}6 = 3{,}8.$$

#### Paso 2
Segunda transición. El estado $2$ es final y $\text{goal}(2) = 1$, así que no hay término futuro:

$$Q(1,R) = 4 + 0{,}5\,(10 + 0 - 4) = 4 + 3 = 7.$$

#### Paso 3
Con el error, el objetivo sería $10 + 0{,}9 \cdot 5 = 14{,}5$ y quedaría $Q(1,R) = 4 + 0{,}5\,(14{,}5 - 4) = 9{,}25$. Sale un valor inflado porque se suma un futuro que no existe. El estado final no tiene valor propio.

### Demostración: la regla de actualización de Q-learning como un paso de descenso de gradiente
Parte de $J = \tfrac{1}{2}(Y - Q(s_t,a_t))^2$, con $Y$ el objetivo de una muestra tratado como constante, y llega a la regla de actualización.

#### Paso 1
Se deriva respecto a $Q(s_t,a_t)$ con la regla de la cadena:

$$\frac{\partial J}{\partial Q} = \tfrac{1}{2} \cdot 2\,(Y - Q) \cdot \frac{\partial (Y - Q)}{\partial Q} = (Y - Q)(-1) = -(Y - Q).$$

#### Paso 2
El descenso de gradiente mueve el parámetro en sentido contrario al gradiente:

$$Q \leftarrow Q - \alpha \frac{\partial J}{\partial Q} = Q + \alpha\,(Y - Q).$$

#### Paso 3
Se sustituye el objetivo de la muestra $Y = R + \gamma(1 - \text{goal}(s_{t+1}))\max_{a'} Q(s_{t+1},a')$ y se obtiene la regla de Q-learning. Cuando el error $Y - Q$ es positivo, la estimación sube, y cuando es negativo, baja.

### Problema: tres episodios de Q-learning en una cadena
Hay tres estados $0, 1, 2$ y un estado final $3$. Solo existe la acción $R$, que avanza al estado siguiente. Solo da recompensa la transición $2 \to 3$, que vale 10. Con $\alpha = 0{,}5$, $\gamma = 0{,}8$ y $Q(s,R) = 0$ al empezar, haz tres episodios completos y en cada uno actualiza los estados en el orden $0, 1, 2$. Da la tabla tras cada episodio y compárala con los valores óptimos.

#### Paso 1
Episodio 1. $Q(0,R) = 0 + 0{,}5(0 + 0{,}8\cdot 0 - 0) = 0$. $Q(1,R) = 0$. $Q(2,R) = 0 + 0{,}5(10 + 0 - 0) = 5$ (el estado $3$ es final y no suma futuro).

#### Paso 2
Episodio 2. $Q(0,R) = 0{,}5(0 + 0{,}8\cdot 0) = 0$. $Q(1,R) = 0{,}5(0 + 0{,}8\cdot 5) = 2$. $Q(2,R) = 5 + 0{,}5(10 - 5) = 7{,}5$.

#### Paso 3
Episodio 3. $Q(0,R) = 0{,}5(0 + 0{,}8\cdot 2) = 0{,}8$. $Q(1,R) = 2 + 0{,}5(0 + 0{,}8\cdot 7{,}5 - 2) = 4$. $Q(2,R) = 7{,}5 + 0{,}5(10 - 7{,}5) = 8{,}75$.

#### Paso 4
Los valores óptimos son $Q^*(2,R) = 10$, $Q^*(1,R) = 8$ y $Q^*(0,R) = 6{,}4$. La información de la recompensa avanza un estado por episodio, y cada $Q$ se acerca a su óptimo sin alcanzarlo en tres episodios.

## 6. Deep Reinforcement Learning

### ¿Cómo representa los valores el Q-learning tabular?
Con una tabla $Q(s,a) \in \mathbb{R}^{|S| \times |A|}$, en la que cada par estado-acción es una celda con un valor escalar. Al observar una transición solo se actualiza la celda $(s_t, a_t)$.

### ¿Qué dos limitaciones tiene el Q-learning tabular?
No es viable en memoria, o directamente es imposible, con estados continuos o muy numerosos. Además, actualizar una celda no da información sobre los estados que no se han visitado, aunque sean parecidos.

### ¿Qué es una red Q profunda (DQN, Deep Q-Network)?
Una red neuronal $Q(s,a;\theta)$ con parámetros $\theta$ que aproxima $Q^*(s,a)$. Sustituye a la tabla.

### ¿Cuáles son la entrada y la salida de una DQN?
La entrada es el estado $s$ y la salida es un vector con el valor $Q$ predicho para cada acción posible. Una sola pasada hacia delante da los valores de todas las acciones, y de ahí se obtiene el máximo del objetivo.

### ¿Qué dos ventajas tiene DQN frente a la tabla?
Escala a estados de alta dimensión, como imágenes de videojuegos o robótica. Y generaliza: aprender el valor de una acción en un estado mejora la estimación en estados parecidos que no se han visitado.

### ¿Por qué no se puede actualizar una celda de $Q$ cuando se usa una red?
Porque no hay celdas. Los valores dependen de $\theta$, que se comparte entre todos los estados y acciones. Se plantea un problema de regresión por mínimos cuadrados sobre un lote de transiciones muestreadas $\mathcal{D}$ y se entrena $\theta$ por descenso de gradiente.

### ¿Cuál es la función de pérdida de una DQN?
$$J(\theta) = \frac{1}{2|\mathcal{D}|} \sum_{(s,a,s') \in \mathcal{D}} \left(Y(s,a,s';\theta^-) - Q(s,a;\theta)\right)^2,$$

con el objetivo $Y = R(s,a,s') + \gamma(1 - \text{goal}(s'))\max_{a'} Q(s',a';\theta^-)$.

### ¿Qué diferencia hay entre la red en línea (online) y la red objetivo (target) en DQN?
La red en línea, con parámetros $\theta$, es la que se entrena y da $Q(s,a;\theta)$. La red objetivo, con parámetros congelados $\theta^-$, solo se usa para calcular el objetivo $Y$ y no recibe gradiente.

### ¿Por qué se calcula el objetivo con una red congelada $\theta^-$?
Si el objetivo se calculara con $\theta$, cada actualización cambiaría a la vez la estimación y el objetivo, y la red perseguiría un objetivo que se mueve con ella. Al congelar $\theta^-$, el objetivo se mantiene estable durante varias actualizaciones.

### ¿Cuál es el gradiente de la pérdida de DQN respecto a $\theta$?
$$\frac{\partial J}{\partial \theta} = -\frac{1}{|\mathcal{D}|} \sum_{(s,a,s') \in \mathcal{D}} \left(Y(s,a,s';\theta^-) - Q(s,a;\theta)\right) \frac{\partial Q(s,a;\theta)}{\partial \theta}.$$

El error multiplica la derivada de la salida de la red, y esa derivada se calcula con retropropagación (backpropagation).

### En una DQN con una salida por acción, ¿qué salidas reciben gradiente en una muestra?
Solo la salida de la acción $a$ que se ejecutó en la transición. El error se define para $Q(s,a;\theta)$ y las salidas de las demás acciones no intervienen en la pérdida de esa muestra.

### ¿Cómo se actualizan los parámetros congelados $\theta^-$?
Con una media móvil de los parámetros de la red en línea:

$$\theta^- \leftarrow \tau\,\theta + (1-\tau)\,\theta^-, \qquad \tau \ll 1.$$

Así $\theta^-$ sigue a $\theta$ con retraso y cambia despacio.

### ¿En qué se diferencian el Q-learning tabular y DQN al actualizar los valores?
| | Tabular | DQN |
|---|---|---|
| Representación | tabla $Q \in \mathbb{R}^{\lvert S\rvert \times \lvert A\rvert}$ | red $Q(s,a;\theta)$ |
| Qué se actualiza | la celda $(s_t,a_t)$ | los parámetros $\theta$, que afectan a todos los estados |
| Datos por actualización | una transición | un lote $\mathcal{D}$ de transiciones |
| Objetivo | con la propia tabla | con la red congelada $\theta^-$ |
| Generalización | ninguna | entre estados parecidos |

### ¿Qué estado y qué salida se usan en la aplicación de DQN a videojuegos Atari?
El estado $s$ es la pila de los píxeles en bruto de los últimos 4 fotogramas, y la red devuelve $Q(s,a;\theta)$ para las 18 acciones posibles (posiciones del joystick y botones). Los puntos del juego se normalizan para dar una recompensa en cada paso.

### Problema: objetivo y pérdida de DQN con un lote de dos transiciones
Se usa $\gamma = 0{,}9$ y un lote $\mathcal{D}$ de dos transiciones. En la primera, el agente ejecutó la acción 1 en $s$, recibió 1 y llegó a $s'$, que no es final. La red en línea da $Q_1 = Q(s,1;\theta) = 2$, y la red objetivo da $Q(s',\cdot\,;\theta^-) = (3, 5)$. En la segunda, ejecutó la acción 0 en otro estado $s_2$, recibió 10 y llegó a un estado final. La red en línea da $Q_2 = Q(s_2,0;\theta) = 7$. Calcula los dos objetivos, la pérdida $J$, $\partial J/\partial Q_1$ y $\partial J/\partial Q_2$.

#### Paso 1
Primer objetivo. Con $\max(3,5) = 5$ y un estado no final:

$$Y_1 = 1 + 0{,}9 \cdot 5 = 5{,}5.$$

#### Paso 2
Segundo objetivo. El estado siguiente es final, así que $(1-\text{goal}) = 0$:

$$Y_2 = 10 + 0 = 10.$$

#### Paso 3
Los errores son $Y_1 - 2 = 3{,}5$ y $Y_2 - 7 = 3$. Con $|\mathcal{D}| = 2$:

$$J = \frac{1}{2 \cdot 2}\left(3{,}5^2 + 3^2\right) = \frac{12{,}25 + 9}{4} = 5{,}3125.$$

#### Paso 4
Derivada respecto al $Q$ de cada muestra, que es $-\text{error}/|\mathcal{D}|$:

$$\frac{\partial J}{\partial Q_1} = -\frac{3{,}5}{2} = -1{,}75, \qquad \frac{\partial J}{\partial Q_2} = -\frac{3}{2} = -1{,}5.$$

Los dos signos son negativos, de modo que el descenso de gradiente sube ambas estimaciones. Las salidas de las acciones no ejecutadas tienen derivada 0.

### Problema: un paso de gradiente en una red de valor lineal
Una red lineal tiene $Q(s,a;\theta) = w \cdot \phi(s)$ para la acción $a$ ejecutada, con características $\phi(s) = (1, 2)$ y pesos $w = (0{,}5;\ 0{,}75)$. El objetivo de la muestra es $Y = 5{,}5$ (calculado con la red congelada) y el lote tiene una sola muestra. Con tasa de aprendizaje $\alpha = 0{,}1$, haz un paso de descenso de gradiente y comprueba cómo cambia el error.

#### Paso 1
La estimación actual es $Q = 0{,}5 \cdot 1 + 0{,}75 \cdot 2 = 2$ y el error es $Y - Q = 3{,}5$.

#### Paso 2
Con $J = \tfrac{1}{2}(Y - Q)^2$ y $\partial Q / \partial w = \phi(s)$, el gradiente es:

$$\frac{\partial J}{\partial w} = -(Y - Q)\,\phi(s) = -3{,}5\,(1,2) = (-3{,}5;\ -7).$$

#### Paso 3
Se actualiza en sentido contrario al gradiente:

$$w \leftarrow (0{,}5;\ 0{,}75) - 0{,}1\,(-3{,}5;\ -7) = (0{,}85;\ 1{,}45).$$

#### Paso 4
La nueva estimación es $Q = 0{,}85 + 1{,}45 \cdot 2 = 3{,}75$ y el error baja de 3,5 a $5{,}5 - 3{,}75 = 1{,}75$. En una red, además, el cambio de $w$ modifica la estimación de todos los estados que comparten esas características, que es la generalización de DQN.

### Problema: actualización suave de la red objetivo
Los parámetros de la red en línea son $\theta = (1;\ -2)$ y los de la objetivo $\theta^- = (0;\ 2)$. Con $\tau = 0{,}1$, calcula $\theta^-$ tras una actualización y tras dos, suponiendo que $\theta$ no cambia entre ellas.

#### Paso 1
Primera actualización, $\theta^- \leftarrow 0{,}1\,\theta + 0{,}9\,\theta^-$:

$$\theta^- = (0{,}1 \cdot 1 + 0{,}9 \cdot 0;\ \ 0{,}1(-2) + 0{,}9 \cdot 2) = (0{,}1;\ 1{,}6).$$

#### Paso 2
Segunda actualización, con el $\theta^-$ nuevo:

$$\theta^- = (0{,}1 \cdot 1 + 0{,}9 \cdot 0{,}1;\ \ 0{,}1(-2) + 0{,}9 \cdot 1{,}6) = (0{,}19;\ 1{,}24).$$

Cada paso recorre solo el 10 % de la distancia que queda hasta $\theta$, por lo que el objetivo cambia despacio.
