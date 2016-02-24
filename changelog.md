<a name="0.14.20"></a>
## [0.14.20](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.19...v0.14.20) (2016-02-24)


### Bug Fixes

* **tasks/build-commonjs:** write dependencies correctly to manifest ([f20cd39](https://github.com/sinnerschrader/patternplate-server/commit/f20cd39)), closes [#55](https://github.com/sinnerschrader/patternplate-server/issues/55)



<a name="0.14.19"></a>
## [0.14.19](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.18...v0.14.19) (2016-02-23)


### Bug Fixes

* apply environment config to bundles properly ([37ab299](https://github.com/sinnerschrader/patternplate-server/commit/37ab299))
* use automount config from react-mount.opts only ([3ecd056](https://github.com/sinnerschrader/patternplate-server/commit/3ecd056))



<a name="0.14.18"></a>
## [0.14.18](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.17...v0.14.18) (2016-02-22)


### Bug Fixes

* harden build-cache against faulty auto mount components ([c10d92a](https://github.com/sinnerschrader/patternplate-server/commit/c10d92a))



<a name="0.14.17"></a>
## [0.14.17](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.16...v0.14.17) (2016-02-22)


### Bug Fixes

* accept results from getPatterns without .toJSON method ([88ef36b](https://github.com/sinnerschrader/patternplate-server/commit/88ef36b))



<a name="0.14.15-beta"></a>
## [0.14.15-beta](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.10...v0.14.15-beta) (2016-02-20)


### Bug Fixes

* **routes/pattern:** harden against missing script-dependencies ([745538f](https://github.com/sinnerschrader/patternplate-server/commit/745538f))
* avoid browserify dependency for production ([78b1644](https://github.com/sinnerschrader/patternplate-server/commit/78b1644))
* **routes/pattern:** move dependency flattener to own utility function, restore dependency display ([146f58d](https://github.com/sinnerschrader/patternplate-server/commit/146f58d))
* add proper log duration formatting ([2107c86](https://github.com/sinnerschrader/patternplate-server/commit/2107c86))
* catch unhandled rejections on the process ([570ab93](https://github.com/sinnerschrader/patternplate-server/commit/570ab93))
* enable auto mounting for production by providing separate cache ([0537fed](https://github.com/sinnerschrader/patternplate-server/commit/0537fed))
* expose errors during module init in loaded transforms ([535512d](https://github.com/sinnerschrader/patternplate-server/commit/535512d))
* handle case where build directory is not present ([76ae2de](https://github.com/sinnerschrader/patternplate-server/commit/76ae2de))
* more solid config reading ([ed356c6](https://github.com/sinnerschrader/patternplate-server/commit/ed356c6))
* remove stray key in transforms config ([40a1526](https://github.com/sinnerschrader/patternplate-server/commit/40a1526))
* remove the build route, does away with the koa-send dependency ([672899c](https://github.com/sinnerschrader/patternplate-server/commit/672899c))
* repair copy-safe utility ([e51e568](https://github.com/sinnerschrader/patternplate-server/commit/e51e568))
* use dynamic script route only in development and prebuilt is not present ([ef5e953](https://github.com/sinnerschrader/patternplate-server/commit/ef5e953))
* use previous build location for build-bundles ([8da3eab](https://github.com/sinnerschrader/patternplate-server/commit/8da3eab))

### Features

* add Pattern::inject to seed patterns with dependencies ([938cbcb](https://github.com/sinnerschrader/patternplate-server/commit/938cbcb))
* prepare npm-loaded transforms ([46152bc](https://github.com/sinnerschrader/patternplate-server/commit/46152bc))
* readd bundle build ([2513f06](https://github.com/sinnerschrader/patternplate-server/commit/2513f06))



<a name="0.13.10"></a>
## [0.13.10](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.2-dev...v0.13.10) (2016-02-14)




<a name="0.14.2-dev"></a>
## [0.14.2-dev](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.1-beta...v0.14.2-dev) (2016-02-08)


### Bug Fixes

* browserify now always returns a consumeable string instead of an arraybuffer ([c933545](https://github.com/sinnerschrader/patternplate-server/commit/c933545))
* resolve less dependencies recursively ([c5aa589](https://github.com/sinnerschrader/patternplate-server/commit/c5aa589))
* respect config.patterns.transforms.react.resolveDependencies for interop with re ([30c7f47](https://github.com/sinnerschrader/patternplate-server/commit/30c7f47))
* use manifest.name for plain jsx class names ([9746273](https://github.com/sinnerschrader/patternplate-server/commit/9746273))
* **routes/pattern:** restore former id resolver, cleanups ([0c01ed1](https://github.com/sinnerschrader/patternplate-server/commit/0c01ed1))
* **tasks/commonjs:** adapt to new results object, add --dry-run and debug output ([66a5a51](https://github.com/sinnerschrader/patternplate-server/commit/66a5a51))
* **transforms/react:** do no try to implicitly import <TagName /> when assignment for TagName is presen ([b3074c2](https://github.com/sinnerschrader/patternplate-server/commit/b3074c2))
* **transforms/react:** ignore all uppercase tags for implicit imports ([565dad3](https://github.com/sinnerschrader/patternplate-server/commit/565dad3))
* **utilitities/get-patterns:** make environment matching work ([9184038](https://github.com/sinnerschrader/patternplate-server/commit/9184038))

### Features

* plain jsx now can deal with imports, deprecate implicit importing ([6302825](https://github.com/sinnerschrader/patternplate-server/commit/6302825))
* **get-patterns:** restore former environments behaviour, deprecate it ([7ba90b4](https://github.com/sinnerschrader/patternplate-server/commit/7ba90b4))
* **routes/pattern-*:** enable file-by-file requests ([6dc1d51](https://github.com/sinnerschrader/patternplate-server/commit/6dc1d51))
* restore static cache ([354f964](https://github.com/sinnerschrader/patternplate-server/commit/354f964))

### Performance Improvements

* **routes/pattern:** introduce a central cacheable readFile ([86922a8](https://github.com/sinnerschrader/patternplate-server/commit/86922a8))
* cut donwload sizes by limiting dependencies to first layer ([698872b](https://github.com/sinnerschrader/patternplate-server/commit/698872b))



<a name="0.14.1-beta"></a>
## [0.14.1-beta](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.0-beta...v0.14.1-beta) (2016-01-25)


### Features

* **console:** allow fine grained control of commonjs artifact dependencies ([4a47b39](https://github.com/sinnerschrader/patternplate-server/commit/4a47b39))
* **console:** determine external commonjs dependencies automatically ([35cdd2d](https://github.com/sinnerschrader/patternplate-server/commit/35cdd2d))



<a name="0.14.0-beta"></a>
# [0.14.0-beta](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.9...v0.14.0-beta) (2016-01-24)


### Features

* **console:** filter unchanged files when pattern change is detected ([1445362](https://github.com/sinnerschrader/patternplate-server/commit/1445362))
* **console:** setup basic incremental commonjs task with pruning ([8b55c1a](https://github.com/sinnerschrader/patternplate-server/commit/8b55c1a))



<a name="0.13.9"></a>
## [0.13.9](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.8...v0.13.9) (2016-01-24)


### Features

* add patternplate-server-console entry, #40 ([8b33cb2](https://github.com/sinnerschrader/patternplate-server/commit/8b33cb2))



<a name="0.13.8"></a>
## [0.13.8](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.7...v0.13.8) (2016-01-04)




<a name="0.13.7"></a>
## [0.13.7](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.5...v0.13.7) (2015-12-17)


### Bug Fixes

* make sure resolve-pattern-file-path returns a string ([f1d097a](https://github.com/sinnerschrader/patternplate-server/commit/f1d097a))



<a name="0.13.5"></a>
## [0.13.5](https://github.com/sinnerschrader/patternplate-server/compare/v0.13.4...v0.13.5) (2015-09-18)




<a name="0.13.4"></a>
## [0.13.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.12.3...v0.13.4) (2015-09-11)




<a name="0.12.3"></a>
## [0.12.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.12.2...v0.12.3) (2015-08-28)




<a name="0.12.2"></a>
## [0.12.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.12.1...v0.12.2) (2015-08-24)




<a name="0.12.1"></a>
## [0.12.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.12.0...v0.12.1) (2015-08-07)




<a name="0.12.0"></a>
# [0.12.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.9...v0.12.0) (2015-07-29)




<a name="0.11.9"></a>
## [0.11.9](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.8...v0.11.9) (2015-07-10)




<a name="0.11.8"></a>
## [0.11.8](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.7...v0.11.8) (2015-07-08)




<a name="0.11.7"></a>
## [0.11.7](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.6...v0.11.7) (2015-07-08)




<a name="0.11.6"></a>
## [0.11.6](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.5...v0.11.6) (2015-07-08)




<a name="0.11.5"></a>
## [0.11.5](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.4...v0.11.5) (2015-07-06)




<a name="0.11.4"></a>
## [0.11.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.3...v0.11.4) (2015-07-06)




<a name="0.11.3"></a>
## [0.11.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.2...v0.11.3) (2015-07-05)




<a name="0.11.2"></a>
## [0.11.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.11.1...v0.11.2) (2015-07-03)




<a name="0.11.1"></a>
## [0.11.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.10.0...v0.11.1) (2015-07-03)




<a name="0.10.0"></a>
# [0.10.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.6...v0.10.0) (2015-07-02)




<a name="0.9.6"></a>
## [0.9.6](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.5...v0.9.6) (2015-06-30)




<a name="0.9.5"></a>
## [0.9.5](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.4...v0.9.5) (2015-06-30)




<a name="0.9.4"></a>
## [0.9.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.3...v0.9.4) (2015-06-26)




<a name="0.9.2"></a>
## [0.9.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.1...v0.9.2) (2015-06-26)




<a name="0.9.1"></a>
## [0.9.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.9.0...v0.9.1) (2015-06-25)




<a name="0.9.0"></a>
# [0.9.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.8.4...v0.9.0) (2015-06-24)




<a name="0.8.4"></a>
## [0.8.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.8.3...v0.8.4) (2015-06-24)




<a name="0.8.3"></a>
## [0.8.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.8.2...v0.8.3) (2015-06-19)




<a name="0.8.2"></a>
## [0.8.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.8.1...v0.8.2) (2015-06-19)




<a name="0.8.1"></a>
## [0.8.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.8.0...v0.8.1) (2015-06-18)




<a name="0.8.0"></a>
# [0.8.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.7.2...v0.8.0) (2015-06-18)




<a name="0.7.2"></a>
## [0.7.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.7.1...v0.7.2) (2015-06-15)




<a name="0.7.1"></a>
## [0.7.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.7.0...v0.7.1) (2015-06-15)




<a name="0.6.1"></a>
## [0.6.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.6.0...v0.6.1) (2015-06-14)




<a name="0.6.0"></a>
# [0.6.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.5.2...v0.6.0) (2015-06-11)




<a name="0.5.2"></a>
## [0.5.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.5.1...v0.5.2) (2015-06-09)




<a name="0.5.1"></a>
## [0.5.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.5.0...v0.5.1) (2015-06-09)




<a name="0.5.0"></a>
# [0.5.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.9...v0.5.0) (2015-06-09)




<a name="0.4.9"></a>
## [0.4.9](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.8...v0.4.9) (2015-06-02)




<a name="0.4.8"></a>
## [0.4.8](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.7...v0.4.8) (2015-06-01)




<a name="0.4.7"></a>
## [0.4.7](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.6...v0.4.7) (2015-06-01)




<a name="0.4.6"></a>
## [0.4.6](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.5...v0.4.6) (2015-06-01)




<a name="0.4.5"></a>
## [0.4.5](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.4...v0.4.5) (2015-05-31)




<a name="0.4.4"></a>
## [0.4.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.3...v0.4.4) (2015-05-31)




<a name="0.4.3"></a>
## [0.4.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.2...v0.4.3) (2015-05-31)




<a name="0.4.2"></a>
## [0.4.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.1...v0.4.2) (2015-05-15)




<a name="0.4.1"></a>
## [0.4.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.4.0...v0.4.1) (2015-05-15)




<a name="0.4.0"></a>
# [0.4.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.3.4...v0.4.0) (2015-05-15)




<a name="0.3.4"></a>
## [0.3.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.3.3...v0.3.4) (2015-05-14)




<a name="0.3.3"></a>
## [0.3.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.3.2...v0.3.3) (2015-05-14)




<a name="0.3.2"></a>
## [0.3.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.3.1...v0.3.2) (2015-05-14)




<a name="0.3.1"></a>
## [0.3.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.3.0...v0.3.1) (2015-05-14)




<a name="0.3.0"></a>
# [0.3.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.2.0...v0.3.0) (2015-05-14)




<a name="0.2.0"></a>
# [0.2.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.1.0...v0.2.0) (2015-05-10)




<a name="0.1.0"></a>
# 0.1.0 (2015-05-03)




---
Copyright 2016 by [SinnerSchrader Deutschland GmbH](https://github.com/sinnerschrader) and [contributors](./graphs/contributors). Released under the [MIT license]('./license.md').
