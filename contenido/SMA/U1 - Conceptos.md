# SMA U1 - Conceptos

## 1. Orígenes y tendencias

### ¿Qué problema dio lugar a la programación estructurada y al término «ingeniería del software»?
La crisis del software de finales de los años 60: los proyectos crecían más deprisa que la capacidad de construirlos bien.

### ¿Qué lenguaje introdujo la orientación a objetos y quién lo creó?
Simula 67, de Dahl y Nygaard, en Oslo.

### ¿Qué estructura de representación del conocimiento propuso Minsky en 1974?
Los frames (marcos).

### ¿Qué año se adoptó TCP/IP?
1983.

### ¿Quién creó la World Wide Web y dónde?
Tim Berners-Lee, con Robert Cailliau, en el CERN, a partir de una propuesta de 1989.

### ¿Cuáles son las cinco tendencias de la historia de la informática que llevan a los agentes?
Ubicuidad, interconexión, inteligencia, delegación y orientación humana.

### ¿Qué significa la tendencia de la delegación?
Que se cede cada vez más control y decisión a los ordenadores, incluso en tareas críticas.

### ¿Cómo define el tema la inteligencia de un sistema?
Por la complejidad de las tareas que somos capaces de delegar en los ordenadores.

### ¿Qué significa ver la computación como interacción?
Que el software ya no es un cálculo aislado que va de una entrada a una salida, sino entidades que se comunican y colaboran entre sí.

### ¿Cuál es la evolución de las abstracciones de programación que termina en los agentes?
Código máquina, ensamblador, lenguajes independientes de la máquina, subrutinas, procedimientos y funciones, tipos abstractos de datos, objetos y, por último, agentes.

### ¿Qué añade un agente respecto a un objeto?
Autonomía para decidir qué hace y capacidad social para interactuar con otros agentes. Un objeto ejecuta el método que le invocan.

### ¿Cómo definió Bill Gates un agente en noviembre de 2023?
Como un software que responde a lenguaje natural y realiza muchas tareas distintas a partir de lo que sabe del usuario.

## 2. Tecnologías del Acuerdo

### ¿Qué idea ordena las Tecnologías del Acuerdo?
Que la computación como interacción se estructura alrededor de los acuerdos entre entidades computacionales.

### ¿Qué cinco elementos componen un acuerdo entre agentes?
Un conjunto de agentes, una ontología común, métodos y protocolos para alcanzar el acuerdo, un contrato y un supervisor del contrato, que vela por las normas.

### ¿Para qué sirve la ontología en un acuerdo entre agentes?
Para que los términos signifiquen lo mismo para todas las partes.

### ¿Puede una entidad autónoma incumplir un acuerdo?
Sí, precisamente por ser autónoma. Aun así, debería cumplirlo cuando es una obligación derivada de lo acordado.

### ¿Qué relación deben tener los acuerdos con el contexto normativo?
Deben ser consistentes con el contexto normativo en el que se establecen.

### ¿Qué cuatro características cubre el paradigma de las Tecnologías del Acuerdo?
Autonomía, interacción, movilidad y apertura.

### ¿Qué papel tienen las normas en las Tecnologías del Acuerdo?
Regulan las organizaciones y fijan las restricciones que deben cumplir los acuerdos.

### ¿Qué papel tienen la negociación y la argumentación en las Tecnologías del Acuerdo?
Son el proceso por el que los agentes llegan a un acuerdo.

### En el caso de estudio del plan de viaje, ¿qué es una organización virtual?
Un grupo de proveedores del mismo servicio, como aerolíneas, hoteles o empresas de alquiler de coches, que actúa como una organización.

### En el caso de estudio del plan de viaje, ¿qué se hace con el objetivo «quiero un plan de viaje»?
Se descompone en subobjetivos (un tren, un hotel, un coche) que se reparten entre las organizaciones.

### ¿Por qué delegar obliga a gestionar la confianza y la reputación?
Porque no todo agente que acepta una tarea la cumple. Hay que elegir en quién delegar, y para eso hace falta saber de quién fiarse, lo que a su vez exige normas y protocolos de negociación.

## 3. El escenario de Juan y Carmen

### En el escenario de Juan y Carmen, ¿qué concepto ilustra que los asistentes acuerden día y lugar de la reunión?
La negociación entre agentes que representan a usuarios con objetivos distintos.

### En el escenario de Juan y Carmen, ¿qué concepto ilustra que el asistente proponga tren y hotel y pida confirmación?
La proactividad: el agente toma la iniciativa, aunque el usuario aprueba antes de comprometerse.

### En el escenario de Juan y Carmen, ¿qué hace el asistente que ilustra la percepción y el aprendizaje?
Monitoriza la conversación, reconoce patrones y deduce los objetivos del usuario a partir de la experiencia pasada.

### ¿Qué tres mecanismos necesita un agente que depende de otros agentes?
Negociación, delegación y coordinación.

### En el escenario de Juan y Carmen, ¿qué es una cadena de delegación?
El asistente delega la compra en un agente de viajes, y este habla a su vez con el agente de reservas de la compañía de tren y con el del hotel.

### ¿Qué diferencia hay entre las páginas blancas y las páginas amarillas en un SMA?
Son servicios para localizar agentes. Las páginas blancas buscan un agente por su nombre y las amarillas, por el servicio que ofrece.

## 4. Diseño, objeciones y aplicaciones

### ¿Qué diferencia hay entre el nivel micro y el nivel macro del diseño de SMA?
El micro trata de construir agentes que actúan de forma autónoma. El macro, o diseño de sociedades, trata de construir agentes que cooperan, se coordinan y negocian sin poder asumir que comparten intereses.

### ¿Qué separa un SMA de un sistema distribuido convencional?
Que en un SMA no se puede asumir que los componentes comparten intereses: cada agente es autónomo.

### ¿Cuáles son las dos vistas del área de los SMA?
Los agentes como paradigma de ingeniería del software, en el que la interacción es la característica clave del software complejo, y como herramienta para entender sociedades humanas mediante simulación.

### ¿Qué objeciones a los SMA recoge Wooldridge?
Si no son simplemente sistemas distribuidos o concurrentes, si no son simplemente IA, si no son teoría económica o de juegos y si no son ciencias sociales.

### ¿Qué es FIPA?
El organismo de estándares de los agentes. La IEEE lo aceptó como comité de estándares el 8 de junio de 2005.

### ¿Qué ejemplo de agente autónomo de la NASA cita el tema?
La sonda Deep Space 1.

### Cita cinco campos de aplicación de los SMA.
Servicios de información en Internet, comercio electrónico, fabricación flexible e Industria 4.0, gestión de redes de telecomunicaciones, gestión de procesos (workflow), simulación, juegos y robótica.
