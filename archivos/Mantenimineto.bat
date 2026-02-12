::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAnk
::fBw5plQjdG8=
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSDk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off
chcp 65001 > nul
title Mantenimiento del PC - Menú Interactivo
color 1F
mode con: cols=80 lines=25

::Menu principal
:inicio
cls
echo =================================
echo      MANTENIMIENTO DEL PC
echo =================================
echo 1. Limpiar archivos temporales
echo 2. Liberar caché DNS
echo 3. Desfragmentar disco duro
echo 4. Generar informe del sistema
echo 5. Buscar y eliminar malware
echo 6. Vaciar la papelera de reciclaje 🗑️
echo 7. Copia de seguridad
echo 8. Reparacion de Disco
echo 9. Salir
echo =================================
set /p opcion="Selecciona una opción (1-9): "

::Funciones Menu
if "%opcion%"=="1" goto limpiar_temporales
if "%opcion%"=="2" goto liberar_dns
if "%opcion%"=="3" goto desfragmentar
if "%opcion%"=="4" goto generar_informe
if "%opcion%"=="5" goto buscar_malware
if "%opcion%"=="6" goto vaciar_papelera
if "%opcion%"=="7" goto copia_seguridad
if "%opcion%"=="8" goto reparar_disco
if "%opcion%"=="9" goto salir

::Limpiar Temporales

:limpiar_temporales
echo Limpiando archivos temporales...
del /s /q %temp%\*.* > nul 2>&1
del /s /q C:\Windows\Temp\*.* > nul 2>&1
echo Archivos temporales eliminados.
pause
goto inicio

::DNS
:liberar_dns
echo Liberando caché de DNS...
ipconfig /flushdns
echo Caché de DNS liberada.
pause
goto inicio

::Desfragmentar Disco Duro
:desfragmentar
echo Desfragmentando el disco duro...
set /p confirmar="¿Deseas desfragmentar el disco duro? (s/n): "
if /I "%confirmar%"=="s" (
    defrag C: > nul
    echo Desfragmentación completada.
) else (
    echo Desfragmentación omitida.
)
pause
goto inicio

::Generar Informe del Sistema
:generar_informe
echo Generando informe del sistema...
systeminfo > C:\informe_sistema.txt
if errorlevel 1 (
    echo Hubo un problema al generar el informe. Verifica los permisos.
) else (
    echo Informe guardado como C:\informe_sistema.txt.
)
pause
goto inicio

::Buscar y Eliminar Malware
:buscar_malware
echo Iniciando búsqueda de malware...
set /p confirmar="¿Deseas usar Windows Defender para buscar malware? (s/n): "
if /I "%confirmar%"=="s" (
    echo Ejecutando escaneo completo. Esto puede tardar varios minutos...
    start /b cmd /c "%ProgramFiles%\Windows Defender\MpCmdRun.exe" -Scan -ScanType 2 > %temp%\FullScanOutput.txt
    echo Escaneando... Por favor espera.
    timeout /t 10 > nul
    echo Comprobando resultados...
    type %temp%\FullScanOutput.txt
    echo Resultados guardados en: %temp%\FullScanOutput.txt
) else (
    echo Escaneo omitido.
)
pause
goto inicio

::Vaciar Papelera de Reciclaje
:vaciar_papelera
echo Vaciando la papelera de reciclaje...
rd /s /q %systemdrive%\$Recycle.Bin
if errorlevel 1 (
    echo Hubo un problema al vaciar la papelera. ¿Estás ejecutando como administrador?
) else (
    echo Papelera de reciclaje vaciada con éxito. 🗑️
)
pause
goto inicio

::Copia de Seguridad
:copia_seguridad
echo Iniciando copia de seguridad...
set /p origen="Introduce la ruta de la carpeta a respaldar: "
set /p destino="Introduce la ruta de destino para la copia de seguridad: "
xcopy %origen% %destino% /E /H /C /I
echo Copia de seguridad completada.
pause
goto inicio

:vaciar_papelera
echo Vaciando la papelera de reciclaje...
rd /s /q %systemdrive%\$Recycle.Bin
if errorlevel 1 (
    echo Hubo un problema al vaciar la papelera. ¿Estás ejecutando como administrador?
) else (
    echo Papelera de reciclaje vaciada con éxito. 🗑️
)
pause
goto inicio


:reparar_disco
echo =================================
echo         REPARACIÓN DE DISCO
echo =================================
set /p unidad="Introduce la letra de la unidad a reparar (ejemplo: C): "
echo Iniciando reparación de errores en el disco %unidad%...
chkdsk %unidad%: /F /R
if errorlevel 1 (
    echo Hubo un problema durante la reparación. Verifica los permisos.
) else (
    echo Reparación completada con éxito.
)
pause
goto inicio