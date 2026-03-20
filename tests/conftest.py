## Creado por: Camilo Martinez
## Fecha: 20/03/2026
## Version: 1.0
"""Configuración de pytest para el proyecto Pizzería Pro.

Agrega la carpeta backend/ al path de Python para que los tests
puedan importar los modelos desde su nueva ubicación.
"""

import sys
import os

# Agregar la carpeta backend al path para importar models
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
