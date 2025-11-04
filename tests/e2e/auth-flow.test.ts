import puppeteer, { Browser, Page } from "puppeteer";

const APP_URL = "http://localhost:3000";
const TEST_USERNAME = `testuser_${Date.now()}`;
const TEST_PASSWORD = "testpass123";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForElement(
  page: Page,
  selector: string,
  timeout = 5000
): Promise<void> {
  await page.waitForSelector(selector, { timeout, visible: true });
}

async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

async function testAuthFlow(page: Page): Promise<boolean> {
  console.log("\n🔐 Testing Authentication Flow...");

  // Capture console errors
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on("pageerror", (error) => {
    consoleErrors.push(`Page error: ${error.message}`);
  });

  try {
    // Navigate to app first
    await page.goto(APP_URL, { waitUntil: "networkidle0", timeout: 30000 });
    await delay(1000);

    // Clear any existing auth data after page loads
    await clearLocalStorage(page);
    await page.reload({ waitUntil: "networkidle0" });
    await delay(1000);

    // Wait for auth screen to appear
    console.log("  ✓ Waiting for auth screen...");
    await waitForElement(page, 'input[type="text"]', 10000);

    // Check if we're on signup or signin tab - click signup tab
    const tabsList = await page.$$("button");
    let signupTab = null;
    for (const tab of tabsList) {
      const text = await page.evaluate((el) => el.textContent, tab);
      if (text && text.includes("Sign Up")) {
        signupTab = tab;
        break;
      }
    }
    if (signupTab) {
      await signupTab.click();
      await delay(500);
    }

    // Fill in signup form
    console.log("  ✓ Filling signup form...");
    const usernameInputs = await page.$$('input[type="text"]');
    const passwordInputs = await page.$$('input[type="password"]');

    if (usernameInputs.length > 0) {
      await usernameInputs[0].type(TEST_USERNAME, { delay: 50 });
    }
    if (passwordInputs.length > 0) {
      await passwordInputs[0].type(TEST_PASSWORD, { delay: 50 });
    }
    if (passwordInputs.length > 1) {
      await passwordInputs[1].type(TEST_PASSWORD, { delay: 50 });
    }

    await delay(500);

    // Submit signup form
    console.log("  ✓ Submitting signup form...");
    const buttons = await page.$$("button");
    let submitButton = null;
    for (const btn of buttons) {
      const text = await page.evaluate((el) => el.textContent, btn);
      if (
        text &&
        (text.includes("Sign Up") || text.includes("Creating account"))
      ) {
        const type = await page.evaluate((el) => el.type, btn);
        if (type === "submit") {
          submitButton = btn;
          break;
        }
      }
    }

    if (submitButton) {
      await Promise.all([delay(3000).catch(() => {}), submitButton.click()]);
    }

    // Wait for auth to complete or error to appear
    await delay(3000);

    // Check for error messages first
    const errorElement = await page.$(
      '.text-destructive, [class*="error"], [class*="Error"]'
    );
    if (errorElement) {
      const errorText = await page.evaluate(
        (el) => el.textContent,
        errorElement
      );
      console.log(`  ✗ Authentication failed: ${errorText}`);
      await page.screenshot({ path: `tests/screenshots/auth-error.png` });
      return false;
    }

    // Check page content to see what we're seeing
    const pageContent = await page.content();

    // Log console errors if any
    if (consoleErrors.length > 0) {
      console.log(`  ⚠ Console errors: ${consoleErrors.join("; ")}`);
    }

    // Check if we're still on auth screen
    if (
      pageContent.includes("Welcome to Unpuff") &&
      !pageContent.includes("Mission: Stay under")
    ) {
      console.log("  ✗ Still on auth screen - checking for errors...");
      // Wait a bit more for async errors
      await delay(2000);
      const errorCheck = await page.$(".text-destructive");
      if (errorCheck) {
        const errorText = await page.evaluate(
          (el) => el.textContent,
          errorCheck
        );
        console.log(`  ✗ Error found: ${errorText}`);
      }
      await page.screenshot({
        path: `tests/screenshots/auth-still-on-screen.png`,
      });
      return false;
    }

    // Check if auth was successful by looking for onboarding or main screen
    const hasOnboarding = await page.$('[data-testid="button-begin"]');
    const hasMainScreen =
      pageContent.includes("Mission: Stay under") &&
      !pageContent.includes("Welcome to Unpuff");

    if (hasOnboarding || hasMainScreen) {
      console.log("  ✓ Authentication successful!");
      return true;
    }

    console.log("  ✗ Authentication status unclear");
    await page.screenshot({ path: `tests/screenshots/auth-unclear.png` });
    return false;
  } catch (error: any) {
    console.log(`  ✗ Authentication test failed: ${error.message}`);
    return false;
  }
}

async function testOnboardingFlow(page: Page): Promise<boolean> {
  console.log("\n📋 Testing Onboarding Flow...");

  try {
    // Wait for onboarding screen 1
    console.log("  ✓ Waiting for onboarding screen 1...");
    await waitForElement(page, '[data-testid="button-begin"]', 10000);

    // Click "Let's begin" button
    console.log('  ✓ Clicking "Let\'s begin" button...');
    await delay(1000); // Wait for animation
    await page.click('[data-testid="button-begin"]');

    await delay(1000);

    // Wait for screen 2 (triggers)
    console.log("  ✓ Waiting for onboarding screen 2 (triggers)...");
    await waitForElement(page, '[data-testid="trigger-stressed"]', 10000);

    // Select triggers
    console.log("  ✓ Selecting triggers...");
    await page.click('[data-testid="trigger-stressed"]');
    await delay(300);
    await page.click('[data-testid="trigger-bored"]');
    await delay(500);

    // Click "Got it" button
    console.log('  ✓ Clicking "Got it" button...');
    await waitForElement(page, '[data-testid="button-got-it"]', 5000);
    await page.click('[data-testid="button-got-it"]');
    await delay(1000);

    // Wait for screen 3 (identity and baseline)
    console.log("  ✓ Waiting for onboarding screen 3...");
    await waitForElement(
      page,
      '[data-testid="input-custom-identity"], [data-testid*="identity"]',
      10000
    );

    // Select identity option
    const identityOption = await page.$('[data-testid*="identity"]');
    if (identityOption) {
      console.log("  ✓ Selecting identity option...");
      await identityOption.click();
      await delay(500);
    } else {
      // Or type custom identity
      console.log("  ✓ Typing custom identity...");
      await page.type(
        '[data-testid="input-custom-identity"]',
        "is taking control"
      );
      await delay(500);
    }

    // Wait for slider to appear
    await waitForElement(page, '[data-testid="slider-baseline"]', 5000);

    // Set baseline (use default or adjust)
    console.log("  ✓ Setting daily baseline...");
    const slider = await page.$('[data-testid="slider-baseline"]');
    if (slider) {
      // Move slider to 20
      await page.evaluate((slider) => {
        const input = slider.querySelector(
          'input[type="range"]'
        ) as HTMLInputElement;
        if (input) {
          input.value = "20";
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, slider);
      await delay(500);
    }

    // Click "Start My Journey" button
    console.log('  ✓ Clicking "Start My Journey" button...');
    await waitForElement(page, '[data-testid="button-start-journey"]', 5000);
    await page.click('[data-testid="button-start-journey"]');
    await delay(2000); // Wait for navigation

    await delay(2000);

    // Check if we reached the main screen
    const pageContent = await page.content();
    if (
      pageContent.includes("Mission: Stay under") &&
      !pageContent.includes("Welcome to Unpuff")
    ) {
      console.log("  ✓ Onboarding completed successfully!");
      return true;
    }

    console.log("  ✗ Onboarding completion unclear");
    return false;
  } catch (error: any) {
    console.log(`  ✗ Onboarding test failed: ${error.message}`);
    return false;
  }
}

async function testMainScreen(page: Page): Promise<boolean> {
  console.log("\n🏠 Testing Main Screen...");

  try {
    // Wait for main screen elements
    console.log("  ✓ Checking for main screen elements...");
    // Wait for any h1 element or check page content
    await delay(2000);
    const pageContent = await page.content();

    if (
      !pageContent.includes("Unpuff") ||
      pageContent.includes("Welcome to Unpuff")
    ) {
      console.log("  ✗ Still on auth/onboarding screen");
      return false;
    }

    // Check for key elements
    const hasCounter = pageContent.includes("Mission: Stay under");
    const hasProgressTab = await page.$('[data-testid="tab-progress"]');
    const hasAchievementsTab = await page.$('[data-testid="tab-achievements"]');
    const hasInsightsTab = await page.$('[data-testid="tab-insights"]');

    if (
      hasCounter &&
      (hasProgressTab || hasAchievementsTab || hasInsightsTab)
    ) {
      console.log("  ✓ Main screen elements found!");

      // Check localStorage to verify data was saved
      const userData = await page.evaluate(() => {
        return localStorage.getItem("unpuff-userdata");
      });

      const authData = await page.evaluate(() => {
        return localStorage.getItem("unpuff-auth");
      });

      if (userData && authData) {
        console.log("  ✓ LocalStorage data verified!");
        console.log(`     Auth: ${JSON.parse(authData).username}`);
        console.log(`     UserData: ${JSON.parse(userData).identity}`);
        return true;
      } else {
        console.log("  ✗ LocalStorage data missing");
        return false;
      }
    }

    console.log("  ✗ Main screen elements not found");
    return false;
  } catch (error: any) {
    console.log(`  ✗ Main screen test failed: ${error.message}`);
    return false;
  }
}

async function takeScreenshot(page: Page, name: string): Promise<void> {
  try {
    await page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage: true,
    });
    console.log(`  📸 Screenshot saved: tests/screenshots/${name}.png`);
  } catch (error) {
    // Ignore screenshot errors
  }
}

async function main() {
  console.log("🚀 Starting Authentication & Onboarding Flow Test\n");
  console.log(`📍 Testing app at: ${APP_URL}`);
  console.log(`👤 Test username: ${TEST_USERNAME}\n`);

  let browser: Browser | null = null;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: { width: 375, height: 812 }, // iPhone size
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Create screenshots directory
    try {
      await page.evaluate(() => {});
    } catch {}

    // Navigate to app
    console.log("📱 Navigating to app...");
    await page.goto(APP_URL, { waitUntil: "networkidle0", timeout: 30000 });
    await delay(2000);

    // Run tests
    const authResult = await testAuthFlow(page);
    if (!authResult) {
      await takeScreenshot(page, "auth-failed");
      throw new Error("Authentication test failed");
    }

    await takeScreenshot(page, "after-auth");

    const onboardingResult = await testOnboardingFlow(page);
    if (!onboardingResult) {
      await takeScreenshot(page, "onboarding-failed");
      throw new Error("Onboarding test failed");
    }

    await takeScreenshot(page, "after-onboarding");

    const mainScreenResult = await testMainScreen(page);
    if (!mainScreenResult) {
      await takeScreenshot(page, "main-screen-failed");
      throw new Error("Main screen test failed");
    }

    await takeScreenshot(page, "main-screen-success");

    console.log("\n✅ All tests passed!");
    console.log("✓ Authentication successful");
    console.log("✓ Onboarding completed");
    console.log("✓ Main screen reached");

    // Keep browser open for a few seconds to see the result
    await delay(3000);
  } catch (error: any) {
    console.error("\n❌ Test failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
main().catch(console.error);
