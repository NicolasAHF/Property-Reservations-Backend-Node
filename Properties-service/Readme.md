# Proyecto Node.js con Sequelize

Este proyecto es una aplicación Node.js que utiliza Sequelize para la gestión de una base de datos SQL. Incluye un CRUD API para una entidad "Cliente".

## Estructura de Directorios

```bash
project-root/
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   └── clienteController.ts
│   │
│   ├── models/
│   │   └── clienteModel.ts
│   │
│   ├── routes/
│   │   └── clienteRoutes.ts
│   │
│   ├── services/
│   │   └── clienteService.ts
│   ├── .env
│   │ 
│   └── app.ts 
│
├ 
├── tsconfig.json
└── package.json

```
## Configuración del entorno

Primero, asegúrate de tener Node.js instalado en tu sistema. Luego, sigue los siguientes pasos para configurar el proyecto.

### Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar las dependencias necesarias:




# Configuración Inicial
## Inicializar el proyecto y las dependencias:

En tu terminal, navega a la carpeta del proyecto y ejecuta:

```bash
npm install

```
Este comando instalará todas las dependencias definidas en package.json, incluyendo Express y Sequelize.

# Configurando el .env

```bash
DB_NAME='nombreDeLaBaseDeDatos'
DB_USER='usuario'
DB_PASS='passwd'
DB_HOST='localhost'
DB_DIALECT='mysql'
DB_SYNC=true     

```


# Endpoints de la API
La API soporta las siguientes operaciones CRUD para la entidad "Cliente":
```bash
GET /api/clientes: Retorna todos los clientes.
GET /api/clientes/:id: Retorna un cliente específico por ID.
POST /api/clientes: Crea un nuevo cliente.
PUT /api/clientes/:id: Actualiza un cliente existente por ID.
DELETE /api/clientes/:id: Elimina un cliente por ID.

Ten en cuenta que el JSON del cliente sería por ejemplo:

{
    "id": 1,
    "nombre": "juan",
    "rut": "12311",
    "direccion": "xxxx"
}
```


# Si no tienes istalado el node ni el ts
## inicializa el proyecto 

```bash
npm init -y
npm install express sequelize mysql2 dotenv
npm install @types/express @types/node typescript ts-node nodemon @types/sequelize -D

npm install --save-dev typescript
npx tsc --init 


```
### agrega en el tsconfig.json
```bash
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

# Para compilar
```bash
npx tsc
```
# Para ejecutar TypeScript sin compilar
```bash
npx npx ts-node app.ts
```


