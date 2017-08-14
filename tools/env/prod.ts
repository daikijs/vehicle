import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  //API: 'https://new-api.virtualevaluator.net'
  //API: 'https://stage-api.virtualevaluator.net'
  API: 'https://api.virtualevaluator.net'
};

export = ProdConfig;
