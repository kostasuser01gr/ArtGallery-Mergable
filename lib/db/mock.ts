import photosJson from "@/data/photos.json";
import constructionJson from "@/data/construction.json";
import eventsJson from "@/data/events.json";
import {
  ConstructionSchema,
  PhotoEventSchema,
  PhotoFilters,
  PhotoSchema,
} from "@/lib/types";

const photos = PhotoSchema.array().parse(photosJson);
const constructions = ConstructionSchema.array().parse(constructionJson);
const events = PhotoEventSchema.array().parse(eventsJson);

export function mockGetPhotos(filters?: PhotoFilters) {
  return photos
    .filter((photo) => (filters?.tag ? photo.tags.includes(filters.tag) : true))
    .filter((photo) => {
      if (!filters?.search) {
        return true;
      }
      const query = filters.search.toLowerCase();
      return (
        photo.title.toLowerCase().includes(query) ||
        photo.description.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function mockGetPhotoById(id: string) {
  return photos.find((photo) => photo.id === id) ?? null;
}

export function mockGetConstruction(id: string) {
  return constructions.find((entry) => entry.photoId === id) ?? null;
}

export function mockTrackView(photoId: string) {
  return {
    photoId,
    trackedAt: new Date().toISOString(),
  };
}

export function mockEvents() {
  return events;
}
