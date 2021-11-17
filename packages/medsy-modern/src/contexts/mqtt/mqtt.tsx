import { createContext, useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

var Paho = require('paho-mqtt/paho-mqtt');

export const MQTTContext = createContext(null);

export const MQTTProvider = ({ children }) => {
  const host = 'broker.emqx.io';
  const port = 8084;
  const topic = 'KFSmartRetail/NewOrder';
  const [connection, setconnection] = useState(null);

  const [connectionErrorMessage, setconnectionErrorMessage] = useState(null);
  const [isConnected, setisConnected] = useState(false);

  const [lastMQTTMessage, setlastMQTTMessage] = useState(null);

  var mqttpahooption;
  var con;
  useEffect(() => {
    con = new Paho.Client(
      'wss://' + host + ':' + port + '/mqtt',
      Math.random().toString()
    );
    mqttpahooption = {
      onSuccess: () => {
        console.log(`MQTT Connection to ${host} succeed over websocket`);
        con.subscribe(topic);
        setconnectionErrorMessage(null);
        setisConnected(true);
      },
      onFailure: (e) => {
        console.log(`MQTT Connection Failed : ${e.errorMessage}`);
        console.log(mqttpahooption);
        // delete mqttpahooption.mqttVersionExplicit;
        setconnectionErrorMessage(
          `MQTT Connection Failed : ${e.errorMessage}. Retrying`
        );
        setisConnected(false);
        con.connect(mqttpahooption);
      },
    };

    // set callback handlers
    con.onConnectionLost = (res) => {
      console.log('MQTT connection lost, retrying');
      console.log(mqttpahooption);
      // delete mqttpahooption.mqttVersionExplicit;
      setconnectionErrorMessage('MQTT connection lost, retrying');
      setisConnected(false);
      con.connect(mqttpahooption);
    };
    con.onMessageArrived = (msg) => {
      console.log(
        `MQTT message received from topic ${msg.destinationName}, message : ${msg.payloadString}`
      );
      setlastMQTTMessage(msg.payloadString);
    };

    // connect the client
    con.connect(mqttpahooption);
  }, []);

  return (
    <MQTTContext.Provider
      value={{
        connection,
        isConnected,
        connectionErrorMessage,
        lastMQTTMessage,
      }}
    >
      {children}
    </MQTTContext.Provider>
  );
};

export const useMQTT = () => useContext(MQTTContext);
