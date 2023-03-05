import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransportFormService } from './transport-form.service';
import { TransportService } from '../service/transport.service';
import { ITransport } from '../transport.model';

import { TransportUpdateComponent } from './transport-update.component';

describe('Transport Management Update Component', () => {
  let comp: TransportUpdateComponent;
  let fixture: ComponentFixture<TransportUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transportFormService: TransportFormService;
  let transportService: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransportUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TransportUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransportUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transportFormService = TestBed.inject(TransportFormService);
    transportService = TestBed.inject(TransportService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const transport: ITransport = { id: 456 };

      activatedRoute.data = of({ transport });
      comp.ngOnInit();

      expect(comp.transport).toEqual(transport);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransport>>();
      const transport = { id: 123 };
      jest.spyOn(transportFormService, 'getTransport').mockReturnValue(transport);
      jest.spyOn(transportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transport }));
      saveSubject.complete();

      // THEN
      expect(transportFormService.getTransport).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(transportService.update).toHaveBeenCalledWith(expect.objectContaining(transport));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransport>>();
      const transport = { id: 123 };
      jest.spyOn(transportFormService, 'getTransport').mockReturnValue({ id: null });
      jest.spyOn(transportService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transport: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transport }));
      saveSubject.complete();

      // THEN
      expect(transportFormService.getTransport).toHaveBeenCalled();
      expect(transportService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransport>>();
      const transport = { id: 123 };
      jest.spyOn(transportService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transport });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transportService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
