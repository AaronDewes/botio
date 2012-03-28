# Bot.io: The pull request build/test bot


_WARNING: This project is under heavy construction._


Bot.io is a fully scriptable build/test bot for Github projects. It is similar to [Travis-CI](https://github.com/travis-ci/travis-ci) in purpose, but most of the action happens at the pull request level and there are no constraints on what types of tests you can run. (Also you have to provision your own test/build servers).

Bot.io is written in Node.js and works on both Windows and Unix. Its previous incarnation has been battle-tested at Mozilla's [pdf.js](http://github.com/mozilla/pdf.js) project since late 2011.






## How it works

#### Pull request testing

![Screenshot](https://github.com/arturadib/botio/raw/master/screenshot.png)

1. You write [shell-like](http://github.com/arturadib/shelljs) scripts such as [on_cmd_test.js](https://github.com/arturadib/botio/blob/master/bootstrap/on_cmd_test.js) that tell the bot what to do when it receives a command. (Any arbitrary command can be defined).
2. Pull request reviewers leave a comment containing a bot command like `/botio test`, causing the bot to run the corresponding script against a hypothetically merged pull request.
3. The bot reports back to the pull request discussion with a comment containing the test result.



#### Other uses

+ _Live browser tests:_ Bot.io comes with a built-in web server, so if your project is a web app you can create a script, say [on_cmd_publish.js](https://github.com/arturadib/botio/blob/master/bootstrap/on_cmd_publish.js), to deploy select files into the server. Reviewers can then issue `/botio publish` and take the PR for a spin in their browser before merging it.

+ _Post-receive scripts:_ Bot.io scripts can do just about anything shell scripts can do, and they can hook into other Github events. For example, the script [on_push.js](https://github.com/arturadib/botio/blob/master/bootstrap/on_push.js) is executed every time new commits are pushed to the master branch.








## Getting started

Bot.io depends on [Node.js](https://github.com/joyent/node) and `git`. To get started, create a new directory for your Botio files. In this directory, bootstrap Github hooks/configuration files, and start the server (replace `--user arturadib` and `--repo arturadib/pdf.js` by your corresponding user and repo names, and set `--port` to the desired port number for the Botio server):

```bash
$ npm install -g botio
$ mkdir botio-files; cd botio-files
$ botio bootstrap --repo arturadib/pdf.js --user arturadib --pwd password123 --port 8877
$ botio start --user arturadib --pwd password123
```

That's it!

You can now trigger your first Bot.io job by leaving the following comment on any pull request in your repo:

```
/botio test
```

The bot should write back a hello world response in the PR discussion. At this point you will probably want to customize your bot scripts, like `on_cmd_test.js`.










## Customizing

#### Writing JS shell scripts

Botio uses by default the [ShellJS](http://github.com/arturadib/shelljs) module to enable portable shell-like scripting. See the [bootstrap files](https://github.com/arturadib/botio/tree/master/bootstrap) for examples of usage.

When Github sends a new notification, Botio automatially fires up the corresponding script. For example, `push` notifications will trigger `on_push.js`, whereas a comment like `/botio publish` (by a whitelisted user) will trigger `on_cmd_publish.js`.

#### Leaving comments as a different user

If you want the bot to leave comments as a different user (here are some [gravatar suggestions](http://www.iconfinder.com/search/?q=robot)), simply start the server with the desired user credentials:

```bash
$ botio start --user fancy_pants_bot --pwd password123
```

#### Configuring (config.json)

Here are some important properties you might want to modify:

+ `name`: Name of the bot, in case you have multiple ones (e.g. `Bot.io-Windows`, `Bot.io-Linux`, etc)
+ `whitelist`: Array of Github user names allowed to trigger Botio commands via pull request comments
+ `public_dir`: Path to the base directory where all web-facing files should be stored
+ `private_dir`: Path to the base directory where all tests will be run
+ `script_timeout`: (In seconds) Will kill any script that takes longer than this










## FAQ


#### I don't want to use Bot.io anymore. How do I uninstall the Github hooks installed by Bot.io?

On your Github repo, go to Admin > Service Hooks > Post-Receive URLs and disable the URL corresponding to the IP of your machine. (Don't forget to save it).


#### How many concurrent tests can I run?

At the moment Bot.io uses a simple queueing system, so only one test can be run at a time. This might change in the future.


#### How does the bot handle security?

Bot.io only responds to white-listed users.
