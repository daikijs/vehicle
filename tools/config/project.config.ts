import { join } from 'path';

import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  // including fonts
  FONTS_DEST = `${this.APP_DEST}/fonts`;
  FONTS_SRC = [
    'node_modules/bootstrap/dist/fonts/**',
    'node_modules/font-awesome/fonts/**',
    'node_modules/videogular2/fonts/**'
  ];

  constructor() {
    super();
    this.APP_TITLE = 'Virtual Evaluator';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      {src: 'jquery/dist/jquery.min.js', inject: 'libs'}
      //{src: 'videogular2/fonts/videogular.css', inject: 'true'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},      
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      {src: `${this.APP_SRC}/jquery-ui.js`, inject: true, vendor: false},
      {src: `${this.CSS_SRC}/*.css`, inject: true, vendor: false},
      {src: `fonts/videogular.css`, inject: true, vendor: false}
    ];

    // Angular2-modal
    //jw-bootstrap-switch-ng2
    this.SYSTEM_CONFIG_DEV.paths['videogular2'] = `node_modules/videogular2/core.js`;
    this.SYSTEM_BUILDER_CONFIG.packages['videogular2'] = {
      main: `core.js`,
      defaultExtension : 'js'
    };

    this.SYSTEM_CONFIG_DEV.paths['angular2-select'] = `node_modules/angular2-select/index.js`;
    this.SYSTEM_BUILDER_CONFIG.packages['angular2-select'] = {
      main: `index.js`,
      defaultExtension : 'js'
    };

    let additionalPackages: ExtendPackages[] = [
      {
        name: 'angular2-modal',
        path: 'node_modules/angular2-modal/bundles/angular2-modal.umd.js'
      },
      {
        name: 'angular2-modal/plugins/bootstrap',
        path: 'node_modules/angular2-modal/bundles/angular2-modal.bootstrap.umd.js'
      }
    ];
    this.addPackagesBundles(additionalPackages);

    // Add packages (e.g. lodash)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'lodash',
    //   path: `${this.APP_BASE}node_modules/lodash/lodash.js`,
    //   packageMeta: {
    //     main: 'index.js',
    //     defaultExtension: 'js'
    //   }
    // }];
    //
    // or
    //
    // let additionalPackages: ExtendPackages[] = [];
    //
    // additionalPackages.push({
    //   name: 'lodash',
    //   path: `${this.APP_BASE}node_modules/lodash/lodash.js`,
    //   packageMeta: {
    //     main: 'index.js',
    //     defaultExtension: 'js'
    //   }
    // });
    //
    // this.addPackagesBundles(additionalPackages);

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
  }

}
