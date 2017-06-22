import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing';

import { AppCmp } from './app.cmp';
import { TaskCmp } from './task';
import { SignUpCmp } from './user';
import { AddCmp, AddTaskCmp, AddTaskApi } from './services';
import { HomeCmp } from './home';

@NgModule({
  declarations: [
    AppCmp,
    TaskCmp,
    AddCmp,
    AddTaskCmp,
    SignUpCmp,
    HomeCmp
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [AddTaskApi],
  bootstrap: [AppCmp]
})
export class AppModule {

}