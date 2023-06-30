![image](https://github.com/mobileappdevhm23/app-app-37/assets/85286401/044475c6-996a-433d-87b4-b2ace847970f)

Raus aus dem Haus! Bei uns findest du schnell und einfach Aktivitäten und Events in deiner Nähe. 
<br />
Nutzer können sich bei OUT & ABOUT anmelden, um Aktivitäten zu erstellen, für welche sich andere Nutzer anmelden können. 
Wir zeigen dabei Nutzern Empfehlungen in ihrer Umgebung anhand ihrer Präferenzen.

![readme_image4](https://github.com/mobileappdevhm23/app-app-37/assets/85286401/1f6f193c-fbcd-4510-a354-d3abcb550ed7)
[<img src="https://github.com/mobileappdevhm23/app-app-37/assets/85286401/c243abda-4663-4b8e-8b50-189922abd056" alt="michi" width="200"/>](https://www.figma.com/file/szutNTPw0fV6Or757aoZsL/Mobile-Anwendungen?type=design&mode=design&t=OuUVzs6ktL5iHfMX-0)

<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Horizontal-Prototype) </small>

Bevor wir mit dem Entwicklungsprozess unserer App angefangen haben, erstellten wir einen Prototyp in Figma.
Der Prototyp enthält alle für unsere App relevanten Screens und Komponenten. Außerdem haben wir die Struktur anhand des Prototyps festgelegt.

## Frontend
<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Frontend) </small>

Wir haben unsere App mit react-native gebaut und mit Expo Go deployt und getestet. Unsere App besteht dabei aus zwei Flows,
einen für angemeldete und einen für abgemeldete Nutzer. Der Flow für abgemeldete Nutzer besteht aus einem Stack Navigator,
während der angemeldete Flow sowohl einen Tab Bar Navigator als auch mehrere Stack Navigator verwendet.
<br />
Nutzer können sich Aktivitäten anschauen, erstellen und sich für welche anmelden. Ihnen werden dabei anhand von ihrer Position 
und Präferenzen Empfehlungen gestellt, welche sie auch in einer Kartenansicht sehen können.

## Backend
<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Backend) </small>

Für unser Projekt haben wir das Backend aus dem Kurs "Projektmodul Web" als Basis verwendet, um Zeit zu sparen.
Es handelt sich dabei um ein node.js-Backend, welches express.js verwendet, um Requests vom Frontend anzunehmen. Als Datenbank
verwenden wir MongoDB, welches wir mit dem mongoose-Package im Backend ansprechen. 
