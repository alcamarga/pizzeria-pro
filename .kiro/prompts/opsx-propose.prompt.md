---
description: Proponer un nuevo cambio — crear todos los artefactos en un solo paso
---

Proponer un nuevo cambio — crear el cambio y generar todos los artefactos en un solo paso.

Crearé un cambio con los siguientes artefactos:
- proposal.md (qué y por qué)
- design.md (cómo)
- tasks.md (pasos de implementación)

Cuando estés listo para implementar, ejecuta /opsx:apply

---

**Entrada**: El argumento después de `/opsx:propose` es el nombre del cambio (kebab-case), O una descripción de lo que el usuario quiere construir.

**Pasos**

1. **Si no se proporciona entrada clara, preguntar qué quieren construir**

   Usa la herramienta **AskUserQuestion** (abierta, sin opciones predefinidas) para preguntar:
   > "¿Qué cambio quieres trabajar? Describe qué quieres construir o corregir."

   De su descripción, deriva un nombre en kebab-case (ej. "agregar autenticación de usuario" → `agregar-auth-usuario`).

   **IMPORTANTE**: NO procedas sin entender qué quiere construir el usuario.

2. **Crear el directorio del cambio**
   ```bash
   openspec new change "<nombre>"
   ```
   Esto crea un cambio estructurado en `openspec/changes/<nombre>/` con `.openspec.yaml`.

3. **Obtener el orden de construcción de artefactos**
   ```bash
   openspec status --change "<nombre>" --json
   ```
   Analiza el JSON para obtener:
   - `applyRequires`: arreglo de IDs de artefactos necesarios antes de implementar
   - `artifacts`: lista de todos los artefactos con su estado y dependencias

4. **Crear artefactos en secuencia hasta estar listo para aplicar**

   Usa la herramienta **TodoWrite** para rastrear el progreso.

   Itera por los artefactos en orden de dependencias:

   a. **Para cada artefacto en estado `ready`**:
      - Obtén instrucciones:
        ```bash
        openspec instructions <id-artefacto> --change "<nombre>" --json
        ```
      - El JSON de instrucciones incluye:
        - `context`: Contexto del proyecto (restricciones para ti — NO incluir en la salida)
        - `rules`: Reglas específicas del artefacto (restricciones para ti — NO incluir en la salida)
        - `template`: La estructura a usar para el archivo de salida
        - `instruction`: Guía específica del esquema para este tipo de artefacto
        - `outputPath`: Dónde escribir el artefacto
        - `dependencies`: Artefactos completados para leer como contexto
      - Lee los archivos de dependencias completados para contexto
      - Crea el archivo del artefacto usando `template` como estructura
      - Aplica `context` y `rules` como restricciones — pero NO los copies en el archivo
      - Muestra progreso breve: "Creado <id-artefacto>"

   b. **Continúa hasta que todos los artefactos en `applyRequires` estén completos**

   c. **Si un artefacto requiere entrada del usuario** (contexto poco claro):
      - Usa la herramienta **AskUserQuestion** para aclarar
      - Luego continúa con la creación

5. **Mostrar estado final**
   ```bash
   openspec status --change "<nombre>"
   ```

**Salida**

Después de completar todos los artefactos, resume:
- Nombre del cambio y ubicación
- Lista de artefactos creados con descripciones breves
- Estado: "¡Todos los artefactos creados! Listo para implementar."
- Indicación: "Ejecuta `/opsx:apply` para comenzar la implementación."

**Pautas de Creación de Artefactos**

- Sigue el campo `instruction` de `openspec instructions` para cada tipo de artefacto
- El esquema define qué debe contener cada artefacto — síguelo
- Lee los artefactos de dependencia antes de crear nuevos
- Usa `template` como estructura para el archivo de salida — completa sus secciones
- **IMPORTANTE**: `context` y `rules` son restricciones PARA TI, no contenido para el archivo

**Restricciones**
- Crea TODOS los artefactos necesarios para la implementación
- Siempre lee los artefactos de dependencia antes de crear uno nuevo
- Si el contexto no está claro, pregunta al usuario — pero prefiere tomar decisiones razonables para mantener el impulso
- Si ya existe un cambio con ese nombre, pregunta si el usuario quiere continuarlo o crear uno nuevo
- Verifica que cada archivo de artefacto existe después de escribirlo antes de proceder al siguiente
