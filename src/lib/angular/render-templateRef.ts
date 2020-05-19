import { Component, Input, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
    selector: 'my-view-container-wrapper',
    template: `<ng-template [ngTemplateOutlet]="templateRef"></ng-template>`,
})
export class TemplateTestComponent {
    @Input()
    templateRef: TemplateRef<any>;
}

export const renderTemplateRef = (templateRef: TemplateRef<any>): ComponentFixture<TemplateTestComponent> => {
    let fixture = TestBed.createComponent(TemplateTestComponent);
    fixture.componentInstance.templateRef = templateRef;
    fixture.detectChanges();
    return fixture;
};
