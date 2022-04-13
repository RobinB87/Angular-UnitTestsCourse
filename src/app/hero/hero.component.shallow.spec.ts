import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HeroComponent } from "./hero.component";

// name shallow is just for extra explanation in this project
describe("HeroComponent (shallow tests)", () => {
  // by strongly typing you can use the methods
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    // testbed allows us to test the component AND it's template running together
    // we create a special module just for testing purposes, via the testbed
    // the same properties of a normal module can be used, in this case only the declarations
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
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
    fixture.detectChanges();

    expect(fixture.componentInstance.hero.name).toEqual("SuperDude");
  });
});
