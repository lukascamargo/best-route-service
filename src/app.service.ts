import { Injectable } from '@nestjs/common';

const routes = [
  'GRU,BRC,10',
  'BRC,SCL,5',
  'GRU,CDG,75',
  'GRU,SCL,20',
  'GRU,ORL,56',
  'ORL,CDG,5',
  'SCL,ORL,20',
];
// const routes = ['A,B,2', 'A,C,1', 'B,D,1', 'C,D,3', 'C,E,4', 'D,F,2', 'F,E,2'];
let visited = [];
let bestOrigins = [];

@Injectable()
export class AppService {
  async cheaperRoute(origin: string, destiny: string) {
    visited = [];
    bestOrigins = [];
    const organizedRoutes = this._organizeRoutes();
    await this._shortestPath(origin, destiny, organizedRoutes);

    if (visited[visited.length - 1] !== destiny) {
      return 'Route not found';
    }

    const amount = await this._findCost();

    return `${visited.join(' - ')} > $${amount}`;
  }

  private _organizeRoutes() {
    return routes.map((route) => {
      const path = route.split(',');
      return {
        from: path[0],
        to: path[1],
        price: path[2],
      };
    });
  }

  private _shortestPath(
    origin: string,
    destiny: string,
    organized: any[],
    connection = 0,
  ) {
    visited.push(`${origin}`);

    let connectedPath = organized.filter(
      (route) => route.from === origin || route.to === origin, // buscar todos as rotas que se conectam com a rota de origem
    );

    connectedPath = connectedPath.filter((path) => !visited.includes(path.to)); // retirar possíveis destinos já visitados

    if (connectedPath.length === 0) {
      return visited;
    }

    const shortest = connectedPath.reduce((prev, curr) => {
      return curr.price < prev.price ? curr : prev;
    }); // escolher a rota que tenha o menor preço

    bestOrigins.push({
      from: shortest.from,
      to: shortest.to,
      price: shortest.price,
      connection,
    });

    if (shortest.to === destiny) {
      visited.push(`${shortest.to}`);
      return visited;
    }

    this._shortestPath(shortest.to, destiny, organized, connection + 1);
  }

  private _findCost() {
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
}
