package com.tin.crawlers.dao;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCursor;
import com.tin.crawlers.model.CrawlerDocument;

public class CrawlerDocuments extends Documents{

	public CrawlerDocuments() {
		// call the base class constructor with the appropriate parameter
		// the name is crawler_document instead of CrawlerDocument to fascilitate mongo engine naming in Python
		super("crawler_document");
	}	

	public void insert(CrawlerDocument document) {
		collection.insert(document);
	}
	
	public void delete(int docId) {
		BasicDBObject query = new BasicDBObject();
		query.put("docId", docId);
		collection.remove(query);
	}
	
	public DBCursor findAll() {
		return collection.find();
	}
}


