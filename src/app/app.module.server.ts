import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
