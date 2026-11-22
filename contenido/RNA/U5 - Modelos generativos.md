# RNA U5 - Modelos generativos

## 2. Convoluciones transpuestas

### ¿Para qué sirve una convolución transpuesta (transposed convolution)?
Para aumentar (upsample) las dimensiones espaciales de un mapa de características. También se llama convolución con paso fraccionario y se usa para deshacer el submuestreo que hacen las convoluciones normales.

### ¿En qué consiste el método "scatter and sum" de la convolución transpuesta?
Cada elemento $y_{ij}$ de la entrada multiplica todo el filtro $W$ y el resultado se coloca (scatter) en la posición correspondiente de la salida. Las contribuciones que se solapan se suman.

### ¿Qué tamaño de salida produce una convolución transpuesta con entrada de lado $y$, filtro $f$, paso $s$ y relleno $p$?
$x = s\,(y-1) + f - 2p$. Con $s=1$, $p=0$, $y=2$, $f=2$ da 3. Con $s=2$ da 4. (Fórmula general: complemento, las transparencias solo dan los casos $s=1$ y $s=2$.)

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

## 3. Autoencoders

### ¿Qué objetivo tiene un autoencoder (AE) y cómo se entrena sin etiquetas?
Aprender una representación comprimida de los datos. Se entrena para reconstruir su propia entrada, $x \to \hat{x}$, después de pasarla por un cuello de botella, de modo que la propia entrada hace de objetivo.

### ¿Qué pérdidas de reconstrucción se usan en un autoencoder?
El error cuadrático medio, $\frac{1}{D}\sum_i (x_i - \hat{x}_i)^2$, y la entropía cruzada binaria (BCE), $-\sum_i [x_i\log\hat{x}_i + (1-x_i)\log(1-\hat{x}_i)]$. La BCE exige $x_i \in [0,1]$ y $\hat{x}_i \in (0,1)$, normalmente con una sigmoide en la salida.

### ¿Qué diferencia hay entre un autoencoder subcompleto y uno con eliminación de ruido (denoising)?
El subcompleto (undercomplete) tiene una dimensión latente menor que la de entrada, para comprimir. El de eliminación de ruido (DAE) corrompe la entrada durante el entrenamiento, $\tilde{x} \sim q(\tilde{x}\mid x)$, y exige reconstruir la original sin corromper. Así no puede aprender la identidad.

### ¿Qué busca un autoencoder disperso (sparse) y cómo lo consigue?
Que las unidades ocultas estén casi siempre inactivas, sin reducir el tamaño de la capa. Añade a la pérdida una penalización sobre la activación media de cada unidad: $\mathcal{L} = \mathcal{L}_{rec} + \beta\sum_j \text{Penalty}(\rho,\hat{\rho}_j) + \lambda\,\Omega(W)$.

### ¿Qué penalizaciones de dispersión se usan?
La divergencia KL entre dos Bernoullis, $\text{KL}(\rho\,\|\,\hat{\rho}_j) = \rho\log\frac{\rho}{\hat{\rho}_j} + (1-\rho)\log\frac{1-\rho}{1-\hat{\rho}_j}$, con $\rho$ un objetivo pequeño (por ejemplo 0,05). O una penalización $L_1$ directa sobre las activaciones, $\sum_j |h_j|$.

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

### ¿Qué es la cota inferior de la evidencia (ELBO)?
$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi(z\mid x)}\left[\log\frac{p_\theta(x,z)}{q_\phi(z\mid x)}\right]$. Cumple $\log p_\theta(x) = \mathcal{L}_{ELBO} + D_{KL}(q_\phi(z\mid x)\,\|\,p_\theta(z\mid x))$.

### ¿Qué dos términos tiene el ELBO tras usar $p_\theta(x,z) = p_\theta(x\mid z)\,p(z)$?
$\mathcal{L}_{ELBO} = \mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)] - D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$. El primero es la reconstrucción y el segundo es la regularización hacia el prior.

### ¿Cuál es la función de pérdida que minimiza un VAE?
El ELBO cambiado de signo, porque las redes se entrenan minimizando: $\text{Loss}_{VAE} = -\mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)] + D_{KL}(q_\phi(z\mid x)\,\|\,p(z))$.

### ¿Cuál es la definición de la divergencia KL entre dos distribuciones continuas?
$D_{KL}(q\,\|\,p) = \int q(z)\log\frac{q(z)}{p(z)}\,dz = \mathbb{E}_q\left[\log\frac{q(z)}{p(z)}\right]$. Es no negativa y vale cero solo cuando $q = p$. No es simétrica.

### ¿Cuál es el problema de muestrear $z \sim q_\phi(z\mid x)$ dentro de la red?
Que el muestreo es un nodo estocástico no diferenciable, de modo que el gradiente no puede pasar por él hacia el codificador.

### ¿En qué consiste el truco de reparametrización (reparameterization trick)?
En escribir el muestreo de forma determinista aislando el azar en una variable auxiliar: $z = \mu_\phi(x) + \sigma_\phi(x)\odot\epsilon$, con $\epsilon \sim \mathcal{N}(0,I)$ y $\odot$ el producto elemento a elemento. La aleatoriedad queda en $\epsilon$ y el gradiente fluye por $\mu_\phi$ y $\sigma_\phi$.

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

### ¿Cuál es el discriminador óptimo para un generador fijo?
$D^*_G(x) = \dfrac{p_{data}(x)}{p_{data}(x) + p_g(x)}$, con $p_g$ la distribución de las muestras generadas. Vale $\frac{1}{2}$ donde ambas densidades coinciden.

### ¿Cómo se define la divergencia de Jensen-Shannon?
$D_{JS}(P\,\|\,Q) = \frac{1}{2}D_{KL}\!\left(P\,\Big\|\,\frac{P+Q}{2}\right) + \frac{1}{2}D_{KL}\!\left(Q\,\Big\|\,\frac{P+Q}{2}\right)$. Es simétrica, a diferencia de la KL.

### ¿Qué es una LeakyReLU y cuál es su derivada?
$\text{LeakyReLU}(x) = \max(\alpha x, x)$ para un $\alpha$ pequeño, de modo que las entradas negativas conservan una pendiente $\alpha$ en lugar de 0. Su derivada es 1 si $x > 0$ y $\alpha$ si $x < 0$.

### ¿Cómo se entrena una GAN con la pérdida BCE en cada lote?
Con $\mathcal{L} = -[y\log D(x) + (1-y)\log(1 - D(G(z)))]$. Paso 1, se entrena el discriminador con muestras reales (etiqueta 1) y generadas (etiqueta 0). Paso 2, se entrena el generador con las muestras generadas etiquetadas como reales (1).

### ¿Por qué el generador maximiza $\log D(G(z))$ en lugar de minimizar $\log(1 - D(G(z)))$?
Al empezar, $G$ es malo y $D(G(z))\approx0$. Entonces $\log(1-D)$ tiene una derivada de módulo $\frac{1}{1-D}\approx1$, pequeña, y el aprendizaje es lento. Con $\log D$ la derivada es $\frac{1}{D}$, grande al principio, y se reduce cuando $G$ mejora.

### ¿Qué añade una GAN condicional (cGAN) a una GAN convencional?
Control sobre lo que se genera. Tanto $G$ como $D$ reciben una información auxiliar $y$, que puede ser una clase (one-hot), un embedding de texto o una imagen (mapa de bordes, máscara, imagen de baja resolución).

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

### ¿Cuál es la idea básica de un flujo normalizante?
Transformar una distribución simple, como $z\sim\mathcal{N}(0,I)$, en la distribución de los datos mediante una función biyectiva (invertible y suave) $x = f(z)$.

### ¿Qué dice el teorema del cambio de variables para $x = f(z)$ invertible?
$p_X(x) = p_Z(f^{-1}(x))\,\left|\det J_{f^{-1}}(x)\right|$. Como $J_{f^{-1}} = J_f^{-1}$ y $\det A^{-1} = (\det A)^{-1}$, equivale a $p_X(x) = p_Z(z)\,\left|\det J_f(z)\right|^{-1}$.

### ¿Cuál es la log-verosimilitud de un flujo formado por $K$ funciones $f_1,\dots,f_K$?
Con $z_0\to z_1\to\dots\to z_K = x$: $\log p_X(x) = \log p_Z(z_0) - \sum_{k=1}^{K}\log\left|\det J_{f_k}(z_{k-1})\right|$. Se entrena maximizando la suma de esta cantidad sobre el conjunto de datos.

### ¿Cómo es una capa de acoplamiento afín (affine coupling) de RealNVP?
Se parte la entrada en dos mitades. La primera pasa sin cambios, $x_{1:d/2} = z_{1:d/2}$. La segunda se transforma así: $x_{d/2+1:d} = z_{d/2+1:d}\odot\exp(s(z_{1:d/2})) + t(z_{1:d/2})$.

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

### ¿Qué dos cadenas de Markov forman un modelo de difusión?
Una cadena directa (forward) fija, $q(x_t\mid x_{t-1})$, que añade ruido gradualmente de $x_0$ a $x_T\sim\mathcal{N}(0,I)$. Y una cadena inversa (reverse) aprendida, $p_\theta(x_{t-1}\mid x_t)$, que elimina el ruido de $x_T$ hasta $x_0$.

### ¿Cuál es la transición de un paso del proceso directo?
$q(x_t\mid x_{t-1}) = \mathcal{N}\!\left(\sqrt{1-\beta_t}\,x_{t-1},\ \beta_t I\right)$, es decir $x_t = \sqrt{1-\beta_t}\,x_{t-1} + \sqrt{\beta_t}\,\epsilon$ con $\epsilon\sim\mathcal{N}(0,I)$. Los $\beta_t\in(0,1)$ son la planificación (schedule) de varianza.

### ¿Cómo se definen $\alpha_t$ y $\bar{\alpha}_t$ y para qué sirven?
$\alpha_t = 1-\beta_t$ y $\bar{\alpha}_t = \prod_{s=1}^{t}\alpha_s$. Permiten saltar de $x_0$ a cualquier $x_t$ en un solo paso, sin iterar.

### ¿Cuál es la distribución del estado ruidoso $x_t$ dado $x_0$?
$q(x_t\mid x_0) = \mathcal{N}\!\left(\sqrt{\bar{\alpha}_t}\,x_0,\ (1-\bar{\alpha}_t)I\right)$. Reparametrizada, $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$.

### ¿Cuál es la media del paso inverso en función del ruido predicho?
$$\mu_\theta(x_t,t) = \frac{1}{\sqrt{\alpha_t}}\left(x_t - \frac{\beta_t}{\sqrt{1-\bar{\alpha}_t}}\,\epsilon_\theta(x_t,t)\right)$$

### ¿Cómo se fija la varianza del paso inverso en DDPM?
Es fija y no aprendida: $\Sigma(x_t,t) = \sigma_t^2 I$ con $\sigma_t^2 = \beta_t$. El paso es $x_{t-1} = \mu_\theta(x_t,t) + \sigma_t z$ con $z\sim\mathcal{N}(0,I)$.

### ¿Cómo se estima $x_0$ de golpe a partir de $x_t$ y del ruido predicho?
Despejando $x_0$ de la fórmula directa: $x_0 = \dfrac{1}{\sqrt{\bar{\alpha}_t}}\left(x_t - \sqrt{1-\bar{\alpha}_t}\,\epsilon_\theta(x_t,t)\right)$. Es exacto si $\epsilon_\theta$ es el ruido verdadero.

### ¿Qué pasos tiene un paso de entrenamiento de un DDPM?
Se toma un minilote de datos limpios $x_0$, se sortea un $t\sim\mathcal{U}(1,T)$ independiente para cada muestra y un ruido $\epsilon\sim\mathcal{N}(0,I)$, se construye $x_t = \sqrt{\bar{\alpha}_t}\,x_0 + \sqrt{1-\bar{\alpha}_t}\,\epsilon$, se predice $\epsilon_\theta(x_t,t)$ y se actualiza $\theta$ con la pérdida $\|\epsilon - \epsilon_\theta(x_t,t)\|^2$.

### ¿Cómo se genera una muestra con un DDPM entrenado (inferencia)?
Se parte de $x_T\sim\mathcal{N}(0,I)$ y, para $t = T,\dots,1$, se calcula $\epsilon_\theta$, la media $\mu_\theta$, se sortea $z\sim\mathcal{N}(0,I)$ (o $z = 0$ si $t = 1$) y se actualiza $x_{t-1} = \mu_\theta + \sigma_t z$. La salida es $x_0$.

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
