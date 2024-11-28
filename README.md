# Aplicações IoT em Nuvem

<h2>PROJETO</h2>
O projeto utiliza os diferentes meios de comunicação, como WebServer, WebSocket e MQTT. Como exemplo, temos um sistema de monitoramento de sensores em tempo real.
<p>
  
A aplicação é composto por 4 serviços:<p>
  &emsp;1.	WebServer:<p>
    &emsp;&emsp;-	Um servidor web que fornece uma interface para visualização dos dados monitorados.<p>
    &emsp;&emsp;-	O servidor exibe os dados obtidos pelo WebSocket em tempo real <p>
    &emsp;&emsp;-	O servidor assina um tópico MQTT para receber e manter um histórico dos dados coletados pelos sensores no DBServer.<p>
    &emsp;&emsp;-	O servidor disponibiliza uma api que retorna os dados armazenados no DBServer.<p>
   &emsp;2.	DBServer:<p>
    &emsp;&emsp;-	Servidor Mongodb responsável por armazenar os dados dos sensores.<p>
    &emsp;&emsp;-	O servidor possui um banco de dados "projeto" contendo uma tabela "sensor" com os campos id, date e value<p>
  &emsp;3.	WebSocket:<p>
    &emsp;&emsp;-	Um servidor WebSocket que permite a comunicação bidirecional em tempo real.<p>
    &emsp;&emsp;-	O servidor notifica o cliente sobre atualizações instantâneas nos dados dos sensores.<p>
  &emsp;4.	MQTT Broker:<p>
    &emsp;&emsp;-	Um broker MQTT que gerencia a comunicação entre os sensores e os consumidores de dados.<p>
    &emsp;&emsp;-	Os sensores publicarão dados em tópicos MQTT, e os consumidores (WebServer e WebSocket) assinam esses tópicos para receber atualizações.<p>


Arquitetura:<p>


<img width="564" src="https://github.com/user-attachments/assets/ef9a1281-4149-4a2a-aeae-14bc0dc570da">

<p><p>
Fluxo de Dados:<p>
  &emsp;1.	Sensores → MQTT Broker:<p>
    &emsp;&emsp;-	Sensores publicam dados em um tópico específicos no broker MQTT.<p>
  &emsp;2.	MQTT Broker → WebSocket:<p>
    &emsp;&emsp;-	O WebSocket assina o tópico no broker para receber dados dos sensores.<p>
  &emsp;3.	MQTT Broker → WebServer:<p>
    &emsp;&emsp;-	O WebServer também assina o tópico MQTT para manter o histórico de dados.<p>
  &emsp;4.	WebServer → Cliente:<p>
    &emsp;&emsp;-	O cliente requisita a página que conecta ao WebSocket e obtêm o histórico de dados.<p>
  &emsp;5.	WebSocket → Cliente:<p>
    &emsp;&emsp;-	O WebSocket Server notifica o Cliente sobre atualizações instantâneas para exibição em tempo real na interface web.<p>
