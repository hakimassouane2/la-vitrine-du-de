## UI

- Virer les derniers trucs de materialify (Overlay) (Necessaire v1 ? ou osef ?)

<hr>

## FEATURES

<hr>

## EXTERNAL

<hr>

## BUGS

<hr>

## TESTS
- Faire un test d'hebergement en ligne de l'extension sur twitch + tester les scripts (surtout celui qui donne des points)

<hr>

## DONE
- Faire un sort des items de la boutique par rareté + prix ✔️
- Faire un sort des items de l'inventaire par rareté + prix ✔️
- Faire un scroll des items ✔️
- La taille de l'inventaire se casse lorsqu'il y a moins de 2 items ✔️
- Faire un onclick plus sombre sur les boutons (acheter / utiliser / vendre) ✔️
- Faire une UI pour la scrollbar ✔️
- Globaliser la class scroll ✔️
- Trouver un fiver pour faire une icone de dé de volonté stylé ✔️
- Faire une UI pour le stock de l'inventaire ✔️
- Regler le probleme de bouton qui double de taille dans l'inventaire quand on click ✔️
- Mettre un scroll sur le panel admin ✔️
- Faire une UI en haut a gauche avec le compteur d'XP (bloqué) + nom du mec ✔️
- Faire un script d'export des recompenses Twitch ✔️
- Faire l'importation de toutes les rewards Twitch dans la db locale / db finale ✔️
- Regler le probleme du boutton actif quand on click au démarage avant que les panels apparaissent (c'était à cause de l'animation qui causé des bugs graphiques) ✔️
- Brainstormer une solution pour l'inventaire en cas de dé-sub (on créer une box qui stock les cartes en trop jusqu'au prochain sub) ✔️
- Rajouter des tooltips sur les bouttons pour expliquer la raison du l'achat / l'utilisation impossible 
  Genre "Tu dois suivre la chaine pour pouvoir acheter cette carte" ou "Tu as l'inventaire plein" ✔️
- Virer les coin du panelBackground et reimporter l'image pour eviter une UI brouillone ✔️
- Ecrire un message basique dans le chat twitch quand on utilise un bonus (Avec la lib Twurple) ✔️
- Regler le fait que lorsqu'on clique sur un bouton disabled, il s'allume quand même (visuellement il devient plus bright) ✔️
- Checker pourquoi seul les cartes OR sont rangé dans le mauvais ordre de prix ? (Ca ne classe que par rarity) | J'avais import avec des string pour les chiffres comme un con ✔️
- Refaire l'UI pour l'admin ✔️
- Rajouter deux trois fonction dans l'admin (+ X points - X points en plus du reglage de point direct) ✔️
- Regler le fait que dans l'inventaire les cartes de récompenses s'etendent a la mort (virer materialify et checker les col) ✔️
- Faire le ruban sur le coté pour ouvrir / fermer l'extension ✔️
- Fixer les badges ✔️
- Refaire L'ui des cartes (badge + titre plus visible) ✔️
- Limite taille maximal inventaire ✔️
- Quand on achete un objet le bouton d'achat se grise et affiche le message "vous devez suivre la chaine pour pouvoir acheter cette carte"
  (Ce probleme arrive car le user reçu par le ping du front est modifié dans le middleware et on lui set son isFollowing a true mais on ne save pas
  ca dans la DB puis quand on achete une carte dans la route buy on renvoie le user update de la db et donc il n'a pas le isFollowing a true jusqu'au prochain ping) ✔️
- Mettre l'extension sur la chaine LVDD ✔️
- Générer un token utilsateur pour pouvoir gerer les scopes avec ce token plutot qu'un app token (https://dev.twitch.tv/docs/authentication#getting-tokens) ✔️
- Gerer la gestion des subs et des follows avec l'eventSub de twitch a la palce de faire un call API pour eveiter les rate limits
  (en gros on recoit un event des qu'un mec sub / follow la chaine, on va en db avec son id twitch et si il existe on update la variable de check) ✔️
- Subscribe a l'event user update pour pouvoir update le nom d'un user en db afin de ne pas avoir de diff entre son nom twitch et son nom sur l'extension #deadname (Pas possible pour l'instant car faut sub a chaque id de user et ca va niquer nos rate limit) ✔️
- Checker le maxInventorySize en back ✔️
- Checker la rarity d'une recompense lors d'un use en back ✔️
- Regler le cooldown global & Regler l'utilisation rapide de deux recompenses ✔️
- Probleme lorsque le timer arrive a 00:00 il passe a -1:59 et n'est pas update (Réactivité svelte) ✔️
- Quand on rajoute des points en db a un utilisateur en front ca n'update pas les bouttons (toujours grisé meme si assez de point) (Réactivité svelte) (Apparement fixé ?) ✔️
- Mettre une reactivité sur les bouttons d'achat qui doivent rechecker l'inventaire reactivement ✔️
- Rajouter JWT en sécurité via querry parameter pour les websocket en plus du TwitchId ✔️
- Faire un script de bulk delete sur les subscriptions twitch sur un postman ✔️
- Check de sécurité les routes API ✔️
- Gérer la twitch signature pour sécuriser les webhooks event twitch ✔️
- Faire l'ui du message d'erreur quand on est pas connecter sur twitch ✔️
- Mettre des messages plus clair en front ✔️
- Remplacer le terme object / récompenses / item par "Carte" partout ✔️
- More snackbars en réponse de l'API (en foutre partout) (plus de feedback pour l'utilisateur) ✔️
- Les cartes neutre s'affichent en blanc plutot qu'en jaune (Probleme de tailwind et de cache parce que en forcant l'affichage des couleurs, ca a fini par remarcher tout seul) ✔️
- Implementer un check api twitch pour verifier si des subscribe d'event sont deja en cours au demarrage pour eviter de refaire les call (potentiellement checker si ils y a des
  subscribe, faire une suppression de tout les subscribe, et refaire les subscribe pour eviter des problemes ?) ✔️
- Faire un client de chat global dans le back ✔️
- Créer un compte twitch "La volonté du bot" et linker son oauth token pour pouvoir envoyer des messages via ce nom sur le chat de la chaine "La volonté du dé" ✔️
- Tester le mode overlay pour verifier le CSS ✔️
- Ajouter un systeme de filtre de récompenses avec un isActive et un gameType ✔️
- Faire une conversion / 3 de toutes les tailles de l'ui pour avoir une extension qui est okay sur l'overlay (tout est trop gros) ✔️
- Faire un panel des personnages avec des infos sommaires mais histoire de pouvoir gerer un dropdown avec les persos dans les popups ✔️
- Encore un petit bug de timer, quand on utilise une carte ou bien le timer global qui s'affiche sur toutes les cartes mais aussi sur la carte qu'on vient d'utiliser
  alors qu'il faudrait normalement afficher le timer le plus long (normalement le cooldown user) ✔️
- Quelque fois pour une raison bizzare, les lastUsed des items dans l'inventaire du joueur se transforme en string plutot qu'en date ?? (Potentielement reglé avec les null
  dans le fichier item-for-db.json a verifier sur la durée) ✔️
- Peut etre afficher le timer des cartes sur la boutique juste au dessus du bouton d'achat ? Pour prevenir les gens de combien de temps ils vont devoir attendre ✔️
- Peut etre afficher le timer des cartes sur la boutique juste au dessus du bouton d'achat ? Pour prevenir les gens de combien de temps ils vont devoir attendre ✔️
- Faire l'ui des popups ✔️
- Potentiellement rajouter des popup de confirmation pour : Acheter, vendre, utiliser un objet (Etes vous sur de vouloir acheter/use/vendre X pour Y points ?), et target une cible sur les boutons utiliser : si on peut cibler quelqu'un > popup de choix de cible, sinon popup de confirmation d'utilisation ✔️
- Rajouter un converter de string en date dans l'item routes car on a des "inventoryData.lastUsed.getTime is not a function" car desfois la date est en string
  en db au lieu d'une date, et ce petit fix nous permet d'eviter de se casser les couilles pour la V1, on test la conversion et si ca marche on part avec ca (ou alors faut trouver le vrai probleme) ✔️
