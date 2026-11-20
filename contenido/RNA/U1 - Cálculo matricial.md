# RNA U1 - Cálculo matricial

## 1. Introduction

### ¿Para qué sirve el cálculo matricial en redes neuronales?
Es una notación especializada para manejar derivadas parciales con vectores y matrices. Permite escribir el gradiente de una función de pérdida con pocas expresiones compactas y comprobar las dimensiones de cada paso.

### ¿Qué tres conceptos básicos se generalizan en esta unidad?
La derivada (función de $\mathbb{R}$ en $\mathbb{R}$), el gradiente (de $\mathbb{R}^n$ en $\mathbb{R}$) y el jacobiano (de $\mathbb{R}^n$ en $\mathbb{R}^m$). Cada uno es la anterior con más dimensiones.

## 2. Derivative

### ¿Cómo se define la derivada de $f:\mathbb{R}\to\mathbb{R}$ en un punto?
Como el límite $f'(x) = \lim_{h\to 0} \frac{f(x+h)-f(x)}{h}$. Geométricamente es la pendiente de la recta tangente a $f$ en $x$.

### ¿Qué es la aproximación por diferencias finitas de la derivada?
Para un $h > 0$ pequeño, $f(x+h) \approx f(x) + f'(x)h$, de donde $f'(x) \approx \frac{f(x+h)-f(x)}{h}$. Se usa para comprobar derivadas calculadas a mano.

### ¿Qué dos notaciones de la derivada se usan?
Lagrange: $f'$, $f''$ y $f^{(n)}$ para la primera, la segunda y la $n$-ésima. Leibniz: $\frac{dy}{dx}$ o $\frac{d}{dx}f(x)$, y $\frac{df}{dx}\big|_{x=a}$ para evaluarla en $a$.

### ¿Por qué se dice que derivar es un operador funcional?
Porque recibe una función y devuelve otra función: $D(f) = f'$.

### ¿Qué es la neg-derivada y qué indica su signo?
Es la derivada con el signo cambiado. Si es positiva, $f$ decrece en la dirección en que crece $x$. Si es negativa, $f$ crece en esa dirección. Por eso el descenso por gradiente se mueve en la dirección de la neg-derivada.

### ¿Qué es un punto estacionario y cómo se distingue su tipo en una variable?
Es un punto donde la derivada vale cero. Es un mínimo si la segunda derivada es positiva y un máximo si es negativa.

### Problema: puntos estacionarios y diferencias finitas de $f(x)=x^3-3x$
Calcula $f'$ y $f''$, halla los puntos estacionarios y clasifícalos. Después aproxima $f'(2)$ con diferencias finitas y $h=0{,}1$ y compara con el valor exacto.
#### Paso 1
Derivando, $f'(x) = 3x^2 - 3$ y $f''(x) = 6x$.
#### Paso 2
Los puntos estacionarios cumplen $3x^2 - 3 = 0$, es decir, $x = 1$ y $x = -1$.
#### Paso 3
En $x=1$ la segunda derivada es $f''(1) = 6 > 0$, así que es un mínimo con $f(1) = -2$. En $x=-1$ vale $f''(-1) = -6 < 0$, así que es un máximo con $f(-1) = 2$.
#### Paso 4
Con $h=0{,}1$: $f(2) = 8 - 6 = 2$ y $f(2{,}1) = 9{,}261 - 6{,}3 = 2{,}961$. La aproximación es $\frac{2{,}961 - 2}{0{,}1} = 9{,}61$. El valor exacto es $f'(2) = 3\cdot 4 - 3 = 9$. El error de $0{,}61$ se reduce al disminuir $h$.

## 3. Gradient

### ¿Cómo se define la derivada parcial de $f:\mathbb{R}^n\to\mathbb{R}$ respecto a $x_i$?
Como $\frac{\partial f}{\partial x_i} = \lim_{h\to0}\frac{f(x+he_i)-f(x)}{h}$, con $e_i$ el $i$-ésimo vector unitario. Es la derivada de $f$ moviendo solo la coordenada $i$ y dejando fija el resto.

### ¿Qué es el gradiente de una función de $\mathbb{R}^n$ en $\mathbb{R}$?
El vector de sus $n$ derivadas parciales, $g = \nabla f = \left(\frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n}\right)^t$. Se escribe como vector columna en $\mathbb{R}^n$.

### ¿Qué indica el gradiente negativo?
La dirección en la que $f$ decrece más rápidamente. Es la base del descenso por gradiente.

### ¿Qué es un punto estacionario de una función de varias variables?
Un punto en el que el gradiente es el vector cero, $g(x^*) = 0$.

### ¿Qué es la hessiana y de qué tamaño es?
La matriz de segundas derivadas parciales, $H(x) = \frac{\partial g}{\partial x}$, con $H_{ij} = \frac{\partial^2 f}{\partial x_j \partial x_i}$. Es una matriz $n\times n$.

### ¿Cómo se clasifica un punto estacionario con la hessiana?
Es un mínimo si $H$ es definida positiva (todos sus autovalores positivos) y un máximo si es definida negativa. Si tiene autovalores de ambos signos no es ni mínimo ni máximo, sino un punto de silla.

### Problema: gradiente, hessiana y punto estacionario de $f(x_1,x_2)=x_1^2+x_1x_2+x_2^2-3x_1$
Calcula el gradiente en $x=(1,1)^t$ y la dirección de descenso. Después halla el punto estacionario con la hessiana y clasifícalo.
#### Paso 1
Las derivadas parciales son $\frac{\partial f}{\partial x_1} = 2x_1 + x_2 - 3$ y $\frac{\partial f}{\partial x_2} = x_1 + 2x_2$.
#### Paso 2
En $(1,1)$: $g = (2+1-3,\ 1+2)^t = (0,\ 3)^t$. La dirección de máximo descenso es el gradiente negativo, $(0,\ -3)^t$.
#### Paso 3
Para el punto estacionario se resuelve $2x_1 + x_2 = 3$ y $x_1 + 2x_2 = 0$. De la segunda, $x_1 = -2x_2$. Sustituyendo, $-4x_2 + x_2 = 3$, o sea $x_2 = -1$ y $x_1 = 2$. El punto es $x^*=(2,-1)^t$, con $f(x^*) = 4 - 2 + 1 - 6 = -3$.
#### Paso 4
La hessiana es $H = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}$, constante. Sus autovalores son $3$ y $1$, ambos positivos. Por tanto $H$ es definida positiva y $x^*$ es un mínimo.

## 4. Jacobian

### ¿Qué es el jacobiano de $f:\mathbb{R}^n\to\mathbb{R}^m$ y qué forma tiene?
La matriz de todas las derivadas parciales, $J_{ij} = \frac{\partial f_i}{\partial x_j}$. Tiene $m$ filas y $n$ columnas, es decir, $m\times n$. La fila $i$ es el gradiente de $f_i$ transpuesto.

### ¿Qué relación hay entre el jacobiano y el gradiente cuando $m=1$?
El jacobiano de una función de $\mathbb{R}^n$ en $\mathbb{R}$ es una fila de $1\times n$ y coincide con el gradiente transpuesto, $\nabla f^t$.

### ¿Qué es el jacobiano del gradiente de una función de $\mathbb{R}^n$ en $\mathbb{R}$?
Es su hessiana, una matriz $n\times n$.

### Problema: jacobiano de una función de $\mathbb{R}^2$ en $\mathbb{R}^3$
Sea $f(x_1,x_2) = (x_1x_2,\ x_1^2+x_2,\ 3x_1 - x_2^2)^t$. Calcula su jacobiano en $x=(1,2)^t$, indica su tamaño y obtén una aproximación de primer orden de $f(1{,}1,\ 1{,}9)$.
#### Paso 1
La función va de $\mathbb{R}^2$ a $\mathbb{R}^3$, así que el jacobiano es $3\times 2$. Cada fila es el gradiente transpuesto de una componente.
#### Paso 2
En forma general, $J = \begin{pmatrix} x_2 & x_1 \\ 2x_1 & 1 \\ 3 & -2x_2 \end{pmatrix}$.
#### Paso 3
En $(1,2)$: $J = \begin{pmatrix} 2 & 1 \\ 2 & 1 \\ 3 & -4 \end{pmatrix}$. Además $f(1,2) = (2,\ 3,\ -1)^t$.
#### Paso 4
Con $\Delta x = (0{,}1,\ -0{,}1)^t$: $J\Delta x = (0{,}2 - 0{,}1,\ 0{,}2 - 0{,}1,\ 0{,}3 + 0{,}4)^t = (0{,}1,\ 0{,}1,\ 0{,}7)^t$. Entonces $f(1{,}1,\ 1{,}9) \approx (2{,}1,\ 3{,}1,\ -0{,}3)^t$.

## 5. Matrix calculus

### ¿Qué convención de formas usa el cálculo matricial de la unidad?
La numerator layout: primero la forma del numerador y después la forma transpuesta del denominador. Por ejemplo, $\frac{\partial y}{\partial x}$ con $y\in\mathbb{R}^m$ y $x\in\mathbb{R}^n$ es una matriz $m\times n$.

### ¿Qué forma tiene $\frac{\partial y}{\partial x}$ según sean $y$ y $x$ escalares, vectores o matrices?
| $y$ | $x$ | Forma de $\frac{\partial y}{\partial x}$ |
|---|---|---|
| escalar | escalar | $1\times1$ |
| escalar | vector $\mathbb{R}^n$ | $1\times n$ (fila) |
| escalar | matriz $\mathbb{R}^{p\times q}$ | $q\times p$ (la forma transpuesta de $X$) |
| vector $\mathbb{R}^m$ | escalar | $m\times1$ |
| vector $\mathbb{R}^m$ | vector $\mathbb{R}^n$ | $m\times n$ |
| vector $\mathbb{R}^m$ | matriz $\mathbb{R}^{p\times q}$ | tensor de 3 dimensiones $m\times q\times p$ |

Si $Y$ es una matriz $m\times n$ y $x$ es un escalar, $\frac{\partial Y}{\partial x}$ es una matriz $m\times n$. Con $x$ vector es un tensor de 3 dimensiones y con $X$ matriz, de 4. Esos casos no se usan.

### ¿Por qué el gradiente es una columna y la derivada de un escalar respecto a un vector es una fila?
Porque el gradiente $\nabla f$ está definido como columna, mientras que en numerator layout $\frac{\partial f}{\partial x}$ conserva la forma del numerador (un escalar, $1\times1$) y la transpuesta del denominador ($1\times n$). Son transpuestos: $\frac{\partial f}{\partial x} = \nabla f^t$.

### ¿Qué dificultad aparece al derivar un vector respecto a una matriz?
El resultado es un tensor de tres dimensiones, $\frac{\partial y}{\partial X}\in\mathbb{R}^{m\times q\times p}$. En la práctica no se calcula, porque siempre se contrae con un vector constante $u^t$.

### ¿Qué caso se calcula en la práctica con un tensor $\frac{\partial y}{\partial X}$ y por qué es manejable?
El producto $u^t\frac{\partial y}{\partial X}$ con $u\in\mathbb{R}^m$ constante. Su primera dimensión vale 1, así que se extrae y queda una matriz $q\times p$: $\sum_i u_i \frac{\partial y_i}{\partial X}$.

### ¿Qué es la denominator layout y en qué se diferencia de la numerator layout?
Pone primero la forma del denominador y después la forma transpuesta del numerador. El resultado es el de la numerator layout, pero transpuesto. Por ejemplo, el gradiente es una columna en denominator layout.

### ¿Qué recomendación se da para evitar errores de formas?
Usar siempre la misma convención, y a ser posible la numerator layout. Mezclarlas obliga a transponer a mano y es fácil equivocarse.

### ¿Qué es el layout mixto y de dónde salen la numerator y la denominator layout?
Las dos layouts nacen de la forma que se da a $\frac{\partial y}{\partial x}$ con $y$ y $x$ vectores: $m\times n$ en numerator layout y $n\times m$ en denominator layout. El layout mixto escribe $\frac{\partial y}{\partial x^t}$ y sigue la numerator layout.

### ¿Cuánto vale la derivada de una constante $a$ y cómo se saca la constante de una derivada?
$\frac{\partial a}{\partial x} = 0$ y $\frac{\partial (au)}{\partial x} = a\frac{\partial u}{\partial x}$, con la misma forma que $\frac{\partial u}{\partial x}$.

### ¿Cuánto vale la derivada de una suma $u+v$?
La suma de las derivadas, $\frac{\partial u}{\partial x} + \frac{\partial v}{\partial x}$, tanto para escalares como para vectores.

### ¿Cuál es la regla del producto para dos funciones escalares $u$ y $v$ de $x$?
$\frac{\partial (uv)}{\partial x} = u\frac{\partial v}{\partial x} + v\frac{\partial u}{\partial x}$. Ambos sumandos tienen la forma de $\frac{\partial y}{\partial x}$ (por ejemplo, $1\times n$ si $x$ es un vector).

### ¿Cómo se escribe la regla de la cadena en cálculo matricial?
Con el orden de los factores de izquierda a derecha, del numerador al denominador: $\frac{\partial f(g(u))}{\partial x} = \frac{\partial f}{\partial g}\frac{\partial g}{\partial u}\frac{\partial u}{\partial x}$. Los tamaños encajan como en un producto de matrices.

### ¿Por qué el orden de los factores en la regla de la cadena matricial no se puede cambiar?
Porque es un producto de matrices, que no es conmutativo, y los tamaños solo encajan en el orden "de fuera hacia dentro". Por ejemplo, $(m\times k)(k\times n)$ es válido, pero al revés no.

### ¿Cuál es la regla de la cadena para una función vectorial $y=f(g(u(x)))$ de $x\in\mathbb{R}^n$?
$\frac{\partial y}{\partial x} = \frac{\partial f}{\partial g}\frac{\partial g}{\partial u}\frac{\partial u}{\partial x}$, producto de jacobianos. El tamaño es el de $y$ por el de $x$, $m\times n$.

### ¿Cuánto vale $\frac{\partial y}{\partial x}$ si $y = Wx$ con $W\in\mathbb{R}^{m\times n}$?
$W$ en sí misma, una matriz $m\times n$. Se ve componente a componente: $y_i = \sum_k W_{ik}x_k$ y por tanto $\frac{\partial y_i}{\partial x_j} = W_{ij}$.

### ¿Cuánto vale $\frac{\partial y_k}{\partial W_{ij}}$ si $y=Wx$?
$x_j\,\mathbb{I}(k=i)$, es decir, $x_j$ si $k=i$ y cero en otro caso. $y_k$ solo depende de la fila $k$ de $W$.

### ¿Cuál es la forma de $\frac{\partial y_k}{\partial W}$ si $y=Wx$ y cómo es su contenido?
Es una matriz $n\times m$ (la forma transpuesta de $W$) que vale $x\,\mathrm{onehot}(k)^t$: tiene el vector $x$ en la columna $k$ y ceros en el resto.

### ¿Cuánto vale $u^t\frac{\partial y}{\partial W}$ para $y=Wx$ y $u$ constante?
$x u^t$, una matriz $n\times m$. Sale de sumar $\sum_k u_k\, x\,\mathrm{onehot}(k)^t = x\sum_k u_k\,\mathrm{onehot}(k)^t = x u^t$.

### Si un escalar $s = u^t W x$ con $u$ constante, ¿cuánto valen $\frac{\partial s}{\partial W}$ y $\frac{\partial s}{\partial x}$?
$\frac{\partial s}{\partial W} = xu^t$ (forma $n\times m$) y $\frac{\partial s}{\partial x} = u^tW$ (forma $1\times n$). El primero tiene la forma transpuesta de $W$, el segundo es una fila.

### ¿Por qué $\frac{\partial \ell}{\partial W}$ en numerator layout es $x\,\frac{\partial \ell}{\partial a}$ y no $\frac{\partial \ell}{\partial a}\,x$?
Porque con $a=Wx$, $\frac{\partial\ell}{\partial a}\in\mathbb{R}^{1\times m}$ hace el papel de $u^t$ y $x\in\mathbb{R}^{n\times1}$. El producto $x\,\frac{\partial\ell}{\partial a}$ da una matriz $n\times m$. En cambio $\frac{\partial\ell}{\partial a}\,x$ solo estaría definido si $m=n$ y daría un escalar.

### Problema: derivadas de una transformación lineal con datos pequeños
Sea $W=\begin{pmatrix}1&2&0\\-1&1&3\end{pmatrix}$, $x=(2,1,-1)^t$ y $u=(1,2)^t$ constante, con $y=Wx$ y $s=u^ty$. Calcula $y$, $s$, $\frac{\partial y}{\partial x}$, $\frac{\partial s}{\partial x}$ y $\frac{\partial s}{\partial W}$, con sus formas.
#### Paso 1
$W$ es $2\times3$ y $x$ es $3\times1$, así que $y\in\mathbb{R}^{2}$: $y_1 = 2+2+0 = 4$ y $y_2 = -2+1-3 = -4$. Entonces $y=(4,-4)^t$ y $s = 1\cdot4 + 2\cdot(-4) = -4$.
#### Paso 2
$\frac{\partial y}{\partial x} = W$, de forma $2\times3$, igual que $m\times n$ con $m=2$ y $n=3$.
#### Paso 3
$\frac{\partial s}{\partial x} = u^tW = (1\cdot1 + 2\cdot(-1),\ 1\cdot2 + 2\cdot1,\ 1\cdot0 + 2\cdot3) = (-1,\ 4,\ 6)$, una fila $1\times3$.
#### Paso 4
$\frac{\partial s}{\partial W} = xu^t = \begin{pmatrix}2\\1\\-1\end{pmatrix}\begin{pmatrix}1&2\end{pmatrix} = \begin{pmatrix}2&4\\1&2\\-1&-2\end{pmatrix}$, de forma $3\times2$, la transpuesta de la forma de $W$.
#### Paso 5
Comprobación: $s$ es lineal en $W$ y la derivada de $s$ respecto a $W_{ij}$ es $u_i x_j$. Por ejemplo, para $W_{21}$ vale $u_2x_1 = 2\cdot2 = 4$, que es el elemento (fila 1, columna 2) de $xu^t$, es decir, la posición transpuesta de $(2,1)$.

### ¿Qué es una transformación elemental y cuál es su jacobiano?
Es $y=\varphi(x)$ con $y_i=\varphi(x_i)$, aplicar la misma función escalar a cada componente. Su jacobiano es diagonal, $\frac{\partial y}{\partial x} = \mathrm{diag}(\varphi'(x_1),\dots,\varphi'(x_n))$, porque $y_i$ solo depende de $x_i$.

### ¿Por qué el jacobiano de una transformación elemental es diagonal?
Porque $\frac{\partial y_i}{\partial x_j} = \varphi'(x_i)\,\mathbb{I}(i=j)$: la salida $i$ no cambia al mover la entrada $j\neq i$.

### ¿Cómo se simplifica el producto de un vector fila por el jacobiano diagonal de una activación?
$v^t\,\mathrm{diag}(\varphi'(x)) = v^t\odot\varphi'(x)^t$, un producto componente a componente. No hace falta construir la matriz diagonal en el código.

### ¿Qué forma tiene $\frac{\partial\ell}{\partial W}$ en una capa $a=Wx$ y por qué?
La de $W^t$, es decir, $n\times m$ si $W$ es $m\times n$. En numerator layout un escalar derivado respecto a una matriz tiene la forma transpuesta de la matriz.

### ¿Cómo se obtiene $\frac{\partial\ell}{\partial W}$ y $\frac{\partial\ell}{\partial x}$ a partir de $\frac{\partial\ell}{\partial a}$ en una capa $a=Wx$?
$\frac{\partial\ell}{\partial W} = x\,\frac{\partial\ell}{\partial a}$ (forma $n\times m$) y $\frac{\partial\ell}{\partial x} = \frac{\partial\ell}{\partial a}\,W$ (forma $1\times n$). Son las dos identidades de la transformación lineal con $u^t = \frac{\partial\ell}{\partial a}$.

### ¿Cómo se pasa de $\frac{\partial\ell}{\partial h}$ a $\frac{\partial\ell}{\partial a}$ cuando la activación es elemental, $h=\varphi(a)$?
$\frac{\partial\ell}{\partial a} = \frac{\partial\ell}{\partial h}\,\mathrm{diag}(\varphi'(a))$, equivalente al producto componente a componente $\frac{\partial\ell}{\partial h}\odot\varphi'(a)^t$.

### Problema: regla de la cadena en una red de dos capas
Sea $x=(2,1)^t$, $W=\begin{pmatrix}1&-1\\0&1\end{pmatrix}$, $a=Wx$, $h=\varphi(a)$ con $\varphi(t)=t^2$, $\hat y = v^th$ con $v=(2,-1)^t$, y pérdida $\ell=(y-\hat y)^2$ con $y=3$. Calcula $\ell$, $\frac{\partial\ell}{\partial W}$ y $\frac{\partial\ell}{\partial x}$ con sus formas.
#### Paso 1
Pasada hacia delante: $a = (1\cdot2 - 1\cdot1,\ 0\cdot2 + 1\cdot1)^t = (1,1)^t$ y $h = (1,1)^t$. Entonces $\hat y = 2\cdot1 - 1\cdot1 = 1$ y $\ell = (3-1)^2 = 4$.
#### Paso 2
Se deriva de la salida hacia atrás. $\frac{\partial\ell}{\partial\hat y} = 2(\hat y - y) = 2(1-3) = -4$, escalar $1\times1$.
#### Paso 3
$\frac{\partial\hat y}{\partial h} = v^t = (2,\ -1)$ de forma $1\times2$, así que $\frac{\partial\ell}{\partial h} = -4\,(2,-1) = (-8,\ 4)$.
#### Paso 4
$\frac{\partial h}{\partial a} = \mathrm{diag}(2a) = \mathrm{diag}(2,2)$, de forma $2\times2$. Entonces $\frac{\partial\ell}{\partial a} = (-8,4)\,\mathrm{diag}(2,2) = (-16,\ 8)$, de forma $1\times2$.
#### Paso 5
$\frac{\partial\ell}{\partial W} = x\,\frac{\partial\ell}{\partial a} = \begin{pmatrix}2\\1\end{pmatrix}(-16,\ 8) = \begin{pmatrix}-32&16\\-16&8\end{pmatrix}$. Su forma es $2\times2$, la de $W^t$.
#### Paso 6
$\frac{\partial\ell}{\partial x} = \frac{\partial\ell}{\partial a}\,W = (-16,\ 8)\begin{pmatrix}1&-1\\0&1\end{pmatrix} = (-16,\ 16+8) = (-16,\ 24)$, una fila $1\times2$.
#### Paso 7
Comprobación por diferencias finitas. Mover $W_{12}$ de $-1$ a $-0{,}999$ da $a_1=1{,}001$, $h_1\approx1{,}002$, $\hat y\approx1{,}004$ y $\ell\approx3{,}984$. El cambio $-0{,}016$ entre $0{,}001$ es $-16$. En numerator layout el elemento de $\frac{\partial\ell}{\partial W}$ para el peso $W_{12}$ (salida 1, entrada 2) está en la fila 2, columna 1, y vale $-16$. Coincide.

## 6. Loss and activation functions and its derivatives

### ¿Cuál es la pérdida cuadrática (L2) y su derivada respecto a la predicción?
$\ell_2(y,\hat y) = (y-\hat y)^2$ y $\frac{\partial\ell_2}{\partial\hat y} = 2(\hat y - y)$.

### ¿Cuál es la entropía cruzada binaria (BCE) y su derivada respecto a la predicción?
$\ell(y,\hat y) = -y\log\hat y - (1-y)\log(1-\hat y)$ y $\frac{\partial\ell}{\partial\hat y} = -\frac{y}{\hat y}+\frac{1-y}{1-\hat y} = \frac{\hat y-y}{\hat y(1-\hat y)}$.

### ¿Cuál es la entropía cruzada (CE) de una predicción $\hat y$ con etiqueta $y$ en codificación one-hot y su derivada respecto a $\hat y$?
$\ell(y,\hat y) = -\sum_c y_c\log\hat y_c = -y^t\log\hat y$. La derivada es la fila $\frac{\partial\ell}{\partial\hat y} = -y^t\oslash\hat y^t$, la división de Hadamard (componente a componente).

### ¿Qué es la división de Hadamard $\oslash$?
La división componente a componente entre dos vectores o matrices del mismo tamaño. En la CE, $-y^t\oslash\hat y^t = \left(-\frac{y_1}{\hat y_1},\dots,-\frac{y_C}{\hat y_C}\right)$.

### ¿Qué forma tiene $\frac{\partial\ell}{\partial\hat y}$ en la CE y qué entradas de esa fila son distintas de cero si $y$ es one-hot?
Una fila $1\times C$. Con $y$ one-hot, solo la componente de la clase correcta es distinta de cero, y vale $-1/\hat y_c$.

### ¿Cómo se define la sigmoide y cuánto vale $1-\sigma(x)$?
$\sigma(x) = \frac{1}{1+e^{-x}}$ y $1-\sigma(x) = \frac{e^{-x}}{1+e^{-x}} = \frac{1}{1+e^{x}} = \sigma(-x)$.

### ¿Cuál es la derivada de la sigmoide en función de la propia sigmoide?
$\sigma'(x) = \sigma(x)\bigl(1-\sigma(x)\bigr) = \sigma(x)\sigma(-x)$. Es máxima en $x=0$, donde vale $0{,}25$.

### ¿Cómo se deduce $\sigma'(x)=\sigma(x)(1-\sigma(x))$?
Se deriva $(1+e^{-x})^{-1}$ y sale $\frac{e^{-x}}{(1+e^{-x})^2}$. Se escribe $e^{-x} = (1+e^{-x})-1$ y queda $\frac{1}{1+e^{-x}} - \frac{1}{(1+e^{-x})^2} = \sigma(x) - \sigma(x)^2$.

### ¿Cuánto vale la derivada de la BCE respecto a la entrada $a$ de una sigmoide, $\hat y=\sigma(a)$?
$\frac{\partial\ell}{\partial a} = \hat y - y$. El producto $\frac{\hat y-y}{\hat y(1-\hat y)}\cdot\hat y(1-\hat y)$ cancela el denominador.

### ¿Por qué conviene combinar BCE y sigmoide en un solo cálculo?
Porque el producto de las derivadas se simplifica a $\hat y - y$, sin divisiones. Es un resultado corto y fácil de recordar.

### ¿Cómo se define la softmax y qué tamaño tiene su jacobiano?
$\mu = S(a)$ con $\mu_i = \frac{e^{a_i}}{\sum_{c}e^{a_c}}$. Su jacobiano $\frac{\partial\mu}{\partial a}$ es una matriz $C\times C$ si hay $C$ clases.

### ¿Cuál es el jacobiano de la softmax?
$\frac{\partial\mu_i}{\partial a_j} = \mu_i(\mathbb{I}(i=j)-\mu_j)$, es decir, $\frac{\partial\mu}{\partial a} = \mathrm{diag}(\mu) - \mu\mu^t$. La diagonal vale $\mu_i(1-\mu_i)$ y fuera de ella $-\mu_i\mu_j$.

### ¿Por qué cada fila del jacobiano de la softmax suma cero?
Porque sumar la misma constante a todas las entradas no cambia la softmax. Con las filas, $\sum_j\mu_i(\mathbb{I}(i=j)-\mu_j)=\mu_i-\mu_i\sum_j\mu_j=0$. Las columnas también suman cero, porque $\mu$ suma 1.

### ¿Cuánto vale la derivada de la CE respecto a la entrada $a$ de una softmax, $\hat y=\mu=S(a)$?
$\frac{\partial\ell}{\partial a} = (\mu-y)^t$, una fila $1\times C$. Es la predicción menos la etiqueta, transpuesta.

### ¿Cómo se deduce $\frac{\partial\ell}{\partial a} = (\mu-y)^t$?
Se multiplica $\bigl(-y^t\oslash\mu^t\bigr)\bigl(\mathrm{diag}(\mu)-\mu\mu^t\bigr) = (y^t\oslash\mu^t)\mu\mu^t - (y^t\oslash\mu^t)\mathrm{diag}(\mu)$. El primer término vale $(\sum_c y_c)\mu^t=\mu^t$ y el segundo vale $y^t$, así que sale $\mu^t - y^t$ (con $\sum_c y_c = 1$).

### ¿Qué condición sobre $y$ se usa al simplificar CE con softmax?
Que $y$ sume 1 (distribución de probabilidad, por ejemplo one-hot). Si no sumara 1, el resultado sería $(\mu\sum_c y_c - y)^t$.

### Problema: sigmoide con BCE, datos pequeños
Con $a=\ln 3$, calcula $\hat y = \sigma(a)$ y $\sigma'(a)$ con la fórmula en función de $\sigma$. Después calcula $\frac{\partial\ell}{\partial\hat y}$ y $\frac{\partial\ell}{\partial a}$ para $y=1$ y para $y=0$, y comprueba que $\frac{\partial\ell}{\partial a}=\hat y - y$.
#### Paso 1
$e^{-a} = 1/3$, de modo que $\hat y = \frac{1}{1+1/3} = \frac34$. Además $1-\hat y = \sigma(-a) = \frac14$.
#### Paso 2
$\sigma'(a) = \hat y(1-\hat y) = \frac34\cdot\frac14 = \frac{3}{16}$.
#### Paso 3
Con $y=1$: $\frac{\partial\ell}{\partial\hat y} = -\frac{1}{\hat y} = -\frac43$. Con la cadena, $\frac{\partial\ell}{\partial a} = -\frac43\cdot\frac3{16} = -\frac14$.
#### Paso 4
Con $y=0$: $\frac{\partial\ell}{\partial\hat y} = \frac{1}{1-\hat y} = 4$ y $\frac{\partial\ell}{\partial a} = 4\cdot\frac3{16} = \frac34$.
#### Paso 5
Comprobación: $\hat y - y = \frac34 - 1 = -\frac14$ para $y=1$ y $\frac34 - 0 = \frac34$ para $y=0$. Coinciden con la cadena.

### Problema: jacobiano de la softmax y gradiente de la CE con datos pequeños
Sea $a=(0,\ \ln2,\ 0)^t$ y $y=(0,1,0)^t$. Calcula $\mu=S(a)$, el jacobiano $\frac{\partial\mu}{\partial a}$ y $\frac{\partial\ell}{\partial a}$ de la CE, comprobando la fórmula $(\mu-y)^t$.
#### Paso 1
$e^{a}=(1,2,1)$ y la suma es 4, de modo que $\mu = (0{,}25,\ 0{,}5,\ 0{,}25)^t$.
#### Paso 2
$\mathrm{diag}(\mu)-\mu\mu^t$ tiene diagonal $\mu_i(1-\mu_i) = (0{,}1875,\ 0{,}25,\ 0{,}1875)$. Fuera de la diagonal, $-\mu_1\mu_2 = -0{,}125$, $-\mu_1\mu_3 = -0{,}0625$ y $-\mu_2\mu_3 = -0{,}125$.
#### Paso 3
El jacobiano es $\begin{pmatrix}0{,}1875&-0{,}125&-0{,}0625\\-0{,}125&0{,}25&-0{,}125\\-0{,}0625&-0{,}125&0{,}1875\end{pmatrix}$, de forma $3\times3$. Cada fila suma 0.
#### Paso 4
$\frac{\partial\ell}{\partial\mu} = -y^t\oslash\mu^t = (0,\ -2,\ 0)$, una fila $1\times3$ (con $y=(0,1,0)$ solo cuenta la clase 2: $-1/0{,}5=-2$).
#### Paso 5
$\frac{\partial\ell}{\partial a}=(0,-2,0)\,J$ es $-2$ por la fila 2 del jacobiano, $(-0{,}125,\ 0{,}25,\ -0{,}125)$, es decir, $(0{,}25,\ -0{,}5,\ 0{,}25)$. Coincide con $(\mu-y)^t=(0{,}25,\ 0{,}5-1,\ 0{,}25)$.
