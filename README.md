# Omni

Omni is a small, yet flexible, cms aimed at developers. It aims to only supply a
small core while being being extensible. There is no support for any kind of
frontend - it merely exposes APIs which you can call from your frontend.

This separation of concerns makes it easier to keep the cms clean and it allows
people to choose whatever kind of frontend they wish to use. There will be a
boilerplate frontend app soon, which will set you up for quick progression on
new projects.


## Dependencies

While omni's dependencies are primarily satisfied through the use of `npm`,
there's still a few external dependencies that will have to be resolved:

- MongoDB, used for storing all data from the core modules, additional modules
  may have their own dependencies.
- Redis, used for storing sessions.


## Installation

Omni is, at its core, a fairly simplistic `express` application so you can run
it in a variety of ways. A `Gruntfile.js` is included so for development
purposes, using [grunt][grunt] is your best bet. Of course you can also use
[nodemon][nodemon] or simply run `$ node app.js`.

```bash
$ git clone https://github.com/chielkunkels/omni.git
$ cd omni
$ npm install
$ cat config-sample.json > config.json
```

At this point you'll want to crank open your favourite editor and edit the
config.json file with your desired details.

[grunt]: http://gruntjs.com/
[nodemon]: http://nodemon.io/


## Set up a SuperAdmin user

In order to start using the cms, you'll need to run and complete the `setup.js`
script. It's executable so you can simply `$ ./setup.js` on the command line in
order to set up your SuperAdmin user.

In the future, this script should probably also define some default roles, but
for now all it does is create a single user with the `superadmin` flag set to
`true`.

## License

MIT
