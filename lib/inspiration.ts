export const inspiration = [
  { file: "inspiration-01", title: "A country afternoon", prompt: "An editorial portrait beside a chestnut horse in a sunlit country courtyard, warm natural light", ratio: "3 / 4", position: "center" },
  { file: "inspiration-02", title: "Sailing into gold", prompt: "A sailboat crossing a quiet harbor at sunset, glowing gold reflections, painterly brushwork", ratio: "9 / 16", position: "center" },
  { file: "inspiration-03", title: "Another tomorrow", prompt: "A futuristic black sports car beneath monumental architecture, a lone figure above, cinematic sci-fi atmosphere", ratio: "4 / 5", position: "center" },
  { file: "inspiration-04", title: "Light takes flight", prompt: "A white bird spreading its wings above reflective water at sunrise, luminous clouds, intricate feathers", ratio: "9 / 16", position: "center" },
  { file: "inspiration-05", title: "The scenic route", prompt: "A sunlit European canal with a stone bridge and colorful houses, lush foliage, hand-painted animation style", ratio: "1 / 1", position: "center" },
  { file: "inspiration-06", title: "Somewhere slower", prompt: "Traditional mountain village surrounded by waterfalls, flowering trees and misty peaks, intricate fantasy landscape", ratio: "3 / 4", position: "center" },
  { file: "inspiration-07", title: "Soft surrealism", prompt: "An avant-garde fashion portrait surrounded by floating flowers and warm translucent shapes, surreal editorial styling", ratio: "4 / 5", position: "center" },
  { file: "inspiration-08", title: "After midnight", prompt: "Futuristic fashion editorial beside a metallic car under a star-filled sky, chrome textures, cool teal lighting", ratio: "9 / 16", position: "center" },
  { file: "inspiration-09", title: "Beyond the ordinary", prompt: "A mysterious figure in an enchanted forest of luminous purple crystals, elaborate fantasy costume, dramatic light", ratio: "3 / 4", position: "center" },
  { file: "inspiration-10", title: "Emerald muse", prompt: "A close-up fashion portrait with an ornate emerald floral headdress, translucent green jewels, moody studio lighting", ratio: "4 / 5", position: "center" },
  { file: "inspiration-11", title: "A slice of the cosmos", prompt: "A dark chocolate layer cake decorated with a crescent moon and golden star, celestial pastry photography", ratio: "1 / 1", position: "center" },
  { file: "inspiration-12", title: "Catch a little magic", prompt: "An elegant hand reaching toward a luminous celestial butterfly, stars and galaxies, delicate embroidered fabric", ratio: "9 / 16", position: "center" },
] as const;

export function inspirationHref(prompt: string) {
  return "/generatepage?" + new URLSearchParams({ prompt });
}
