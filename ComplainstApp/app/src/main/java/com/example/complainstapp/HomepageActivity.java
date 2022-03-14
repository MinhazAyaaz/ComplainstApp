package com.example.complainstapp;

import android.app.Dialog;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;

import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

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
import android.widget.RadioGroup;
import android.widget.TextView;

public class HomepageActivity extends AppCompatActivity {

    private Button createButton;
    private RadioGroup filterGroup;
    private RecyclerView recyclerView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homepage);

        createButton = findViewById(R.id.createButton5);
        filterGroup = findViewById(R.id.filterGrouping);
        recyclerView = findViewById(R.id.dataView);
        int selectedId = filterGroup.getCheckedRadioButtonId();

        Complaint[] complaints = {
                new Complaint("Harassment1","FirstName1 LastName1","Description1"),
                new Complaint("Harassment2","FirstName2 LastName2","Description2"),
                new Complaint("Harassment3","FirstName3 LastName3","Description3"),
                new Complaint("Harassment4","FirstName4 LastName4","Description4"),
                new Complaint("Harassment5","FirstName5 LastName5","Description5"),
        };

        RecyclerAdapter recyclerAdapter = new RecyclerAdapter(complaints);
        recyclerView.setAdapter(recyclerAdapter);

        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(HomepageActivity.this, CreateComplaint.class);
                startActivity(intent);
            }
        });

    }

}
