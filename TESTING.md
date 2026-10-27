# Verifiering av Fenix V1

Uppgraderat från SDK 57 till SDK 58 (Expo 58.0.19, React Native 0.88.0, React 19.3.0) den 27 oktober 2026. Automatiska kontroller nedan avser SDK 58 på Windows med Node 22.18.0. Native-flikarna använder den stabila importen expo-router/native-tabs.

## Automatiskt

- `npm run check`: TypeScript utan fel och 13 kontroller godkända.
- `npx expo-doctor`: 20/20 kontroller godkända.
- `npx expo install --check`: beroenden kompatibla med SDK 58:s rekommenderade versioner.
- `npx expo export --platform all`: iOS- och Android-Hermes-bundlar samt webbexport genererade. Detta verifierar paketeringen, inte körning på fysisk enhet eller en signerad APK/IPA.
- `npm audit`: 3 high-träffar via `zod`/`@expo/cli`/`expo`, vilket motsvarar en underliggande advisory. SDK 58-uppgraderingen tog bort de tidigare moderate-varningarna i Router. CLI använder fortfarande Zod 3.25.76. Ingen inkompatibel tvingad huvudversionsändring har gjorts. Granska den kvarvarande varningen igen före publik release.

Testerna använder en minnesbaserad AsyncStorage-implementation med den riktiga lagringsadaptern. De verifierar profil- och nivåvalidering, kombinerade filter, kommadecimaler, tomläge, inloggning/onboarding/utloggning, profiländringar, vänlivscykel, öppen chatt, blockering, JSON-återläsning, skrivfel, trasig lagring och återställning.

## Interaktivt verifierat i webbförhandsvisning före uppgraderingen (SDK 57)

- Onboarding med namn, ålder, demobild, flera sporter och ändring av nivåreglage.
- Tomt formulär visar validering och kan rättas.
- Onboarding landar på Upptäck.
- Sport, område, 5 km-radie och nivå påverkar resultat. Tomläge vid snävt nivåfilter och återhämtning när filtret tas bort.
- Profilbesök och tillbaka behåller tidigare sökläge.
- Skicka och ångra utgående förfrågan, acceptera och avböj inkommande. Räknare och listor uppdateras.
- Starta ny konversation från profil. Skickat meddelande visas och finns kvar efter omladdning. Inget automatiskt svar skapas.
- Redigera bio och profilsvar; ändringarna finns kvar efter omladdning.
- Visuell kontroll vid 390 × 844. Webbförhandsvisningens flikmeny justerades efter kontrollen. Mobilen använder native-flikar.
- Inga konsolfel registrerades i de kontrollerade flödena.

Webbläsarautomationen låste sig när webbförhandsvisningens återställningsdialog öppnades. Återställningens reducer och lagringsroundtrip passerar automatiska tester, men bekräftelsedialogerna behöver verifieras manuellt.

## Återstår på fysisk iOS och Android

Ingen fysisk enhet eller mobil simulator kördes. Följande är inte verifierat på enhet:

1. Starta med Expo Go. Skapa profil och välj bild från bibliotek. Avbryt bildväljaren och prova nekat bildtillträde om systemet visar en behörighetsfråga.
2. Prova alla fem sporters nivåreglage. Kontrollera HCP, självskattad nivå och löptempo.
3. Filtrera, scrolla, öppna profil och gå tillbaka. Kontrollera att filter och scrollposition behålls.
4. Skicka, ångra, acceptera, avböj och ta bort vän. Kontrollera native-bekräftelsen vid borttagning.
5. Skicka meddelande till en person som inte är vän. Kontrollera tangentbord, lång text och att skickaknappen går att nå.
6. Redigera bild, namn, område, sporter, bio och frivilliga svar. Förhandsvisa.
7. Stäng appen helt och öppna igen. Kontrollera profilbild, vänrelationer och meddelanden.
8. Logga ut och fortsätt med samma profil. Återställ sedan demot och kontrollera att välkomstflödet visas och seeddata återställs.
9. Blockera en person. Kontrollera att relation, upptäcksförslag och chatt döljs.
10. Prova liten skärm, stor systemtext, VoiceOver/TalkBack och safe areas. Kontrollera kontrast, fokusordning och sportreglagens tillgänglighet.

## Medvetna begränsningar

- Alla data och kontaktförsök simuleras lokalt. Ingen synk mellan enheter.
- Ett porträtt per profil, med initialer vid bildfel. Vissa demobilder är lågupplösta.
- Demodistanser är avrundade avstånd mellan fasta områdespunkter; ingen GPS eller exakt adress.
- Onboarding är avsedd för vuxna (18–100 år).
- Sökfilter bevaras när man besöker profiler, men återställs vid omstart; profilen och sociala ändringar är beständiga.
- Gamla lokalt valda bildfiler raderas inte automatiskt vid bildbyte/återställning. De försvinner när appens data rensas eller appen avinstalleras.
- Butikspublicering, signering och full enhets-QA ingår inte i denna leverans.
