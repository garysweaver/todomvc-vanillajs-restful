TodoMVC Javascript Client for RESTful Services
=====

An example of TodoMVC client that uses RESTful services such as [todomvc-services-javaee6][services].

Based on [VanillaJS][todomvcvanilla] (plain Javascript) [TodoMVC][todomvc] implementation, but using JQuery for some of the Ajax for now.

Even though it is just HTML, Javascript, and CSS and could be hosted anywhere on the same host and port, it is packaged as war for now, so it can be easily deployed to same JBoss server as [todomvc-services-javaee6][services]. Later when I have time to test out with CORS, it may be hosted separately.

Has been tested in JBoss 7.1.1.Final in OS X 10.7.4.

### Setup

Please see the todomvc-services-javaee6 project and do that setup, build, and deploy. Then come here and do the build and deploy.

### Build

    mvn clean install

### Deploy

If you cloned the todomvc-services-javaee6 and this project into the same dir, and put jboss into the other project's directory, you'd do this. Otherwise, just change the path:

    cp target/todomvc-vanillajs-restful.war ../todomvc-services-javaee6/jboss-as-7.1.1.Final/standalone/deployments/

### Testing

[http://localhost:8080/todomvc-vanillajs-restful/][localhost]

### Issues

Currently marking all and deleting all doesn't work yet. Editing doesn't work either.

### License

Copyright (c) 2012 Gary S. Weaver, released under the [MIT license][lic].

[services]: http://github.com/garysweaver/todomvc-vanillajs-restful
[todomvc]: https://github.com/addyosmani/todomvc
[todomvcvanilla]: https://github.com/addyosmani/todomvc/tree/master/reference-examples/vanillajs
[localhost]: http://localhost:8080/todomvc-vanillajs-restful/
[lic]: http://github.com/garysweaver/todomvc-vanillajs-restful/blob/master/LICENSE
