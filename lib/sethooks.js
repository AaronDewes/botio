var shell = require('shelljs'),
    common = require('./common.js');
let bootstrap = {},
    config = {};

import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: global.token,
});

shell.silent();

if (!global.token) {
  console.log('Missing user credentials argument. See --help.');
  console.log();
  process.exit(1);
}

if (!shell.which('git')) {
  console.log('Bot.io needs git. Please install git in your PATH and try again.');
  console.log();
  process.exit(1);
}

config = common.getConfig(config);

// Make sure hooks are not already set
bootstrap.checkHooks = function() {
  process.stdout.write('Getting existing Github hooks... ');
  const repo = config.repo.split("/");
  octokit.repos.listWebhooks({
    ownero: repo[0],
    repo: repo[1],
    pull_number: obj.issue,
  }).then(data => {
    data.forEach(function(hook) {
      if (hook.active && 
          hook.name === 'web' &&
          hook.config && hook.config.url && hook.config.url.indexOf(config.host) > -1) {
        console.log();
        console.log('Hooks already set up for this host. You must first erase them via Github\'s admin interface.');
        process.exit(0);
      }
    });

    // If here, we need new hooks
    bootstrap.setupHooks();
  });
};

// Set up hooks
bootstrap.setupHooks = function() {
  octokit.repos.createWebhook({
    ownero: repo[0],
    repo: repo[1],
    name: 'web',
    active: true,
    events: [
      'push',
      'pull_request',
      'issue_comment'
    ],
    config: { 
      url: 'http://'+config.host+':'+config.port,
      content_type: 'json',
      secret?: config.github_secret
    }
  });
    console.log('OK');
    process.exit(0);
}

bootstrap.checkHooks();
