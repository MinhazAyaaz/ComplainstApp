package com.example.complainstapp;

public class Complaint {

    String id;
    String date;
    String status;
    String title;
    String against;
    String description;
    String reviewer;
    String category;

    public Complaint(String id, String date, String status, String title, String against, String description, String reviewer, String category) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.title = title;
        this.against = against;
        this.description = description;
        this.reviewer = reviewer;
        this.category = category;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
