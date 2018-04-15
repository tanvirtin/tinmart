package com.tin.crawlers.dao;

import org.slf4j.LoggerFactory;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;

// all the dao classes extend this abstract class
public abstract class Documents {
	 protected MongoClient mongoClient;
	 protected DB database;
	 protected DBCollection collection;
	 
	 protected int port;
	 protected String ip;
	 protected String databaseName;
	 
	 public Documents(String graphCollectionName) {
		 // turn the debug logs for MongoDB off
		 turnOffDebugLogs();
		 port = 27017;
		 ip = "localhost";
		 databaseName = "fillmyfridge";
		 
		 // all the variables are initialized
		 mongoClient = new MongoClient(ip, port);
		 database = mongoClient.getDB(databaseName);
		 
		 collection = database.getCollection(graphCollectionName);
	 }
	 
	 /*
	  * Turns off mongodb debug logs to make the console lets cluttered
	  */
	 private void turnOffDebugLogs() {
		 // disable the debug logs
		 LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
		 // get the object responsible for logging mongodb details
		 Logger mongoLogger = loggerContext.getLogger("org.mongodb.driver");
		 // after you have the object just turn it off
		 mongoLogger.setLevel(Level.OFF);	
	 }
	 
	 /*
	  * Drops the collection by removing all its contents
	  */
	 public void drop() {
		 collection.drop();
	 }
}
