import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { of } from "rxjs";

describe("HeroesComponent (shallow tests)", () => {
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
      declarations: [HeroesComponent],
      // normally you would just inject HeroService with providers: [HeroService]
      // but now when somebody asks for the heroservice, we say use the mock
      providers: [{ provide: HeroService, useValue: mockHeroService }],
      // ignore child component for now
      schemas: [NO_ERRORS_SCHEMA],
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
});
