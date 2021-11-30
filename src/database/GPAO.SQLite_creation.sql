create table Article (
	reference varchar(30),
	designation varchar(30),
	type_fabrication_achat varchar(30) not null,
	unite_achat_stock varchar(30) not null,
	delai_en_semaine number not null,
	prix_standard number,
	lot_de_reapprovisionnement number,
	stock_mini number,
	stock_maxi number,
	pourcentage_de_perte number,
	inventaire number,
	PF_ou_MP_ou_Pi_ou_SE varchar(2),
	constraint Articlepk primary key(reference),
	constraint Articleunique unique(designation)
);

create table Lien_de_nomenclature (
	compose varchar(30),
	composant varchar(30),
	quantite_de_composition number not null,
	constraint Lien_de_nomenclature_pk primary key(compose,composant),
	constraint Lien_de_nomenclature_fk_1 foreign key(compose) references Article(reference) on delete cascade,
	constraint Lien_de_nomenclature_fk_2 foreign key(composant) references Article(reference) on delete cascade
);

create table Remplacement (
	remplace ref Lien_de_nomenclature not null,
	remplacant ref Lien_de_nomenclature not null,
	date_de_remplacement date,
	constraint Remplacement_check check(remplace <> remplacant)
);

create table Poste_de_charge (
	numero_section number,
	numero_sous_section number,
	machine number,
	designation varchar(30),
	taux_horaire_ou_forfait number,
	nombre_de_postes number,
	capacite_nominale number,
	type_taux_horaire_ou_forfait varchar(2),
	constraint Poste_de_charge_pk primary key(numero_section,numero_sous_section,machine),
	constraint Poste_de_charge_check_1 check(machine = 0 or machine = 1),
	constraint Poste_de_charge_check_2 check(type_taux_horaire_ou_forfait = 'TH' or type_taux_horaire_ou_forfait = 'F')

);

create table Operation (
	reference varchar(30),
	numero_operation number,
	machine ref Poste_de_charge,
	main_d_oeuvre ref Poste_de_charge,
	temps_preparation number,
	temps_execution number,
	temps_transfert number,
	libelle_operation varchar(30),
	constraint Operation_pk primary key(reference,numero_operation),
	constraint Operation_fk1 foreign key(reference) references Article(reference) on delete cascade,
	constraint Operation_check check(machine <> main_d_oeuvre)
);

create table Mouvement_de_stock (
	reference varchar(30),
	numero_magasin number,
	quantite number,
	periode date,
	entree_ou_sortie number,
	constraint Mouvement_de_stock_pk primary key(reference,periode,entree_ou_sortie),
	constraint Mouvement_de_stock_fk foreign key(reference) references Article(reference) on delete cascade,
	constraint Mouvement_de_stock_check check(entree_ou_sortie = 0 or entree_ou_sortie = 1)
);



insert into Article values('ROUE50','roue de camion','achat par lot','unite',6,1.5,500,500,2000,null,1850,'Pi');
insert into Article values('ES000','essieu monte','fabr. par lot','unite',2,null,500,750,1500,null,null,'SE');
insert into Article values('CH005','chassis monte','fabr. par lot','unite',1,null,300,null,900,null,null,'SE');

insert into Article values('H000','conteneur bleu','fabr. par lot','unite',1,null,150,350,800,null,null,'SE');
insert into Article values('H001','conteneur bleu special','fabr. a la commande','unite',1,null,150,350,null,null,null,'SE');

insert into Article values('CD100','camion demenagement bleu','pf fabr. par lot','unite',2,null,200,null,600,null,null,'PF');

insert into Lien_de_nomenclature values('ES000','ROUE50',2);
insert into Lien_de_nomenclature values('CH005','ES000',2);
insert into Lien_de_nomenclature values('CD100','CH005',1);

insert into Lien_de_nomenclature values('CD100','H000',1);
insert into Lien_de_nomenclature values('CD100','H001',1);

insert into Remplacement select ref(ln1),ref(ln2),sysdate from Lien_de_nomenclature as ln1,Lien_de_nomenclature as ln2 where
	ln1.compose = 'CD100' and ln2.compose = 'CD100' and ln1.composant = 'H000' and ln2.composant = 'H001';

insert into Poste_de_charge values(500,450,1,'Rectifieuse',80,1,39,'TH');
insert into Poste_de_charge values(500,450,0,'Rectifieur',80,1,39,'TH');
/*
insert into Operation_ select 'ES000',020,ref(machine),ref(main_d_oeuvre),0.5,0.05,0.2,'Rectification' from
Poste_de_charge as machine,Poste_de_charge as main_d_oeuvre where machine.designation = 'Rectifieuse' and main_d_oeuvre.designation = 'Rectifieur';
*/