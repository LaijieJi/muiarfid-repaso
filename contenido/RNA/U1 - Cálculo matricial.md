# RNA U1 - Cálculo matricial

## 3. Gradient

### ¿Qué es el gradiente de una función de $\mathbb{R}^n$ en $\mathbb{R}$?
El vector de sus $n$ derivadas parciales, $g = \nabla f = \left(\frac{\partial f}{\partial x_1}, \dots, \frac{\partial f}{\partial x_n}\right)^t$. Se escribe como vector columna en $\mathbb{R}^n$.

### ¿Qué indica el gradiente negativo?
La dirección en la que $f$ decrece más rápidamente. Es la base del descenso por gradiente.

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

### ¿Qué caso se calcula en la práctica con un tensor $\frac{\partial y}{\partial X}$ y por qué es manejable?
El producto $u^t\frac{\partial y}{\partial X}$ con $u\in\mathbb{R}^m$ constante. Su primera dimensión vale 1, así que se extrae y queda una matriz $q\times p$: $\sum_i u_i \frac{\partial y_i}{\partial X}$.

### ¿Qué es la denominator layout y en qué se diferencia de la numerator layout?
Pone primero la forma del denominador y después la forma transpuesta del numerador. El resultado es el de la numerator layout, pero transpuesto. Por ejemplo, el gradiente es una columna en denominator layout.

### ¿Cómo se escribe la regla de la cadena en cálculo matricial?
Con el orden de los factores de izquierda a derecha, del numerador al denominador: $\frac{\partial f(g(u))}{\partial x} = \frac{\partial f}{\partial g}\frac{\partial g}{\partial u}\frac{\partial u}{\partial x}$. Los tamaños encajan como en un producto de matrices.

### ¿Cuánto vale $\frac{\partial y}{\partial x}$ si $y = Wx$ con $W\in\mathbb{R}^{m\times n}$?
$W$ en sí misma, una matriz $m\times n$. Se ve componente a componente: $y_i = \sum_k W_{ik}x_k$ y por tanto $\frac{\partial y_i}{\partial x_j} = W_{ij}$.

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

### ¿Cómo se define la sigmoide y cuánto vale $1-\sigma(x)$?
$\sigma(x) = \frac{1}{1+e^{-x}}$ y $1-\sigma(x) = \frac{e^{-x}}{1+e^{-x}} = \frac{1}{1+e^{x}} = \sigma(-x)$.

### ¿Cuánto vale la derivada de la BCE respecto a la entrada $a$ de una sigmoide, $\hat y=\sigma(a)$?
$\frac{\partial\ell}{\partial a} = \hat y - y$. El producto $\frac{\hat y-y}{\hat y(1-\hat y)}\cdot\hat y(1-\hat y)$ cancela el denominador.

### ¿Cómo se define la softmax y qué tamaño tiene su jacobiano?
$\mu = S(a)$ con $\mu_i = \frac{e^{a_i}}{\sum_{c}e^{a_c}}$. Su jacobiano $\frac{\partial\mu}{\partial a}$ es una matriz $C\times C$ si hay $C$ clases.

### ¿Cuál es el jacobiano de la softmax?
$\frac{\partial\mu_i}{\partial a_j} = \mu_i(\mathbb{I}(i=j)-\mu_j)$, es decir, $\frac{\partial\mu}{\partial a} = \mathrm{diag}(\mu) - \mu\mu^t$. La diagonal vale $\mu_i(1-\mu_i)$ y fuera de ella $-\mu_i\mu_j$.

### ¿Cuánto vale la derivada de la CE respecto a la entrada $a$ de una softmax, $\hat y=\mu=S(a)$?
$\frac{\partial\ell}{\partial a} = (\mu-y)^t$, una fila $1\times C$. Es la predicción menos la etiqueta, transpuesta.

### ¿Cómo se deduce $\frac{\partial\ell}{\partial a} = (\mu-y)^t$?
Se multiplica $\bigl(-y^t\oslash\mu^t\bigr)\bigl(\mathrm{diag}(\mu)-\mu\mu^t\bigr) = (y^t\oslash\mu^t)\mu\mu^t - (y^t\oslash\mu^t)\mathrm{diag}(\mu)$. El primer término vale $(\sum_c y_c)\mu^t=\mu^t$ y el segundo vale $y^t$, así que sale $\mu^t - y^t$ (con $\sum_c y_c = 1$).

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
