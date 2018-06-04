import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MessageDialogComponent } from './message-dialog.component';
import { MessageDialogData } from './message-dialog.interfaces';

// Noop component to trigger change detection
@Component({
  selector: 'app-noop',
  template: '',
})
export class NoopComponent {}

const testComponents = [MessageDialogComponent, NoopComponent];

// Dummy module for dialog testing, needed to have entryComponents
@NgModule({
  declarations: testComponents,
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: testComponents,
  entryComponents: [MessageDialogComponent],
})
export class DialogTestingModule {}

/**
 * Tests start from here, import the DialogTestingModule & provide a
 * container element for the dialog,which will be used later to
 * access the html of the dialog later for the tests.
 */
describe('MessageDialogComponent', () => {
  let dialog: MatDialog;
  let noopComponent: ComponentFixture<NoopComponent>;
  let overlayContainerElement: HTMLDivElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [DialogTestingModule],
      providers: [
        {
          // Provide a container for the dialog, save the container in variable for css queries later
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ],
    }).compileComponents();

    dialog = TestBed.get(MatDialog);

    noopComponent = TestBed.createComponent(NoopComponent);
  }));

  it('Show information title & message', () => {
    const data: MessageDialogData = { title: 'The title', text: 'The text' };
    const config: MatDialogConfig = { data };

    dialog.open(MessageDialogComponent, config);

    // Trigger change detection on TestBed for the dialog to update
    noopComponent.detectChanges();

    expect(overlayContainerElement.querySelector('[mat-dialog-title]').textContent).toBe(data.title);
    expect(overlayContainerElement.querySelector('p').textContent).toBe(data.text);
  });
});
