## UI

<hr>

## FEATURES
- Gestion des recompenses qui doivent roll sur une table ou roll un dé
- Clean up de la codebase pour une base solide pour la V2
<hr>

## EXTERNAL

<hr>

## BUGS
- Parfois la ligne `userConnections.get(user.twitchId)!.send(JSON.stringify(user))` du fichier websocket ligne 245 le userconnections.get est vide, ca arrive quand on fait des tests et qu'on laisse le serveur ouvert alors qu'on quitte tout en front et ca créer des especes de client fantôme qu'il essaye de contacter alors qu'ils n'existent pas dans la map de userConnections, impossible a reproduire depuis qu'on fait tout bien en prod, mais y'a peut etre un truc a creuser

<hr>

## TESTS

<hr>

## DONE
