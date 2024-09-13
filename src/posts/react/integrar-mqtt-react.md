---
title: Cómo integrar MQTT en tu app React
seoTitle: "Cómo Integrar MQTT en App React: Conectar y Publicar"
description: "Agrega comunicación por MQTT en React lo más fácil posible: Contexto + custom hook. Completa con conexión, suscripción a topics, publicación, etc."
date: 2024-01-27
status: published
---

<script>
  import Box from '$lib/components/Box.svelte';
</script>

¿Buscando cómo integrar [MQTT](https://mqtt.org/) en una app React?

Hay algunos ejemplos online, pero cuando me encontré con este reto, me llevó bastante tiempo conseguir una implementación eficiente y sencilla que cumpliera con mis necesidades.

Te dejo mi sistema, que ahora mismo funciona en producción (eso sí, aquí un poco simplificado).

Tiene dos partes:

- Un **contexto**: se encarga de conectar automáticamente al servidor MQTT cuando se inicia la app, y de observar los posibles eventos.
- Un **custom hook**: expone los diferentes métodos para usar MQTT en toda tu app.

Y usaremos el package oficial: [MQTT.js](https://github.com/mqttjs/MQTT.js).

(Al final del artículo tienes el enlace a una **app completa de ejemplo** donde puedes ver y probar este mismo código).

## Crear el contexto

Lo primero de todo es un contexto. Idealmente envolvería toda tu app.

- Mantiene un estado.
- Observa los posibles eventos y actualiza el estado o ejecuta funciones.
- Conecta al broker MQTT cuando se inicia la app.
- Expone el estado y los métodos necesarios.

Vamos con cada parte, y después tienes el bloque completo del código del `MqttProvider`.

### Conectar

Esta es básicamente la función para conectar, dentro del Provider del contexto:

```ts
import mqtt from "mqtt";
import React from "react";

// mantener el cliente en un estado
const [client, setClient] = React.useState();

// función para conectar
const mqttConnect = React.useCallback(() => {
  const mqttClient = mqtt.connect(import.meta.env.VITE_BACKEND_MQTT, {
    protocolVersion: 5,
    // ... otras opciones que quieras añadir
    clientId: getClientId(), // función auxiliar que crea un id único
  });

  setClient(mqttClient);
}, []);
```

Al método `connect` le pasamos la url del broker (en mi caso algo como "ws://localhost:9001/mqtt") vía una variable de entorno, y las [opciones](https://github.com/mqttjs/MQTT.js?tab=readme-ov-file#mqttclientstreambuilder-options) que queramos.

Guardamos el cliente en el estado del contexto (y luego lo exponemos).

### Eventos

En el mismo Provider, dentro de un `useEffect`, podemos escuchar diferentes eventos:

```ts
if (client) {
  // cuando se conecta
  client.on("connect", () => {
    if (client.connected) setIsConnected(true);
  });
  // cuando hay error
  client.on("error", (err) => {
    console.error(err);
    client.end();

    setIsConnected(false);
  });
  // cuando se reconecta
  client.on("reconnect", () => {
    if (client.connected) setIsConnected(true);
  });
  // cuando se desconecta
  client.on("close", () => {
    setIsConnected(false);
  });
  // cuando se recibe un packet de desconexión desde el broker
  client.on("disconnect", () => {
    setIsConnected(false);
  });
  // cuando se recibe un mensaje
  client.on("message", (topic: string, message: Buffer) => {
    try {
      // parsear el mensaje (Buffer)
      const parsed = JSON.parse(message.toString());

      if (parsed) {
        // hacer algo con el mensaje
        console.log(topic, parsed);
      }
    } catch (error) {
      if (error instanceof Error) throw error;
    }
  });
}
```

Básicamente actualizamos el estado `isConnected` según el evento que ocurra.

Es un ejemplo básico, hay muchas formas de extenderlo.

- Podrías tener otro estado, `isConnecting`, que también actualizaras (y expusieras). Podrías incluso tener un `status` con diferentes valores, etc.
- Podrías loguear (a consola, archivo, etc.) en cada uno de los eventos.

#### Gestión de mensajes

En el ejemplo solo se loguean.

En otros ejemplos online tienen un estado dentro del provider:

```ts
const [messages, setMessages] = React.useState([]);
```

Y en cada nuevo mensaje, lo añades a este estado. Siempre podrás ver el mensaje más reciente (el ultimo en el array), y mostrarlos todos en una lista.

<Box type="info">

Quizás esto sea todo lo que necesitas. Aunque recuerda que si recibes muchos mensajes, tu array se hará gigante. Tendrías que gestionarlo e ir borrando mensajes, etc.

</Box>

Algo más complejo sería guardar un objecto por cada mensaje, con el `timestamp` por ejemplo.

En mi caso, he integrado todo esto con [`react-query`](/react-query), y en el _callback_ al recibir un mensaje, lo añado manualmente al caché y no lo mantengo en ningún otro estado. Aunque eso es otra historia.

### Autoconectar

En otro `useEffect` dentro del mismo Provider, conectamos llamando al método que hemos declarado más arriba.

```ts
// auto conectar al inicializar el contexto
React.useEffect(() => {
  if (!client && !isConnected) mqttConnect();
}, [client, isConnected]);
```

Esto se ejecutará una vez al inicializar el Provider (si envuelve tu app entera, se ejecutará cuando se inicia tu app). Después, mientras esté conectado, no debería ejecutarse más veces.

### El código completo del Provider

Esta sería el contenido de `MqttProvider.tsx`.

Es un bloque largo de código con todas las partes que hemos visto, más el **Contexto** y algunos detalles que faltaban para unirlo todo. Revísalo.

```ts
import mqtt from "mqtt";
import React from "react";

// tipo del contexto
type MqttContextType = {
  client: mqtt.MqttClient | null;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  mqttConnect: () => void;
};

// contenido por defecto del contexto
const defaultContext: MqttContextType = {
  client: null,
  isConnected: false,
  setIsConnected: () => {},
  mqttConnect: () => {},
};

// el contexto
const MqttContext = React.createContext<MqttContextType>(defaultContext);

// exportamos un custom hook
export function useMqttContext() {
  return React.useContext(MqttContext);
}

// función auxiliar (no la mejor forma de crear ids únicos)
const getClientId = () => `test_client_${Math.random().toString(16).slice(3)}`;

// vamos con el provider
export function MqttProvider({ children }: React.PropsWithChildren) {
  const [client, setClient] = React.useState<MqttContextType["client"]>(
    defaultContext.client
  );
  const [isConnected, setIsConnected] = React.useState(
    defaultContext.isConnected
  );

  // función para conectar
  const mqttConnect = React.useCallback(() => {
    const mqttClient = mqtt.connect(import.meta.env.VITE_BACKEND_MQTT, {
      protocolVersion: 5,
      // ... otras opciones que quieras añadir
      clientId: getClientId(),
    });
    setClient(mqttClient);
  }, []);

  // observar eventos
  React.useEffect(() => {
    if (client) {
      // cuando se conecta
      client.on("connect", () => {
        if (client.connected) setIsConnected(true);
      });
      // cuando hay error
      client.on("error", (err) => {
        console.error(err);
        client.end();

        setIsConnected(false);
      });
      // cuando se reconecta
      client.on("reconnect", () => {
        if (client.connected) setIsConnected(true);
      });
      // cuando se desconecta
      client.on("close", () => {
        setIsConnected(false);
      });
      // cuando se recibe un packet de desconexión desde el broker
      client.on("disconnect", () => {
        setIsConnected(false);
      });
      // cuando se recibe un mensaje
      client.on("message", (topic: string, message: Buffer) => {
        try {
          // parsear el mensaje (Buffer)
          const parsed = JSON.parse(message.toString());

          // hacer algo con el mensaje
          if (parsed) {
            console.log(topic, parsed);
          }
        } catch (error) {
          if (error instanceof Error) throw error;
        }
      });
    }

    // cleanup
    return () => {
      if (client) {
        client.endAsync();
        setIsConnected(false);
      }
    };
  }, [client]);

  // auto conectar al inicializar el contexto
  React.useEffect(() => {
    if (!client && !isConnected) mqttConnect();
  }, [client, isConnected, mqttConnect]);

  const contextValue = React.useMemo(
    () => ({
      client,
      isConnected,
      setIsConnected,
      mqttConnect,
    }),
    [client, isConnected, mqttConnect]
  );

  return (
    <MqttContext.Provider value={contextValue}>{children}</MqttContext.Provider>
  );
}
```

## Crear hook con métodos

Expone los diferentes métodos para usar MQTT en toda la app:

- Desconectar el cliente.
- Suscribirte a topics.
- Desuscribirte.
- Y publicar mensajes.

Igual que antes, vamos con cada función que se crea dentro del hook `useMqtt`, y después tienes el hook completo:

### Desconectar

```ts
// desconectar
async function mqttDisconnect() {
  if (isConnected && client) {
    try {
      await client.endAsync();

      setIsConnected(false);
    } catch (err) {
      console.error(err);
    }
  }
}
```

### Suscribir

Para recibir un mensaje en un _topic_, necesitas previamente haberte suscrito.

```ts
// suscribir. el topic se pasa como parámetro
async function mqttSubscribe(topic: string) {
  if (isConnected && client) {
    try {
      await client.subscribeAsync(topic, {
        qos: 1,
        rap: false,
        rh: 0,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
```

### Desuscribir

```ts
// desuscribir
async function mqttUnSubscribe(topic: string) {
  if (isConnected && client) {
    try {
      await client.unsubscribeAsync(topic);
    } catch (err) {
      console.error(err);
    }
  }
}
```

### Publicar

```ts
// publicar mensaje
async function mqttPublish(topic: string, message: string | number | boolean) {
  if (client && isConnected) {
    try {
      await client.publishAsync(topic, JSON.stringify(message), {
        qos: 1,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
```

<Box type="recuerda">

Recuerda que puedes publicar un mensaje en un topic sin estar suscrito a este. Tu mensaje se enviará, pero **no lo verás** en tu app (no llegará el evento "message") si no te has suscrito previamente.

</Box>

### El código completo del hook

En este ejemplo, básicamente son funciones que envuelven los métodos que ya expone MQTT.js. Quizás te parezca que no tiene mucho sentido, pero en cada una de estas funciones podrías tener lógica adicional relativa a tu app:

- Validar que el topic esté en una lista de topics _permitidos_.
- Validar la estructura/caracteres/etc. del mensaje a publicar.
- Loguear en cada función, a consola/archivo/endpoint/etc.
- Devolver una respuesta que después usarías para mostrar una confirmación al usuario.
- etc.

Esto sería `useMqtt.ts`:

```ts
import { useMqttContext } from "./MqttProvider";

export function useMqtt() {
  const { client, isConnected, setIsConnected, mqttConnect } = useMqttContext();

  // desconectar
  async function mqttDisconnect() {
    if (isConnected && client) {
      try {
        await client.endAsync();

        setIsConnected(false);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // suscribir. el topic se pasa como parámetro
  async function mqttSubscribe(topic: string) {
    if (isConnected && client) {
      try {
        await client.subscribeAsync(topic, {
          qos: 1,
          rap: false,
          rh: 0,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  // desuscribir
  async function mqttUnSubscribe(topic: string) {
    if (isConnected && client) {
      try {
        await client.unsubscribeAsync(topic);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // publicar mensaje
  async function mqttPublish(
    topic: string,
    message: string | number | boolean
  ) {
    if (client && isConnected) {
      try {
        await client.publishAsync(topic, JSON.stringify(message), {
          qos: 1,
        });
      } catch (err) {
        console.error(err);
      }
    }
  }

  return {
    client,
    isConnected,
    mqttConnect,
    mqttDisconnect,
    mqttPublish,
    mqttSubscribe,
    mqttUnSubscribe,
  };
}
```

Este hook también re-expone `client` e `isConnected`, los estados del Provider, y `mqttConnect`, para que puedan usarse en el resto de la app desde este hook.

## Cómo usar todo esto

Con estos dos elementos, ya tienes todo lo que necesitas para integrar MQTT en tu app React.

Vamos a ver cómo encaja.

### El contexto, con `MqttProvider`

En el archivo de entrada de tu app, meteríamos todos los componentes dentro de MqttProvider:

```tsx
import { MqttProvider } from "./MqttContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MqttProvider>
      <App />
    </MqttProvider>
  </StrictMode>
);
```

### Los métodos, con `useMqtt()`

Cuando queramos conectar, publicar, etc., por ejemplo al clicar un botón, podemos importar las funciones desde el hook `useMqtt()` y usarlas.

```tsx
import { useMqtt } from "./useMqtt";

const MqttConnectButton = () => {
  const { mqttConnect } = useMqtt();

  return (
    <button
      onClick={() => {
        mqttConnect();
      }}
    >
      Connect
    </button>
  );
};
//...
```

### App de ejemplo

Para que lo veas más claro, [he creado una app muy sencilla](https://github.com/rubenvar/example-react-mqtt) que utiliza **el mismo código** que tienes en estos ejemplos.

Puedes clonarla y problarla.

Necesitarás un broker. Yo uso [mosquitto](https://mosquitto.org/) para hacer pruebas, iniciado como un servicio que siempre está activo por detrás.

Puedes abrir varias instancias de la misma app e intercambiar mensajes entre ellas, siempre que te suscribas al mismo topic. Verás los mensajes en la consola del navegador.

También puedes probarla con una app de testing MQTT, como [MQTT Explorer](https://mqtt-explorer.com/), [MQTTX](https://mqttx.app/), o [MQTT Multimeter](https://github.com/chkr1011/mqttMultimeter).
