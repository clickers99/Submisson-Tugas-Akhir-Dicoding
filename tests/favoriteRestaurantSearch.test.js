import FavoriteRestaurantSearchPresenter from "../src/scripts/views/pages/liked-restaurant/favorite-restaurant-search-presenter";
import FavoriteRestaurantIdb from "../src/scripts/data/favorite-restaurant-idb";

describe("Searching restaurants", () => {
  let presenter;
  let favoriteRestaurants;

  const searchRestaurants = (query) => {
    const queryElement = document.getElementById("query");
    queryElement.value = query;
    queryElement.dispatchEvent(new Event("change"));
  };

  const setRestaurantSearchContainer = () => {
    document.body.innerHTML = `
      <div id="restaurant-search-container">
        <input id="query" type="text">
        <div class="restaurant-result-container">
          <ul class="restaurants"></ul>
        </div>
      </div>
    `;
  };

  beforeEach(() => {
    setRestaurantSearchContainer();
    favoriteRestaurants = FavoriteRestaurantIdb;

    jest
      .spyOn(favoriteRestaurants, "searchRestaurants")
      .mockImplementation((query) => {
        if (query === "restaurant a") {
          return Promise.resolve([
            { id: 111, name: "restaurant abc" },
            { id: 222, name: "ada juga restaurant abcde" },
            { id: 333, name: "ini juga boleh restaurant a" },
          ]);
        }
        return Promise.resolve([]);
      });

    jest.spyOn(favoriteRestaurants, "getAllRestaurants").mockResolvedValue([]);
    jest.spyOn(favoriteRestaurants, "putRestaurant").mockResolvedValue({});
    jest.spyOn(favoriteRestaurants, "deleteRestaurant").mockResolvedValue({});

    presenter = new FavoriteRestaurantSearchPresenter({
      favoriteRestaurants,
    });
  });

  describe("When query is not empty", () => {
    it("should be able to capture the query typed by the user", async () => {
      await searchRestaurants("restaurant a");
      expect(presenter.latestQuery).toEqual("restaurant a");
    });

    it("should ask the model to search for restaurants", async () => {
      await searchRestaurants("restaurant a");
      expect(favoriteRestaurants.searchRestaurants).toHaveBeenCalledWith(
        "restaurant a"
      );
    });

    it("should show the found restaurants", async () => {
      await searchRestaurants("restaurant a");
      expect(document.querySelectorAll(".restaurant").length).toEqual(3);
    });

    it("should show the title of the found restaurants", async () => {
      await searchRestaurants("restaurant a");
      const restaurantNames = document.querySelectorAll(".restaurant__title");
      expect(restaurantNames.item(0).textContent).toEqual("restaurant abc");
      expect(restaurantNames.item(1).textContent).toEqual(
        "ada juga restaurant abcde"
      );
      expect(restaurantNames.item(2).textContent).toEqual(
        "ini juga boleh restaurant a"
      );
    });
  });

  describe("When query is empty", () => {
    it("should capture the query as empty", async () => {
      await searchRestaurants(" ");
      expect(presenter.latestQuery.length).toEqual(0);
    });

    it("should show all favorite restaurants", async () => {
      await searchRestaurants(" ");
      expect(favoriteRestaurants.getAllRestaurants).toHaveBeenCalled();
    });
  });
});
