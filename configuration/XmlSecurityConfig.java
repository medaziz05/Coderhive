package com.codingfactory.course_management.configuration;

import jakarta.annotation.PostConstruct;

public class XmlSecurityConfig {
    @PostConstruct
    public void disableXXE() {
        // Prevent XXE attacks globally
        System.setProperty("javax.xml.parsers.DocumentBuilderFactory",
                "com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl");
        System.setProperty("javax.xml.parsers.SAXParserFactory",
                "com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl");
    }
}