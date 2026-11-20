# RNA U2 - Convolución

## 1. Introducción

### ¿Qué dos redes convolucionales pioneras se estudian en esta unidad y qué aportó cada una?
LeNet (1998, Yann LeCun) se desarrolló para el conjunto MNIST de dígitos. AlexNet (2012, Alex Krizhevsky) se aplicó a ImageNet y desencadenó la revolución del aprendizaje profundo.

### ¿En qué red se introdujo la regularización por dropout que se usa hoy de forma generalizada?
Se introdujo junto con AlexNet.

### ¿Qué red inspiró a LeNet?
El Neocognitron de Fukushima.

### ¿Qué papel tienen las capas de pooling en una red convolucional típica?
Alternan con las capas convolucionales y reducen el tamaño espacial de los mapas de activación.

## 2. LeNet

### ¿Qué estructura tiene la LeNet usada en clase con MNIST?
Convolución (1 a 6 canales, filtro 5×5), ReLU y max pooling 2×2, convolución (6 a 16 canales, filtro 5×5), ReLU y max pooling 2×2. Después se aplana y siguen tres capas lineales: 256 a 120, 120 a 84 y 84 a 10.

### ¿Por qué la primera capa lineal de la LeNet de clase tiene 256 entradas?
Porque el último mapa tiene 16 canales de 4×4 y $16 \cdot 4 \cdot 4 = 256$. El tamaño sale de $28 \to 24$ (convolución 5×5), $\to 12$ (pooling), $\to 8$ (convolución 5×5), $\to 4$ (pooling).

### ¿Cuántos parámetros tiene la primera convolución de la LeNet (1 a 6 canales, filtro 5×5, con sesgo)?
Cada uno de los 6 filtros tiene $1 \cdot 5 \cdot 5 = 25$ pesos y un sesgo. En total $6 \cdot 25 + 6 = 156$.

### ¿Cuántos parámetros tiene en total la LeNet de clase con MNIST?
44 426. Convolución 1: $6 \cdot 25 + 6 = 156$. Convolución 2: $16 \cdot 6 \cdot 25 + 16 = 2416$. Lineal 256 a 120: $256 \cdot 120 + 120 = 30\,840$. Lineal 120 a 84: $120 \cdot 84 + 84 = 10\,164$. Lineal 84 a 10: $84 \cdot 10 + 10 = 850$. El pooling y la ReLU no tienen parámetros.

### ¿Qué cambio se hizo en clase respecto a la LeNet original y qué precisión dio en MNIST?
Se usaron ReLU en lugar de sigmoides. La precisión en test fue del 98,7 %.

## 3. AlexNet

### ¿Cómo se adaptó AlexNet a MNIST en clase?
La primera convolución pasa a tener 1 canal de entrada, filtro 3×3 y padding 1. Antes del clasificador se usa un average pooling adaptativo a 1×1 y el clasificador queda como dropout 0,5, lineal 256 a 128, ReLU y lineal 128 a 10. La precisión fue del 99,2 %.

### ¿Qué capas convolucionales y de pooling tiene la AlexNet de torchvision que se usa en clase con MNIST?
Cinco convoluciones de 64, 192, 384, 256 y 256 canales con filtros 3×3 (con padding 1, en la primera), 5×5 (padding 2), 3×3, 3×3 y 3×3 (padding 1), todas con ReLU. Hay tres max pooling de ventana 3×3 y paso 2, tras la primera, la segunda y la quinta convolución.

### ¿Por qué el entrenamiento de AlexNet sobre MNIST se hizo con minilotes?
Para evitar errores de memoria de la GPU (VRAM). Con toda la base de datos en un solo lote las activaciones intermedias no caben, mientras que la LeNet, mucho más pequeña, sí se entrenó con lote completo.

### ¿Por qué el clasificador de la AlexNet adaptada tiene 256 entradas?
Porque la última convolución produce 256 canales y el pooling adaptativo reduce cada uno a 1×1. Con 28×28 de entrada el tamaño espacial es: conv1 28, pooling 13, conv2 13, pooling 6, conv3, conv4 y conv5 6, pooling 2. El mapa final es $256 \times 2 \times 2$ y el pooling adaptativo lo promedia a 1×1 sea cual sea su tamaño.

### ¿Cuántos parámetros tiene la AlexNet adaptada a MNIST de clase?
2 481 226. Convoluciones: $640 + 307\,392 + 663\,936 + 884\,992 + 590\,080 = 2\,447\,040$. Clasificador: $256 \cdot 128 + 128 = 32\,896$ y $128 \cdot 10 + 10 = 1290$. Pooling, ReLU y dropout no tienen parámetros.

## 4. Convolución

### ¿Cómo se define la convolución válida de una imagen $X$ con un filtro $W$ y sesgo $b$?
$$y_{ij} = b + \sum_{u=0}^{f_h-1} \sum_{v=0}^{f_w-1} w_{u,v}\, x_{i+u,\,j+v}$$

Cada salida es el sesgo más el producto elemento a elemento entre el filtro y la ventana de $X$ que empieza en $(i,j)$.

### ¿Qué tamaño tiene la salida de una convolución válida con entrada $x_h \times x_w$ y filtro $f_h \times f_w$?
$y_h = x_h - f_h + 1$ y $y_w = x_w - f_w + 1$. Encoge la imagen en $f-1$ filas y columnas.

### ¿Se voltea el filtro en la "convolución" de las redes neuronales?
No. La fórmula $y_{ij} = b + \sum w_{u,v}\, x_{i+u,j+v}$ recorre el filtro y la ventana en el mismo sentido. Es lo que en procesamiento de señal se llama correlación cruzada, pero en redes se la llama convolución. La convolución de señal voltearía el filtro, es decir, usaría $W_{\text{rot}180}$. Por eso en el gradiente respecto a $X$ aparece ese giro.

### ¿Cuánto vale $\partial L / \partial W$ en una convolución válida, en función de $U = \partial L / \partial Y$?
$\frac{\partial L}{\partial W} = U \circledast X$, es decir, una convolución válida de $X$ con $U$ haciendo de filtro. Sale de $\frac{\partial L}{\partial w_{uv}} = \sum_{ij} u_{ij}\, x_{i+u,j+v}$.

### ¿Cuánto vale $\partial L / \partial b$ en una convolución, si $U = \partial L / \partial Y$ es el gradiente que llega a la salida?
La suma de todos los elementos de $U$, porque $\partial y_{ij} / \partial b = 1$ para todo $(i,j)$: $\frac{\partial L}{\partial b} = \sum_{ij} u_{ij}$.

### ¿Cómo se calcula $\partial L / \partial X$ en una convolución válida, dado $U = \partial L / \partial Y$?
$\frac{\partial L}{\partial X} = W_{\text{rot}180} \circledast U_{\text{padded}}$, donde $U_{\text{padded}}$ es $U$ con $f_h-1$ filas de ceros arriba y abajo y $f_w-1$ columnas de ceros a izquierda y derecha, y $W_{\text{rot}180}$ es $W$ girado 180 grados.

### ¿Por qué hay que girar el filtro 180 grados y rellenar $U$ con ceros al calcular $\partial L / \partial X$?
Porque $x_{mn}$ aparece en $y_{ij}$ con el peso $w_{m-i,\,n-j}$, de modo que $\frac{\partial L}{\partial x_{mn}} = \sum_{ij} u_{ij}\, w_{m-i,n-j}$. Los índices de $W$ van hacia atrás y por eso el filtro se gira. Los ceros de $U$ cubren los índices que quedan fuera de rango, y hacen que el resultado tenga el tamaño de $X$.

### ¿Cómo se convierte una convolución en un producto matricial con unfold?
Se extraen los parches de $X$ en una matriz $P$ con un parche por fila, de tamaño $(y_h y_w) \times (f_h f_w)$. Con $w = \text{vec}(W)$ por filas, la salida es $y = P w + b\,\mathbf{1}$.

### En la forma matricial de la convolución, $y = Pw + b\mathbf{1}$ con $P$ la matriz de parches y $w = \text{vec}(W)$, ¿cuánto valen los gradientes con $u = \text{vec}(U)$, $U = \partial L/\partial Y$?
$\frac{\partial L}{\partial w} = P^\top u$, $\frac{\partial L}{\partial b} = u^\top \mathbf{1}$ y $\frac{\partial L}{\partial x} = \text{Fold}(w\, u^\top)$.

### En la convolución con unfold de PyTorch, ¿qué hace Fold y por qué suma en lugar de copiar?
Fold es la transpuesta de Unfold como operación lineal: coloca cada elemento de un parche en su posición de la imagen y suma lo que cae en la misma casilla. Suma porque un píxel que está en varios parches influye en varias salidas, de modo que su gradiente es la suma de las contribuciones.

### Problema: cálculo de los tres gradientes de una convolución con datos pequeños
Sea $X = \begin{bmatrix} 1 & 2 & 0 \\ 3 & 1 & 2 \\ 0 & 4 & 1 \end{bmatrix}$, $W = \begin{bmatrix} 2 & 1 \\ 0 & -1 \end{bmatrix}$, $b = 1$, sin padding y con paso 1. El gradiente que llega a la salida es $U = \begin{bmatrix} 1 & 2 \\ 0 & -1 \end{bmatrix}$. Calcula $Y$, $\partial L/\partial W$, $\partial L/\partial b$ y $\partial L/\partial X$, y comprueba el primero con la forma matricial.
#### Paso 1
El tamaño de $Y$ es $3-2+1 = 2$ en cada dimensión. Cada elemento es $y_{ij} = 1 + 2x_{i,j} + x_{i,j+1} - x_{i+1,j+1}$:

$$y_{00} = 1 + 2 + 2 - 1 = 4, \quad y_{01} = 1 + 4 + 0 - 2 = 3$$

$$y_{10} = 1 + 6 + 1 - 4 = 4, \quad y_{11} = 1 + 2 + 2 - 1 = 4$$

Por tanto $Y = \begin{bmatrix} 4 & 3 \\ 4 & 4 \end{bmatrix}$.
#### Paso 2
$\partial L / \partial W = U \circledast X$, así que $\frac{\partial L}{\partial w_{uv}} = \sum_{ij} u_{ij}\, x_{i+u,j+v}$:

$$\frac{\partial L}{\partial w_{00}} = 1\cdot1 + 2\cdot2 + 0\cdot3 + (-1)\cdot1 = 4$$

$$\frac{\partial L}{\partial w_{01}} = 1\cdot2 + 2\cdot0 + 0\cdot1 + (-1)\cdot2 = 0$$

$$\frac{\partial L}{\partial w_{10}} = 1\cdot3 + 2\cdot1 + 0\cdot0 + (-1)\cdot4 = 1$$

$$\frac{\partial L}{\partial w_{11}} = 1\cdot1 + 2\cdot2 + 0\cdot4 + (-1)\cdot1 = 4$$

Así que $\frac{\partial L}{\partial W} = \begin{bmatrix} 4 & 0 \\ 1 & 4 \end{bmatrix}$.
#### Paso 3
El sesgo suma todos los elementos de $U$: $\frac{\partial L}{\partial b} = 1 + 2 + 0 - 1 = 2$.
#### Paso 4
Para $\partial L / \partial X$ se usa $\frac{\partial L}{\partial x_{mn}} = \sum_{ij} u_{ij}\, w_{m-i,n-j}$, contando como cero los $w$ con índice fuera de rango:

$$\begin{aligned}
\frac{\partial L}{\partial x_{00}} &= u_{00} w_{00} = 2 \\
\frac{\partial L}{\partial x_{01}} &= u_{00} w_{01} + u_{01} w_{00} = 1 + 4 = 5 \\
\frac{\partial L}{\partial x_{02}} &= u_{01} w_{01} = 2 \\
\frac{\partial L}{\partial x_{10}} &= u_{00} w_{10} + u_{10} w_{00} = 0 + 0 = 0 \\
\frac{\partial L}{\partial x_{11}} &= u_{00} w_{11} + u_{01} w_{10} + u_{10} w_{01} + u_{11} w_{00} = -1 + 0 + 0 - 2 = -3 \\
\frac{\partial L}{\partial x_{12}} &= u_{01} w_{11} + u_{11} w_{01} = -2 - 1 = -3 \\
\frac{\partial L}{\partial x_{20}} &= u_{10} w_{10} = 0 \\
\frac{\partial L}{\partial x_{21}} &= u_{10} w_{11} + u_{11} w_{10} = 0 + 0 = 0 \\
\frac{\partial L}{\partial x_{22}} &= u_{11} w_{11} = 1
\end{aligned}$$

Resulta $\frac{\partial L}{\partial X} = \begin{bmatrix} 2 & 5 & 2 \\ 0 & -3 & -3 \\ 0 & 0 & 1 \end{bmatrix}$, que coincide con $W_{\text{rot}180} = \begin{bmatrix} -1 & 0 \\ 1 & 2 \end{bmatrix}$ convolucionada con $U$ rellena de ceros.
#### Paso 5
Con unfold, los parches por filas son $P = \begin{bmatrix} 1 & 2 & 3 & 1 \\ 2 & 0 & 1 & 2 \\ 3 & 1 & 0 & 4 \\ 1 & 2 & 4 & 1 \end{bmatrix}$, con $w = (2,1,0,-1)^\top$ y $u = (1,2,0,-1)^\top$. Entonces $Pw + 1 = (4,3,4,4)^\top$, que es $Y$ por filas. Y $P^\top u = (4,0,1,4)^\top$, que es $\partial L / \partial W$ por filas. Fold de $w u^\top$ da de nuevo $\partial L / \partial X$.

## 5. Padding

### ¿Qué es el padding y para qué se usa?
Es rodear la imagen con ceros antes de convolucionar. Sirve para que la salida no encoja y para que los píxeles del borde participen en tantas ventanas como los del centro.

### ¿Qué tamaño tiene la salida de una convolución con padding $p_h$, $p_w$ y filtro $f_h \times f_w$, con paso 1?
$y_h = x_h + 2p_h - f_h + 1$ y $y_w = x_w + 2p_w - f_w + 1$. Se añaden $p_h$ filas arriba y otras $p_h$ abajo, y $p_w$ columnas a cada lado.

### ¿Cuánto padding da una convolución "same" y por qué solo funciona bien con filtro impar?
Una convolución "same" conserva el tamaño y exige $2p_h = f_h - 1$ y $2p_w = f_w - 1$. Con filtro impar, $p = (f-1)/2$ es entero y el relleno es simétrico. Con filtro par haría falta medio píxel y el relleno sería desigual.

### ¿Cuánto vale la salida de una convolución "same" con un filtro 3×3 de unos sobre la imagen de 0 a 8 por filas?
La imagen es $\begin{bmatrix} 0 & 1 & 2 \\ 3 & 4 & 5 \\ 6 & 7 & 8 \end{bmatrix}$ y la salida es $\begin{bmatrix} 8 & 15 & 12 \\ 21 & 36 & 27 \\ 20 & 33 & 24 \end{bmatrix}$. Cada elemento es la suma de la ventana 3×3 centrada, contando los ceros del borde, de modo que la esquina vale $0+1+3+4 = 8$.

## 6. Strides

### ¿Qué es el paso (stride) de una convolución?
Es el salto con el que se desplaza el filtro: $s_h$ filas y $s_w$ columnas entre ventanas consecutivas. Con paso 1 se recorre cada posición, con paso mayor se salta y la salida encoge.

### ¿Cuál es la fórmula del tamaño de salida con padding y paso?
$$y_h = \left\lfloor \frac{x_h + 2p_h - f_h + s_h}{s_h} \right\rfloor = \left\lfloor \frac{x_h + 2p_h - f_h}{s_h} \right\rfloor + 1$$

Y lo mismo para el ancho con $p_w$, $f_w$ y $s_w$.

### ¿Cómo se relaciona una convolución con paso $s$ con la misma convolución con paso 1?
Es un submuestreo: se obtiene quedándose con una de cada $s$ posiciones de la salida con paso 1, empezando por la primera.

### ¿Qué ocurre si $x + 2p - f$ no es múltiplo del paso?
La división se redondea hacia abajo y las últimas filas o columnas de la entrada que no completan una ventana no se leen. Por ejemplo, con $x = 8$, $f = 3$, $p = 0$ y $s = 2$ salen 3 ventanas y la columna 7 nunca se usa.

### Problema: convolución 2D con filtro dado, padding 1 y paso 2
Calcula $Y$ para $X = \begin{bmatrix} 1 & 2 & 0 & 1 \\ 0 & 1 & 3 & 1 \\ 2 & 0 & 1 & 2 \\ 1 & 1 & 0 & 3 \end{bmatrix}$, filtro $W = \begin{bmatrix} 1 & 0 & -1 \\ 1 & 0 & -1 \\ 1 & 0 & -1 \end{bmatrix}$, sesgo $b = 1$, padding 1 y paso 2.
#### Paso 1
Tamaño de la salida: $y = \lfloor (4 + 2 - 3)/2 \rfloor + 1 = \lfloor 1{,}5 \rfloor + 1 = 2$. La salida es de 2×2.
#### Paso 2
Se rodea $X$ de ceros y queda una matriz 6×6:

$$X_{\text{pad}} = \begin{bmatrix} 0&0&0&0&0&0 \\ 0&1&2&0&1&0 \\ 0&0&1&3&1&0 \\ 0&2&0&1&2&0 \\ 0&1&1&0&3&0 \\ 0&0&0&0&0&0 \end{bmatrix}$$

Las ventanas 3×3 empiezan en las filas y columnas 0 y 2 de esta matriz.
#### Paso 3
Como el filtro tiene las tres filas iguales $(1,0,-1)$, cada fila de la ventana aporta (primer elemento) $-$ (tercer elemento). Para la ventana $(0,0)$, con filas $(0,0,0)$, $(0,1,2)$ y $(0,0,1)$, se obtiene $0 + (0-2) + (0-1) = -3$ y con el sesgo $y_{00} = -3 + 1 = -2$.

Ventana $(0,1)$, con filas $(0,0,0)$, $(2,0,1)$ y $(1,3,1)$: $0 + 1 + 0 = 1$, así que $y_{01} = 2$.

Ventana $(1,0)$, con filas $(0,0,1)$, $(0,2,0)$ y $(0,1,1)$: $-1 + 0 - 1 = -2$, así que $y_{10} = -1$.

Ventana $(1,1)$, con filas $(1,3,1)$, $(0,1,2)$ y $(1,0,3)$: $0 - 2 - 2 = -4$, así que $y_{11} = -3$.
#### Paso 4
Resultado:

$$Y = \begin{bmatrix} -2 & 2 \\ -1 & -3 \end{bmatrix}$$

Es el submuestreo (posiciones 0 y 2 de filas y columnas) de la salida con paso 1, que sería de 4×4.

### Problema: tamaño de salida con padding, paso y filtro no cuadrado
Calcula el tamaño de la salida en estos casos: (a) entrada 28×28, filtro 5×5, padding 2 y paso 2. (b) Entrada de 10 filas por 7 columnas, filtro de 3 filas por 2 columnas, padding $(1, 0)$ y paso $(2, 1)$ (primero filas, luego columnas). (c) Entrada 9×9, filtro 3×3, padding 1 y paso 2.
#### Paso 1
Se aplica $y = \lfloor (x + 2p - f)/s \rfloor + 1$ en cada dimensión.
#### Paso 2
Caso (a): $y = \lfloor (28 + 4 - 5)/2 \rfloor + 1 = \lfloor 13{,}5 \rfloor + 1 = 14$. La salida es de 14×14.
#### Paso 3
Caso (b): alto $y_h = \lfloor (10 + 2 - 3)/2 \rfloor + 1 = \lfloor 4{,}5 \rfloor + 1 = 5$. Ancho $y_w = \lfloor (7 + 0 - 2)/1 \rfloor + 1 = 6$. La salida es de 5×6.
#### Paso 4
Caso (c): $y = \lfloor (9 + 2 - 3)/2 \rfloor + 1 = 4 + 1 = 5$. La salida es de 5×5. Aquí la división es exacta, de modo que se leen todas las filas y columnas.

## 7. Channels

### ¿Qué forma tienen el filtro y la salida cuando la entrada tiene $C$ canales y se quiere un solo canal de salida?
La entrada es $C \times x_h \times x_w$. El filtro es $C \times f_h \times f_w$, con un filtro 2D por canal de entrada. La salida es una sola matriz: $Y = b + \sum_c W_c \circledast X_c$, la suma sobre canales de las convoluciones.

### ¿Qué forma tiene el tensor de pesos si hay $C$ canales de entrada y $D$ de salida?
$D \times C \times f_h \times f_w$. Cada canal de salida $d$ usa su propio filtro $C \times f_h \times f_w$ y su propio sesgo.

### ¿Qué forma tiene la salida de una convolución con $C$ canales de entrada y $D$ de salida?
$D \times y_h \times y_w$, un mapa por cada filtro: $Y_d = b_d + \sum_c W_{d,c} \circledast X_c$.

### ¿Cuántos parámetros tiene una capa convolucional con $C$ canales de entrada, $D$ de salida, filtro $f_h \times f_w$ y sesgo?
$D \cdot C \cdot f_h \cdot f_w + D$. No depende del tamaño de la imagen, a diferencia de una capa lineal.

### ¿Qué es una convolución 1×1 y para qué sirve?
Es una convolución con $f_h = f_w = 1$. En cada píxel aplica la misma transformación lineal de $C$ a $D$ canales, de modo que cambia el número de canales sin mezclar píxeles vecinos.

### ¿Por qué una convolución tiene muchos menos parámetros que una capa lineal entre los mismos tensores?
Porque comparte los mismos pesos en todas las posiciones y solo conecta cada salida con una ventana local. En la capa lineal cada salida se conecta con todas las entradas y cada conexión tiene su peso.

### Problema: convolución con dos canales de entrada
La entrada tiene 2 canales, $X_0 = \begin{bmatrix} 1 & 0 & 2 \\ 3 & 1 & 0 \\ 1 & 2 & 1 \end{bmatrix}$ y $X_1 = \begin{bmatrix} 0 & 1 & 1 \\ 2 & 0 & 1 \\ 1 & 1 & 0 \end{bmatrix}$. El filtro tiene un canal por cada entrada, $W_0 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ y $W_1 = \begin{bmatrix} 2 & 1 \\ 0 & -1 \end{bmatrix}$, y el sesgo es $b = 1$. Calcula la salida sin padding y con paso 1.
#### Paso 1
Tamaño: $3 - 2 + 1 = 2$, así que la salida es 2×2 y de un solo canal.
#### Paso 2
Convolución del canal 0, que suma la diagonal de cada ventana: $W_0 \circledast X_0 = \begin{bmatrix} 1{+}1 & 0{+}0 \\ 3{+}2 & 1{+}1 \end{bmatrix} = \begin{bmatrix} 2 & 0 \\ 5 & 2 \end{bmatrix}$.
#### Paso 3
Convolución del canal 1, con $2x_{i,j} + x_{i,j+1} - x_{i+1,j+1}$: $W_1 \circledast X_1 = \begin{bmatrix} 0{+}1{-}0 & 2{+}1{-}1 \\ 4{+}0{-}1 & 0{+}1{-}0 \end{bmatrix} = \begin{bmatrix} 1 & 2 \\ 3 & 1 \end{bmatrix}$.
#### Paso 4
Se suman los dos canales y el sesgo:

$$Y = \begin{bmatrix} 2 & 0 \\ 5 & 2 \end{bmatrix} + \begin{bmatrix} 1 & 2 \\ 3 & 1 \end{bmatrix} + 1 = \begin{bmatrix} 4 & 3 \\ 9 & 4 \end{bmatrix}$$

El filtro tiene $2 \cdot 2 \cdot 2 + 1 = 9$ parámetros.

### Problema: parámetros de capas convolucionales y comparación con una capa lineal
Calcula los parámetros (con sesgo) de: (a) una convolución de 3 a 8 canales con filtro 5×5, sin padding y paso 1, sobre una imagen $3 \times 32 \times 32$. (b) Una convolución de 8 a 16 canales con filtro 3×3. (c) Una convolución 1×1 de 16 a 4 canales. (d) Una capa lineal que lleve una imagen $3 \times 32 \times 32$ a un tensor $8 \times 28 \times 28$, que es lo que produce (a).
#### Paso 1
Se aplica $D \cdot C \cdot f_h f_w + D$.
#### Paso 2
(a) $8 \cdot 3 \cdot 25 + 8 = 600 + 8 = 608$.
#### Paso 3
(b) $16 \cdot 8 \cdot 9 + 16 = 1152 + 16 = 1168$. Y (c) $4 \cdot 16 \cdot 1 + 4 = 68$.
#### Paso 4
(d) La entrada tiene $3 \cdot 32 \cdot 32 = 3072$ valores y la salida $8 \cdot 28 \cdot 28 = 6272$. La capa lineal necesita $3072 \cdot 6272 + 6272 = 19\,273\,856$ parámetros, unas 31 700 veces más que los 608 de la convolución.

## 8. MaxPooling

### ¿Cómo se define el max pooling con ventana $f_h \times f_w$ y paso 1?
$y_{ij} = \max_{0 \le u < f_h,\; 0 \le v < f_w} x_{i+u,\,j+v}$, con salida $y_h = x_h - f_h + 1$ y $y_w = x_w - f_w + 1$.

### ¿Qué paso usa el max pooling estándar y qué tamaño de salida da?
El paso es igual al tamaño de la ventana, $(s_h, s_w) = (f_h, f_w)$, de modo que las ventanas no se solapan. La salida es $y_h = \lfloor (x_h - f_h)/s_h \rfloor + 1$ y lo mismo para el ancho.

### ¿Cuántos parámetros tiene una capa de max pooling?
Ninguno. Solo toma el máximo de cada ventana.

### ¿Qué le pasa al número de canales en una capa de pooling?
Se conserva. El pooling se aplica a cada canal de forma independiente, de modo que $Y_c = \text{MaxPool2d}(X_c)$.

### ¿Cómo se propaga el gradiente hacia atrás en el max pooling?
Con $u_{ij} = \partial L/\partial y_{ij}$, cada $u_{ij}$ pasa solo a la posición que fue el máximo de su ventana, y el resto de la ventana recibe cero. Formalmente, $\frac{\partial L}{\partial x_{mn}} = \sum_{ij} u_{ij}\, \mathbb{1}[(m,n) = \arg\max \text{ de la ventana } (i,j)]$.

### ¿Qué gradiente recibe un elemento que es el máximo de varias ventanas solapadas en un max pooling?
La suma de los $u_{ij}$ de todas esas ventanas. Con ventanas que no se solapan, como en el pooling estándar, cada elemento está en una sola ventana y recibe a lo sumo un $u_{ij}$. Es lo que pasa en el max pooling 3×3 de paso 2 de AlexNet, donde las ventanas contiguas comparten una fila y una columna.

### ¿Qué es el global max pooling y cuánto vale su gradiente?
Es un max pooling con ventana del tamaño de un canal entero, así que da un valor por canal: $y_c = \max_{u,v} x_{c,u,v}$. El gradiente $u_c$ que llega a ese canal va solo a la posición del máximo de cada canal y es cero en el resto.

### Problema: max pooling 2×2 estándar, hacia delante y hacia atrás
Sea $X = \begin{bmatrix} 1 & 3 & 2 & 0 \\ 4 & 2 & 1 & 5 \\ 0 & 6 & 3 & 3 \\ 2 & 1 & 7 & 4 \end{bmatrix}$ con max pooling 2×2 de paso 2. Calcula $Y$ y, dado $U = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix}$, calcula $\partial L / \partial X$.
#### Paso 1
Tamaño: $\lfloor (4-2)/2 \rfloor + 1 = 2$, así que $Y$ es 2×2.
#### Paso 2
Máximo de cada ventana: la superior izquierda $\{1,3,4,2\}$ da 4, la superior derecha $\{2,0,1,5\}$ da 5, la inferior izquierda $\{0,6,2,1\}$ da 6 y la inferior derecha $\{3,3,7,4\}$ da 7. Por tanto $Y = \begin{bmatrix} 4 & 5 \\ 6 & 7 \end{bmatrix}$.
#### Paso 3
Posiciones de los máximos (fila, columna): 4 en $(1,0)$, 5 en $(1,3)$, 6 en $(2,1)$ y 7 en $(3,2)$.
#### Paso 4
Cada $u_{ij}$ va a la posición de su máximo y el resto es cero:

$$\frac{\partial L}{\partial X} = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 1 & 0 & 0 & 2 \\ 0 & 3 & 0 & 0 \\ 0 & 0 & 4 & 0 \end{bmatrix}$$

La suma de los gradientes se conserva: $1+2+3+4 = 10$.

### Problema: dimensiones y parámetros de una CNN pequeña
Una imagen de 1×16×16 pasa por: convolución de 1 a 8 canales con filtro 3×3 sin padding, ReLU, max pooling 2×2 de paso 2, convolución de 8 a 16 canales con filtro 3×3 y padding 1, ReLU, max pooling 2×2 de paso 2, aplanado y capa lineal a 10 clases. Calcula la forma del tensor tras cada capa y el número de parámetros.
#### Paso 1
Primera convolución: $16 - 3 + 1 = 14$, así que $8 \times 14 \times 14$. La ReLU no cambia la forma.
#### Paso 2
Primer pooling: $\lfloor (14-2)/2 \rfloor + 1 = 7$, así que $8 \times 7 \times 7$.
#### Paso 3
Segunda convolución con padding 1: $7 + 2 - 3 + 1 = 7$, así que $16 \times 7 \times 7$. Segundo pooling: $\lfloor (7-2)/2 \rfloor + 1 = 3$, así que $16 \times 3 \times 3$. La fila y la columna sobrantes de la entrada no se leen.
#### Paso 4
Aplanado: $16 \cdot 3 \cdot 3 = 144$ valores. La capa lineal tiene $144 \cdot 10 + 10 = 1450$ parámetros.
#### Paso 5
Parámetros: primera convolución $8 \cdot 1 \cdot 9 + 8 = 80$, segunda convolución $16 \cdot 8 \cdot 9 + 16 = 1168$, lineal 1450. Las ReLU y los pooling no tienen. En total $80 + 1168 + 1450 = 2698$.

## 9. AvgPooling

### ¿Cómo se define el average pooling con ventana $f_h \times f_w$?
$y_{ij} = \frac{1}{f_h f_w} \sum_{u=0}^{f_h-1} \sum_{v=0}^{f_w-1} x_{i+u,\,j+v}$, es decir, la media de cada ventana. Con paso 1 la salida mide $x_h - f_h + 1$, y con el paso estándar $s = f$ mide $\lfloor (x_h - f_h)/s_h \rfloor + 1$, igual que en el max pooling.

### ¿Cómo se propaga el gradiente hacia atrás en el average pooling?
Con $u_{ij} = \partial L/\partial y_{ij}$, cada $u_{ij}$ se reparte a partes iguales entre los elementos de su ventana, $\frac{u_{ij}}{f_h f_w}$ para cada uno. Un elemento recibe la suma de lo que le toca de todas las ventanas que lo contienen: $\frac{\partial L}{\partial x_{mn}} = \frac{1}{f_h f_w} \sum_{i,j \text{ con } x_{mn} \in \text{ventana}(i,j)} u_{ij}$.

### ¿Qué diferencia hay entre el gradiente del max pooling y el del average pooling?
En el max pooling el gradiente de cada ventana va a un único elemento, el máximo. En el average pooling se reparte a partes iguales entre todos los elementos de la ventana, así que ninguno queda en cero.

### ¿Cuánto vale el gradiente de un global average pooling sobre un canal de $x_h \times x_w$?
Cada elemento del canal recibe $\frac{u_c}{x_h x_w}$, porque todos influyen por igual en la media. Por ejemplo, con un canal de 3 elementos y $u_c = 1$, cada uno recibe $1/3$.

### Problema: average pooling 2×2 con paso 1, hacia delante y hacia atrás
Sea $X = \begin{bmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{bmatrix}$ con average pooling 2×2 y paso 1. Calcula $Y$ y, dado $U = \begin{bmatrix} 4 & 8 \\ 0 & 4 \end{bmatrix}$, calcula $\partial L / \partial X$.
#### Paso 1
Tamaño: $3 - 2 + 1 = 2$, así que $Y$ es 2×2.
#### Paso 2
Media de cada ventana: $\frac{1+2+4+5}{4} = 3$, $\frac{2+3+5+6}{4} = 4$, $\frac{4+5+7+8}{4} = 6$ y $\frac{5+6+8+9}{4} = 7$. Por tanto $Y = \begin{bmatrix} 3 & 4 \\ 6 & 7 \end{bmatrix}$.
#### Paso 3
Cada ventana reparte $u_{ij}/4$ a sus cuatro elementos: $1$, $2$, $0$ y $1$ para las ventanas $(0,0)$, $(0,1)$, $(1,0)$ y $(1,1)$.
#### Paso 4
Cada elemento suma lo que recibe de las ventanas que lo contienen. Por ejemplo, el elemento central $(1,1)$ está en las cuatro ventanas y recibe $1 + 2 + 0 + 1 = 4$. El elemento $(0,1)$ está en las ventanas $(0,0)$ y $(0,1)$ y recibe $1 + 2 = 3$. Completando todos:

$$\frac{\partial L}{\partial X} = \begin{bmatrix} 1 & 3 & 2 \\ 1 & 4 & 3 \\ 0 & 1 & 1 \end{bmatrix}$$

La suma de los gradientes se conserva: $1+3+2+1+4+3+0+1+1 = 16 = 4+8+0+4$.

## 10. Dropout

### ¿Qué es el dropout y sobre qué se aplica?
Es una capa de regularización que se aplica a las salidas de otra capa, que son sus entradas.

### ¿Qué hace la capa dropout durante el entrenamiento?
Pone a cero cada entrada con probabilidad $p$ y multiplica las entradas que sobreviven por $\frac{1}{1-p}$.

### ¿Qué hace la capa dropout durante la evaluación?
Nada: actúa como la función identidad.

### ¿Por qué se reescalan por $\frac{1}{1-p}$ las entradas que sobreviven al dropout?
Para que el valor esperado de la salida sea igual a la entrada. Cada entrada sobrevive con probabilidad $1-p$, de modo que $E[\text{salida}] = (1-p)\,\frac{x}{1-p} = x$. Así no hace falta cambiar nada en evaluación.

### Problema: aplicar dropout a mano
Aplica dropout con $p = 0{,}2$ a $x = (2, 6, 10)$ en entrenamiento, suponiendo que se anula solo la segunda entrada. Después da el resultado en evaluación.
#### Paso 1
El factor de reescalado es $\frac{1}{1-0{,}2} = 1{,}25$.
#### Paso 2
Entrenamiento: la segunda entrada pasa a $0$ y las otras se multiplican por 1,25, de modo que $(2 \cdot 1{,}25,\; 0,\; 10 \cdot 1{,}25) = (2{,}5,\; 0,\; 12{,}5)$.
#### Paso 3
Evaluación: la salida es la identidad, $(2, 6, 10)$.
