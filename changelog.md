<a name="0.17.4"></a>
## [0.17.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.17.3...v0.17.4) (2016-07-25)


### Bug Fixes

* **task:** avoid cartesian envs^patterns explosion during build-bundles ([d094d6b](https://github.com/sinnerschrader/patternplate-server/commit/d094d6b))



<a name="0.17.3"></a>
## [0.17.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.17.2...v0.17.3) (2016-06-10)


### Bug Fixes

* **server:** resolve nested npm[@2](https://github.com/2) transform installs ([ec6ab7c](https://github.com/sinnerschrader/patternplate-server/commit/ec6ab7c)), closes [sinnerschrader/patternplate#73](https://github.com/sinnerschrader/patternplate/issues/73)



<a name="0.17.2"></a>
## [0.17.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.17.1...v0.17.2) (2016-05-30)


### Bug Fixes

* **server:** fulfill node[@6](https://github.com/6)'s stricter type checks on path.resolve ([a657649](https://github.com/sinnerschrader/patternplate-server/commit/a657649)), closes [sinnerschrader/patternplate#71](https://github.com/sinnerschrader/patternplate/issues/71)



<a name="0.17.1"></a>
## [0.17.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.17.0...v0.17.1) (2016-05-17)


### Bug Fixes

* **server:** use latest bug-fixed react transform ([c6beefc](https://github.com/sinnerschrader/patternplate-server/commit/c6beefc))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.6...v0.17.0) (2016-05-13)


### Bug Fixes

* **server:** exclude other bundles from build-bundles includes config ([786cd5f](https://github.com/sinnerschrader/patternplate-server/commit/786cd5f))


### Features

* **server:** allow clients to force environments ([91bb846](https://github.com/sinnerschrader/patternplate-server/commit/91bb846))
* **server:** use forced-env cache for react-mount ([653dc74](https://github.com/sinnerschrader/patternplate-server/commit/653dc74))



<a name="0.16.6"></a>
## [0.16.6](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.5...v0.16.6) (2016-05-11)


### Bug Fixes

* **server:** simplify transform resolver ([131229c](https://github.com/sinnerschrader/patternplate-server/commit/131229c)), closes [#68](https://github.com/sinnerschrader/patternplate-server/issues/68)



<a name="0.16.5"></a>
## [0.16.5](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.4...v0.16.5) (2016-05-11)


### Bug Fixes

* **server:** harmonize component transformation ([9dc5e1f](https://github.com/sinnerschrader/patternplate-server/commit/9dc5e1f))



<a name="0.16.4"></a>
## [0.16.4](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.3...v0.16.4) (2016-04-20)


### Bug Fixes

* **server:** filter undefined references from layout ([7f86076](https://github.com/sinnerschrader/patternplate-server/commit/7f86076))
* **server:** load npm transform with failsafes ([1f308ef](https://github.com/sinnerschrader/patternplate-server/commit/1f308ef))
* **server:** read automount components for cache correctly ([14f1df5](https://github.com/sinnerschrader/patternplate-server/commit/14f1df5))



<a name="0.16.3"></a>
## [0.16.3](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.2...v0.16.3) (2016-04-20)


### Bug Fixes

* **cli:** improve build-bundles performance ([a76e207](https://github.com/sinnerschrader/patternplate-server/commit/a76e207))
* **server:** do not garble buffers when merging injected files ([9edcf83](https://github.com/sinnerschrader/patternplate-server/commit/9edcf83))



<a name="0.16.2"></a>
## [0.16.2](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.1...v0.16.2) (2016-04-19)


### Bug Fixes

* **server:** resolve transforms from process.cwd() ([b1227f5](https://github.com/sinnerschrader/patternplate-server/commit/b1227f5)), closes [sinnerschrader/patternplate#67](https://github.com/sinnerschrader/patternplate/issues/67)



<a name="0.16.1"></a>
## [0.16.1](https://github.com/sinnerschrader/patternplate-server/compare/v0.16.0...v0.16.1) (2016-04-19)


### Bug Fixes

* **routes:** compute transforms for react-mount ([36aa653](https://github.com/sinnerschrader/patternplate-server/commit/36aa653))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.25...v0.16.0) (2016-04-16)


### Features

* **system:** update to feature releases of react-* transforms ([9e063d7](https://github.com/sinnerschrader/patternplate-server/commit/9e063d7))



<a name="0.14.25"></a>
## [0.14.25](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.24...v0.14.25) (2016-04-13)


### Bug Fixes

* **system:** remove iframe resizer script ([bb6a042](https://github.com/sinnerschrader/patternplate-server/commit/bb6a042))



<a name="0.14.24"></a>
## [0.14.24](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.23...v0.14.24) (2016-03-18)


### Bug Fixes

* **task:** determine virtual environment root files correctly ([c486dac](https://github.com/sinnerschrader/patternplate-server/commit/c486dac))



<a name="0.14.23"></a>
## [0.14.23](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.22...v0.14.23) (2016-03-13)


### Bug Fixes

* **server:** print env deprecations only when offending keys are found ([bba1428](https://github.com/sinnerschrader/patternplate-server/commit/bba1428)), closes [sinnerschrader/patternplate#21](https://github.com/sinnerschrader/patternplate/issues/21)



<a name="0.14.22"></a>
## [0.14.22](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.21...v0.14.22) (2016-03-13)


### Bug Fixes

* **task:** harden build-commonjs against unexpected dependency input ([670a33e](https://github.com/sinnerschrader/patternplate-server/commit/670a33e)), closes [sinnerschrader/patternplate#48](https://github.com/sinnerschrader/patternplate/issues/48)



<a name="0.14.21"></a>
## [0.14.21](https://github.com/sinnerschrader/patternplate-server/compare/v0.14.20...v0.14.21) (2016-03-07)


### Bug Fixes

* **application/hooks/transforms:** Fixes es6 compatible exports for factory functions ([bc4c37f](https://github.com/sinnerschrader/patternplate-server/commit/bc4c37f))



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
