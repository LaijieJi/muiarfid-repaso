# SMA U2 - Confianza y reputación

## 1. Introducción

### ¿Qué diferencia hay entre seguridad computacional y mecanismos de control social?
La seguridad computacional previene los ataques, por ejemplo con criptografía o entidades certificadoras. Los mecanismos de control social no previenen todos los ataques, pero evitan que se repitan. A este segundo grupo se le llama seguridad blanda (soft security) y es donde entran la confianza y la reputación.

### ¿Cómo define Gambetta la confianza?
Como la probabilidad subjetiva con la que un individuo A espera que otro individuo B realice una acción de la que depende el bienestar de A. Es una expectativa subjetiva y no una propiedad objetiva de B.

### ¿Por qué no se pueden tratar como sinónimos confianza y reputación?
No hay consenso semántico. La confianza es la esperanza firme que alguien tiene en otro, mientras que la reputación es el prestigio o la estima en que se tiene a alguien. Además, la reputación es un medio para llegar a la confianza, como ocurre en eBay.

## 3. Confianza en MAS

### ¿Qué dos perspectivas hay de la confianza en un sistema multiagente (MAS)?
Una evaluación (epistémica), por ejemplo "creo que mi médico es un buen cirujano", y un acto (motivacional), por ejemplo "he decidido que mi médico me opere". La primera es una opinión y la segunda es una decisión de depender de alguien.

### ¿En qué se diferencian las experiencias directas, las comunicadas y la información social?
| Fuente | Qué es | Particularidad |
|---|---|---|
| Experiencias directas | Interacciones propias con el agente | La más fiable y la que usan casi todos los modelos |
| Experiencias comunicadas | Información de otros agentes que han interactuado con él | Añade datos, pero puede ser poco fiable |
| Información social | Posición en la jerarquía, relaciones y roles | La usa ReGreT |

### ¿Qué es una imagen en un modelo de confianza?
Es la evaluación que un agente hace de otro, normalmente un único valor calculado agregando experiencias y otra información. Se calcula con una función de agregación sobre las entradas.

### Problema: imagen simple e imagen ponderada por el tiempo
El agente $i$ ha tenido 5 interacciones con $j$ en los instantes $t_i=1,2,3,4,5$, y el instante actual es $t=5$. Han sido positivas la 1, la 3 y la 4, y negativas la 2 y la 5. Calcula la imagen numérica $T_{ij}=p/n$ y la imagen ponderada con $f(t_i,t)=t_i/t$, tomando 1 por positiva y 0 por negativa. Normaliza los pesos con $\rho=f/\sum f$ y suma los pesos de las interacciones positivas.
#### Paso 1
La imagen numérica solo cuenta: $p=3$ positivas de $n=5$, por tanto $T_{ij}=3/5=0{,}6$.
#### Paso 2
Con $f=t_i/5$ las $f$ valen $0{,}2$, $0{,}4$, $0{,}6$, $0{,}8$ y $1$. Su suma es $3$, de modo que $\rho=f/3$ y los pesos son $\tfrac{1}{15},\tfrac{2}{15},\tfrac{3}{15},\tfrac{4}{15},\tfrac{5}{15}$.
#### Paso 3
Solo suman las positivas (instantes 1, 3 y 4): $\dfrac{1+3+4}{15}=\dfrac{8}{15}\approx 0{,}533$.
#### Paso 4
La ponderada ($0{,}533$) queda por debajo de la simple ($0{,}6$). Las negativas (instantes 2 y 5) suman un peso de $\tfrac{2+5}{15}=\tfrac{7}{15}\approx0{,}467$, frente a $\tfrac{2}{5}=0{,}4$ en la simple. La causa es la negativa del instante 5, que es la más reciente y pesa $\tfrac{5}{15}$ en lugar de $\tfrac{1}{5}$.

## 4. Reputación en MAS

### ¿Qué es la reputación en un MAS?
Lo que una entidad social dice sobre un individuo respecto a su comportamiento. Siempre se asocia a un comportamiento o propiedad concreta, y la entidad social es un conjunto de individuos con relaciones entre ellos.

### ¿Qué diferencia hay entre comunicar una imagen y comunicar una reputación?
Quien comunica una imagen se compromete con su propia opinión. Quien comunica una reputación solo es responsable de transmitir fielmente lo que se dice, aunque no coincida con su imagen. Por eso en la voz compartida (shared voice) el compromiso individual es menor y cuentan el número de comunicaciones y la credibilidad de los informantes.

### ¿Cómo calcula eBay la reputación?
Es un modelo centralizado. Cada transacción recibe una valoración de $+1$, $0$ o $-1$ y un comentario textual. La reputación es la suma de las valoraciones, un único valor global que no depende del contexto.
