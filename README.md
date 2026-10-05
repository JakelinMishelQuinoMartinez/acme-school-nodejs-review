# ACME School – App de consola

Aplicación de consola hecha con **Node.js** y **MySQL** para administrar una escuela: estudiantes, profesores, cursos, horarios, inscripciones y más. Incluye reportes en **HTML**.

## Diagrama de la base de datos

![Diagrama de base de datos ACME School](docs/diagrama.png)

## Tecnologías

| Librería | Para qué se usa |
|----------|-----------------|
| `mysql2` | Conectarse a MySQL |
| `dotenv` | Leer la configuración del archivo `.env` |
| `inquirer` | Menús y preguntas interactivas |
| `chalk` | Colores en la consola |

## Requisitos

- Node.js 18 o superior
- MySQL 8 en ejecución

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos con datos de ejemplo
mysql -u root -p < database/schema.sql

# 3. Configurar variables de entorno
cp .env.example .env      # en Windows: copy .env.example .env
# edita .env con tu usuario y contraseña de MySQL

# 4. Ejecutar
npm start
```

## Uso

**Menú principal** → una opción por entidad (Tipos de identificación, Ciudades, Estudiantes, Profesores, Aulas, Cursos, Temas, Horarios, Inscripciones, Notas) + **Reportes HTML**.

Cada entidad abre un **submenú CRUD**: Listar, Crear, Editar y Eliminar.

**Reportes HTML** (se guardan en la carpeta `reports/`):

1. Lista de estudiantes
2. Lista de profesores
3. Horarios por curso
4. Estudiantes por curso
5. Temas de un curso (te pide escoger el curso)

Abre el archivo generado con tu navegador.

## Estructura del proyecto

```
acme-school/
├── database/schema.sql          # Tablas + datos de ejemplo
├── docs/diagrama.png            # Diagrama de la BD
├── src/
│   ├── index.js                 # Punto de entrada: arma las piezas
│   ├── config/database.js       # Conexión (pool) a MySQL
│   ├── models/entities.js       # Una clase por tabla
│   ├── factories/EntityFactory.js
│   ├── repositories/
│   │   ├── BaseRepository.js        # CRUD genérico
│   │   ├── SpecialRepositories.js   # Horarios e Inscripciones (con JOIN)
│   │   ├── RepositoryFactory.js     # Crea todos los repositorios
│   │   └── ReportRepository.js      # Consultas para reportes
│   ├── services/
│   │   ├── ReportService.js         # Prepara los datos de cada reporte
│   │   └── HtmlReportGenerator.js   # Escribe el archivo HTML
│   └── menus/
│       ├── MainMenu.js
│       ├── CrudMenu.js              # Menú CRUD reutilizable
│       └── ReportMenu.js
└── package.json                 # "type": "module" (usa import/export)
```

## Patrones y principios aplicados

**Factory**
- `EntityFactory` crea el objeto correcto (`Student`, `City`...) según la tabla.
- `RepositoryFactory` crea el repositorio de cada tabla.

**Repository**: `BaseRepository` es el único que habla con MySQL para el CRUD (`findAll`, `create`, `update`, `delete`).

**SOLID**

| Principio | Dónde se ve |
|-----------|-------------|
| **S** – Responsabilidad única | Cada clase hace una cosa: las entidades guardan datos, los repositorios consultan, `HtmlReportGenerator` solo escribe HTML, los menús solo interactúan con el usuario. |
| **O** – Abierto/Cerrado | Para agregar una tabla nueva basta crear su clase en `entities.js` y añadirla a `entityClasses`; el menú y el CRUD se generan solos. |
| **L** – Sustitución de Liskov | `CourseScheduleRepository` e `InscriptionRepository` extienden `BaseRepository` y pueden usarse en su lugar sin romper nada. |
| **I** – Segregación de interfaces | Los reportes usan `ReportRepository` (solo lectura), separado del CRUD. |
| **D** – Inversión de dependencias | El `pool`, los repositorios y servicios se **reciben por el constructor** en lugar de crearse dentro de cada clase (ver `index.js`). |

## Cómo agregar una nueva entidad

1. Crea la tabla en MySQL.
2. En `src/models/entities.js` crea la clase con `table`, `title` y `fields`.
3. Añádela a la lista `entityClasses`.
4. ¡Listo! Aparece en el menú principal con su CRUD.
