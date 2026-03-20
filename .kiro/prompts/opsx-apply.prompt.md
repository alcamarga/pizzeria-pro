---
description: Implementar tareas de un cambio OpenSpec (Experimental)
---

Implementar las tareas de un cambio OpenSpec.

**Entrada**: Opcionalmente especifica un nombre de cambio (ej. `/opsx:apply agregar-auth`). Si se omite, intenta inferirlo del contexto de la conversación. Si es ambiguo, DEBES solicitar los cambios disponibles.

**Pasos**

1. **Seleccionar el cambio**

   Si se proporciona un nombre, úsalo. De lo contrario:
   - Infiere del contexto de la conversación si el usuario mencionó un cambio
   - Selecciona automáticamente si solo existe un cambio activo
   - Si es ambiguo, ejecuta `openspec list --json` y usa la herramienta **AskUserQuestion** para que el usuario seleccione

   Siempre anuncia: "Usando cambio: <nombre>" e indica cómo sobreescribir (ej. `/opsx:apply <otro>`).

2. **Verificar estado para entender el esquema**
   ```bash
   openspec status --change "<nombre>" --json
   ```
   Analiza el JSON para entender:
   - `schemaName`: El flujo de trabajo en uso (ej. "spec-driven")
   - Qué artefacto contiene las tareas (típicamente "tasks" para spec-driven)

3. **Obtener instrucciones de aplicación**

   ```bash
   openspec instructions apply --change "<nombre>" --json
   ```

   Retorna:
   - Rutas de archivos de contexto (varía según el esquema)
   - Progreso (total, completadas, restantes)
   - Lista de tareas con estado
   - Instrucción dinámica según el estado actual

   **Manejo de estados:**
   - Si `state: "blocked"` (artefactos faltantes): muestra mensaje, sugiere usar `/opsx:continue`
   - Si `state: "all_done"`: felicita, sugiere archivar
   - De lo contrario: procede a la implementación

4. **Leer archivos de contexto**

   Lee los archivos listados en `contextFiles` de la salida de instrucciones.
   Los archivos dependen del esquema:
   - **spec-driven**: propuesta, specs, diseño, tareas
   - Otros esquemas: sigue los `contextFiles` de la salida del CLI

5. **Mostrar progreso actual**

   Muestra:
   - Esquema en uso
   - Progreso: "N/M tareas completadas"
   - Resumen de tareas restantes
   - Instrucción dinámica del CLI

6. **Implementar tareas (bucle hasta completar o bloquearse)**

   Para cada tarea pendiente:
   - Muestra en qué tarea se está trabajando
   - Realiza los cambios de código necesarios
   - Mantén los cambios mínimos y enfocados
   - Marca la tarea como completada: `- [ ]` → `- [x]`
   - Continúa con la siguiente tarea

   **Pausa si:**
   - La tarea no es clara → pide aclaración
   - La implementación revela un problema de diseño → sugiere actualizar artefactos
   - Se encuentra un error o bloqueo → reporta y espera orientación
   - El usuario interrumpe

7. **Al completar o pausar, muestra el estado**

   Muestra:
   - Tareas completadas en esta sesión
   - Progreso general: "N/M tareas completadas"
   - Si todo está listo: sugiere archivar
   - Si está pausado: explica por qué y espera orientación

**Salida Durante la Implementación**

```
## Implementando: <nombre-cambio> (esquema: <nombre-esquema>)

Trabajando en tarea 3/7: <descripción de la tarea>
[...implementación en curso...]
✓ Tarea completada

Trabajando en tarea 4/7: <descripción de la tarea>
[...implementación en curso...]
✓ Tarea completada
```

**Salida al Completar**

```
## Implementación Completa

**Cambio:** <nombre-cambio>
**Esquema:** <nombre-esquema>
**Progreso:** 7/7 tareas completadas ✓

### Completadas en Esta Sesión
- [x] Tarea 1
- [x] Tarea 2
...

¡Todas las tareas completadas! Puedes archivar este cambio con `/opsx:archive`.
```

**Salida al Pausar (Problema Encontrado)**

```
## Implementación Pausada

**Cambio:** <nombre-cambio>
**Esquema:** <nombre-esquema>
**Progreso:** 4/7 tareas completadas

### Problema Encontrado
<descripción del problema>

**Opciones:**
1. <opción 1>
2. <opción 2>
3. Otro enfoque

¿Qué deseas hacer?
```

**Restricciones**
- Continúa con las tareas hasta completarlas o bloquearte
- Siempre lee los archivos de contexto antes de comenzar
- Si una tarea es ambigua, pausa y pregunta antes de implementar
- Si la implementación revela problemas, pausa y sugiere actualizar artefactos
- Mantén los cambios de código mínimos y acotados a cada tarea
- Actualiza el checkbox de la tarea inmediatamente después de completarla
- Pausa ante errores, bloqueos o requisitos poco claros — no adivines
- Usa `contextFiles` de la salida del CLI, no asumas nombres de archivos específicos

**Integración de Flujo de Trabajo Fluido**

Esta habilidad soporta el modelo de "acciones sobre un cambio":

- **Puede invocarse en cualquier momento**: Antes de que todos los artefactos estén listos, después de implementación parcial, intercalado con otras acciones
- **Permite actualizaciones de artefactos**: Si la implementación revela problemas de diseño, sugiere actualizar artefactos — no está bloqueado por fases, trabaja de forma fluida
