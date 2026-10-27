import { AppState, Area, Profile, Sport } from "./models";

// Fictional identities. Portraits are bundled locally; no profile data leaves the device.
const rows: [string, number, Area, Sport[], string, string[]][] = [
  [
    "Elin Andersson",
    28,
    "Södermalm",
    ["Tennis", "Löpning"],
    "En boll, lite sol och kaffe efteråt. Söker en tennispartner som gillar långa dueller lika mycket som jag.",
    ["Kaffe", "Helgutflykter", "Surdegsbröd"],
  ],
  [
    "Oscar Lindberg",
    32,
    "Vasastan",
    ["Golf", "Padel"],
    "Tidiga golfrundor och sena middagar. Hänger gärna kvar på rangen tills det sitter.",
    ["Matlagning", "Resor", "Musik"],
  ],
  [
    "Maja Bergström",
    26,
    "Kungsholmen",
    ["Padel", "Löpning"],
    "Springer helst längs vattnet. På padelbanan skrattar jag minst lika mycket som jag vinner.",
    ["Bad", "Böcker", "Hundar"],
  ],
  [
    "Viktor Nilsson",
    35,
    "Nacka",
    ["Golf", "Squash"],
    "Nyinflyttad i Nacka! Letar efter ett skönt gäng att spela med efter jobbet.",
    ["Vandring", "Fotografi", "Kaffe"],
  ],
  [
    "Sara Ek",
    30,
    "Solna",
    ["Tennis", "Padel"],
    "Dubbel är dubbelt så kul. Spelar gärna en vardagskväll och testar ett nytt middagsställe efter.",
    ["Mat", "Konst", "Resor"],
  ],
  [
    "Axel Johansson",
    24,
    "Södermalm",
    ["Löpning", "Squash"],
    "Tränar inför mitt första halvmaraton. Sällskap gör distansen lite kortare.",
    ["Vinyl", "Film", "Natur"],
  ],
  [
    "Linnea Holm",
    38,
    "Bromma",
    ["Golf", "Tennis"],
    "Golf på helgen, tennis när livet tillåter. Gillar gott sällskap mer än en perfekt score.",
    ["Trädgård", "Bakning", "Hav"],
  ],
  [
    "Filip Svensson",
    29,
    "Östermalm",
    ["Padel", "Squash"],
    "Tävlingsinstinkt finns, men humöret är alltid bra. En snabb match på lunchen?",
    ["Design", "Mat", "Skidor"],
  ],
  [
    "Ebba Lund",
    27,
    "Vasastan",
    ["Tennis", "Löpning"],
    "Lite ringrostig på tennis, desto bättre på att hitta bra fik. Vill spela oftare!",
    ["Keramik", "Kaffe", "Böcker"],
  ],
  [
    "Anton Sjöberg",
    42,
    "Täby",
    ["Golf", "Padel"],
    "Spelat golf i tio år och padel i tio veckor. Delar gärna tips och tar gärna emot nya.",
    ["Familj", "Grillning", "Segling"],
  ],
  [
    "Nora Dahl",
    23,
    "Huddinge",
    ["Löpning", "Tennis"],
    "Lugna kilometer i skogen är min grej. Alltid redo för nya stigar och nya vänner.",
    ["Natur", "Musik", "Foto"],
  ],
  [
    "Elias Lind",
    31,
    "Lidingö",
    ["Squash", "Golf"],
    "Squash håller mig igång under vintern, golf tar över när solen kommer.",
    ["Jazz", "Matlagning", "Hav"],
  ],
  [
    "Alma Wik",
    34,
    "Nacka",
    ["Padel", "Löpning"],
    "En social löpare som gärna byter asfalt mot skog. Padel funkar i alla väder.",
    ["Hundar", "Bad", "Yoga"],
  ],
  [
    "Hugo Sandberg",
    25,
    "Solna",
    ["Tennis", "Squash"],
    "Letar efter någon att nöta serve med. Lovar att plocka upp bollarna!",
    ["Spel", "Film", "Cykling"],
  ],
  [
    "Julia Westin",
    45,
    "Kungsholmen",
    ["Golf", "Löpning"],
    "Har hittat tillbaka till golfen. En avslappnad niohålsrunda är en perfekt kväll.",
    ["Böcker", "Resor", "Arkitektur"],
  ],
  [
    "William Falk",
    33,
    "Bromma",
    ["Padel", "Tennis"],
    "Spelar för att det är kul, men säger aldrig nej till ett jämnt tiebreak.",
    ["Musik", "Mat", "Vandring"],
  ],
  [
    "Olivia Ström",
    28,
    "Östermalm",
    ["Squash", "Löpning"],
    "Squashnybörjare som gärna lär sig tillsammans med någon. Pepp ingår!",
    ["Konst", "Kaffe", "Dans"],
  ],
  [
    "Ludvig Nyberg",
    37,
    "Täby",
    ["Golf", "Tennis"],
    "Morgonmänniska med en extra tennisracket. Ses gärna innan arbetsdagen börjar.",
    ["Natur", "Matlagning", "Skidor"],
  ],
  [
    "Agnes Norén",
    22,
    "Södermalm",
    ["Löpning", "Padel"],
    "Pluggar, springer och försöker lära mig bandeja. Träning blir bättre tillsammans.",
    ["Foto", "Bad", "Musik"],
  ],
  [
    "Isak Wall",
    40,
    "Lidingö",
    ["Tennis", "Squash"],
    "Före detta klubbspelare med mer glädje än prestige. Gärna regelbunden träning.",
    ["Segling", "Kaffe", "Historia"],
  ],
  [
    "Sofia Blom",
    36,
    "Vasastan",
    ["Golf", "Löpning"],
    "Njuter av gröna fairways och gröna parker. Lugn runda och bra samtal?",
    ["Trädgård", "Vinyl", "Bakning"],
  ],
  [
    "Adam Fors",
    29,
    "Huddinge",
    ["Padel", "Squash"],
    "Nya i stan? Jag med. Söker spelkompisar som vill hitta en rutin tillsammans.",
    ["Film", "Mat", "Resor"],
  ],
];
export const profiles: Profile[] = rows.map(
  ([name, age, area, sports, bio, interests], i) => ({
    id: `person-${i + 1}`,
    name,
    age,
    area,
    photo: `portrait-${i + 1}`,
    bio,
    interests,
    sports: Object.fromEntries(
      sports.map((sport, j) => [
        sport,
        sport === "Golf"
          ? 8 + ((i * 3) % 35)
          : sport === "Löpning"
            ? 4.5 + (i % 5) * 0.5
            : 2 + ((i + j) % 7),
      ]),
    ),
    answers: {
      "Min perfekta söndag…": [
        "En tidig match, ett dopp och en riktigt lång frukost.",
        "Ut i naturen utan brådska. Gärna med kaffe i termosen.",
        "Sovmorgon, lite sport och middag med vänner.",
      ][i % 3],
      ...(i % 2 === 0
        ? {
            "Jag söker någon att…":
              "Hitta en skön träningsrutin och skratta tillsammans med.",
          }
        : {}),
    },
  }),
);
export function createSeed(): AppState {
  return {
    version: 1,
    loggedIn: false,
    onboarded: false,
    profile: {
      id: "me",
      name: "Alex",
      age: 29,
      area: "Södermalm",
      photo: "portrait-23",
      bio: "Alltid sugen på en match och en kaffe efteråt.",
      sports: { Tennis: 5, Padel: 4, Löpning: 5.5 },
      interests: ["Kaffe", "Natur", "Musik"],
      answers: {},
    },
    relations: {
      "person-1": "friend",
      "person-2": "friend",
      "person-4": "friend",
      "person-3": "incoming",
      "person-5": "incoming",
      "person-8": "outgoing",
    },
    blocked: [],
    readAt: {},
    conversations: {
      "person-1": [
        {
          id: "m1",
          sender: "them",
          text: "Hej! Såg att du också spelar tennis. Brukar du spela på Zinken?",
          time: "2026-10-26T15:30:00Z",
        },
        {
          id: "m2",
          sender: "me",
          text: "Ja, ofta! Vore kul att köra en match någon dag.",
          time: "2026-10-26T15:34:00Z",
        },
        {
          id: "m3",
          sender: "them",
          text: "Vad kul! Jag kan på torsdag. Kaffe efteråt? ☕",
          time: "2026-10-26T15:36:00Z",
        },
      ],
      "person-2": [
        {
          id: "m4",
          sender: "them",
          text: "Sugen på att testa en niohålsrunda i helgen?",
          time: "2026-10-25T10:15:00Z",
        },
      ],
      "person-4": [
        {
          id: "m5",
          sender: "me",
          text: "Välkommen till gänget! Hur länge har du spelat squash?",
          time: "2026-10-24T17:10:00Z",
        },
      ],
    },
  };
}
