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

@Injectable()
export class AppService {
  async cheaperRoute(origin: string, destiny: string) {
    visited = []; // initialize the visited variable - CORRIGIR RECEBENDO DO SHORTEST PATH
    const organizedRoutes = this._organizeRoutes(); // organize the routes before working on it - it will help
    await this._shortestPath(origin, destiny, organizedRoutes);

    if (visited[visited.length - 1] !== destiny) {
      return 'Route not found';
    }

    const amount = await this._getCost();

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
    visited.push(`${origin}`); // toda inicialização desta função coloca a origem como visitada

    let connectedPath = organized.filter(
      (route) => route.from === origin || route.to === origin, // buscar todos as rotas que se conectam com a rota de origem
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

    const shortest = connectedPath.reduce((prev, curr) => {
      return curr.price < prev.price ? curr : prev;
    }); // escolher a rota que tenha o menor preço

    if (shortest.to === destiny) {
      visited.push(`${shortest.to}`);
      return visited;
    } // Chegou ao destino, portanto adicionar o destino como visitado e responder o algoritmo

    this._shortestPath(shortest.to, destiny, organized, connection + 1);
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
}
