import { Routes } from '@angular/router';
import { TitleScreen } from './screens/title';
import { GameScreen } from './screens/game';

export const routes: Routes = [
  { path: '', component: TitleScreen },
  { path: 'oyun', component: GameScreen },
  { path: '**', redirectTo: '' },
];
