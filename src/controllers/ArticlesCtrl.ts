import { NextFunction, Request, Response } from 'express';
import { Article, articles, ArticleType } from '../models/Articles';

// TODO: Import from db
const Articles = new Array<Article>();

const { error, value } = articles.validate({
  reference: 'CD100',
  designation: 'camion demenagement bleu',
  type_fabrication_achat: 'pf fabr. par lot',
  unite_achat_stock: 'unite',
  delai_en_semaine: 2,
  lot_de_reapprovisionnement: 200,
  stock_maxi: 600,
  PF_ou_MP_ou_Piece_ou_SE: ArticleType.PF,
});
if (error === undefined) {
  console.log('Article validé (succès) : ' + value.reference);
  Articles.push({
    reference: 'CD100',
    designation: 'Camion demenagement bleu',
    type_fabrication_achat: 'Fab. par lot',
    unite_achat_stock: 'unite',
    delai_en_semaine: 2,
    lot_de_reapprovisionnement: 200,
    stock_maxi: 600,
    PF_ou_MP_ou_Piece_ou_SE: ArticleType.PF,
  });
} else console.log('Article invalidé (échec) : ' + error.message);

export function getArticles(req: Request, res: Response, next: NextFunction) {
  // Test: 'curl http://localhost:3000/api/GPAO/Articles'
  res.json(Articles);
}

export function getArticle(req: Request, res: Response, next: NextFunction) {
  const article = Articles.find(
    (a: Article) => a.reference === req.params.reference
  );
  if (!article)
    res
      .status(404)
      .send(
        '<h1 style="color: red;">Not found: ' + req.params.reference + '</h1>'
      );
  res.send(article);
}

export function addArticle(req: Request, res: Response, next: NextFunction) {
  /* Création article (Windows 10) :
      $CC201 = @{
          reference = 'CC201'
          designation = 'Camion citerne rouge'
          type_fabrication_achat = 'Fab. a la commande'
          unite_achat_stock = 'unite'
          delai_en_semaine = 2
          lot_de_reapprovisionnement = 150
          stock_maxi = 600
          PF_ou_MP_ou_Piece_ou_SE = 'PF'
      }|ConvertTo-Json
      echo $CC201
      */
  /* (Windows 10) :
      $Nouvel_article = @{
          Body        = $CC201
          ContentType = 'application/json'
          Method      = 'POST'
          Uri         = 'http://localhost:1963/api/GPAO/Nouvel_article'
      }
      */
  /* (Windows 10) :
      Invoke-RestMethod @Nouvel_article
      */
  // console.log(JSON.stringify(request.body));
  const article: Article = req.body;

  const { error, value } = articles.validate({
    reference: article.reference, // Unicity required as well...
    designation: article.designation, // Unicity required as well...
    type_fabrication_achat: article.type_fabrication_achat,
    unite_achat_stock: article.unite_achat_stock,
    delai_en_semaine: article.delai_en_semaine,
    lot_de_reapprovisionnement: article.lot_de_reapprovisionnement,
    stock_maxi: article.stock_maxi,
    PF_ou_MP_ou_Piece_ou_SE: article.PF_ou_MP_ou_Piece_ou_SE,
  });

  if (error === undefined) {
    res.status(201).json({
      message: 'Article validé (succès) : ' + value.reference,
    });
    Articles.push(article);
  } else {
    res.status(400).json({
      message: 'Article invalidé (échec) : ' + error.message,
    });
  }
}
