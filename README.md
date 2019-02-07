# Planex

Planex is a school exam scheduler made for [INDBG](http://indbg.be/), a Belgian school, as part of my end-of-studies/graduation project. _It's a work in progress and documentation is available mainly in French_.

![](docs/images/screenshot.png?raw=true)

## Installation

### Windows

Pour installer Planex sur un ordinateur Windows, il est d'abord nécessaire d'installer les programmes suivants:

-   [nodejs](https://nodejs.org/en/): la version "Current"
-   [python](https://www.python.org/downloads/release/python-372/): la version "Windows x86-64 executable installer"
-   [xampp](https://www.apachefriends.org/fr/index.html)

Une fois installés, vous devez télécharger le code source du projet (depuis Git ou en tant que ZIP) et ouvrir un invite de commande Windows dans le dossier de Planex. Les commandes suivantes sont à entrer (une par une):

```txt
pip install --user pyschedule simplejson
npm install
npm run build
```

Assurez-vous que le logiciel XAMPP est lancé et que "Apache" et "MySQL" sont lancés dans l'application. Rendez vous sur `http://localhost/phpmyadmin` pour importer la base de données. Une fois cela fait copiez le fichier `config.default.js` et nommez la copie `config.js`. Si vous avez changé le nom d'utilisateur/mot de passe par défaut de MySQL, il faudra modifier ce fichier pour qu'il corresponde.

Finalement, Planex peut être lancé grâce à la commande suivante:

```txt
node index.js
```
