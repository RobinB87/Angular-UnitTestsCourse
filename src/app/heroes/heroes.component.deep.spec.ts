import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Directive, Input } from "@angular/core";

import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { HeroComponent } from "../hero/hero.component";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

// RouterLinkDirectiveStub: add to TestBed declarations
// use it to configure routerLink correctly and not use NO_ERRORS_SCHEMA
@Directive({
  // use [routerLink] as selector, so it will look for the attribute routerLink
  selector: "[routerLink]",
  // in order to have this onClick method fired when the anchor tag is clicked
  // we will listen to a host event:
  //    we listen for a click event (the name of the prop)
  //    the value is the method we are calling
  host: { "(click)": "onClick()" },
})
export class RouterLinkDirectiveStub {
  // the stub itself needs to take in the parameter that is set,
  // the value of the routerlink attribute
  @Input("routerLink") linkParams: any;

  // we want to watch the click event on the DOM element that this click event is on
  // when it is fired, we want to capture the fact that is was clicked
  // and store it with the routerLinks path (the string value of the routerLink attribute in the hero.component.html)
  // we want to know what that value is actually set to, so we can determine if it was configured correctly
  //
  // if navigatedTo is null, it has not been clicked
  // and if it is clicked you can see if the value is correct
  navigatedTo: any = null;

  onClick(): void {
    this.navigatedTo = this.linkParams;
  }
}

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
      declarations: [HeroesComponent, HeroComponent, RouterLinkDirectiveStub],
      providers: [{ provide: HeroService, useValue: mockHeroService }],
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

  it("should add a new hero to the hero list when the add button is clicked", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const name = "Mr. Ice";

    mockHeroService.addHero.and.returnValue(
      of({ id: 5, name: name, strength: 4 })
    );

    // use nativeElement so we have a reference to the underlying DOM element,
    // which we will need to set the value later on
    const inputElement = fixture.debugElement.query(
      By.css("input")
    ).nativeElement;

    // there are several buttons in this template (each hero has one)
    // we know the very first one is the add button
    // we do not want the underlying DOM element, but just the button, so no use of nativeElement
    const addButton = fixture.debugElement.queryAll(By.css("button"))[0];

    // simulate typing Mr. Ice in the input box
    inputElement.value = name;

    // pass in null for the object.
    // In this case the eventObj can be null, as we do not use it in the template, we call add heroName
    addButton.triggerEventHandler("click", null);

    // angular does not automatically update html when underlying values are changed,
    // we have to trigger it again
    fixture.detectChanges();

    const heroText = fixture.debugElement.query(By.css("ul")).nativeElement
      .textContent;

    expect(heroText).toContain(name);
  });
});
