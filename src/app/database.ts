import loki from 'lokijs';

export let DB = new loki('app', {
  env: 'BROWSER',
  verbose: true,
  autoload: true,
});
