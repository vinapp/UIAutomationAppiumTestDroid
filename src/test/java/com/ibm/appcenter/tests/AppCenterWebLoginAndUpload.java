package com.ibm.appcenter.tests;		

import java.io.File;
import java.net.MalformedURLException;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.AssertJUnit;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;

import com.ibm.appcenter.tests.utils.ServerUtil;


public class AppCenterWebLoginAndUpload {		
		
		public WebDriver driver;
	    public ServerUtil serverutil;
	    public WebDriverWait wait;
    
	    @BeforeClass
		void setup() throws MalformedURLException {
	        serverutil = ServerUtil.getInstance();
	        File file = new File(serverutil.getChoromeDriverPath());
			System.setProperty("webdriver.chrome.driver", file.getAbsolutePath());
		    driver = new ChromeDriver();
		    wait = new WebDriverWait(driver, 15);
		}
		
		@AfterClass
		public void teardown() {
			driver.quit();	
		}
		
	    @Test			
		public void loginWebAppCenter() {	
			//*********enter the login details and login*********//
	    	
	    	driver.navigate().to(serverutil.getAbsoluteurl());
	    	
	    	WebElement txtbox_email = driver.findElement(By.name("j_username"));
		    txtbox_email.sendKeys(serverutil.getUsername());
		   
		    WebElement txt_pass = driver.findElement(By.name("j_password"));
		    txt_pass.sendKeys(serverutil.getPassword());
		    
		    driver.findElement(By.id("loginButton")).click();		    
		    wait.until(ExpectedConditions.titleIs("Application Center"));
			
		    String title = driver.getTitle();
		    AssertJUnit.assertEquals("Application Center", title);
		}
	    
	    @Test(dependsOnMethods = { "loginWebAppCenter" })	
		public void uploadAnApp() {
	    	
	    	//*********click Add Application button*********//
	    	wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dijit_form_Button_0")));
		    WebElement addAppBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_0']"
																+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));		    
	    	((ChromeDriver)driver).executeScript("arguments[0].click();", addAppBtn);
	    	
	    	wait.until(ExpectedConditions.presenceOfElementLocated(By.name("uploadedfile")));	    	
	    	AssertJUnit.assertTrue(driver.getCurrentUrl().contains("Main,AddApplication"));
	    	
	    	//*********click Next upload and select the file*********//
	    	WebElement uploadBtn = driver.findElement(By.xpath("(//span[@class='dijitReset dijitInline dijitButtonNode'])[5]"));
		    ((ChromeDriver)driver).executeScript("arguments[0].click();", uploadBtn);
	    	driver.switchTo().activeElement().sendKeys(serverutil.getSampleUploadFile());
		    
	    	//*********wait till the file gets uploaded*********//
		    wait.withTimeout(120, TimeUnit.SECONDS);
		    wait.withMessage("file upload didn't succeed");
		    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'File Hello.ipa uploaded')]")));
		    		    		   		    
		    //*********click next button*********//
		    WebElement nextBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_3']"
					+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));
		    ((ChromeDriver)driver).executeScript("arguments[0].click();", nextBtn);
		    
		    //*********check for done button*********//
		    wait.withTimeout(5, TimeUnit.SECONDS);
		    wait.withMessage("not able to reach to Done button");
		    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(text(),'Done')]")));
		    
		    //*********enter the label*********//
		    WebElement appLabel = driver.findElement(By.xpath("//div[@id='widget_appcenter_widgets_ApplicationDetails_0_appLabel']"
		    												+ "/div[@class='dijitReset dijitInputField dijitInputContainer']"
		    												+ "/input[@id='appcenter_widgets_ApplicationDetails_0_appLabel']"));
		    appLabel.sendKeys("Hello");
		    
		    //*********click done button*********//
		    WebElement doneBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_4']"
															+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));		    
		    ((ChromeDriver)driver).executeScript("arguments[0].click();", doneBtn);
		    
		    		    		    
		    //*********alert if the app is unsigned (android)*********//
		    wait.withTimeout(1, TimeUnit.SECONDS);
		    WebElement alertBtn;
		    try {
			    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'FWLAC0108W')]")));
			    alertBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_6']"
													+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));		    
			    ((ChromeDriver)driver).executeScript("arguments[0].click();", alertBtn);
		    } catch (TimeoutException timout) {
		    	System.out.println("uploadAnApp(TimeoutException) ==> ignore this");
		    	//*********ignore this.. suppress the alert*********//
		    	alertBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_6']"
													+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));
		    	((ChromeDriver)driver).executeScript("arguments[0].click();", alertBtn);
		    	
		    	//*********click done*********//
		    	doneBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_4']"
													+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));		    
		    	((ChromeDriver)driver).executeScript("arguments[0].click();", doneBtn);
		    } catch (NoSuchElementException nosuchele) {
		    	//*********ignore this..*********//
		    	System.out.println("uploadAnApp(NoSuchElementException)");
		    } catch (Exception e) {
		    	System.out.println("uploadAnApp(Exception)");
		    	e.printStackTrace();
		    }
		    wait.withTimeout(15, TimeUnit.SECONDS);
		    wait.withMessage("app listing problems");
		    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//a[contains(text(),'Hello')]")));
		    		    
	    	
	    	//*********Uncomment the below code to delete the app*********//
	    	/*
	    	    WebElement helloApp = driver.findElement(By.xpath("//a[@class='puremeap-link' and contains(text(),'Hello')]"));	    	
	    		((ChromeDriver)driver).executeScript("arguments[0].click();", helloApp);
	    	
		    	wait.withTimeout(5, TimeUnit.SECONDS);
		    	wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//span[contains(text(),'Delete')]")));
		    	wait.withMessage("not able to reach to Delete button");
			    WebElement deleteBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_11']"
													+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));
		    	((ChromeDriver)driver).executeScript("arguments[0].click();", deleteBtn);
		    	
		    	wait.withTimeout(2, TimeUnit.SECONDS);
		    	wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[contains(text(),'Permanently delete')]")));
			    alertBtn = driver.findElement(By.xpath("//span[@widgetid='dijit_form_Button_6']"
													+ "/span[@class='dijitReset dijitInline dijitButtonNode']"));		    
			    ((ChromeDriver)driver).executeScript("arguments[0].click();", alertBtn);
		    */
	    	
	    	wait.withTimeout(2, TimeUnit.SECONDS);
		    wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(),'Available Applications')]")));
		}		
}	