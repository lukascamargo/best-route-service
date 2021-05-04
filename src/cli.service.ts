import { Injectable } from '@nestjs/common';
import * as inquirer from 'inquirer';
import { AppService } from './app.service';

@Injectable()
export class CliService {
  whereYouWantToGo = () => {
    const questions = [
      {
        name: 'route',
        type: 'input',
        message: 'please enter the route:',
        validate: function (value) {
          if (value.length) {
            return true;
          } else {
            return 'please enter the route:';
          }
        },
      },
    ];

    return inquirer.prompt(questions);
  };

  run = async () => {
    do {
      const { route } = await this.whereYouWantToGo();
      const routes = route.split('-');
      const bestRoute = await new AppService().cheaperRoute(
        routes[0],
        routes[1],
      );
      console.log('best route:', bestRoute);
    } while (true);
  };
}
