# Lafie.Mobile (à venir)

Cible **MAUI Blazor Hybrid** (desktop/mobile). Non scaffoldée : charge de travail MAUI absente,
**et** volontairement **isolée du build backend** (les workloads MAUI casseraient `dotnet build Lafie.slnx`).

## Règle d'isolation

- `Lafie.slnx` = **backend + Web + Ui + tests** (aucun projet MAUI).
- `Lafie.Mobile` vivra dans sa **propre solution** `Lafie.Mobile.slnx`, référençant la RCL partagée `clients/Lafie.Ui`.

## Création ultérieure

```
dotnet workload install maui
dotnet new maui-blazor -n Lafie.Mobile -o clients/Lafie.Mobile
dotnet add clients/Lafie.Mobile reference clients/Lafie.Ui
dotnet new sln -n Lafie.Mobile   # solution dédiée (hors Lafie.slnx)
dotnet sln Lafie.Mobile.slnx add clients/Lafie.Mobile/Lafie.Mobile.csproj clients/Lafie.Ui/Lafie.Ui.csproj
```

Client **fin** : consomme `Lafie.Api` (HTTP), UI partagée via `Lafie.Ui` (cf. `docs/architecture/README.md` §9).
