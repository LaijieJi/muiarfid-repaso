# RNA U5 - Modelos generativos

## 1. Introducción

### ¿Qué idea central distingue al autoencoder, al VAE y a la GAN entre los modelos generativos neuronales?
Autoencoder (AE): comprime y reconstruye. Autoencoder variacional (VAE): espacio latente probabilístico. Red generativa adversaria (GAN): un generador compite con un discriminador.

### ¿Qué idea central distingue a los modelos autorregresivos, a los flujos normalizantes y a los de difusión?
Autorregresivos: predicen un elemento cada vez. Flujo normalizante (normalizing flow, NF): transformaciones invertibles. Modelos de difusión: revierten un proceso gradual de ruido.

### ¿Qué idea tienen los modelos basados en energía, flow matching, la difusión latente y los modelos de consistencia?
Los modelos basados en energía (EBM) aprenden una función de energía sobre los datos. Flow matching aprende un transporte continuo entre distribuciones y es una alternativa más rápida a la difusión. La difusión latente (LDM) aplica la difusión en un espacio latente y es la base de la generación de imagen a partir de texto. Los modelos de consistencia generan en uno o pocos pasos.

### ¿Qué familia domina hoy en modelos de lenguaje, código, imagen, vídeo, voz y música?
Lenguaje y código: Transformers autorregresivos. Imagen y vídeo: difusión (latente) y flow matching. Voz: difusión, flow matching y autorregresivos. Música: autorregresivos, difusión e híbridos. En 3D: difusión, flow matching e híbridos con campos neuronales.

### ¿Qué significa que muchos sistemas actuales sean híbridos y qué ejemplo hay?
Que combinan paradigmas en un mismo sistema. Por ejemplo, Stable Diffusion usa difusión en espacio latente junto con un codificador de texto Transformer, y DALL-E 1 combina un VQ-VAE con un Transformer.

## 2. Convoluciones transpuestas

### ¿Para qué sirve una convolución transpuesta (transposed convolution)?
Para aumentar (upsample) las dimensiones espaciales de un mapa de características. También se llama convolución con paso fraccionario y se usa para deshacer el submuestreo que hacen las convoluciones normales.

### ¿Cómo se relacionan la convolución normal y la transpuesta con la matriz $C$?
La convolución se escribe $\text{vec}(Y) = C\,\text{vec}(X)$, con $C$ construida a partir del filtro. La convolución transpuesta usa la matriz transpuesta: $\text{vec}(X) = C^\top \text{vec}(Y)$.

### ¿Es la convolución transpuesta la inversa de la convolución?
No. Recupera la forma del tensor, pero no sus valores, porque $C$ no es cuadrada y $C^\top$ no es $C^{-1}$. (Complemento que no sale del PDF.)

### ¿En qué consiste el método "scatter and sum" de la convolución transpuesta?
Cada elemento $y_{ij}$ de la entrada multiplica todo el filtro $W$ y el resultado se coloca (scatter) en la posición correspondiente de la salida. Las contribuciones que se solapan se suman.

### ¿Qué tamaño de salida produce una convolución transpuesta con entrada de lado $y$, filtro $f$, paso $s$ y relleno $p$?
$x = s\,(y-1) + f - 2p$. Con $s=1$, $p=0$, $y=2$, $f=2$ da 3. Con $s=2$ da 4. (Fórmula general: complemento, las transparencias solo dan los casos $s=1$ y $s=2$.)

### ¿Cómo se coloca cada bloque en "scatter and sum" cuando el paso es $s=2$ y el filtro es $2\times2$?
Los bloques se separan $s$ posiciones. Con $s = f = 2$ no se solapan, de modo que no hay sumas y con entrada $2\times2$ llenan una salida $4\times4$ con cuatro bloques $2\times2$. Si $s < f$ (por ejemplo filtro $4\times4$ y paso 2), los bloques sí se solapan y se suman.

### ¿Qué convolución normal equivale a una convolución transpuesta con paso $s$?
Se gira el filtro $180^\circ$, se dilata la entrada insertando $s-1$ ceros entre filas y columnas, se rellena con $f-1-p$ ceros alrededor y se aplica una convolución normal de paso 1 y sin relleno.

### ¿Cómo se propagan los gradientes en una convolución transpuesta?
Como $\text{vec}(X) = C^\top \text{vec}(Y)$, el jacobiano respecto a la entrada es $C^\top$. Respecto a los parámetros se deriva el producto $C^\top\text{vec}(Y)$ con $\text{vec}(Y)$ como constante.

### ¿Qué operaciones son los gradientes de una convolución transpuesta respecto a su entrada y a su filtro?
Respecto a la entrada $Y$, es la convolución normal, con el mismo filtro $W$ y el mismo paso $s$, del gradiente de la salida: $\partial L/\partial Y = W \circledast \partial L/\partial X$. Respecto al filtro, $\partial L/\partial W_{ab} = \sum_{i,j}\frac{\partial L}{\partial X_{si+a,\,sj+b}}\,Y_{ij}$.

### Problema: convolución transpuesta con paso 1 y paso 2 por "scatter and sum"
Sea el filtro $W = \begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}$ y la entrada $Y = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}$. Calcula $W \circledast^\top Y$ con $s=1$, $p=0$ y después con $s=2$, $p=0$. Indica antes el tamaño de cada salida.
#### Paso 1
Tamaño de salida $s(y-1)+f-2p$. Con $s=1$ es $1\cdot 1+2 = 3$, es decir $3\times3$. Con $s=2$ es $2\cdot 1+2 = 4$, es decir $4\times4$.
#### Paso 2
Cada entrada multiplica el filtro. El bloque de $y_{00}=2$ es $\begin{bmatrix} 2 & -2 \\ 4 & 0 \end{bmatrix}$. El de $y_{01}=1$ es $\begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}$. El de $y_{10}=0$ es nulo. El de $y_{11}=3$ es $\begin{bmatrix} 3 & -3 \\ 6 & 0 \end{bmatrix}$.
#### Paso 3
Con $s=1$ los bloques se colocan con su esquina superior izquierda en $(0,0)$, $(0,1)$, $(1,0)$ y $(1,1)$ de la salida $3\times3$ y se suman donde se solapan. El elemento $(1,1)$ recibe $0 + 2 + 0 + 3 = 5$ (el bloque de $y_{10}$ es nulo) y el $(0,1)$ recibe $-2 + 1 = -1$:
$$\begin{bmatrix} 2 & -1 & -1 \\ 4 & 5 & -3 \\ 0 & 6 & 0 \end{bmatrix}$$
#### Paso 4
Con $s=2$ los bloques se colocan en $(0,0)$, $(0,2)$, $(2,0)$ y $(2,2)$ y no se solapan:
$$\begin{bmatrix} 2 & -2 & 1 & -1 \\ 4 & 0 & 2 & 0 \\ 0 & 0 & 3 & -3 \\ 0 & 0 & 6 & 0 \end{bmatrix}$$

### Problema: tamaños y parámetros de un generador con convoluciones transpuestas
Un generador recibe un vector $z$ de 50 componentes, visto como un tensor $50\times1\times1$. Sus capas son `ConvTranspose2d` sin sesgo, todas con filtro $4\times4$: $(50\to256, s=1, p=0)$, $(256\to128, s=2, p=1)$, $(128\to64, s=2, p=1)$ y $(64\to3, s=2, p=1)$. Calcula el tamaño espacial tras cada capa y el número total de parámetros.
#### Paso 1
Con $x = s(y-1)+f-2p$. Capa 1: $1\cdot 0 + 4 - 0 = 4$. Capa 2: $2\cdot 3 + 4 - 2 = 8$. Capa 3: $2\cdot 7 + 4 - 2 = 16$. Capa 4: $2\cdot 15 + 4 - 2 = 32$. La salida es $3\times32\times32$.
#### Paso 2
Los parámetros de cada capa son $C_{in}\cdot C_{out}\cdot f^2$ (fórmula de parámetros: complemento que no sale del PDF). Capa 1: $50\cdot256\cdot16 = 204\,800$. Capa 2: $256\cdot128\cdot16 = 524\,288$. Capa 3: $128\cdot64\cdot16 = 131\,072$. Capa 4: $64\cdot3\cdot16 = 3\,072$.
#### Paso 3
Total: $204\,800 + 524\,288 + 131\,072 + 3\,072 = 863\,232$ parámetros. La primera capa "proyecta y reorganiza" el vector $z$ en un mapa de $4\times4$.

### Problema: gradientes de una convolución transpuesta
Con $W = \begin{bmatrix} 1 & -1 \\ 2 & 0 \end{bmatrix}$, $Y = \begin{bmatrix} 2 & 1 \\ 0 & 3 \end{bmatrix}$, $s=1$ y $p=0$, la salida $X$ es $3\times3$ y el gradiente de la pérdida respecto a ella es $\begin{bmatrix} 1 & 0 & 2 \\ 0 & 1 & 0 \\ 3 & 0 & 1 \end{bmatrix}$. Calcula $\partial L/\partial Y$ y $\partial L/\partial W$.
#### Paso 1
Entrada: $\partial L/\partial Y_{ij} = \sum_{a,b} W_{ab}\,\frac{\partial L}{\partial X_{i+a,\,j+b}}$. Da $Y_{00}$: $1\cdot1 + (-1)\cdot0 + 2\cdot0 + 0\cdot1 = 1$, $Y_{01}$: $1\cdot0 + (-1)\cdot2 + 2\cdot1 + 0\cdot0 = 0$, $Y_{10}$: $1\cdot0 + (-1)\cdot1 + 2\cdot3 + 0\cdot0 = 5$ y $Y_{11}$: $1\cdot1 + (-1)\cdot0 + 2\cdot0 + 0\cdot1 = 1$, es decir $\begin{bmatrix} 1 & 0 \\ 5 & 1 \end{bmatrix}$.
#### Paso 2
Filtro: $\partial L/\partial W_{ab} = \sum_{i,j} \frac{\partial L}{\partial X_{i+a,\,j+b}}\,Y_{ij}$. Da $W_{00}$: $1\cdot2 + 0\cdot1 + 0\cdot0 + 1\cdot3 = 5$, $W_{01}$: $0\cdot2 + 2\cdot1 + 0\cdot0 + 0\cdot3 = 2$, $W_{10}$: $0\cdot2 + 1\cdot1 + 3\cdot0 + 0\cdot3 = 1$ y $W_{11}$: $1\cdot2 + 0\cdot1 + 0\cdot0 + 1\cdot3 = 5$, es decir $\begin{bmatrix} 5 & 2 \\ 1 & 5 \end{bmatrix}$.

## 3. Autoencoders

### ¿Qué objetivo tiene un autoencoder (AE) y cómo se entrena sin etiquetas?
Aprender una representación comprimida de los datos. Se entrena para reconstruir su propia entrada, $x \to \hat{x}$, después de pasarla por un cuello de botella, de modo que la propia entrada hace de objetivo.

### ¿Cuáles son los tres componentes de un autoencoder?
El codificador (encoder) $z = f_\theta(x)$, que comprime la entrada. El espacio latente (bottleneck) $z$, de baja dimensión. El decodificador (decoder) $\hat{x} = g_\phi(z)$, que reconstruye la entrada a partir de $z$.

### ¿Para qué sirve el cuello de botella de un autoencoder?
Obliga al código latente a ignorar el ruido y a conservar solo las características más importantes de los datos. Sin cuello de botella la red podría copiar la entrada.

### ¿Qué pérdidas de reconstrucción se usan en un autoencoder?
El error cuadrático medio, $\frac{1}{D}\sum_i (x_i - \hat{x}_i)^2$, y la entropía cruzada binaria (BCE), $-\sum_i [x_i\log\hat{x}_i + (1-x_i)\log(1-\hat{x}_i)]$. La BCE exige $x_i \in [0,1]$ y $\hat{x}_i \in (0,1)$, normalmente con una sigmoide en la salida.

### ¿Qué diferencia hay entre un autoencoder subcompleto y uno con eliminación de ruido (denoising)?
El subcompleto (undercomplete) tiene una dimensión latente menor que la de entrada, para comprimir. El de eliminación de ruido (DAE) corrompe la entrada durante el entrenamiento, $\tilde{x} \sim q(\tilde{x}\mid x)$, y exige reconstruir la original sin corromper. Así no puede aprender la identidad.

### ¿Qué estrategias de corrupción usa un autoencoder con eliminación de ruido?
Ruido gaussiano aditivo, $\tilde{x} = x + \epsilon$ con $\epsilon \sim \mathcal{N}(0,\sigma^2 I)$. Enmascarado, que pone a 0 una fracción de la entrada. Ruido de dropout, que anula características con probabilidad $p$.

### ¿Qué busca un autoencoder disperso (sparse) y cómo lo consigue?
Que las unidades ocultas estén casi siempre inactivas, sin reducir el tamaño de la capa. Añade a la pérdida una penalización sobre la activación media de cada unidad: $\mathcal{L} = \mathcal{L}_{rec} + \beta\sum_j \text{Penalty}(\rho,\hat{\rho}_j) + \lambda\,\Omega(W)$.

### ¿Cómo se calcula la activación media $\hat{\rho}_j$ de una unidad oculta en el autoencoder disperso?
Como el promedio de su activación sobre el minilote: $\hat{\rho}_j = \frac{1}{N}\sum_{i=1}^{N} a_j(x^{(i)})$. La activación es una sigmoide, de modo que $\hat{\rho}_j \in (0,1)$.

### ¿Qué penalizaciones de dispersión se usan?
La divergencia KL entre dos Bernoullis, $\text{KL}(\rho\,\|\,\hat{\rho}_j) = \rho\log\frac{\rho}{\hat{\rho}_j} + (1-\rho)\log\frac{1-\rho}{1-\hat{\rho}_j}$, con $\rho$ un objetivo pequeño (por ejemplo 0,05). O una penalización $L_1$ directa sobre las activaciones, $\sum_j |h_j|$.

### ¿Qué ventaja da la dispersión respecto a la dimensión del espacio latente?
Permite una capa latente sobrecompleta ($K > D$) sin que la red degenere en una copia de la entrada. Los autoencoders dispersos grandes se usan hoy para extraer conceptos interpretables de las activaciones de los Transformers.

### Problema: pérdidas de reconstrucción de un autoencoder
Una entrada $x = (1,\ 0,\ 0{,}5)$ se reconstruye como $\hat{x} = (0{,}8,\ 0{,}1,\ 0{,}5)$. Calcula el error cuadrático medio y la BCE. Comenta el resultado de la tercera componente.
#### Paso 1
Error cuadrático medio, con $D = 3$: $\frac{1}{3}\left(0{,}2^2 + 0{,}1^2 + 0^2\right) = \frac{0{,}04 + 0{,}01 + 0}{3} = 0{,}0167$.
#### Paso 2
BCE por componente: $-\ln 0{,}8 = 0{,}2231$ para la primera, $-\ln(1-0{,}1) = 0{,}1054$ para la segunda, y para la tercera $-[0{,}5\ln0{,}5 + 0{,}5\ln0{,}5] = 0{,}6931$.
#### Paso 3
Suma: $0{,}2231 + 0{,}1054 + 0{,}6931 = 1{,}0216$.
#### Paso 4
Aunque la tercera componente se reconstruye de forma exacta ($x_3 = \hat{x}_3$), su BCE no es 0, porque con un objetivo intermedio el mínimo de la BCE vale $-[x\ln x + (1-x)\ln(1-x)]$ y no cero. El error cuadrático sí vale 0 ahí.

### Problema: penalización de dispersión con la divergencia KL
En un autoencoder disperso con $\rho = 0{,}1$ y $\beta = 2$, dos unidades ocultas tienen estas activaciones sobre 4 muestras: la unidad A, $(0{,}2,\ 0{,}05,\ 0{,}1,\ 0{,}05)$, y la unidad B, $(0{,}9,\ 0{,}7,\ 0{,}8,\ 0{,}6)$. Calcula la penalización total, sin el término $\lambda\Omega(W)$.
#### Paso 1
Activaciones medias: $\hat{\rho}_A = (0{,}2+0{,}05+0{,}1+0{,}05)/4 = 0{,}1$ y $\hat{\rho}_B = (0{,}9+0{,}7+0{,}8+0{,}6)/4 = 0{,}75$.
#### Paso 2
Unidad A: $\hat{\rho}_A = \rho$, de modo que $\text{KL} = 0$.
#### Paso 3
Unidad B: $\text{KL}(0{,}1\,\|\,0{,}75) = 0{,}1\ln\frac{0{,}1}{0{,}75} + 0{,}9\ln\frac{0{,}9}{0{,}25} = 0{,}1(-2{,}0149) + 0{,}9(1{,}2809) = -0{,}2015 + 1{,}1528 = 0{,}9514$.
#### Paso 4
Penalización total: $\beta\,(0 + 0{,}9514) = 2\cdot0{,}9514 = 1{,}9027$. La unidad B está activa casi siempre y es la que se castiga.

## 4. Autoencoders variacionales

### ¿En qué se diferencia un VAE de un autoencoder convencional?
El autoencoder asigna cada entrada a un punto del espacio latente. El VAE la asigna a una distribución $q_\phi(z\mid x)$. Eso permite generar muestras nuevas, tomando $z$ de un prior $\mathcal{N}(0,I)$ y pasándolo por el decodificador.

### ¿Qué se maximiza al entrenar un VAE y por qué no se hace directamente?
La log-verosimilitud marginal $\log p_\theta(x)$, con $p_\theta(x) = \int p_\theta(x,z)\,dz$. La integral sobre todos los valores latentes es intratable en redes neuronales complejas, de modo que se maximiza una cota inferior.

### ¿Para qué se introduce la red de inferencia $q_\phi(z\mid x)$?
Para aproximar el posterior verdadero $p_\theta(z\mid x)$, que no se puede calcular. Es el codificador del VAE.

### ¿Qué es la cota inferior de la evidencia (ELBO)?
$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi(z\mid x)}\left[\log\frac{p_\theta(x,z)}{q_\phi(z\mid x)}\right]$. Cumple $\log p_\theta(x) = \mathcal{L}_{ELBO} + D_{KL}(q_\phi(z\mid x)\,\|\,p_\theta(z\mid x))$.

### ¿Por qué el ELBO es una cota inferior de $\log p_\theta(x)$?
Porque la divergencia KL entre $q_\phi(z\mid x)$ y el posterior verdadero es siempre no negativa. La diferencia $\log p_\theta(x) - \mathcal{L}_{ELBO}$ es exactamente esa KL.

### ¿Qué dos términos tiene el ELBO tras usar $p_\theta(x,z) = p_\theta(x\mid z)\,p(z)$?
$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)] - D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$. El primero es la reconstrucción y el segundo es la regularización hacia el prior.

### ¿Qué mide el término de reconstrucción del ELBO?
Lo bien que el decodificador $p_\theta(x\mid z)$ reconstruye $x$ a partir de un código $z$ muestreado del codificador. Se calcula con error cuadrático o con BCE.

### ¿Para qué sirve el término KL del ELBO?
Penaliza que la distribución codificada $q_\phi(z\mid x)$ se aleje del prior $p(z) = \mathcal{N}(0,I)$. Mantiene el espacio latente centrado en el origen, de modo que muestrear del prior produzca códigos que el decodificador sabe usar.

### ¿Cuál es la función de pérdida que minimiza un VAE?
El ELBO cambiado de signo, porque las redes se entrenan minimizando: $\text{Loss}_{VAE} = -\mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)] + D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$.

### ¿Cuál es la definición de la divergencia KL entre dos distribuciones continuas?
$D_{KL}(q\,\|\,p) = \int q(z)\log\frac{q(z)}{p(z)}\,dz = \mathbb{E}_q\left[\log\frac{q(z)}{p(z)}\right]$. Es no negativa y vale cero solo cuando $q = p$. No es simétrica.

### ¿Cuál es el problema de muestrear $z \sim q_\phi(z\mid x)$ dentro de la red?
Que el muestreo es un nodo estocástico no diferenciable, de modo que el gradiente no puede pasar por él hacia el codificador.

### ¿En qué consiste el truco de reparametrización (reparameterization trick)?
En escribir el muestreo de forma determinista aislando el azar en una variable auxiliar: $z = \mu_\phi(x) + \sigma_\phi(x)\odot\epsilon$, con $\epsilon \sim \mathcal{N}(0,I)$ y $\odot$ el producto elemento a elemento. La aleatoriedad queda en $\epsilon$ y el gradiente fluye por $\mu_\phi$ y $\sigma_\phi$.

### ¿Qué derivadas parciales de $z$ da el truco de reparametrización?
Con $z = \mu + \sigma\epsilon$: $\partial z/\partial\mu = 1$ y $\partial z/\partial\sigma = \epsilon$. Con $\epsilon$ tratado como una constante muestreada, el gradiente de la pérdida llega a $\mu$ y a $\sigma$ por la regla de la cadena. (Complemento que no sale del PDF.)

### Demostración: identidad fundamental $\log p_\theta(x) = \mathcal{L}_{ELBO} + D_{KL}(q_\phi\,\|\,p_\theta(z\mid x))$
Demuestra la identidad y deduce que el ELBO es una cota inferior.
#### Paso 1
Como $\log p_\theta(x)$ no depende de $z$, su esperanza bajo cualquier distribución de $z$ es ella misma: $\log p_\theta(x) = \mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x)]$.
#### Paso 2
Por la definición de probabilidad condicional, $p_\theta(x,z) = p_\theta(z\mid x)\,p_\theta(x)$, de modo que $p_\theta(x) = \dfrac{p_\theta(x,z)}{p_\theta(z\mid x)}$. Entonces:
$$\log p_\theta(x) = \mathbb{E}_{q_\phi(z\mid x)}\left[\log\frac{p_\theta(x,z)}{p_\theta(z\mid x)}\right]$$
#### Paso 3
Se multiplica y divide el interior por $q_\phi(z\mid x)$, y el logaritmo del producto se separa en una suma:
$$\log p_\theta(x) = \mathbb{E}_{q_\phi}\left[\log\frac{p_\theta(x,z)}{q_\phi(z\mid x)}\right] + \mathbb{E}_{q_\phi}\left[\log\frac{q_\phi(z\mid x)}{p_\theta(z\mid x)}\right]$$
#### Paso 4
El primer sumando es el ELBO por definición. El segundo es, por la definición de KL, $D_{KL}(q_\phi(z\mid x)\,\|\,p_\theta(z\mid x))$. Queda $\log p_\theta(x) = \mathcal{L}_{ELBO} + D_{KL}(q_\phi\,\|\,p_\theta(z\mid x))$.
#### Paso 5
Como $D_{KL} \geq 0$, resulta $\log p_\theta(x) \geq \mathcal{L}_{ELBO}$. Maximizar el ELBO sube la cota y a la vez acerca $q_\phi$ al posterior verdadero, porque la suma de ambos es constante respecto a $\phi$.

### Demostración: el ELBO es reconstrucción menos KL contra el prior
Parte de $\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi}\left[\log\frac{p_\theta(x,z)}{q_\phi(z\mid x)}\right]$ y llega a $\mathbb{E}_{q_\phi}[\log p_\theta(x\mid z)] - D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$.
#### Paso 1
Se factoriza el modelo conjunto con la regla de la probabilidad, $p_\theta(x,z) = p_\theta(x\mid z)\,p(z)$:
$$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi}\left[\log\frac{p_\theta(x\mid z)\,p(z)}{q_\phi(z\mid x)}\right]$$
#### Paso 2
El logaritmo del producto se separa en suma de logaritmos, y la esperanza es lineal:
$$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi}[\log p_\theta(x\mid z)] + \mathbb{E}_{q_\phi}\left[\log\frac{p(z)}{q_\phi(z\mid x)}\right]$$
#### Paso 3
Se invierte el cociente del segundo término, lo que cambia su signo: $\mathbb{E}_{q_\phi}\left[\log\frac{p(z)}{q_\phi(z\mid x)}\right] = -\mathbb{E}_{q_\phi}\left[\log\frac{q_\phi(z\mid x)}{p(z)}\right]$.
#### Paso 4
Ese último es $D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$ por definición. Por tanto:
$$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi}[\log p_\theta(x\mid z)] - D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$$

### Demostración: KL entre una gaussiana y la gaussiana estándar (caso unidimensional)
Demuestra que $D_{KL}(\mathcal{N}(\mu,\sigma^2)\,\|\,\mathcal{N}(0,1)) = \frac{1}{2}\left(\mu^2 + \sigma^2 - 1 - \ln\sigma^2\right)$. Esta es la forma cerrada del término KL del VAE con codificador gaussiano, y no aparece en las transparencias.
#### Paso 1
Se aplica la definición $D_{KL} = \mathbb{E}_q[\ln q(z) - \ln p(z)]$ con $q = \mathcal{N}(\mu,\sigma^2)$ y $p = \mathcal{N}(0,1)$:
$$\ln q(z) = -\tfrac{1}{2}\ln(2\pi\sigma^2) - \frac{(z-\mu)^2}{2\sigma^2}, \qquad \ln p(z) = -\tfrac{1}{2}\ln(2\pi) - \frac{z^2}{2}$$
#### Paso 2
Al restar, los términos $\frac{1}{2}\ln 2\pi$ se cancelan:
$$\ln q(z) - \ln p(z) = -\tfrac{1}{2}\ln\sigma^2 - \frac{(z-\mu)^2}{2\sigma^2} + \frac{z^2}{2}$$
#### Paso 3
Se toma la esperanza bajo $q$. Se usa $\mathbb{E}_q[(z-\mu)^2] = \sigma^2$ (varianza) y $\mathbb{E}_q[z^2] = \mu^2 + \sigma^2$ (varianza más cuadrado de la media):
$$D_{KL} = -\tfrac{1}{2}\ln\sigma^2 - \frac{\sigma^2}{2\sigma^2} + \frac{\mu^2+\sigma^2}{2}$$
#### Paso 4
Se simplifica $\frac{\sigma^2}{2\sigma^2} = \frac{1}{2}$ y se agrupa:
$$D_{KL} = \tfrac{1}{2}\left(\mu^2 + \sigma^2 - 1 - \ln\sigma^2\right)$$
Con $\mu = 0$ y $\sigma = 1$ da 0, como debe ser. Para un vector latente con covarianza diagonal, la KL es la suma de esta expresión sobre las dimensiones.

### Problema: KL de un codificador gaussiano contra el prior
Un codificador VAE con dos dimensiones latentes devuelve $\mu = (1,\ 0)$ y $\sigma = (0{,}5,\ 2)$. Calcula $D_{KL}(q_\phi(z\mid x)\,\|\,\mathcal{N}(0,I))$ y razona qué dimensión se parece más al prior. (La forma cerrada de la KL es un complemento: se deduce en la demostración anterior y no sale del PDF.)
#### Paso 1
Dimensión 1: $\frac{1}{2}\left(1^2 + 0{,}5^2 - 1 - \ln0{,}25\right) = \frac{1}{2}(1 + 0{,}25 - 1 + 1{,}3863) = \frac{1}{2}(1{,}6363) = 0{,}8181$.
#### Paso 2
Dimensión 2: $\frac{1}{2}\left(0^2 + 2^2 - 1 - \ln4\right) = \frac{1}{2}(0 + 4 - 1 - 1{,}3863) = \frac{1}{2}(1{,}6137) = 0{,}8069$.
#### Paso 3
La covarianza es diagonal, de modo que las KL se suman: $0{,}8181 + 0{,}8069 = 1{,}625$ (los dos logaritmos se cancelan, porque $-\ln0{,}25 - \ln4 = 0$, y queda $\frac{1}{2}(1 + 0{,}25 + 4 - 2) = 1{,}625$).
#### Paso 4
La dimensión 2 se parece algo más al prior (0,8069 frente a 0,8181), aunque por muy poco, y ninguna de las dos está cerca de 0. La primera se desvía por la media y por una varianza menor que 1, y la segunda solo por una varianza mayor que 1.

### Problema: pasada completa de un VAE con reparametrización y gradientes
Un VAE con una dimensión latente recibe $x = (1,\ 0)$ y su codificador devuelve $\mu = 0{,}4$ y $\sigma = 0{,}5$. Se muestrea $\epsilon = 1{,}2$. El decodificador es $\hat{x}_1 = \text{sig}(2z - 1)$ y $\hat{x}_2 = \text{sig}(-z)$. Calcula $z$, la pérdida (BCE más KL) y los gradientes de la pérdida respecto a $\mu$ y a $\sigma$. (La forma cerrada de la KL y su derivada son un complemento: se deducen en la demostración de la KL gaussiana y no salen del PDF.)
#### Paso 1
Reparametrización: $z = \mu + \sigma\epsilon = 0{,}4 + 0{,}5\cdot1{,}2 = 1{,}0$.
#### Paso 2
Decodificador: $\hat{x}_1 = \text{sig}(1) = 0{,}7311$ y $\hat{x}_2 = \text{sig}(-1) = 0{,}2689$.
#### Paso 3
BCE: $-\ln0{,}7311 - \ln(1-0{,}2689) = 0{,}3133 + 0{,}3133 = 0{,}6265$.
#### Paso 4
KL: $\frac{1}{2}(0{,}4^2 + 0{,}5^2 - 1 - \ln0{,}25) = \frac{1}{2}(0{,}16 + 0{,}25 - 1 + 1{,}3863) = 0{,}3981$. Pérdida total: $0{,}6265 + 0{,}3981 \approx 1{,}0247$.
#### Paso 5
Gradiente respecto a $z$. Para una sigmoide con BCE, $\partial\,\text{BCE}/\partial a = \hat{x} - x$ en cada salida. Entonces $\partial\mathcal{L}/\partial z = (\hat{x}_1 - 1)\cdot2 + (\hat{x}_2 - 0)\cdot(-1) = (-0{,}2689)\cdot2 - 0{,}2689 = -0{,}8068$.
#### Paso 6
Se suma el camino por el KL. Como $\partial z/\partial\mu = 1$, $\partial z/\partial\sigma = \epsilon = 1{,}2$, $\partial D_{KL}/\partial\mu = \mu = 0{,}4$ y $\partial D_{KL}/\partial\sigma = \sigma - 1/\sigma = -1{,}5$:
$$\frac{\partial\mathcal{L}}{\partial\mu} = -0{,}8068 + 0{,}4 = -0{,}4068, \qquad \frac{\partial\mathcal{L}}{\partial\sigma} = -0{,}8068\cdot1{,}2 - 1{,}5 = -2{,}4682$$

## 5. Redes generativas adversarias (GAN)

### ¿Qué dos redes forman una GAN y qué hace cada una?
El generador $G_\theta(z)$ convierte un ruido $z \sim p_z$ (normalmente gaussiano) en una muestra del espacio de datos. El discriminador $D_\phi(x)\in[0,1]$ es un clasificador binario que da la probabilidad de que $x$ sea real y no generada por $G$.

### ¿Cuál es el objetivo minimax de una GAN?
$$\min_\theta\max_\phi\ \mathbb{E}_{x\sim p_{data}}[\log D_\phi(x)] + \mathbb{E}_{z\sim p_z}[\log(1 - D_\phi(G_\theta(z)))]$$
El discriminador maximiza y el generador minimiza.

### ¿Qué valores buscan $D(x)$ y $D(G(z))$ el discriminador y el generador?
El discriminador busca $D(x)\to1$ en datos reales y $D(G(z))\to0$ en datos generados. El generador busca lo contrario sobre los generados, $D(G(z))\to1$, con lo que $\log(1 - D(G(z)))\to-\infty$.

### ¿En qué se diferencia una GAN de un VAE respecto a la verosimilitud?
El VAE aproxima la verosimilitud de forma explícita con el ELBO. La GAN aprende a igualar la distribución de los datos de forma implícita, mediante el juego adversario, sin densidad explícita.

### ¿Cuál es el discriminador óptimo para un generador fijo?
$D^*_G(x) = \dfrac{p_{data}(x)}{p_{data}(x) + p_g(x)}$, con $p_g$ la distribución de las muestras generadas. Vale $\frac{1}{2}$ donde ambas densidades coinciden.

### ¿Qué divergencia minimiza el generador cuando el discriminador es óptimo?
La de Jensen-Shannon: $V(D^*_G,G) = 2\,D_{JS}(p_{data}\,\|\,p_g) - 2\log2$. Su mínimo se alcanza con $p_g = p_{data}$, donde $D^* = \frac{1}{2}$ y $V = -2\log2$.

### ¿Cómo se define la divergencia de Jensen-Shannon?
$D_{JS}(P\,\|\,Q) = \frac{1}{2}D_{KL}\!\left(P\,\Big\|\,\frac{P+Q}{2}\right) + \frac{1}{2}D_{KL}\!\left(Q\,\Big\|\,\frac{P+Q}{2}\right)$. Es simétrica, a diferencia de la KL.

### ¿Qué limitaciones tiene una GAN vanilla basada en MLP, que motivan las redes generativas adversarias convolucionales profundas (DCGAN)?
Las capas totalmente conectadas pierden la topología espacial, el número de parámetros se dispara y el entrenamiento es muy inestable.

### ¿Qué pautas de arquitectura siguen las DCGAN?
Sustituir el pooling por convoluciones con paso (discriminador) y convoluciones con paso fraccionario (generador). Usar batchnorm en ambas redes. Quitar capas ocultas totalmente conectadas. ReLU en el generador, salvo la salida con Tanh. LeakyReLU en todo el discriminador.

### ¿Qué hace la primera capa del generador de una DCGAN con entrada $z$ de 100 componentes?
Una convolución transpuesta con filtro $4\times4$ que convierte $z$ (visto como $100\times1\times1$) en un mapa de $1024\times4\times4$. Cada uno de los 1024 filtros de salida tiene 100 núcleos $4\times4$, cada uno escalado por su componente $z_i$ y luego sumados.

### ¿Qué calcula la normalización por lotes (BatchNorm2d) en una capa convolucional?
Para cada canal $c$ y de forma independiente, la media sobre el lote y las posiciones espaciales, $\mu_c = \frac{1}{B\,H\,W}\sum_{b,h,w}X_{b,c,h,w}$. Después normaliza con la varianza del canal, $\hat{X}=(X-\mu_c)/\sqrt{\sigma_c^2+\epsilon}$. (Complemento que no sale del PDF: la transparencia solo da la media. La capa añade además una escala y un desplazamiento aprendidos, $\gamma_c\hat{X}+\beta_c$.)

### ¿Qué es una LeakyReLU y cuál es su derivada?
$\text{LeakyReLU}(x) = \max(\alpha x, x)$ para un $\alpha$ pequeño, de modo que las entradas negativas conservan una pendiente $\alpha$ en lugar de 0. Su derivada es 1 si $x > 0$ y $\alpha$ si $x < 0$.

### ¿Cómo se entrena una GAN con la pérdida BCE en cada lote?
Con $\mathcal{L} = -[y\log D(x) + (1-y)\log(1 - D(G(z)))]$. Paso 1, se entrena el discriminador con muestras reales (etiqueta 1) y generadas (etiqueta 0). Paso 2, se entrena el generador con las muestras generadas etiquetadas como reales (1).

### ¿Por qué se detiene el gradiente (detach) de las imágenes generadas al actualizar el discriminador?
Para que en ese paso el gradiente no llegue al generador. Solo se actualizan los parámetros del discriminador.

### ¿Por qué el generador maximiza $\log D(G(z))$ en lugar de minimizar $\log(1 - D(G(z)))$?
Al empezar, $G$ es malo y $D(G(z))\approx0$. Entonces $\log(1-D)$ tiene una derivada de módulo $\frac{1}{1-D}\approx1$, pequeña, y el aprendizaje es lento. Con $\log D$ la derivada es $\frac{1}{D}$, grande al principio, y se reduce cuando $G$ mejora.

### ¿Qué ajuste del optimizador Adam recomiendan las DCGAN?
Tasa de aprendizaje $\eta = 0{,}0002$, $\beta_1 = 0{,}5$ en lugar del habitual 0,9 y $\beta_2 = 0{,}999$.

### ¿Qué distribución de $z$ se prefiere en una GAN y cuál usaba el artículo de las DCGAN?
Se prefiere $z\sim\mathcal{N}(0,I_d)$, más suave que la $\mathcal{U}(-1,1)^d$ que usaba el artículo de las DCGAN.

### ¿Qué aprende el generador de una GAN respecto al espacio latente?
Una aplicación suave del espacio latente (de 100 dimensiones en las DCGAN) al espacio de imágenes.

### ¿Qué añade una GAN condicional (cGAN) a una GAN convencional?
Control sobre lo que se genera. Tanto $G$ como $D$ reciben una información auxiliar $y$, que puede ser una clase (one-hot), un embedding de texto o una imagen (mapa de bordes, máscara, imagen de baja resolución).

### ¿Cuál es el objetivo minimax de una cGAN?
$$\min_\theta\max_\phi\ \mathbb{E}_{(x,y)\sim p_{data}}[\log D_\phi(x\mid y)] + \mathbb{E}_{z\sim p_z,\,y\sim p_y}[\log(1-D_\phi(G_\theta(z\mid y)\mid y))]$$
Es el objetivo de la GAN con todas las probabilidades condicionadas a $y$.

### ¿Qué problema tiene concatenar la condición $y$ con $x$ y $z$ en la cGAN original?
Es una mezcla ingenua que obliga al discriminador a gastar capacidad de canales al principio para propagar $y$. Al atravesar varias convoluciones con submuestreo, la señal de condición puede desvanecerse.

### ¿Cómo combina el discriminador de proyección de una cGAN la clase $y$ con la imagen $x$?
Con una puntuación condicional y otra incondicional: $f(x,y) = v_y^\top\phi(x) + \psi(\phi(x))$. $\phi(x)$ es el vector de la penúltima capa, $v_y = E(y)$ es el embedding de la clase y $\psi$ es una capa lineal que juzga si la imagen parece real sea cual sea la clase.

### ¿Cómo funciona la normalización por lotes condicional (conditional batch norm)?
Se normaliza el mapa de características y después se reescala con $\gamma(y)$ y se desplaza con $\beta(y)$, dos parámetros que dependen de la clase: $\text{cBN}(x,y) = \gamma(y)\,\dfrac{x - \mathbb{E}[x]}{\sqrt{\text{Var}[x]+\epsilon}} + \beta(y)$. Dos capas lineales pequeñas calculan $\gamma_c(y)$ y $\beta_c(y)$ por canal a partir del embedding $v_y$.

### ¿En qué red se aplica el discriminador de proyección y en cuál la normalización por lotes condicional de una cGAN?
La proyección combina la imagen $x$ con la clase $y$ en el discriminador. La normalización por lotes condicional combina el ruido $z$ con la clase $y$ en el generador.

### Demostración: el discriminador óptimo maximiza $a\log D + b\log(1-D)$ punto a punto
Demuestra que $D^*_G(x) = \dfrac{p_{data}(x)}{p_{data}(x)+p_g(x)}$. Esta demostración la enuncia la transparencia como resultado de Goodfellow y el desarrollo es un complemento.
#### Paso 1
Con $z\sim p_z$, $G(z)\sim p_g$, de modo que el objetivo se reescribe como una integral sobre $x$:
$$V(D,G) = \int\left[p_{data}(x)\log D(x) + p_g(x)\log(1-D(x))\right]dx$$
#### Paso 2
Para $G$ fijo se puede maximizar punto a punto. Con $a = p_{data}(x)$, $b = p_g(x)$ y $D = D(x)$, hay que maximizar $f(D) = a\log D + b\log(1-D)$ en $(0,1)$.
#### Paso 3
Se anula la derivada: $f'(D) = \frac{a}{D} - \frac{b}{1-D} = 0$, que da $a(1-D) = bD$ y por tanto $D = \frac{a}{a+b}$.
#### Paso 4
Es un máximo porque $f''(D) = -\frac{a}{D^2} - \frac{b}{(1-D)^2} < 0$. Por tanto $D^*_G(x) = \dfrac{p_{data}(x)}{p_{data}(x)+p_g(x)}$.

### Demostración: con el discriminador óptimo, el objetivo es $2\,D_{JS} - 2\log2$
Partiendo de $D^*_G$, demuestra $V(D^*_G,G) = 2\,D_{JS}(p_{data}\,\|\,p_g) - 2\log 2$.
#### Paso 1
Se sustituye $D^*_G$ en el objetivo. Como $1 - D^*_G = \frac{p_g}{p_{data}+p_g}$:
$$V = \mathbb{E}_{p_{data}}\left[\log\frac{p_{data}}{p_{data}+p_g}\right] + \mathbb{E}_{p_g}\left[\log\frac{p_g}{p_{data}+p_g}\right]$$
#### Paso 2
Sea la distribución media $M = \frac{p_{data}+p_g}{2}$, de modo que $p_{data}+p_g = 2M$. Entonces $\log\frac{p_{data}}{2M} = \log\frac{p_{data}}{M} - \log2$, y lo mismo con $p_g$:
$$V = \mathbb{E}_{p_{data}}\left[\log\frac{p_{data}}{M}\right] + \mathbb{E}_{p_g}\left[\log\frac{p_g}{M}\right] - 2\log2$$
#### Paso 3
Las dos esperanzas son KL por definición: $V = D_{KL}(p_{data}\,\|\,M) + D_{KL}(p_g\,\|\,M) - 2\log2$.
#### Paso 4
Por la definición de Jensen-Shannon, $2\,D_{JS}(p_{data}\,\|\,p_g) = D_{KL}(p_{data}\,\|\,M) + D_{KL}(p_g\,\|\,M)$. Por tanto:
$$V(D^*_G,G) = 2\,D_{JS}(p_{data}\,\|\,p_g) - 2\log2$$
#### Paso 5
Como $D_{JS}\geq0$ y vale 0 solo si $p_g = p_{data}$, el mínimo global es $-2\log2$. Ahí $D^*_G = \frac{1}{2}$ y el discriminador no puede hacer mejor que adivinar.

### Problema: tamaños y parámetros del discriminador de una DCGAN
Una imagen $3\times64\times64$ pasa por cinco capas `Conv2d` sin sesgo con filtro $4\times4$: $(3\to128, s=2, p=1)$, $(128\to256, s=2, p=1)$, $(256\to512, s=2, p=1)$, $(512\to1024, s=2, p=1)$ y $(1024\to1, s=1, p=0)$. Calcula el tamaño espacial tras cada capa y el número total de parámetros.
#### Paso 1
Tamaño de una convolución normal: $\lfloor (n + 2p - f)/s\rfloor + 1$. Capa 1: $(64+2-4)/2+1 = 32$. Capa 2: 16. Capa 3: 8. Capa 4: 4. Capa 5: $(4-4)/1+1 = 1$. La salida es $1\times1\times1$.
#### Paso 2
Parámetros $C_{in}C_{out}f^2$. Capa 1: $3\cdot128\cdot16 = 6\,144$. Capa 2: $128\cdot256\cdot16 = 524\,288$. Capa 3: $256\cdot512\cdot16 = 2\,097\,152$. Capa 4: $512\cdot1024\cdot16 = 8\,388\,608$. Capa 5: $1024\cdot1\cdot16 = 16\,384$.
#### Paso 3
Total: $11\,032\,576$ parámetros. Las cuatro primeras capas reducen el lado a la mitad y la última lo convierte en un escalar que la sigmoide lleva a una probabilidad.

### Problema: pérdidas de la GAN con datos de un solo ejemplo
En un paso de entrenamiento, el discriminador da $D(x) = 0{,}9$ a una muestra real y $D(G(z)) = 0{,}2$ a una generada. Calcula el valor de $V$, la pérdida BCE del discriminador y las dos pérdidas posibles del generador. Después compara los módulos de sus gradientes respecto a $D(G(z))$ con $D(G(z)) = 0{,}2$ y con $D(G(z)) = 0{,}01$.
#### Paso 1
$V = \ln0{,}9 + \ln(1-0{,}2) = -0{,}1054 - 0{,}2231 = -0{,}3285$. El discriminador maximiza $V$, de modo que su pérdida BCE es $-V = 0{,}3285$.
#### Paso 2
Generador saturante: minimiza $\ln(1 - D(G(z))) = \ln0{,}8 = -0{,}2231$. Generador no saturante: minimiza $-\ln D(G(z)) = -\ln0{,}2 = 1{,}6094$.
#### Paso 3
Módulo del gradiente respecto a $D(G(z))$. Para $\ln(1-D)$ es $\frac{1}{1-D}$. Para $\ln D$ es $\frac{1}{D}$. Con $D(G(z)) = 0{,}2$: $\frac{1}{0{,}8} = 1{,}25$ frente a $\frac{1}{0{,}2} = 5$.
#### Paso 4
Con $D(G(z)) = 0{,}01$ (generador muy malo): $\frac{1}{0{,}99} = 1{,}0101$ frente a $\frac{1}{0{,}01} = 100$. Con $D(G(z)) = 0{,}01$ la versión saturante da un gradiente cien veces menor que la no saturante (1,0101 frente a 100). Por eso, cuando el generador es muy malo, aprende mucho más despacio con $\log(1-D)$ que con $\log D$. (Complemento que no sale del PDF: respecto al logit $a$ de la sigmoide, los gradientes valen $-D = -0{,}01$ y $-(1-D) = -0{,}99$, que es la causa real de la saturación.)

### Problema: discriminador óptimo, valor del juego y Jensen-Shannon con dos distribuciones discretas
El dato puede tomar dos valores. Con $p_{data} = (0{,}5,\ 0{,}5)$ y $p_g = (0{,}9,\ 0{,}1)$, calcula $D^*_G$ en cada valor, $V(D^*_G,G)$ y comprueba la identidad $V = 2\,D_{JS} - 2\ln2$.
#### Paso 1
$D^*_G = \frac{p_{data}}{p_{data}+p_g}$. Valor 1: $\frac{0{,}5}{1{,}4} = 0{,}3571$. Valor 2: $\frac{0{,}5}{0{,}6} = 0{,}8333$. Sus complementos son $0{,}6429$ y $0{,}1667$.
#### Paso 2
$V = \sum p_{data}\ln D^* + \sum p_g\ln(1-D^*)$, es decir:
$$0{,}5\ln0{,}3571 + 0{,}5\ln0{,}8333 + 0{,}9\ln0{,}6429 + 0{,}1\ln0{,}1667 = -0{,}5148 - 0{,}0912 - 0{,}3976 - 0{,}1792 = -1{,}1828$$
#### Paso 3
La media es $M = (0{,}7,\ 0{,}3)$. $D_{KL}(p_{data}\,\|\,M) = 0{,}5\ln\frac{0{,}5}{0{,}7} + 0{,}5\ln\frac{0{,}5}{0{,}3} = -0{,}1683 + 0{,}2554 = 0{,}0872$. $D_{KL}(p_g\,\|\,M) = 0{,}9\ln\frac{0{,}9}{0{,}7} + 0{,}1\ln\frac{0{,}1}{0{,}3} = 0{,}2262 - 0{,}1099 = 0{,}1163$.
#### Paso 4
$D_{JS} = \frac{1}{2}(0{,}0872 + 0{,}1163) = 0{,}1017$. Entonces $2\cdot0{,}1017 - 2\ln2 = 0{,}2035 - 1{,}3863 = -1{,}1828$, que coincide con $V$. El mínimo posible sería $-2\ln2 = -1{,}3863$, con $p_g = p_{data}$.

## 6. Flujos normalizantes

### ¿Qué limitaciones de VAE, GAN y modelos autorregresivos resuelven los flujos normalizantes (normalizing flows, NF)?
El VAE solo aproxima la verosimilitud con el ELBO. La GAN no da densidad explícita y es inestable. Los autorregresivos dan verosimilitud exacta, pero sin espacio latente compacto y con muestreo secuencial lento. Los NF dan verosimilitud exacta, entrenamiento estable por máxima verosimilitud, muestreo paralelo rápido y un espacio latente invertible.

### ¿Cuál es la idea básica de un flujo normalizante?
Transformar una distribución simple, como $z\sim\mathcal{N}(0,I)$, en la distribución de los datos mediante una función biyectiva (invertible y suave) $x = f(z)$.

### ¿Qué dos operaciones hace posibles la invertibilidad de $f$ en un flujo normalizante?
Generar: se muestrea $z$ y se evalúa $x = f(z)$ en una sola pasada. Y evaluar: se mapea una imagen real a su código, $z = f^{-1}(x)$, y se calcula su verosimilitud exacta $p(x)$.

### ¿Qué dice el teorema del cambio de variables para $x = f(z)$ invertible?
$p_X(x) = p_Z(f^{-1}(x))\,\left|\det J_{f^{-1}}(x)\right|$. Como $J_{f^{-1}} = J_f^{-1}$ y $\det A^{-1} = (\det A)^{-1}$, equivale a $p_X(x) = p_Z(z)\,\left|\det J_f(z)\right|^{-1}$.

### ¿Qué mide $|\det J_f(z)|$ y cómo se interpreta?
El cambio local de volumen que provoca $f$ en $z$. Si vale 1, conserva el volumen (rotaciones, traslaciones). Si es mayor que 1, el espacio se expande y la densidad se diluye. Si es menor que 1, se comprime y la densidad se concentra.

### ¿Cuál es la log-verosimilitud de un flujo formado por $K$ funciones $f_1,\dots,f_K$?
Con $z_0\to z_1\to\dots\to z_K = x$: $\log p_X(x) = \log p_Z(z_0) - \sum_{k=1}^{K}\log\left|\det J_{f_k}(z_{k-1})\right|$. Se entrena maximizando la suma de esta cantidad sobre el conjunto de datos.

### ¿Por qué hay que diseñar capas con jacobiano triangular en un flujo normalizante?
Porque el determinante de una matriz general $D\times D$ cuesta $O(D^3)$, inviable al entrenar. En una matriz triangular el determinante es el producto de la diagonal, de modo que $\log|\det J| = \sum_i\log|J_{ii}|$.

### ¿Cómo es una capa de acoplamiento afín (affine coupling) de RealNVP?
Se parte la entrada en dos mitades. La primera pasa sin cambios, $x_{1:d/2} = z_{1:d/2}$. La segunda se transforma así: $x_{d/2+1:d} = z_{d/2+1:d}\odot\exp(s(z_{1:d/2})) + t(z_{1:d/2})$.

### ¿Tienen que ser invertibles las redes $s$ y $t$ de una capa de acoplamiento?
No, pueden ser redes arbitrariamente complejas. La inversa solo las evalúa hacia delante sobre $x_{1:d/2}$: $z_{d/2+1:d} = (x_{d/2+1:d} - t(x_{1:d/2}))\odot\exp(-s(x_{1:d/2}))$.

### ¿Cuál es el log-determinante de una capa de acoplamiento afín?
La suma de las componentes de la salida de $s$, que tiene una por cada variable de la segunda mitad: $\sum_i s(z_{1:d/2})_i$. El jacobiano es triangular inferior, con unos y $\exp(s_i)$ en la diagonal.

### Problema: cambio de variables en dos dimensiones
Sea $z\sim\mathcal{N}(0,I_2)$ y la transformación $x_1 = 3z_1$, $x_2 = z_2 + z_1^2$. Calcula $p_X(x^*)$ para $z^* = (1,\ -1)$.
#### Paso 1
Se evalúa la densidad base: $p_Z(z^*) = \frac{1}{2\pi}e^{-(1^2+(-1)^2)/2} = \frac{e^{-1}}{2\pi} = 0{,}05855$.
#### Paso 2
Punto transformado: $x^* = (3\cdot1,\ -1 + 1) = (3,\ 0)$.
#### Paso 3
Jacobiano: $J_f(z) = \begin{bmatrix} 3 & 0 \\ 2z_1 & 1 \end{bmatrix}$, triangular inferior, de modo que $\det J_f = 3\cdot1 = 3$ (constante en todo el espacio).
#### Paso 4
$p_X(x^*) = \dfrac{p_Z(z^*)}{|\det J_f(z^*)|} = \dfrac{0{,}05855}{3} = 0{,}01952$. El volumen local se triplica, de modo que la densidad se divide entre 3.

### Problema: capa de acoplamiento afín, inversa y log-verosimilitud
En 2 dimensiones, una capa de acoplamiento afín usa $s(z_1) = 0{,}5\,z_1$ y $t(z_1) = z_1 + 1$. La entrada es $z = (1,\ 2)$ con base $\mathcal{N}(0,I_2)$. Calcula $x$, el log-determinante, $\log p_X(x)$ y comprueba la inversa.
#### Paso 1
$s(1) = 0{,}5$ y $t(1) = 2$. La primera componente no cambia, $x_1 = 1$. La segunda es $x_2 = z_2\,e^{s} + t = 2\,e^{0{,}5} + 2 = 3{,}2974 + 2 = 5{,}2974$.
#### Paso 2
Jacobiano: $\begin{bmatrix} 1 & 0 \\ \partial x_2/\partial z_1 & e^{0{,}5} \end{bmatrix}$. Su determinante es $e^{0{,}5}$, de modo que $\log|\det J| = 0{,}5 = s(z_1)$.
#### Paso 3
Log-densidad base: $\log p_Z(z) = -\frac{1^2 + 2^2}{2} - \ln(2\pi) = -2{,}5 - 1{,}8379 = -4{,}3379$.
#### Paso 4
$\log p_X(x) = \log p_Z(z) - \log|\det J| = -4{,}3379 - 0{,}5 = -4{,}8379$.
#### Paso 5
Inversa: $z_2 = (x_2 - t(x_1))\,e^{-s(x_1)} = (5{,}2974 - 2)\,e^{-0{,}5} = 3{,}2974\cdot0{,}6065 = 2{,}0$, que recupera la entrada.

## 7. Modelos de difusión

### ¿Qué ventajas tienen los modelos de difusión (denoising diffusion probabilistic models, DDPM) frente a las GAN y los flujos normalizantes?
Entrenamiento estable por máxima verosimilitud (ELBO), sin generador ni discriminador adversarios, y sin restricciones de arquitectura para tener un determinante jacobiano tratable.

### ¿Cuál es la idea de un modelo de difusión para generar datos?
Descomponer la generación en muchos pasos pequeños de eliminación de ruido. Cada paso predice solo una pequeña cantidad de ruido, así que la red puede ser cualquier arquitectura sin restricciones.

### ¿Qué dos cadenas de Markov forman un modelo de difusión?
Una cadena directa (forward) fija, $q(x_t\mid x_{t-1})$, que añade ruido gradualmente de $x_0$ a $x_T\sim\mathcal{N}(0,I)$. Y una cadena inversa (reverse) aprendida, $p_\theta(x_{t-1}\mid x_t)$, que elimina el ruido de $x_T$ hasta $x_0$.

### ¿Cómo se factorizan la cadena directa y la inversa de un modelo de difusión?
La directa es un producto de transiciones de Markov: $q(x_{1:T}\mid x_0) = \prod_{t=1}^{T} q(x_t\mid x_{t-1})$. La inversa parte del prior y también es un producto: $p_\theta(x_{0:T}) = p(x_T)\prod_{t=1}^{T} p_\theta(x_{t-1}\mid x_t)$, con $p(x_T) = \mathcal{N}(0,I)$.

### ¿Cuál es la transición de un paso del proceso directo?
$q(x_t\mid x_{t-1}) = \mathcal{N}\!\left(\sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\right)$, es decir $x_t = \sqrt{1-\beta_t}\,x_{t-1} + \sqrt{\beta_t}\,\epsilon$ con $\epsilon\sim\mathcal{N}(0,I)$. Los $\beta_t\in(0,1)$ son la planificación (schedule) de varianza.

### ¿Qué papel tienen los dos factores $\sqrt{1-\beta_t}$ y $\sqrt{\beta_t}$ en el paso directo?
El primero reduce ligeramente la magnitud de la señal. El segundo añade ruido gaussiano isótropo.

### ¿Cómo se definen $\alpha_t$ y $\bar{\alpha}_t$ y para qué sirven?
$\alpha_t = 1-\beta_t$ y $\bar{\alpha}_t = \prod_{s=1}^{t}\alpha_s$. Permiten saltar de $x_0$ a cualquier $x_t$ en un solo paso, sin iterar.

### ¿Cuál es la distribución del estado ruidoso $x_t$ dado $x_0$?
$q(x_t\mid x_0) = \mathcal{N}\!\left(\sqrt{\bar{\alpha}_t}\,x_0,\ (1-\bar{\alpha}_t)I\right)$. Reparametrizada, $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$.

### ¿Qué pasa con $x_t$ cuando $t\to T$?
$\bar{\alpha}_T\to0$, de modo que $x_T$ es indistinguible de ruido $\mathcal{N}(0,I)$ y se puede usar como punto de partida del proceso inverso.

### ¿Qué parametriza la red neuronal del proceso inverso?
Cada paso $p_\theta(x_{t-1}\mid x_t) = \mathcal{N}(\mu_\theta(x_t,t),\Sigma(x_t,t))$. La red no predice la media directamente sino el ruido añadido, $\epsilon_\theta(x_t,t)$.

### ¿Cuál es la media del paso inverso en función del ruido predicho?
$$\mu_\theta(x_t,t) = \frac{1}{\sqrt{\alpha_t}}\left(x_t - \frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\,\epsilon_\theta(x_t,t)\right)$$

### ¿Cómo se fija la varianza del paso inverso en DDPM?
Es fija y no aprendida: $\Sigma(x_t,t) = \sigma_t^2 I$ con $\sigma_t^2 = \beta_t$. El paso es $x_{t-1} = \mu_\theta(x_t,t) + \sigma_t z$ con $z\sim\mathcal{N}(0,I)$.

### ¿Cómo se estima $x_0$ de golpe a partir de $x_t$ y del ruido predicho?
Despejando $x_0$ de la fórmula directa: $x_0 = \dfrac{1}{\sqrt{\bar{\alpha}_t}}\left(x_t - \sqrt{1-\bar{\alpha}_t}\,\epsilon_\theta(x_t,t)\right)$. Es exacto si $\epsilon_\theta$ es el ruido verdadero.

### ¿Qué pasos tiene un paso de entrenamiento de un DDPM?
Se toma un minilote de datos limpios $x_0$, se sortea un $t\sim\mathcal{U}(1,T)$ independiente para cada muestra y un ruido $\epsilon\sim\mathcal{N}(0,I)$, se construye $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$, se predice $\epsilon_\theta(x_t,t)$ y se actualiza $\theta$ con la pérdida $\|\epsilon - \epsilon_\theta(x_t,t)\|^2$.

### ¿Qué pérdida se usa para entrenar un DDPM y qué red suele implementarla?
El error cuadrático medio entre el ruido verdadero y el predicho, $\mathcal{L}(\theta) = \|\epsilon - \epsilon_\theta(x_t,t)\|^2$. La red suele ser una U-Net o un Transformer de difusión (DiT) con embeddings posicionales del instante $t$.

### ¿Cómo se genera una muestra con un DDPM entrenado (inferencia)?
Se parte de $x_T\sim\mathcal{N}(0,I)$ y, para $t = T,\dots,1$, se calcula $\epsilon_\theta$, la media $\mu_\theta$, se sortea $z\sim\mathcal{N}(0,I)$ (o $z = 0$ si $t = 1$) y se actualiza $x_{t-1} = \mu_\theta + \sigma_t z$. La salida es $x_0$.

### ¿Por qué en el último paso de inferencia no se añade ruido?
Porque con $t = 1$ el resultado es la muestra final $x_0$ y se quiere el dato limpio, de modo que se toma $z = 0$ y $x_0 = \mu_\theta(x_1,1)$. (La razón es un complemento, el PDF solo da la regla.)

### Demostración: $q(x_t\mid x_0)$ es gaussiana con media $\sqrt{\bar{\alpha}_t}\,x_0$ y varianza $1-\bar{\alpha}_t$
Demuestra por inducción que $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$. La transparencia da el resultado sin desarrollo.
#### Paso 1
Caso base: $t = 1$. $x_1 = \sqrt{\alpha_1}\,x_0 + \sqrt{1-\alpha_1}\,\epsilon_1$, y $\bar{\alpha}_1 = \alpha_1$, de modo que se cumple.
#### Paso 2
Hipótesis: $x_{t-1} = \sqrt{\bar{\alpha}_{t-1}}\,x_0 + \sqrt{1-\bar{\alpha}_{t-1}}\,\epsilon'$. Se sustituye en el paso $x_t = \sqrt{\alpha_t}\,x_{t-1} + \sqrt{1-\alpha_t}\,\epsilon_t$, con $\epsilon'$ y $\epsilon_t$ independientes:
$$x_t = \sqrt{\alpha_t\bar{\alpha}_{t-1}}\,x_0 + \sqrt{\alpha_t(1-\bar{\alpha}_{t-1})}\,\epsilon' + \sqrt{1-\alpha_t}\,\epsilon_t$$
#### Paso 3
Como $\alpha_t\bar{\alpha}_{t-1} = \bar{\alpha}_t$, el coeficiente de $x_0$ es $\sqrt{\bar{\alpha}_t}$. Los dos últimos términos son gaussianos independientes de media cero, de modo que su suma es una gaussiana de media cero con la suma de varianzas.
#### Paso 4
Varianza: $\alpha_t(1-\bar{\alpha}_{t-1}) + (1-\alpha_t) = \alpha_t - \bar{\alpha}_t + 1 - \alpha_t = 1-\bar{\alpha}_t$. Por tanto la suma equivale a $\sqrt{1-\bar{\alpha}_t}\,\epsilon$ con $\epsilon\sim\mathcal{N}(0,I)$ y queda $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$.

### Problema: proceso directo en dos pasos y en un salto
Con $T = 2$, $\beta_1 = 0{,}1$, $\beta_2 = 0{,}4$ y un dato $x_0 = 2{,}0$, calcula $x_1$ y $x_2$ paso a paso con los ruidos $\epsilon_1 = 0{,}8$ y $\epsilon_2 = -0{,}5$. Después da la media y la varianza de $q(x_2\mid x_0)$ y el ruido $\epsilon$ que habría dado el mismo $x_2$ en un solo salto.
#### Paso 1
Constantes: $\alpha_1 = 0{,}9$, $\alpha_2 = 0{,}6$, $\bar{\alpha}_1 = 0{,}9$, $\bar{\alpha}_2 = 0{,}9\cdot0{,}6 = 0{,}54$.
#### Paso 2
$x_1 = \sqrt{0{,}9}\cdot2{,}0 + \sqrt{0{,}1}\cdot0{,}8 = 0{,}9487\cdot2 + 0{,}3162\cdot0{,}8 = 1{,}8974 + 0{,}2530 = 2{,}1503$.
#### Paso 3
$x_2 = \sqrt{0{,}6}\cdot2{,}1503 + \sqrt{0{,}4}\cdot(-0{,}5) = 0{,}7746\cdot2{,}1503 - 0{,}3162 = 1{,}6657 - 0{,}3162 = 1{,}3494$.
#### Paso 4
Salto directo: media $\sqrt{0{,}54}\cdot2 = 0{,}7348\cdot2 = 1{,}4697$ y varianza $1 - 0{,}54 = 0{,}46$. La varianza coincide con $\alpha_2(1-\alpha_1) + (1-\alpha_2) = 0{,}6\cdot0{,}1 + 0{,}4 = 0{,}46$.
#### Paso 5
El ruido equivalente cumple $1{,}4697 + \sqrt{0{,}46}\,\epsilon = 1{,}3494$, de modo que $\epsilon = (1{,}3494 - 1{,}4697)/0{,}6782 = -0{,}1773$. Es una combinación de $\epsilon_1$ y $\epsilon_2$, y no uno de ellos.

### Problema: un paso de entrenamiento de un DDPM con estimación de $x_0$
Con $\beta_1 = 0{,}1$, $\beta_2 = 0{,}4$, un dato $x_0 = 2{,}0$, el instante $t = 2$ y el ruido $\epsilon = -0{,}5$, construye $x_t$. La red predice $\epsilon_\theta = -0{,}2$. Calcula la pérdida y la estimación de $x_0$ a partir de la predicción, y compárala con la que daría un ruido perfecto.
#### Paso 1
$\bar{\alpha}_2 = 0{,}54$. $x_2 = \sqrt{0{,}54}\cdot2{,}0 + \sqrt{0{,}46}\cdot(-0{,}5) = 1{,}4697 - 0{,}3391 = 1{,}1306$.
#### Paso 2
Pérdida: $(\epsilon - \epsilon_\theta)^2 = (-0{,}5 + 0{,}2)^2 = 0{,}09$.
#### Paso 3
Estimación de $x_0$: $\dfrac{1}{\sqrt{0{,}54}}\left(1{,}1306 - \sqrt{0{,}46}\cdot(-0{,}2)\right) = \dfrac{1{,}1306 + 0{,}1356}{0{,}7348} = 1{,}7231$.
#### Paso 4
Con el ruido perfecto $\epsilon_\theta = -0{,}5$: $\dfrac{1{,}1306 + 0{,}3391}{0{,}7348} = 2{,}0$, que recupera $x_0$. Un error de $0{,}3$ en el ruido produce un error de $0{,}2769$ en $x_0$.

### Problema: dos pasos de inferencia de un DDPM
Con $\beta_1 = 0{,}1$ y $\beta_2 = 0{,}4$, la inferencia empieza en $x_2 = 1{,}0$. La red predice $\epsilon_\theta(x_2,2) = 0{,}5$ y se sortea $z_2 = 0{,}4$. En el último paso predice $\epsilon_\theta(x_1,1) = -0{,}3$. Calcula $x_1$ y $x_0$.
#### Paso 1
Constantes: $\alpha_2 = 0{,}6$, $\bar{\alpha}_2 = 0{,}54$, $\sigma_2 = \sqrt{0{,}4} = 0{,}6325$ y $\dfrac{\beta_2}{\sqrt{1-\bar{\alpha}_2}} = \dfrac{0{,}4}{0{,}6782} = 0{,}5898$.
#### Paso 2
Media: $\mu_\theta(x_2,2) = \dfrac{1}{\sqrt{0{,}6}}\,(1{,}0 - 0{,}5898\cdot0{,}5) = \dfrac{0{,}7051}{0{,}7746} = 0{,}9103$.
#### Paso 3
$x_1 = 0{,}9103 + 0{,}6325\cdot0{,}4 = 0{,}9103 + 0{,}2530 = 1{,}1633$.
#### Paso 4
Último paso: $\alpha_1 = \bar{\alpha}_1 = 0{,}9$ y $\dfrac{\beta_1}{\sqrt{1-\bar{\alpha}_1}} = \dfrac{0{,}1}{0{,}3162} = 0{,}3162$. Media: $\mu_\theta(x_1,1) = \dfrac{1}{\sqrt{0{,}9}}\,(1{,}1633 - 0{,}3162\cdot(-0{,}3)) = \dfrac{1{,}2582}{0{,}9487} = 1{,}3262$.
#### Paso 5
En $t = 1$ no se añade ruido ($z = 0$), de modo que $x_0 = 1{,}3262$.
