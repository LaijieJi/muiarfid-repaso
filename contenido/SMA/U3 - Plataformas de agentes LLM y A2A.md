# SMA U3 - Plataformas de agentes LLM y A2A

## 1. Agentes LLM y sistemas multiagente

### ¿Qué aporta una plataforma de agentes LLM frente a llamar a un LLM directamente?
Da la estructura y las herramientas para construir, orquestar y desplegar agentes autónomos basados en un LLM. Un LLM tradicional solo responde a prompts, mientras que un agente tiene agencia.

### ¿Qué papel tiene el LLM dentro de un agente LLM?
Es su cerebro cognitivo. Percibe el entorno, decide de forma autónoma y ejecuta acciones para alcanzar objetivos concretos.

### ¿Cómo es el ciclo «Razonar y Actuar» de un agente?
Es un bucle iterativo en tres fases. El LLM razona (Thought) y genera un plan, ejecuta una acción con una herramienta (Action) y observa su resultado (Observation), que incorpora al contexto antes de repetir el ciclo.

### ¿Qué cinco componentes fundamentales tiene un agente LLM?
| Componente | Qué hace |
|---|---|
| Razonamiento y planificación | Descompone problemas en pasos y evalúa caminos antes de actuar |
| Acción y uso de herramientas | Llama a APIs, ejecuta scripts o modifica bases de datos |
| Memoria | Retiene contexto a corto y a largo plazo |
| Percepción | Capta texto, imágenes o datos estructurados |
| Aprendizaje y reflexión | Evalúa su propio trabajo y mejora con el feedback |

### ¿Dónde reside la inteligencia en un MAS de agentes LLM?
No en un único agente, sino en la interacción estructurada de un colectivo especializado. Surge de la orquestación y la colaboración.

## 11. A2A: concepto y motivación

### ¿Qué es el protocolo A2A?
El protocolo Agent2Agent, un estándar abierto para que agentes de IA se comuniquen y colaboren de forma fluida. Lo creó Google y lo gestiona la Linux Foundation. Funciona como un lenguaje universal entre herramientas hechas con frameworks distintos.

### ¿Qué tres ventajas da el protocolo A2A?
Interoperabilidad entre agentes de plataformas distintas, flujos de trabajo complejos con coordinación y delegación, y seguridad, porque los agentes interactúan sin compartir su lógica interna ni información propietaria.

### ¿Qué relación hay entre A2A y MCP?
Son estándares complementarios. A2A es la comunicación entre agentes, el «internet público» que les permite interoperar y compartir hallazgos. MCP es la comunicación entre un agente y sus herramientas o APIs.

### ¿Cuándo conviene un subagente local y cuándo un agente remoto por A2A?
| | Subagente local | Agente remoto (A2A) |
|---|---|---|
| Qué es | Un módulo de la misma aplicación, con memoria directa y alto rendimiento | Un servicio separado que se comunica por red |
| Cuándo conviene | Organización del código, operaciones internas de alta frecuencia y baja latencia, memoria compartida | Servicio independiente, mantenido por otro equipo u organización, en otro lenguaje o con un contrato formal de API |

## 12. A2A: flujo de trabajo y transporte

### ¿Cómo descubre un agente a otro en A2A?
Cada agente expone su identidad y sus capacidades en un endpoint estandarizado, `/.well-known/agent-card.json`. Ese documento es la tarjeta de agente.
