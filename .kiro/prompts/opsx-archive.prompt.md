---
description: Archivar un cambio completado en el flujo de trabajo experimental
---

Archivar un cambio completado en el flujo de trabajo experimental.

**Entrada**: Opcionalmente especifica un nombre de cambio después de `/opsx:archive` (ej. `/opsx:archive agregar-auth`). Si se omite, intenta inferirlo del contexto. Si es ambiguo, DEBES solicitar los cambios disponibles.

**Pasos**

1. **Si no se proporciona nombre, solicitar selección**

   Ejecuta `openspec list --json` para obtener los cambios disponibles. Usa la herramienta **AskUserQuestion** para que el usuario seleccione.

   Muestra solo los cambios activos (no archivados).
   Incluye el esquema usado para cada cambio si está disponible.

   **IMPORTANTE**: NO adivines ni selecciones automáticamente. Siempre deja que el usuario elija.

2. **Verificar estado de completitud de artefactos**

   Ejecuta `openspec status --change "<nombre>" --json` para verificar la completitud.

   Analiza el JSON para entender:
   - `schemaName`: El flujo de trabajo en uso
   - `artifacts`: Lista de artefactos con su estado (`done` u otro)

   **Si algún artefacto no está en `done`:**
   - Muestra advertencia listando los artefactos incompletos
   - Solicita confirmación al usuario para continuar
   - Procede si el usuario confirma

3. **Verificar estado de completitud de tareas**

   Lee el archivo de tareas (típicamente `tasks.md`) para verificar tareas incompletas.

   Cuenta las tareas marcadas con `- [ ]` (incompletas) vs `- [x]` (completas).

   **Si hay tareas incompletas:**
   - Muestra advertencia con el conteo de tareas incompletas
   - Solicita confirmación al usuario para continuar
   - Procede si el usuario confirma

   **Si no existe archivo de tareas:** Procede sin advertencia relacionada.

4. **Evaluar estado de sincronización de specs delta**

   Verifica specs delta en `openspec/changes/<nombre>/specs/`. Si no existen, procede sin solicitud de sincronización.

   **Si existen specs delta:**
   - Compara cada spec delta con su spec principal en `openspec/specs/<capacidad>/spec.md`
   - Determina qué cambios se aplicarían (adiciones, modificaciones, eliminaciones, renombrados)
   - Muestra un resumen combinado antes de solicitar confirmación

   **Opciones de confirmación:**
   - Si se necesitan cambios: "Sincronizar ahora (recomendado)", "Archivar sin sincronizar"
   - Si ya está sincronizado: "Archivar ahora", "Sincronizar de todas formas", "Cancelar"

5. **Realizar el archivo**

   Crea el directorio de archivo si no existe:
   ```bash
   mkdir -p openspec/changes/archive
   ```

   Genera el nombre destino usando la fecha actual: `YYYY-MM-DD-<nombre-cambio>`

   **Verifica si el destino ya existe:**
   - Si existe: Falla con error, sugiere renombrar el archivo existente o usar otra fecha
   - Si no existe: Mueve el directorio del cambio al archivo

   ```bash
   mv openspec/changes/<nombre> openspec/changes/archive/YYYY-MM-DD-<nombre>
   ```

6. **Mostrar resumen**

   Muestra el resumen de completitud del archivo incluyendo:
   - Nombre del cambio
   - Esquema utilizado
   - Ubicación del archivo
   - Estado de sincronización de specs (si aplica)
   - Nota sobre advertencias (artefactos/tareas incompletas)

**Salida Exitosa**

```
## Archivo Completado

**Cambio:** <nombre-cambio>
**Esquema:** <nombre-esquema>
**Archivado en:** openspec/changes/archive/YYYY-MM-DD-<nombre>/
**Specs:** ✓ Sincronizadas con specs principales

Todos los artefactos completos. Todas las tareas completas.
```

**Restricciones**
- Siempre solicita selección de cambio si no se proporciona
- Usa el grafo de artefactos (openspec status --json) para verificar completitud
- No bloquees el archivo por advertencias — solo informa y confirma
- Preserva .openspec.yaml al mover al archivo (se mueve con el directorio)
- Muestra un resumen claro de lo que ocurrió
