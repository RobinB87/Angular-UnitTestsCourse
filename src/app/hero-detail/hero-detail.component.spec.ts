import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { of } from "rxjs";

import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "./../hero.service";

describe("HeroDetailComponent", () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    // we could just use jasmine for the mockActivatedRoute,
    // but some hand coding is a bit more easy here
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          // dummy method
          get: () => {
            return "3";
          },
        },
      },
    };

    mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
    mockLocation = jasmine.createSpyObj(["back"]);

    TestBed.configureTestingModule({
      // fix error of Can't bind to 'ngModel' since it isn't a known property of 'input'
      // by importing FormsModule, which is as straightforward as:
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HeroService, useValue: mockHeroService },
        // import Location manually, it is from @angular/common
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(
      of({ id: 3, name: "SuperDude", strength: 100 })
    );
  });

  it("should render hero name in a h2 tag", () => {
    fixture.detectChanges();

    // could use the debugElement but since we need the text content,
    // which is on the native element anyway, it is just as convenient to use nativeElement
    // watch out, detail page uses ALL CAPS
    expect(fixture.nativeElement.querySelector("h2").textContent).toContain(
      "SUPERDUDE"
    );
  });

  // with fakeAsync and tick you avoid 'really' waiting 250 ms
  // with flush you tell to look at the 'zone' for any tasks that are waiting
  // if there are any, then fastforward the clock until those tasks are finished
  it("should call updateHero when save is called", fakeAsync(() => {
    // empty object as code ignores return value
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    // tick(250);
    flush();

    expect(mockHeroService.updateHero).toHaveBeenCalled();
  }));
});
