package com.tin.crawlers.fillmyfridgecrawler;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.regex.Pattern;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;
import edu.uci.ics.crawler4j.crawler.*;
import edu.uci.ics.crawler4j.url.*;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;
import org.apache.tika.exception.TikaException;
import com.mongodb.*;

public class FillMyFridgeCrawler extends WebCrawler {
	 // FILTER will contain a regular experession which will contain all the formats that this web crawler cannot crawl
	 private final static Pattern FILTERS = Pattern.compile(".*(\\.(css|js|" + "|mp3|mp4|zip|gz))$");
	 	 
	 // instance of the document archiver class
	 private DocumentArchiver docArchiver;
	 	 
	 public FillMyFridgeCrawler() throws UnknownHostException, MongoException {
		 // super() constructor is called to instantiate the base class
		 super();
		 
		 // turn the debug logs off for the crawler
		 turnOffDebugLogs();
		 		 
		 // instantiate the document archiver
		 docArchiver = new DocumentArchiver();
	 }
	 
	 /*
	  * Turns off debug logs to make the console lets cluttered
	  */
	 private void turnOffDebugLogs() {
		 // disable the debug logs
		 LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
		 // get the object responsible for logging mongodb details
		 Logger mongoLogger = loggerContext.getLogger("edu.uci.ics.crawler4j.crawler.WebCrawler");
		 // after you have the object just turn it off
		 mongoLogger.setLevel(Level.OFF);	
	 }
	 
	@Override
	public boolean shouldVisit(Page referringPage, WebURL url) {
		String href = url.getURL().toLowerCase();
				
		// makes sure that our crawler doesn't wander off to different urls which don't belong to walmart
		boolean check = !FILTERS.matcher(href).matches() && (href.startsWith("https://fillmyfridge.ca/"));
		return check;
	}
					
	@Override
	public void visit(Page page) {
		try {
			docArchiver.archiveHtml(page);
		} catch (IOException | SAXException | TikaException e) {
			e.printStackTrace();
		}	
	}

}
