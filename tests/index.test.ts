import { Favorites } from "../src/models/favorites";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { server } from "../src/index";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect(); // Close all mongoose connections to close real database connection if it's connected
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

beforeEach(async () => {
  await Favorites.deleteMany({});
  jest.clearAllMocks();
});

describe("Trip Routes", () => {
  describe("GET /trips", () => {
    it("should return 400 if destination or origin is invalid", async () => {
      const res = await request(server)
        .get("/trips")
        .query({
          destination: "invalid",
          origin: "invalid",
          sort_by: "fastest",
        });

      expect(res.status).toBe(400); // Bad Request
      expect(res.text).toBe("You must provide a valid destination");
    });

    it("should return 400 if sort_by is invalid", async () => {
      const res = await request(server)
        .get("/trips")
        .query({ destination: "ATL", origin: "PEK", sort_by: "invalid" });

      expect(res.status).toBe(400); // Bad Request
      expect(res.text).toBe("You must provide a valid sort order");
    });

    it("should return sorted trips by cheapest", async () => {
      const mockTrips = [
        {
          id: "trip1",
          destination: "ATL",
          origin: "PEK",
          duration: 360,
          cost: 300,
          type: "flight",
          display_name: "from PEK to ATL by flight",
        },
        {
          id: "trip2",
          destination: "ATL",
          origin: "PEK",
          duration: 360,
          cost: 200,
          type: "flight",
          display_name: "from PEK to ATL by flight",
        },
      ];

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
        new Response(JSON.stringify(mockTrips), { status: 200 })
      );

      const res = await request(server)
        .get("/trips")
        .query({ destination: "ATL", origin: "PEK", sort_by: "cheapest" });

      expect(res.status).toBe(200); // OK
      expect(res.body[0].cost).toBe(200);
      expect(res.body[1].cost).toBe(300);
    });

    it("should return sorted trips by fastest", async () => {
        const mockTrips = [
          {
            id: "trip1",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 300,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
          {
            id: "trip2",
            destination: "ATL",
            origin: "PEK",
            duration: 248,
            cost: 200,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        ];
  
        (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
          new Response(JSON.stringify(mockTrips), { status: 200 })
        );
  
        const res = await request(server)
          .get("/trips")
          .query({ destination: "ATL", origin: "PEK", sort_by: "fastest" });
  
        expect(res.status).toBe(200); // OK
        expect(res.body[0].duration).toBe(248);
        expect(res.body[1].duration).toBe(360);
      });
  });

  describe("POST /favorites/add", () => {
    it("should return 400 if username or trip is missing", async () => {
      const res = await request(server)
        .post("/favorites/add")
        .send({ username: "" });

      expect(res.status).toBe(400); // Bad Request
      expect(res.text).toBe("Username and trip details are required.");
    });

    it("should return 409 if trip is already in favorites", async () => {
      const mockFavorites = new Favorites({
        username: "testuser",
        trips: [
          {
            id: "trip1",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 300,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        ],
      });

      await mockFavorites.save();

      const res = await request(server)
        .post("/favorites/add")
        .send({
          username: "testuser",
          trip: {
            id: "trip1",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 300,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        });

      expect(res.status).toBe(409); // Conflict
      expect(res.text).toBe(
        "This trip is already in the favorites list for testuser"
      );
    });

    it("should return 201 and add the trip to favorites", async () => {
      const res = await request(server)
        .post("/favorites/add")
        .send({
          username: "testuser",
          trip: {
            id: "trip2",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 200,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        });

      expect(res.status).toBe(201); // Created
      expect(res.body.trips.length).toBe(1);
      expect(res.body.trips[0].id).toBe("trip2");
    });
  });

  describe("GET /favorites/:username", () => {
    it("should return 400 if username is missing", async () => {
      const res = await request(server).get("/favorites/byUsername");

      expect(res.status).toBe(400); // Bad Request
      expect(res.text).toBe("Username is required.");
    });

    it("should return 404 if no favorites found", async () => {
      const res = await request(server).get("/favorites/byUsername?username=testuser");

      expect(res.status).toBe(404); // Not Found
      expect(res.text).toBe("No favorites found for this user.");
    });

    it("should return 200 and the user's favorites", async () => {
      const mockFavorites = new Favorites({
        username: "testuser",
        trips: [
          {
            id: "trip1",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 300,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        ],
      });

      await mockFavorites.save();

      const res = await request(server).get("/favorites/byUsername?username=testuser");

      expect(res.status).toBe(200); // OK
      expect(res.body.trips.length).toBe(1);
      expect(res.body.trips[0].id).toBe("trip1");
    });
  });

  describe("DELETE /favorites/remove", () => {
    it("should return 400 if username or trip ID is missing", async () => {
      const res = await request(server)
        .delete("/favorites/remove")
        .send({ username: "testuser" });

      expect(res.status).toBe(400); // Bad Request
      expect(res.text).toBe("Username and trip ID are required.");
    });

    it("should return 404 if user not found", async () => {
      const res = await request(server)
        .delete("/favorites/remove")
        .send({ username: "testuser", tripId: "trip1" });

      expect(res.status).toBe(404); // Not Found
      expect(res.text).toBe("User not found");
    });

    it("should return 404 if trip is not found in favorites", async () => {
      const mockFavorites = new Favorites({
        username: "testuser",
        trips: [
          {
            id: "trip2",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 200,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        ],
      });

      await mockFavorites.save();

      const res = await request(server)
        .delete("/favorites/remove")
        .send({ username: "testuser", tripId: "trip1" });

      expect(res.status).toBe(404); // Not Found
      expect(res.text).toBe("Trip not found in favorites.");
    });

    it("should return 200 and remove the trip from favorites", async () => {
      const mockFavorites = new Favorites({
        username: "testuser",
        trips: [
          {
            id: "trip1",
            destination: "ATL",
            origin: "PEK",
            duration: 360,
            cost: 300,
            type: "flight",
            display_name: "from PEK to ATL by flight",
          },
        ],
      });

      await mockFavorites.save();

      const res = await request(server)
        .delete("/favorites/remove")
        .send({ username: "testuser", tripId: "trip1" });

      expect(res.status).toBe(200); // OK
      expect(res.body.trips.length).toBe(0);
    });
  });
});
