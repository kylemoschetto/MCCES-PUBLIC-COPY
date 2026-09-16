/**
 * Config Command - Manage project configuration
 */
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ProjectConfig } from '../../types';
import { AVAILABLE_MODELS, AIProvider } from '../../ai/providers';

const CONFIG_FILE = 'cbm-config.json';

/**
 * Get the default configuration
 */
function getDefaultConfig(): ProjectConfig {
  return {
    outputDir: './output',
    aiProvider: 'google',
    aiModel: 'gemini-3-flash-preview',
  };
}

/**
 * Load configuration from file
 */
export function loadConfig(configPath?: string): ProjectConfig {
  const filePath = configPath || path.join(process.cwd(), CONFIG_FILE);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { ...getDefaultConfig(), ...JSON.parse(content) };
  }

  return getDefaultConfig();
}

/**
 * Save configuration to file
 */
export function saveConfig(config: ProjectConfig, configPath?: string): void {
  const filePath = configPath || path.join(process.cwd(), CONFIG_FILE);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

/**
 * Interactive configuration command
 */
export async function configure(): Promise<ProjectConfig> {
  console.log(chalk.blue.bold('\n=== CBM Configuration ===\n'));

  const currentConfig = loadConfig();

  // First get provider selection
  const providerAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetPopulation',
      message: 'Target population (e.g., "0621 Field Radio Operators"):',
      default: currentConfig.targetPopulation || '',
    },
    {
      type: 'input',
      name: 'sourceDocument',
      message: 'Source document path:',
      default: currentConfig.sourceDocument || '',
    },
    {
      type: 'input',
      name: 'outputDir',
      message: 'Output directory:',
      default: currentConfig.outputDir,
    },
    {
      type: 'list',
      name: 'aiProvider',
      message: 'AI provider:',
      choices: ['google', 'anthropic', 'openai'],
      default: currentConfig.aiProvider,
    },
  ]);

  // Get model choices based on selected provider
  const selectedProvider = providerAnswer.aiProvider as AIProvider;
  const modelChoices = AVAILABLE_MODELS[selectedProvider];
  const currentModelValid = modelChoices.includes(currentConfig.aiModel);

  const modelAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'aiModel',
      message: `AI model (${selectedProvider}):`,
      choices: modelChoices,
      default: currentModelValid ? currentConfig.aiModel : modelChoices[0],
    },
  ]);

  const answers = { ...providerAnswer, ...modelAnswer };

  const newConfig: ProjectConfig = {
    targetPopulation: answers.targetPopulation || undefined,
    sourceDocument: answers.sourceDocument || undefined,
    outputDir: answers.outputDir,
    aiProvider: answers.aiProvider,
    aiModel: answers.aiModel,
  };

  saveConfig(newConfig);
  console.log(chalk.green('\n✓ Configuration saved to ' + CONFIG_FILE));

  return newConfig;
}

/**
 * Display current configuration
 */
export function showConfig(): void {
  const config = loadConfig();

  console.log(chalk.blue.bold('\n=== Current Configuration ===\n'));
  console.log(chalk.white(`Target Population: ${config.targetPopulation || '(not set)'}`));
  console.log(chalk.white(`Source Document: ${config.sourceDocument || '(not set)'}`));
  console.log(chalk.white(`Output Directory: ${config.outputDir}`));
  console.log(chalk.white(`AI Provider: ${chalk.yellow(config.aiProvider)}`));
  console.log(chalk.white(`AI Model: ${chalk.cyan(config.aiModel)}`));

  // Show available models for each provider
  console.log(chalk.blue.bold('\n=== Available Models ===\n'));
  for (const [provider, models] of Object.entries(AVAILABLE_MODELS)) {
    const isCurrentProvider = provider === config.aiProvider;
    const providerLabel = isCurrentProvider
      ? chalk.yellow.bold(`${provider} (current)`)
      : chalk.dim(provider);
    console.log(`${providerLabel}:`);
    for (const model of models) {
      const isCurrentModel = model === config.aiModel && isCurrentProvider;
      const modelLabel = isCurrentModel ? chalk.cyan.bold(`  → ${model}`) : chalk.dim(`    ${model}`);
      console.log(modelLabel);
    }
  }
  console.log('');
}

/**
 * Set a specific configuration value
 */
export function setConfigValue(key: keyof ProjectConfig, value: string): void {
  const config = loadConfig();

  switch (key) {
    case 'aiProvider':
      if (value !== 'openai' && value !== 'anthropic' && value !== 'google') {
        throw new Error('AI provider must be "openai", "anthropic", or "google"');
      }
      config.aiProvider = value;
      break;
    case 'aiModel':
      config.aiModel = value;
      break;
    case 'outputDir':
      config.outputDir = value;
      break;
    case 'targetPopulation':
      config.targetPopulation = value;
      break;
    case 'sourceDocument':
      config.sourceDocument = value;
      break;
    default:
      throw new Error(`Unknown config key: ${key}`);
  }

  saveConfig(config);
  console.log(chalk.green(`✓ Set ${key} = ${value}`));
}
