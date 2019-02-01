
REM =========================================
REM =   Development watch (watch server)    =
REM =========================================

REM Relance le script dans une console qui ne se ferme pas après exécution
REM afin de pouvoir voir la sortie
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )

cls

cd ..
call node_modules\.bin\nodemon.cmd -i public index.js