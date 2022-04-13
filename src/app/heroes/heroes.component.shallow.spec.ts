import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Input } from "@angular/core";

import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe("HeroesComponent (shallow tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  // just copy hero component parts
  // remove styleUrls
  // rename templateUrl to template and make it really easy, like:
  // hero should not necessarily be typed as Hero, as it is a fake component
  // remove export before class
  // ensure to rename that it is obvious that is a fake class
  // add the class to the TestBed declarations
  @Component({
    selector: "app-hero",
    template: "<div></div>",
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }

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
      declarations: [HeroesComponent, FakeHeroComponent],
      // normally you would just inject HeroService with providers: [HeroService]
      // but now when somebody asks for the heroservice, we say use the mock
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      // ignore child component for now
      // this normally may have undesired side effects though (eg a typo in a template)
      // schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should set heroes correctly from the service", () => {
    // lets tell to return some data for us
    // when somebody calls getHeroes we return an observable of this sample data heroes
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // change detection causes lifecycle events to run, eg onInit
    // we could do this ourselves, but that is not how integration testing works
    // we want angular to handle this things
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });

  it("should create one li for each hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    // ensure of course that it is the only li element in the template
    expect(fixture.debugElement.queryAll(By.css("li")).length).toBe(3);
  });
});
