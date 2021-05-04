## Descrição

Este é um Serviço de Backend para Escolha de Melhor Rota de viagem escrito em [Nest](https://github.com/nestjs/nest), framework TypeScript para desenvolvimento rápido.

## Instalação

```bash
$ npm install
```

## Rodar o app

```bash
# production mode
$ npm run start:prod input-routes2.csv
```

## Teste

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Rest

### Buscar Melhores Rotas:

(GET) /bestRoutes/:ORIGEM/:DESTINO
Exemplo:
/bestRoutes/gru/cdg

### Atualizar Arquivos de Rotas:

(POST) /updateRoutes
body:
from: string
to: string
price: string

Exemplo:
from: 'GRU'
to: 'CGH'
price: '5'
