import path from "path"
import wd from "wd"
import "@percy/appium-wd"

const rootDir = path.resolve(path.join(__dirname, ".."))
jest.setTimeout(5 * 60 * 1000)

const capabilities = {
  android: {
    app: path.join(
      rootDir,
      "android",
      "app",
      "build",
      "outputs",
      "apk",
      "dev",
      "debug",
      "app-dev-debug.apk",
    ),
    appActivity: "com.haven.MainActivity",
    appPackage: "com.haven",
    deviceName: "Android Emulator",
    displayName: "Android",
    platformName: "Android",
  },
  ios: {
    app: path.join(
      rootDir,
      "ios",
      "build",
      "ChainReactConf",
      "Build",
      "Products",
      "Debug-iphonesimulator",
      "ChainReactConf.app",
    ),
    automationName: "XCUITest",
    deviceName: "iPhone X",
    displayName: "iPhone X",
    platformName: "iOS",
    platformVersion: "12.2",
    waitForQuiescence: "false",
  },
}

const driver = wd.promiseChainRemote("localhost", 4723) // 4723 is the default Appium port

// capabilities.setCapability('waitForQuiescence', 'false')

test("integration tests work", async () => {
  await driver.init(capabilities.ios)
  await driver.sleep(2 * 1000) // wait for app to load
  // await driver.switchTo().alert().accept();
  await driver.execute("mobile:alert", { action: "accept" })
  await driver.sleep(2 * 1000) // wait for app to load
  await driver.percySnapshot("test")
  await driver.quit()
})
