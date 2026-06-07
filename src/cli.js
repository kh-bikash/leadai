import 'dotenv/config';
import { Command } from 'commander';
import inquirer from 'inquirer';
import Table from 'cli-table3';
import chalk from 'chalk';
import { Pipeline } from './pipeline.js';

const program = new Command();

program
  .name('leadai')
  .description('Fully automated cold-outreach pipeline')
  .argument('<domain>', 'Seed domain to find lookalikes (e.g., segment.com)')
  .action(async (domain) => {
    try {
      console.log(chalk.bold.blue(`\nStarting pipeline for seed domain: ${domain}\n`));
      
      // Step 1: Run to Safety Checkpoint
      const summary = await Pipeline.runToCheckpoint(domain);
      
      if (summary.verifiedContacts.length === 0) {
        console.log(chalk.red("\nPipeline finished, but zero verified emails were resolved. Nothing to send."));
        process.exit(0);
      }

      // Step 2: Display Safety Checkpoint
      console.log(chalk.bold.yellow('\n=== SAFETY CHECKPOINT ===\n'));
      
      const table = new Table({
        head: ['Company', 'Name', 'Title', 'Verified Email'],
        style: { head: ['cyan'] }
      });

      summary.verifiedContacts.forEach(contact => {
        table.push([
          contact.domain,
          `${contact.firstName} ${contact.lastName}`.trim(),
          contact.title,
          contact.email
        ]);
      });

      console.log(table.toString());
      console.log(chalk.gray(`Stats: ${summary.lookalikesCount} domains -> ${summary.contactsFound} execs -> ${summary.verifiedContacts.length} verified emails.`));

      // Step 3: Prompt
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: chalk.bold.red(`Are you sure you want to fire ${summary.verifiedContacts.length} emails via Brevo?`),
          default: false
        }
      ]);

      if (!answers.proceed) {
        console.log(chalk.yellow("\nPipeline aborted by user. No emails were sent."));
        process.exit(0);
      }

      // Step 4: Execute
      const results = await Pipeline.executeOutreach(summary.verifiedContacts);
      
      console.log(chalk.bold.green('\n=== OUTREACH COMPLETE ===\n'));
      console.log(`Successful: ${results.successful}`);
      console.log(`Failed: ${results.failed}`);
      
    } catch (error) {
      console.error(chalk.bold.red(`\n[FATAL ERROR] Pipeline crashed:`));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
