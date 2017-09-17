require('babel-polyfill');
import detox from 'detox'
import packageFile from '../package.json'
const detoxConfig = packageFile.detox
import cp from 'child_process'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 120000

async function setPermissions(permissions) {
  await cp.execSync(
    `applesimutils \\
    --simulator "iPhone 7" \\
    --bundle talkTekApp.app \\
    `,
    // --setPermissions "${permissions.join()}"`,
    {
      stdio: 'inherit',
    },
  )
}

beforeEach(async () => {
  await detox.init(detoxConfig);
  // await setPermissions([])
  await device.reloadReactNative()
  // await device.relaunchApp()
}, 25000)

afterAll(async () => {
  await detox.cleanup();
});

// beforeEach(async () => {
//   await device.reloadReactNative();
// })
