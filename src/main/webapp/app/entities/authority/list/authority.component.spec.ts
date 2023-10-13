import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthorityService } from '../service/authority.service';

import { AuthorityComponent } from './authority.component';

describe('Authority Management Component', () => {
  let comp: AuthorityComponent;
  let fixture: ComponentFixture<AuthorityComponent>;
  let service: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'authority', component: AuthorityComponent }]),
        HttpClientTestingModule,
        AuthorityComponent,
      ],
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
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(AuthorityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AuthorityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AuthorityService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.authorities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to authorityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAuthorityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAuthorityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
