package com.example.complainstapp;

public class Complaint {

    String title;
    String against;
    String description;
    String status;

    public Complaint(String title, String against, String description) {
        this.title = title;
        this.against = against;
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAgainst() {
        return against;
    }

    public void setAgainst(String against) {
        this.against = against;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
