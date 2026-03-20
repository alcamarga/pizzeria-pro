---
name: openspec-archive-change
description: Archivar un cambio completado en el flujo de trabajo experimental. Usar cuando el usuario quiere finalizar y archivar un cambio después de completar la implementación.
license: MIT
compatibility: Requiere CLI de openspec.
metadata:
  author: Camilo Martinez
  version: "2.0"
  language: es-ES
  stack: Angular 19 / Python 3.14
---

Archivar un cambio completado en el flujo de trabajo experimental.

**Entrada**: Opcionalmente especifica un nombre de cambio. Si se omite, infiere del contexto. Si es ambiguo, DEBES solicitar los cambios disponibles.

**Pasos**

1. **Si no se proporciona nombre, solicitar selección**

   Ejecuta `openspec list --json`. Usa **AskUserQuestion** para que el usuario seleccione.
   Muestra solo cambios activos (no archivados).

   **IMPORTANTE**: NO adivines ni selecciones automáticamente.

2. **Verificar completitud de artefactos**
   ```bash
   openspec status --change "<nombre>" --json
   ```
   Si algún artefacto no está en `done`: muestra advertencia y solicita confirmación.

3. **Verificar completitud de tareas**

   Lee el archivo de tareas. Cuenta `- [ ]` vs `- [x]`.
   Si hay tareas incompletas: muestra advertencia y solicita confirmación.

4. **Evaluar sincronización de specs delta**

   Verifica `openspec/changes/<nombre>/specs/`. Si no existen, procede sin solicitud.
   Si existen: compara con specs principales y muestra resumen antes de confirmar.

5. **Realizar el archivo**

   ```bash
   mkdir -p openspec/changes/archive
   mv openspec/changes/<nombre> openspec/changes/archive/YYYY-MM-DD-<nombre>
   ```

6. **Mostrar resumen**

**Salida Exitosa**

```
## Archivo Completado

**Cambio:** <nombre-cambio>
**Esquema:** <nombre-esquema>
**Archivado en:** openspec/changes/archive/YYYY-MM-DD-<nombre>/
**Specs:** ✓ Sincronizadas

Todos los artefactos completos. Todas las tareas completas.
```

**Restricciones**
- Siempre solicita selección si no se proporciona nombre
- No bloquees el archivo por advertencias — solo informa y confirma
- Preserva .openspec.yaml al mover al archivo
- Muestra resumen claro de lo ocurrido
