package com.tin.crawlers.fillmyfridgecrawler;

import org.apache.log4j.PropertyConfigurator;
import edu.uci.ics.crawler4j.crawler.*;
import edu.uci.ics.crawler4j.fetcher.*;
import edu.uci.ics.crawler4j.robotstxt.*;

public class CrawlerController {	 
	public static void main(String[] args) throws Exception {
		String log4jConfPath = "./log4j.properties";
		PropertyConfigurator.configure(log4jConfPath);
		
        String crawlStorageFolder = "data/";
        
        // create 100 threads to extract the product catalogue
        int numberOfCrawlers = 1000;

        CrawlConfig config = new CrawlConfig();
        
        config.setCrawlStorageFolder(crawlStorageFolder);
        
        // set the number of total pages that this crawler will fetch, which in our case is infinite
        config.setMaxPagesToFetch(Integer.MAX_VALUE);
        
        // this allows the crawler to crawl and retrieve data that is not a html page, i.e a docx, pdf file, etc
        config.setIncludeBinaryContentInCrawling(false);
                
        // Instantiate the controller for this crawl.
        PageFetcher pageFetcher = new PageFetcher(config);
        RobotstxtConfig robotstxtConfig = new RobotstxtConfig();
        RobotstxtServer robotstxtServer = new RobotstxtServer(robotstxtConfig, pageFetcher);
        CrawlController controller = new CrawlController(config, pageFetcher, robotstxtServer);

        
        // The url that we start our crawler from
        controller.addSeed("https://fillmyfridge.ca/products/");
        
        // Start the crawl. This is a blocking operation, meaning that your code
        // will reach the line after this only when crawling is finished.
        controller.start(FillMyFridgeCrawler.class, numberOfCrawlers);
    }
}
