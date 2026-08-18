# Puesta en marcha local — Branko CMS

## Estado previo

La landing pública vive en `Enzopinotti/Landing_Branko`.

El backend debe vivir en un segundo repositorio privado:

`Enzopinotti/Landing_Branko_CMS`

El paquete bootstrap preparado para ese repositorio contiene:

```text
Landing_Branko_CMS/
├── .claspignore
├── .editorconfig
├── .gitignore
├── README.md
├── package.json
├── docs/
│   ├── LOCAL_SETUP.md
│   └── SECURITY.md
├── scripts/
│   ├── init-clasp.mjs
│   └── verify-local.mjs
└── src/
    ├── appsscript.json
    ├── 00_Config.gs
    ├── 01_Utils.gs
    ├── 02_Schema.gs
    ├── 03_Db.gs
    ├── 04_Audit.gs
    ├── 05_Security.gs
    ├── 06_MediaService.gs
    ├── 07_ContentService.gs
    ├── 08_AdminService.gs
    ├── 09_AdminHttpBridge.gs
    ├── 10_Api.gs
    ├── 11_WebApp.gs
    ├── 98_Seed.gs
    └── 99_Setup.gs
```

## Requisitos

- Node.js 22 o superior.
- Git.
- npm.
- Google Apps Script API habilitada en la cuenta Google propietaria del CMS.

`@google/clasp` queda instalado como devDependency del repositorio; no dependemos de una instalación global.

## Creación del repositorio GitHub

Crear manualmente un repositorio privado:

- Nombre: `Landing_Branko_CMS`
- Descripción: `Backend CMS de la landing de Branko Iriart con Google Apps Script, Google Sheets, Google Drive y despliegue mediante clasp.`
- Visibilidad: Private
- No agregar plantilla de código.

La conexión de GitHub disponible en ChatGPT no expone creación de repositorios, por eso este es el único paso de GitHub que se realiza manualmente.

## Primer arranque local

Dentro del repo CMS:

```bash
npm install
npm run verify
npm run cms:login
npm run cms:whoami
npm run cms:init
npm run cms:open
```

`cms:init`:

1. crea el proyecto remoto `Branko Iriart CMS` mediante `clasp`;
2. crea `.clasp.json` local;
3. restaura el `appsscript.json` versionado;
4. ejecuta el primer `clasp push`.

`.clasp.json` y las credenciales OAuth de `clasp` no se versionan.

## Inicialización de datos

En el editor de Apps Script ejecutar manualmente una sola vez:

`setupBrankoCms()`

La función crea o reusa:

- Spreadsheet `Branko Iriart · CMS`;
- carpeta Drive `Branko Iriart · CMS Media`;
- hojas del schema;
- Script Properties con los IDs de storage;
- hash + salt de la contraseña administrativa;
- contraseña temporal inicial sólo si todavía no existe una.

El setup es idempotente y no debe borrar datos existentes.

## Después del setup

Primero validar:

- `getCmsSetupStatus()`;
- endpoint `health` una vez creado el deployment de prueba;
- endpoint `bootstrap`;
- login mediante el bridge desde un origen distinto;
- upload real de JPEG/PNG/WebP;
- cambio de contraseña y revocación de la sesión anterior.

Recién después se conecta la landing y se desarrolla `/admin/`.

## Desarrollo cotidiano

```bash
git pull
npm install
npm run cms:status
npm run cms:push
```

Cuando se quiera actualizar una implementación publicada:

1. `clasp push`;
2. crear versión;
3. redeploy de la implementación existente;
4. verificar health y bootstrap.

GitHub es la fuente de verdad. El editor web de Apps Script no debe acumular cambios manuales no versionados.
