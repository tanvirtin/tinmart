package com.tin.crawlers.fillmyfridgecrawler;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.Parser;
import org.apache.tika.sax.BodyContentHandler;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xml.sax.SAXException;

import com.tin.crawlers.dao.CrawlerDocuments;
import com.tin.crawlers.model.CrawlerDocument;

import edu.uci.ics.crawler4j.crawler.Page;
import edu.uci.ics.crawler4j.parser.HtmlParseData;

/*
 * @Class archives all necessary documents crawled by the crawler
 */
public class DocumentArchiver {
	
	 private static CrawlerDocuments crawlerDocuments = null;
	 private static HashMap<String, String> duplicateChecker = null;
	 // keeps track of the unique docId
	 private static int id = 0;
	 
	 public DocumentArchiver() {
		 if (crawlerDocuments == null) {
			 // create the collection dao object that will insert the documents crawled
			 crawlerDocuments = new CrawlerDocuments();
			 // after instantiating the object drop the previous collection first always
			 crawlerDocuments.drop();
			 // construct the duplicateCheckHashMap
			 duplicateChecker = new HashMap<String, String>();
		 }
	 }
	 
	 private void archiveDocument(CrawlerDocument crawlerDocument) {
		// create the thread
		Thread archiveThread = new Thread(() -> {
			crawlerDocuments.insert(crawlerDocument);
		});
		
		// start the thread
		archiveThread.start();
	 }
	 
	 /**
	  * Checks for duplicate documents
	  * @param title the title that gets looked up for duplicates
	  * @return if true then it means that the document is unique, false otherwise
	  */
	 private boolean duplicateChecker(String title) {
		 String value = duplicateChecker.get(title);
		 
		 // if value is null then the document doesn't exists
		 if (value == null) {
			 // then add the document
			 duplicateChecker.put(title, "+");
			 return true;
		 }
		 return false;
	 }
	
	/*
	 * Extacts necessary information from html urls and stores it as LuceneDocument in the database
	 * @param page url object from which the html data is extracted 
	 */
	public void archiveHtml(Page page) throws IOException, SAXException, TikaException {
		String url = page.getWebURL().toString();
		
		// pageUrl object is required for tika parser to extract the metadata
		URL pageUrl = new URL(url);
		
		HtmlParseData htmlParseData = (HtmlParseData) page.getParseData();
		String html = htmlParseData.getHtml();
		
		org.jsoup.nodes.Document doc = Jsoup.parse(html);
		
		int docId = id++; 
		String title = extractTitle(doc);
		double price = extractPrice(doc);
		String category = extractCategory(doc);
		String productImgUrl = extractProductImgUrl(doc);
		String date = getCurrentDate();
		HashMap<String, String> metadata = extractMetadata(pageUrl);
		
		final CrawlerDocument crawlerDocument = new CrawlerDocument();
		
		crawlerDocument.setDocId(docId);
		crawlerDocument.setUrl(url);
		crawlerDocument.setTitle(title);
		crawlerDocument.setPrice(price);
		crawlerDocument.setCategory(category);
		crawlerDocument.setProductImgUrl(productImgUrl);
		crawlerDocument.setDate(date);
		crawlerDocument.setMetadata(metadata);
		
		if (duplicateChecker(title)) {
			archiveDocument(crawlerDocument);
			System.out.println(crawlerDocument);
		}
	}
	
	/*
	 * gets current date when this procedure gets invoked
	 */
	private String getCurrentDate() {
		DateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		Date date = new Date();
		
		return dateFormat.format(date);
	}
	  
	/*
	 * Extacts metadata from a given url
	 * @param pageUrl the url object from which the metadata is extracted
	 * @return a HashMap of metadata 
	 */
	private HashMap<String, String> extractMetadata(URL pageUrl) throws IOException, SAXException, TikaException {
		HashMap<String, String> metadataMap = new HashMap<String, String>();
		// create an input stream and extract the data from the url provided
		InputStream inStream = pageUrl.openStream();
		
		// parse the data obtained from the url and parse the data using tika, the number of characters stored in the handler is a very high number
		BodyContentHandler handler = new BodyContentHandler(Integer.MAX_VALUE);
		
		ParseContext parseContext = new ParseContext();
		

		Metadata metadata = new Metadata();
		Parser parser = new AutoDetectParser();
		parser.parse(inStream, handler, metadata, parseContext);

		// close the input stream
		inStream.close();
		
	    ArrayList<String> metadataNames = new ArrayList<String>(Arrays.asList(metadata.names()));
	 
		
	    for (int i = 0; i < metadataNames.size(); ++i) {
	    	String metadataName = metadataNames.get(i);
	    	// inserting all the metadata inside the document
	    	metadataMap.put(metadataName, metadata.get(metadataName));
	    }
	    
	    return metadataMap;
	}
	
	/*
	 * Checks whether a sentance contains a phrase
	 * @return returns true if the sentance contains the phrase and false otherwise
	 */
	private boolean contains(String sentance, String phrase) {
		return ((sentance.toLowerCase().indexOf(phrase.toLowerCase()) != -1));
	}
	
	/**
	 * Converts a price string to a price text
	 * @param priceText the price in string
	 * @return returns the price in double
	 */
	private double priceToDouble(String priceText) {
		// I get the substring starting form the first index as the 0th index is the $ symbol
		String priceString = priceText.substring(1, priceText.length());

		// parse the string into a double
		double price = Double.parseDouble(priceString);
 		
		// return that price
		return price;
	}
	
	public String extractCategory(Document doc) {
		Elements scripts = doc.getElementsByTag("script");
		
		// this script will contain the category of the product
		int scriptIndexWhichContainsProducts = 26;
		
		Element script = scripts.get(scriptIndexWhichContainsProducts);
		String scriptData = script.data();
		
		// now to parse this script to a category
		
		String unwantedStartWord = "var meta = ";
		
		int unwantedStartWordIndex = scriptData.indexOf(unwantedStartWord);
		
		int startIndex = unwantedStartWordIndex + unwantedStartWord.length();
		
		String slightlyMoreParsedString = scriptData.substring(startIndex);
		
		// get the first semicolon
		int semiColonIndex = slightlyMoreParsedString.indexOf(';');
		
		// the string between these index is a json string containing data about the product inside the script tag
		String jsonString = slightlyMoreParsedString.substring(0, semiColonIndex);
		
		String type = "\"type\":\"";
		
		int indexOfTypeAfter = jsonString.indexOf(type) + type.length();
		
		String categoryStringUnParsed = jsonString.substring(indexOfTypeAfter);
		
		String endString = "\"";
		
		int indexOfEndString = categoryStringUnParsed.indexOf(endString);
		
		String category = categoryStringUnParsed.substring(0, indexOfEndString);
		
		return category;
	}
		
	private String extractTitle(Document doc) {
		String unparsedTitle = doc.title();
		
		// index of the unwanted string
		int unwantedIndex = unparsedTitle.indexOf(" FillMyFridge.ca");
		
		// from index 0 to and not including unwantedIndex
		String title = unparsedTitle.substring(0, unwantedIndex - 2);
		
		// product title
		return title;
	}
	
	private double extractPrice(Document doc) {
		Element priceSpan = doc.getElementById("ProductPrice");
		
		String priceString = priceSpan.text();
		
		double price = priceToDouble(priceString);
		
		return price;
	}
	
	private String extractProductImgUrl(Document doc) {
		String productImgUrl = "";
		
		Elements images = doc.getElementsByTag("img");
		for (int i = 0; i < images.size(); ++i) {						
			Element img = images.get(i);
			String imgUrl = img.attr("src");
			String newImgUrl = "http:" + imgUrl;
			
			// the id of the product should be ProductPhotoImg that is how we identify the product id
			String id = img.attr("id");
			
			if (contains(id, "ProductPhotoImg")) {
				productImgUrl = newImgUrl;
			}
		}
		
		return productImgUrl;
	}
}
