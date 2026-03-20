---
name: openspec-apply-change
description: Implementar tareas de un cambio OpenSpec. Usar cuando el usuario quiere comenzar a implementar, continuar la implementación o trabajar a través de las tareas.
license: MIT
compatibility: Requiere CLI de openspec.
metadata:
  author: Camilo Martinez
  version: "2.0"
  language: es-ES
  stack: Angular 19 / Python 3.14
---

Implementar las tareas de un cambio OpenSpec siguiendo los estándares de Camilo Martinez:
- Tipado fuerte obligatorio (Python type hints + TypeScript strict)
- Código y comentarios en español
- Nombres de archivos en inglés
- Arquitectura limpia y desacoplada

**Entrada**: Opcionalmente especifica un nombre de cambio. Si se omite, infiere del contexto. Si es ambiguo, DEBES solicitar los cambios disponibles.

**Pasos**

1. **Seleccionar el cambio**

   Si se proporciona un nombre, úsalo. De lo contrario:
   - Infiere del contexto de la conversación
   - Selecciona automáticamente si solo existe un cambio activo
   - Si es ambiguo, ejecuta `openspec list --json` y usa **AskUserQuestion** para que el usuario seleccione

   Anuncia siempre: "Usando cambio: <nombre>"

2. **Verificar estado del esquema**
   ```bash
   openspec status --change "<nombre>" --json
   ```

3. **Obtener instrucciones de aplicación**
   ```bash
   openspec instructions apply --change "<nombre>" --json
   ```

   **Manejo de estados:**
   - `state: "blocked"`: muestra mensaje, sugiere usar openspec-continue-change
   - `state: "all_done"`: felicita, sugiere archivar
   - De lo contrario: procede a la implementación

4. **Leer archivos de contexto**

   Lee los archivos listados en `contextFiles` de la salida de instrucciones.

5. **Mostrar progreso actual**

   - Esquema en uso
   - Progreso: "N/M tareas completadas"
   - Resumen de tareas restantes

6. **Implementar tareas (bucle hasta completar o bloquearse)**

   Para cada tarea pendiente:
   - Muestra en qué tarea se trabaja
   - Realiza los cambios de código necesarios con tipado fuerte
   - Mantén los cambios mínimos y enfocados
   - Marca la tarea como completada: `- [ ]` → `- [x]`
   - Continúa con la siguiente tarea

   **Pausa si:**
   - La tarea no es clara → pide aclaración
   - La implementación revela un problema de diseño → sugiere actualizar artefactos
   - Se encuentra un error o bloqueo → reporta y espera orientación

7. **Al completar o pausar, muestra el estado**

**Salida Durante la Implementación**

```
## Implementando: <nombre-cambio> (esquema: <nombre-esquema>)

Trabajando en tarea 3/7: <descripción>
[...implementación en curso...]
✓ Tarea completada
```

**Salida al Completar**

```
## Implementación Completa

**Cambio:** <nombre-cambio>
**Esquema:** <nombre-esquema>
**Progreso:** 7/7 tareas completadas ✓

¡Todas las tareas completadas! Puedes archivar con `/opsx:archive`.
```

**Salida al Pausar**

```
## Implementación Pausada

**Cambio:** <nombre-cambio>
**Progreso:** 4/7 tareas completadas

### Problema Encontrado
<descripción del problema>

¿Qué deseas hacer?
```

**Restricciones**
- Continúa con las tareas hasta completarlas o bloquearte
- Siempre lee los archivos de contexto antes de comenzar
- Si una tarea es ambigua, pausa y pregunta antes de implementar
- Mantén los cambios de código mínimos y acotados a cada tarea
- Actualiza el checkbox inmediatamente después de completar cada tarea
- Pausa ante errores o requisitos poco claros — no adivines
