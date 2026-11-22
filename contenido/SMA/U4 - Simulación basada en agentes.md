# SMA U4 - Simulación basada en agentes

## 1. ¿Por qué simular?

### ¿En qué situaciones conviene simular un sistema en lugar de estudiarlo directamente?
Cuando la parte del mundo real que interesa no es accesible (por ejemplo, porque aún no existe) o cuando experimentar con ella es inviable. También cuando el sistema es demasiado grande o demasiado pequeño para observarlo, cuando hay que escalar el tiempo o cuando no se puede controlar su entorno.

## 2. Simulación basada en agentes: qué es

### ¿En qué consiste un modelo de simulación basado en agentes y en qué se distingue de las ecuaciones globales?
En un conjunto de agentes que encapsulan el comportamiento de varios individuos, cada uno con reglas locales. Al ejecutar el modelo se reproduce el comportamiento global del sistema. Por eso no se escribe una ecuación del conjunto, a diferencia de la dinámica de sistemas.

### ¿Qué es un fenómeno emergente en una simulación basada en agentes?
Un patrón colectivo que no está programado en ninguna regla individual y aparece solo al interaccionar los agentes. Permite estudiar fenómenos sociales que los modelos agregados explican mal.

## 3. Modelo de segregación de Schelling

### ¿Cuál es la hipótesis del modelo de segregación de Schelling?
Que si un individuo tolera la diversidad pero no tolera ser minoría en su entorno local, la segregación aparece y se estabiliza.

### ¿Qué reglas siguen los agentes en el modelo de segregación?
Un agente es feliz y no se mueve si tiene suficientes agentes de su color en el vecindario. Si no los tiene, es infeliz y se cambia a una celda donde sería feliz. Al llegar, puede volver infeliz a un vecino que antes era feliz.

### ¿Qué resultado sorprendente muestra el modelo de Schelling?
Que preferencias leves por tener algunos vecinos parecidos, sin exigir mayoría, producen barrios homogéneos. Con una tolerancia del 30 % ya aparecen guetos.

## 7. Mesa: introducción y arquitectura

### ¿Qué es Mesa?
Un framework libre y de código abierto en Python para crear modelos basados en agentes, en la misma línea que NetLogo. Se integra con Jupyter y Pandas.

### ¿Cuáles son los tres componentes principales de Mesa desde la perspectiva del usuario?
El modelo (Model, Agent, AgentSet y el espacio), el análisis (DataCollector y BatchRunner) y la visualización (SolaraViz, basada en Solara).

## 8. Mesa: modelo

### ¿Qué define la clase Model de Mesa?
El estado global del modelo, el método `step` y las colecciones de agentes. Incluye el estado inicial, qué ocurre en cada paso para el entorno y el espacio que habitan los agentes.

### ¿Qué hace la clase Agent de Mesa?
Define a los agentes, las entidades individuales que actúan en el modelo. Cada agente pertenece a un modelo, tiene identidad única e incorpora su propia lógica de decisión.
