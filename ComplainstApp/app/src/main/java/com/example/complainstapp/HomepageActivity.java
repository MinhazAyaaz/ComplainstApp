package com.example.complainstapp;

import android.app.Dialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.bumptech.glide.Glide;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.snackbar.Snackbar;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import androidx.navigation.NavController;
import androidx.navigation.Navigation;
import androidx.navigation.ui.AppBarConfiguration;
import androidx.navigation.ui.NavigationUI;
import androidx.recyclerview.widget.RecyclerView;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RadioGroup;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class HomepageActivity extends AppCompatActivity{

    //Declaring variables for the text fields,buttons and google sign up
    //We make the variables private so they cannot be accessed.
    private Button createButton;
    private Button logoutButton;
    private String nsuid;
    private RadioGroup filterGroup;
    private RecyclerView recyclerView;
    private ProgressBar progressBar;
    private String accessToken;
    private String name;
    private ImageView profilePicture;
    private final ArrayList<Complaint> complaintArrayList = new ArrayList<>();
    GoogleSignInClient mGoogleSignInClient;

    //The onCreate method which is called on activity start
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_homepage);

        //Initializing the variables
        createButton = findViewById(R.id.createButton5);
        filterGroup = findViewById(R.id.filterGrouping);
        progressBar = findViewById(R.id.progressBar);
        recyclerView = findViewById(R.id.dataView);
        logoutButton = findViewById(R.id.signOutButton);
        profilePicture = findViewById(R.id.profilePicture);

        //Retrieving the access token received from the post request in the previous activity
        accessToken = getIntent().getExtras().getString("token");
        nsuid = getIntent().getExtras().getString("nsuid");

        Glide.with(this).load("https://www.seekpng.com/png/detail/72-729756_how-to-add-a-new-user-to-your.png").into(profilePicture);

        //progress bar used to show loading
        progressBar.setVisibility(View.VISIBLE);

        //Get request to get filed complaints
        //We are sending the access token as x-access-token
        //The JSON Array received is used to create a Complaint object
        AndroidNetworking.get("http://192.168.43.187:5000/getcomplaint/filed")
                .setTag("test1")
                .addHeaders("x-access-token",accessToken)
                .setPriority(Priority.LOW)
                .build()
                .getAsJSONArray(new JSONArrayRequestListener(){
                    @Override
                    public void onResponse(JSONArray response) {
                        for(int i=0;i<response.length();i++){
                            Complaint tempComplaint = null;
                            try {
                                tempComplaint = new Complaint(response.getJSONObject(i).getString("complaintid"),response.getJSONObject(i).getString("createdAt"),
                                        response.getJSONObject(i).getString("status"), response.getJSONObject(i).getString("title"),
                                        response.getJSONObject(i).getString("against"),
                                        response.getJSONObject(i).getString("body"),response.getJSONObject(i).getString("reviewer")
                                        ,response.getJSONObject(i).getString("category"),response.getJSONObject(i).getString("evidence"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                            complaintArrayList.add(tempComplaint);
                        }

                        //Upon response we are creating the object.
                        //The object is then added to an array list which is served to the recycler view
                        RecyclerAdapter recyclerAdapter = new RecyclerAdapter(complaintArrayList);
                        recyclerView.setAdapter(recyclerAdapter);
                        //After setting all the complaints to the recycler view we hide the progress bar
                        progressBar.setVisibility(View.INVISIBLE);
                    }
                    @Override
                    public void onError(ANError error) {
                        Log.e("error",error.toString());
                    }
                });


        //The filterGroup is used to switch between filed and received complaints
        filterGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int selectedId) {

                //Initially we clear the array list to remove previous complaints
                complaintArrayList.clear();
                progressBar.setVisibility(View.VISIBLE);
                if(selectedId == R.id.radioButton3){
                    //We then call the get request for the filed complaints and add them to the Array List
                    AndroidNetworking.get("http://192.168.43.187:5000/getcomplaint/filed")
                            .setTag("test1")
                            .addHeaders("x-access-token",accessToken)
                            .setPriority(Priority.LOW)
                            .build()
                            .getAsJSONArray(new JSONArrayRequestListener(){
                                @Override
                                public void onResponse(JSONArray response) {
                                    for(int i=0;i<response.length();i++){
                                        //We create a temporary object and initialize null
                                        Complaint tempComplaint = null;
                                        try {
                                            //Here we get the JSONObject from the response and call every attribute using getString() method
                                            tempComplaint = new Complaint(response.getJSONObject(i).getString("complaintid"),response.getJSONObject(i).getString("createdAt"),
                                                    response.getJSONObject(i).getString("status"), response.getJSONObject(i).getString("title"),
                                                    response.getJSONObject(i).getString("against"),
                                                    response.getJSONObject(i).getString("body"),response.getJSONObject(i).getString("reviewer")
                                                    ,response.getJSONObject(i).getString("category"),response.getJSONObject(i).getString("evidence"));
                                        } catch (JSONException e) {
                                            e.printStackTrace();
                                        }
                                        //after creating every complaint we add it to the array list
                                        complaintArrayList.add(tempComplaint);
                                    }

                                    //Upon response we are creating the object.
                                    //The object is then added to an array list which is served to the recycler view
                                    RecyclerAdapter recyclerAdapter = new RecyclerAdapter(complaintArrayList);
                                    recyclerView.setAdapter(recyclerAdapter);
                                    //After setting all the complaints to the recycler view we hide the progress bar
                                    progressBar.setVisibility(View.INVISIBLE);
                                }
                                @Override
                                public void onError(ANError error) {
                                    Log.e("error",error.toString());
                                }
                            });
                }
                else if(selectedId == R.id.radioButton4){
                    //We call the get request for the received complaints and add them to the Array List
                    AndroidNetworking.get("http://192.168.43.187:5000/getcomplaint/received")
                            .setTag("test1")
                            .addHeaders("x-access-token",accessToken)
                            .setPriority(Priority.LOW)
                            .build()
                            .getAsJSONArray(new JSONArrayRequestListener(){
                                @Override
                                public void onResponse(JSONArray response) {
                                    for(int i=0;i<response.length();i++){
                                        //We create a temporary object and initialize null
                                        Complaint tempComplaint = null;
                                        try {
                                            //Here we get the JSONObject from the response and call every attribute using getString() method
                                            tempComplaint = new Complaint(response.getJSONObject(i).getString("complaintid"),response.getJSONObject(i).getString("createdAt"),
                                                    response.getJSONObject(i).getString("status"), response.getJSONObject(i).getString("title"),
                                                    response.getJSONObject(i).getString("against"),
                                                    response.getJSONObject(i).getString("body"),response.getJSONObject(i).getString("reviewer")
                                                    ,response.getJSONObject(i).getString("category"),response.getJSONObject(i).getString("evidence"));
                                        } catch (JSONException e) {
                                            e.printStackTrace();
                                        }
                                        //after creating every complaint we add it to the array list
                                        complaintArrayList.add(tempComplaint);
                                    }

                                    //Upon response we are creating the object.
                                    //The object is then added to an array list which is served to the recycler view
                                    RecyclerAdapter recyclerAdapter = new RecyclerAdapter(complaintArrayList);
                                    recyclerView.setAdapter(recyclerAdapter);
                                    //After setting all the complaints to the recycler view we hide the progress bar
                                    progressBar.setVisibility(View.INVISIBLE);
                                }
                                @Override
                                public void onError(ANError error) {
                                    Log.e("error",error.toString());
                                }
                            });
                }
            }
        });

        //The create button redirects the user to the create complaint page
        //where the user can proceed in creating a complaint
        //it does this by calling the CreateComplaint activity
        createButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(HomepageActivity.this, CreateComplaint.class);
                //We send access token to this activity as well as we need it for the post/get request
                intent.putExtra("token",accessToken);
                intent.putExtra("nsuid",nsuid);
                startActivity(intent);
            }
        });

        //The logout button calls the signOut() method which signs the user out of the app
        logoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                signOut();
            }
        });

        //We initialize the google sign in client again so that we can use it to log out of our google account
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com")
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

    }

    //This signout method signs us out of the google account and redirects user back to login page
    private void signOut() {
        mGoogleSignInClient.signOut()
                .addOnCompleteListener(this, new OnCompleteListener<Void>() {
                    @Override
                    public void onComplete(@NonNull Task<Void> task) {
                        Intent intent = new Intent(HomepageActivity.this,LoginActivity.class);
                        startActivity(intent);
                        finish();
                    }
                });

        SharedPreferences preferences =getSharedPreferences("checkbox",MODE_PRIVATE);
        SharedPreferences.Editor editor = preferences.edit();
        editor.clear();
        editor.apply();
    }

    //The back method is disabled so user cannot go back to login without pressing logout
    @Override
    public void onBackPressed() {
        moveTaskToBack(false);
    }
}
