#!/usr/bin/env node
import { killProcesses, startServices, checkPort } from './utils/processManager.mjs';
import { program } from 'commander';
import { createSpinner } from 'nanospinner';

program
  .version('1.0.0')
  .description('Gestionnaire de services pour le dashboard Vinted');

program
  .command('clean')
  .description('Arrêter tous les processus en cours')
  .action(async () => {
    const spinner = createSpinner('Nettoyage en cours...').start();
    try {
      await killProcesses();
      spinner.success({ text: 'Nettoyage terminé avec succès !' });
    } catch (error) {
      spinner.error({ text: `Erreur: ${error.message}` });
    }
    process.exit(0);
  });

program
  .command('start')
  .description('Démarrer tous les services')
  .option('-p, --production', 'Démarrer en mode production')
  .action(async (options) => {
    const spinner = createSpinner('Démarrage des services...').start();
    try {
      const portsAvailable = await Promise.all([
        checkPort(3000),
        checkPort(3001)
      ]);

      if (!portsAvailable.every(Boolean)) {
        spinner.warn({ text: 'Certains ports sont déjà utilisés. Nettoyage...' });
        await killProcesses();
      }

      await startServices(options.production);
      spinner.success({ text: 'Services démarrés avec succès !' });
    } catch (error) {
      spinner.error({ text: `Erreur: ${error.message}` });
      process.exit(1);
    }
  });

program
  .command('restart')
  .description('Redémarrer tous les services')
  .action(async () => {
    const spinner = createSpinner('Redémarrage des services...').start();
    try {
      await killProcesses();
      await startServices();
      spinner.success({ text: 'Services redémarrés avec succès !' });
    } catch (error) {
      spinner.error({ text: `Erreur: ${error.message}` });
      process.exit(1);
    }
  });

program.parse(process.argv); 