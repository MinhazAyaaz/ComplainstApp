package com.example.complainstapp;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;

import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.recyclerview.widget.RecyclerView;

import com.example.complainstapp.databinding.ActivityMainBinding;

import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HomepageActivity extends AppCompatActivity {

    private Button createButton;
    private RadioGroup filterGroup;
    private RecyclerView recyclerView;
    private ProgressBar progressBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homepage);

        createButton = findViewById(R.id.createButton5);
        filterGroup = findViewById(R.id.filterGrouping);
        progressBar = findViewById(R.id.progressBar);
        recyclerView = findViewById(R.id.dataView);
        int selectedId = filterGroup.getCheckedRadioButtonId();

        progressBar.setVisibility(View.VISIBLE);

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://192.168.0.106:5000/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        JSONPlaceholder jsonPlaceholder = retrofit.create(JSONPlaceholder.class);
        Call<List<Complaint>> call = jsonPlaceholder.getComplaints();
        call.enqueue(new Callback<List<Complaint>>() {
            @Override
            public void onResponse(Call<List<Complaint>> call, Response<List<Complaint>> response) {

                if(!response.isSuccessful()){
                    Toast.makeText(HomepageActivity.this,response.code(),Toast.LENGTH_SHORT);
                    return;
                }
                List<Complaint> complaintList = response.body();
                ArrayList<Complaint> complaintArrayList = new ArrayList<>();
                for(int i=0;i<complaintList.size();i++){
                    Complaint tempComplaint = new Complaint(complaintList.get(i).getId(),complaintList.get(i).getDate(),complaintList.get(i).getStatus(),
                            complaintList.get(i).getTitle(),complaintList.get(i).getAgainst(),complaintList.get(i).getDescription(),complaintList.get(i).getReviewer());
                    complaintArrayList.add(tempComplaint);
                }

                RecyclerAdapter recyclerAdapter = new RecyclerAdapter(complaintArrayList);
                recyclerView.setAdapter(recyclerAdapter);
                progressBar.setVisibility(View.INVISIBLE);

            }

            @Override
            public void onFailure(Call<List<Complaint>> call, Throwable t) {
                Toast.makeText(HomepageActivity.this,t.getMessage(),Toast.LENGTH_SHORT);
                createButton.setText(t.getMessage());
                progressBar.setVisibility(View.INVISIBLE);
            }
        });

        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(HomepageActivity.this, CreateComplaint.class);
                startActivity(intent);
            }
        });

    }

}
