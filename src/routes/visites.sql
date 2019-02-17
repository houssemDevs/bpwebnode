WITH
  Affaire (agence, affaire, intitule, client)
  AS
  (
    select
      code_agence,
      Code_Affaire,
      IntituleAffaire,
      MaitreOuvrage
    from Taffaire
  ),
  Client (code, nom)
  AS
  (
    select
      code,
      nom
    from Bmaitre_ouvrage
  ),
  Ing (code, nom)
  AS
  (
    select
      Matricule,
      RTRIM(LTRIM(Nom)) + ' ' + RTRIM(LTRIM(Prénom))
    from Busers
  ),
  Visite1 (affaire, site, num, date, duree, observation, tax, env, ing)
  AS
  (
    select
      Code_Affaire,
      Code_site,
      Num,
      Date,
      DureeVisite,
      ObsVisite,
      TauxAvancementChantier,
      Environnement,
      Controleur
    from GVisiteChantier
  ),
  Visite (Agence, Affaire, Intitule, Site, Ingenieur, NumSeq, Date, TauxAvancement, Duree, Observation, Environnement)
  AS
  (
    select
      aff.agence,
      vs.affaire,
      aff.intitule,
      vs.site,
      ing.nom,
      vs.num,
      vs.[date],
      vs.tax,
      vs.duree,
      vs.observation,
      vs.env
    from Visite1 vs
      left join Affaire aff on aff.affaire = vs.affaire
      left join Client cl on aff.client = cl.nom
      left join Ing ing on vs.ing = ing.code
  )

select *
from Visite
$WHERE