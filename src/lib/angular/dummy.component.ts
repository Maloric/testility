import { Component, NgModule } from '@angular/core';

@Component({
    selector: 'test-dummy',
    template: '<ng-content></ng-content>'
})
export class DummyComponent {}

@NgModule({
    declarations: [DummyComponent],
    exports: [DummyComponent]
})
export class DummyComponentModule {}
