import * as Express from 'express';
import * as Morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import * as path from 'path';
import * as cors from 'cors';
import recursiveTreeReader from './utils/recursiveTreeReader';
import posixNormalize from './utils/posixNormalize';
import print from './utils/printAllExpressRoutes';

const PORT = process.env.PORT || 3000;

let app = null;

(async () => {
  app = Express();

  /**
   * Utilisation du logger HTTP Morgan
   * un fichier log sera créé par jour et placé dans le dossier logs
   */
  const accessLogStream = createStream(
    (time, index) => {
      if (!time || !(time instanceof Date)) return 'api-access.log';

      const year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, '0');
      const day = time.getDate().toString().padStart(2, '0');

      return `${day}-${month}-${year}-api-access.log`;
    },
    {
      interval: '1d',
      path: path.join(__dirname, 'logs'),
    }
  );

  app.use(Morgan('combined', { stream: accessLogStream }));

  // Active le cors pour cette application
  app.use(cors());

  // On transforme le corps de la requete en JSON
  // Pour pouvoir l'utiliser par la suite
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));

  // Importation automatique des routes
  const routesFolder = path.join(__dirname, 'routes');
  const routes: Array<string> = await recursiveTreeReader(routesFolder);
  for (let route of routes) {
    // Suppréssion de l'extension
    route = route.replace(/\.[^/.]+$/, '');

    const importedModule: any = await import(path.join(routesFolder, route));
    const router = importedModule.default;

    if (route.endsWith('/index') || route.endsWith('index'))
      route = route.substr(0, route.length - 'index'.length);

    app.use(`/${posixNormalize(route)}`, router);
  }

  // Traitement des erreurs
  app.use(
    (
      error: Error,
      _req: Express.Request,
      res: Express.Response,
      _next: Express.NextFunction
    ) => {
      console.error(error.stack);
      res.status(500).json({
        error: 'Une erreur est survenue au niveau du serveur !',
      });
    }
  );

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
  });

  // Traite les erreur au niveau du processus
  process.on('uncaughtException', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE')
      console.error(`Erreur : Le port ${PORT} est déjà utilisé !`);
    else console.error(error);
    process.exit(1);
  });
})();

export default app;
