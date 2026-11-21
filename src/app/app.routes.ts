import { Routes } from '@angular/router';
import { TitleScreen } from './screens/title';
import { GameScreen } from './screens/game';
import { GalleryScreen } from './screens/gallery';

export const routes: Routes = [
  { path: '', component: TitleScreen },
  { path: 'oyun', component: GameScreen },
  { path: 'galeri', component: GalleryScreen },
  { path: '**', redirectTo: '' },
];
