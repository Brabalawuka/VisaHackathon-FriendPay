import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaymentComponent } from './payment/payment.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CommsService } from './comms.service';
import { HttpClientModule } from '@angular/common/http';
import { CountdownComponent } from './payment/countdown/countdown.component';
import { ErrorService } from './error.service';

@NgModule({
  declarations: [
    AppComponent,
    PaymentComponent,
    PagenotfoundComponent,
    CountdownComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [CommsService, ErrorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
