![image](assets/readme_image0.png)

Raus aus dem Haus! Bei uns findest du schnell und einfach Aktivitäten und Events in deiner Nähe. 
<br />
Nutzer können sich bei OUT & ABOUT anmelden, um Aktivitäten zu erstellen, für welche sich andere Nutzer anmelden können. 
Wir zeigen dabei Nutzern Empfehlungen in ihrer Umgebung anhand ihrer Präferenzen.

<br />

![readme_image4](assets/readme_image1.png)
<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Horizontal-Prototype) | [Link zum Prototyp](https://www.figma.com/file/szutNTPw0fV6Or757aoZsL/Out-%26-About?type=design&node-id=0-1&t=AlwzI9RIDRQnX8Vo-0) </small>

Bevor wir mit dem Entwicklungsprozess unserer App angefangen haben, erstellten wir einen Prototyp in Figma.
Der Prototyp enthält alle für unsere App relevanten Screens und Komponenten. Außerdem haben wir die Struktur anhand des Prototyps festgelegt.

<br />

![image](assets/readme_image2.png)
<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Frontend) </small>

Wir haben unsere App mit react-native gebaut und mit Expo Go deployt und getestet. Unsere App besteht dabei aus zwei Flows,
einen für angemeldete und einen für abgemeldete Nutzer. Der Flow für abgemeldete Nutzer besteht aus einem Stack Navigator,
während der angemeldete Flow sowohl einen Tab Bar Navigator als auch mehrere Stack Navigator verwendet.
<br />
Nutzer können sich Aktivitäten anschauen, erstellen und sich für welche anmelden. Ihnen werden dabei anhand von ihrer Position 
und Präferenzen Empfehlungen gestellt, welche sie auch in einer Kartenansicht sehen können.

<br />

![image](assets/readme_image3.png)
<small>Vollständige Dokumentation: [Wiki](https://github.com/mobileappdevhm23/app-app-37/wiki/Backend) </small>

Für unser Projekt haben wir das Backend aus dem Kurs "Projektmodul Web" als Basis verwendet, um Zeit zu sparen.
Es handelt sich dabei um ein node.js-Backend, welches express.js verwendet, um Requests vom Frontend anzunehmen. Als Datenbank
verwenden wir MongoDB, welches wir mit dem mongoose-Package im Backend ansprechen. 
