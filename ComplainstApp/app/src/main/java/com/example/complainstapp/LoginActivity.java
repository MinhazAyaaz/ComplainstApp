package com.example.complainstapp;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.common.Priority;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONArrayRequestListener;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.util.Log;
import android.view.View;

import com.google.android.material.textfield.TextInputLayout;

import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

//The login page activity
public class LoginActivity extends AppCompatActivity {

    //Declaring variables for the text fields,buttons and google sign up
    //We make the variables private so they cannot be accessed.
    private String accessToken;
    private String profilePicture;
    private TextInputLayout idLayout;
    private TextInputLayout passwordLayout;
    private Button loginButton;
    private TextView signUpButton;
    private ImageButton backButton;
    GoogleSignInClient mGoogleSignInClient;
    ImageButton GSignInButton;

    //The onCreate method which is called on activity start
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        //We initialize the AndroidNetworking library for this activity
        AndroidNetworking.initialize(getApplicationContext());

        //Initializing the variables
        idLayout = findViewById(R.id.outlinedIdField);
        passwordLayout = findViewById(R.id.outlinedPassField);
        loginButton = findViewById(R.id.button);
        signUpButton = findViewById(R.id.textView4);
        backButton = findViewById(R.id.imageButton);
        GSignInButton = findViewById(R.id.signInButton);

        //Here we build the GoogleSignIn requirements to get id token and email
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("689285763404-9ih3lrpb9154mhob4rs8oqbpruvng95s.apps.googleusercontent.com")
                .requestEmail()
                .build();

        mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(this);

        //The Google Sign In button launches the google sign in client view upon click
        GSignInButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent signInIntent = mGoogleSignInClient.getSignInIntent();
                startActivityForResult.launch(signInIntent);
            }
        });

        //The login button clicklistener which calls the validateEmail and validatePassword methods
        //to validate the fields in the frontend and then end it to validate to the backend through
        //android networking
        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(!validateID() | !validatePassword()){
                    return;
                }

                //The AndroidNetworking library send a post request to the api localhost /login endpoint
                //by sending nsuid and password as parameters
                //OnResponse the Homepage is started as an intent
                //We also send the access token to the next activity after receiving it as a response
                //We show a toast depending on the error code received.
                AndroidNetworking.post("http://192.168.0.109:5000/login")
                        .addBodyParameter("nsuid", idLayout.getEditText().getText().toString())
                        .addBodyParameter("password", passwordLayout.getEditText().getText().toString())
                        .setTag("test")
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener() {
                            @Override
                            public void onResponse(JSONObject response) {
                                //We request the access token in a try-catch block as we might not get a response
                                try {
                                    accessToken = response.getString("accessToken");
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                //After retrieving the access token we start the homepage and send the access token
                                Intent intent = new Intent(LoginActivity.this, HomepageActivity.class);
                                intent.putExtra("token",accessToken);
                                startActivity(intent);
                            }
                            @Override
                            public void onError(ANError error) {
                                //It throws the error code 401 if the user exists but password is incorrect.
                                if(error.getErrorCode()==401) {
                                    Toast.makeText(LoginActivity.this, "Password is incorrect!", Toast.LENGTH_SHORT).show();
                                }
                                //It throws the error code 512 if the user exists but is not verified
                                else if(error.getErrorCode()==512){
                                    Toast.makeText(LoginActivity.this, "User is not verified!", Toast.LENGTH_SHORT).show();
                                }
                                //It throws the error code 404 if the post request is not successful.
                                else{
                                    Log.e("Error", String.valueOf(error.getErrorCode()));
                                    Toast.makeText(LoginActivity.this, "An error occurred.Try again!", Toast.LENGTH_SHORT).show();
                                }
                            }
                        });

            }
        });

        //The sign up button click listener redirects the user to the webpage
        signUpButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Uri uri = Uri.parse("http://192.168.0.109:3000/signup");
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                startActivity(intent);
            }
        });

        //The back button closes the activity and brings the user back to the role selection page
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });

    }

    //The method which launches the ui for the google sign up,
    // ActivityLaunchForResult is no longer used as it is deprecated
    ActivityResultLauncher<Intent> startActivityForResult = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            new ActivityResultCallback<ActivityResult>() {
                @Override
                public void onActivityResult(ActivityResult result) {
                    if(result.getResultCode() == Activity.RESULT_OK){
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
                        handleSignInResult(task);
                    }
                }
            }
    );

    //The method which handles the sign in with google result
    private void handleSignInResult(Task<GoogleSignInAccount> completedTask) {
        try {
            GoogleSignInAccount acct = completedTask.getResult(ApiException.class);
            if (acct != null) {

                //Retrieve the details from the google account
                String personName = acct.getDisplayName();
                String personGivenName = acct.getGivenName();
                String personFamilyName = acct.getFamilyName();
                String personEmail = acct.getEmail();
                String personId = acct.getId();
                Uri personPhoto = acct.getPhotoUrl();

                //The google account details are send to the backend to authenticate the account
                AndroidNetworking.post("http://192.168.0.109:5000/GsignupMobile")
                        .addBodyParameter("token",acct.getIdToken())
                        .addBodyParameter("nsuid",acct.getDisplayName().substring((acct.getDisplayName().lastIndexOf(" ") + 1)))
                        .setTag("test1")
                        .setPriority(Priority.HIGH)
                        .build()
                        .getAsJSONObject(new JSONObjectRequestListener(){
                            @Override
                            public void onResponse(JSONObject response) {
                                //We retrieve the access token in a try-catch block in case we don't get a response
                                try {
                                    accessToken = response.getString("accessToken");
                                    Log.e("pp",response.toString());
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
                                //After retrieving the access token we start the homepage and send the access token
                                Intent myIntent = new Intent(LoginActivity.this, HomepageActivity.class);
                                myIntent.putExtra("token",accessToken);
                                startActivity(myIntent);
                                finish();
                            }
                            @Override
                            public void onError(ANError error) {
                                Log.e("google error",error.toString());
                            }
                        });

            }else {
                // Signed out, show unauthenticated toast.
                Toast.makeText(this,"Account does not exist. Please sign up!",Toast.LENGTH_LONG).show();
            }

        } catch (ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            // Please refer to the GoogleSignInStatusCodes class reference for more information.
            Log.d("GOOGLE ERROR", e.getMessage());
        }
    }

    //method to validate the nsu id entered by the user
    //throws an error if field is empty
    //throws an error if length of id is not 10 characters
    private boolean validateID(){
        String emailInput = idLayout.getEditText().getText().toString().trim();

        if(emailInput.isEmpty()){
            idLayout.setError("Field can't be empty!");
            return false;
        }
        else if(!(emailInput.length()==10)){
            idLayout.setError("NSU id must be 10 characters long!");
            return false;
        }
        else{
            idLayout.setError(null);
            return true;
        }
    }

    //method to validate the password
    //throws an error if field is empty
    private boolean validatePassword(){
        String passInput = passwordLayout.getEditText().getText().toString().trim();

        if(passInput.isEmpty()){
            passwordLayout.setError("Field can't be empty!");
            return false;
        }
        else{
            passwordLayout.setError(null);
            return true;
        }
    }

}