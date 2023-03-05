import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BulletinService } from '../service/bulletin.service';

import { BulletinComponent } from './bulletin.component';

describe('Bulletin Management Component', () => {
  let comp: BulletinComponent;
  let fixture: ComponentFixture<BulletinComponent>;
  let service: BulletinService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'bulletin', component: BulletinComponent }]), HttpClientTestingModule],
      declarations: [BulletinComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BulletinComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BulletinComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BulletinService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.bulletins?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bulletinService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBulletinIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBulletinIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
