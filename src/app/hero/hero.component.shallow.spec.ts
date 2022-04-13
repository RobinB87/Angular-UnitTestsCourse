import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { HeroComponent } from "./hero.component";

// name shallow is just for extra explanation in this project
// the real power of an integration test is to test the template as well, next to the component
describe("HeroComponent (shallow tests)", () => {
  // by strongly typing you can use the methods
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    // testbed allows us to test the component AND it's template running together
    // we create a special module just for testing purposes, via the testbed
    // the same properties of a normal module can be used, in this case only the declarations
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    // returns a component fixture: this is basically a wrapper for a component
    fixture = TestBed.createComponent(HeroComponent);
  });

  // hero is obtained via input prop
  // as the hero component is running solo without a parent, input can not be used
  // hence set it ourselves manually
  it("should have the correct hero", () => {
    fixture.componentInstance.hero = { id: 1, name: "SuperDude", strength: 3 };

    // this test does not need to detect changes, but we add it in anyway
    // this gives a warning in the console of the browser: this is because the template has a routerLink
    // routerLink is part of the routerModule, but we haven't brought in this routerModule in our testbed
    // fixture.detectChanges();

    // when you want to not try to validate the template (due to routerLink error), you could add to the testBed:
    // schemas: [NO_ERRORS_SCHEMA],

    expect(fixture.componentInstance.hero.name).toEqual("SuperDude");
  });

  it("should render the hero name in an anchor tag <a></a> - by native element", () => {
    fixture.componentInstance.hero = { id: 1, name: "SuperDude", strength: 3 };

    // to test DOM element use nativeElement that represents the container for the template
    // is standard html dom element (same api you would use in plain old javascript - querySelector)
    // code below gets all text between <a></a>: hence a space and the name
    // toEqual would be a bit to brittle, as you might change the text a bit, for example add a ! or a space

    // to tell angular to actually implement the bindings {{hero.id}} and {{hero.name}}
    // those will not get updated untill changeDetection runs! (example before)
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("a").textContent).toContain(
      "SuperDude"
    );
  });

  it("should render the hero name in an anchor tag <a></a> - by debug element", () => {
    fixture.componentInstance.hero = { id: 1, name: "SuperDude", strength: 3 };
    fixture.detectChanges();

    // debug element is like the native element, but it is more of a wrapper which applies on the root of the template
    // this might feel more familiar when you are used to jQuery
    // the debug element is a wrapper around the actual DOM node
    // similar to the fixture being a wrapper around a component
    // in this case does not really matter if you use debug or native
    // but debugElement can for example access a routerLink directive
    let deAnchor = fixture.debugElement.query(By.css("a"));
    expect(deAnchor.nativeElement.textContent).toContain("SuperDude");
  });
});
