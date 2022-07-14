---
title: Cómo funciona la API de AEMET para conseguir el pronóstico actualizado
date: 2021-06-07
status: draft
---

Una buena opción para mostrar la previsión del tiempo meteorológico de cualquier lugar de España en tu web, de forma automática, es solicitar los datos desde la [API OpenData de AEMET](https://opendata.aemet.es/centrodedescargas/inicio), la agencia española que se dedica a esto.

Te ofrecen una API libre y gratuita desde donde descargar cualquier previsión, siguiendo unos sencillos pasos que te detallo aquí abajo.

Tienes distintas APIs según lo que quieras solicitar, la que yo uso en mi *calendarioaguasabiertas.com* para mostrar la previsión meteorológica el día del evento la API de predicción específica diaria por municipio.

Si tienes otras necesidades, adapta los ejemplos a tu gusto.

## 0. Acceso a la API: qué necesitas

Tendrás que solicitar tu API Key. Muy sencillo:

1. [Accedes aquí](https://opendata.aemet.es/centrodedescargas/altaUsuario?) y dejas tu email.
2. Recibes al instante un correo con un enlace que tienes que clicar antes de que pasen 5 días.
3. Tras clicar, ves una página de confirmación y recibes otro correo.
4. Este segundo correo **tiene tu API Key**.
5. La guardas en un lugar seguro, y listo.

Más o menos todo completado en unos 23 segundos, y ya podemos pasar a lo que nos interesa.

## 1. Código Postal a Código de Municipio

Para solicitar la previsión detallada por municipio necesitas conocer el **código de municipio**, que gestiona el INE y no es lo mismo que el código postal.

Si entrar en muchos detalles (en los que ya entré en su momento) para no marearte con este tema, creé una herramienta sencillita que [**convierte** tu CP en código de municipio](https://github.com/rubenvar/codigos-postales) y la alojé en Heroku.

El primer paso entonces es hacer una solicitud a mi herramienta conversora con el CP y conseguir el código de municipio.

Para ello puedes acceder directamente desde tu navegador (todo son solicitudes `GET`), usar `curl`, [Postman](https://www.postman.com/), `fetch` desde tu app JavaScript, o lo que prefieras.

Con `curl`, usando el servicio que creé para esto, y el CP de ejemplo 13120, obtenemos un objeto JSON con el código postal que le hemos pasado y el **código de municipio** que necesitamos:

```curl
curl https://cp-muncode.herokuapp.com/api/cp/13120
```

```json
{
  "codigo_postal":"13120",
  "municipio_id":"13065",
  "municipio_nombre":"Porzuna"
}
```

Listo, con esto tenemos lo que necesitamos para el siguiente paso:

## 2. Primera solicitud: Enlaces de data

Para esta solicitud necesitamos la API Key y el `municipio_id` del paso anterior.

Con ambas cosas, hacemos una solicitud. De nuevo ejemplo con `curl`:

```curl
curl https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/<municipio_id>?api_key=<API_KEY>
```

Si todo ha ido bien, recibimos un objeto JSON con lo que necesitamos:

```json
{
  "descripcion" : "exito",
  "estado" : 200,
  "datos" : "https://opendata.aemet.es/opendata/sh/a694d126",
  "metadatos" : "https://opendata.aemet.es/opendata/sh/dfd88b22"
}
```

El enlace `datos` es el que nos interesa.

El enlace `metadatos` te lo puedes estudiar: devuelve una explicación detallada en JSON de lo que es cada campo que verás dentro de la respuesta del enlace `datos`, para que sepas lo que esperarte y puedas trabajar cómodamente.

## 3. Segunda solicitud: Toda la data

Ahora ya sí: hacemos una nueva solicitud al enlace `datos` conseguido el paso anterior, sin API_KEYs ni nada, y nos devuelve el JSON con toda la predicción meteorológica que queríamos:

```curl
curl https://opendata.aemet.es/opendata/sh/a694d126
```

## 4. Cómo recibimos la información
