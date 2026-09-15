// Expo config plugin: manual code signing for the app target, driven by the
// environment VibeView sets during an iOS production cloud build.
//
// VibeView exports VIBEVIEW_DEVELOPMENT_TEAM and VIBEVIEW_PROVISIONING_PROFILE
// (plus VIBEVIEW_CODE_SIGN_IDENTITY, which goes on the xcodebuild command line
// instead). Passing PROVISIONING_PROFILE_SPECIFIER on the command line applies
// to every CocoaPods target too, and pods reject profiles — so the profile is
// written onto the app target's build configurations here, at prebuild time.
// When the variables are absent (debug/simulator builds) nothing is changed.
const { withXcodeProject } = require('expo/config-plugins');

function quoted(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

module.exports = function withVibeViewIosSigning(config) {
  return withXcodeProject(config, (mod) => {
    const team = process.env.VIBEVIEW_DEVELOPMENT_TEAM;
    const profile = process.env.VIBEVIEW_PROVISIONING_PROFILE;
    if (!team || !profile) return mod;

    const bundleId = config.ios && config.ios.bundleIdentifier;
    const project = mod.modResults;
    const configurations = project.pbxXCBuildConfigurationSection();
    let touched = 0;
    for (const key of Object.keys(configurations)) {
      const entry = configurations[key];
      if (!entry || typeof entry !== 'object' || !entry.buildSettings) continue;
      const settings = entry.buildSettings;
      const id = String(settings.PRODUCT_BUNDLE_IDENTIFIER || '').replace(/"/g, '');
      if (id !== bundleId) continue; // only the app target, never the pods
      settings.CODE_SIGN_STYLE = 'Manual';
      settings.DEVELOPMENT_TEAM = quoted(team);
      settings.PROVISIONING_PROFILE_SPECIFIER = quoted(profile);
      touched += 1;
    }
    console.log(`[withVibeViewIosSigning] manual signing set on ${touched} build configuration(s)`);
    return mod;
  });
};
