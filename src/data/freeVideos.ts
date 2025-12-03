export interface FreeVideoEntry {
  key: string;
  image: string;
  url?: string;
  fallbackTitle: string;
  alwaysUnlocked?: boolean;
}

export const FREE_VIDEO_ENTRIES: FreeVideoEntry[] = [
  {
    key: "video1",
    image: "/img/videos/video1.jpg",
    url: "https://youtu.be/wvZH-IC4G_U",
    fallbackTitle: "AULA 1",
    alwaysUnlocked: true,
  },
  {
    key: "video2",
    image: "/img/videos/video2.jpg",
    url: "https://youtu.be/zYOeQNq347c",
    fallbackTitle: "AULA 2",
  },
  {
    key: "video3",
    image: "/img/videos/video3.jpg",
    url: "https://youtu.be/TYejsohIFWI",
    fallbackTitle: "AULA 3",
  },
  {
    key: "video4",
    image: "/img/videos/video4.jpg",
    url: "https://youtu.be/H2SlLWFlnCU",
    fallbackTitle: "AULA 4",
  },
  {
    key: "video5",
    image: "/img/videos/video5.jpg",
    url: "https://youtu.be/QqwPbX5HRTY",
    fallbackTitle: "AULA 5",
  },
  {
    key: "video6",
    image: "/img/videos/video6.jpg",
    url: "https://youtu.be/wvZH-IC4G_U",
    fallbackTitle: "AULA 6",
  },
  {
    key: "video7",
    image: "/img/videos/video7.jpg",
    url: "https://youtu.be/sfi5eyJqq2k",
    fallbackTitle: "AULA 7",
  },
];

export const ALWAYS_AVAILABLE_VIDEO_URLS = new Set(
  FREE_VIDEO_ENTRIES
    .filter((video) => video.alwaysUnlocked && video.url)
    .map((video) => (video.url as string).trim()),
);
