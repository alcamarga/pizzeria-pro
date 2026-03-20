---
name: openspec-propose
description: Proponer un nuevo cambio con todos los artefactos generados en un solo paso. Usar cuando el usuario quiere describir rápidamente qué quiere construir y obtener una propuesta completa con diseño, specs y tareas lista para implementar.
license: MIT
compatibility: Requiere CLI de openspec.
metadata:
  author: Camilo Martinez
  version: "2.0"
  language: es-ES
  stack: Angular 19 / Python 3.14
---

Proponer un nuevo cambio — crear el cambio y generar todos los artefactos en un solo paso.

Crearé un cambio con los siguientes artefactos:
- proposal.md (qué y por qué)
- design.md (cómo — con tipado fuerte, Angular 19 / Python 3.14)
- tasks.md (pasos de implementación)

Cuando estés listo para implementar, ejecuta /opsx:apply

---

**Entrada**: Nombre del cambio en kebab-case O descripción de lo que el usuario quiere construir.

**Pasos**

1. **Si no hay entrada clara, preguntar**

   Usa **AskUserQuestion**:
   > "¿Qué cambio quieres trabajar? Describe qué quieres construir o corregir."

   Deriva un nombre kebab-case de su descripción.

2. **Crear el directorio del cambio**
   ```bash
   openspec new change "<nombre>"
   ```

3. **Obtener orden de construcción de artefactos**
   ```bash
   openspec status --change "<nombre>" --json
   ```

4. **Crear artefactos en secuencia**

   Para cada artefacto en estado `ready`:
   ```bash
   openspec instructions <id-artefacto> --change "<nombre>" --json
   ```
   - Usa `template` como estructura del archivo de salida
   - Aplica `context` y `rules` como restricciones — NO los copies en el archivo
   - Código en español, nombres de archivos en inglés, tipado fuerte

5. **Mostrar estado final**
   ```bash
   openspec status --change "<nombre>"
   ```

**Salida**

```
## Propuesta Creada: <nombre-cambio>

Artefactos generados:
- proposal.md: <descripción breve>
- design.md: <descripción breve>
- tasks.md: <N tareas definidas>

¡Listo para implementar! Ejecuta `/opsx:apply` para comenzar.
```

**Restricciones**
- Crea TODOS los artefactos necesarios para la implementación
- Siempre lee artefactos de dependencia antes de crear nuevos
- Si el contexto no está claro, pregunta — pero prefiere decisiones razonables
- Verifica que cada archivo existe después de escribirlo
