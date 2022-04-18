package com.example.complainstapp;

import android.content.Intent;
import android.os.Bundle;

import com.google.android.material.snackbar.Snackbar;

import androidx.appcompat.app.AppCompatActivity;

import android.view.View;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;

import android.view.Menu;
import android.view.MenuItem;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.Toast;

//The landing page activity
public class MainActivity extends AppCompatActivity {

    //Declaring required variables
    private String selectedRole;
    String[] roles = {"Student","Helper Staff","Admin"};
    AutoCompleteTextView roleDropdown;
    ArrayAdapter<String> adapterItems;
    Button proceed;

    //The onCreate function is called on start of activity
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Initializing the variables
        selectedRole = null;
        roleDropdown = findViewById(R.id.autoCompleteTextView);
        proceed = findViewById(R.id.elevatedButton);

        //The roles array is set in the ArrayAdapter and passed to the roleDropdown component
        //The OnItemClickListener assigns the selected option to the selectedRole variable
        adapterItems = new ArrayAdapter<String>(this,R.layout.list_item,roles);
        roleDropdown.setAdapter(adapterItems);
        roleDropdown.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                selectedRole = parent.getItemAtPosition(position).toString();
            }
        });

        //The click listener for the proceed button launches activity based on the selectedRole
        proceed.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    //if selected role is Student
                    if(selectedRole.equals("Student")) {
                        Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                        startActivity(intent);
                    }
                    //if selected role is Helper Staff
                    else if(selectedRole.equals(("Helper Staff"))){
                        Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                        startActivity(intent);
                    }
                    //if selected role is Admin
                    else if(selectedRole.equals(("Admin"))){
                        Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                        startActivity(intent);
                    }
                }catch(Exception e){
                    //If no role is selected the user is asked to select a role
                    Toast.makeText(MainActivity.this, "Please select a role!", Toast.LENGTH_SHORT).show();
                }
            }
        });

    }
}