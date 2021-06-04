import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatherModule } from 'angular-feather';
import { ChevronsLeft } from 'angular-feather/icons';
import { TheosAddressModule } from 'src/components/theos-address/theos-address.module';
import { TheosButtonModule } from 'src/components/theos-button/theos-button.module';
import { TheosContactModule } from 'src/components/theos-contact/theos-contact.module';
import { TheosDateIntervalModule } from 'src/components/theos-date-interval/theos-date-interval.module';
import { TheosDateModule } from 'src/components/theos-date/theos-date.module';
import { TheosFieldInfoModule } from 'src/components/theos-info/theos-field-info.module';
import { TheosInputFielModule } from 'src/components/theos-input-fiel/theos-input-fiel.module';
import { TheosInputSearchGroupModule } from 'src/components/theos-input-search-group/theos-input-search-group.module';
import { TheosInputSearchModule } from 'src/components/theos-input-search/theos-input-search.module';
import { TheosInputModule } from 'src/components/theos-input/theos-input.module';
import { TheosLoaderModule } from 'src/components/theos-loader/theos-loader.module';
import { TheosLoaderService } from 'src/components/theos-loader/theos-loader.service';
import { TheosMoneyIntervalModule } from 'src/components/theos-money-interval/theos-money-interval.module';
import { TheosNumberModule } from 'src/components/theos-number/theos-number.module';
import { TheosSelectSearchModule } from 'src/components/theos-select-search/theos-select-search.module';
import { TheosSelectModule } from 'src/components/theos-select/theos-select.module';
import { TheosTextAreaModule } from 'src/components/theos-text-area/theos-text-area.module';
import { TheosWindowModule } from 'src/components/theos-window/theos-window.module';
import { FocusDirectiveModule } from 'src/components/_directives/focus/focus.module';
import { EclesialNotificationService } from 'src/services/eclesial-notification.service';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    TheosAddressModule,
    TheosButtonModule,
    TheosContactModule,
    TheosDateModule,
    TheosDateIntervalModule,
    TheosFieldInfoModule,
    TheosInputModule,
    TheosInputFielModule,
    TheosInputSearchModule,
    TheosInputSearchGroupModule,
    TheosMoneyIntervalModule,
    TheosNumberModule,
    TheosSelectModule,
    TheosSelectSearchModule,
    TheosTextAreaModule,
    TheosWindowModule,
	FocusDirectiveModule,

    FeatherModule.pick({ ChevronsLeft }),

    TheosLoaderModule,
  ],
  providers: [
    EclesialNotificationService,
    ErrorHandlerService,
    TheosLoaderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
