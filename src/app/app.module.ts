import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TinyStateModule } from '../package/module';
import { ReduxDevtoolsPluginModule } from '../package/plugins/redux_devtools';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TinyStateModule.forRoot(),
    ReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
