// Expo config plugin: point the generated android/app/build.gradle at the
// keystore VibeView supplies during a production cloud build.
//
// The four VIBEVIEW_* Gradle properties only exist during a VibeView production
// build; the hasProperty guard keeps every other build (assembleDebug, local
// runs) untouched, and keeping the signingConfig assignment inside the guard
// means a release build without them fails loudly instead of shipping unsigned.
const { withAppBuildGradle } = require('expo/config-plugins');

const MARKER = 'VIBEVIEW_STORE_FILE';

const SNIPPET = `
// Added by plugins/withVibeViewSigning.js
android {
    if (project.hasProperty('VIBEVIEW_STORE_FILE')) {
        signingConfigs {
            release {
                storeFile file(VIBEVIEW_STORE_FILE)
                storePassword VIBEVIEW_STORE_PASSWORD
                keyAlias VIBEVIEW_KEY_ALIAS
                keyPassword VIBEVIEW_KEY_PASSWORD
            }
        }
        buildTypes.release.signingConfig signingConfigs.release
    }
}
`;

module.exports = function withVibeViewSigning(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(MARKER)) {
      mod.modResults.contents += SNIPPET;
    }
    return mod;
  });
};
