# Omni

Omni is a small frontend-less cms. As such, it's aimed at developers to serve
as a base to be extended with modules. These modules can be generic modules
which can be re-used between cms', or cms-specific modules.

Since omni has no frontend, it only has an API which spits out data. This
separation helps keep the cms clean of cruft and allows the user to use
whichever frontend they desire.


## Dependencies

While omni's dependencies are primarily satisfied through the use of [npm][npm],
there are still a few other dependencies:

- MongoDB, used for storing all data from the core modules.
- Redis, used for storing sessions.

These are, of course, only the modules for the omni core. Other modules may have
dependencies of their own.


## Installation

Omni is, at its core, a fairly simple [express][express] application. This means
you can run it pretty much however you want. For development, you'll most likely
want to use [gulp][gulp]. Gulp file and tasks are included.

Omni's intended use is as a package of another project, and then registering
modules with it. A sample `app.js` file in that project would look a bit like
this:

```js
var omni = require('omni.cm')();
omni.loadModule(__dirname + '/modules/my_module');
omni.listen();
```

Omni's `config.json` is automatically loaded. The values found in this files are
the default. If you want to change any of these options (you probably should),
you can pass the path to a config file to the omni function. This would look a
bit like this:

```js
var omni = require('omni.cm')(__dirname + '/my_config.json');
omni.loadModule(__dirname + '/modules/my_module');
omni.listen();
```

When creating your own `config.json` you can skip any keys you don't want to
change, objects will be merged recursively into the default config


### Boilerplate

In order to make setting up new project slightly less tedious, there's also
[omni-boilerplate][omni-boilerplate]. Check out the readme on that repo for more
info.


## Module structure

Modules are structured a bit like this:

```
|- assets              (optional)
|  |- images
|  |- scripts
|  `- styles
|
|- views               (optional)
|  |- form.html
|  `- list.html
|
|- gulp.js             (optional)
|- manifest.js         (optional)
|- manifest.json
|- router.js           (optional)
`- schema.js           (optional)
```

As you can see, a lot of the components of a module are optional and are
automatically generated for you as long as you have a `manifest.json`.


## Set up a SuperAdmin user

In order to start using the cms, you'll need to run and complete the `setup.js`
script. It's executable so you can simply `./setup.js` on the command line in
order to set up your SuperAdmin user.

In the future, this script should probably also define some default roles, but
for now all it does is create a single user with the `superadmin` flag set to
`true`.

## License

MIT


[npm]: https://www.npmjs.com/
[express]: http://expressjs.com/
[gulp]: http://gulpjs.com/
[omni-boilerplate]: https://github.com/chielkunkels/omni-boilerplate
