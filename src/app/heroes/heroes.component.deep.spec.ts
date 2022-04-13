import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { HeroComponent } from "../hero/hero.component";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

// normally you would not create seperate files for shallow and deep tests
describe("HeroesComponent (deep tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "SpiderDude", strength: 8 },
      { id: 2, name: "Wonderful Woman", strength: 24 },
      { id: 3, name: "Superguy", strength: 55 },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent, HeroComponent],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should render each hero as a HeroComponent", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // run ngOnInit
    // change detection will run on all child components
    fixture.detectChanges();

    // find child elements
    // under the hood in angular, a component is actually a subclass of a directive
    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    expect(heroComponentsDEs.length).toEqual(3);

    for (let i = 0; i < heroComponentsDEs.length; i++) {
      expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it(`should call heroService.deleteHero when the Hero Component's
  delete button is clicked`, () => {
    const HERO_INDEX = 0;

    // to watch and see if a method is called, use jasmine spyOn
    spyOn(fixture.componentInstance, "delete");

    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    // just want the code to be able to call stopPropagation as this occurs in the method as well,
    // and we do not want the test to error out.
    heroComponentsDEs[HERO_INDEX].query(By.css("button")).triggerEventHandler(
      "click",
      { stopPropagation: () => {} }
    );

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(
      HEROES[HERO_INDEX]
    );
  });

  // just tell the child component to raise the event
  // and test if the parent's component is listening to that event
  // and responding to it correctly
  it(`should call heroService.deleteHero when the Hero Component is told
  to raise the delete event`, () => {
    const HERO_INDEX = 0;

    // to watch and see if a method is called, use jasmine spyOn
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );

    // grab the hero components class and 'help it understand it is a hero component' by casting
    // in this case you can emit undefined, as the template handles the delete with it's own ngFor binding
    (<HeroComponent>(
      heroComponentsDEs[HERO_INDEX].componentInstance
    )).delete.emit(undefined);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(
      HEROES[HERO_INDEX]
    );
  });
});
