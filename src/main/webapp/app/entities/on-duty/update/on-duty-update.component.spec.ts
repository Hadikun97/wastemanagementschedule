import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OnDutyFormService } from './on-duty-form.service';
import { OnDutyService } from '../service/on-duty.service';
import { IOnDuty } from '../on-duty.model';
import { IStaff } from 'app/entities/staff/staff.model';
import { StaffService } from 'app/entities/staff/service/staff.service';
import { ITransport } from 'app/entities/transport/transport.model';
import { TransportService } from 'app/entities/transport/service/transport.service';

import { OnDutyUpdateComponent } from './on-duty-update.component';

describe('OnDuty Management Update Component', () => {
  let comp: OnDutyUpdateComponent;
  let fixture: ComponentFixture<OnDutyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let onDutyFormService: OnDutyFormService;
  let onDutyService: OnDutyService;
  let staffService: StaffService;
  let transportService: TransportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OnDutyUpdateComponent],
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
      .overrideTemplate(OnDutyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OnDutyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    onDutyFormService = TestBed.inject(OnDutyFormService);
    onDutyService = TestBed.inject(OnDutyService);
    staffService = TestBed.inject(StaffService);
    transportService = TestBed.inject(TransportService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Staff query and add missing value', () => {
      const onDuty: IOnDuty = { id: 456 };
      const staff: IStaff = { id: 42661 };
      onDuty.staff = staff;

      const staffCollection: IStaff[] = [{ id: 47933 }];
      jest.spyOn(staffService, 'query').mockReturnValue(of(new HttpResponse({ body: staffCollection })));
      const additionalStaff = [staff];
      const expectedCollection: IStaff[] = [...additionalStaff, ...staffCollection];
      jest.spyOn(staffService, 'addStaffToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ onDuty });
      comp.ngOnInit();

      expect(staffService.query).toHaveBeenCalled();
      expect(staffService.addStaffToCollectionIfMissing).toHaveBeenCalledWith(
        staffCollection,
        ...additionalStaff.map(expect.objectContaining)
      );
      expect(comp.staffSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Transport query and add missing value', () => {
      const onDuty: IOnDuty = { id: 456 };
      const transport: ITransport = { id: 75784 };
      onDuty.transport = transport;

      const transportCollection: ITransport[] = [{ id: 98504 }];
      jest.spyOn(transportService, 'query').mockReturnValue(of(new HttpResponse({ body: transportCollection })));
      const additionalTransports = [transport];
      const expectedCollection: ITransport[] = [...additionalTransports, ...transportCollection];
      jest.spyOn(transportService, 'addTransportToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ onDuty });
      comp.ngOnInit();

      expect(transportService.query).toHaveBeenCalled();
      expect(transportService.addTransportToCollectionIfMissing).toHaveBeenCalledWith(
        transportCollection,
        ...additionalTransports.map(expect.objectContaining)
      );
      expect(comp.transportsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const onDuty: IOnDuty = { id: 456 };
      const staff: IStaff = { id: 277 };
      onDuty.staff = staff;
      const transport: ITransport = { id: 26395 };
      onDuty.transport = transport;

      activatedRoute.data = of({ onDuty });
      comp.ngOnInit();

      expect(comp.staffSharedCollection).toContain(staff);
      expect(comp.transportsSharedCollection).toContain(transport);
      expect(comp.onDuty).toEqual(onDuty);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOnDuty>>();
      const onDuty = { id: 123 };
      jest.spyOn(onDutyFormService, 'getOnDuty').mockReturnValue(onDuty);
      jest.spyOn(onDutyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onDuty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: onDuty }));
      saveSubject.complete();

      // THEN
      expect(onDutyFormService.getOnDuty).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(onDutyService.update).toHaveBeenCalledWith(expect.objectContaining(onDuty));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOnDuty>>();
      const onDuty = { id: 123 };
      jest.spyOn(onDutyFormService, 'getOnDuty').mockReturnValue({ id: null });
      jest.spyOn(onDutyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onDuty: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: onDuty }));
      saveSubject.complete();

      // THEN
      expect(onDutyFormService.getOnDuty).toHaveBeenCalled();
      expect(onDutyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOnDuty>>();
      const onDuty = { id: 123 };
      jest.spyOn(onDutyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ onDuty });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(onDutyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStaff', () => {
      it('Should forward to staffService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(staffService, 'compareStaff');
        comp.compareStaff(entity, entity2);
        expect(staffService.compareStaff).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTransport', () => {
      it('Should forward to transportService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(transportService, 'compareTransport');
        comp.compareTransport(entity, entity2);
        expect(transportService.compareTransport).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
