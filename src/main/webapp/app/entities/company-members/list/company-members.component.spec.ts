import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CompanyMembersService } from '../service/company-members.service';

import { CompanyMembersComponent } from './company-members.component';

describe('CompanyMembers Management Component', () => {
  let comp: CompanyMembersComponent;
  let fixture: ComponentFixture<CompanyMembersComponent>;
  let service: CompanyMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'company-members', component: CompanyMembersComponent }]),
        HttpClientTestingModule,
        CompanyMembersComponent,
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
      .overrideTemplate(CompanyMembersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CompanyMembersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CompanyMembersService);

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
    expect(comp.companyMembers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to companyMembersService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCompanyMembersIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCompanyMembersIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
