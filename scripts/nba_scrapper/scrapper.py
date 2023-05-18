from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.utils import ChromeType
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

def nba_scrapper_driver() -> webdriver.Chrome:
    """
    Returns a selenium webdriver object with the correct options to scrape the NBA website

    Parameters:
    -----------
        None

    Returns:
    --------
        - driver (webdriver.Chrome): Selenium webdriver object
    """
    chrome_manager = ChromeDriverManager(chrome_type=ChromeType.CHROMIUM)
    chrome_service = Service(chrome_manager.install())

    chrome_options = Options()
    options = [
        "--headless",
        "--disable-gpu",
        "--window-size=1920,1200",
        "--ignore-certificate-errors",
        "--disable-extensions",
        "--no-sandbox",
        "--disable-dev-shm-usage"
    ]
    for option in options:
        chrome_options.add_argument(option)

    driver = webdriver.Chrome(service = chrome_service, options = chrome_options)

    return driver

# driver.get('https://www.nba.com/stats/player/1630178?PerMode=Totals&SeasonType=Regular+Season')
# print(driver.page_source)