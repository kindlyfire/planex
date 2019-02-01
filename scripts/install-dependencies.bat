
REM =========================================
REM = Script d'installation des dépendances =
REM =========================================

REM Relance le script dans une console qui ne se ferme pas après exécution
REM afin de pouvoir voir la sortie
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cls

REM Installer les dépendances
cd ..
call npm install

cd public
call npm install

cd ..