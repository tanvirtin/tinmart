package com.tin.crawlers.utilities;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.TokenStream;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.analysis.tokenattributes.CharTermAttribute;

/*
 * @Class is a singleton extracts tags for a given string
 * Reference - https://stackoverflow.com/questions/6334692/how-to-use-a-lucene-analyzer-to-tokenize-a-string
 */
public final class TagExtractor {
	
	private static TagExtractor tE = null;
	private static Analyzer analyzer;
	
	private TagExtractor() {
		
	}
	
	public static TagExtractor getInstance() {
		if (tE == null) {
			tE = new TagExtractor();
		}
		return tE;
	}
	
	/*
	 * Static class method extract takes in a string and spits out its tags
	 * @param content string which gets tokenized
	 */
	public static ArrayList<String> extract(String content) throws IOException {
		analyzer = new StandardAnalyzer();
		ArrayList<String> tags = new ArrayList<String>();
		
		// read the contents of the string into a stream
		TokenStream stream = analyzer.tokenStream(null, new StringReader(content));
		stream.reset();
		
		while (stream.incrementToken()) {
			tags.add(stream.getAttribute(CharTermAttribute.class).toString());
		}
		return tags;
	}
}
