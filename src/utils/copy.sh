#!/bin/sh
cd F:\myCode\nodejs\blog\logs
copy F:\myCode\nodejs\blog\logs\access.log F:\myCode\nodejs\blog\logs\%date:~0,4%%date:~5,2%%date:~8,2%.access.log
@echo.>F:\myCode\nodejs\blog\logs\access.log