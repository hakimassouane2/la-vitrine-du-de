## UI

<hr>

## FEATURES
- Gestion des recompenses qui doivent roll sur une table ou roll un dé
<hr>

## EXTERNAL

<hr>

## BUGS
- Parfois la ligne `userConnections.get(user.twitchId)!.send(JSON.stringify(user))` du fichier websocket ligne 245 le userconnections.get est vide, ca arrive quand on fait des tests et qu'on laisse le serveur ouvert alors qu'on quitte tout en front et ca créer des especes de client fantôme qu'il essaye de contacter alors qu'ils n'existent pas dans la map de userConnections, impossible a reproduire depuis qu'on fait tout bien en prod, mais y'a peut etre un truc a creuser

<hr>

## TESTS

<hr>

## DONE
- Rajouter un message a la place du loading... qui indique que le chargement infini est potenetiellement a cause de ad block ✔️
- La liste des cibles sur une récompenses doit prendre en compte le flag isActive des personnages ✔️
- Agrandir un tout petit peux le texte du timer sur la boutique ✔️
- Lisser les points (230 points / Heure sur twitch donc 230 / (60 /  5) = 20 points toutes les 5 minutes) dans le back ✔️
- Gestion de l'admin en live ( pas besoin de reload l'extension pour avoir la liste des gens en db, que ca s'update direct en gros via websocket ? ) ✔️
- Gestion des follows / sub quand le mec l'est déjà avant de créer son compte en db dans le back ✔️
- Quand on switch de tabs dans l'admin ca détruit la webscoket a cause du if / else ✔️
- Corriger popup / timer ✔️
- Le texte envoyé dans le chat lors d'un achat d'objet bug (il faut aussi le separé en deux car les \n ne sont pas pris en charge par twitch) ✔️
- Le texte de la prochaine utilisation devrait être centré dans le shop ✔️
- Augmenter un peu la taille de l'UI afin que ce soit plus lisible en petit écran ✔️
- Faire du beau texte sur l'écran des personnages ✔️

_______________________________________

rollTables

{
  name: 'monsters'
  game: string // DND, MYTHRAS, ELDEN RING, ...
  metadata: json
  nbElements: 3
  elements: string[] // ["Skel", "Goblin", "Orc"] // [1, 2, 3]
  weight: []
  weightGolbin: number[] ["0.5", "10", "4"]
  weightMV: number[] ["20", "1", "0"]
},
{
  name: string
  game: string // DND, MYTHRAS, ELDEN RING, ...
  metadata: json
  nbElements: 3
  elements: string[] // ["epee", "bouclier", "wrfwefewfew"] // [1, 2, 3]
},

monsters
  {
    id

  }
