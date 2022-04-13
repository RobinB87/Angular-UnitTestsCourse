import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("HeroService", () => {
  // HeroService expects httpClient and a messageService in ctor
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(["add"]);
    TestBed.configureTestingModule({
      // HttpClientTestingModule is used tell angular to provide our mock http client
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService },
      ],
    });

    // HttpTestingController used to get a handle to our http client service,
    // so we can adjust it and control it inside our tests
    // .inject acts basically as the dependency injection registry
    httpTestingController = TestBed.inject(HttpTestingController);

    // in the testbed we are not creating the service yet, we only tell the TestBed to create a HeroService,
    // so we do not have a handle to this service. We create that handle with:
    service = TestBed.inject(HeroService);
  });

  describe("getHero", () => {
    // can also inject a service with the format below, add inject from @angular/core/testing,
    // add it as an array and pass it as a param
    // we also add the testing controller
    // order of the params is important!
    //
    // However, this is much more unreadable, so above method is preferred
    //
    // it("should call get with the correct url", inject(
    //   [HeroService, HttpTestingController],
    //   (service: HeroService, controller: HttpTestingController) => {
    //     // call getHero()
    //     service.getHero(4);
    //     // test that the url was correct
    //     controller.
    //   }
    // ));

    it("should call get with the correct url", () => {
      // call getHero()
      // subscribe because otherwise nothing happends
      const ID = 4;
      service.getHero(ID).subscribe((hero) => {
        // an expect example in this case
        expect(hero.id).toBe(ID);
      });

      // test that the url was correct
      // expectOne: pass in expected url
      const req = httpTestingController.expectOne(`api/heroes/${ID}`);

      // the flush method let's us decide what data to send back when the call is made
      req.flush({ id: ID, name: "SuperDude", strength: 100 });

      // another expect example in this case
      // without both examples the test would already be sufficient as well
      expect(req.request.method).toBe("GET");

      // verify that only the requests happen that we specifically set and expect
      // eg, when adding an extra service.getHero(3).subscribe() the code would otherwise not fail
      httpTestingController.verify();
    });
  });
});
