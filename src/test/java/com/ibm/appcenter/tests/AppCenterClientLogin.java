package com.ibm.appcenter.tests;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.apache.commons.io.FileUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.AssertJUnit;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.ibm.appcenter.tests.utils.FileUploader;
import com.ibm.appcenter.tests.utils.ServerUtil;

//import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.AndroidKeyCode;

public class AppCenterClientLogin {

		public WebDriver driver;
	    public ServerUtil serverutil;
	    public WebDriverWait wait;

	    @BeforeClass
		void setup() throws MalformedURLException {
	        serverutil = ServerUtil.getInstance();
	        System.out.println("AppCenterClientLogin.setup(getAppCenterClientPath) "+ serverutil.getAppCenterClientPath());
	    	DesiredCapabilities capabilities = new DesiredCapabilities();
	    	String fileUUID = "";
	    	try {
				 fileUUID = FileUploader.uploadFile(serverutil.getAppCenterClientPath(), "https://appium.testdroid.com", "3IMUlaWW1BW2uzESHldjo5cEU4swMqf7");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    	//capabilities.setCapability("testdroid_apiKey","ZY7lcQ0yNCbF54CaFZd373RHunhE0t1D");
	    	capabilities.setCapability("testdroid_apiKey", "3IMUlaWW1BW2uzESHldjo5cEU4swMqf7");
	    	capabilities.setCapability("testdroid_app", fileUUID);

			//capabilities.setCapability("appium-version", "1.0");
	    	//capabilities.setCapability("platformVersion", "11.1");
			//capabilities.setCapability("deviceName", "iPhone Simulator");

			/*capabilities.setCapability("automationName", "XCUITest");
			capabilities.setCapability("platformName", "iOS");
			capabilities.setCapability("deviceName", "iOS Phone");
	    	        capabilities.setCapability("device", "iphone");
			capabilities.setCapability("testdroid_target", "iOS");
			capabilities.setCapability("testdroid_project", "iOS AppCennter Client App");
			capabilities.setCapability("testdroid_testrun", "iOS Appium Test Run");
			capabilities.setCapability("testdroid_device", "iPhone 5c");*/

			//capabilities.setCapability("screenshot_dir", "/Users/vinod/MobileDevOps/screen-logs");
			capabilities.setCapability("screenshot_dir", System.getenv("screenshot_dir"));
			capabilities.setCapability("platformName", "Android");
			capabilities.setCapability("deviceName", "Android Device");
			capabilities.setCapability("testdroid_target", "Android");
			capabilities.setCapability("testdroid_project", "Android Java Appium Client Side Example Project");
			capabilities.setCapability("testdroid_testrun", "Android Appium Test Run");
			capabilities.setCapability("testdroid_device", "LG Google Nexus 5 6.0 -EU");

			capabilities.setCapability("testdroid_description", "Appium project description");
			//capabilities.setCapability("app", "com.BluemixIndia.Push");
			//capabilities.setCapability("app", "com.ibm.imf.AppCenter2");
			capabilities.setCapability("app", "com.ibm.imf.AppCenter2");

			//*********Change this to point to your path*********//
			//capabilities.setCapability("app", serverutil.getAppCenterClientPath());
			//un-install and install the app before the test
			/*capabilities.setCapability("full-reset", true);
                         capabilities.setCapability("no-reset", false);*/

			//driver = new IOSDriver<WebElement>(new URL("http://127.0.0.1:4723/wd/hub"), capabilities);
			//driver = new IOSDriver<WebElement>(new URL("https://appium.testdroid.com/wd/hub"), capabilities);

			driver = new AndroidDriver<WebElement>(new URL("https://appium.testdroid.com/wd/hub"), capabilities);
            wait = new WebDriverWait(driver, 30);
		}

		@AfterClass
		public void teardown() {
			driver.quit();
		}


		public void loginMobileClientAppCenteriOS() {

	    	try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    	//takeScreenshot("Login Screen");

	    	//*********Enter the login details and login*********//
			WebElement userField = driver.findElement(By.xpath("//XCUIElementTypeTextField[@value='User name']"));
			userField.click();
			userField.sendKeys(serverutil.getUsername());

			WebElement passwordField = driver.findElement(By.xpath("//XCUIElementTypeSecureTextField[@value='Password']"));
			passwordField.click();
			passwordField.sendKeys(serverutil.getPassword());

			WebElement hostField = driver.findElement(By.xpath("//XCUIElementTypeTextField[@value='Host name or IP']"));
			hostField.click();
			hostField.sendKeys(serverutil.getHost());

			WebElement portField = driver.findElement(By.xpath("//XCUIElementTypeTextField[@value='Server port']"));
			portField.click();
			portField.sendKeys(""+ serverutil.getPort() + "");

			WebElement contextField = driver.findElement(By.xpath("//XCUIElementTypeTextField[@value='Application context']"));
			contextField.click();
			contextField.sendKeys(serverutil.getMobContext());

			driver.findElement(By.xpath("//XCUIElementTypeButton[@name='Log in']")).click();
			WebElement alertElement =
				    new WebDriverWait(driver, 60).until(
				    ExpectedConditions.presenceOfElementLocated(By.xpath("//XCUIElementTypeAlert[@visible='true']")));

			//*********If notification is enabled you will get the popup*********//
			if (alertElement.isDisplayed()) {
				driver.switchTo().alert().accept();
			}

			//takeScreenshot("Screen shot for Catalog Screen");
			//*********Catalog: Displaying the apps*********//
			WebElement catalogElement = wait.until(
				    ExpectedConditions.presenceOfElementLocated(By.xpath("//XCUIElementTypeStaticText[@name='Catalog']")));
			if (catalogElement.isDisplayed()) {
				AssertJUnit.assertEquals("Catalog", catalogElement.getText());
			} else {
				AssertJUnit.assertEquals(1, 0);//fail the case
			}
		}

	    @Test
		public void loginMobileClientAppCenter() {

	    	try {
				Thread.sleep(10000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

	    	//takeScreenshot("Initial screen");

	    	//*********Enter the login details and login*********//
			WebElement userField = driver.findElement(By.id("appcenter_Login_login"));
			userField.click();
			userField.sendKeys(serverutil.getUsername());

			WebElement passwordField = driver.findElement(By.id("appcenter_Login_pw"));
			passwordField.click();
			passwordField.sendKeys(serverutil.getPassword());

			WebElement hostField = driver.findElement(By.id("appcenter_Login_server"));
			hostField.click();
			hostField.sendKeys(serverutil.getHost());

			WebElement portField = driver.findElement(By.id("appcenter_Login_port"));
			portField.click();
			portField.sendKeys(""+ serverutil.getPort() + "");

			WebElement contextField = driver.findElement(By.id("appcenter_Login_ctx"));
			contextField.click();
			contextField.sendKeys(serverutil.getMobContext());

			//takeScreenshot("Login details entered");
			//driver.findElement(By.id("appcenter_widgets_Button_0")).click();
			//((AndroidDriver)driver).hideKeyboard();
			((AndroidDriver)driver).sendKeyEvent(AndroidKeyCode.ENTER);

			try {
				Thread.sleep(5000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//*********Catalog: Displaying the apps*********//
			WebElement catalogElement = wait.until(
				    ExpectedConditions.presenceOfElementLocated(By.xpath("//android.view.View[@content-desc='Catalog']")));

			//takeScreenshot("Catalog Screen");
			if (catalogElement.isDisplayed()) {
				AssertJUnit.assertEquals(1, 1);
			} else {
				AssertJUnit.assertEquals(1, 0);//fail the case
			}
		}

	    protected File takeScreenshot(String screenshotName) {
	        String fullFileName = System.getenv("screenshot_dir") + screenshotName + ".png";
	        System.out.println("***** Taking screenshot *****");
	        File scrFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);

	        try {
	            File testScreenshot = new File(fullFileName);
	            FileUtils.copyFile(scrFile, testScreenshot);
	            System.out.println("Screenshot stored to " + testScreenshot.getAbsolutePath());

	            return testScreenshot;
	        } catch (IOException e) {
	            e.printStackTrace();
	        }
	        return null;
	}
}
