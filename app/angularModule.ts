import { Component, NgModule, NgModuleFactoryLoader, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { BrowserModule } from '@angular/platform-browser';

import { UIRouterModule } from '@uirouter/angular';
import { UIRouterUpgradeModule } from '@uirouter/angular-hybrid';
import { Observable } from 'rxjs/Observable';

import { PrefsModule } from './prefs/prefs.module';

// Create a "future state" (a placeholder) for the Contacts
// Angular module which will be lazy loaded by UI-Router
export const contactsFutureState = {
  name: 'contacts.**',
  url: '/contacts',
  loadChildren: './contacts/contacts.module#ContactsModule',
};

export function getDialogService($injector) {
  return $injector.get('DialogService');
}

export function getContactsService($injector) {
  return $injector.get('Contacts');
}


@Component({
  template: `
    <h1>Hello, AngularJS from Angular</h1>
    <h1 *ngIf="visible">Will this appear?</h1>
  `,
})
export class MyAngularComponent implements OnInit {
  visible = false;
  ngOnInit(): void {
    setInterval(() => this.visible = !this.visible, 1000);
  }
}


// The main NgModule for the Angular portion of the hybrid app
@NgModule({
  imports: [
    BrowserModule,
    // Provide angular upgrade capabilities
    UpgradeModule,
    // Provides the @uirouter/angular-hybrid directives
    UIRouterUpgradeModule,
    // Provides the @uirouter/angular directives
    UIRouterModule,
    // The preferences feature module
    PrefsModule,
    // This forChild module registers the contacts future state and enables the lazy loaded contacts module
    UIRouterModule.forChild({ states: [contactsFutureState] }),
  ],
  declarations: [MyAngularComponent],
  entryComponents: [MyAngularComponent],
  providers: [
    // Provide the SystemJsNgModuleLoader when using Angular lazy loading
    { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },

    // Register some AngularJS services as Angular providers
    { provide: 'DialogService', deps: ['$injector'], useFactory: getDialogService },
    { provide: 'Contacts', deps: ['$injector'], useFactory: getContactsService },
  ]
})
export class SampleAppModuleAngular {
  ngDoBootstrap() {
    /* no body: this disables normal (non-hybrid) Angular bootstrapping */
  }
}

