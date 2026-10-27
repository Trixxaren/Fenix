const fs = require("node:fs");
const assert = require("node:assert/strict");
const ts = require("typescript");
const Module = require("node:module");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText,
    filename,
  );
const disk = new Map();
let failWrite = false;
const load = Module._load;
Module._load = function (id, ...args) {
  if (id === "@react-native-async-storage/async-storage")
    return {
      getItem: async (key) => disk.get(key) ?? null,
      setItem: async (key, value) => {
        if (failWrite) throw new Error("Disk full");
        disk.set(key, value);
      },
    };
  return load.call(this, id, ...args);
};
const { createSeed, profiles } = require("../src/data/seed.ts");
const { reducer } = require("../src/state/reducer.ts");
const {
  findPeople,
  defaultFilters,
  distance,
  validateProfile,
  levelLabel,
} = require("../src/utils/people.ts");
const {
  saveState,
  loadState,
  STORAGE_KEY,
} = require("../src/state/storage.ts");
let count = 0;
function test(name, fn) {
  fn();
  count++;
  console.log(`✓ ${name}`);
}
async function main() {
  const seed = createSeed();
  test("22 consistent valid profiles and bundled portraits", () => {
    assert.ok(profiles.length >= 20);
    assert.equal(new Set(profiles.map((p) => p.id)).size, profiles.length);
    for (const p of profiles) {
      assert.equal(validateProfile(p), null);
      assert.ok(Object.keys(p.sports).length >= 2);
      assert.ok(fs.existsSync(`assets/portraits/${p.photo.split("-")[1]}.jpg`));
    }
    for (const id of [
      ...Object.keys(seed.relations),
      ...Object.keys(seed.conversations),
    ])
      assert.ok(profiles.some((p) => p.id === id));
  });
  test("Discovery prioritizes shared sports", () => {
    const result = findPeople(profiles, seed, defaultFilters);
    assert.ok(result.length > 10);
    assert.ok(
      Object.keys(result[0].sports).some(
        (s) => seed.profile.sports[s] !== undefined,
      ),
    );
  });
  test("Sport, area, distance, numeric ranges and comma decimals filter", () => {
    const result = findPeople(profiles, seed, {
      sport: "Tennis",
      area: "Solna",
      distance: 5,
      min: "3",
      max: "8",
    });
    assert.ok(result.length);
    assert.ok(
      result.every(
        (p) =>
          p.sports.Tennis >= 3 &&
          p.sports.Tennis <= 8 &&
          distance("Solna", p.area) <= 5,
      ),
    );
    const runs = findPeople(profiles, seed, {
      ...defaultFilters,
      sport: "Löpning",
      min: "5,5",
      max: "6,5",
    });
    assert.ok(runs.length);
    assert.ok(
      runs.every((p) => p.sports.Löpning >= 5.5 && p.sports.Löpning <= 6.5),
    );
  });
  test("Empty results and resetting filters", () => {
    assert.equal(
      findPeople(profiles, seed, {
        ...defaultFilters,
        sport: "Golf",
        min: "53",
        max: "54",
      }).length,
      0,
    );
    assert.ok(findPeople(profiles, seed, defaultFilters).length);
  });
  test("Validation rejects invalid required fields and sport levels", () => {
    for (const edit of [
      { name: " " },
      { age: 17 },
      { age: 20.5 },
      { age: NaN },
      { sports: {} },
      { sports: { Golf: 55 } },
      { photo: "" },
    ])
      assert.ok(validateProfile({ ...seed.profile, ...edit }));
    assert.equal(
      validateProfile({
        ...seed.profile,
        sports: { Golf: -3, Löpning: 5.25, Padel: 1 },
      }),
      null,
    );
    assert.equal(levelLabel("Löpning", 5.25), "5:15 min/km");
  });
  test("Onboarding, editing and logout preserve the profile", () => {
    const profile = {
      ...seed.profile,
      name: "Robin",
      sports: { Golf: 18, Tennis: 3 },
    };
    let s = reducer(seed, { type: "onboard", profile });
    assert.equal(s.loggedIn, true);
    assert.equal(s.onboarded, true);
    s = reducer(s, { type: "profile", profile: { ...profile, bio: "Ny bio" } });
    s = reducer(s, { type: "logout" });
    assert.equal(s.loggedIn, false);
    assert.equal(s.profile.bio, "Ny bio");
    assert.equal(reducer(s, { type: "login" }).profile.name, "Robin");
  });
  test("Send, cancel, accept, decline requests and remove friends", () => {
    let s = reducer(seed, {
      type: "relation",
      id: "person-6",
      value: "outgoing",
    });
    assert.equal(s.relations["person-6"], "outgoing");
    s = reducer(s, { type: "relation", id: "person-6" });
    assert.equal(s.relations["person-6"], undefined);
    s = reducer(s, { type: "relation", id: "person-3", value: "friend" });
    assert.equal(s.relations["person-3"], "friend");
    s = reducer(s, { type: "relation", id: "person-5" });
    assert.equal(s.relations["person-5"], undefined);
    s = reducer(s, { type: "relation", id: "person-1" });
    assert.equal(s.relations["person-1"], undefined);
    assert.equal(seed.relations["person-1"], "friend");
  });
  const message = {
    id: "local-test",
    sender: "me",
    text: "Ska vi spela?",
    time: new Date().toISOString(),
  };
  test("Open chat permits first message without friendship or fake reply", () => {
    const s = reducer(seed, { type: "message", id: "person-10", message });
    assert.equal(s.conversations["person-10"].length, 1);
    assert.equal(s.conversations["person-10"][0].text, message.text);
    assert.equal(s.relations["person-10"], undefined);
  });
  test("Blocking removes relation, hides discovery and prevents contact", () => {
    const s = reducer(seed, { type: "block", id: "person-1" });
    assert.equal(s.relations["person-1"], undefined);
    assert.ok(
      !findPeople(profiles, s, defaultFilters).some((p) => p.id === "person-1"),
    );
    assert.deepEqual(
      reducer(s, { type: "message", id: "person-1", message }),
      s,
    );
    assert.deepEqual(
      reducer(s, { type: "relation", id: "person-1", value: "outgoing" }),
      s,
    );
  });
  assert.equal(await loadState(), null);
  let saved = reducer(seed, {
    type: "onboard",
    profile: { ...seed.profile, name: "Sparad person" },
  });
  saved = reducer(saved, { type: "message", id: "person-10", message });
  saved = reducer(saved, {
    type: "relation",
    id: "person-10",
    value: "outgoing",
  });
  await saveState(saved);
  assert.deepEqual(await loadState(), saved);
  count++;
  console.log("✓ Complete state survives save/reload without reseeding");
  failWrite = true;
  await assert.rejects(saveState(seed));
  failWrite = false;
  assert.deepEqual(await loadState(), saved);
  count++;
  console.log("✓ Failed storage write preserves committed state");
  disk.set(STORAGE_KEY, "{bad json");
  await assert.rejects(loadState());
  count++;
  console.log("✓ Corrupt storage reports error");
  await saveState(reducer(saved, { type: "reset" }));
  assert.deepEqual(await loadState(), seed);
  count++;
  console.log("✓ Reset restores initial logged-out demo");
  console.log(`\n${count} checks passed.`);
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
