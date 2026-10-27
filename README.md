# Fenix ↗

Social mobilapp för att hitta sportkompisar i Stockholm. React Native, Expo SDK 58, TypeScript och Expo Router. V1 är ett lokalt demo utan backend, riktiga konton, lösenord eller externa API-integrationer.

## Kör på mobilen

Kräver Node.js 22.13+ (22 LTS) och Expo Go med SDK 58-stöd.

```sh
npm ci
npm start
```

Skanna QR-koden med Expo Go (Android) eller Kamera (iOS). Mobilen och datorn ska kunna nå varandra på samma nätverk. Tillåt Node genom Windows-brandväggen om anslutningen blockeras. Ingen betaltjänst eller EAS-inloggning krävs.

På fysisk iPhone kräver Expo Go att terminalens Expo CLI och Expo Go är inloggade på **samma Expo-konto**. Inloggning på expo.dev ensam loggar inte in terminalen. Kör `npx expo login`, kontrollera med `npx expo whoami` och logga in på samma konto via kontosymbolen i Expo Go. Detta är Expos utvecklingsverktyg; Fenix har fortfarande bara lokal demoinloggning.

### Om webbläsarinloggning kraschar på Windows

Om `npx expo login` kraschar med `cmd.exe /c start ... exited with non-zero code: 1`, stäng av automatisk webbläsaröppning för just inloggningen.

I Git Bash:

```sh
BROWSER=none npx expo login
```

Låt terminalen fortsätta vänta. Kopiera **den nya länken som kommandot skriver ut** och öppna den manuellt i webbläsaren på samma dator. Slutför inloggningen där och vänta tills terminalen bekräftar att den lyckats. En gammal länk från en kraschad process fungerar inte eftersom dess lokala callback-server har stängts.

I PowerShell är motsvarande kommando:

```powershell
$env:BROWSER = 'none'
npx expo login
Remove-Item Env:BROWSER
```

Kontrollera sedan kontot och starta om servern:

```sh
npx expo whoami
npx expo start --clear
```

Logga in på samma konto i Expo Go och skanna den nya QR-koden. Se [Expos felsökningsguide för inloggning](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/).

`npm run android` öppnar en installerad Android-emulator. `npm run web` ger en kompletterande förhandsvisning. Mobilappen är huvudprodukten.

## Flöden

- Demoprofil eller onboarding i tre steg med demobild/bildbibliotek.
- Upptäck med stora profilkort, gemensamma sportintressen och närhet som sortering.
- Sport-, områdes-, avstånds- och nivåfilter. Området flyttar sökningens mittpunkt; radien räknas därifrån. Nivåfält tillämpas när inmatningen lämnas.
- HCP för golf, min/km för löpning och tydligt märkt självskattning 1–10 för övriga sporter. Nivåfilter kan tas bort.
- Personliga profiler, frivilliga profilsvar, intressen och profilredigering med förhandsvisning.
- Ömsesidiga vänrelationer: skicka, ångra, acceptera, avböj och ta bort.
- Öppen chatt utan krav på vänskap. Inga automatiska svar eller verkliga mottagare.
- Blockering döljer personen och chatten, tar bort vänrelationen och hindrar ny kontakt.
- Utloggning behåller lokala ändringar. Återställning under Profil ersätter dem med ursprunglig demodata och visar välkomstflödet igen.

## Struktur och lagring

```text
src/app/           Expo Router: fyra flikar, onboarding, profiler, chatt
src/components/    UI, formulär, profilkort och porträtt
src/data/          Datamodeller och 22 fiktiva svenska profiler
src/state/         Reducer, AsyncStorage-adapter och React-provider
src/utils/         Filtrering, demodistanser och validering
src/theme.ts       Gemensamma färger och typografi
assets/portraits/  Lokala demoporträtt
scripts/test.cjs   Domän- och lagringstester
```

AsyncStorage-nyckel: `fenix.local.v1`. Data läses före navigation; seed skriver inte över sparade ändringar. Skrivningar serialiseras och bekräftas innan UI uppdateras. Vid fel finns senaste sparade tillstånd och formulärutkast kvar. Trasig lagring visar försök igen/återställ. Bilder från bildbiblioteket kopieras till appens dokumentkatalog på mobil. Gamla valda bilder kan ligga kvar tills appens data rensas eller appen avinstalleras.

Detta är inte säker lagring för känsliga uppgifter. Varje installation har separat demotillstånd. Inga personuppgifter lämnar enheten.

## Verifiering

```sh
npm run check
npx expo install --check
npx expo-doctor
npm run export
```

Tester täcker validering, filter, tomma resultat, vänlivscykel, öppen chatt, blockering, profilredigering, inloggning/utloggning, sparning/återläsning, lagringsfel och återställning. Lagringstester använder den riktiga adaptern med simulerad AsyncStorage-disk. Se TESTING.md för resultat och mobilchecklista.

På Windows kan Hermes nekas att skriva i en sandboxad temporärmapp. Ange då TEMP och TMP till en skrivbar temporärmapp före `npm run export`. Ändringen behövs inte på en vanlig installation.

## Bilder och avgränsning

Statiska exempelporträtt från [Random User](https://randomuser.me/) och [Unsplash](https://unsplash.com/) paketeras lokalt. Namn, åldrar, områden, biografier och relationer är helt fiktiva och beskriver inte människorna på bilderna. Appen anropar inte tjänsten. Initialer visas vid bildfel. V1 har en bild per profil.

Ingen bokning, GPS, karta, kalender, träningsspårning, betalning, push, socialt inläggsflöde eller riktig autentisering ingår. Butikspublicering och signering är separata steg.

## Om Expo Go visar fel SDK-version

Projektet använder SDK 58. Hämta senaste koden och starta om Metro med tom cache:

```sh
git pull
npm ci
npx expo start --clear
```

Stoppa en tidigare Expo-server med Ctrl+C först och skanna sedan den nya QR-koden. SDK-versionen i projektet måste matcha Expo Go-appen på mobilen.
