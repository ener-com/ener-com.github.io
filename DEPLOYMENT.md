# 🚀 Guía de Despliegue — Paneles Solares Enercom

## Guía completa para publicar tu sitio web en GitHub Pages con protección de datos sensibles.

---

## Tabla de Contenidos

1. [Requisitos Previos](#1-requisitos-previos)
2. [Configuración del Repositorio](#2-configuración-del-repositorio)
3. [⚠️ Configurar GitHub Secrets (OBLIGATORIO)](#3-️-configurar-github-secrets-obligatorio)
4. [Subir tu Código](#4-subir-tu-código)
5. [Activar GitHub Pages (GitHub Actions)](#5-activar-github-pages-github-actions)
6. [Verificar que tu Sitio Está en Línea](#6-verificar-que-tu-sitio-está-en-línea)
7. [Desarrollo Local](#7-desarrollo-local)
8. [Configuración de Servicios Externos](#8-configuración-de-servicios-externos)
9. [Verificación Final](#9-verificación-final)
10. [Actualizaciones Futuras](#10-actualizaciones-futuras)
11. [(Opcional) Dominio Personalizado en el Futuro](#11-opcional-dominio-personalizado-en-el-futuro)

---

## 🔒 Arquitectura de Seguridad

Este proyecto **NO almacena datos sensibles en el código fuente**. En su lugar:

```
┌─────────────────────────────────────────────────────┐
│  index.html (source)                                │
│  Contains __PLACEHOLDERS__ only                     │
│  ✅ Safe to commit to public repo                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼  GitHub Actions (build step)
┌─────────────────────────────────────────────────────┐
│  scripts/build.js                                   │
│  Reads GitHub Secrets → Replaces __PLACEHOLDERS__   │
│  Base64-encodes contact data for runtime            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  dist/index.html (deployed)                         │
│  Contains real values (never committed to repo)     │
│  Contact data obfuscated with Base64                │
└─────────────────────────────────────────────────────┘
```

---

## 1. Requisitos Previos

- ✅ Una cuenta gratuita de [GitHub](https://github.com)
- ✅ [Git](https://git-scm.com/downloads) instalado en tu computadora
- ✅ El archivo `index.html` del sitio web (ya incluido en este repositorio)

> 💡 **No necesitas comprar un dominio.** GitHub Pages te proporciona una URL gratuita con HTTPS:
> `https://<tu-usuario>.github.io`

---

## 2. Configuración del Repositorio

### Nombrar el repositorio correctamente

Para un sitio de usuario, el nombre del repositorio **debe** seguir este formato exacto:

```
<tu-usuario>.github.io
```

Por ejemplo, si tu usuario de GitHub es `enercom-solar`, el repositorio debe llamarse:

```
enercom-solar.github.io
```

> ⚠️ **Importante:** El nombre debe coincidir exactamente con tu nombre de usuario. Si no, GitHub Pages no lo reconocerá como sitio principal.

### Pasos para crear el repositorio:

1. Ve a [github.com/new](https://github.com/new)
2. **Repository name:** Ingresa `<tu-usuario>.github.io`
3. **Description:** `Sitio web de Paneles Solares Enercom`
4. **Visibility:** Selecciona **Public** (requerido para GitHub Pages en cuentas gratuitas)
5. **NO** marques "Initialize this repository with a README" (ya tenemos uno)
6. Haz clic en **Create repository**

---

## 3. ⚠️ Configurar GitHub Secrets (OBLIGATORIO)

> 🔴 **Este paso es OBLIGATORIO antes del primer despliegue.** Sin estos secrets, el build fallará y el sitio no se publicará.

### Pasos:

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **"New repository secret"** y crea cada uno:

| Secret Name | Valor de Ejemplo | Descripción |
|---|---|---|
| `PHONE_NUMBER` | `dddddd` | Teléfono con código de país (solo dígitos) |
| `PHONE_DISPLAY` | `+dd ddd ddd dddd` | Teléfono para mostrar al usuario |
| `WHATSAPP_MSG` | `Hola%Mundo%2C%20lorep%20ipsum%20...` | Mensaje pre-llenado (URL-encoded) |
| `FACEBOOK_SLUG` | `MiPaginaFB` | Nombre de tu página de Facebook |
| `FACEBOOK_HANDLE` | `@MiPaginaFB` | Handle para mostrar al usuario |
| `GA_ID` | `G-XXXXXXXXXX` | ID de Google Analytics 4 |
| `FB_PIXEL_ID` | `123456789012345` | ID del Facebook Pixel |
| `FORMSPREE_ID` | `xAbCdEfG` | ID del formulario de Formspree |

> 💡 Consulta `.env.example` en el repositorio para ver todos los valores necesarios.

---

## 4. Subir tu Código

Abre **PowerShell** y ejecuta estos comandos uno por uno:

```powershell
# 1. Navega a la carpeta del proyecto
cd C:\Git\Personal\Projects\ener-com

# 2. Inicializa el repositorio Git
git init

# 3. Agrega todos los archivos
git add .

# 4. Haz el primer commit
git commit -m "feat: sitio web inicial de Paneles Solares Enercom"

# 5. Renombra la rama principal a 'main'
git branch -M main

# 6. Conecta con el repositorio remoto de GitHub
#    ⚠️ Reemplaza <TU-USUARIO> con tu nombre de usuario real de GitHub
git remote add origin https://github.com/<TU-USUARIO>/<TU-USUARIO>.github.io.git

# 7. Sube el código
git push -u origin main
```

> 💡 **Tip:** Si GitHub te pide autenticación, puedes usar un [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) o configurar SSH.

---

## 5. Activar GitHub Pages (GitHub Actions)

Este proyecto usa **GitHub Actions** para construir e inyectar secrets de forma segura antes de desplegar.

### Pasos:

1. Ve a tu repositorio en GitHub: `https://github.com/<TU-USUARIO>/<TU-USUARIO>.github.io`
2. Haz clic en la pestaña **Settings** (⚙️)
3. En el menú lateral izquierdo, busca **"Code and automation"** → **Pages**
4. En la sección **"Build and deployment"**:
   - **Source:** Selecciona **`GitHub Actions`** ⚠️ (NO "Deploy from a branch")
5. Haz clic en **Save**

> ⏱️ El workflow `.github/workflows/deploy.yml` se ejecutará automáticamente cada vez que hagas push a `main`.

---

## 6. Verificar que tu Sitio Está en Línea

### 6.1 — Verificar el workflow de construcción

1. Ve a la pestaña **Actions** de tu repositorio
2. Deberías ver un workflow llamado **"Build & Deploy"** ejecutándose
3. Cuando muestre un ✅ (check verde), tu sitio está en línea

### 6.2 — Visitar tu sitio

Abre tu navegador y ve a:

```
https://<TU-USUARIO>.github.io
```

> 🎉 **¡Listo!** Tu sitio ya está en línea con HTTPS incluido, sin costo.

### 5.3 — Si algo no funciona

| Problema | Solución |
|---|---|
| Página 404 | Verifica que el archivo se llame exactamente `index.html` (minúsculas) y esté en la raíz del repositorio |
| El repo no se llama correctamente | El nombre debe ser exactamente `<usuario>.github.io` |
| No se ve la opción Pages en Settings | Asegúrate de que el repositorio sea **Public** |
| Los cambios no aparecen | Espera hasta 10 minutos. Limpia la caché del navegador con `Ctrl + Shift + R` |

---

## 7. Desarrollo Local

Para probar el sitio localmente con tus datos reales:

```powershell
# 1. Copia el archivo de ejemplo
cp .env.example .env

# 2. Edita .env con tus valores reales
notepad .env

# 3. Ejecuta el build local
node scripts/build-local.js

# 4. Abre dist/index.html en tu navegador
start dist/index.html
```

> ⚠️ **NUNCA** hagas commit del archivo `.env`. Ya está en `.gitignore`.

---

## 8. Configuración de Servicios Externos

### 6.1 — Formspree (Formulario de Contacto)

El formulario de contacto usa [Formspree](https://formspree.io) para enviar los datos a tu correo electrónico sin necesidad de un servidor backend.

1. Ve a [formspree.io](https://formspree.io) y crea una cuenta gratuita
2. Haz clic en **New Form** para crear un nuevo formulario
3. Configura el email de destino (tu correo de negocio)
4. Copia el **Form ID** (tiene formato como `xAbCdEfG`)
5. En tu `index.html`, busca la línea que dice:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
6. Reemplaza `YOUR_FORM_ID` con tu ID real:
   ```html
   <form id="contact-form" action="https://formspree.io/f/xAbCdEfG" method="POST">
   ```
7. Haz commit y push de los cambios

> 📧 El plan gratuito de Formspree permite hasta **50 envíos/mes** — suficiente para empezar.

### 6.2 — Google Analytics 4

1. Ve a [analytics.google.com](https://analytics.google.com) y crea una cuenta
2. Crea una propiedad nueva para tu sitio (`<TU-USUARIO>.github.io`)
3. Copia tu **Measurement ID** (formato `G-XXXXXXXXXX`)
4. En `index.html`, busca el bloque comentado de Google Analytics en el `<head>` y **descoméntalo** (quita los `<!--` y `-->`)
5. Reemplaza las dos instancias de `G-XXXXXXXXXX` con tu ID real

### 6.3 — Meta (Facebook) Pixel

1. Ve a [Meta Business Suite → Events Manager](https://business.facebook.com/events_manager)
2. Crea un nuevo Pixel o usa uno existente
3. Copia el **Pixel ID**
4. En `index.html`, busca el bloque comentado del Meta Pixel en el `<head>` y **descoméntalo**
5. Reemplaza las dos instancias de `YOUR_PIXEL_ID` con tu ID real

### 6.4 — Actualizar enlace de Facebook

Busca todas las instancias de `https://www.facebook.com/ener-com` en `index.html` y reemplázalas con la URL real de tu página de Facebook.

---

## 7. Verificación Final

Usa esta checklist después de completar todo:

| # | Verificación                                              | ✅ |
|---|-----------------------------------------------------------|----|
| 1 | `https://<TU-USUARIO>.github.io` carga correctamente     | ☐  |
| 2 | El candado 🔒 HTTPS aparece en el navegador               | ☐  |
| 3 | El sitio se ve bien en móvil (prueba con tu celular)      | ☐  |
| 4 | El botón flotante de WhatsApp abre el chat correcto       | ☐  |
| 5 | Los botones "Cotizar Ahora" abren WhatsApp                | ☐  |
| 6 | El formulario de contacto envía correctamente             | ☐  |
| 7 | Los emails de Formspree llegan a tu correo                | ☐  |
| 8 | El enlace de Facebook funciona                            | ☐  |
| 9 | Google Analytics registra visitas (si lo configuraste)    | ☐  |
| 10| Meta Pixel dispara eventos (si lo configuraste)           | ☐  |

### Herramientas útiles para testing:

- 🔍 **Google PageSpeed Insights:** [pagespeed.web.dev](https://pagespeed.web.dev) — Analiza velocidad y SEO
- 📱 **Prueba responsive:** Abre tu sitio en Chrome → `F12` → ícono de celular/tablet
- 📊 **Meta Pixel Helper:** [Extensión de Chrome](https://chrome.google.com/webstore/detail/meta-pixel-helper/) para verificar el Pixel
- 🏷️ **Google Tag Assistant:** [Extensión de Chrome](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/) para verificar GA4

---

## 8. Actualizaciones Futuras

Cada vez que quieras hacer cambios a tu sitio:

```powershell
# 1. Edita los archivos necesarios en tu editor

# 2. Agrega los cambios
git add .

# 3. Haz commit con una descripción
git commit -m "update: descripción de los cambios"

# 4. Sube los cambios
git push
```

GitHub Pages se actualizará automáticamente en **1-3 minutos** después de cada push.

---

## 9. (Opcional) Dominio Personalizado en el Futuro

> 💰 **Esta sección solo aplica si en el futuro decides comprar un dominio** (ej. `enercom.com`, ~$10-15 USD/año).
> Tu sitio funciona perfectamente en `<TU-USUARIO>.github.io` sin ningún costo adicional.

### 9.1 — Proveedores de dominio recomendados

| Proveedor | Precio aprox. | Ventaja |
|---|---|---|
| [Namecheap](https://www.namecheap.com) | ~$9/año | Económico, buen panel DNS |
| [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) | ~$10/año | Precio al costo, DNS rápido y protección incluida |
| [Squarespace Domains](https://domains.squarespace.com) | ~$12/año | Antes Google Domains, fácil de usar |

### 9.2 — Crear archivo CNAME

En la raíz de tu repositorio, crea un archivo llamado `CNAME` (sin extensión, todo en mayúsculas) con **una sola línea**:

```
www.enercom.com
```

> ⚠️ Sin `https://`, sin `/` al final. Solo el dominio.

### 9.3 — Configurar DNS con tu proveedor

#### Registros A (para el dominio apex: `enercom.com`)

Agrega **4 registros A** apuntando a las IPs de GitHub Pages:

| Tipo | Host | Valor               | TTL  |
|------|------|----------------------|------|
| A    | @    | `185.199.108.153`    | 3600 |
| A    | @    | `185.199.109.153`    | 3600 |
| A    | @    | `185.199.110.153`    | 3600 |
| A    | @    | `185.199.111.153`    | 3600 |

#### Registro CNAME (para el subdominio `www`)

| Tipo  | Host | Valor                        | TTL  |
|-------|------|------------------------------|------|
| CNAME | www  | `<TU-USUARIO>.github.io.`   | 3600 |

#### (Opcional) Registros AAAA para soporte IPv6

| Tipo  | Host | Valor                    | TTL  |
|-------|------|--------------------------|------|
| AAAA  | @    | `2606:50c0:8000::153`    | 3600 |
| AAAA  | @    | `2606:50c0:8001::153`    | 3600 |
| AAAA  | @    | `2606:50c0:8002::153`    | 3600 |
| AAAA  | @    | `2606:50c0:8003::153`    | 3600 |

### 9.4 — Agregar dominio en GitHub Pages

1. Ve a **Settings → Pages** de tu repositorio
2. En **"Custom domain"**, escribe: `www.enercom.com`
3. Haz clic en **Save**
4. Espera a que GitHub verifique el DNS (puede tardar hasta 24-48 horas)
5. Una vez verificado, marca la casilla **"Enforce HTTPS"** ✅

> 💡 GitHub creará automáticamente redirecciones entre `enercom.com` y `www.enercom.com` siempre que ambos registros (A y CNAME) estén configurados.

### 9.5 — Verificar propagación DNS

Desde PowerShell (no necesitas instalar nada extra en Windows):

```powershell
# Verificar registros A del dominio apex
Resolve-DnsName -Name enercom.com -Type A

# Verificar CNAME del subdominio www
Resolve-DnsName -Name www.enercom.com -Type CNAME
```

O usa herramientas web:
- [dnschecker.org](https://dnschecker.org)
- [whatsmydns.net](https://www.whatsmydns.net)

### 9.6 — ⚠️ CRÍTICO: Verificar tu Dominio (Prevenir Ataques)

> **¿Por qué es esto CRÍTICO?**
>
> Sin verificar tu dominio, cualquier persona con una cuenta de GitHub podría potencialmente publicar un sitio malicioso usando tu dominio si tus registros DNS apuntan a GitHub Pages. Esto se conoce como un **ataque de toma de dominio (domain takeover)** y puede usarse para:
>
> - 🔴 Publicar contenido fraudulento bajo tu marca
> - 🔴 Phishing usando tu dominio legítimo
> - 🔴 Dañar la reputación de tu negocio
>
> **Verifica tu dominio ANTES de configurar los registros DNS** para máxima seguridad.

**Cómo verificar (paso a paso):**

1. Ve a la configuración de **tu cuenta personal de GitHub** (no del repositorio):
   - Haz clic en tu **avatar** (esquina superior derecha) → **Settings**
   - En el menú lateral, sección "Code, planning, and automation", haz clic en **Pages**
2. Haz clic en **"Add a domain"**
3. Escribe tu dominio: `enercom.com` → clic en **"Add domain"**
4. GitHub te mostrará un **registro TXT** único. Agrégalo en tu proveedor DNS:

| Tipo | Host                                     | Valor                                   | TTL  |
|------|------------------------------------------|-----------------------------------------|------|
| TXT  | `_github-pages-challenge-<TU-USUARIO>`   | `<CÓDIGO-PROPORCIONADO-POR-GITHUB>`     | 3600 |

5. Espera a que se propague (puede ser inmediato o tomar hasta 24 horas)
6. Verifica desde PowerShell:
   ```powershell
   Resolve-DnsName -Name "_github-pages-challenge-<TU-USUARIO>.enercom.com" -Type TXT
   ```
7. Regresa a GitHub y haz clic en **"Verify"**
8. ✅ **Repite el proceso para `www.enercom.com`** para proteger ambas variantes

> 🔒 Una vez verificado, solo **tú** podrás usar `enercom.com` y `www.enercom.com` en GitHub Pages.

> ⚠️ **NUNCA** uses registros DNS wildcard (`*.enercom.com`). Estos te ponen en riesgo inmediato de ataques de toma de subdominio, incluso si verificas el dominio raíz. Por ejemplo, si verificas `enercom.com`, eso protege `a.enercom.com`, pero **no** protege `b.a.enercom.com` que estaría cubierto por un wildcard.

---

## 📁 Estructura del Repositorio

```
<TU-USUARIO>.github.io/
├── index.html          ← Tu sitio web completo
├── DEPLOYMENT.md       ← Esta guía
└── README.md           ← Descripción del proyecto
```

> 📝 El archivo `CNAME` solo se necesita si configuras un dominio personalizado (Sección 9).

---

> **¿Necesitas ayuda?** Consulta la [documentación oficial de GitHub Pages](https://docs.github.com/en/pages).
