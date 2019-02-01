
REM =========================================
REM = Script de lancement et compilation    =
REM =========================================

REM Relance le script dans une console qui ne se ferme pas après exécution
REM afin de pouvoir voir la sortie
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cls

cd ..\public
call node_modules\.bin\parcel.cmd build --public-url /public/dist/js/ js\main.js scss\main.scss

cd ..
call npm start