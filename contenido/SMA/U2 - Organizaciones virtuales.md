# SMA U2 - Organizaciones virtuales

## 2. Organización: concepto y sistemas abiertos

### ¿Cómo define Wooldridge una organización de agentes?
Como una colección de roles que mantienen ciertas relaciones entre sí y que participan en patrones de interacción con otros roles de forma institucionalizada y sistemática.

### ¿Qué es un sistema abierto?
Una organización formada por agentes software con intereses propios, desarrollados por diferentes desarrolladores. Esos agentes son heterogéneos y entran y salen de forma dinámica.

## 3. Estructura organizativa y topologías

### ¿Qué es una coalición?
Una agrupación temporal de agentes para conseguir un objetivo concreto, con el fin de obtener ciertos beneficios y reducir costes.

### ¿Qué es una federación y qué pierden sus miembros?
Una agrupación de agentes con un representante, con el que los miembros interactúan solamente. Los miembros ceden parte de su autonomía. El representante actúa también de intermediario entre el grupo y el mundo exterior.

### ¿Qué hace cada representante de una federación?
| Representante | Función |
|---|---|
| Broker | Distribuir tareas entre los miembros del grupo |
| Mediador | Facilitar interacciones entre agentes, estableciendo contactos |
| Monitor | Controlar los estados de los agentes e informar de eventos |
| Embassy | Controlar la comunicación de agentes externos con los de la federación, como traductor de ontologías |

### ¿Qué diferencia hay entre una coalición y una congregación?
La coalición es temporal y se forma para un objetivo concreto. La congregación es duradera y no tiene objetivo específico, ya que solo agrupa agentes parecidos o complementarios para encontrarse.

## 4. Computación por interacción

### ¿Cuándo se usa un protocolo de cooperación y cuándo uno de negociación?
La cooperación sirve cuando los agentes comparten objetivos comunes (son benevolentes). La negociación sirve cuando cada agente actúa guiado por sus objetivos individuales (self-interested).

## 5. Cooperación y redes de contratos

### ¿Cuáles son los cuatro pasos del protocolo Contract Net?
El manager anuncia las tareas por multidifusión, posiblemente selectiva. Los agentes evalúan el anuncio y algunos emiten ofertas. El manager concede el contrato al agente más apropiado. Después manager y contratado se comunican de forma privada tantas veces como haga falta.

### ¿Qué cambia el CNP con confirmación respecto al CNP básico?
En el CNP básico el participante se compromete en el momento de hacer su oferta, de modo que queda ocupado aunque no gane y el resultado puede ser subóptimo. En el CNP con confirmación el compromiso se retrasa para evitar esos subóptimos.

## 6. Ejemplo de la flota de taxis

### Problema: clasifica la topología de cada organización
Di qué topología de organización describe cada caso, justificando con una característica del tema.

1. Cinco taxistas independientes se unen esta tarde para cubrir un evento y se separan al terminar.
2. Una comisaría con jefe de zona, jefes de brigada y agentes de calle. Las decisiones se toman arriba y los agentes de calle solo ejecutan, sin subestructuras propias.
3. Un colegio permanente de fisioterapeutas que reúne profesionales parecidos para que los clientes encuentren al adecuado, sin un encargo concreto.
4. Una empresa en la que cada técnico responde a su jefe de proyecto y a su jefe de especialidad.
5. Un conjunto de tiendas estable que ha cedido parte de su autonomía. Las tiendas solo interactúan a través de una oficina común, que además controla la comunicación con comercios externos y traduce los catálogos de cada tienda.

#### Paso 1
El caso 1 es una coalición. Es temporal, tiene un objetivo concreto (cubrir el evento) y se disuelve al alcanzarlo.

#### Paso 2
El caso 2 es una jerarquía. Es un árbol en el que los niveles superiores toman las decisiones y controlan y los inferiores hacen la funcionalidad básica.

#### Paso 3
El caso 3 es una congregación. Agrupa agentes similares, a largo plazo y sin objetivo específico, para facilitar la búsqueda de colaboradores.

#### Paso 4
El caso 4 es una organización matricial. Cada técnico tiene dos supervisores y hace falta resolver los conflictos entre ellos.

#### Paso 5
El caso 5 es una federación con un representante que hace de embassy. Las tiendas solo interactúan con la oficina, que controla la comunicación con el exterior y traduce ontologías.
