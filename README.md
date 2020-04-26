# obs-browser-live-streams

Automatiza mensagens e printa no html com websockets para ser usado por exemplo no OBS Browser.

## Fluxo de notificação do Serviço para o OBS

1. node fica fazendo polling da api que precisamos notificar
1. assim que o node percebe uma alteracao, submete para os clientes (browsers)
