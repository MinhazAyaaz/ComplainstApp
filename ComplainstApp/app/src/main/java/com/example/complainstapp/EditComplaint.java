package com.example.complainstapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.TextView;

public class EditComplaint extends AppCompatActivity {

    private AutoCompleteTextView category;
    private TextView title;
    private TextView details;
    private AutoCompleteTextView against;
    private AutoCompleteTextView reviewer;
    private Button saveButton;
    private Button cancelButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_complaint);

        category = findViewById(R.id.categoryField);
        title = findViewById(R.id.titleField);
        details = findViewById(R.id.detailsField);
        against = findViewById(R.id.againstField);
        reviewer = findViewById(R.id.reviewerField);
        saveButton = findViewById(R.id.saveButton);
        cancelButton = findViewById(R.id.cancelButton);

        category.setText(getIntent().getExtras().getString("category"));
        title.setText(getIntent().getExtras().getString("title"));
        details.setText(getIntent().getExtras().getString("details"));
        against.setText(getIntent().getExtras().getString("against"));
        reviewer.setText(getIntent().getExtras().getString("reviewer"));

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(EditComplaint.this, HomepageActivity.class);
                startActivity(intent);
                finish();
            }
        });

        cancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(EditComplaint.this, HomepageActivity.class);
                startActivity(intent);
                finish();
            }
        });


    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(false);
    }
}