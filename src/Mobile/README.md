# Lafie.Mobile (à venir)

Cible **MAUI Blazor Hybrid** (desktop/mobile). Non scaffoldée : charge de travail MAUI absente.

Création ultérieure :
```
dotnet workload install maui
dotnet new maui-blazor -n Lafie.Mobile -o src/Mobile/Lafie.Mobile
dotnet sln Lafie.slnx add src/Mobile/Lafie.Mobile/Lafie.Mobile.csproj
```
Client fin : consomme `Lafie.Api`, UI partagée via RCL (cf. docs/architecture/README.md §9).
