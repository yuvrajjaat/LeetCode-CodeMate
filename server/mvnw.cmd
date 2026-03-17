@REM Maven Wrapper script for Windows
@echo off
setlocal

set "MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6"
set "MAVEN_ZIP=%MAVEN_HOME%\maven.zip"
set "DIST_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip"

if not exist "%MAVEN_HOME%\apache-maven-3.9.6\bin\mvn.cmd" (
    echo Downloading Maven 3.9.6...
    if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"

    echo Downloading from %DIST_URL%
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DIST_URL%' -OutFile '%MAVEN_ZIP%'"

    echo Extracting Maven...
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_HOME%' -Force"
    del "%MAVEN_ZIP%"

    echo Maven installed successfully.
)

"%MAVEN_HOME%\apache-maven-3.9.6\bin\mvn.cmd" %*
