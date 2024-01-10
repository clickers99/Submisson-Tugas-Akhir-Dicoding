import { openDB } from "idb";
import CONFIG from "../globals/config";

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const FavoriteRestaurantIdb = {
  async getRestaurant(id) {
    if (!id) {
      return undefined; // Explicitly return undefined
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllRestaurants() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putRestaurant(restaurant) {
    if (!Object.prototype.hasOwnProperty.call(restaurant, "id")) {
      return undefined; // Explicitly return undefined if id is not present
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, restaurant);
  },
  async deleteRestaurant(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async searchRestaurants(query) {
    // Assuming the logic for searchRestaurants needs correction as well
    if (!query) {
      return [];
    }
    const allRestaurants = await this.getAllRestaurants();
    return allRestaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(query.toLowerCase()));
  },
};

export default FavoriteRestaurantIdb;
