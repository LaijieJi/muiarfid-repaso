# RNA U2 - Backpropagation

## 1. Introducción

### ¿Qué calcula el algoritmo de backpropagation y qué no hace?
Calcula el gradiente de la pérdida respecto a los parámetros de cada capa de un perceptrón multicapa. No actualiza nada: el gradiente se entrega a un algoritmo de optimización, como el descenso de gradiente, que es quien modifica los parámetros.

## 2. Algoritmo de backprop

### ¿Cómo se modela una red para aplicar backprop?
Como una cadena de $L-1$ capas, $x^{(1)}=x \to x^{(2)}=f^{(1)}(x^{(1)},\theta^{(1)}) \to \dots \to x^{(L)}=f^{(L-1)}(x^{(L-1)},\theta^{(L-1)})$. La pérdida se añade como la capa $L$, $x^{(L+1)}=f^{(L)}(x^{(L)},y)=\mathcal{L}$, que no tiene parámetros ($\theta=\emptyset$).

### ¿Qué calcula la pasada forward?
$x^{(1)}=x$ y, para $\ell=1,\dots,L$, la salida $x^{(\ell+1)}=f^{(\ell)}(x^{(\ell)},\theta^{(\ell)})$. La última salida es el valor de la pérdida.

### ¿Con qué valor arranca la pasada backward y por qué?
Con $u^{(L+1)}=1$, porque es la derivada de la pérdida respecto a sí misma. A partir de ahí se propaga hacia atrás con la regla de la cadena.

### ¿Qué fórmulas aplica la pasada backward en cada capa $\ell=L,\dots,1$?
$$g^{(\ell)}=u^{(\ell+1)t}\,\frac{\partial x^{(\ell+1)}}{\partial \theta^{(\ell)}} \qquad u^{(\ell)t}=u^{(\ell+1)t}\,\frac{\partial x^{(\ell+1)}}{\partial x^{(\ell)}}$$

Aquí $u^{(\ell)}$ es el gradiente de la pérdida respecto a $x^{(\ell)}$, que es la entrada de la capa $\ell$.

### ¿Por qué hay que guardar las salidas de todas las capas durante el forward?
Porque el backward las necesita para evaluar las derivadas locales. Por ejemplo, el gradiente de los pesos de una capa lineal usa su entrada, y el de una activación usa su preactivación.

### ¿Qué gradientes tiene una capa lineal $x^{(\ell+1)}=Wx^{(\ell)}+b$ cuando recibe $u^t=\partial L/\partial x^{(\ell+1)}$ (fila)?
$$\frac{\partial L}{\partial W}=x^{(\ell)}\,u^{t} \qquad \frac{\partial L}{\partial b}=u^{t} \qquad \frac{\partial L}{\partial x^{(\ell)}}=u^{t}\,W$$

En numerator layout el gradiente de $W$ es un producto exterior con la forma de $W^t$, y los de $b$ y $x^{(\ell)}$ son filas.

### ¿Cómo atraviesa el gradiente una activación que se aplica elemento a elemento, $x^{(\ell+1)}=f(x^{(\ell)})$?
Se multiplica elemento a elemento por la derivada de la activación: $\partial L/\partial x^{(\ell)}=\big(\partial L/\partial x^{(\ell+1)}\big)\odot f'(x^{(\ell)})$. Una activación no tiene parámetros, así que solo propaga el gradiente.

### ¿Qué forma tiene el gradiente de una matriz de pesos y cómo se usa en la actualización?
En numerator layout $\partial L/\partial W$ tiene la forma de $W^t$ ($n\times m$ si $W$ es $m\times n$). Por eso la actualización traspone: $W\leftarrow W-\eta\,(\partial L/\partial W)^t$, y lo mismo con los sesgos.

## 3. Ejemplo de regresión con una muestra

### ¿Qué dimensiones tienen $W^{(1)}$, $b^{(1)}$, $W^{(3)}$ y $b^{(3)}$ en una red $3\to 2\to 1$?
$W^{(1)}$ es $2\times 3$, $b^{(1)}$ tiene 2 componentes, $W^{(3)}$ es $1\times 2$ y $b^{(3)}$ es un escalar. Cada matriz tiene tantas filas como salidas y tantas columnas como entradas.

### ¿Cómo se calculan los gradientes de la capa de salida lineal en ese ejemplo?
Con $\delta=\partial L/\partial\hat y$: $\partial L/\partial W^{(3)}=\delta\,x^{(3)t}$ y $\partial L/\partial b^{(3)}=\delta$. El primero es la entrada de la capa ponderada por el error de salida. Se escribe con la forma de $W^{(3)}$, la traspuesta de la numerator layout.

### ¿Cómo llega el gradiente de la pérdida hasta la preactivación $x^{(2)}$ de la capa oculta?
Primero atraviesa la capa lineal, $\partial L/\partial x^{(3)}=W^{(3)t}\delta$, y después la sigmoide: $\partial L/\partial x^{(2)}=\partial L/\partial x^{(3)}\odot\sigma'(x^{(2)})$.

### ¿Cuál es la derivada de la sigmoide en función de la propia sigmoide?
$\sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)$. Es cómoda porque el forward ya calculó $\sigma(z)$, así que el backward no necesita volver a evaluar exponenciales.

### ¿Cuánto vale $\sigma'$ en su máximo y qué pasa cuando la sigmoide está saturada?
El máximo es $\sigma'(0)=1/4$. Si $|z|$ es grande, $\sigma(z)$ se acerca a 0 o a 1 y $\sigma'$ se acerca a 0 (por ejemplo, $\sigma'(4)\approx 0{,}0177$). El gradiente que pasa por esa capa se atenúa mucho.

### ¿Por qué se calculan todos los gradientes antes de actualizar ningún parámetro?
Porque el backward usa los pesos vigentes para propagar el gradiente hacia atrás. Si se actualizara $W^{(3)}$ antes de calcular $\partial L/\partial x^{(3)}=W^{(3)t}\delta$, el gradiente de las capas anteriores saldría con pesos que ya no corresponden al forward.

### ¿Cuál es la regla de actualización del descenso de gradiente para un parámetro $\theta$?
$\theta\leftarrow\theta-\eta\,\Big(\dfrac{\partial L}{\partial\theta}\Big)^t$, con $\eta$ la tasa de aprendizaje. Se aplica capa a capa y la traspuesta devuelve cada gradiente al formato del parámetro.

### Si todos los pesos de la capa oculta y de la capa siguiente empiezan con el mismo valor, ¿qué ocurre con las unidades ocultas?
Todas las unidades ocultas calculan lo mismo y reciben el mismo gradiente, así que siguen siendo idénticas tras cada actualización y la capa se comporta como una sola unidad. Si solo fueran iguales los pesos de entrada y los de salida fueran distintos, los gradientes diferirían. Por eso se inicializa de forma aleatoria.

### Demostración: derivada de la sigmoide
Demuestra que $\sigma'(z)=\sigma(z)(1-\sigma(z))$ para $\sigma(z)=\dfrac{1}{1+e^{-z}}$, y evalúa $\sigma'(0)$ y $\sigma'(4)$.
#### Paso 1
Se escribe $\sigma(z)=(1+e^{-z})^{-1}$ y se deriva con la regla de la cadena:

$$\sigma'(z)=-(1+e^{-z})^{-2}\cdot(-e^{-z})=\frac{e^{-z}}{(1+e^{-z})^2}$$
#### Paso 2
Se separa en dos factores:

$$\sigma'(z)=\frac{1}{1+e^{-z}}\cdot\frac{e^{-z}}{1+e^{-z}}=\sigma(z)\cdot\frac{e^{-z}}{1+e^{-z}}$$
#### Paso 3
El segundo factor es $1-\sigma(z)$, porque

$$1-\frac{1}{1+e^{-z}}=\frac{(1+e^{-z})-1}{1+e^{-z}}=\frac{e^{-z}}{1+e^{-z}}$$

Por tanto, $\sigma'(z)=\sigma(z)\big(1-\sigma(z)\big)$.
#### Paso 4
Evaluación. En $z=0$ se tiene $\sigma(0)=0{,}5$, así que $\sigma'(0)=0{,}5\cdot 0{,}5=0{,}25$. En $z=4$ se tiene $\sigma(4)\approx 0{,}9820$, así que $\sigma'(4)\approx 0{,}9820\cdot 0{,}0180\approx 0{,}0177$. La sigmoide saturada casi no deja pasar gradiente.

### Problema: una iteración completa con capa oculta sigmoide y salida lineal
Red con entrada $x\in\mathbb{R}^2$, capa oculta de dos sigmoides y salida lineal: $x^{(2)}=W^{(1)}x^{(1)}+b^{(1)}$, $x^{(3)}=\sigma(x^{(2)})$, $\hat y=x^{(4)}=W^{(3)}x^{(3)}+b^{(3)}$ y $L=(y-\hat y)^2$. Datos: $x=(1,2)^t$, $y=2$, $W^{(1)}=\begin{pmatrix}2&-1\\1&-0{,}5\end{pmatrix}$, $b^{(1)}=(0,0)^t$, $W^{(3)}=(2,\ -1)$, $b^{(3)}=0{,}5$ y $\eta=0{,}1$. Haz forward, backward y la actualización. Los gradientes de matrices se escriben con la forma del parámetro, traspuestos respecto a las transparencias.
#### Paso 1
Forward de la capa oculta:

$$x^{(2)}=\begin{pmatrix}2\cdot1-1\cdot2\\1\cdot1-0{,}5\cdot2\end{pmatrix}=\begin{pmatrix}0\\0\end{pmatrix}\qquad x^{(3)}=\begin{pmatrix}\sigma(0)\\\sigma(0)\end{pmatrix}=\begin{pmatrix}0{,}5\\0{,}5\end{pmatrix}$$
#### Paso 2
Forward de la salida y la pérdida:

$$\hat y=2\cdot0{,}5-1\cdot0{,}5+0{,}5=1\qquad L=(2-1)^2=1$$
#### Paso 3
Backward de la salida. Se parte de $\partial L/\partial\hat y=2(\hat y-y)=-2$. Entonces:

$$\frac{\partial L}{\partial W^{(3)}}=-2\,(0{,}5,\ 0{,}5)=(-1,\ -1)\qquad\frac{\partial L}{\partial b^{(3)}}=-2$$
#### Paso 4
Hacia la capa oculta. Se multiplica por $W^{(3)t}$ y después por $\sigma'(x^{(2)})$, con $\sigma'(0)=0{,}5(1-0{,}5)=0{,}25$:

$$\frac{\partial L}{\partial x^{(3)}}=W^{(3)t}(-2)=\begin{pmatrix}-4\\2\end{pmatrix}\qquad\frac{\partial L}{\partial x^{(2)}}=\begin{pmatrix}-4\cdot0{,}25\\2\cdot0{,}25\end{pmatrix}=\begin{pmatrix}-1\\0{,}5\end{pmatrix}$$
#### Paso 5
Gradientes de la primera capa:

$$\frac{\partial L}{\partial W^{(1)}}=\begin{pmatrix}-1\\0{,}5\end{pmatrix}(1,\ 2)=\begin{pmatrix}-1&-2\\0{,}5&1\end{pmatrix}\qquad\frac{\partial L}{\partial b^{(1)}}=\begin{pmatrix}-1\\0{,}5\end{pmatrix}$$
#### Paso 6
Actualización con $\eta=0{,}1$, una vez calculados todos los gradientes:

$$W^{(3)}=(2,\ -1)-0{,}1(-1,\ -1)=(2{,}1,\ -0{,}9)\qquad b^{(3)}=0{,}5-0{,}1(-2)=0{,}7$$

$$W^{(1)}=\begin{pmatrix}2{,}1&-0{,}8\\0{,}95&-0{,}6\end{pmatrix}\qquad b^{(1)}=\begin{pmatrix}0{,}1\\-0{,}05\end{pmatrix}$$
#### Paso 7
Comprobación. Con los parámetros nuevos, $x^{(2)}=(0{,}6,\ -0{,}3)^t$, $x^{(3)}\approx(0{,}646,\ 0{,}426)^t$ y $\hat y\approx1{,}673$. Así $L\approx0{,}107$, mucho menor que la pérdida inicial 1.

### ¿Qué añaden la regularización L2 y L1 a la pérdida y cómo cambia la actualización de un peso?
Añaden a la pérdida una penalización sobre los pesos para prevenir el sobreajuste. Con L2 es $L+\frac{\lambda}{2}\|W\|_2^2$ y la actualización resta además un término proporcional al propio peso (decaimiento de pesos, *weight decay*). Con L1 es $L+\lambda\|W\|_1$ y se resta $\lambda\,\mathrm{sign}(W)$, un valor constante que empuja cada peso hacia cero.

Con $\lambda'$ el coeficiente de la pérdida, la actualización resta $\eta\lambda'W$. En las claves del profesor $\lambda$ es ese producto $\eta\lambda'$ (ya absorbe la tasa), de modo que se escribe $W\leftarrow W-\eta\,\partial L/\partial W-\lambda W$ para L2 y $W\leftarrow W-\eta\,\partial L/\partial W-\lambda\,\mathrm{sign}(W)$ para L1 (allí la tasa se llama $\mu$). Con la tasa explícita delante de $\lambda$, el decaimiento L2 sale como $W(1-\eta\lambda)-\eta\,\partial L/\partial W$. (Complemento: las diapositivas solo mencionan el decaimiento de pesos en AdamW y la norma L2 de los pesos y la L1 sobre activaciones en el autoencoder disperso. Las penalizaciones y la regla sobre los pesos de un perceptrón multicapa son conocimiento estándar.)

### Problema: un paso de descenso en la capa de salida lineal con L2 y con L1
Red con entrada $x=(2,\ 1)^t$, capa oculta de dos ReLU y salida lineal $\hat y=W^{(3)}x^{(3)}+b^{(3)}$ con error $L=\frac12(y-\hat y)^2$. Datos: $W^{(1)}=\begin{pmatrix}1&1\\1&-1\end{pmatrix}$, $b^{(1)}=(0,\ 0)^t$, $W^{(3)}=(1,\ -2)$, $b^{(3)}=1$, objetivo $y=4$ y $\eta=0{,}05$. Calcula el error y los gradientes de la capa de salida y da la actualización de $W^{(3)}$ y $b^{(3)}$ (las capas anteriores no se actualizan) sin regularizar, con L2 y con L1, con $\lambda=0{,}05$ (que absorbe la tasa de aprendizaje) y penalizando solo $W^{(3)}$. Compara los tres resultados.
#### Paso 1
Forward. La preactivación oculta es $x^{(2)}=(2+1,\ 2-1)^t=(3,\ 1)^t$ y ambas son positivas, de modo que $x^{(3)}=(3,\ 1)^t$. La salida es

$$\hat y=1\cdot3+(-2)\cdot1+1=2\qquad L=\tfrac12(4-2)^2=2$$
#### Paso 2
Gradientes de la capa de salida. Se parte de $\delta=\partial L/\partial\hat y=-(y-\hat y)=-2$. Entonces:

$$\frac{\partial L}{\partial W^{(3)}}=\delta\,x^{(3)t}=-2\,(3,\ 1)=(-6,\ -2)\qquad\frac{\partial L}{\partial b^{(3)}}=-2$$
#### Paso 3
Sin regularizar:

$$W^{(3)}=(1,\ -2)-0{,}05\,(-6,\ -2)=(1{,}3,\ -1{,}9)\qquad b^{(3)}=1-0{,}05\,(-2)=1{,}1$$
#### Paso 4
Con L2 se resta además $\lambda W$ con el peso anterior, $0{,}05\,(1,\ -2)=(0{,}05,\ -0{,}1)$:

$$W^{(3)}=(1{,}3-0{,}05,\ -1{,}9+0{,}1)=(1{,}25,\ -1{,}8)$$
#### Paso 5
Con L1 se resta $\lambda\,\mathrm{sign}(W)$, con $\mathrm{sign}(W^{(3)})=(1,\ -1)$, que da $(0{,}05,\ -0{,}05)$:

$$W^{(3)}=(1{,}3-0{,}05,\ -1{,}9+0{,}05)=(1{,}25,\ -1{,}85)$$

En los dos casos el sesgo queda en $1{,}1$, porque no se penaliza.
#### Paso 6
Comparación. La nueva salida es $3{,}1$ sin regularizar, $3{,}05$ con L2 y $3{,}0$ con L1, todas más cerca del objetivo 4 que el valor inicial 2. Frente a sin regularizar, los pesos quedan más cerca de cero. Con L2 encoge más el de mayor valor absoluto ($-2$ pierde $0{,}1$ y $1$ pierde $0{,}05$), mientras que con L1 cada uno pierde lo mismo ($0{,}05$). Así $\|W\|_2^2$ vale $5$ al principio, $5{,}3$ sin regularizar, $4{,}8025$ con L2 y $4{,}985$ con L1. El precio es un error algo mayor tras el paso, $L=0{,}405$ sin regularizar frente a $0{,}451$ con L2 y a $0{,}5$ con L1.

## 4. Ejemplo de regresión con un lote (batch)

### ¿Cómo se organizan los datos y el forward cuando se procesa un lote de $N$ muestras?
Cada muestra es una fila de $X\in\mathbb{R}^{N\times d}$. Una capa lineal se calcula como $X^{(\ell+1)}=X^{(\ell)}W^{(\ell)t}+\mathbf{1}\,b^{(\ell)t}$, donde $\mathbf{1}$ es un vector de unos de longitud $N$ que copia el sesgo en todas las filas.

### ¿Cómo se define la pérdida cuadrática de un lote?
Como la media de los errores individuales: $L=\dfrac1N\sum_n(y_n-\hat y_n)^2=\dfrac1N(y-\hat y)^t(y-\hat y)$.

### ¿Cuánto vale $\partial L/\partial\hat y$ en el lote?
$\dfrac{2}{N}(\hat y-y)^t$. El factor $1/N$ de la media aparece solo aquí, en la derivada de la pérdida, y no se repite en las capas siguientes.

### ¿Cómo se calcula el gradiente de los pesos de una capa lineal con un lote?
$\dfrac{\partial L}{\partial W^{t}}=X^{t}\,\dfrac{\partial L}{\partial X_{\text{sal}}}$, con $X$ la entrada de la capa ($N\times d$) y $\partial L/\partial X_{\text{sal}}$ el gradiente respecto a su salida ($N\times d'$). El producto suma las contribuciones de las $N$ muestras.

### ¿Cómo se calcula el gradiente del sesgo con un lote?
Sumando por muestras el gradiente respecto a la salida: $\partial L/\partial b=\mathbf{1}^t\,\partial L/\partial X_{\text{sal}}$. En el forward el sesgo se copiaba en las $N$ filas, así que en el backward se suman las $N$ contribuciones.

### ¿Cómo se propaga el gradiente a la entrada de una capa lineal con un lote?
$\partial L/\partial X=\big(\partial L/\partial X_{\text{sal}}\big)W$. Cada fila (muestra) recibe el gradiente de su propia salida multiplicado por $W$, sin mezclarse con las demás muestras.

### Problema: forward y backward con un lote de dos muestras y capa oculta ReLU
Red con entrada $x\in\mathbb{R}^2$, capa oculta de dos ReLU y salida lineal, con pérdida $L=\tfrac1N\sum_n(y_n-\hat y_n)^2$. Datos: $X=\begin{pmatrix}1&2\\3&0\end{pmatrix}$, $y=(1,\ 4)^t$, $W^{(1)}=I$, $b^{(1)}=(0,\ -1)^t$, $W^{(3)}=(1,\ 1)$, $b^{(3)}=0$ y $\eta=0{,}1$. Haz una iteración. Los gradientes de matrices se escriben con la forma del parámetro, traspuestos respecto a las transparencias.
#### Paso 1
Forward:

$$X^{(2)}=XW^{(1)t}+\mathbf{1}b^{(1)t}=\begin{pmatrix}1&1\\3&-1\end{pmatrix}\qquad X^{(3)}=\mathrm{ReLU}(X^{(2)})=\begin{pmatrix}1&1\\3&0\end{pmatrix}$$

$$\hat y=X^{(3)}W^{(3)t}+b^{(3)}=\begin{pmatrix}2\\3\end{pmatrix}\qquad L=\frac{(1-2)^2+(4-3)^2}{2}=1$$
#### Paso 2
Derivada de la pérdida, con $N=2$:

$$\frac{\partial L}{\partial\hat y}=\frac{2}{N}(\hat y-y)=\begin{pmatrix}1\\-1\end{pmatrix}$$
#### Paso 3
Capa de salida:

$$\frac{\partial L}{\partial W^{(3)}}=\Big(\frac{\partial L}{\partial\hat y}\Big)^tX^{(3)}=1\cdot(1,\ 1)+(-1)\cdot(3,\ 0)=(-2,\ 1)\qquad\frac{\partial L}{\partial b^{(3)}}=1+(-1)=0$$
#### Paso 4
Hacia la preactivación. Se multiplica por $W^{(3)}$ y por $\mathrm{ReLU}'(X^{(2)})$, que vale 1 donde $X^{(2)}>0$ y 0 en el resto:

$$\frac{\partial L}{\partial X^{(3)}}=\begin{pmatrix}1\\-1\end{pmatrix}(1,\ 1)=\begin{pmatrix}1&1\\-1&-1\end{pmatrix}\qquad\mathrm{ReLU}'(X^{(2)})=\begin{pmatrix}1&1\\1&0\end{pmatrix}$$

$$\frac{\partial L}{\partial X^{(2)}}=\begin{pmatrix}1&1\\-1&0\end{pmatrix}$$
#### Paso 5
Primera capa. El gradiente de $W^{(1)t}$ usa la entrada traspuesta:

$$\frac{\partial L}{\partial W^{(1)t}}=X^{t}\frac{\partial L}{\partial X^{(2)}}=\begin{pmatrix}1&3\\2&0\end{pmatrix}\begin{pmatrix}1&1\\-1&0\end{pmatrix}=\begin{pmatrix}-2&1\\2&2\end{pmatrix}$$

Por tanto, $\partial L/\partial W^{(1)}=\begin{pmatrix}-2&2\\1&2\end{pmatrix}$. Para el sesgo se suman las filas: $\partial L/\partial b^{(1)}=\mathbf{1}^t\,\partial L/\partial X^{(2)}=(0,\ 1)$.
#### Paso 6
Actualización con $\eta=0{,}1$:

$$W^{(3)}=(1,\ 1)-0{,}1(-2,\ 1)=(1{,}2,\ 0{,}9)\qquad b^{(3)}=0$$

$$W^{(1)}=\begin{pmatrix}1{,}2&-0{,}2\\-0{,}1&0{,}8\end{pmatrix}\qquad b^{(1)}=(0,\ -1{,}1)^t$$
#### Paso 7
Comprobación. Con los parámetros nuevos, $\hat y=(1{,}32,\ 4{,}32)^t$ y $L=\frac{0{,}32^2+0{,}32^2}{2}=0{,}1024$, menor que 1.

## 5. Ejemplo de XOR con salida softmax

### ¿Cómo se define la función softmax y qué propiedades tiene su salida?
$S(z)_k=\dfrac{e^{z_k}}{\sum_j e^{z_j}}$. Cada componente está en $[0,1]$ y la suma de las componentes es 1, de modo que se interpreta como una distribución de probabilidad sobre las clases.

### ¿Qué calcula la entropía cruzada con una etiqueta one-hot?
$L=-y^t\log\hat y$ es el logaritmo negativo de la probabilidad que el modelo asigna a la clase correcta, porque solo sobrevive el término donde $y_k=1$. Si el modelo asigna probabilidad 1 a la clase correcta, la pérdida es 0.

### ¿Cómo se escribe la pérdida de entropía cruzada de un lote de $N$ muestras?
$L=-\dfrac1N\,\mathbf{1}^t\big(Y\odot\log\hat Y\big)\mathbf{1}$. Se multiplican elemento a elemento las etiquetas y los logaritmos, se suma todo y se divide entre $N$. El gradiente respecto a los logits es entonces $\frac1N(\hat Y-Y)$.

### ¿Cuánto valen $\mathrm{ReLU}(z)$ y $\mathrm{ReLU}'(z)$?
$\mathrm{ReLU}(z)=\max(0,z)$. Su derivada es 1 si $z>0$ y 0 si $z\le 0$. En $z=0$ las transparencias toman derivada 0.

### ¿Qué pasa con los pesos de una unidad ReLU que está inactiva ($z\le0$) para una muestra?
Esa muestra no aporta gradiente a la fila de pesos ni al sesgo de esa unidad, porque la ReLU lo anula. Si la unidad está inactiva para todas las muestras, sus parámetros no se mueven (unidad muerta).

### Demostración: gradiente de softmax con entropía cruzada
Demuestra que, con $\hat y=S(z)$ y $L=-\sum_i y_i\log\hat y_i$ con $y$ one-hot (suma 1), se cumple $\partial L/\partial z_k=\hat y_k-y_k$.
#### Paso 1
Derivada de softmax. Para $\hat y_i=e^{z_i}/\sum_j e^{z_j}$ se tiene

$$\frac{\partial\hat y_i}{\partial z_k}=\hat y_i(\delta_{ik}-\hat y_k)$$

donde $\delta_{ik}$ vale 1 si $i=k$ y 0 si no. Para $i=k$ sale $\hat y_k(1-\hat y_k)$ y para $i\ne k$ sale $-\hat y_i\hat y_k$.
#### Paso 2
Regla de la cadena sobre la pérdida, con $\partial L/\partial\hat y_i=-y_i/\hat y_i$:

$$\frac{\partial L}{\partial z_k}=\sum_i\Big(-\frac{y_i}{\hat y_i}\Big)\hat y_i(\delta_{ik}-\hat y_k)=-\sum_i y_i(\delta_{ik}-\hat y_k)$$
#### Paso 3
Se separa la suma:

$$-\sum_i y_i\delta_{ik}+\hat y_k\sum_i y_i=-y_k+\hat y_k\cdot1=\hat y_k-y_k$$

Por tanto, $\partial L/\partial z=\hat y-y$.

### Problema: gradientes de una capa de salida softmax con entropía cruzada
Capa final $z=W x+b$ con entrada $x=(1,\ 2)^t$, $W=\begin{pmatrix}1&0\\1&1\end{pmatrix}$, $b=(0,\ 0)^t$, softmax y etiqueta $y=(1,\ 0)^t$ (clase 1). Calcula $\hat y$, la pérdida, los gradientes respecto a $W$, $b$ y $x$, y actualiza con $\eta=0{,}1$. Los gradientes de matrices se escriben con la forma del parámetro, traspuestos respecto a las transparencias.
#### Paso 1
Forward. Los logits son $z=Wx+b=(1\cdot1+0\cdot2,\ 1\cdot1+1\cdot2)^t=(1,\ 3)^t$. Entonces:

$$\hat y=\frac{(e^{1},\ e^{3})}{e^{1}+e^{3}}=\frac{(1,\ e^{2})}{1+e^{2}}\approx(0{,}1192,\ 0{,}8808)$$

$$L=-\log\hat y_1=-\log0{,}1192\approx2{,}127$$
#### Paso 2
Gradiente respecto a los logits, con la simplificación de softmax y entropía cruzada:

$$\frac{\partial L}{\partial z}=\hat y-y=(0{,}1192-1,\ 0{,}8808-0)^t=(-0{,}8808,\ 0{,}8808)^t$$

La suma da 0, como debe ser.
#### Paso 3
Gradientes de la capa lineal:

$$\frac{\partial L}{\partial W}=\frac{\partial L}{\partial z}\,x^t=\begin{pmatrix}-0{,}8808&-1{,}7616\\0{,}8808&1{,}7616\end{pmatrix}\qquad\frac{\partial L}{\partial b}=\begin{pmatrix}-0{,}8808\\0{,}8808\end{pmatrix}$$
#### Paso 4
Gradiente hacia la entrada, que se pasaría a la capa anterior:

$$\frac{\partial L}{\partial x}=W^t\frac{\partial L}{\partial z}=\begin{pmatrix}1&1\\0&1\end{pmatrix}\begin{pmatrix}-0{,}8808\\0{,}8808\end{pmatrix}=\begin{pmatrix}0\\0{,}8808\end{pmatrix}$$
#### Paso 5
Actualización con $\eta=0{,}1$:

$$W=\begin{pmatrix}1&0\\1&1\end{pmatrix}-0{,}1\begin{pmatrix}-0{,}8808&-1{,}7616\\0{,}8808&1{,}7616\end{pmatrix}=\begin{pmatrix}1{,}0881&0{,}1762\\0{,}9119&0{,}8238\end{pmatrix}\qquad b=\begin{pmatrix}0{,}0881\\-0{,}0881\end{pmatrix}$$
#### Paso 6
Comprobación. Con los parámetros nuevos, $z=(1{,}0881+0{,}3523+0{,}0881,\ 0{,}9119+1{,}6477-0{,}0881)^t\approx(1{,}529,\ 2{,}472)^t$ y la probabilidad de la clase 1 sube a $\hat y_1\approx0{,}280$, con $L\approx1{,}272$, menor que $2{,}127$.

### Problema: forward y backward en lote con softmax y capa oculta ReLU
Red con entrada $x\in\mathbb{R}^2$, capa oculta de dos ReLU y salida softmax de dos clases con pérdida $L=-\tfrac1N\sum_n y_n^t\log\hat y_n$. Datos: $X=\begin{pmatrix}1&0\\1&1\end{pmatrix}$, $Y=\begin{pmatrix}1&0\\0&1\end{pmatrix}$, $W^{(1)}=\begin{pmatrix}1&-1\\1&1\end{pmatrix}$, $b^{(1)}=(0{,}5,\ -1{,}5)^t$, $W^{(3)}=\begin{pmatrix}1&-1\\-1&1\end{pmatrix}$, $b^{(3)}=(0,0)^t$ y $\eta=0{,}5$. Haz una iteración. Los gradientes de matrices se escriben con la forma del parámetro, traspuestos respecto a las transparencias.
#### Paso 1
Forward:

$$X^{(2)}=XW^{(1)t}+\mathbf{1}b^{(1)t}=\begin{pmatrix}1&1\\0&2\end{pmatrix}+\begin{pmatrix}0{,}5&-1{,}5\\0{,}5&-1{,}5\end{pmatrix}=\begin{pmatrix}1{,}5&-0{,}5\\0{,}5&0{,}5\end{pmatrix}\qquad X^{(3)}=\begin{pmatrix}1{,}5&0\\0{,}5&0{,}5\end{pmatrix}$$

$$X^{(4)}=X^{(3)}W^{(3)t}+\mathbf{1}b^{(3)t}=\begin{pmatrix}1{,}5&-1{,}5\\0&0\end{pmatrix}\qquad\hat Y=\begin{pmatrix}0{,}9526&0{,}0474\\0{,}5&0{,}5\end{pmatrix}$$

$$L=-\frac{\ln0{,}9526+\ln0{,}5}{2}\approx0{,}3709$$
#### Paso 2
Gradiente respecto a los logits, con $N=2$:

$$\frac{\partial L}{\partial X^{(4)}}=\frac1N(\hat Y-Y)=\begin{pmatrix}-0{,}0237&0{,}0237\\0{,}25&-0{,}25\end{pmatrix}$$

Cada fila suma 0.
#### Paso 3
Capa de salida, con la forma de $W^{(3)}$:

$$\frac{\partial L}{\partial W^{(3)}}=\Big(\frac{\partial L}{\partial X^{(4)}}\Big)^tX^{(3)}=\begin{pmatrix}0{,}0894&0{,}125\\-0{,}0894&-0{,}125\end{pmatrix}\qquad\frac{\partial L}{\partial b^{(3)}}=\mathbf{1}^t\frac{\partial L}{\partial X^{(4)}}=(0{,}2263,\ -0{,}2263)$$
#### Paso 4
Hacia la preactivación. $\mathrm{ReLU}'(X^{(2)})=\begin{pmatrix}1&0\\1&1\end{pmatrix}$ porque $X^{(2)}_{12}=-0{,}5\le0$:

$$\frac{\partial L}{\partial X^{(3)}}=\frac{\partial L}{\partial X^{(4)}}\,W^{(3)}=\begin{pmatrix}-0{,}0474&0{,}0474\\0{,}5&-0{,}5\end{pmatrix}\qquad\frac{\partial L}{\partial X^{(2)}}=\begin{pmatrix}-0{,}0474&0\\0{,}5&-0{,}5\end{pmatrix}$$
#### Paso 5
Primera capa:

$$\frac{\partial L}{\partial W^{(1)}}=\Big(\frac{\partial L}{\partial X^{(2)}}\Big)^tX=\begin{pmatrix}-0{,}0474&0{,}5\\0&-0{,}5\end{pmatrix}\begin{pmatrix}1&0\\1&1\end{pmatrix}=\begin{pmatrix}0{,}4526&0{,}5\\-0{,}5&-0{,}5\end{pmatrix}\qquad\frac{\partial L}{\partial b^{(1)}}=(0{,}4526,\ -0{,}5)$$
#### Paso 6
Actualización con $\eta=0{,}5$:

$$W^{(3)}=\begin{pmatrix}0{,}9553&-1{,}0625\\-0{,}9553&1{,}0625\end{pmatrix}\qquad b^{(3)}=(-0{,}1131,\ 0{,}1131)^t$$

$$W^{(1)}=\begin{pmatrix}0{,}7737&-1{,}25\\1{,}25&1{,}25\end{pmatrix}\qquad b^{(1)}=(0{,}2737,\ -1{,}25)^t$$
#### Paso 7
Comprobación. Con los parámetros nuevos, la pérdida baja a $L\approx0{,}0695$, menor que $0{,}3709$.

## 6. Ejercicio: XOR con salida sigmoide

### ¿Cómo se escribe la pérdida binaria de un lote de $N$ muestras?
$L=-\dfrac1N\big(y^t\log\hat y+(1-y)^t\log(1-\hat y)\big)$, con $y$ y $\hat y$ vectores columna de $N$ componentes. El gradiente respecto a los logits es $\frac1N(\hat y-y)$.

### ¿Qué relación hay entre un softmax de dos clases y una sigmoide?
Con dos logits $z_1$ y $z_2$, el softmax da $\hat y_1=\sigma(z_1-z_2)$, porque solo importa la diferencia. Una salida sigmoide con un único logit equivale a fijar la diferencia como ese logit.

### Problema: una iteración con ReLU oculta y salida sigmoide con entropía cruzada binaria
Red con entrada $x\in\mathbb{R}^2$, capa oculta de dos ReLU y salida $\hat y=\sigma(W^{(3)}x^{(3)}+b^{(3)})$ con pérdida $L=-y\log\hat y-(1-y)\log(1-\hat y)$. Datos: $x=(1,\ 1)^t$, $y=0$, $W^{(1)}=\begin{pmatrix}1&1\\-1&-1\end{pmatrix}$, $b^{(1)}=(0,\ 0{,}5)^t$, $W^{(3)}=(1,\ 2)$, $b^{(3)}=-1$ y $\eta=0{,}5$. Los gradientes de matrices se escriben con la forma del parámetro, traspuestos respecto a las transparencias.
#### Paso 1
Forward:

$$x^{(2)}=\begin{pmatrix}1+1+0\\-1-1+0{,}5\end{pmatrix}=\begin{pmatrix}2\\-1{,}5\end{pmatrix}\qquad x^{(3)}=\mathrm{ReLU}(x^{(2)})=\begin{pmatrix}2\\0\end{pmatrix}$$

$$x^{(4)}=1\cdot2+2\cdot0-1=1\qquad\hat y=\sigma(1)\approx0{,}7311$$

Como $y=0$, la pérdida es $L=-\log(1-0{,}7311)\approx1{,}3133$.
#### Paso 2
Gradiente respecto al logit. Se aplica el cálculo $\dfrac{\hat y-y}{\hat y(1-\hat y)}\cdot\hat y(1-\hat y)$, que da

$$\delta=\frac{\partial L}{\partial x^{(4)}}=\hat y-y=0{,}7311$$
#### Paso 3
Capa de salida:

$$\frac{\partial L}{\partial W^{(3)}}=\delta\,x^{(3)t}=0{,}7311\,(2,\ 0)=(1{,}4621,\ 0)\qquad\frac{\partial L}{\partial b^{(3)}}=0{,}7311$$
#### Paso 4
Hacia la capa oculta. Se multiplica por $W^{(3)t}$ y por $\mathrm{ReLU}'(x^{(2)})=(1,\ 0)^t$, porque la segunda unidad está inactiva ($-1{,}5\le0$):

$$\frac{\partial L}{\partial x^{(3)}}=\begin{pmatrix}1\\2\end{pmatrix}0{,}7311=\begin{pmatrix}0{,}7311\\1{,}4621\end{pmatrix}\qquad\frac{\partial L}{\partial x^{(2)}}=\begin{pmatrix}0{,}7311\\0\end{pmatrix}$$
#### Paso 5
Primera capa:

$$\frac{\partial L}{\partial W^{(1)}}=\begin{pmatrix}0{,}7311\\0\end{pmatrix}(1,\ 1)=\begin{pmatrix}0{,}7311&0{,}7311\\0&0\end{pmatrix}\qquad\frac{\partial L}{\partial b^{(1)}}=\begin{pmatrix}0{,}7311\\0\end{pmatrix}$$

La fila de la unidad inactiva tiene gradiente cero, así que no se mueve.
#### Paso 6
Actualización con $\eta=0{,}5$:

$$W^{(3)}=(1,\ 2)-0{,}5(1{,}4621,\ 0)=(0{,}2689,\ 2)\qquad b^{(3)}=-1-0{,}5\cdot0{,}7311=-1{,}3655$$

$$W^{(1)}=\begin{pmatrix}0{,}6345&0{,}6345\\-1&-1\end{pmatrix}\qquad b^{(1)}=\begin{pmatrix}-0{,}3655\\0{,}5\end{pmatrix}$$
#### Paso 7
Comprobación. Con los parámetros nuevos, $x^{(2)}=(0{,}9034,\ -1{,}5)^t$, $x^{(3)}=(0{,}9034,\ 0)^t$ y $x^{(4)}\approx-1{,}123$. Entonces $\hat y\approx0{,}2455$ y $L\approx0{,}2817$, mucho menor que $1{,}3133$.

### ¿Qué activación de salida y qué pérdida corresponden a regresión, clasificación binaria, multiclase y multietiqueta?
Se elige según lo que representa la salida:

| Tarea | Activación de salida | Pérdida | Salidas |
|---|---|---|---|
| Regresión | lineal | error cuadrático | cualquier real |
| Clasificación binaria | sigmoide (una salida) | entropía cruzada binaria | probabilidad de la clase positiva |
| Multiclase de una sola etiqueta | softmax | entropía cruzada | suman 1 |
| Multietiqueta | una sigmoide por clase | entropía cruzada binaria por clase | no suman 1, cada una va de 0 a 1 |

En T01 el error cuadrático se llama "Quadratic Loss (L2)", y no es la regularización L2.

(Complemento: la clasificación multietiqueta no aparece en las diapositivas, que sí tratan la salida lineal, el softmax y la sigmoide.)

### Problema: los mismos logits con softmax y con sigmoide por clase
Una red da los logits $z=(1{,}5,\ 0{,}5,\ -1)$ para tres clases. Calcula las probabilidades con softmax y la clase predicha. Calcula también las probabilidades con una sigmoide por clase y las clases asignadas con umbral $0{,}5$. Después resta 2 a todos los logits y repite las dos cuentas.
#### Paso 1
Exponenciales: $e^{1{,}5}=4{,}4817$, $e^{0{,}5}=1{,}6487$ y $e^{-1}=0{,}3679$. Su suma es $6{,}4983$.
#### Paso 2
Softmax, dividiendo por la suma:

$$\mathrm{softmax}(z)=(0{,}6897,\ 0{,}2537,\ 0{,}0566)$$

Suman 1 y la clase predicha es la primera, la más probable.
#### Paso 3
Sigmoide por clase, $\sigma(z)=1/(1+e^{-z})$:

$$\sigma(z)=(0{,}8176,\ 0{,}6225,\ 0{,}2689)$$

Con umbral $0{,}5$ se asignan las clases 1 y 2. Las salidas suman $1{,}7090$, de modo que no son una distribución. Cada clase se decide por separado.
#### Paso 4
Con $z'=z-2=(-0{,}5,\ -1{,}5,\ -3)$ el softmax no cambia, porque restar una constante a todos los logits multiplica numerador y denominador por el mismo factor. Sigue dando $(0{,}6897,\ 0{,}2537,\ 0{,}0566)$ y predice la primera clase. Las sigmoides pasan a $(0{,}3775,\ 0{,}1824,\ 0{,}0474)$ y ninguna supera $0{,}5$, de modo que no se asigna ninguna clase.
#### Paso 5
Conclusión: el softmax obliga a elegir exactamente una clase y solo depende de las diferencias entre logits. La sigmoide por clase puede asignar varias o ninguna, porque depende del valor de cada logit.
