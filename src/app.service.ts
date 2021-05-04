import { Injectable } from '@nestjs/common';
import * as parse from 'csv-parse';
import * as fs from 'fs';
import * as converter from 'json-2-csv';

// const routes = [
//   'GRU,BRC,10',
//   'BRC,SCL,5',
//   'GRU,CDG,75',
//   'GRU,SCL,20',
//   'GRU,ORL,56',
//   'ORL,CDG,5',
//   'SCL,ORL,20',
// ];
let routes = [];
let visited = [];

@Injectable()
export class AppService {
  async cheaperRoute(origin: string, destiny: string) {
    visited = []; // initialize the visited variable
    const organizedRoutes = await this._organizeRoutes(); // organize the routes before working on it - it will help
    await this._shortestPath(origin, destiny, organizedRoutes);

    if (visited[visited.length - 1] !== destiny) {
      return 'Route not found';
    }

    const amount = await this._getCost();

    return `${visited.join(' - ')} > $${amount}`;
  }

  private async _organizeRoutes() {
    return routes.map((route) => {
      const path = route.split(',');
      return {
        from: path[0],
        to: path[1],
        price: path[2],
      };
    });
  }

  private _shortestPath(origin: string, destiny: string, organized: any[]) {
    visited.push(`${origin}`); // toda inicialização desta função coloca a origem como visitada

    let connectedPath = organized.filter(
      (route) =>
        origin.localeCompare(route.from) === 0 ||
        origin.localeCompare(route.to) === 0,
      // buscar todos as rotas que se conectam com a rota de origem
    );

    connectedPath = connectedPath.filter((path) => !visited.includes(path.to)); // retirar possíveis destinos já visitados
    // importante perceber que no caso acima só considera destinos
    // se existir conexão onde o aeroporto está como origem, não vai considerar
    // pois voos entre GRU e CDG por 75 não significa que também existe entre CDG e GRU por 75
    // caso exista o algoritmo se torna um grapho com Algoritmo de Dijkstra

    if (connectedPath.length === 0) {
      return visited;
    }

    // Se não existe Aeroporto com conexão com aquela origem mais, significa que o Algoritmo atingiu seu limite
    // Caso não tenha chegado ao Destino e o Algoritmo retorne, significa que não existe rota para a Origem e Destino escolhida

    const shortest = connectedPath.reduce((prev, curr) =>
      Number(curr.price) < Number(prev.price) ? curr : prev,
    ); // escolher a rota que tenha o menor preço

    if (shortest.to === destiny) {
      visited.push(`${shortest.to}`);
      return visited;
    } // Chegou ao destino, portanto adicionar o destino como visitado e responder o algoritmo

    this._shortestPath(shortest.to, destiny, organized);
  }

  private _getCost() {
    const visitedClone = [...visited];
    let amount = 0;

    for (let i = visitedClone.length - 1; i >= 0; i--) {
      const regex = new RegExp(
        `${visitedClone[i - 1]},${visitedClone[i]}\\b`,
        'g',
      );

      const route = routes.filter((r) => r.match(regex));
      amount = amount + Number(route[0]?.split(',')[2] || '0');
    }

    return amount;
  }

  async readRoutesInput() {
    new Promise<void>((resolve, reject) => {
      try {
        fs.createReadStream(process.argv[2] || 'input-routes.csv')
          .pipe(parse())
          .on('data', (r) => {
            if (r.length === 1) {
              r = r.split(',');
            }
            routes.push(r.join(','));
          })
          .on('error', (e) => {
            console.log('error', e);
            reject();
          })
          .on('finish', () => {
            return resolve();
          });
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  async updateRoutes(origin: string, destiny: string, price: string) {
    routes.push(`${origin},${destiny},${price}`);

    await converter.json2csv(
      routes.map((route) => {
        return {
          route,
        };
      }),
      (err, csv) => {
        if (err) {
          return err;
        }

        csv = csv
          .split('\n')
          .filter((route) => route != 'route')
          .join('\n');

        fs.writeFileSync(process.argv[2] || 'input-routes.csv', csv);
        routes = [];
        this.readRoutesInput();
      },
    );
    return 'Updated.';
  }
}
