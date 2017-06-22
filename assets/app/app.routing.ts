import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SignUpCmp } from './user';
import { AddCmp } from './services';
import { HomeCmp } from './home';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', component: HomeCmp },
      { path: 'signup', component: SignUpCmp },
      { path: 'add/:type', component: AddCmp }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}