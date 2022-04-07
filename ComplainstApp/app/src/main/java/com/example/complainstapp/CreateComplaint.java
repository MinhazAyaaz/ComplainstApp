package com.example.complainstapp;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class CreateComplaint extends AppCompatActivity {

    private ImageButton backButton;
    private Button submitButton;
    private String accessToken;
    private ArrayList<String> userArray;
    private AutoCompleteTextView category;
    private TextView title;
    private TextView details;
    private AutoCompleteTextView against;
    private AutoCompleteTextView reviewer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_complaint);

        accessToken = getIntent().getExtras().getString("token");
        backButton = findViewById(R.id.backButton);
        category = findViewById(R.id.categoryField);
        title = findViewById(R.id.titleField);
        details = findViewById(R.id.detailsField);
        against = findViewById(R.id.againstField);
        reviewer = findViewById(R.id.reviewerField);
        submitButton = findViewById(R.id.submitButton);

        AndroidNetworking.get("http://192.168.0.109:5000/users")
                .setTag("test1")
                .addHeaders("x-access-token",accessToken)
                .setPriority(Priority.LOW)
                .build()
                .getAsJSONArray(new JSONArrayRequestListener(){
                    @Override
                    public void onResponse(JSONArray response) {
                        Log.e("users",response.toString());
                        for(int i=0;i<response.length();i++) {
                            try {
//                                userArray.add(response.getJSONObject(i).getString("name"));
                                Log.e("yes",response.getJSONObject(i).getString("name"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                    @Override
                    public void onError(ANError error) {
                        Log.e("error",error.toString());
                    }
                });

        ArrayAdapter<String> userAdapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,userArray);
        against.setAdapter(userAdapter);
        reviewer.setAdapter(userAdapter);

        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                AndroidNetworking.post("http://192.168.0.109:5000/createcomplaint")
                        .addBodyParameter("category", category.getText().toString())
                        .addBodyParameter("title", title.getText().toString())
                        .addBodyParameter("against", against.getText().toString())
                        .addBodyParameter("body", details.getText().toString())
                        .addBodyParameter("reviewer", reviewer.getText().toString())
                        .setTag("test")
                        .addHeaders("x-access-token",accessToken)
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener() {
                            @Override
                            public void onResponse(JSONObject response) {
                                Log.e("Response",response.toString());
                            }
                            @Override
                            public void onError(ANError error) {
                                Log.e("Error",error.toString());
                            }
                        });

            }
        });


        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onBackPressed();
            }
        });
    }

}