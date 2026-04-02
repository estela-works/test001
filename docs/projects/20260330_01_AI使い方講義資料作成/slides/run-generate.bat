@echo off
setlocal

set SCRIPT=C:\Users\sezak\OneDrive\Documents\vscode\movie\scripts\generate_slide_images.py
set CLO_DIR=%~dp0..\clo
set INPUT=%CLO_DIR%\main-slides.json
set ILLUST=%CLO_DIR%\illustrations
set OUTPUT=%CLO_DIR%\images
set BATCH=%~dp0batch
set MODEL=models/gemini-3-pro-image-preview
set SIZE=1024x576

if "%1"=="--run" goto run
if "%1"=="--slides" goto partial

:dryrun
echo === DRY-RUN MODE (JSONL only, no API call) ===
echo Input:  %INPUT%
echo Output: %OUTPUT%
python "%SCRIPT%" -i "%INPUT%" --illustrations-dir "%ILLUST%" -o "%OUTPUT%" --batch-dir "%BATCH%" --size %SIZE% --model %MODEL% --dry-run
goto end

:run
echo === BATCH RUN (Pro model, %SIZE%, batch API) ===
echo Input:  %INPUT%
echo Output: %OUTPUT%
python "%SCRIPT%" -i "%INPUT%" --illustrations-dir "%ILLUST%" -o "%OUTPUT%" --batch-dir "%BATCH%" --size %SIZE% --model %MODEL%
goto end

:partial
echo === PARTIAL RUN (specific slides) ===
if "%2"=="" (
    echo Usage: run-generate.bat --slides main-0-01,main-0-02
    goto end
)
python "%SCRIPT%" -i "%INPUT%" --illustrations-dir "%ILLUST%" -o "%OUTPUT%" --batch-dir "%BATCH%" --size %SIZE% --model %MODEL% --slides %2
goto end

:end
endlocal
