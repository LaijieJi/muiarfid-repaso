# RNA U6 - Aprendizaje por refuerzo profundo

## 1. Introduction

### ¿En qué se diferencia la señal de aprendizaje del RL de la del aprendizaje supervisado?
En supervisado, cada entrada trae su salida correcta. En RL solo hay una recompensa escalar que dice cuánto ha valido lo ocurrido, pero no qué acción habría sido la buena.

### ¿Qué es el dilema entre exploración y explotación?
El agente debe equilibrar probar acciones nuevas, que pueden descubrir algo mejor, con ejecutar las acciones que ya sabe que dan buena recompensa. Si solo explota, puede quedarse en una estrategia mediocre.

### ¿Por qué en RL los datos de entrenamiento no son estacionarios?
Porque la política del agente decide qué estados visita y, por tanto, qué datos observa. Al cambiar la política durante el aprendizaje, cambia también la distribución de los datos con los que se entrena.

## 2. Markov Decision Process

### ¿Qué componentes tiene un proceso de decisión de Markov (MDP)?
Una tupla $M = (S, A, P, R, \rho_0, \gamma)$: estados, acciones, modelo de transición $P(s_{t+1} \mid s_t, a_t)$, función de recompensa $R(s_t, a_t, s_{t+1})$, distribución del estado inicial $\rho_0 = p(s_0)$ y factor de descuento $\gamma \in [0,1)$.

### ¿Qué dice la propiedad de Markov?
Que el futuro depende solo del estado y la acción actuales y no de la historia anterior:

$$p(s_{t+1} \mid s_t, a_t, s_{t-1}, a_{t-1}, \dots, s_0, a_0) = p(s_{t+1} \mid s_t, a_t).$$

### ¿Cómo se define el retorno $G_t$ en un MDP?
Es la suma descontada de las recompensas futuras desde el paso $t$:

$$G_t = \sum_{k=0}^{\infty} \gamma^k r(s_{t+k}, a_{t+k}) = r_t + \gamma r_{t+1} + \gamma^2 r_{t+2} + \dots$$

El exponente es $k$, el número de pasos hacia el futuro, y no $t$.

### ¿Qué relación recursiva cumple el retorno?
$G_t = r_t + \gamma G_{t+1}$. El retorno de ahora es la recompensa inmediata más el retorno del paso siguiente descontado una vez. Esta igualdad es el punto de partida de las ecuaciones de Bellman.

### ¿Para qué sirve el factor de descuento $\gamma$ y por qué se exige $\gamma < 1$?
Pondera menos las recompensas lejanas y hace que el retorno de un horizonte infinito sea finito. Si $\lvert r\rvert \le r_{\max}$, entonces $\lvert G_t\rvert \le r_{\max}/(1-\gamma)$ por la suma geométrica.

### ¿Cuál es el objetivo del agente en un MDP?
Encontrar la política óptima $\pi^*$ que maximiza el retorno esperado:

$$\pi^* = \arg\max_\pi \mathbb{E}_{\tau \sim \pi}[G_t].$$

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

### ¿Cuál es la ecuación de Bellman de esperanza para $V^\pi$?
$$V^\pi(s) = \sum_{a \in A} \pi(a \mid s) \sum_{s' \in S} P(s' \mid s, a)\left[R(s,a,s') + \gamma V^\pi(s')\right].$$

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

### ¿Cuál es la ecuación de Bellman de optimalidad para $Q^*$?
$$Q^*(s,a) = \sum_{s'} P(s' \mid s, a)\left[R(s,a,s') + \gamma \max_{a'} Q^*(s',a')\right].$$

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

### ¿Qué es el objetivo $Y^*(s,a)$ de Q-learning?
El valor que $Q^*(s,a)$ debería tener según Bellman:

$$Y^*(s,a) = \mathbb{E}\left[r(s,a) + \gamma\,(1 - \text{goal}(s'))\max_{a'} Q^*(s',a') \mid s,a\right].$$

### ¿Para qué sirve el factor $(1 - \text{goal}(s'))$ en el objetivo?
Vale 0 si $s'$ es un estado final y 1 en caso contrario. Así, al llegar a la meta no se suma valor futuro, porque ya no hay más recompensas después.

### ¿Cuál es el gradiente de la pérdida de Q-learning respecto a $Q(s,a)$?
$$\frac{\partial J}{\partial Q(s,a)} = -\left(Y^*(s,a) - Q(s,a)\right).$$

Se trata el objetivo como constante y solo se deriva respecto a $Q(s,a)$. Con el objetivo de una muestra, que usa la propia tabla en $s_{t+1}$, no se deriva a través de ese término (semigradiente), de modo que la regla no es el gradiente exacto de una pérdida fija.

### ¿Cuál es la regla de actualización de Q-learning?
Se avanza en sentido contrario al gradiente:

$$Q(s_t,a_t) \leftarrow Q(s_t,a_t) + \alpha\left[R + \gamma(1 - \text{goal}(s_{t+1}))\max_{a_{t+1}} Q(s_{t+1},a_{t+1}) - Q(s_t,a_t)\right].$$

### ¿Qué es el bootstrapping en Q-learning y qué consecuencia tiene?
El objetivo se construye con la propia tabla $Q$ en el estado siguiente, es decir, se actualiza una estimación con otra estimación. Por tanto el objetivo cambia a medida que cambia la tabla, y el valor de la recompensa se propaga hacia atrás un paso cada vez que se visita el estado anterior.

### ¿Por qué el objetivo de Q-learning usa el máximo y no el valor de la acción que el agente ejecutará a continuación?
Porque aprende $Q^*$, el valor de la política óptima, y esa política elige la mejor acción en $s_{t+1}$. El agente puede explorar con $\epsilon$-greedy y ejecutar otra acción, pero el objetivo sigue usando el máximo.

### ¿Cómo se elige la acción durante el entrenamiento de Q-learning?
Con una política $\epsilon$-greedy. Con probabilidad $1-\epsilon$ se explota la acción $\arg\max_a Q(s,a)$ y con probabilidad $\epsilon$ se explora con una acción al azar.

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

### ¿Qué dos limitaciones tiene el Q-learning tabular?
No es viable en memoria, o directamente es imposible, con estados continuos o muy numerosos. Además, actualizar una celda no da información sobre los estados que no se han visitado, aunque sean parecidos.

### ¿Qué es una red Q profunda (DQN, Deep Q-Network)?
Una red neuronal $Q(s,a;\theta)$ con parámetros $\theta$ que aproxima $Q^*(s,a)$. Sustituye a la tabla.

### ¿Cuáles son la entrada y la salida de una DQN?
La entrada es el estado $s$ y la salida es un vector con el valor $Q$ predicho para cada acción posible. Una sola pasada hacia delante da los valores de todas las acciones, y de ahí se obtiene el máximo del objetivo.

### ¿Cuál es la función de pérdida de una DQN?
$$J(\theta) = \frac{1}{2|\mathcal{D}|} \sum_{(s,a,s') \in \mathcal{D}} \left(Y(s,a,s';\theta^-) - Q(s,a;\theta)\right)^2,$$

con el objetivo $Y = R(s,a,s') + \gamma(1 - \text{goal}(s'))\max_{a'} Q(s',a';\theta^-)$.

### ¿Qué diferencia hay entre la red en línea (online) y la red objetivo (target) en DQN?
La red en línea, con parámetros $\theta$, es la que se entrena y da $Q(s,a;\theta)$. La red objetivo, con parámetros congelados $\theta^-$, solo se usa para calcular el objetivo $Y$ y no recibe gradiente.

### ¿Por qué se calcula el objetivo con una red congelada $\theta^-$?
Si el objetivo se calculara con $\theta$, cada actualización cambiaría a la vez la estimación y el objetivo, y la red perseguiría un objetivo que se mueve con ella (un objetivo móvil, nombre habitual: *non-stationary targets*). Al congelar $\theta^-$, el objetivo se mantiene estable durante varias actualizaciones. La red congelada solo estima $\max_{a'}Q(s',a';\theta^-)$ y no $Q(s,a)$, que sale de la red en línea. (Complemento: T06 define $\theta^-$ como los pesos congelados y no explica por qué se congelan. Usa "non-stationary" solo para la distribución de datos, de modo que aquí ese término es nomenclatura habitual y no de las diapositivas.)

### En una DQN con una salida por acción, ¿qué salidas reciben gradiente en una muestra?
Solo la salida de la acción $a$ que se ejecutó en la transición. El error se define para $Q(s,a;\theta)$ y las salidas de las demás acciones no intervienen en la pérdida de esa muestra.

### ¿Cómo se actualizan los parámetros congelados $\theta^-$?
Con una media móvil de los parámetros de la red en línea:

$$\theta^- \leftarrow \tau\,\theta + (1-\tau)\,\theta^-, \qquad \tau \ll 1.$$

Así $\theta^-$ sigue a $\theta$ con retraso y cambia despacio.

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
