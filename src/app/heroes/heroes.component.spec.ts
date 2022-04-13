import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component";

describe("HeroesComponent", () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "SpiderDude", strength: 8 },
      { id: 2, name: "Wonderful Woman", strength: 24 },
      { id: 3, name: "Superguy", strength: 55 },
    ];

    // create mock object that we can control.
    // we can tell which methods it has and what does methods should return when called
    // and we can ask it, what methods were called in a test
    // if the object has no methods, we leave it blank
    // so it has three methods in our case (from the heroService)
    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    component = new HeroesComponent(mockHeroService);
  });

  describe("delete", () => {
    it("should remove the indicated hero from the heroes list", () => {
      // we need our mockobject to return an observable when deletHero is called:
      //
      // we are just subscribing to this method and do not care what DATA it contains inside
      // .and. is a mock object created by jasmine - AND we can tell it to return the VALUE that we pass in the returnValue method
      // one of the easiest ways to create an observable is using rxjs' of
      // observable that has one value, true, which satisfies the requirements of this test,
      // as we do not care about the DATA, as there is solely subscribed to
      mockHeroService.deleteHero.and.returnValue(of(true));

      // populate heroes property with sample data
      // ngOnInit (getHoroes) is not running as we are performing an isolated test
      // could also call onInit here
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      // state based test: test that state of component has changed
      expect(component.heroes.length).toBe(2);
    });

    // interaction test: check if a certain interaction happened between tested class and some collaborated class (eg here; the hero service)
    // this method is needed as we need to ensure the deleteHero method in the service was called
    it("should call deleteHero with the correct hero", () => {
      // quite some duplication here, but that is okay, as we are telling a story inside of these tests
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      // with toHaveBeenCalledWith you ensure that this method has been called
      // toHaveBeenCalledWith can provide a parameter
      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    });

    it("should subscribe to the deleteHero call", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));

      const spyObj = spyOn(mockHeroService.deleteHero(), "subscribe");

      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(spyObj).toHaveBeenCalled();
    });
  });
});
