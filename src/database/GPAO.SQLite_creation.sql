create table Article (
	reference varchar(30),
	designation varchar(30),
	type_fabrication_achat varchar(30),
	unite_achat_stock varchar(30),
	delai_en_semaine number,
	prix_standard number,
	lot_de_reapprovisionnement number,
	stock_mini number,
	stock_maxi number,
	pourcentage_de_perte number,
	inventaire number,
	PF_ou_MP_ou_Pi_ou_SE varchar(2)
);

create table Lien_de_nomenclature (
	compose varchar(30),
	composant varchar(30),
	quantite_de_composition number
);

create table Remplacement (
	remplace ref Lien_de_nomenclature,
	remplacant ref Lien_de_nomenclature,
	date_de_remplacement date
);

create table Poste_de_charge (
	numero_section number,
	numero_sous_section number,
	machine number,
	designation varchar(30),
	taux_horaire_ou_forfait number,
	nombre_de_postes number,
	capacite_nominale number,
	type_taux_horaire_ou_forfait varchar(2)
);

create table Operation (
	reference varchar(30),
	numero_operation number,
	machine ref Poste_de_charge,
	main_d_oeuvre ref Poste_de_charge,
	temps_preparation number,
	temps_execution number,
	temps_transfert number,
	libelle_operation varchar(30)
);

create table Mouvement_de_stock (
	reference varchar(30),
	numero_magasin number,
	quantite number,
	periode date,
	entree_ou_sortie number
);
