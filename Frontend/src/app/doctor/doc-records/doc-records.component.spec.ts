import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocRecordsComponent } from './doc-records.component';

describe('DocRecordsComponent', () => {
  let component: DocRecordsComponent;
  let fixture: ComponentFixture<DocRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
