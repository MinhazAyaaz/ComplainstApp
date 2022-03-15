package com.example.complainstapp;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.GET;


public interface JSONPlaceholder {

    @GET("getcomplaint")
    Call<List<Complaint>> getComplaints();

}
