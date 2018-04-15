package com.tin.crawlers.model;

import java.util.HashMap;

import com.mongodb.BasicDBObject;

public class CrawlerDocument extends BasicDBObject {

	private static final long serialVersionUID = 1L;
	private int docId;
	private String url;
	private String title;
	private String category;
	private double price;
	private String date;
	private String productImgUrl;
	private HashMap<String, String> metadata;
	
	public CrawlerDocument() {
		
	}
	
	/*
	 * Constructors with many parameters which you can use or you can use setters
	 */
	public CrawlerDocument(int docId, String url, String title, double price, String category, String productImgUrl,
			String date, HashMap<String, String> metadata) {
		this.docId = docId;
		this.url = url;
		this.title = title;
		this.category = category;
		this.price = price;
		this.date = date;
		this.productImgUrl = productImgUrl;
		this.metadata = metadata;
		
		populateDBObject();
	}
	
	public void populateDBObject() {
		this.put("docId", docId);
		this.put("url", url);
		this.put("title", title);
		this.put("category", category);
		this.put("price", price);
		this.put("date", date);
		this.put("metadata", metadata);
		this.put("productImgUrl", productImgUrl);
	}
	

	public void setDocId(int docId) {
		this.docId = docId;
		this.put("docId", docId);
	}

	public void setUrl(String url) {
		this.url = url;
		this.put("url", url);
	}
	

	public void setTitle(String title) {
		this.title = title;
		this.put("title", title);
	}
		
	public void setCategory(String category) {
		this.category = category;
		this.put("category", category);
	}
		
	public void setPrice(double price) {
		this.price = price;
		this.put("price", price);
	}

	public void setDate(String date) {
		this.date = date;
		this.put("date", date);
	}

	public void setMetadata(HashMap<String, String> metadata) {
		this.metadata = metadata;
		this.put("metadata", metadata);
	}
	
	public void setProductImgUrl(String productImgUrl) {
		this.productImgUrl = productImgUrl;
		this.put("productImgUrl", productImgUrl);
	}
			
	public int getDocId() {
		return docId;
	}

	public String getUrl() {
		return url;
	}

	public String getTitle() {
		return title;
	}
	
	public String getCategory() {
		return category;
	}
	
	public double getPrice() {
		return price;
	}
	
	public String getDate() {
		return date;
	}


	public HashMap<String, String> getMetadata() {
		return metadata;
	}
	
	public String getProductImgUrl() {
		return productImgUrl;
	}
	
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("---------------------");
		sb.append("\n");
		sb.append("docId: " + docId);
		sb.append("\n");
		sb.append("Url: " + url);
		sb.append("\n");
		sb.append("Title: " + title);
		sb.append("\n");
		sb.append("price: " + price);
		sb.append("\n");
		sb.append("category: " + category);
		sb.append("\n");
		sb.append("productImgUrl: " + productImgUrl);
		sb.append("\n");
		sb.append("Date: " + date);
		sb.append("\n");
		sb.append("Metadata: " + metadata);
		sb.append("\n");
		sb.append("---------------------");
		return sb.toString();
	}
}
